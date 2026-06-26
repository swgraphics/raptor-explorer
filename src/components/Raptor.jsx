import { useGLTF, useAnimations } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const animationMap = {
  idle: "Armature|Velociraptor_Idle",
  walk: "Armature|Velociraptor_Run",
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


if (animationState === "walk") {
  nextAction.timeScale = 0.55;
} else if (animationState === "run") {
  nextAction.timeScale = 1.1;
} else {
  nextAction.timeScale = 1;
}

nextAction.enabled = true;
nextAction.setLoop(THREE.LoopRepeat);
nextAction.clampWhenFinished = false;
nextAction.fadeIn(0.2).play();
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