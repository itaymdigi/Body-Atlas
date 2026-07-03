// Shared sole silhouette (plantar view), 240x460 viewBox — same outline used by the
// original 2D chart so the 3D shell lines up with reflexology-chart conventions.
export const FOOT_PATH =
  "M 86,20 C 70,20 52,22 46,32 C 40,38 40,50 44,58 C 30,56 24,60 26,70 C 28,80 40,83 50,80 C 46,88 44,95 50,100 C 56,105 66,103 72,98 C 68,106 66,115 72,120 C 78,125 90,122 96,116 C 100,128 108,135 120,134 C 132,133 140,126 144,116 C 150,122 160,124 168,118 C 174,112 172,103 168,96 C 180,95 188,88 186,78 C 184,68 174,64 162,68 C 164,60 162,50 156,44 C 150,36 138,34 130,38 L 126,30 C 118,22 104,18 94,18 Z M 66,128 C 44,138 34,165 34,200 C 34,240 42,275 50,305 C 58,340 64,365 74,388 C 86,415 104,438 120,440 C 138,442 156,424 166,400 C 178,372 184,340 188,308 C 192,275 192,240 188,206 C 184,168 174,145 158,130 C 148,122 136,118 120,118 C 104,118 82,120 66,128 Z";

// Bounding box of FOOT_PATH, used to center the extruded shell at the origin.
export const FOOT_BOUNDS = { minX: 24, maxX: 192, minY: 18, maxY: 442 };
export const FOOT_CENTER = {
  x: (FOOT_BOUNDS.minX + FOOT_BOUNDS.maxX) / 2,
  y: (FOOT_BOUNDS.minY + FOOT_BOUNDS.maxY) / 2,
};

// World-space scale: 1 SVG unit -> SCALE three.js units.
export const SCALE = 1 / 40;
export const SHELL_DEPTH = 46 * SCALE;

export type OrganShape =
  | "blob"
  | "lobed"
  | "lungs"
  | "heart"
  | "bean"
  | "coil"
  | "band"
  | "rod"
  | "sphere";

export type Element = "air" | "fire" | "water" | "earth";

export interface OrganDef {
  id: string;
  /** Shared selection key for bilateral organs (e.g. both kidneys) — defaults to id. */
  group?: string;
  name: string;
  shape: OrganShape;
  /** Position in original SVG coordinate space (x, y) plus a hand-tuned depth offset (z, in SVG units). */
  x: number;
  y: number;
  z: number;
  /** Base radius/size in SVG units — interpreted per-shape. */
  size: number;
  /** Extra shape-specific params. */
  params?: Record<string, number>;
  color: string;
  glow: string;
  element: Element;
  system: string;
  desc: string;
}

