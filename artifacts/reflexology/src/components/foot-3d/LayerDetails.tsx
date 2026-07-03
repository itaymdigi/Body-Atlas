import { useMemo } from "react";
import * as THREE from "three";
import { FOOT_CENTER, SCALE } from "./data";

function toLocal(x: number, y: number, z = 0): [number, number, number] {
  return [(x - FOOT_CENTER.x) * SCALE, -(y - FOOT_CENTER.y) * SCALE, z * SCALE];
}

function useTube(points: [number, number, number][], radius: number) {
  return useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
    return new THREE.TubeGeometry(curve, 32, radius, 8, false);
  }, [points, radius]);
}

function NerveBranch({ points }: { points: [number, number, number][] }) {
  const geo = useTube(points, 0.035);
  return (
    <mesh geometry={geo}>
      <meshStandardMaterial color="#2563eb" emissive="#3b82f6" emissiveIntensity={0.4} roughness={0.4} />
    </mesh>
  );
}

export function NerveNetwork() {
  const trunk = useTube([toLocal(120, 30), toLocal(120, 230), toLocal(120, 430)], 0.05);
  const nodes = [55, 100, 148, 200, 255, 315, 380, 425];

  const leftBranch = [toLocal(120, 80), toLocal(80, 145), toLocal(50, 265)];
  const rightBranch = [toLocal(120, 80), toLocal(160, 145), toLocal(190, 265)];

  return (
    <group>
      <mesh geometry={trunk}>
        <meshStandardMaterial color="#1d4ed8" emissive="#3b82f6" emissiveIntensity={0.5} roughness={0.4} />
      </mesh>
      <NerveBranch points={leftBranch} />
      <NerveBranch points={rightBranch} />
      {nodes.map((y, i) => (
        <mesh key={i} position={toLocal(120, y, 3)}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshStandardMaterial color="#60a5fa" emissive="#60a5fa" emissiveIntensity={0.9} />
        </mesh>
      ))}
    </group>
  );
}

export function MuscleFibers() {
  const geometries = useMemo(() => {
    const lines = [-40, -10, 20, 50];
    return lines.map((x) => {
      const curve = new THREE.CatmullRomCurve3(
        [
          toLocal(120 + x, 135, 2),
          toLocal(120 + x * 0.85, 260, 2),
          toLocal(120 + x * 0.6, 390, 2),
        ].map((p) => new THREE.Vector3(...p)),
      );
      return new THREE.TubeGeometry(curve, 32, 0.045, 8, false);
    });
  }, []);

  return (
    <group>
      {geometries.map((geo, i) => (
        <mesh key={i} geometry={geo}>
          <meshStandardMaterial color="#e11d48" emissive="#e11d48" emissiveIntensity={0.25} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}
