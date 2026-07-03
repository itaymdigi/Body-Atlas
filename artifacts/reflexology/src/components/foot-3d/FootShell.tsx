import { useMemo } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { FOOT_PATH, FOOT_CENTER, SCALE, SHELL_DEPTH } from "./data";

export type FootLayer = "organs" | "nerve" | "muscle" | "skin";

const LAYER_MATERIAL: Record<FootLayer, { color: string; opacity: number; roughness: number; transmission: number }> = {
  organs: { color: "#5eead4", opacity: 0.18, roughness: 0.05, transmission: 0.9 },
  nerve: { color: "#93c5fd", opacity: 0.35, roughness: 0.2, transmission: 0.6 },
  muscle: { color: "#f87171", opacity: 0.4, roughness: 0.35, transmission: 0.35 },
  skin: { color: "#e8b090", opacity: 1, roughness: 0.55, transmission: 0 },
};

function useShellGeometry() {
  return useMemo(() => {
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg"><path d="${FOOT_PATH}"/></svg>`;
    const loader = new SVGLoader();
    const data = loader.parse(svgString);
    const shapes = data.paths.flatMap((p: THREE.ShapePath) => p.toShapes());

    const geo = new THREE.ExtrudeGeometry(shapes, {
      depth: SHELL_DEPTH / SCALE,
      bevelEnabled: true,
      bevelThickness: 6,
      bevelSize: 5,
      bevelSegments: 4,
      curveSegments: 24,
    });
    geo.scale(SCALE, -SCALE, SCALE);
    geo.translate(-FOOT_CENTER.x * SCALE, FOOT_CENTER.y * SCALE, -SHELL_DEPTH / 2);
    geo.computeVertexNormals();
    return geo;
  }, []);
}

export function FootShell({ layer }: { layer: FootLayer }) {
  const geometry = useShellGeometry();
  const mat = LAYER_MATERIAL[layer];

  return (
    <mesh geometry={geometry} receiveShadow castShadow={layer === "skin"}>
      <meshPhysicalMaterial
        color={mat.color}
        roughness={mat.roughness}
        transmission={mat.transmission}
        thickness={1.2}
        transparent={mat.opacity < 1}
        opacity={mat.opacity}
        clearcoat={0.6}
        clearcoatRoughness={0.3}
        ior={1.3}
        side={THREE.DoubleSide}
        depthWrite={mat.opacity >= 0.9}
      />
    </mesh>
  );
}
