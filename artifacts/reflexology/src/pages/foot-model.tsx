import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ZoomIn, ZoomOut, RotateCcw, ChevronLeft } from "lucide-react";

type Layer = "skin" | "muscle" | "nerve" | "organs" | "pain";
type Foot = "right" | "left";

const LAYERS: { id: Layer; label: string; color: string; bg: string }[] = [
  { id: "skin", label: "עור", color: "#d97706", bg: "bg-amber-100 text-amber-700 border-amber-300" },
  { id: "muscle", label: "שריר", color: "#e11d48", bg: "bg-rose-100 text-rose-700 border-rose-300" },
  { id: "nerve", label: "עצבים", color: "#2563eb", bg: "bg-blue-100 text-blue-700 border-blue-300" },
  { id: "organs", label: "איברים פנימיים", color: "#059669", bg: "bg-emerald-100 text-emerald-700 border-emerald-300" },
  { id: "pain", label: "כאב", color: "#dc2626", bg: "bg-red-100 text-red-700 border-red-300" },
];

interface Organ {
  id: string;
  name: string;
  icon: string;
  cx: number; cy: number; rx: number; ry: number;
  fill: string; stroke: string;
  labelSide: "left" | "right";
  desc: string;
}

const ORGANS: Organ[] = [
  { id: "brain", name: "ראש/מוח", icon: "🧠", cx: 88, cy: 58, rx: 24, ry: 18, fill: "url(#gBrain)", stroke: "#7c3aed", labelSide: "left", desc: "מרכז חשיבה, תיאום ושינה. עבודה על האצבעות מרגיעה מתח עצבי ומיגרנות." },
  { id: "sinus", name: "סינוסים", icon: "👃", cx: 140, cy: 52, rx: 16, ry: 13, fill: "url(#gSinus)", stroke: "#0891b2", labelSide: "right", desc: "חללי אוויר בגולגולת. מסייע לאלרגיות, הצטננות וכאבי פנים." },
  { id: "eyes", name: "עיניים", icon: "👁", cx: 108, cy: 82, rx: 12, ry: 10, fill: "url(#gEyes)", stroke: "#0891b2", labelSide: "right", desc: "עייפות עינית, מתח ראייתי. בקצות אצבעות 2-3." },
  { id: "lung", name: "ריאות", icon: "🫁", cx: 110, cy: 140, rx: 48, ry: 28, fill: "url(#gLung)", stroke: "#db2777", labelSide: "left", desc: "מערכת הנשימה. אסתמה, חרדה ונשימה רדודה. כדור כף הרגל." },
  { id: "heart", name: "לב", icon: "❤️", cx: 76, cy: 155, rx: 16, ry: 16, fill: "url(#gHeart)", stroke: "#dc2626", labelSide: "left", desc: "משאבת הדם. לחץ דם, חיוניות וחיבור רגשי." },
  { id: "diaphragm", name: "סרעפת", icon: "🫧", cx: 112, cy: 178, rx: 50, ry: 8, fill: "url(#gDiaphragm)", stroke: "#65a30d", labelSide: "right", desc: "שריר הנשימה. הרפייתו מאזנת את המערכת כולה." },
  { id: "stomach", name: "קיבה", icon: "🟧", cx: 88, cy: 210, rx: 26, ry: 22, fill: "url(#gStomach)", stroke: "#d97706", labelSide: "left", desc: "עיכול מזון ורגשות. צרבת, כיבים ודאגנות יתר." },
  { id: "liver", name: "כבד", icon: "🟤", cx: 142, cy: 205, rx: 28, ry: 22, fill: "url(#gLiver)", stroke: "#92400e", labelSide: "right", desc: "ניקוי רעלים וחילוף חומרים. ברפלקסולוגיה קשור לכעס ותסכול." },
  { id: "pancreas", name: "לבלב", icon: "🩷", cx: 104, cy: 238, rx: 20, ry: 12, fill: "url(#gPancreas)", stroke: "#ec4899", labelSide: "left", desc: "ויסות סוכר וייצור אנזימים עיכוליים." },
  { id: "kidney", name: "כליות", icon: "🫘", cx: 112, cy: 268, rx: 22, ry: 20, fill: "url(#gKidney)", stroke: "#7c3aed", labelSide: "right", desc: "ניקוי הדם. שורש אנרגיית החיים, פחדים עמוקים ומבנה." },
  { id: "intestine", name: "מעיים", icon: "🌀", cx: 112, cy: 305, rx: 38, ry: 28, fill: "url(#gIntestine)", stroke: "#059669", labelSide: "left", desc: "ספיגת חומרים מזינים ופינוי. קשור לסדר ועיבוד רגשי." },
  { id: "lowerback", name: "גב תחתון", icon: "🦴", cx: 90, cy: 345, rx: 24, ry: 16, fill: "url(#gLowerback)", stroke: "#1d4ed8", labelSide: "left", desc: "תמיכה יציבה. ביטחון קיומי, גמישות ועצמאות." },
  { id: "pelvis", name: "אגן", icon: "🦷", cx: 112, cy: 375, rx: 32, ry: 18, fill: "url(#gPelvis)", stroke: "#0f766e", labelSide: "right", desc: "בסיס, יציבות ואברי רבייה. קרקוע ושייכות." },
  { id: "heel", name: "עקב", icon: "👣", cx: 112, cy: 410, rx: 36, ry: 22, fill: "url(#gHeel)", stroke: "#64748b", labelSide: "left", desc: "בסיס עגן. כאב עקב קשור לחסר בתמיכה כלכלית או רגשית." },
];

