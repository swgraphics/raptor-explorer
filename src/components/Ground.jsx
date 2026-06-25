import Ocean from "./Ocean";

export default function Ground() {
  return (
    <>
      <Ocean />

      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#d2b48c" />
      </mesh>

      <mesh position={[0, 1.5, -6]}>
        <boxGeometry args={[4, 3, 4]} />
        <meshStandardMaterial color="#8b7355" />
      </mesh>

      <mesh position={[6, 2, -2]}>
        <boxGeometry args={[0.8, 4, 0.8]} />
        <meshStandardMaterial color="#6b3f1d" />
      </mesh>

      <mesh position={[6, 4.5, -2]}>
        <boxGeometry args={[3, 2, 3]} />
        <meshStandardMaterial color="#2f7d32" />
      </mesh>
    </>
  );
}