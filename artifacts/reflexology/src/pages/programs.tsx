import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Clock, ChevronLeft, Star, Bookmark } from "lucide-react";

interface Program {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  duration: string;
  sessions: number;
  level: string;
  color: string;
  bgFrom: string;
  bgTo: string;
  tags: string[];
  exercises: string[];
}

const PROGRAMS: Program[] = [
  {
    id: "stress",
    title: "הפחתת מתח",
    subtitle: "הרפיה מלאה לגוף ונפש",
    desc: "תכנית 7 ימים לשחרור מתח כרוני, בנייה על כלים של עצירה, נשימה ומודעות גוף.",
    duration: "7–5 דקות",
    sessions: 7,
    level: "מתחילים",
    color: "text-teal-700",
    bgFrom: "from-teal-400",
    bgTo: "to-emerald-500",
    tags: ["נשימה", "עצירה", "רגישות עורית"],
    exercises: ["עצירת תנועה", "סריקת גוף", "נשימת בטן", "הרפיית שרירים"],
  },
  {
    id: "pain",
    title: "מודעות לכאב כרוני",
    subtitle: "הבנת דפוסי כאב חוזרים",
    desc: "תכנית 4 ימים ללמוד להבחין בין כאב חד, עמום ולחץ, לתעד ולהפחית.",
    duration: "10–8 דקות",
    sessions: 4,
    level: "בינוני",
    color: "text-rose-700",
    bgFrom: "from-rose-400",
    bgTo: "to-pink-500",
    tags: ["תיעוד כאב", "דפוסים", "כף הרגל"],
    exercises: ["מיפוי כאב", "אזורי כף רגל", "לחץ ורגישות", "ייחוס רגשי"],
  },
  {
    id: "sleep",
    title: "שיפור שינה",
    subtitle: "שגרת ערב לגוף רגוע",
    desc: "תרגילי הכנה לשינה המבוססים על רפלקסולוגיה ועבודה על אזורי ראש ועצבים.",
    duration: "10 דקות",
    sessions: 5,
    level: "מתחילים",
    color: "text-indigo-700",
    bgFrom: "from-indigo-400",
    bgTo: "to-violet-500",
    tags: ["שינה", "ראש ומוח", "הרגעה"],
    exercises: ["לחיצות על כף הרגל", "נשימה סרעפתית", "הרפיית עיניים", "עצירה פסיבית"],
  },
  {
    id: "energy",
    title: "איזון אנרגיה",
    subtitle: "חיוניות ויציבות יומיומית",
    desc: "תכנית 5 ימים לעבודה עם 4 האלמנטים — אדמה, מים, אש ואוויר — לאיזון פנימי.",
    duration: "14 דקות",
    sessions: 5,
    level: "מתקדם",
    color: "text-amber-700",
    bgFrom: "from-amber-400",
    bgTo: "to-orange-500",
    tags: ["4 יסודות", "כליות", "סרעפת"],
    exercises: ["תרגול קרקוע", "נשימה אוגנית", "עבודה על כבד", "הפעלת אנרגיה"],
  },
  {
    id: "breathing",
    title: "תרגול נשימה",
    subtitle: "מיומנות נשימתית ויומיומית",
    desc: "7 תרגולים שונים לנשימה מעמיקה, כולל נשימת 4-7-8, כוכב, בוקסינג ועוד.",
    duration: "4–3 דקות",
    sessions: 7,
    level: "מתחילים",
    color: "text-sky-700",
    bgFrom: "from-sky-400",
    bgTo: "to-cyan-500",
    tags: ["נשימה", "סרעפת", "חרדה"],
    exercises: ["נשימת 4-7-8", "נשימת כוכב", "נשימת בוקסינג", "נשימת אחדות"],
  },
  {
    id: "awareness",
    title: "מודעות גוף",
    subtitle: "הקשבה עמוקה לתחושות",
    desc: "תכנית מבוססת שיטת גרינברג לזיהוי דפוסים אוטומטיים גופניים ועצירתם.",
    duration: "8 דקות",
    sessions: 6,
    level: "מתקדם",
    color: "text-emerald-700",
    bgFrom: "from-emerald-400",
    bgTo: "to-teal-500",
    tags: ["דפוסים", "עצירה", "קשב לגוף"],
    exercises: ["זיהוי מאמץ", "סריקה אנכית", "נקודת עוצמה", "חזרה לגוף"],
  },
];

const LEVELS: Record<string, string> = {
  "מתחילים": "bg-green-100 text-green-700",
  "בינוני": "bg-yellow-100 text-yellow-700",
  "מתקדם": "bg-red-100 text-red-700",
};