export const ORGANS: OrganDef[] = [
  {
    id: "brain", name: "ראש / מוח", shape: "blob",
    x: 110, y: 58, z: 6, size: 24,
    color: "#7c3aed", glow: "#c4b5fd", element: "air", system: "עצבי",
    desc: "מרכז חשיבה, תיאום ושינה. עבודה על האצבעות מרגיעה מתח עצבי ומיגרנות.",
  },
  {
    id: "sinus", name: "סינוסים", shape: "sphere",
    x: 80, y: 74, z: 5, size: 12,
    color: "#0ea5e9", glow: "#bae6fd", element: "air", system: "נשימתי",
    desc: "חללי אוויר בגולגולת. מסייע לאלרגיות, הצטננות וכאבי פנים.",
  },
  {
    id: "eyes", name: "עיניים", shape: "sphere",
    x: 90, y: 98, z: 5, size: 8,
    color: "#06b6d4", glow: "#a5f3fc", element: "fire", system: "חושי",
    desc: "עייפות עינית ומתח ראייתי. בקצות אצבעות 2–3.",
  },
  {
    id: "lung", name: "ריאות", shape: "lungs",
    x: 120, y: 168, z: 4, size: 30,
    color: "#ec4899", glow: "#fbcfe8", element: "air", system: "נשימתי",
    desc: "מערכת הנשימה. אסתמה, חרדה ונשימה רדודה. כדור כף הרגל.",
  },
  {
    id: "heart", name: "לב", shape: "heart",
    x: 118, y: 140, z: 10, size: 15,
    color: "#ef4444", glow: "#fca5a5", element: "fire", system: "לב וכלי דם",
    desc: "משאבת הדם. לחץ דם, חיוניות וחיבור רגשי.",
  },
  {
    id: "diaphragm", name: "סרעפת", shape: "band",
    x: 120, y: 226, z: 2, size: 62,
    params: { tube: 3.4 },
    color: "#84cc16", glow: "#bef264", element: "air", system: "שרירי",
    desc: "שריר הנשימה המפריד בין בית החזה לבטן. הרפייתו משפיעה על הגוף כולו.",
  },
  {
    id: "stomach", name: "קיבה", shape: "blob",
    x: 84, y: 265, z: 6, size: 22,
    params: { squashY: 1.3, squashX: 0.85 },
    color: "#f97316", glow: "#fed7aa", element: "fire", system: "עיכולי",
    desc: "עיכול מזון ורגשות. צרבת, כיבים ודאגנות יתר.",
  },
  {
    id: "liver", name: "כבד", shape: "lobed",
    x: 146, y: 268, z: 4, size: 30,
    color: "#b45309", glow: "#d4a166", element: "earth", system: "עיכולי",
    desc: "ניקוי רעלים וחילוף חומרים. ברפלקסולוגיה קשור לכעס ותסכול.",
  },
  {
    id: "pancreas", name: "לבלב", shape: "rod",
    x: 108, y: 313, z: 8, size: 22,
    params: { radius: 6, bend: 0.4 },
    color: "#ca8a04", glow: "#fde68a", element: "earth", system: "הורמונלי",
    desc: "ויסות סוכר וייצור אנזימים עיכוליים.",
  },
  {
    id: "kidney-l", group: "kidney", name: "כליות", shape: "bean",
    x: 80, y: 336, z: -2, size: 18,
    color: "#7c3aed", glow: "#ddd6fe", element: "water", system: "שתנתי",
    desc: "ניקוי הדם. שורש אנרגיית החיים, פחדים עמוקים ומבנה.",
  },
  {
    id: "kidney-r", group: "kidney", name: "כליות", shape: "bean",
    x: 158, y: 334, z: -2, size: 18,
    params: { flip: 1 },
    color: "#7c3aed", glow: "#ddd6fe", element: "water", system: "שתנתי",
    desc: "ניקוי הדם. שורש אנרגיית החיים, פחדים עמוקים ומבנה.",
  },
  {
    id: "intestine", name: "מעיים", shape: "coil",
    x: 118, y: 372, z: 2, size: 46,
    color: "#e879a0", glow: "#fce7f3", element: "earth", system: "עיכולי",
    desc: "ספיגת חומרים מזינים ופינוי. קשור לסדר ועיבוד רגשי.",
  },
  {
    id: "lowerback", name: "גב תחתון", shape: "rod",
    x: 120, y: 407, z: -6, size: 44,
    params: { radius: 5, bend: 0.15 },
    color: "#3b82f6", glow: "#bfdbfe", element: "water", system: "שרירי-שלד",
    desc: "תמיכה יציבה. ביטחון קיומי, גמישות ועצמאות.",
  },
  {
    id: "pelvis", name: "אגן", shape: "band",
    x: 116, y: 428, z: 4, size: 40,
    params: { tube: 5 },
    color: "#0f766e", glow: "#99f6e4", element: "earth", system: "רבייה",
    desc: "בסיס, יציבות ואברי רבייה. קרקוע ושייכות.",
  },
  {
    id: "heel", name: "עקב", shape: "sphere",
    x: 118, y: 426, z: -10, size: 26,
    color: "#e8a830", glow: "#fde68a", element: "earth", system: "שרירי-שלד",
    desc: "בסיס עגן. כאב עקב קשור לחסר בתמיכה כלכלית או רגשית.",
  },
];

export function organKey(def: OrganDef): string {
  return def.group ?? def.id;
}

// Native bounding half-extents of the Meshy-generated foot-organs.glb (before
// the MESHY_SCALE multiplier applied when rendering), used to project our
// SVG-space organ coordinates onto hotspot positions on that model's surface.
const MESHY_HALF_WIDTH = 0.311;
const MESHY_HALF_HEIGHT = 0.956;
const MESHY_SURFACE_Z = 0.16;

export function toMeshyWorld(x: number, y: number, scale: number): [number, number, number] {
  const nx = (x - FOOT_CENTER.x) / (FOOT_BOUNDS.maxX - FOOT_BOUNDS.minX) * 2 * MESHY_HALF_WIDTH;
  const ny = -((y - FOOT_CENTER.y) / (FOOT_BOUNDS.maxY - FOOT_BOUNDS.minY)) * 2 * MESHY_HALF_HEIGHT;
  return [nx * scale, ny * scale, MESHY_SURFACE_Z * scale];
}

export function toWorld(x: number, y: number, z: number): [number, number, number] {
  return [
    (x - FOOT_CENTER.x) * SCALE,
    -(y - FOOT_CENTER.y) * SCALE,
    z * SCALE,
  ];
}
