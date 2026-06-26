import { useGLTF, useAnimations } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const dinosaurNames = {
  velociraptor: "Velociraptor",
  trex: "TRex",
  triceratops: "Triceratops",
  stegosaurus: "Stegosaurus",
  parasaurolophus: "Parasaurolophus",
  apatosaurus: "Apatosaurus",
};

function getAnimationMap(selectedDinosaur) {
  const name = dinosaurNames[selectedDinosaur];

  return {
    idle: `Armature|${name}_Idle`,
    walk:
      selectedDinosaur === "velociraptor"
        ? `Armature|${name}_Run`
        : `Armature|${name}_Walk`,
    run: `Armature|${name}_Run`,
    jump: `Armature|${name}_Jump`,
  };
}

export default function Raptor({ animationState, selectedDinosaur }) {
  const raptor = useRef();

  const { scene, animations } = useGLTF(`/models/${selectedDinosaur}.glb`);
  const { actions } = useAnimations(animations, raptor);

  useEffect(() => {
    const animationMap = getAnimationMap(selectedDinosaur);
    const animationName = animationMap[animationState] || animationMap.idle;
    const nextAction = actions[animationName];

    if (!nextAction) {
      console.log("Missing animation:", animationName);
      console.log("Available animations:", Object.keys(actions));
      return;
    }

    Object.values(actions).forEach((action) => {
      if (action !== nextAction) {
        action.fadeOut(0.2);
      }
    });

    if (animationState === "walk") {
      nextAction.timeScale = selectedDinosaur === "velociraptor" ? 0.55 : 1;
    } else if (animationState === "run") {
      nextAction.timeScale = 1.1;
    } else {
      nextAction.timeScale = 1;
    }

    nextAction.enabled = true;
    nextAction.setLoop(THREE.LoopRepeat);
    nextAction.clampWhenFinished = false;
    nextAction.fadeIn(0.2).play();
  }, [actions, animationState, selectedDinosaur]);

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