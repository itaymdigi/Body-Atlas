import { Card, CardContent } from "@/components/ui/card";
import { Layers as LayersIcon, Activity, Wind, Eye } from "lucide-react";
import { motion } from "framer-motion";

const LAYER_DATA = [
  {
    title: "שכבת העור",
    subtitle: "רגישות ותגובה שטחית",
    icon: Eye,
    color: "bg-amber-500/10 text-amber-600 border-amber-200",
    desc: "העור משקף את הקשר שלנו עם העולם החיצון. רגישות בעור, יובש או לחות מעידים על מצב ההגנה הטבעית, תגובה רגשית שטחית ואיכות חילוף החומרים החיצוני.",
  },
  {
    title: "שכבת השריר והרקמות",
    subtitle: "מתח ותבניות תנועה",
    icon: Activity,
    color: "bg-rose-500/10 text-rose-600 border-rose-200",
    desc: "שרירים וגידים אוצרים בתוכם זכרונות של מאמץ, דחק וטראומה. נוקשות שרירית מעידה לרוב על התגוננות מתמשכת, עומס פיזי או קושי להרפות ולהרפות שליטה.",
  },
  {
    title: "שכבת העצבים וההולכה",
    subtitle: "תקשורת ותגובתיות",
    icon: Wind,
    color: "bg-blue-500/10 text-blue-600 border-blue-200",
    desc: "מערכת העצבים מחברת את הכל. כאבים חדים, עקצוצים או חוסר תחושה מצביעים על חסימות אנרגטיות, תגובת יתר של מערכת העצבים או מצבי סטרס כרוני.",
  },
  {
    title: "שכבת השתקפות האיברים",
    subtitle: "מערכות פנימיות וחיוניות",
    icon: LayersIcon,
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
    desc: "ברובד העמוק ביותר, כף הרגל מהווה מפה של הגוף השלם. רגישות באזור מסוים משקפת עומס או חוסר איזון באיבר המקביל לו, ומאפשרת טיפול הוליסטי מקיף.",
  }
];

export default function Layers() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-10">
      <header className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-light text-primary">שכבות מודעות</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          ברפלקסולוגיה וקריאת הגוף, אנו מתבוננים בכאב וברגישות דרך ארבע שכבות עומק. כל שכבה מספרת סיפור אחר על מצבו הפיזי והרגשי של המטופל.
        </p>
      </header>

      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-auto before:-translate-x-1/2 before:w-px before:bg-gradient-to-b before:from-transparent before:via-primary/20 before:to-transparent">
        {LAYER_DATA.map((layer, index) => (
          <motion.div 
            key={layer.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, duration: 0.5 }}
            className="relative z-10"
          >
            <Card className={`border shadow-sm overflow-hidden transition-all hover:shadow-md ${layer.color.split(' ')[0]} ${layer.color.split(' ')[2]}`}>
              <CardContent className="p-0 flex flex-col md:flex-row items-stretch">
                <div className={`p-6 flex flex-col items-center justify-center shrink-0 w-full md:w-32 bg-white/40 backdrop-blur-sm border-b md:border-b-0 md:border-l border-white/50`}>
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center bg-white shadow-sm ${layer.color.split(' ')[1]}`}>
                    <layer.icon className="w-7 h-7" />
                  </div>
                  <span className="font-bold mt-3 text-lg opacity-30">0{index + 1}</span>
                </div>
                <div className="p-6 md:p-8 flex-1 bg-card/60 backdrop-blur-sm">
                  <h3 className="text-2xl font-semibold mb-1">{layer.title}</h3>
                  <p className={`font-medium mb-4 ${layer.color.split(' ')[1]}`}>{layer.subtitle}</p>
                  <p className="text-muted-foreground leading-relaxed">
                    {layer.desc}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
