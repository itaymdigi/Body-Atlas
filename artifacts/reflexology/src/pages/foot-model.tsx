import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RotateCcw, ZoomIn, ZoomOut, Play, Pause } from "lucide-react";
import { Foot3D, ORGANS, organKey, type Foot3DHandle, type FootLayer } from "@/components/foot-3d";

type Foot = "right" | "left";

const LAYERS: { id: FootLayer; label: string }[] = [
  { id: "organs", label: "איברים פנימיים" },
  { id: "nerve", label: "עצבים" },
  { id: "muscle", label: "שריר" },
  { id: "skin", label: "עור" },
];

export default function FootModel() {
  const [layer, setLayer] = useState<FootLayer>("organs");
  const [foot, setFoot] = useState<Foot>("right");
  const [selected, setSelected] = useState<string | null>("brain");
  const [autoRotate, setAutoRotate] = useState(true);

  const sceneRef = useRef<Foot3DHandle>(null);
  const selectedOrgan = ORGANS.find((o) => organKey(o) === selected) ?? null;

  // Bilateral organs (e.g. both kidneys) share one entry in the list/legend.
  const listedOrgans = ORGANS.filter(
    (o, i) => ORGANS.findIndex((other) => organKey(other) === organKey(o)) === i,
  );

  return (
    <div className="flex flex-col h-full" data-testid="foot-model-page">
      {/* Header */}
      <div className="pb-4 border-b border-border mb-4 flex-shrink-0">
        <h1 className="text-2xl font-semibold text-foreground">מפת כף הרגל התלת-ממדית</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {foot === "right" ? "כף רגל ימין" : "כף רגל שמאל"} — {LAYERS.find((l) => l.id === layer)?.label}
        </p>
      </div>

      {/* Layer Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 flex-shrink-0 scrollbar-hide">
        {LAYERS.map((l) => (
          <button
            key={l.id}
            onClick={() => setLayer(l.id)}
            aria-pressed={layer === l.id}
            className={`flex-shrink-0 min-h-11 px-4 py-2.5 rounded-full border text-sm font-medium transition-all ${
              layer === l.id
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-card text-muted-foreground border-border hover:border-primary/40"
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>

      {/* Foot toggle */}
      <div className="flex gap-2 mb-4 flex-shrink-0">
        {(["right", "left"] as Foot[]).map((f) => (
          <button
            key={f}
            onClick={() => setFoot(f)}
            aria-pressed={foot === f}
            className={`min-h-11 px-5 py-2.5 rounded-full text-sm font-medium border transition-all ${
              foot === f
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:border-primary/40"
            }`}
          >
            {f === "right" ? "ימין" : "שמאל"}
          </button>
        ))}
      </div>

      {/* Main */}
      <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
        {/* LEFT: layer legend */}
        {layer === "organs" && (
          <div className="hidden xl:flex flex-col w-16 shrink-0 justify-end pb-8">
            <p className="text-xs font-semibold text-muted-foreground mb-2 text-center">מקרא שכבות</p>
            {[
              { label: "עור", color: "#e8b090" },
              { label: "שריר", color: "#f87171" },
              { label: "עצבים", color: "#60a5fa" },
              { label: "איברים פנימיים", color: "#2dd4bf" },
              { label: "כאב", color: "#ef4444" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5 mb-1.5">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: l.color }} />
                <span className="text-[9px] text-muted-foreground">{l.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* CENTER: real-time 3D rotating foot */}
        <div
          className="flex-1 rounded-3xl overflow-hidden border border-border shadow-inner relative"
          style={{ minHeight: 420 }}
        >
          <Foot3D
            ref={sceneRef}
            layer={layer}
            side={foot}
            selected={selected}
            onSelect={setSelected}
            autoRotate={autoRotate}
          />

          {/* Controls */}
          <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
            <button
              aria-label="הגדלה"
              onClick={() => sceneRef.current?.zoomIn()}
              className="size-11 rounded-full bg-white/90 border border-border shadow-sm flex items-center justify-center hover:bg-white active:scale-95 transition-transform"
            >
              <ZoomIn className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              aria-label="הקטנה"
              onClick={() => sceneRef.current?.zoomOut()}
              className="size-11 rounded-full bg-white/90 border border-border shadow-sm flex items-center justify-center hover:bg-white active:scale-95 transition-transform"
            >
              <ZoomOut className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              aria-label={autoRotate ? "השהיית סיבוב אוטומטי" : "הפעלת סיבוב אוטומטי"}
              aria-pressed={autoRotate}
              onClick={() => setAutoRotate((v) => !v)}
              className="size-11 rounded-full bg-white/90 border border-border shadow-sm flex items-center justify-center hover:bg-white active:scale-95 transition-transform"
            >
              {autoRotate ? (
                <Pause className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Play className="w-4 h-4 text-muted-foreground rtl:-scale-x-100" />
              )}
            </button>
            <button
              aria-label="איפוס תצוגה"
              onClick={() => sceneRef.current?.reset()}
              className="size-11 rounded-full bg-white/90 border border-border shadow-sm flex items-center justify-center hover:bg-white active:scale-95 transition-transform"
            >
              <RotateCcw className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Status hint */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none z-10">
            <span className="text-xs text-muted-foreground/80 bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full border border-border/30">
              גררו לסיבוב 360° בכל כיוון · גלגלו לזום · לחצו על איבר לפרטים
            </span>
          </div>
        </div>

        {/* RIGHT: info panel (stacks below the foot on mobile, side column on desktop) */}
        <div className="flex flex-col w-full lg:w-52 shrink-0 gap-3 min-h-0">
          <AnimatePresence mode="wait">
            {selectedOrgan && (
              <motion.div
                key={selectedOrgan.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
                className="rounded-2xl p-4 text-sm shadow-lg text-white flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${selectedOrgan.glow}33, ${selectedOrgan.color})` }}
              >
                <div className="font-bold text-base mb-1 drop-shadow">{selectedOrgan.name}</div>
                <div className="text-xs opacity-80 mb-2 font-medium">מערכת: {selectedOrgan.system}</div>
                <p className="text-xs leading-relaxed opacity-95">{selectedOrgan.desc}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="text-xs font-semibold text-muted-foreground px-1 mt-1">מיפוי איברים</div>
          <ScrollArea className="lg:flex-1 h-40 lg:h-auto rounded-2xl bg-card border border-border">
            <div className="p-2 space-y-0.5">
              {listedOrgans.map((o) => {
                const key = organKey(o);
                return (
                  <button
                    key={key}
                    onClick={() => setSelected(key)}
                    aria-pressed={selected === key}
                    className={`w-full text-right px-3 py-2.5 min-h-11 rounded-lg text-xs transition-colors flex items-center gap-2 ${
                      selected === key
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: o.color }} />
                    {o.name}
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
