///<reference types="three" />

declare namespace THREE {
  class EffectComposer {
    constructor(renderer: THREE.WebGLRenderer, renderTarget?: THREE.WebGLRenderTarget);

    swapBuffers(): void;
    addPass(pass: unknown): void;
    insertPass(pass: unknown, index: unknown): void;
    render(delta?: unknown): void;
    reset(renderTarget: unknown): void;
    setSize(width: unknown, height: unknown): void;
  }

  class Pass {
    constructor();

    /** @default true */
    enabled: boolean;
    /** @default true */
    needsSwap: boolean;
    /** @default false */
    clear: boolean;
    /** @default false */
    renderToScreen: boolean;

    /** empty func */
    // setSize(): void;
    /** error method */
    // render(): void;
  }
}