export default function Programs() {
  const [activeProgram, setActiveProgram] = useState<Program | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set(["stress"]));

  if (activeProgram) {
    return (
      <div className="flex flex-col gap-6" data-testid="program-detail">
        {/* Back */}
        <button
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
          onClick={() => setActiveProgram(null)}
          data-testid="back-to-programs"
        >
          <ChevronLeft className="w-4 h-4 rotate-180" />
          חזרה לתכניות
        </button>

        {/* Hero */}
        <div className={`rounded-3xl bg-gradient-to-br ${activeProgram.bgFrom} ${activeProgram.bgTo} p-8 text-white shadow-lg`}>
          <h1 className="text-3xl font-bold mb-2">{activeProgram.title}</h1>
          <p className="text-white/80 text-base mb-6">{activeProgram.subtitle}</p>
          <p className="text-white/90 text-sm leading-relaxed mb-6">{activeProgram.desc}</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {activeProgram.tags.map(tag => (
              <span key={tag} className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">{tag}</span>
            ))}
          </div>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-1.5"><Clock className="w-4 h-4"/>{activeProgram.duration}</div>
            <div>{activeProgram.sessions} מפגשים</div>
            <div className={`px-3 py-0.5 rounded-full text-xs font-medium bg-white/20`}>{activeProgram.level}</div>
          </div>
        </div>

        {/* Exercises list */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">תרגילים בתכנית</h3>
          {activeProgram.exercises.map((ex, i) => (
            <motion.div
              key={ex}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm flex-shrink-0">{i + 1}</div>
              <span className="flex-1 text-sm font-medium text-foreground">{ex}</span>
              <Play className="w-4 h-4 text-muted-foreground"/>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex gap-3">
          <Link href="/pause" className="flex-1">
            <Button className="w-full rounded-2xl h-14 text-base font-semibold" data-testid="start-program-btn">
              <Play className="w-5 h-5 ml-2"/>
              התחל תכנית
            </Button>
          </Link>
          <Button
            variant="outline"
            className="h-14 px-4 rounded-2xl"
            aria-label={savedIds.has(activeProgram.id) ? "הסרה מהשמורים" : "שמירת תכנית"}
            onClick={() => setSavedIds(s => { const n = new Set(s); n.has(activeProgram.id) ? n.delete(activeProgram.id) : n.add(activeProgram.id); return n; })}
          >
            <Bookmark className={`w-5 h-5 ${savedIds.has(activeProgram.id) ? "fill-primary text-primary" : ""}`}/>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6" data-testid="programs-page">
      {/* Header */}
      <div className="pb-3 border-b border-border">
        <h1 className="text-2xl font-semibold text-foreground">תכניות</h1>
        <p className="text-muted-foreground text-sm mt-1">בחרו תכנית מותאמת לצורך שלכם</p>
      </div>

      {/* Featured */}
      <div
        className="rounded-3xl bg-gradient-to-br from-teal-500 to-emerald-600 p-6 text-white cursor-pointer shadow-lg"
        onClick={() => setActiveProgram(PROGRAMS[0])}
        data-testid="featured-program"
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold bg-white/20 rounded-full px-3 py-1 mb-3 inline-block">מומלץ עבורך</div>
            <h2 className="text-2xl font-bold mb-1">{PROGRAMS[0].title}</h2>
            <p className="text-white/80 text-sm mb-4">{PROGRAMS[0].subtitle}</p>
            <div className="flex items-center gap-3 text-sm">
              <Clock className="w-4 h-4"/>
              <span>{PROGRAMS[0].duration}</span>
              <span>·</span>
              <span>{PROGRAMS[0].sessions} מפגשים</span>
            </div>
          </div>
          <div className="text-4xl">🌿</div>
        </div>
        <Button variant="secondary" className="mt-5 rounded-xl bg-white/20 hover:bg-white/30 text-white border-none w-full">
          <Play className="w-4 h-4 ml-2"/>
          התחל עכשיו
        </Button>
      </div>

      {/* All programs grid */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">כל התכניות</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PROGRAMS.map((prog, i) => (
            <motion.div
              key={prog.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <Card
                className="border-none shadow-sm cursor-pointer hover:shadow-md transition-all"
                onClick={() => setActiveProgram(prog)}
                data-testid={`program-card-${prog.id}`}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${prog.bgFrom} ${prog.bgTo} flex items-center justify-center text-white text-xl flex-shrink-0`}>
                      {prog.id === "stress" ? "🌿" : prog.id === "pain" ? "💫" : prog.id === "sleep" ? "🌙" : prog.id === "energy" ? "⚡" : prog.id === "breathing" ? "🫁" : "🧘"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-foreground text-sm">{prog.title}</h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${LEVELS[prog.level]}`}>{prog.level}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{prog.desc}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3"/>
                        <span>{prog.duration}</span>
                        <Star className="w-3 h-3"/>
                        <span>{prog.sessions} מפגשים</span>
                      </div>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); setSavedIds(s => { const n = new Set(s); n.has(prog.id) ? n.delete(prog.id) : n.add(prog.id); return n; }); }}
                      aria-label={savedIds.has(prog.id) ? "הסרה מהשמורים" : "שמירת תכנית"}
                      className="size-9 shrink-0 -m-1.5 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Bookmark className={`w-4 h-4 ${savedIds.has(prog.id) ? "fill-primary text-primary" : ""}`}/>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
