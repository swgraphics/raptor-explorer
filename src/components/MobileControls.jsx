import { useRef } from "react";
import { keys, joystick, mobileState } from "./gameState";

export default function MobileControls() {
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
          mobileState.sprintEnabled = !mobileState.sprintEnabled;
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

const styles = {
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