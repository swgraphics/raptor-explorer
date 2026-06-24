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

const obstacles = [
  {
    name: "Mountain",
    x: 0,
    z: -6,
    width: 4,
    depth: 4,
  },
  {
    name: "Tree",
    x: 6,
    z: -2,
    width: 1.2,
    depth: 1.2,
  },
];

function isCollidingWithObstacle(x, z) {
  const playerRadius = 0.7;

  return obstacles.some((obstacle) => {
    const halfWidth = obstacle.width / 2 + playerRadius;
    const halfDepth = obstacle.depth / 2 + playerRadius;

    return (
      x > obstacle.x - halfWidth &&
      x < obstacle.x + halfWidth &&
      z > obstacle.z - halfDepth &&
      z < obstacle.z + halfDepth
    );
  });
}

function clampToMap(value) {
  const mapLimit = 24;
  return Math.max(-mapLimit, Math.min(mapLimit, value));
}

function Ground() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#d2b48c" />
      </mesh>

      <mesh position={[0, 1.5, -6]}>
        <boxGeometry args={[4, 3, 4]} />
        <meshStandardMaterial color="#8b7355" />
      </mesh>

      <mesh position={[6, 2, -2]}>
        <boxGeometry args={[0.8, 4, 0.8]} />
        <meshStandardMaterial color="#6b3f1d" />
      </mesh>

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

    let nextX = cube.current.position.x;
    let nextZ = cube.current.position.z;

    if (keys["w"]) {
      nextZ -= speed;
      targetRotation.current = Math.PI;
    }

    if (keys["s"]) {
      nextZ += speed;
      targetRotation.current = 0;
    }

    if (keys["a"]) {
      nextX -= speed;
      targetRotation.current = -Math.PI / 2;
    }

    if (keys["d"]) {
      nextX += speed;
      targetRotation.current = Math.PI / 2;
    }

    nextX = clampToMap(nextX);
    nextZ = clampToMap(nextZ);

    if (!isCollidingWithObstacle(nextX, nextZ)) {
      cube.current.position.x = nextX;
      cube.current.position.z = nextZ;
    }

    cube.current.rotation.y = THREE.MathUtils.lerp(
      cube.current.rotation.y,
      targetRotation.current,
      0.15
    );

    if (keys[" "] && isGrounded.current) {
      velocityY.current = 0.18;
      isGrounded.current = false;
    }

    velocityY.current -= 0.007;
    cube.current.position.y += velocityY.current;

    if (cube.current.position.y <= 0.5) {
      cube.current.position.y = 0.5;
      velocityY.current = 0;
      isGrounded.current = true;
    }

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