import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Info } from "lucide-react";

type Foot = "right" | "left";

interface Zone {
  id: number;
  name: string;
  element: "air" | "fire" | "water" | "earth";
  cx: number; cy: number; rx: number; ry: number;
  color: string; stroke: string;
  desc: string;
  system: string;
}

const ZONES: Zone[] = [
  { id: 1, name: "ראש/מוח", element: "air", cx: 88, cy: 52, rx: 24, ry: 18, color: "#7c3aed", stroke: "#6d28d9", desc: "אחראי על חשיבה, תיאום ומערכת העצבים המרכזית. מטופל לבעיות שינה, מיגרנות ולחץ נפשי.", system: "עצבי" },
  { id: 2, name: "סינוסים", element: "air", cx: 140, cy: 48, rx: 18, ry: 14, color: "#0284c7", stroke: "#0369a1", desc: "חללי אוויר בגולגולת. טיפול במקרים של אלרגיות, הצטננות, וכאבי פנים.", system: "נשימתי" },
  { id: 3, name: "עיניים", element: "air", cx: 112, cy: 80, rx: 20, ry: 14, color: "#06b6d4", stroke: "#0891b2", desc: "מערכת הראייה. עייפות עינית, כאבי ראש וראייה מטושטשת.", system: "חושי" },
  { id: 4, name: "ריאות", element: "air", cx: 110, cy: 136, rx: 50, ry: 24, color: "#ec4899", stroke: "#db2777", desc: "מערכת הנשימה. רלוונטי לאסתמה, חרדה ונשימה רדודה.", system: "נשימתי" },
  { id: 5, name: "לב", element: "fire", cx: 78, cy: 152, rx: 18, ry: 16, color: "#dc2626", stroke: "#b91c1c", desc: "משאבת הדם. קשור ללחץ דם, חיוניות ואהבה/פגיעות רגשית.", system: "לב וכלי דם" },
  { id: 6, name: "סרעפת", element: "fire", cx: 112, cy: 175, rx: 52, ry: 9, color: "#65a30d", stroke: "#4d7c0f", desc: "שריר הנשימה המפריד בין בית החזה לבטן. הרפייתו משפיעה על הגוף כולו.", system: "שרירי" },
  { id: 7, name: "קיבה", element: "fire", cx: 86, cy: 208, rx: 28, ry: 22, color: "#ea580c", stroke: "#c2410c", desc: "עיכול מזון ורגשות. רלוונטי לצרבות, כיבים ודאגנות יתר.", system: "עיכולי" },
  { id: 8, name: "כבד", element: "fire", cx: 144, cy: 205, rx: 30, ry: 22, color: "#92400e", stroke: "#78350f", desc: "סינון רעלים וחילוף חומרים. מקום אגירת כעס ותסכול.", system: "עיכולי" },
  { id: 9, name: "לבלב", element: "fire", cx: 108, cy: 236, rx: 20, ry: 12, color: "#d97706", stroke: "#b45309", desc: "ויסות סוכר ועיכול. ויסות אנרגטי ורגשי.", system: "הורמונלי" },
  { id: 10, name: "כליות", element: "water", cx: 112, cy: 266, rx: 24, ry: 20, color: "#7c3aed", stroke: "#6d28d9", desc: "ניקוי הדם. שורש אנרגיית החיים, פחדים עמוקים ומבנה.", system: "שתנתי" },
  { id: 11, name: "מעיים", element: "earth", cx: 112, cy: 305, rx: 42, ry: 28, color: "#16a34a", stroke: "#15803d", desc: "ספיגת חומרים מזינים ופינוי. קשור לסדר ועיבוד רגשי.", system: "עיכולי" },
  { id: 12, name: "גב תחתון", element: "earth", cx: 88, cy: 345, rx: 26, ry: 16, color: "#2563eb", stroke: "#1d4ed8", desc: "תמיכה יציבה. ביטחון קיומי, גמישות ועצמאות.", system: "שרירי-שלד" },
  { id: 13, name: "אגן", element: "earth", cx: 112, cy: 375, rx: 36, ry: 18, color: "#0f766e", stroke: "#0d6b62", desc: "בסיס, יציבות ואברי רבייה. קרקוע ושייכות.", system: "רבייה" },
  { id: 14, name: "כתפיים", element: "air", cx: 152, cy: 138, rx: 16, ry: 14, color: "#8b5cf6", stroke: "#7c3aed", desc: "נשיאת עומסים. אחריות, חובה ומתח.", system: "שרירי-שלד" },
  { id: 15, name: "עקב", element: "earth", cx: 112, cy: 413, rx: 40, ry: 24, color: "#64748b", stroke: "#475569", desc: "בסיס עגן. כאב עקב קשור לחסר בתמיכה קיומית.", system: "שרירי-שלד" },
];

