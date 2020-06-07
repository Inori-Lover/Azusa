import * as THREE from 'three';

import { CopyShader } from 'three/examples/jsm/shaders/CopyShader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';

import { randomRange } from './util/randomRange';
import { Triangle } from './Triangle';
import { range } from './util/range';
import { node } from './node';
import { Audio, loadOption as musicOption } from './audio';

/** @todo https://github.com/mrdoob/three.js/issues/14104 */
import { UnrealBloomPass } from './lib/UnrealBloomPass';

interface AzusaOption {
  view: HTMLCanvasElement;
  width: number;
  height: number;
  subdivisionSize: number;
  cutEnd: number;
  cutFront: number;
  music: musicOption;
}
export interface ExportedAzusaOption extends Partial<AzusaOption> {
  view: HTMLCanvasElement;
  music: musicOption;
}

class Line extends THREE.Line {
  constructor(vertices: THREE.Vector2[], lineMaterial: THREE.LineBasicMaterial) {
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute(
      'position',
      Line.creatBufferAttribute(vertices).setUsage(THREE.DynamicDrawUsage),
    );

    super(lineGeometry, lineMaterial);
  }

  static creatBufferAttribute(vertices: THREE.Vector2[]) {
    const res: number[] = [];
    vertices = vertices.concat(vertices[0]);
    vertices.forEach((value) => {
      res.push(value.x, value.y, 0);
    });
    return new THREE.BufferAttribute(new Float32Array(res), 3);
  }
}

export class Azusa {
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private composer: EffectComposer;
  private bloomPass: UnrealBloomPass;
  private clock: THREE.Clock = new THREE.Clock();
  private lines: THREE.Line[];
  private lineA: THREE.Line;
  private lineB: THREE.Line;
  private TriangleGroup: THREE.Group;
  private lineGroup: THREE.Group;
  private material = new THREE.MeshBasicMaterial({ color: 0x03a9f4 });
  private lineMaterial = new THREE.LineBasicMaterial({ color: 0x03a9f4 });

  private audio: Audio;
  private nodes: node[];
  private Triangles: Triangle[] = [];
  private option: AzusaOption;

  constructor(_option: ExportedAzusaOption) {
    const option: AzusaOption = Object.assign(
      {
        width: window.innerWidth,
        height: window.innerHeight,
        subdivisionSize: 1024,
        cutFront: 0,
        cutEnd: 0,
      },
      _option,
    );

    const { view, width, height, subdivisionSize, cutFront, cutEnd } = option;

    const renderer = new THREE.WebGLRenderer({
      canvas: view,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 500);
    camera.position.set(0, 0, 100);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const composer = new EffectComposer(renderer);
    composer.setSize(width, height);
    const renderScene = new RenderPass(scene, camera);
    composer.addPass(renderScene);
    this.bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 1.5, 0.2, 0);
    composer.addPass(this.bloomPass);
    const copyShader = new ShaderPass(CopyShader);
    copyShader.renderToScreen = true;
    composer.addPass(copyShader);

    const audio = new Audio({ fftsize: subdivisionSize });
    this.loadAudio(camera, audio);

    const frequencyBinCount = audio.frequencyBinCount;

    const nodeCount = frequencyBinCount - cutEnd - cutFront;
    const nodes = range(0, nodeCount).map((item) => {
      return new node(20, ((item / nodeCount) * 360 + 45) % 360, new THREE.Vector2(0, 0));
    });

    const lineGroup = new THREE.Group();
    const { lineA, lineB, lines } = this.loadLine(nodes);
    lineGroup.add(lineA);
    lineGroup.add(lineB);
    lines.forEach((line) => lineGroup.add(line));
    scene.add(lineGroup);

    const { TriangleGroup } = this.loadTriangle();
    scene.add(TriangleGroup);

    this.audio = audio;

    this.renderer = renderer;
    this.composer = composer;
    this.camera = camera;
    this.nodes = nodes;
    this.lineA = lineA;
    this.lineB = lineB;
    this.lines = lines;
    this.TriangleGroup = TriangleGroup;
    this.lineGroup = lineGroup;

    this.option = option;

    this.loadMusic();
    this.render();
    this.resize(width, height);
  }

