export const defaultSafeZonePosition = {
  x: 20,
  z: -10,
  radius: 5,
};

export default function SafeZone({ safeZone = defaultSafeZonePosition }) {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[safeZone.x, 0.04, safeZone.z]}
    >
      <circleGeometry args={[safeZone.radius, 64]} />
      <meshBasicMaterial color="#37d67a" transparent opacity={0.75} />
    </mesh>
  );
}