const ELEMENT_LABELS: Record<string, { label: string; color: string }> = {
  air: { label: "אוויר", color: "#7c3aed" },
  fire: { label: "אש", color: "#dc2626" },
  water: { label: "מים", color: "#2563eb" },
  earth: { label: "אדמה", color: "#16a34a" },
};

const FOOT_PATH = "M 86,20 C 70,20 52,22 46,32 C 40,38 40,50 44,58 C 30,56 24,60 26,70 C 28,80 40,83 50,80 C 46,88 44,95 50,100 C 56,105 66,103 72,98 C 68,106 66,115 72,120 C 78,125 90,122 96,116 C 100,128 108,135 120,134 C 132,133 140,126 144,116 C 150,122 160,124 168,118 C 174,112 172,103 168,96 C 180,95 188,88 186,78 C 184,68 174,64 162,68 C 164,60 162,50 156,44 C 150,36 138,34 130,38 L 126,30 C 118,22 104,18 94,18 Z M 66,128 C 44,138 34,165 34,200 C 34,240 42,275 50,305 C 58,340 64,365 74,388 C 86,415 104,438 120,440 C 138,442 156,424 166,400 C 178,372 184,340 188,308 C 192,275 192,240 188,206 C 184,168 174,145 158,130 C 148,122 136,118 120,118 C 104,118 82,120 66,128 Z";

