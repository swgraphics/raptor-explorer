import { useRef, useState } from "react";
import { keys, joystick, mobileState } from "./gameState";

export default function MobileControls() {
  const stickRef = useRef();
  const knobRef = useRef();
  const [sprintOn, setSprintOn] = useState(mobileState.sprintEnabled);

  const resetJoystick = () => {
    joystick.x = 0;
    joystick.y = 0;

    if (knobRef.current) {
      knobRef.current.style.transform = "translate(-50%, -50%)";
    }
  };

  const moveJoystick = (e) => {
    e.preventDefault();

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

  const toggleSprint = (e) => {
    e.preventDefault();

    mobileState.sprintEnabled = !mobileState.sprintEnabled;
    setSprintOn(mobileState.sprintEnabled);
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
        style={{
          ...styles.sprintButton,
          ...(sprintOn ? styles.sprintButtonActive : {}),
        }}
        onTouchStart={toggleSprint}
      >
        Sprint
      </button>

      <button
        style={styles.jumpButton}
        onTouchStart={(e) => {
          e.preventDefault();
          keys["jumpPressed"] = true;
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
    height: "210px",
    pointerEvents: "none",
    zIndex: 10,
  },

  joystickBase: {
    position: "absolute",
    left: "28px",
    bottom: "42px",
    width: "118px",
    height: "118px",
    borderRadius: "50%",
    background: "rgba(0, 0, 0, 0.28)",
    border: "2px solid rgba(255,255,255,0.22)",
    pointerEvents: "auto",
    touchAction: "none",
  },

  joystickKnob: {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: "52px",
    height: "52px",
    borderRadius: "50%",
    background: "rgba(255, 255, 255, 0.78)",
    transform: "translate(-50%, -50%)",
  },

  sprintButton: {
    position: "absolute",
    right: "132px",
    bottom: "70px",
    width: "74px",
    height: "74px",
    borderRadius: "50%",
    border: "2px solid rgba(255,255,255,0.3)",
    background: "rgba(40, 40, 40, 0.72)",
    color: "white",
    fontSize: "13px",
    fontWeight: "bold",
    pointerEvents: "auto",
    touchAction: "none",
  },

  sprintButtonActive: {
    background: "rgba(255, 110, 0, 0.95)",
    boxShadow: "0 0 18px rgba(255, 120, 0, 0.9)",
    transform: "scale(1.05)",
  },

  jumpButton: {
    position: "absolute",
    right: "28px",
    bottom: "48px",
    width: "92px",
    height: "92px",
    borderRadius: "50%",
    border: "2px solid rgba(255,255,255,0.35)",
    background: "rgba(255, 140, 0, 0.9)",
    color: "white",
    fontSize: "18px",
    fontWeight: "bold",
    pointerEvents: "auto",
    touchAction: "none",
  },
};