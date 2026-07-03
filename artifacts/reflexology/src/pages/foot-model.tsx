import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RotateCcw } from "lucide-react";

type Layer = "organs" | "nerve" | "muscle" | "pain";
type Foot = "right" | "left";

const LAYERS: { id: Layer; label: string }[] = [
  { id: "organs", label: "איברים פנימיים" },
  { id: "nerve",  label: "עצבים" },
  { id: "muscle", label: "שריר" },
  { id: "pain",   label: "כאב" },
];

interface ZoneData {
  id: string; name: string; desc: string; element: string;
  color: string; glow: string;
  /** normalized 0-1 within foot height (0=toes, 1=heel) */
  yPos: number;
  /** -1 to 1 horizontal offset */
  xOff: number;
  /** depth layer 0-1 (0=surface, 1=deep) */
  depth: number;
  /** relative size 0.5-1.4 */
  size: number;
}

const ZONES: ZoneData[] = [
  { id:"brain",     name:"ראש/מוח",   desc:"מרכז חשיבה, תיאום ושינה. עבודה על האצבעות מרגיעה מתח עצבי ומיגרנות.",      element:"אוויר", color:"#8b5cf6", glow:"#c4b5fd", yPos:0.04, xOff:0,    depth:0.3, size:1.0 },
  { id:"sinus",     name:"סינוסים",   desc:"חללי אוויר בגולגולת. מסייע לאלרגיות, הצטננות וכאבי פנים.",                   element:"אוויר", color:"#0ea5e9", glow:"#bae6fd", yPos:0.08, xOff:0.35, depth:0.2, size:0.7 },
  { id:"eyes",      name:"עיניים",    desc:"עייפות עינית, מתח ראייתי. בקצות אצבעות 2–3.",                                 element:"אש",    color:"#06b6d4", glow:"#a5f3fc", yPos:0.12, xOff:-0.3, depth:0.2, size:0.6 },
  { id:"lung",      name:"ריאות",     desc:"מערכת הנשימה. אסתמה, חרדה ונשימה רדודה. כדור כף הרגל.",                      element:"אוויר", color:"#ec4899", glow:"#fbcfe8", yPos:0.23, xOff:0,    depth:0.4, size:1.3 },
  { id:"heart",     name:"לב",        desc:"משאבת הדם. לחץ דם, חיוניות וחיבור רגשי.",                                     element:"אש",    color:"#ef4444", glow:"#fca5a5", yPos:0.25, xOff:-0.4, depth:0.3, size:0.8 },
  { id:"diaphragm", name:"סרעפת",     desc:"שריר הנשימה. הרפייתו מאזנת את המערכת כולה.",                                  element:"אוויר", color:"#84cc16", glow:"#bef264", yPos:0.32, xOff:0,    depth:0.5, size:1.1 },
  { id:"stomach",   name:"קיבה",      desc:"עיכול מזון ורגשות. צרבת, כיבים ודאגנות יתר.",                                 element:"אש",    color:"#f97316", glow:"#fed7aa", yPos:0.42, xOff:-0.2, depth:0.4, size:0.95},
  { id:"liver",     name:"כבד",       desc:"ניקוי רעלים וחילוף חומרים. ברפלקסולוגיה קשור לכעס ותסכול.",                  element:"עץ",    color:"#a16207", glow:"#d4a166", yPos:0.43, xOff:0.35, depth:0.4, size:0.95},
  { id:"pancreas",  name:"לבלב",      desc:"ויסות סוכר וייצור אנזימים עיכוליים.",                                          element:"אדמה", color:"#f43f5e", glow:"#fda4af", yPos:0.52, xOff:0,    depth:0.6, size:0.7 },
  { id:"kidney",    name:"כליות",     desc:"ניקוי הדם. שורש אנרגיית החיים, פחדים עמוקים ומבנה.",                          element:"מים",  color:"#7c3aed", glow:"#ddd6fe", yPos:0.59, xOff:0,    depth:0.5, size:0.85},
  { id:"intestine", name:"מעיים",     desc:"ספיגת חומרים מזינים ופינוי. קשור לסדר ועיבוד רגשי.",                          element:"אדמה", color:"#10b981", glow:"#a7f3d0", yPos:0.68, xOff:0,    depth:0.5, size:1.2 },
  { id:"lowerback", name:"גב תחתון",  desc:"תמיכה יציבה. ביטחון קיומי, גמישות ועצמאות.",                                  element:"מים",  color:"#3b82f6", glow:"#bfdbfe", yPos:0.78, xOff:0,    depth:0.3, size:0.85},
  { id:"pelvis",    name:"אגן",       desc:"בסיס, יציבות ואברי רבייה. קרקוע ושייכות.",                                    element:"אדמה", color:"#0f766e", glow:"#99f6e4", yPos:0.86, xOff:0,    depth:0.4, size:1.0 },
  { id:"heel",      name:"עקב",       desc:"בסיס עגן. כאב עקב קשור לחסר בתמיכה כלכלית או רגשית.",                        element:"אדמה", color:"#64748b", glow:"#cbd5e1", yPos:0.95, xOff:0,    depth:0.2, size:1.1 },
];