const PAIN_MARKERS = [
  { cx: 88, cy: 58, r: 14, color: "#ef4444", label: "ראש", intensity: 7 },
  { cx: 112, cy: 345, r: 16, color: "#f97316", label: "גב תחתון", intensity: 8 },
  { cx: 112, cy: 140, r: 12, color: "#eab308", label: "ריאות", intensity: 4 },
  { cx: 112, cy: 268, r: 10, color: "#f97316", label: "כליות", intensity: 5 },
];

// Foot outline path for plantar (sole) view, right foot, in 240x460 viewBox
const FOOT_PATH = "M 86,20 C 70,20 52,22 46,32 C 40,38 40,50 44,58 C 30,56 24,60 26,70 C 28,80 40,83 50,80 C 46,88 44,95 50,100 C 56,105 66,103 72,98 C 68,106 66,115 72,120 C 78,125 90,122 96,116 C 100,128 108,135 120,134 C 132,133 140,126 144,116 C 150,122 160,124 168,118 C 174,112 172,103 168,96 C 180,95 188,88 186,78 C 184,68 174,64 162,68 C 164,60 162,50 156,44 C 150,36 138,34 130,38 L 126,30 C 118,22 104,18 94,18 Z M 66,128 C 44,138 34,165 34,200 C 34,240 42,275 50,305 C 58,340 64,365 74,388 C 86,415 104,438 120,440 C 138,442 156,424 166,400 C 178,372 184,340 188,308 C 192,275 192,240 188,206 C 184,168 174,145 158,130 C 148,122 136,118 120,118 C 104,118 82,120 66,128 Z";

