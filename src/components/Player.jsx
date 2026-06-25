import Raptor from "./Raptor";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import {
  keys,
  joystick,
  mobileState,
  isCollidingWithObstacle,
  clampToMap,
} from "./gameState";

export default function Player({ setStaminaPercent }) {
  const cube = useRef();
  
  const isMovingRef = useRef(false);
  const isSprintingRef = useRef(false);
  const isJumpingRef = useRef(false);
  
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

    const wantsSprint = keys["shift"] || mobileState.sprintEnabled;
    const canSprint = stamina.current > 0;
    const isSprinting = wantsSprint && canSprint;

    const speed = isSprinting ? 0.2 : 0.1;

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
    isMovingRef.current = length > 0;
    isSprintingRef.current = isSprinting;
    isJumpingRef.current = !isGrounded.current;
    
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
      const canFirstJump = isGrounded.current && landingCooldown.current <= 0;
      const canDoubleJump = !isGrounded.current && jumpsUsed.current === 1;

      if (canFirstJump) {
        velocityY.current = 0.18;
        isGrounded.current = false;
        jumpsUsed.current = 1;
      } else if (canDoubleJump) {
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
  <group ref={cube} position={[0, 0.5, 0]}>
    <Raptor
      isMoving={isMovingRef.current}
      isSprinting={isSprintingRef.current}
      isJumping={isJumpingRef.current}
    />
  </group>
);
}