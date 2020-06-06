///<reference types="three" />

declare namespace THREE {
  class UnrealBloomPass<
    Resolution = THREE.Vector2,
    Strength = unknown,
    Radius = unknown,
    Threshold = unknown
  > extends THREE.Pass {
    constructor(
      resolution?: { x: number; y: number },
      strength?: Strength,
      radius?: Radius,
      threshold?: Threshold,
    );

    static BlurDirectionX: THREE.Vector2;
    static BlurDirectionY: THREE.Vector2;

    resolution: Resolution;
    strength: Strength;
    radius: Radius;
    threshold: Threshold;
    renderTargetsHorizontal: THREE.WebGLRenderTarget[];
    renderTargetsVertical: THREE.WebGLRenderTarget[];
    nMips: 5;
    renderTargetBright: THREE.WebGLRenderTarget;
    highPassUniforms: unknown;
    materialHighPassFilter: THREE.ShaderMaterial;
    separableBlurMaterials: THREE.ShaderMaterial[];
    compositeMaterial: THREE.ShaderMaterial;
    bloomTintColors: THREE.Vector3[];
    copyUniforms: unknown;
    materialCopy: THREE.ShaderMaterial;

    /** @default true */
    enabled: boolean;
    /** @default false */
    needsSwap: boolean;
    oldClearColor: THREE.Color;
    oldClearAlpha: number;
    camera: THREE.OrthographicCamera;
    scene: THREE.Scene;
    quad: THREE.Mesh;

    dispose(): void;
    setSize(width: number, height: number): void;

    render(
      renderer: THREE.Renderer,
      writeBuffer: unknown,
      readBuffer: unknown,
      delta?: unknown,
      maskActive?: unknown,
    ): void;

    getSeperableBlurMaterial(kernelRadius: unknown): void;
    getCompositeMaterial(nMips: unknown): void;
  }
}
