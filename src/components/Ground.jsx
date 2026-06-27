import Ocean from "./Ocean";
import ScatterObjects from "./ScatterObjects";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
export default function Ground() {
  const groundTexture = useTexture("/textures/rocky-ground.png");

groundTexture.wrapS = THREE.RepeatWrapping;
groundTexture.wrapT = THREE.RepeatWrapping;
groundTexture.repeat.set(25, 25);

  return (
    <>
      <ScatterObjects />
      <Ocean />

      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial map={groundTexture} />
      </mesh>
    </>
  );
}