import Raptor from "./Raptor";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";

import {
  keys,
  joystick,
  mobileState,
  isCollidingWithObstacle,
  clampToMap,
} from "./gameState";

const cameraSettings = {
  velociraptor: { height: 3, distance: 8 },
  triceratops: { height: 4, distance: 11 },
  stegosaurus: { height: 4, distance: 11 },
  parasaurolophus: { height: 4, distance: 11 },
  trex: { height: 5, distance: 15 },
  apatosaurus: { height: 6, distance: 18 },
};

export default function Player({ setStaminaPercent, selectedDinosaur }) {
  const player = useRef();

  const [animationState, setAnimationState] = useState("idle");
  const currentAnimation = useRef("idle");

  const velocityY = useRef(0);
  const isGrounded = useRef(true);
  const targetRotation = useRef(0);

  const stamina = useRef(100);
  const jumpsUsed = useRef(0);
  const landingCooldown = useRef(0);

  const jumpDelay = useRef(0);
  const queuedJumpPower = useRef(0);

  const changeAnimation = (nextAnimation) => {
    if (currentAnimation.current !== nextAnimation) {
      currentAnimation.current = nextAnimation;
      setAnimationState(nextAnimation);
    }
  };

  useFrame(({ camera }, delta) => {
    if (!player.current) return;

    if (landingCooldown.current > 0) {
      landingCooldown.current -= delta;
    }

    let moveX = 0;
    let moveZ = 0;

    if (keys["w"]) moveZ -= 1;
    if (keys["s"]) moveZ += 1;
    if (keys["a"]) moveX -= 1;
    if (keys["d"]) moveX += 1;

    moveX += joystick.x;
    moveZ += joystick.y;

    const inputLength = Math.sqrt(moveX * moveX + moveZ * moveZ);
    const isMoving = inputLength > 0;

    const wantsSprint = keys["shift"] || mobileState.sprintEnabled;
    const canSprint = stamina.current > 0;
    const isSprinting = wantsSprint && canSprint && isMoving;

    const speed = isSprinting ? 0.2 : 0.1;

    if (isSprinting) {
      stamina.current = Math.max(0, stamina.current - 28 * delta);
    } else {
      stamina.current = Math.min(100, stamina.current + 18 * delta);
    }

    setStaminaPercent(Math.round(stamina.current));

    if (isMoving) {
      moveX /= inputLength;
      moveZ /= inputLength;

      const nextX = clampToMap(player.current.position.x + moveX * speed);
      const nextZ = clampToMap(player.current.position.z + moveZ * speed);

      if (!isCollidingWithObstacle(nextX, nextZ)) {
        player.current.position.x = nextX;
        player.current.position.z = nextZ;
      }

      targetRotation.current = Math.atan2(moveX, moveZ);

      while (targetRotation.current - player.current.rotation.y > Math.PI) {
        targetRotation.current -= Math.PI * 2;
      }

      while (targetRotation.current - player.current.rotation.y < -Math.PI) {
        targetRotation.current += Math.PI * 2;
      }
    }

    const angleDifference = Math.atan2(
      Math.sin(targetRotation.current - player.current.rotation.y),
      Math.cos(targetRotation.current - player.current.rotation.y)
    );

    player.current.rotation.y += angleDifference * 0.18;

    if (keys["jumpPressed"]) {
      const canFirstJump = isGrounded.current && landingCooldown.current <= 0;
      const canDoubleJump = !isGrounded.current && jumpsUsed.current === 1;

      if (canFirstJump) {
        changeAnimation("jump");
        jumpDelay.current = 0.25;
        queuedJumpPower.current = 0.18;
        jumpsUsed.current = 1;
      } else if (canDoubleJump) {
        velocityY.current = 0.16;
        jumpsUsed.current = 2;
        changeAnimation("jump");
      }

      keys["jumpPressed"] = false;
    }

    if (jumpDelay.current > 0) {
      jumpDelay.current -= delta;

      if (jumpDelay.current <= 0) {
        velocityY.current = queuedJumpPower.current;
        queuedJumpPower.current = 0;
        isGrounded.current = false;
      }
    }

    velocityY.current -= 0.006;
    player.current.position.y += velocityY.current;

    if (player.current.position.y <= 0.5) {
      if (!isGrounded.current) {
        landingCooldown.current = 0.5;
      }

      player.current.position.y = 0.5;
      velocityY.current = 0;
      isGrounded.current = true;
      jumpsUsed.current = 0;
    }

    if (jumpDelay.current > 0 || !isGrounded.current) {
      changeAnimation("jump");
    } else if (isSprinting) {
      changeAnimation("run");
    } else if (isMoving) {
      changeAnimation("walk");
    } else {
      changeAnimation("idle");
    }

    const cameraConfig =
    cameraSettings[selectedDinosaur] || cameraSettings.velociraptor;

const targetCameraPosition = new THREE.Vector3(
  player.current.position.x,
  player.current.position.y + cameraConfig.height,
  player.current.position.z + cameraConfig.distance
);

    camera.position.lerp(targetCameraPosition, 0.08);
    camera.lookAt(player.current.position);
  });

  return (
    <group ref={player} position={[0, 0.5, 0]}>
      <Raptor
      animationState={animationState}
      selectedDinosaur={selectedDinosaur}
/>
    </group>
  );
}