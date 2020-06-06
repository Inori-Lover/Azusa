///<reference types="three" />

declare namespace THREE {
  class ShaderPass {
    constructor(shader: THREE.ShaderMaterial | { uniforms: unknown }, textureID?: string);

    render(
      renderer: THREE.Renderer,
      writeBuffer: unknown,
      readBuffer: unknown,
      delta?: unknown,
      maskActive?: unknown,
    ): void;
  }
}
