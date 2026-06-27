const rocks = Array.from({ length: 35 }, (_, i) => ({
  x: Math.sin(i * 12.989) * 42,
  z: Math.cos(i * 78.233) * 42,
  scale: 0.4 + ((i % 5) * 0.18),
}));

const trees = Array.from({ length: 18 }, (_, i) => ({
  x: Math.sin(i * 22.17) * 44,
  z: Math.cos(i * 41.91) * 44,
}));

export default function ScatterObjects() {
  return (
    <>
      {rocks.map((rock, index) => (
        <mesh
          key={`rock-${index}`}
          position={[rock.x, rock.scale / 2, rock.z]}
          scale={[rock.scale, rock.scale, rock.scale]}
        >
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#6b6258" />
        </mesh>
      ))}

      {trees.map((tree, index) => (
        <group key={`tree-${index}`} position={[tree.x, 0, tree.z]}>
          <mesh position={[0, 1.4, 0]}>
            <boxGeometry args={[0.45, 2.8, 0.45]} />
            <meshStandardMaterial color="#5a2f16" />
          </mesh>

          <mesh position={[0, 3.1, 0]}>
            <coneGeometry args={[1.2, 2.4, 6]} />
            <meshStandardMaterial color="#245c28" />
          </mesh>
        </group>
      ))}
    </>
  );
}