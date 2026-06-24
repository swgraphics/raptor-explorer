import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

const keys = {};

window.addEventListener("keydown", (e) => {
  keys[e.key.toLowerCase()] = true;
});

window.addEventListener("keyup", (e) => {
  keys[e.key.toLowerCase()] = false;
});

function Ground() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#d2b48c" />
      </mesh>

      {/* Mountain test obstacle */}
      <mesh position={[0, 1.5, -6]}>
        <boxGeometry args={[4, 3, 4]} />
        <meshStandardMaterial color="#8b7355" />
      </mesh>

      {/* Tree trunk test obstacle */}
      <mesh position={[6, 2, -2]}>
        <boxGeometry args={[0.8, 4, 0.8]} />
        <meshStandardMaterial color="#6b3f1d" />
      </mesh>

      {/* Tree top test obstacle */}
      <mesh position={[6, 4.5, -2]}>
        <boxGeometry args={[3, 2, 3]} />
        <meshStandardMaterial color="#2f7d32" />
      </mesh>
    </>
  );
}

function Player() {
  const cube = useRef();

  const velocityY = useRef(0);
  const isGrounded = useRef(true);
  const targetRotation = useRef(0);

  useFrame(({ camera }) => {
    if (!cube.current) return;

    let speed = 0.1;

    if (keys["shift"]) {
      speed = 0.2;
    }

    if (keys["w"]) {
      cube.current.position.z -= speed;
      targetRotation.current = Math.PI;
    }

    if (keys["s"]) {
      cube.current.position.z += speed;
      targetRotation.current = 0;
    }

    if (keys["a"]) {
      cube.current.position.x -= speed;
      targetRotation.current = -Math.PI / 2;
    }

    if (keys["d"]) {
      cube.current.position.x += speed;
      targetRotation.current = Math.PI / 2;
    }

    // Smooth rotation
    cube.current.rotation.y = THREE.MathUtils.lerp(
      cube.current.rotation.y,
      targetRotation.current,
      0.15
    );

    // Jump
    if (keys[" "] && isGrounded.current) {
      velocityY.current = 0.18;
      isGrounded.current = false;
    }

    // Slightly slower falling gravity
    velocityY.current -= 0.007;
    cube.current.position.y += velocityY.current;

    // Ground collision
    if (cube.current.position.y <= 0.5) {
      cube.current.position.y = 0.5;
      velocityY.current = 0;
      isGrounded.current = true;
    }

    // Smooth camera follow
    const targetCameraPosition = new THREE.Vector3(
      cube.current.position.x,
      cube.current.position.y + 2,
      cube.current.position.z + 5
    );

    camera.position.lerp(targetCameraPosition, 0.08);
    camera.lookAt(cube.current.position);
  });

  return (
    <mesh ref={cube} position={[0, 0.5, 0]}>
      <boxGeometry args={[1, 1, 2]} />

      <meshBasicMaterial attach="material-0" color="green" />
      <meshBasicMaterial attach="material-1" color="green" />
      <meshBasicMaterial attach="material-2" color="green" />
      <meshBasicMaterial attach="material-3" color="green" />
      <meshBasicMaterial attach="material-4" color="orange" />
      <meshBasicMaterial attach="material-5" color="green" />
    </mesh>
  );
}

export default function App() {
  return (
    <Canvas camera={{ position: [0, 2.5, 5] }}>
      <color attach="background" args={["#87ceeb"]} />

      <ambientLight intensity={2} />
      <directionalLight position={[5, 10, 5]} intensity={3} />

      <Ground />
      <Player />
    </Canvas>
  );
}