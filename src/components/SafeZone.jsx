export const safeZonePosition = {
  x: 20,
  z: -10,
  radius: 5,
};

export default function SafeZone() {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[safeZonePosition.x, 0.04, safeZonePosition.z]}
    >
      <circleGeometry args={[safeZonePosition.radius, 64]} />
      <meshBasicMaterial color="#37d67a" transparent opacity={0.75} />
    </mesh>
  );
}