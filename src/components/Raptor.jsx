import { useGLTF, useAnimations } from "@react-three/drei";
import { useEffect } from "react";

export default function Raptor({ isMoving, isSprinting, isJumping }) {
  const { scene, animations } = useGLTF("/models/raptor.glb");
  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    console.log("Raptor animations:", Object.keys(actions));
  }, [actions]);

  useEffect(() => {
    const animationName = isJumping
      ? "Jump"
      : isMoving
      ? isSprinting
        ? "Run"
        : "Walk"
      : "Idle";

    const action = actions[animationName];

    if (!action) return;

    Object.values(actions).forEach((a) => a.stop());

    action.reset().fadeIn(0.2).play();

    return () => {
      action.fadeOut(0.2);
    };
  }, [actions, isMoving, isSprinting, isJumping]);

  return (
    <primitive
      object={scene}
      scale={0.5}
      position={[0, -0.5, 0]}
      rotation={[0, 0, 0]}
    />
  );
}