import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Info } from "lucide-react";

const ZONES = [
  { id: 1, name: "מוח/ראש", group: "air", x: 50, y: 15, desc: "אחראי על חשיבה, תיאום ומערכת העצבים המרכזית. מטופל לבעיות שינה, מיגרנות ולחץ נפשי." },
  { id: 2, name: "סינוסים", group: "air", x: 70, y: 10, desc: "חללי אוויר בגולגולת. טיפול במקרים של אלרגיות, הצטננות, וכאבי פנים." },
  { id: 3, name: "ריאות", group: "air", x: 50, y: 35, desc: "מערכת הנשימה. רלוונטי לאסתמה, חרדה (נשימה רדודה), ואגירת צער." },
  { id: 4, name: "לב", group: "fire", x: 65, y: 40, desc: "משאבת הדם. קשור ללחץ דם, חיוניות, ואהבה/פגיעות רגשית." },
  { id: 5, name: "סרעפת", group: "fire", x: 50, y: 48, desc: "שריר הנשימה המפריד בין בית החזה לבטן. מוקד הצטברות של לחץ ומתח. הרפייתו משפיעה על הגוף כולו." },
  { id: 6, name: "קיבה", group: "fire", x: 35, y: 55, desc: "עיכול מזון ועיכול רגשות. רלוונטי לצרבות, כיבים, ודאגנות יתר." },
  { id: 7, name: "כבד", group: "fire", x: 65, y: 55, desc: "סינון רעלים וחילוף חומרים. ברפואה משלימה, מקום אגירת כעס ותסכול." },
  { id: 8, name: "כליות", group: "water", x: 50, y: 65, desc: "סינון הדם ויצירת שתן. נחשבות לשורש אנרגיית החיים, וקשורות לפחדים עמוקים." },
  { id: 9, name: "גב תחתון", group: "earth", x: 25, y: 75, desc: "תמיכה במבנה הגוף. כאבים כאן מקושרים לעיתים קרובות לחוסר ביטחון קיומי או כלכלי." },
  { id: 10, name: "עקב/אגן", group: "earth", x: 50, y: 85, desc: "בסיס, יציבות, ואברי רבייה. עבודה על עקב משפרת קרקוע ותחושת שייכות." },
];

export default function VitalZones() {
  const [activeZone, setActiveZone] = useState(ZONES[4]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-light text-primary">אזורים חיוניים</h1>
        <p className="text-muted-foreground mt-2">מפת השתקפויות - לחצו על אזור לקבלת מידע קליני</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 bg-card rounded-3xl p-8 relative flex items-center justify-center min-h-[600px] border shadow-sm">
          <svg viewBox="0 0 100 100" className="w-full max-w-sm h-full drop-shadow-xl overflow-visible">
            {/* Base footprint shape */}
            <path d="M35,20 C25,20 15,40 15,60 C15,80 30,95 50,95 C70,95 85,80 85,60 C85,40 75,20 65,20 C60,10 40,10 35,20 Z" 
              fill="#f8fdfb" stroke="#0f766e" strokeWidth="0.5" 
            />
            <path d="M35,20 C35,15 38,10 42,10 C46,10 50,15 50,20" fill="#f8fdfb" stroke="#0f766e" strokeWidth="0.5" />
            <path d="M52,20 C52,16 55,12 58,12 C61,12 65,16 65,20" fill="#f8fdfb" stroke="#0f766e" strokeWidth="0.5" />
            
            <path d="M15,60 C40,70 60,70 85,60" stroke="#0f766e" strokeWidth="0.5" strokeDasharray="1,1" fill="none" />
            <path d="M22,40 C40,45 60,45 78,40" stroke="#0f766e" strokeWidth="0.5" strokeDasharray="1,1" fill="none" />
            
            {ZONES.map(zone => (
              <g key={zone.id} onClick={() => setActiveZone(zone)} className="cursor-pointer group">
                <circle 
                  cx={zone.x} 
                  cy={zone.y} 
                  r={activeZone.id === zone.id ? 4 : 3} 
                  className={`transition-all duration-300 ${
                    activeZone.id === zone.id ? "fill-primary" : "fill-primary/30 group-hover:fill-primary/60"
                  }`} 
                />
                <circle 
                  cx={zone.x} 
                  cy={zone.y} 
                  r="6" 
                  fill="transparent" 
                />
                {activeZone.id === zone.id && (
                  <circle cx={zone.x} cy={zone.y} r="8" fill="none" stroke="#0f766e" strokeWidth="0.5" className="animate-ping" />
                )}
                <text 
                  x={zone.x} 
                  y={zone.y + 1} 
                  fontSize="3" 
                  textAnchor="middle" 
                  fill="white" 
                  className={`pointer-events-none font-bold ${activeZone.id === zone.id ? "opacity-100" : "opacity-0"}`}
                >
                  {zone.id}
                </text>
              </g>
            ))}
          </svg>
        </div>

        <div className="w-full lg:w-80 flex flex-col gap-4">
          <Card className="border-none shadow-sm bg-primary text-primary-foreground sticky top-6">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-primary-foreground/20 pb-4">
                <h3 className="text-2xl font-semibold">{activeZone.name}</h3>
                <span className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center font-bold text-sm">
                  {activeZone.id}
                </span>
              </div>
              <p className="text-primary-foreground/90 leading-relaxed min-h-[100px]">
                {activeZone.desc}
              </p>
              <div className="pt-4 border-t border-primary-foreground/20">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Info className="w-4 h-4" />
                  <span>שיוך ליסוד: {
                    activeZone.group === 'air' ? 'אוויר' : 
                    activeZone.group === 'fire' ? 'אש' : 
                    activeZone.group === 'water' ? 'מים' : 'אדמה'
                  }</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm flex-1">
            <CardContent className="p-0">
              <ScrollArea className="h-[300px] lg:h-[calc(100vh-400px)]">
                <div className="p-4 space-y-2">
                  {ZONES.map(zone => (
                    <button
                      key={zone.id}
                      onClick={() => setActiveZone(zone)}
                      className={`w-full text-right px-4 py-3 rounded-lg text-sm transition-colors flex justify-between items-center ${
                        activeZone.id === zone.id 
                          ? "bg-primary/10 text-primary font-medium" 
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span>{zone.name}</span>
                      <span className={`text-xs w-5 h-5 rounded-full flex items-center justify-center ${
                        activeZone.id === zone.id ? "bg-primary text-white" : "bg-muted-foreground/20"
                      }`}>{zone.id}</span>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
