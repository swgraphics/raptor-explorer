import "./App.css";
import { Canvas } from "@react-three/fiber";
import { useState } from "react";

import Ground from "./components/Ground";
import Player from "./components/Player";
import MobileControls from "./components/MobileControls";
import Hud from "./components/Hud";
import TitleScreen from "./components/TitleScreen";
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
  const screenWidth = window.innerWidth;

  if (e.clientX > screenWidth / 2) {
    isDraggingCamera = true;
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
});

window.addEventListener("pointercancel", () => {
  isDraggingCamera = false;
});

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [staminaPercent, setStaminaPercent] = useState(100);
  const [selectedDinosaur, setSelectedDinosaur] = useState("velociraptor");

  return (
    <div className="game-frame">
      <Canvas camera={{ position: [0, 2.5, 5], fov: 55 }}>
        <color attach="background" args={["#87ceeb"]} />

        <ambientLight intensity={2} />
        <directionalLight position={[5, 10, 5]} intensity={3} />

        <Ground />

        {gameStarted && (
          <Player
            setStaminaPercent={setStaminaPercent}
            selectedDinosaur={selectedDinosaur}
          />
        )}
      </Canvas>

      {!gameStarted && (
        <TitleScreen
          onStart={() => setGameStarted(true)}
          selectedDinosaur={selectedDinosaur}
          setSelectedDinosaur={setSelectedDinosaur}
        />
      )}

      {gameStarted && (
        <>
          <Hud staminaPercent={staminaPercent} />

          <button
            style={{
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
            }}
            onClick={() => setGameStarted(false)}
          >
            MENU
          </button>
<div
  style={{
    position: "fixed",
    right: 0,
    top: 0,
    width: "50%",
    height: "100%",
    zIndex: 8,
    touchAction: "none",
  }}
  onPointerDown={(e) => {
    cameraControls.isDragging = true;
    cameraControls.lastX = e.clientX;
  }}
  onPointerMove={(e) => {
    if (!cameraControls.isDragging) return;

    const deltaX = e.clientX - cameraControls.lastX;
    cameraControls.lastX = e.clientX;

    cameraControls.angle -= deltaX * 0.04;
  }}
  onPointerUp={() => {
    cameraControls.isDragging = false;
  }}
  onPointerCancel={() => {
    cameraControls.isDragging = false;
  }}
/>
          <MobileControls />
        </>
      )}
    </div>
  );
}