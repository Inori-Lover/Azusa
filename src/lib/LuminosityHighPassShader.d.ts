///<reference types="three" />

declare namespace THREE {
  const LuminosityHighPassShader: {
    shaderID: string;
    uniforms: {
      tDiffuse: { type: string; value: null | unknown };
      luminosityThreshold: { type: string; value: number };
      smoothWidth: { type: string; value: number };
      defaultColor: { type: string; value: THREE.Color };
      defaultOpacity: { type: string; value: number };
    };
    vertexShader: string;
    fragmentShader: string;
  };
}