export default function VitalZones() {
  const [activeZone, setActiveZone] = useState<Zone>(ZONES[5]);
  const [activeFoot, setActiveFoot] = useState<Foot>("right");

  return (
    <div className="flex flex-col gap-4" data-testid="vital-zones-page">
      {/* Header */}
      <div className="pb-3 border-b border-border">
        <h1 className="text-2xl font-semibold text-foreground">אזורים חיוניים</h1>
        <p className="text-muted-foreground text-sm mt-1">לחצו על אזור לקבלת מידע קליני ורפלקסולוגי</p>
      </div>

      {/* Foot toggle */}
      <div className="flex gap-2">
        {(["right", "left"] as Foot[]).map(f => (
          <button
            key={f}
            onClick={() => setActiveFoot(f)}
            data-testid={`vital-foot-toggle-${f}`}
            className={`px-5 py-2 rounded-full text-sm font-medium border transition-all ${
              activeFoot === f
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:border-primary/40"
            }`}
          >
            {f === "right" ? "ימין" : "שמאל"}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* SVG foot map */}
        <div className="flex-1 bg-gradient-to-b from-slate-50 to-white rounded-3xl border border-border shadow-inner flex items-center justify-center p-4 min-h-[480px]">
          <svg
            viewBox="0 0 240 460"
            width="210"
            height="400"
            className="drop-shadow-xl overflow-visible"
            style={{ transform: activeFoot === "left" ? "scaleX(-1)" : "none" }}
          >
            <defs>
              <filter id="vzGlow"><feGaussianBlur stdDeviation="2.5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            </defs>

            {/* Base foot */}
            <path d={FOOT_PATH} fill="rgba(248,252,250,0.8)" stroke="#cbd5e1" strokeWidth="1.5"/>

            {/* Zone areas */}
            {ZONES.map(zone => {
              const isActive = activeZone.id === zone.id;
              return (
                <g key={zone.id} onClick={() => setActiveZone(zone)} className="cursor-pointer">
                  <ellipse
                    cx={zone.cx} cy={zone.cy}
                    rx={isActive ? zone.rx + 3 : zone.rx}
                    ry={isActive ? zone.ry + 3 : zone.ry}
                    fill={zone.color}
                    opacity={isActive ? 0.92 : 0.65}
                    filter={isActive ? "url(#vzGlow)" : ""}
                    stroke={isActive ? zone.stroke : "transparent"}
                    strokeWidth={isActive ? "2" : "0"}
                    className="transition-all duration-300"
                  />
                  {/* Label inside zone */}
                  {zone.rx >= 22 && (
                    <text
                      x={zone.cx} y={zone.cy + 2}
                      textAnchor="middle"
                      fontSize={zone.rx >= 35 ? "7.5" : "6.5"}
                      fill="white"
                      fontWeight="700"
                      className="pointer-events-none select-none"
                    >
                      {zone.name}
                    </text>
                  )}
                  {/* Side label for small zones */}
                  {zone.rx < 22 && (
                    <>
                      <line
                        x1={zone.cx + (zone.cx > 112 ? zone.rx : -zone.rx)}
                        y1={zone.cy}
                        x2={zone.cx > 112 ? 226 : 14}
                        y2={zone.cy}
                        stroke={zone.color}
                        strokeWidth="0.8"
                        strokeDasharray="2,2"
                        opacity="0.8"
                      />
                      <text
                        x={zone.cx > 112 ? 228 : 10}
                        y={zone.cy + 2.5}
                        textAnchor={zone.cx > 112 ? "start" : "end"}
                        fontSize="6"
                        fill={zone.color}
                        fontWeight="600"
                        className="pointer-events-none select-none"
                      >
                        {zone.name}
                      </text>
                    </>
                  )}
                  {/* Active pulse ring */}
                  {isActive && (
                    <ellipse
                      cx={zone.cx} cy={zone.cy}
                      rx={zone.rx + 8} ry={zone.ry + 8}
                      fill="none" stroke={zone.color} strokeWidth="1.5"
                      opacity="0.4"
                      className="animate-ping"
                    />
                  )}
                  {/* Zone number badge */}
                  <circle cx={zone.cx + zone.rx - 5} cy={zone.cy - zone.ry + 5} r="6" fill="white" opacity={isActive ? 0.95 : 0} className="transition-opacity pointer-events-none"/>
                  <text x={zone.cx + zone.rx - 5} y={zone.cy - zone.ry + 7.5} textAnchor="middle" fontSize="6" fill={zone.color} fontWeight="700" className="pointer-events-none select-none" opacity={isActive ? 1 : 0}>{zone.id}</text>
                </g>
              );
            })}

            {/* Spine indicator */}
            <path d="M 52,128 C 46,165 44,225 46,290 C 48,340 54,380 66,415" stroke="#94a3b8" strokeWidth="1" fill="none" opacity="0.4" strokeDasharray="4,2"/>
          </svg>
        </div>

        {/* Right panel */}
        <div className="w-full lg:w-80 flex flex-col gap-4">
          {/* Active zone card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeZone.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl text-white p-5 shadow-lg"
              style={{ backgroundColor: activeZone.color }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold">{activeZone.name}</h3>
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
                  {activeZone.id}
                </div>
              </div>
              <p className="text-white/90 text-sm leading-relaxed mb-4">
                {activeZone.desc}
              </p>
              <div className="flex gap-2 border-t border-white/20 pt-3">
                <div className="flex items-center gap-1.5 text-xs font-medium bg-white/20 rounded-full px-3 py-1">
                  <Info className="w-3 h-3"/>
                  <span>מערכת {activeZone.system}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium bg-white/20 rounded-full px-3 py-1">
                  <span>יסוד {ELEMENT_LABELS[activeZone.element].label}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* All zones list */}
          <div className="rounded-2xl bg-card border border-border overflow-hidden flex-1">
            <div className="px-4 py-3 border-b border-border">
              <p className="text-sm font-semibold text-foreground">כל האזורים</p>
            </div>
            <ScrollArea className="h-[320px] lg:h-[340px]">
              <div className="p-2 space-y-1">
                {ZONES.map(zone => (
                  <button
                    key={zone.id}
                    data-testid={`zone-item-${zone.id}`}
                    onClick={() => setActiveZone(zone)}
                    className={`w-full text-right px-3 py-2.5 rounded-xl text-sm transition-all flex items-center gap-3 ${
                      activeZone.id === zone.id
                        ? "bg-primary/8 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: zone.color, opacity: activeZone.id === zone.id ? 1 : 0.6 }}/>
                    <span className="flex-1">{zone.name}</span>
                    <span className="text-xs opacity-50">{ELEMENT_LABELS[zone.element].label}</span>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${activeZone.id === zone.id ? "text-white" : "text-muted-foreground"}`}
                      style={{ backgroundColor: activeZone.id === zone.id ? zone.color : "transparent" }}>
                      {zone.id}
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
