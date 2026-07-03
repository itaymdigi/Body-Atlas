import { Suspense, forwardRef } from "react";
import { Foot3DScene, type Foot3DHandle } from "./Scene";
import type { FootLayer } from "./FootShell";

export type { Foot3DHandle, FootLayer };
export { ORGANS, organKey } from "./data";
export type { OrganDef } from "./data";

interface Foot3DProps {
  layer: FootLayer;
  side: "right" | "left";
  selected: string | null;
  onSelect: (id: string) => void;
  autoRotate: boolean;
}

export const Foot3D = forwardRef<Foot3DHandle, Foot3DProps>(function Foot3D(props, ref) {
  return (
    <Suspense fallback={null}>
      <Foot3DScene ref={ref} {...props} />
    </Suspense>
  );
});
