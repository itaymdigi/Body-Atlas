import { useRef, useState } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import type { Group } from "three";
import { toMeshyWorld, organKey, type OrganDef } from "./data";
import { MESHY_SCALE } from "./MeshyFootModel";

interface HotspotProps {
  def: OrganDef;
  selected: boolean;
  onSelect: (key: string) => void;
}

export function Hotspot({ def, selected, onSelect }: HotspotProps) {
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const position = toMeshyWorld(def.x, def.y, MESHY_SCALE);
  const active = selected || hovered;

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const target = active ? 1.35 : 1;
    const next = THREE.MathUtils.lerp(groupRef.current.scale.x, target, Math.min(1, delta * 10));
    groupRef.current.scale.setScalar(next);
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        onSelect(organKey(def));
      }}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
    >
      <mesh>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial
          color={def.color}
          emissive={def.color}
          emissiveIntensity={active ? 1.1 : 0.5}
        />
      </mesh>
      {active && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.07, 0.09, 24]} />
          <meshBasicMaterial color={def.color} transparent opacity={0.7} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}
