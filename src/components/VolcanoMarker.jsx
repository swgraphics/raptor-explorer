export const volcanoPosition = {
  x: 0,
  z: -35,
  radius: 9,
};

export default function VolcanoMarker() {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[volcanoPosition.x, 0.05, volcanoPosition.z]}
    >
      <circleGeometry args={[volcanoPosition.radius, 64]} />
      <meshBasicMaterial color="#2b140c" />
    </mesh>
  );
}