  private loadLine = (nodes: node[]) => {
    const lineMaterial = this.lineMaterial;
    const lineA = new Line(
      nodes.map((node) => node['positionA']),
      lineMaterial,
    );
    const lineB = new Line(
      nodes.map((node) => node['positionB']),
      lineMaterial,
    );
    const lines: Line[] = range(0, nodes.length).map((item) => {
      return new Line([nodes[item].positionA, nodes[item].positionB], lineMaterial);
    });

    return { lineA, lineB, lines };
  };

  private loadAudio = (camera: THREE.PerspectiveCamera, audio: Audio) => {
    camera.add(audio.listener);
  };

  private loadMusic = () => {
    this.option.music && this.audio.load(this.option.music);
  };

  private loadTriangle = () => {
    const TriangleGroup = new THREE.Group();
    setInterval(() => requestAnimationFrame(this.addTriangle), 500);
    return { TriangleGroup };
  };

  private addTriangle = () => {
    const material = this.material;
    const lineMaterial = this.lineMaterial;
    const triangle = this.makeTriangle(material, lineMaterial, (t) => {
      this.Triangles = this.Triangles.filter((triangle) => {
        return triangle !== t;
      });
      this.TriangleGroup.remove(t.group);
    });
    this.TriangleGroup.add(triangle.group);
    this.Triangles.push(triangle);
  };

  private makeTriangle = (
    material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ color: 0x03a9f4 }),
    lineMaterial: THREE.LineBasicMaterial = new THREE.LineBasicMaterial({ color: 0x03a9f4 }),
    cb: (t: Triangle) => void,
  ) => {
    const triangle = new Triangle(
      2,
      new THREE.Vector3(0, 0, 0),
      Math.random() * 360,
      randomRange(5, 1),
      randomRange(0.1, 0.02),
      material,
      lineMaterial,
      {
        startShow: 15,
        endShow: 30,
        startHide: 60,
        endHide: 70,
      },
      cb,
    );
    return triangle;
  };

  private updateGeometries = (scale: number) => {
    this.lineGroup.scale.set(scale, scale, scale);
    const geometryA = this.lineA.geometry as THREE.BufferGeometry;
    const AttributeA = geometryA.getAttribute('position') as THREE.BufferAttribute;
    const geometryB = this.lineB.geometry as THREE.BufferGeometry;
    const AttributeB = geometryB.getAttribute('position') as THREE.BufferAttribute;

    const positions = this.nodes.map((value) => {
      return [value.positionA, value.positionB];
    });
    positions.forEach((position, index) => {
      AttributeA.set([position[0].x, position[0].y], index * 3);
      AttributeB.set([position[1].x, position[1].y], index * 3);
      const geometry = this.lines[index].geometry as THREE.BufferGeometry;
      const Attribute = geometry.getAttribute('position') as THREE.BufferAttribute;
      Attribute.set([position[0].x, position[0].y, 0, position[1].x, position[1].y, 0], 0);
      Attribute.needsUpdate = true;
    });
    AttributeA.set([AttributeA.array[0], AttributeA.array[1]], positions.length * 3);
    AttributeB.set([AttributeB.array[0], AttributeB.array[1]], positions.length * 3);
    AttributeA.needsUpdate = true;
    AttributeB.needsUpdate = true;
  };

  private render = () => {
    this.composer.render();
    let audioDate = this.audio.getFrequencyData();
    const Delta = this.clock.getDelta();
    const cutAudioDate = audioDate.slice(
      this.option.cutFront,
      audioDate.length - this.option.cutEnd,
    );
    this.nodes.forEach((node, index, array) => {
      node.strength = cutAudioDate[index % array.length] * 0.1;
      node.transition(Delta);
    });

    this.updateGeometries(1 + audioDate[Math.ceil(audioDate.length * 0.05)] / 1000);
    this.Triangles.forEach((triangle) => triangle.transition(Delta));

    requestAnimationFrame(this.render);
  };

  public resize = (width: number, height: number) => {
    this.camera.aspect = width / height;
    if (width <= 425) {
      this.camera.fov = 70;
    } else {
      this.camera.fov = 45;
    }
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.composer.setSize(width, height);
  };
}

export default Azusa;
