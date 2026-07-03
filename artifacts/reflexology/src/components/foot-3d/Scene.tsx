import { forwardRef, useImperativeHandle, useRef, type ElementRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { FootShell, type FootLayer } from "./FootShell";
import { MeshyFootModel } from "./MeshyFootModel";
import { Hotspot } from "./Hotspot";
import { NerveNetwork, MuscleFibers } from "./LayerDetails";
import { ORGANS, organKey } from "./data";

export interface Foot3DHandle {
  zoomIn: () => void;
  zoomOut: () => void;
  reset: () => void;
}

interface Foot3DSceneProps {
  layer: FootLayer;
  side: "right" | "left";
  selected: string | null;
  onSelect: (id: string) => void;
  autoRotate: boolean;
}

function SceneContent({ layer, side, selected, onSelect }: Omit<Foot3DSceneProps, "autoRotate">) {
  return (
    <group scale={[side === "left" ? -1 : 1, 1, 1]}>
      {layer === "organs" ? (
        <>
          <MeshyFootModel />
          {ORGANS.map((organ) => (
            <Hotspot key={organ.id} def={organ} selected={selected === organKey(organ)} onSelect={onSelect} />
          ))}
        </>
      ) : (
        <FootShell layer={layer} />
      )}
      {layer === "nerve" && <NerveNetwork />}
      {layer === "muscle" && <MuscleFibers />}
    </group>
  );
}

export const Foot3DScene = forwardRef<Foot3DHandle, Foot3DSceneProps>(function Foot3DScene(
  { layer, side, selected, onSelect, autoRotate },
  ref,
) {
  const controlsRef = useRef<ElementRef<typeof OrbitControls>>(null);

  useImperativeHandle(ref, () => ({
    // Note: three.js names these from the camera's point of view — `dollyOut`
    // moves the camera closer (makes the model look bigger / "zoom in").
    zoomIn: () => {
      controlsRef.current?.dollyOut(1.15);
      controlsRef.current?.update();
    },
    zoomOut: () => {
      controlsRef.current?.dollyIn(1.15);
      controlsRef.current?.update();
    },
    reset: () => controlsRef.current?.reset(),
  }));

  return (
    <Canvas
      shadows="soft"
      dpr={[1, 2]}
      camera={{ position: [0, 0, 31], fov: 32, near: 0.1, far: 100 }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={["#f8fafc"]} />
      <ambientLight intensity={0.65} />
      <directionalLight
        position={[8, 12, 10]}
        intensity={1.1}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-10, 4, -8]} intensity={0.35} color="#5eead4" />
      <pointLight position={[0, -6, 8]} intensity={0.25} color="#ffffff" />

      <SceneContent layer={layer} side={side} selected={selected} onSelect={onSelect} />

      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        minDistance={12}
        maxDistance={40}
        autoRotate={autoRotate}
        autoRotateSpeed={1.4}
        dampingFactor={0.1}
        makeDefault
      />
    </Canvas>
  );
});
