import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";

const keys = {};

window.addEventListener("keydown", (e) => {
  keys[e.key.toLowerCase()] = true;
});

window.addEventListener("keyup", (e) => {
  keys[e.key.toLowerCase()] = false;
});

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial color="#d2b48c" />
    </mesh>
  );
}

function Player() {
  const cube = useRef();

  useFrame(() => {
    if (!cube.current) return;

    const speed = 0.1;

    if (keys["w"]) cube.current.position.z -= speed;
    if (keys["s"]) cube.current.position.z += speed;
    if (keys["a"]) cube.current.position.x -= speed;
    if (keys["d"]) cube.current.position.x += speed;
  });

  return (
    <mesh ref={cube} position={[0, 0.5, 0]}>
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

      <Player />
    </Canvas>
  );
}