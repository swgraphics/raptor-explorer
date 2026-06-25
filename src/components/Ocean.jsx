import * as THREE from "three";

export default function Ocean() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]}>
      <planeGeometry args={[160, 160, 80, 80]} />

      <shaderMaterial
        transparent
        uniforms={{
          uColorA: { value: new THREE.Color("#ff3b00") },
          uColorB: { value: new THREE.Color("#ffd000") },
        }}
        vertexShader={`
          varying vec2 vUv;

          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 uColorA;
          uniform vec3 uColorB;
          varying vec2 vUv;

          void main() {
            float stripe = sin((vUv.x + vUv.y) * 80.0);
            float mixAmount = smoothstep(-0.4, 0.8, stripe);

            vec3 color = mix(uColorA, uColorB, mixAmount);

            gl_FragColor = vec4(color, 0.95);
          }
        `}
      />
    </mesh>
  );
}