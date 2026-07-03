import { useGLTF } from "@react-three/drei";

// Scales the Meshy-generated model (native height ~1.91) up to match the
// procedural shell's world scale (~10.6 tall) so switching layers doesn't
// jump the camera framing.
export const MESHY_SCALE = 5.548;

export function MeshyFootModel() {
  const { scene } = useGLTF("/models/foot-organs.glb");
  return <primitive object={scene} scale={MESHY_SCALE} />;
}

useGLTF.preload("/models/foot-organs.glb");
