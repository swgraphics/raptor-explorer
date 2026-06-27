import "./App.css";
import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import VolcanoMarker, { volcanoPosition } from "./components/VolcanoMarker";
import Ground from "./components/Ground";
import Player from "./components/Player";
import MobileControls from "./components/MobileControls";
import Hud from "./components/Hud";
import TitleScreen from "./components/TitleScreen";
import LavaSpread from "./components/LavaSpread";
import SafeZone, { defaultSafeZonePosition } from "./components/SafeZone";
import { keys, cameraControls } from "./components/gameState";

window.addEventListener("keydown", (e) => {
  keys[e.key.toLowerCase()] = true;

  if (e.code === "Space" && !e.repeat) {
    keys["jumpPressed"] = true;
  }
});

window.addEventListener("keyup", (e) => {
  keys[e.key.toLowerCase()] = false;
});

let isDraggingCamera = false;
let lastPointerX = 0;

window.addEventListener("pointerdown", (e) => {
  if (e.clientX > window.innerWidth / 2) {
    isDraggingCamera = true;
    cameraControls.isDragging = true;
    lastPointerX = e.clientX;
  }
});

window.addEventListener("pointermove", (e) => {
  if (!isDraggingCamera) return;

  const deltaX = e.clientX - lastPointerX;
  lastPointerX = e.clientX;

  cameraControls.angle -= deltaX * 0.04;
});

window.addEventListener("pointerup", () => {
  isDraggingCamera = false;
  cameraControls.isDragging = false;
});

window.addEventListener("pointercancel", () => {
  isDraggingCamera = false;
  cameraControls.isDragging = false;
});

export default function App() {
  const [gamePhase, setGamePhase] = useState("menu");
  const [countdown, setCountdown] = useState(3);
  const [staminaPercent, setStaminaPercent] = useState(100);
  const [selectedDinosaur, setSelectedDinosaur] = useState("velociraptor");
  const [playerPosition, setPlayerPosition] = useState({ x: 0, z: 0 });
  const [safeZone, setSafeZone] = useState(defaultSafeZonePosition);
  const [runTime, setRunTime] = useState(0);
  const [bestTime, setBestTime] = useState(() => {
    const saved = localStorage.getItem("bestTime");
    return saved ? Number(saved) : null;
  });

  const lavaRadius = useRef(0);

 const startRun = () => {
  lavaRadius.current = 0;
  setRunTime(0);

  const randomSafeZone = {
    x: Math.random() * 70 - 35,
    z: Math.random() * 60 - 10,
    radius: 5,
  };

  setSafeZone(randomSafeZone);

  setCountdown(3);
  setGamePhase("countdown");
};

  const returnToMenu = () => {
    lavaRadius.current = 0;
    setGamePhase("menu");
  };

  useEffect(() => {
    if (gamePhase !== "countdown") return;

    if (countdown <= 0) {
      setGamePhase("playing");
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((current) => current - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [gamePhase, countdown]);

  useEffect(() => {
    if (gamePhase !== "playing") return;

    const timer = setInterval(() => {
      setRunTime((current) => current + 0.1);
    }, 100);

    return () => clearInterval(timer);
  }, [gamePhase]);

  useEffect(() => {
    if (gamePhase !== "playing") return;

    const lavaSource = volcanoPosition;
    const dx = playerPosition.x - lavaSource.x;
    const dz = playerPosition.z - lavaSource.z;
    const distanceToLavaSource = Math.sqrt(dx * dx + dz * dz);

    if (distanceToLavaSource < lavaRadius.current) {
      setGamePhase("gameover");
    }
  }, [playerPosition, gamePhase]);

  useEffect(() => {
    if (gamePhase !== "playing") return;

const dx = playerPosition.x - safeZone.x;
const dz = playerPosition.z - safeZone.z;
const distanceToSafeZone = Math.sqrt(dx * dx + dz * dz);

if (distanceToSafeZone <= safeZone.radius + 1) {
      const finalTime = Number(runTime.toFixed(1));

      if (bestTime === null || finalTime < bestTime) {
        setBestTime(finalTime);
        localStorage.setItem("bestTime", String(finalTime));
      }

      setGamePhase("victory");
    }
  }, [playerPosition, gamePhase, runTime, bestTime, safeZone]);

  const gameActive = gamePhase !== "menu";

  return (
    <div className="game-frame">
      <Canvas camera={{ position: [0, 2.5, 5], fov: 55 }}>
        <color attach="background" args={["#87ceeb"]} />
        <fog attach="fog" args={["#c98b5a", 18, 75]} />
        <ambientLight intensity={2} />
        <directionalLight position={[5, 10, 5]} intensity={3} />
        {gameActive && <VolcanoMarker />}
        <Ground />

        {gameActive && (
          <>
            <SafeZone safeZone={safeZone} />
            <LavaSpread
              active={gamePhase === "playing"}
              radiusRef={lavaRadius}
            />

            <Player
              setStaminaPercent={setStaminaPercent}
              selectedDinosaur={selectedDinosaur}
              setPlayerPosition={setPlayerPosition}
            />
          </>
        )}
      </Canvas>

      {gamePhase === "menu" && (
        <TitleScreen
          onStart={startRun}
          selectedDinosaur={selectedDinosaur}
          setSelectedDinosaur={setSelectedDinosaur}
        />
      )}

      {gamePhase === "countdown" && (
        <div style={styles.centerMessage}>
          ERUPTION IN
          <br />
          {countdown}
        </div>
      )}

      {gamePhase === "gameover" && (
        <div style={styles.centerMessage}>
          GAME OVER
          <button style={styles.restartButton} onClick={returnToMenu}>
            RETURN TO MENU
          </button>
        </div>
      )}

      {gamePhase === "victory" && (
        <div style={styles.centerMessage}>
          YOU ESCAPED!
          <div style={styles.timeText}>Time: {runTime.toFixed(1)}s</div>
          <div style={styles.timeText}>
            Best: {bestTime === null ? "--" : `${bestTime.toFixed(1)}s`}
          </div>
          <button style={styles.restartButton} onClick={returnToMenu}>
            RETURN TO MENU
          </button>
        </div>
      )}

      {gameActive && (
        <>
          <Hud staminaPercent={staminaPercent} />

          <div style={styles.timerText}>Time: {runTime.toFixed(1)}s</div>

          <button style={styles.menuButton} onClick={returnToMenu}>
            MENU
          </button>

          <MobileControls />
        </>
      )}
    </div>
  );
}

const styles = {
  centerMessage: {
    position: "fixed",
    inset: 0,
    zIndex: 80,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "46px",
    fontWeight: "bold",
    textAlign: "center",
    textShadow: "0 4px 18px rgba(0,0,0,0.8)",
    pointerEvents: "none",
  },

  restartButton: {
    marginTop: "24px",
    padding: "14px 24px",
    borderRadius: "999px",
    border: "none",
    background: "white",
    color: "#af002d",
    fontSize: "16px",
    fontWeight: "bold",
    pointerEvents: "auto",
  },

  menuButton: {
    position: "fixed",
    top: "20px",
    right: "20px",
    zIndex: 50,
    padding: "10px 16px",
    borderRadius: "999px",
    border: "none",
    background: "rgba(0,0,0,0.55)",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },

  timerText: {
    position: "fixed",
    top: "58px",
    left: "20px",
    zIndex: 50,
    color: "white",
    fontSize: "18px",
    fontWeight: "bold",
    textShadow: "0 3px 10px rgba(0,0,0,0.8)",
  },

  timeText: {
    fontSize: "22px",
    marginTop: "10px",
  },
};