///<reference types="three" />

declare namespace THREE {
  const CopyShader: {
    uniforms: {
      tDiffuse: { value: any };
      opacity: { value: number };
    };
    vertexShader: string;
    fragmentShader: string;
  };
}
