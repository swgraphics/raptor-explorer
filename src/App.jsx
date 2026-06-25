import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";

const keys = {};
const joystick = { x: 0, y: 0 };
let sprintEnabled = false;

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

function Ocean() {
  const materialRef = useRef();

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]}>
      <planeGeometry args={[160, 160, 80, 80]} />
      <shaderMaterial
        ref={materialRef}
        transparent
        uniforms={{
          uTime: { value: 0 },
          uColorA: { value: new THREE.Color("#2fb8ff") },
          uColorB: { value: new THREE.Color("#7be7ff") },
        }}
        vertexShader={`
          uniform float uTime;
          varying vec2 vUv;

          void main() {
            vUv = uv;

            vec3 pos = position;

            float waveA = sin(pos.x * 0.18 + uTime * 1.4) * 0.12;
            float waveB = cos(pos.y * 0.22 + uTime * 1.1) * 0.08;

            pos.z += waveA + waveB;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 uColorA;
          uniform vec3 uColorB;
          uniform float uTime;
          varying vec2 vUv;

          void main() {
            float stripe = sin((vUv.x + vUv.y) * 60.0 + uTime * 2.0);
            float mixAmount = smoothstep(-0.4, 0.8, stripe);

            vec3 color = mix(uColorA, uColorB, mixAmount);

            gl_FragColor = vec4(color, 0.85);
          }
        `}
      />
    </mesh>
  );
}

function Ground() {
  return (
    <>
      <Ocean />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
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

function Player({ setStaminaPercent }) {
  const cube = useRef();

  const velocityY = useRef(0);
  const isGrounded = useRef(true);
  const targetRotation = useRef(0);

  const stamina = useRef(100);
  const jumpsUsed = useRef(0);
  const landingCooldown = useRef(0);

  useFrame(({ camera }, delta) => {
    if (!cube.current) return;

    if (landingCooldown.current > 0) {
      landingCooldown.current -= delta;
    }

    const wantsSprint = keys["shift"] || sprintEnabled;
    const canSprint = stamina.current > 0;
    const isSprinting = wantsSprint && canSprint;

    let speed = isSprinting ? 0.2 : 0.1;

    if (isSprinting) {
      stamina.current = Math.max(0, stamina.current - 28 * delta);
    } else {
      stamina.current = Math.min(100, stamina.current + 18 * delta);
    }

    setStaminaPercent(Math.round(stamina.current));

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

    if (keys["jumpPressed"]) {
      if (isGrounded.current && landingCooldown.current <= 0) {
        velocityY.current = 0.18;
        isGrounded.current = false;
        jumpsUsed.current = 1;
      } else if (!isGrounded.current && jumpsUsed.current < 2) {
        velocityY.current = 0.16;
        jumpsUsed.current = 2;
      }

      keys["jumpPressed"] = false;
    }

    velocityY.current -= 0.006;
    cube.current.position.y += velocityY.current;

    if (cube.current.position.y <= 0.5) {
      if (!isGrounded.current) {
        landingCooldown.current = 0.5;
      }

      cube.current.position.y = 0.5;
      velocityY.current = 0;
      isGrounded.current = true;
      jumpsUsed.current = 0;
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

function Hud({ staminaPercent }) {
  return (
    <div style={styles.hud}>
      <div style={styles.staminaLabel}>Stamina</div>
      <div style={styles.staminaOuter}>
        <div
          style={{
            ...styles.staminaInner,
            width: `${staminaPercent}%`,
          }}
        />
      </div>
    </div>
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
        style={styles.sprintButton}
        onClick={() => {
          sprintEnabled = !sprintEnabled;
        }}
      >
        Sprint
      </button>

      <button
        style={styles.jumpButton}
        onTouchStart={() => {
          keys["jumpPressed"] = true;
        }}
        onClick={() => {
          keys["jumpPressed"] = true;
        }}
      >
        Jump
      </button>
    </div>
  );
}

function TitleScreen({ onStart }) {
  return (
    <div style={styles.titleScreen}>
      <h1 style={styles.titleText}>THE WORLD IS LAVA</h1>
      <button style={styles.startButton} onClick={onStart}>
        START GAME
      </button>
    </div>
  );
}

const styles = {
  titleScreen: {
    position: "fixed",
    inset: 0,
    zIndex: 20,
    background:
      "linear-gradient(180deg, #ff7a18 0%, #af002d 55%, #240000 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontFamily: "Arial, sans-serif",
  },
  titleText: {
    fontSize: "52px",
    letterSpacing: "4px",
    textAlign: "center",
    marginBottom: "30px",
    textShadow: "0 6px 18px rgba(0,0,0,0.45)",
  },
  startButton: {
    padding: "18px 34px",
    borderRadius: "999px",
    border: "none",
    background: "white",
    color: "#af002d",
    fontSize: "20px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  hud: {
    position: "fixed",
    top: "20px",
    left: "20px",
    zIndex: 10,
    width: "180px",
    fontFamily: "Arial, sans-serif",
    color: "white",
    pointerEvents: "none",
  },
  staminaLabel: {
    fontSize: "14px",
    marginBottom: "6px",
    textShadow: "0 2px 4px rgba(0,0,0,0.5)",
  },
  staminaOuter: {
    width: "100%",
    height: "14px",
    borderRadius: "999px",
    background: "rgba(0,0,0,0.35)",
    overflow: "hidden",
  },
  staminaInner: {
    height: "100%",
    background: "linear-gradient(90deg, #37d67a, #fff176)",
    borderRadius: "999px",
    transition: "width 0.12s linear",
  },
  mobileControls: {
    position: "fixed",
    left: 0,
    bottom: 0,
    width: "100%",
    height: "180px",
    pointerEvents: "none",
    zIndex: 10,
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
  sprintButton: {
    position: "absolute",
    right: "150px",
    bottom: "75px",
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    border: "none",
    background: "rgba(50, 150, 255, 0.85)",
    color: "white",
    fontSize: "14px",
    fontWeight: "bold",
    pointerEvents: "auto",
    touchAction: "none",
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
  const [gameStarted, setGameStarted] = useState(false);
  const [staminaPercent, setStaminaPercent] = useState(100);

  return (
    <>
      <Canvas camera={{ position: [0, 2.5, 5] }}>
        <color attach="background" args={["#87ceeb"]} />
        <ambientLight intensity={2} />
        <directionalLight position={[5, 10, 5]} intensity={3} />

        <Ground />
        {gameStarted && <Player setStaminaPercent={setStaminaPercent} />}
      </Canvas>

      {!gameStarted && <TitleScreen onStart={() => setGameStarted(true)} />}

      {gameStarted && (
        <>
          <Hud staminaPercent={staminaPercent} />
          <MobileControls />
        </>
      )}
    </>
  );
}