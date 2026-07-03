import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Footprints, Activity, Box, Zap, ZoomIn } from "lucide-react";

type LayerType = "skin" | "muscle" | "nerve" | "vital" | "pain";

const LAYERS: { id: LayerType; label: string; icon: any; color: string; desc: string }[] = [
  { id: "skin", label: "עור", icon: Box, color: "text-amber-500", desc: "שכבת המגע הראשונית. רגישות לשפשוף, טמפרטורה ומרקם." },
  { id: "muscle", label: "שריר", icon: Activity, color: "text-rose-500", desc: "מבני תמיכה ותנועה. כאב עמום, נוקשות, מתח רצועתי." },
  { id: "nerve", label: "עצבים", icon: Zap, color: "text-blue-500", desc: "הולכה עצבית. עקצוץ, הירדמות, כאב חד ומקרין." },
  { id: "vital", label: "אזורים חיוניים", icon: Footprints, color: "text-emerald-500", desc: "השתקפות איברים פנימיים. מוקדי טיפול רפלקסולוגי." },
  { id: "pain", label: "מוקדי כאב", icon: Activity, color: "text-red-500", desc: "אזורים דלקתיים או רגישים במיוחד שאותרו בטיפול." },
];

export default function FootModel() {
  const [activeLayer, setActiveLayer] = useState<LayerType>("vital");
  const activeDesc = LAYERS.find(l => l.id === activeLayer)?.desc;

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-light text-primary">מודל תלת-ממדי</h1>
        <p className="text-muted-foreground mt-2">חקרו את כף הרגל בשכבות, מהעור ועד להשתקפויות האיברים</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-64 flex flex-col gap-3 shrink-0">
          <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider mb-2">בחירת שכבה</h3>
          {LAYERS.map(layer => (
            <Button
              key={layer.id}
              variant={activeLayer === layer.id ? "default" : "outline"}
              className={`justify-start gap-3 h-14 ${activeLayer === layer.id ? 'bg-primary' : 'bg-card border-none shadow-sm'}`}
              onClick={() => setActiveLayer(layer.id)}
            >
              <layer.icon className={`w-5 h-5 ${activeLayer === layer.id ? 'text-primary-foreground' : layer.color}`} />
              <span className="font-medium text-base">{layer.label}</span>
            </Button>
          ))}
          
          <Card className="mt-4 bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <p className="text-sm text-primary leading-relaxed">
                {activeDesc}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1 bg-card rounded-3xl p-8 relative flex items-center justify-center min-h-[500px] border shadow-sm overflow-hidden group">
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <Button size="icon" variant="secondary" className="rounded-full bg-white/80 backdrop-blur">
              <ZoomIn className="w-4 h-4 text-primary" />
            </Button>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeLayer}
              initial={{ opacity: 0, scale: 0.95, rotateY: -10 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 1.05, rotateY: 10 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative w-full max-w-sm aspect-[1/2]"
            >
              {/* This is a placeholder for a complex SVG. Real implementation would have layered detailed SVGs */}
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-full blur-3xl opacity-50" />
              
              <svg viewBox="0 0 200 400" className="w-full h-full drop-shadow-2xl">
                {/* Base foot shape */}
                <path d="M70,50 C50,50 30,100 30,150 C30,250 50,350 90,380 C110,395 130,380 150,350 C170,300 170,100 130,50 C110,25 90,50 70,50 Z" 
                  fill={activeLayer === 'skin' ? '#f5d0b5' : '#e0e0e0'} 
                  stroke="#d0d0d0" strokeWidth="2" 
                  className="transition-colors duration-700"
                />
                
                {activeLayer === 'muscle' && (
                  <path d="M60,100 C40,150 40,250 80,350 C100,380 120,350 140,300 C150,250 150,150 120,100" 
                    fill="#ef4444" opacity="0.6" 
                  />
                )}
                
                {activeLayer === 'nerve' && (
                  <>
                    <path d="M100,50 L100,380" stroke="#3b82f6" strokeWidth="3" fill="none" opacity="0.7" />
                    <path d="M100,100 L60,150" stroke="#3b82f6" strokeWidth="2" fill="none" opacity="0.7" />
                    <path d="M100,200 L140,250" stroke="#3b82f6" strokeWidth="2" fill="none" opacity="0.7" />
                    <path d="M100,300 L70,350" stroke="#3b82f6" strokeWidth="2" fill="none" opacity="0.7" />
                  </>
                )}
                
                {activeLayer === 'vital' && (
                  <>
                    <circle cx="100" cy="80" r="20" fill="#10b981" opacity="0.5" />
                    <circle cx="70" cy="150" r="15" fill="#10b981" opacity="0.5" />
                    <circle cx="130" cy="200" r="25" fill="#10b981" opacity="0.5" />
                    <circle cx="100" cy="300" r="30" fill="#10b981" opacity="0.5" />
                  </>
                )}
                
                {activeLayer === 'pain' && (
                  <>
                    <circle cx="100" cy="320" r="15" fill="#ef4444" opacity="0.8" className="animate-pulse" />
                    <circle cx="60" cy="140" r="10" fill="#f59e0b" opacity="0.8" />
                  </>
                )}
              </svg>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
