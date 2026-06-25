import { useGLTF, useAnimations } from "@react-three/drei";
import { useEffect, useRef } from "react";

const animationMap = {
  idle: "Armature|Velociraptor_Idle",
  walk: "Armature|Velociraptor_Walk",
  run: "Armature|Velociraptor_Run",
  jump: "Armature|Velociraptor_Jump",
};

export default function Raptor({ animationState }) {
  const raptor = useRef();

  const { scene, animations } = useGLTF("/models/raptor.glb");
  const { actions } = useAnimations(animations, raptor);

  useEffect(() => {
    const animationName = animationMap[animationState] || animationMap.idle;
    const nextAction = actions[animationName];

    if (!nextAction) return;

    Object.values(actions).forEach((action) => {
      if (action !== nextAction) {
        action.fadeOut(0.2);
      }
    });

    nextAction.reset().fadeIn(0.2).play();
  }, [actions, animationState]);

  return (
    <group ref={raptor}>
      <primitive
        object={scene}
        scale={0.5}
        position={[0, -0.5, 0]}
        rotation={[0, 0, 0]}
      />
    </group>
  );
}