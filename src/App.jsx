import { Canvas } from "@react-three/fiber";

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial color="#d2b48c" />
    </mesh>
  );
}

function RaptorPlaceholder() {
  return (
    <mesh position={[0, 0.5, 0]}>
      <boxGeometry args={[1, 1, 2]} />
      <meshStandardMaterial color="green" />
    </mesh>
  );
}

export default function App() {
  return (
    <Canvas camera={{ position: [0, 6, 10] }}>
      <color attach="background" args={["#87ceeb"]} />

      <ambientLight intensity={2} />

      <directionalLight
        position={[5, 10, 5]}
        intensity={3}
      />

      <Ground />

      <RaptorPlaceholder />
    </Canvas>
  );
}