export default function FootModel() {
  const [activeLayer, setActiveLayer] = useState<Layer>("organs");
  const [activeFoot, setActiveFoot] = useState<Foot>("right");
  const [selectedOrgan, setSelectedOrgan] = useState<Organ | null>(ORGANS[0]);
  const [zoom, setZoom] = useState(1);

  const activeLayerData = LAYERS.find(l => l.id === activeLayer)!;

  const leftOrgans = ORGANS.filter(o => o.labelSide === "left");
  const rightOrgans = ORGANS.filter(o => o.labelSide === "right");

  return (
    <div className="flex flex-col h-full" data-testid="foot-model-page">
      {/* Header */}
      <div className="pb-4 border-b border-border mb-4">
        <h1 className="text-2xl font-semibold text-foreground">מפת כף הרגל</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {activeFoot === "right" ? "כף רגל ימין" : "כף רגל שמאל"} — איברים פנימיים
        </p>
      </div>

      {/* Layer Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {LAYERS.map(layer => (
          <button
            key={layer.id}
            data-testid={`layer-tab-${layer.id}`}
            onClick={() => setActiveLayer(layer.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full border text-sm font-medium transition-all ${
              activeLayer === layer.id
                ? layer.bg + " border-current shadow-sm"
                : "bg-card text-muted-foreground border-border hover:border-primary/40"
            }`}
          >
            {layer.label}
          </button>
        ))}
      </div>

      {/* Foot / Left toggle */}
      <div className="flex gap-2 mb-4">
        {(["right", "left"] as Foot[]).map(f => (
          <button
            key={f}
            data-testid={`foot-toggle-${f}`}
            onClick={() => setActiveFoot(f)}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium border transition-all ${
              activeFoot === f
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:border-primary/40"
            }`}
          >
            <span>{f === "right" ? "ימין" : "שמאל"}</span>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
              <ellipse cx="10" cy="10" rx="5" ry="9" />
            </svg>
          </button>
        ))}
      </div>

      {/* Main visualization + sidebar */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* Left label column */}
        {activeLayer === "organs" && (
          <div className="hidden lg:flex flex-col justify-start gap-1 w-32 shrink-0 pt-8">
            {leftOrgans.map(organ => (
              <button
                key={organ.id}
                onClick={() => setSelectedOrgan(organ)}
                className={`text-right text-xs px-2 py-1.5 rounded-lg transition-colors ${
                  selectedOrgan?.id === organ.id
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {organ.name}
              </button>
            ))}
          </div>
        )}

        {/* Foot SVG */}
        <div className="flex-1 flex flex-col items-center gap-3 relative">
          {/* Zoom controls */}
          <div className="absolute top-2 right-2 flex flex-col gap-1 z-10">
            <Button size="icon" variant="secondary" className="w-8 h-8 rounded-full shadow-sm" onClick={() => setZoom(z => Math.min(z + 0.2, 2))}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="secondary" className="w-8 h-8 rounded-full shadow-sm" onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="secondary" className="w-8 h-8 rounded-full shadow-sm" onClick={() => setZoom(1)}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex-1 flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-50 to-white rounded-3xl border border-border shadow-inner w-full max-h-[520px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeLayer}-${activeFoot}`}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.04 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
              >
                <svg
                  viewBox="0 0 240 460"
                  width="200"
                  height="380"
                  className="drop-shadow-xl"
                  style={{ transform: activeFoot === "left" ? "scaleX(-1)" : "none" }}
                >
                  <defs>
                    {/* Gradients for organs */}
                    <radialGradient id="gBrain" cx="40%" cy="35%"><stop offset="0%" stopColor="#c4b5fd"/><stop offset="100%" stopColor="#7c3aed"/></radialGradient>
                    <radialGradient id="gSinus" cx="40%" cy="35%"><stop offset="0%" stopColor="#bae6fd"/><stop offset="100%" stopColor="#0284c7"/></radialGradient>
                    <radialGradient id="gEyes" cx="40%" cy="35%"><stop offset="0%" stopColor="#a5f3fc"/><stop offset="100%" stopColor="#0891b2"/></radialGradient>
                    <radialGradient id="gLung" cx="40%" cy="35%"><stop offset="0%" stopColor="#fbcfe8"/><stop offset="100%" stopColor="#db2777" stopOpacity="0.7"/></radialGradient>
                    <radialGradient id="gHeart" cx="35%" cy="30%"><stop offset="0%" stopColor="#fca5a5"/><stop offset="100%" stopColor="#dc2626"/></radialGradient>
                    <radialGradient id="gDiaphragm" cx="40%" cy="35%"><stop offset="0%" stopColor="#bef264"/><stop offset="100%" stopColor="#65a30d" stopOpacity="0.6"/></radialGradient>
                    <radialGradient id="gStomach" cx="40%" cy="35%"><stop offset="0%" stopColor="#fed7aa"/><stop offset="100%" stopColor="#ea580c" stopOpacity="0.8"/></radialGradient>
                    <radialGradient id="gLiver" cx="40%" cy="35%"><stop offset="0%" stopColor="#d6b4a0"/><stop offset="100%" stopColor="#92400e" stopOpacity="0.8"/></radialGradient>
                    <radialGradient id="gPancreas" cx="40%" cy="35%"><stop offset="0%" stopColor="#fde68a"/><stop offset="100%" stopColor="#d97706" stopOpacity="0.8"/></radialGradient>
                    <radialGradient id="gKidney" cx="40%" cy="35%"><stop offset="0%" stopColor="#ddd6fe"/><stop offset="100%" stopColor="#7c3aed" stopOpacity="0.8"/></radialGradient>
                    <radialGradient id="gIntestine" cx="40%" cy="35%"><stop offset="0%" stopColor="#bbf7d0"/><stop offset="100%" stopColor="#16a34a" stopOpacity="0.7"/></radialGradient>
                    <radialGradient id="gLowerback" cx="40%" cy="35%"><stop offset="0%" stopColor="#bfdbfe"/><stop offset="100%" stopColor="#2563eb" stopOpacity="0.7"/></radialGradient>
                    <radialGradient id="gPelvis" cx="40%" cy="35%"><stop offset="0%" stopColor="#99f6e4"/><stop offset="100%" stopColor="#0f766e" stopOpacity="0.8"/></radialGradient>
                    <radialGradient id="gHeel" cx="40%" cy="35%"><stop offset="0%" stopColor="#e2e8f0"/><stop offset="100%" stopColor="#64748b"/></radialGradient>
                    <radialGradient id="gSkin" cx="40%" cy="35%"><stop offset="0%" stopColor="#fde8d8"/><stop offset="100%" stopColor="#e8bfa0"/></radialGradient>
                    <radialGradient id="gMuscleFill" cx="50%" cy="30%"><stop offset="0%" stopColor="#fca5a5" stopOpacity="0.7"/><stop offset="100%" stopColor="#991b1b" stopOpacity="0.5"/></radialGradient>
                    <filter id="glow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                    <filter id="softShadow"><feDropShadow dx="1" dy="2" stdDeviation="3" floodOpacity="0.15"/></filter>
                    <clipPath id="footClip"><path d={FOOT_PATH}/></clipPath>
                  </defs>

                  {/* Base foot shape — always visible */}
                  <path
                    d={FOOT_PATH}
                    fill={
                      activeLayer === "skin" ? "url(#gSkin)" :
                      activeLayer === "organs" ? "rgba(240,255,250,0.65)" :
                      activeLayer === "muscle" ? "rgba(255,220,220,0.5)" :
                      activeLayer === "nerve" ? "rgba(220,235,255,0.5)" :
                      "rgba(255,235,235,0.6)"
                    }
                    stroke={activeLayer === "organs" ? "#0f766e" : "#bbb"}
                    strokeWidth={activeLayer === "organs" ? "1.5" : "1"}
                    filter="url(#softShadow)"
                    className="transition-all duration-700"
                  />

                  {/* SKIN layer */}
                  {activeLayer === "skin" && (
                    <g clipPath="url(#footClip)">
                      <path d={FOOT_PATH} fill="url(#gSkin)" opacity="0.9" />
                      {/* Skin texture lines */}
                      <path d="M 80,130 Q 120,125 155,130" stroke="#c9956a" strokeWidth="0.7" fill="none" opacity="0.5"/>
                      <path d="M 75,165 Q 112,160 155,165" stroke="#c9956a" strokeWidth="0.7" fill="none" opacity="0.4"/>
                      <path d="M 72,200 Q 112,196 152,200" stroke="#c9956a" strokeWidth="0.7" fill="none" opacity="0.4"/>
                      <path d="M 70,240 Q 112,235 150,240" stroke="#c9956a" strokeWidth="0.7" fill="none" opacity="0.3"/>
                      {/* Sensitivity zones */}
                      <ellipse cx="90" cy="55" rx="20" ry="15" fill="#f59e0b" opacity="0.25"/>
                      <ellipse cx="112" cy="140" rx="45" ry="22" fill="#ef4444" opacity="0.15"/>
                      <ellipse cx="100" cy="350" rx="22" ry="14" fill="#f97316" opacity="0.2"/>
                    </g>
                  )}

                  {/* MUSCLE layer */}
                  {activeLayer === "muscle" && (
                    <g clipPath="url(#footClip)">
                      <path d="M 80,130 C 70,145 66,175 68,210 C 70,250 76,290 86,330 L 100,380 L 112,385 L 124,380 L 138,330 C 148,290 154,250 154,210 C 154,175 150,145 140,130 Z" fill="url(#gMuscleFill)" />
                      <path d="M 80,145 L 68,320" stroke="#ef4444" strokeWidth="1.5" fill="none" opacity="0.6"/>
                      <path d="M 140,145 L 152,320" stroke="#ef4444" strokeWidth="1.5" fill="none" opacity="0.6"/>
                      <path d="M 96,125 L 100,385" stroke="#dc2626" strokeWidth="2" fill="none" opacity="0.5"/>
                      <path d="M 112,120 L 112,420" stroke="#dc2626" strokeWidth="2.5" fill="none" opacity="0.5"/>
                      <path d="M 128,125 L 124,385" stroke="#dc2626" strokeWidth="2" fill="none" opacity="0.5"/>
                      {/* Tendon lines */}
                      <path d="M 72,168 Q 112,162 152,168" stroke="#b91c1c" strokeWidth="1" fill="none" opacity="0.7"/>
                      <path d="M 68,230 Q 112,224 156,230" stroke="#b91c1c" strokeWidth="1" fill="none" opacity="0.7"/>
                      <path d="M 66,295 Q 112,290 158,295" stroke="#b91c1c" strokeWidth="1" fill="none" opacity="0.5"/>
                    </g>
                  )}

                  {/* NERVE layer */}
                  {activeLayer === "nerve" && (
                    <g clipPath="url(#footClip)">
                      <path d="M 112,30 L 112,420" stroke="#3b82f6" strokeWidth="3" fill="none" opacity="0.4"/>
                      <path d="M 112,80 L 72,95 L 56,145 L 50,230 L 58,310 L 72,380" stroke="#2563eb" strokeWidth="2" fill="none" opacity="0.7"/>
                      <path d="M 112,80 L 152,95 L 168,145 L 172,230 L 162,310 L 150,380" stroke="#2563eb" strokeWidth="2" fill="none" opacity="0.7"/>
                      <path d="M 80,130 L 60,165 L 58,210 L 68,260" stroke="#60a5fa" strokeWidth="1.5" fill="none" opacity="0.6"/>
                      <path d="M 140,130 L 158,165 L 162,210 L 152,260" stroke="#60a5fa" strokeWidth="1.5" fill="none" opacity="0.6"/>
                      <path d="M 80,280 L 66,320 L 68,365" stroke="#93c5fd" strokeWidth="1.5" fill="none" opacity="0.6"/>
                      <path d="M 144,280 L 158,320 L 156,365" stroke="#93c5fd" strokeWidth="1.5" fill="none" opacity="0.6"/>
                      <path d="M 112,200 L 80,240 L 72,290" stroke="#60a5fa" strokeWidth="1" fill="none" opacity="0.5"/>
                      <path d="M 112,200 L 144,240 L 152,290" stroke="#60a5fa" strokeWidth="1" fill="none" opacity="0.5"/>
                      {[60, 110, 165, 230, 300, 365].map((y, i) => (
                        <circle key={i} cx={112} cy={y} r="3.5" fill="#3b82f6" opacity="0.8" filter="url(#glow)"/>
                      ))}
                      {[[72, 145], [152, 145], [60, 220], [164, 220], [66, 310], [158, 310]].map(([x, y], i) => (
                        <circle key={i} cx={x} cy={y} r="2.5" fill="#60a5fa" opacity="0.7"/>
                      ))}
                    </g>
                  )}

                  {/* ORGANS (internal) layer - the spectacular one */}
                  {activeLayer === "organs" && (
                    <g>
                      {ORGANS.map(organ => (
                        <g
                          key={organ.id}
                          onClick={() => setSelectedOrgan(organ)}
                          className="cursor-pointer"
                          filter={selectedOrgan?.id === organ.id ? "url(#glow)" : ""}
                        >
                          <ellipse
                            cx={organ.cx} cy={organ.cy} rx={organ.rx} ry={organ.ry}
                            fill={organ.fill}
                            stroke={organ.stroke}
                            strokeWidth={selectedOrgan?.id === organ.id ? "2" : "1"}
                            opacity={selectedOrgan?.id === organ.id ? "1" : "0.85"}
                            className="transition-all duration-300"
                          />
                          {/* Label connector line */}
                          {selectedOrgan?.id === organ.id && (
                            <line
                              x1={organ.labelSide === "left" ? organ.cx - organ.rx : organ.cx + organ.rx}
                              y1={organ.cy}
                              x2={organ.labelSide === "left" ? 10 : 230}
                              y2={organ.cy}
                              stroke={organ.stroke}
                              strokeWidth="0.8"
                              strokeDasharray="2,2"
                              opacity="0.7"
                            />
                          )}
                          {/* Organ label inside */}
                          {organ.rx >= 20 && (
                            <text x={organ.cx} y={organ.cy + 1.5} textAnchor="middle" fontSize="7" fill="white" fontWeight="600" className="pointer-events-none" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.4)" }}>
                              {organ.name}
                            </text>
                          )}
                          {/* Glowing halo for selected */}
                          {selectedOrgan?.id === organ.id && (
                            <ellipse cx={organ.cx} cy={organ.cy} rx={organ.rx + 4} ry={organ.ry + 4} fill="none" stroke={organ.stroke} strokeWidth="1.5" opacity="0.5" className="animate-ping" strokeDasharray="3 3"/>
                          )}
                        </g>
                      ))}
                    </g>
                  )}

                  {/* PAIN layer */}
                  {activeLayer === "pain" && (
                    <g>
                      {PAIN_MARKERS.map((m, i) => (
                        <g key={i}>
                          <circle cx={m.cx} cy={m.cy} r={m.r + 6} fill={m.color} opacity="0.15" className="animate-pulse"/>
                          <circle cx={m.cx} cy={m.cy} r={m.r} fill={m.color} opacity="0.75"/>
                          <text x={m.cx} y={m.cy + 2} textAnchor="middle" fontSize="7" fill="white" fontWeight="700">{m.intensity}</text>
                        </g>
                      ))}
                      <text x="112" y="455" textAnchor="middle" fontSize="8" fill="#94a3b8">לחץ להוספת נקודת כאב</text>
                    </g>
                  )}

                  {/* Spine line (medial edge) — visible in organs + nerve */}
                  {(activeLayer === "organs" || activeLayer === "nerve") && (
                    <path d="M 60,128 C 54,165 50,225 52,290 C 54,340 60,380 74,415" stroke={activeLayer === "nerve" ? "#1d4ed8" : "#0f766e"} strokeWidth="1.5" fill="none" opacity="0.4" strokeDasharray="4,2"/>
                  )}
                </svg>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Drag hint */}
          <p className="text-xs text-muted-foreground text-center pb-1">גרור לסיבוב המודל · צבט לפתיחה וסגירה</p>
        </div>

        {/* Right organ list / info panel */}
        {activeLayer === "organs" && (
          <div className="hidden lg:flex flex-col w-48 shrink-0 gap-3">
            {/* Selected organ card */}
            {selectedOrgan && (
              <motion.div
                key={selectedOrgan.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-primary text-primary-foreground p-4 text-sm shadow-lg"
              >
                <div className="font-semibold text-base mb-2">{selectedOrgan.name}</div>
                <p className="text-primary-foreground/90 text-xs leading-relaxed">{selectedOrgan.desc}</p>
                <div className="mt-3 text-xs opacity-70 border-t border-primary-foreground/20 pt-2">
                  לחץ על אזור במפה לקבלת מידע מפורט
                </div>
              </motion.div>
            )}

            {/* Right-side organs list */}
            <ScrollArea className="flex-1 rounded-2xl bg-card border border-border">
              <div className="p-2 space-y-1">
                <p className="text-xs font-semibold text-muted-foreground px-2 py-1">מיפוי איברים</p>
                {ORGANS.map(o => (
                  <button
                    key={o.id}
                    data-testid={`organ-item-${o.id}`}
                    onClick={() => setSelectedOrgan(o)}
                    className={`w-full text-right px-3 py-2 rounded-lg text-xs transition-colors flex items-center gap-2 ${
                      selectedOrgan?.id === o.id ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <span className="flex-1">{o.name}</span>
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: o.stroke }}/>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Info panel for non-organs layers */}
        {activeLayer !== "organs" && (
          <div className="hidden lg:flex flex-col w-56 shrink-0 gap-3">
            <div className="rounded-2xl bg-card border border-border p-5">
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium mb-3 border ${activeLayerData.bg}`}>
                {activeLayerData.label}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {activeLayer === "skin" && "שכבת המגע הראשונית. רגישות עורית מצביעה על מתח מקומי, דלקת, או עומס רגשי אצור באזור."}
                {activeLayer === "muscle" && "שרירים ורצועות תומכים בתנועה. נוקשות, כאב עמום ועוויתות מעידים על מתח פיזי או דפוסי הגנה חוזרים."}
                {activeLayer === "nerve" && "מסלולי הולכה עצבית. עקצוץ, הירדמות וכאב חד מקרין מצביעים על לחץ או גירוי עצבי."}
                {activeLayer === "pain" && "אזורים דלקתיים ורגישים שאותרו בטיפול. עוצמת הכאב מדורגת 1-10 עם סיווג לפי סוג וצבע."}
              </p>
            </div>

            {/* Layer legend */}
            <div className="rounded-2xl bg-card border border-border p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-3">מקרא שכבות</p>
              <div className="space-y-2">
                {LAYERS.map(l => (
                  <div key={l.id} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: l.color }}/>
                    <span className={`text-xs ${l.id === activeLayer ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile: organ info bottom panel */}
      {activeLayer === "organs" && selectedOrgan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden mt-4 rounded-2xl bg-primary text-primary-foreground p-4 shadow-lg"
        >
          <div className="font-semibold text-base mb-1">{selectedOrgan.name}</div>
          <p className="text-primary-foreground/90 text-sm">{selectedOrgan.desc}</p>
        </motion.div>
      )}

      {/* Mobile organs scroll */}
      {activeLayer === "organs" && (
        <div className="lg:hidden mt-4 overflow-x-auto">
          <div className="flex gap-2 pb-2">
            {ORGANS.map(o => (
              <button
                key={o.id}
                onClick={() => setSelectedOrgan(o)}
                className={`flex-shrink-0 px-3 py-2 rounded-full text-xs border transition-all ${
                  selectedOrgan?.id === o.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border"
                }`}
              >
                {o.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="mt-4">
        <button
          className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-semibold text-base shadow-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-3"
          data-testid="start-mapping-btn"
        >
          <span>התחל מיפוי</span>
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
