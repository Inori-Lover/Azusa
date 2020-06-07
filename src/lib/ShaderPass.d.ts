///<reference types="three" />

declare namespace THREE {
  class ShaderPass extends THREE.Pass {
    constructor(shader: THREE.ShaderMaterial | { uniforms: unknown }, textureID?: string);

    render(
      renderer: THREE.WebGLRenderer,
      writeBuffer: unknown,
      readBuffer: unknown,
      delta?: unknown,
      maskActive?: unknown,
    ): void;
  }
}
