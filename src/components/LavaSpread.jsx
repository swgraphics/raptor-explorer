import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function LavaSpread({ active, radiusRef }) {
  const lava = useRef();

  useFrame((_, delta) => {
    if (!active || !lava.current) return;

    radiusRef.current += delta * 1.6;

    lava.current.scale.x = radiusRef.current;
    lava.current.scale.z = radiusRef.current;
  });

  return (
    <mesh ref={lava} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, -35]}>
      <circleGeometry args={[1, 64]} />
      <meshBasicMaterial color="#ff3b00" transparent opacity={0.85} />
    </mesh>
  );
}