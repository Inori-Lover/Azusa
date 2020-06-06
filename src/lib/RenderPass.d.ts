///<reference types="three" />

declare namespace THREE {
  class RenderPass {
    constructor(
      scene: THREE.Scene,
      camera: THREE.Camera,
      overrideMaterial: THREE.Material | null,
      clearColor?: THREE.Color | null,
      clearAlpha?: THREE.Color | null,
    );

    render(
      renderer: THREE.Renderer,
      writeBuffer: unknown,
      readBuffer: unknown,
      delta?: unknown,
      maskActive?: unknown,
    ): void;
  }
}
