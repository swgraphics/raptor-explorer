import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

const keys = {};
const joystick = {
  x: 0,
  y: 0,
};

window.addEventListener("keydown", (e) => {
  keys[e.key.toLowerCase()] = true;
});

window.addEventListener("keyup", (e) => {
  keys[e.key.toLowerCase()] = false;
});

const obstacles = [
  { name: "Mountain", x: 0, z: -6, width: 4, depth: 4 },
  { name: "Tree", x: 6, z: -2, width: 1.2, depth: 1.2 },
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

  useFrame(({ camera }, delta) => {
    if (!cube.current) return;

    let speed = keys["shift"] ? 0.2 : 0.1;

    let moveX = 0;
    let moveZ = 0;

    if (keys["w"]) moveZ -= 1;
    if (keys["s"]) moveZ += 1;
    if (keys["a"]) moveX -= 1;
    if (keys["d"]) moveX += 1;

    moveX += joystick.x;
    moveZ += joystick.y;

    const length = Math.sqrt(moveX * moveX + moveZ * moveZ);

    if (length > 0) {
  moveX /= length;
  moveZ /= length;

  const nextX = clampToMap(cube.current.position.x + moveX * speed);
  const nextZ = clampToMap(cube.current.position.z + moveZ * speed);

  if (!isCollidingWithObstacle(nextX, nextZ)) {
    cube.current.position.x = nextX;
    cube.current.position.z = nextZ;
  }

  targetRotation.current = Math.atan2(moveX, moveZ);

  while (targetRotation.current - cube.current.rotation.y > Math.PI) {
    targetRotation.current -= Math.PI * 2;
  }

  while (targetRotation.current - cube.current.rotation.y < -Math.PI) {
    targetRotation.current += Math.PI * 2;
  }
}

const angleDifference = Math.atan2(
  Math.sin(targetRotation.current - cube.current.rotation.y),
  Math.cos(targetRotation.current - cube.current.rotation.y)
);

cube.current.rotation.y += angleDifference * 0.18;

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

function MobileControls() {
  const stickRef = useRef();
  const knobRef = useRef();

  const resetJoystick = () => {
    joystick.x = 0;
    joystick.y = 0;

    if (knobRef.current) {
      knobRef.current.style.transform = "translate(-50%, -50%)";
    }
  };

  const moveJoystick = (e) => {
    const touch = e.touches[0];
    const rect = stickRef.current.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let dx = touch.clientX - centerX;
    let dy = touch.clientY - centerY;

    const maxDistance = 40;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > maxDistance) {
      dx = (dx / distance) * maxDistance;
      dy = (dy / distance) * maxDistance;
    }

    joystick.x = dx / maxDistance;
    joystick.y = dy / maxDistance;

    knobRef.current.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
  };

  return (
    <div style={styles.mobileControls}>
      <div
        ref={stickRef}
        style={styles.joystickBase}
        onTouchStart={moveJoystick}
        onTouchMove={moveJoystick}
        onTouchEnd={resetJoystick}
      >
        <div ref={knobRef} style={styles.joystickKnob} />
      </div>

      <button
        style={styles.jumpButton}
        onTouchStart={() => {
          keys[" "] = true;
        }}
        onTouchEnd={() => {
          keys[" "] = false;
        }}
      >
        Jump
      </button>
    </div>
  );
}

const styles = {
  mobileControls: {
    position: "fixed",
    left: 0,
    bottom: 0,
    width: "100%",
    height: "180px",
    pointerEvents: "none",
  },
  joystickBase: {
    position: "absolute",
    left: "40px",
    bottom: "40px",
    width: "110px",
    height: "110px",
    borderRadius: "50%",
    background: "rgba(0, 0, 0, 0.25)",
    pointerEvents: "auto",
    touchAction: "none",
  },
  joystickKnob: {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    background: "rgba(255, 255, 255, 0.75)",
    transform: "translate(-50%, -50%)",
  },
  jumpButton: {
    position: "absolute",
    right: "40px",
    bottom: "55px",
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    border: "none",
    background: "rgba(255, 140, 0, 0.85)",
    color: "white",
    fontSize: "18px",
    fontWeight: "bold",
    pointerEvents: "auto",
    touchAction: "none",
  },
};

export default function App() {
  return (
    <>
      <Canvas camera={{ position: [0, 2.5, 5] }}>
        <color attach="background" args={["#87ceeb"]} />
        <ambientLight intensity={2} />
        <directionalLight position={[5, 10, 5]} intensity={3} />

        <Ground />
        <Player />
      </Canvas>

      <MobileControls />
    </>
  );
}