// Nerve path node positions (normalized 0-1 along y)
const NERVE_Y = [0.04, 0.12, 0.22, 0.33, 0.44, 0.56, 0.68, 0.80, 0.94];

// Foot outline path in 220×440 viewbox
const FOOT_PATH = "M 110,18 C 90,16 68,22 58,36 C 50,46 50,60 54,70 C 40,68 32,74 34,84 C 36,96 52,100 62,96 C 56,106 54,118 60,124 C 66,130 80,128 86,120 C 88,134 96,142 110,142 C 124,142 132,134 134,120 C 140,128 154,130 160,124 C 166,118 164,106 158,96 C 168,100 184,96 186,84 C 188,74 180,68 166,70 C 170,60 170,46 162,36 C 152,22 130,16 110,18 Z M 72,138 C 52,150 40,178 38,216 C 36,258 44,298 54,334 C 66,374 80,408 96,430 C 104,442 118,448 126,448 C 138,446 152,436 162,416 C 176,390 186,356 192,316 C 198,278 198,240 192,202 C 186,162 172,144 154,134 C 142,126 128,122 112,122 C 96,122 82,128 72,138 Z";

const FOOT_HEIGHT = 448;
const FOOT_WIDTH  = 220;

export default function FootModel() {
  const [layer,        setLayer]        = useState<Layer>("organs");
  const [foot,         setFoot]         = useState<Foot>("right");
  const [selected,     setSelected]     = useState<ZoneData | null>(ZONES[0]);
  const [rotY,         setRotY]         = useState(0);
  const [rotX,         setRotX]         = useState(-8);

  const autoRef    = useRef<number | null>(null);
  const dragging   = useRef(false);
  const lastX      = useRef(0);
  const lastY      = useRef(0);
  const velX       = useRef(0);
  const velY       = useRef(0);
  const rotYRef    = useRef(rotY);
  const rotXRef    = useRef(rotX);

  // Keep refs in sync
  useEffect(() => { rotYRef.current = rotY; }, [rotY]);
  useEffect(() => { rotXRef.current = rotX; }, [rotX]);

  // Auto-rotate
  useEffect(() => {
    let running = true;
    let lastTs = performance.now();
    const tick = (ts: number) => {
      if (!running) return;
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;
      if (!dragging.current) {
        setRotY(r => r + 36 * dt);  // 36°/s
        // Decelerate velocity
        velX.current *= 0.92;
        velY.current *= 0.92;
        setRotX(r => {
          const target = r + velY.current;
          return target > 25 ? 25 : target < -25 ? -25 : target;
        });
      }
      autoRef.current = requestAnimationFrame(tick);
    };
    autoRef.current = requestAnimationFrame(tick);
    return () => { running = false; if (autoRef.current) cancelAnimationFrame(autoRef.current); };
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true;
    lastX.current = e.clientX;
    lastY.current = e.clientY;
    velX.current = 0;
    velY.current = 0;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastX.current;
    const dy = e.clientY - lastY.current;
    velX.current = dx * 0.4;
    velY.current = dy * 0.3;
    setRotY(r => r + dx * 0.55);
    setRotX(r => {
      const n = r + dy * 0.35;
      return n > 25 ? 25 : n < -25 ? -25 : n;
    });
    lastX.current = e.clientX;
    lastY.current = e.clientY;
  }, []);

  const onPointerUp = useCallback(() => { dragging.current = false; }, []);

  const reset = () => { setRotY(0); setRotX(-8); velX.current = 0; velY.current = 0; };

  // Compute visible side: how much the front face is showing (cos of rotY)
  const cosY = Math.cos((rotY * Math.PI) / 180);
  const showingBack = cosY < 0;

  // Project a zone's 3D position to 2D screen coords
  function projectZone(z: ZoneData) {
    const footCenterX = FOOT_WIDTH / 2;
    const footCenterY = FOOT_HEIGHT * 0.5;

    // base 2D position within foot
    const baseX = footCenterX + z.xOff * 55;
    const baseY = z.yPos * FOOT_HEIGHT;
    const offsetFromCenter = baseX - footCenterX;

    // 3D depth offset — zones are inside the foot, depth pushes them in Z
    const depthOffset = z.depth * 18; // px of "thickness"

    // rotate around Y axis: cosY/sinY
    const sinY = Math.sin((rotY * Math.PI) / 180);
    const rotatedX = footCenterX + offsetFromCenter * cosY - depthOffset * sinY;

    // slight Y tilt
    const sinX = Math.sin((rotX * Math.PI) / 180);
    const dy = (baseY - footCenterY);
    const rotatedY = footCenterY + dy * Math.cos((rotX * Math.PI) / 180) - depthOffset * sinX;

    // scale by depth illusion
    const scale = 1 - z.depth * 0.12;

    // Z value for sorting (higher = closer to viewer)
    const zVal = -depthOffset * cosY + offsetFromCenter * sinY;

    return { x: rotatedX, y: rotatedY, scale, zVal, visible: true };
  }

  // Sort zones by depth
  const sortedZones = [...ZONES].sort((a, b) => {
    const pa = projectZone(a);
    const pb = projectZone(b);
    return pa.zVal - pb.zVal;
  });

  // Nerve path points
  const nervePts = NERVE_Y.map((yN, i) => {
    const sinY = Math.sin((rotY * Math.PI) / 180);
    const sinX = Math.sin((rotX * Math.PI) / 180);
    const footCenterX = FOOT_WIDTH / 2;
    const footCenterY = FOOT_HEIGHT * 0.5;
    const baseX = footCenterX;
    const baseY = yN * FOOT_HEIGHT;
    const dy = baseY - footCenterY;
    const rotY2D = footCenterX + 0 * cosY;
    const rotY2DY = footCenterY + dy * Math.cos((rotX * Math.PI) / 180);
    return `${i === 0 ? "M" : "L"} ${rotY2D},${rotY2DY}`;
  }).join(" ");

  // Muscle stripe paths
  const muscleY = [0.14, 0.25, 0.37, 0.50, 0.63, 0.75];
  const musclePaths = muscleY.map(yN => {
    const footCenterX = FOOT_WIDTH / 2;
    const footCenterY = FOOT_HEIGHT * 0.5;
    const baseY = yN * FOOT_HEIGHT;
    const dy = baseY - footCenterY;
    const rotatedY = footCenterY + dy * Math.cos((rotX * Math.PI) / 180);
    const halfW = (55 + 12) * Math.abs(cosY);
    return { x1: footCenterX - halfW, y: rotatedY, x2: footCenterX + halfW };
  });

  // Pain markers
  const painZones = [ZONES[0], ZONES[9], ZONES[3], ZONES[11]];
  const PAIN_INTENSITY = [7, 8, 4, 5];
  const PAIN_COLOR = ["#ef4444", "#f97316", "#eab308", "#f97316"];

  return (
    <div className="flex flex-col h-full" data-testid="foot-model-page">
      {/* Header */}
      <div className="pb-4 border-b border-border mb-4 flex-shrink-0">
        <h1 className="text-2xl font-semibold text-foreground">מפת כף הרגל</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {foot === "right" ? "כף רגל ימין" : "כף רגל שמאל"} — גרור לסיבוב 360°
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 flex-shrink-0 scrollbar-hide">
        {LAYERS.map(l => (
          <button key={l.id} onClick={() => setLayer(l.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full border text-sm font-medium transition-all ${
              layer === l.id
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-card text-muted-foreground border-border hover:border-primary/40"
            }`}>{l.label}</button>
        ))}
      </div>

      {/* Foot toggle */}
      <div className="flex gap-2 mb-4 flex-shrink-0">
        {(["right","left"] as Foot[]).map(f => (
          <button key={f} onClick={() => setFoot(f)}
            className={`px-5 py-2 rounded-full text-sm font-medium border transition-all ${
              foot === f ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:border-primary/40"
            }`}>{f === "right" ? "ימין" : "שמאל"}</button>
        ))}
      </div>

      {/* Main layout */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* 3D Foot Viewer */}
        <div
          className="flex-1 rounded-3xl overflow-hidden border border-border shadow-inner bg-gradient-to-b from-teal-50/60 via-white to-slate-50 relative select-none cursor-grab active:cursor-grabbing min-h-[420px]"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          {/* Reset button */}
          <button onClick={reset}
            className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/80 border border-border shadow flex items-center justify-center hover:bg-white transition-colors">
            <RotateCcw className="w-4 h-4 text-muted-foreground" />
          </button>

          {/* 3D scene */}
          <div className="w-full h-full flex items-center justify-center py-4">
            <div
              style={{
                perspective: "900px",
                perspectiveOrigin: "50% 45%",
                width: FOOT_WIDTH,
                height: FOOT_HEIGHT,
                position: "relative",
              }}
            >
              {/* The foot group that rotates */}
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  transform: `rotateY(${foot === "left" ? -rotY : rotY}deg) rotateX(${rotX}deg)`,
                  transformStyle: "preserve-3d",
                  transition: dragging.current ? "none" : "none",
                  position: "relative",
                }}
              >
                {/* ── FRONT FACE: foot SVG ── */}
                <svg
                  viewBox={`0 0 ${FOOT_WIDTH} ${FOOT_HEIGHT}`}
                  width={FOOT_WIDTH}
                  height={FOOT_HEIGHT}
                  style={{
                    position: "absolute", top: 0, left: 0,
                    filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.18))",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                >
                  <defs>
                    <radialGradient id="footSkin" cx="38%" cy="30%">
                      <stop offset="0%" stopColor="#fde8d8"/>
                      <stop offset="100%" stopColor="#e8b090"/>
                    </radialGradient>
                    <radialGradient id="footMuscle" cx="38%" cy="30%">
                      <stop offset="0%" stopColor="#ffd0d0"/>
                      <stop offset="100%" stopColor="#e88090"/>
                    </radialGradient>
                    <radialGradient id="footNerve" cx="38%" cy="30%">
                      <stop offset="0%" stopColor="#d0e8ff"/>
                      <stop offset="100%" stopColor="#90a8e0"/>
                    </radialGradient>
                    <filter id="glow3d">
                      <feGaussianBlur stdDeviation="3" result="b"/>
                      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                    <filter id="shadow3d">
                      <feDropShadow dx="2" dy="4" stdDeviation="6" floodOpacity="0.2"/>
                    </filter>
                  </defs>

                  {/* Foot body */}
                  <path d={FOOT_PATH}
                    fill={layer === "muscle" ? "url(#footMuscle)" : layer === "nerve" ? "url(#footNerve)" : "url(#footSkin)"}
                    stroke={layer === "organs" ? "#0f766e" : layer === "nerve" ? "#3b82f6" : "#c8a090"}
                    strokeWidth="1.5"
                    filter="url(#shadow3d)"
                    opacity={layer === "nerve" ? 0.55 : 0.88}
                  />

                  {/* NERVE layer */}
                  {layer === "nerve" && (
                    <g>
                      <path d={nervePts} stroke="#3b82f6" strokeWidth="3" fill="none" opacity="0.7"
                        strokeLinecap="round" strokeLinejoin="round"/>
                      {NERVE_Y.map((yN, i) => (
                        <circle key={i} cx={FOOT_WIDTH/2} cy={yN * FOOT_HEIGHT}
                          r={5} fill="#60a5fa" opacity="0.9" filter="url(#glow3d)"/>
                      ))}
                    </g>
                  )}

                  {/* MUSCLE layer */}
                  {layer === "muscle" && musclePaths.map((mp, i) => (
                    <g key={i}>
                      <line x1={mp.x1} y1={mp.y} x2={mp.x2} y2={mp.y}
                        stroke="#e11d48" strokeWidth="2.5" opacity={0.45 - i * 0.04} strokeLinecap="round"/>
                      <line x1={mp.x1 + 8} y1={mp.y + 10} x2={mp.x2 - 8} y2={mp.y + 10}
                        stroke="#f43f5e" strokeWidth="1.5" opacity={0.3} strokeLinecap="round"/>
                    </g>
                  ))}

                  {/* ORGAN blobs — sorted by depth */}
                  {layer === "organs" && sortedZones.map(z => {
                    const proj = projectZone(z);
                    const isSelected = selected?.id === z.id;
                    const baseR = z.size * 22;
                    return (
                      <g key={z.id} style={{ cursor: "pointer" }}
                        onClick={e => { e.stopPropagation(); setSelected(z); }}>
                        {/* glow ring for selected */}
                        {isSelected && (
                          <ellipse cx={proj.x} cy={proj.y}
                            rx={baseR * proj.scale + 8} ry={(baseR * 0.75) * proj.scale + 6}
                            fill="none" stroke={z.glow} strokeWidth="2.5" opacity="0.6"/>
                        )}
                        {/* blob shadow */}
                        <ellipse cx={proj.x + 2} cy={proj.y + 3}
                          rx={baseR * proj.scale * 0.9} ry={(baseR * 0.75) * proj.scale * 0.9}
                          fill="rgba(0,0,0,0.12)"/>
                        {/* blob body */}
                        <ellipse cx={proj.x} cy={proj.y}
                          rx={baseR * proj.scale} ry={(baseR * 0.75) * proj.scale}
                          fill={z.color}
                          opacity={isSelected ? 1 : 0.88}
                          filter={isSelected ? "url(#glow3d)" : ""}
                          stroke={isSelected ? z.glow : "rgba(255,255,255,0.3)"}
                          strokeWidth={isSelected ? "2" : "0.8"}
                        />
                        {/* highlight specular */}
                        <ellipse cx={proj.x - baseR * proj.scale * 0.28}
                          cy={proj.y - (baseR * 0.75) * proj.scale * 0.32}
                          rx={baseR * proj.scale * 0.32} ry={(baseR * 0.75) * proj.scale * 0.22}
                          fill="rgba(255,255,255,0.38)"/>
                        {/* label for large blobs */}
                        {baseR * proj.scale > 16 && (
                          <text x={proj.x} y={proj.y + 3.5} textAnchor="middle"
                            fontSize={Math.max(7, baseR * proj.scale * 0.32)}
                            fill="white" fontWeight="600"
                            style={{ pointerEvents:"none", textShadow:"0 1px 3px rgba(0,0,0,0.5)" }}>
                            {z.name}
                          </text>
                        )}
                      </g>
                    );
                  })}

                  {/* PAIN layer */}
                  {layer === "pain" && painZones.map((z, i) => {
                    const proj = projectZone(z);
                    return (
                      <g key={z.id}>
                        <circle cx={proj.x} cy={proj.y} r={16 * proj.scale}
                          fill={PAIN_COLOR[i]} opacity="0.2"/>
                        <circle cx={proj.x} cy={proj.y} r={10 * proj.scale}
                          fill={PAIN_COLOR[i]} opacity="0.8"/>
                        <text x={proj.x} y={proj.y + 4} textAnchor="middle"
                          fontSize="9" fill="white" fontWeight="700" style={{pointerEvents:"none"}}>
                          {PAIN_INTENSITY[i]}
                        </text>
                      </g>
                    );
                  })}

                  {/* Medial line */}
                  {layer !== "pain" && (
                    <path
                      d={`M ${FOOT_WIDTH/2 - 8 * cosY},126 C ${FOOT_WIDTH/2 - 12 * cosY},180 ${FOOT_WIDTH/2 - 15*cosY},260 ${FOOT_WIDTH/2 - 10*cosY},380`}
                      stroke={layer==="nerve"?"#2563eb":"#0f766e"}
                      strokeWidth="1.5" fill="none" opacity="0.3" strokeDasharray="5,3"
                    />
                  )}
                </svg>

                {/* ── BACK FACE: mirrored shell ── */}
                <svg
                  viewBox={`0 0 ${FOOT_WIDTH} ${FOOT_HEIGHT}`}
                  width={FOOT_WIDTH}
                  height={FOOT_HEIGHT}
                  style={{
                    position: "absolute", top: 0, left: 0,
                    transform: "rotateY(180deg)",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.18))",
                  }}
                >
                  <path d={FOOT_PATH} fill="#e8b090" stroke="#c8a090" strokeWidth="1.5" opacity="0.8"/>
                  <path d={FOOT_PATH} fill="none" stroke="#a07060" strokeWidth="0.8" opacity="0.4"/>
                </svg>

                {/* ── SIDE FACES for thickness illusion ── */}
                {[-18, 18].map((xOffset, i) => (
                  <svg key={i}
                    viewBox={`0 0 ${FOOT_WIDTH} ${FOOT_HEIGHT}`}
                    width={FOOT_WIDTH}
                    height={FOOT_HEIGHT}
                    style={{
                      position: "absolute", top: 0, left: 0,
                      transform: `translateZ(${xOffset}px)`,
                      opacity: 0.25,
                      pointerEvents: "none",
                    }}
                  >
                    <path d={FOOT_PATH} fill={i===0?"#e8c0a0":"#d0a888"} stroke="none"/>
                  </svg>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom hint */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none">
            <span className="text-xs text-muted-foreground/80 bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full border border-border/40">
              {showingBack ? "מבט אחורי" : "מבט קדמי"} · גרור לסיבוב 360° · גלגל לזום
            </span>
          </div>
        </div>

        {/* Right panel */}
        <div className="hidden lg:flex flex-col w-52 shrink-0 gap-3">
          <AnimatePresence mode="wait">
            {layer === "organs" && selected && (
              <motion.div key={selected.id}
                initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
                transition={{ duration: 0.22 }}
                className="rounded-2xl p-4 text-sm shadow-lg text-white flex-shrink-0"
                style={{ background: selected.color }}>
                <div className="font-semibold text-base mb-1">{selected.name}</div>
                <div className="text-xs opacity-80 mb-2">יסוד: {selected.element}</div>
                <p className="text-xs leading-relaxed opacity-95">{selected.desc}</p>
              </motion.div>
            )}
            {layer !== "organs" && (
              <motion.div key={layer}
                initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
                transition={{ duration: 0.22 }}
                className="rounded-2xl bg-card border border-border p-4 text-sm flex-shrink-0">
                <div className="font-semibold mb-2 text-foreground">
                  {layer==="nerve"&&"מערכת העצבים"}
                  {layer==="muscle"&&"מערכת השרירים"}
                  {layer==="pain"&&"מיפוי כאב"}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {layer==="nerve"&&"מערכת העצבים עוברת לאורך עמוד השדרה. נקודות הלחץ מפעילות קצות עצבים המשפיעים על האיברים."}
                  {layer==="muscle"&&"שרירים וגידים של כף הרגל. עבודה על נקודות לחץ מרפה התכווצויות ומשפרת זרימת דם."}
                  {layer==="pain"&&"נקודות כאב פעילות. הרגישות משקפת את מצב הגוף הרגעי. לחץ להוספת נקודת כאב חדשה."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {layer === "organs" && (
            <ScrollArea className="flex-1 rounded-2xl bg-card border border-border">
              <div className="p-2 space-y-0.5">
                <p className="text-xs font-semibold text-muted-foreground px-2 py-1.5">מיפוי איברים</p>
                {ZONES.map(z => (
                  <button key={z.id} onClick={() => setSelected(z)}
                    className={`w-full text-right px-3 py-2 rounded-lg text-xs transition-colors flex items-center gap-2 ${
                      selected?.id===z.id
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}>
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: z.color }}/>
                    {z.name}
                  </button>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  );
}
