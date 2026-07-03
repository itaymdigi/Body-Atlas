import { Card, CardContent } from "@/components/ui/card";
import { Circle, Flame, Droplets, Wind, Mountain } from "lucide-react";

const ELEMENTS = [
  {
    id: "earth",
    name: "אדמה",
    icon: Mountain,
    color: "bg-[#8b5a2b]",
    lightColor: "bg-[#8b5a2b]/10",
    textColor: "text-[#8b5a2b]",
    systems: "שלד, עצמות, מפרקים, שיניים",
    emotions: "יציבות, ביטחון, קרקוע, שגרה, עקשנות",
    focus: "עקב, כף רגל תחתונה, עמוד שדרה",
  },
  {
    id: "water",
    name: "מים",
    icon: Droplets,
    color: "bg-[#3b82f6]",
    lightColor: "bg-[#3b82f6]/10",
    textColor: "text-[#3b82f6]",
    systems: "דם, לימפה, שתן, כליות, שלפוחית",
    emotions: "זרימה, רגשות, הסתגלות, פחד, עומק",
    focus: "קשת כף הרגל, מערכת השתן",
  },
  {
    id: "fire",
    name: "אש",
    icon: Flame,
    color: "bg-[#ef4444]",
    lightColor: "bg-[#ef4444]/10",
    textColor: "text-[#ef4444]",
    systems: "עיכול, לב, טמפרטורת גוף",
    emotions: "תשוקה, כעס, טרנספורמציה, מרץ, שחיקה",
    focus: "כריות כף הרגל, אזור הקיבה והכבד",
  },
  {
    id: "air",
    name: "אוויר",
    icon: Wind,
    color: "bg-[#8b5cf6]",
    lightColor: "bg-[#8b5cf6]/10",
    textColor: "text-[#8b5cf6]",
    systems: "נשימה, ריאות, עצבים, חמצון",
    emotions: "מחשבות, תקשורת, חופש, חרדה, ניתוק",
    focus: "אצבעות הרגליים, ריאות, סינוסים",
  }
];

export default function Elements() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-light text-primary">4 היסודות</h1>
        <p className="text-muted-foreground mt-2">רפלקסולוגיה הוליסטית מחברת בין מצבים פיזיים לאלמנטים בטבע. זיהוי היסוד הדומיננטי או החסר מכוון את הטיפול.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        {ELEMENTS.map(element => (
          <Card key={element.id} className="border-none shadow-sm overflow-hidden group">
            <CardContent className="p-0">
              <div className={`${element.lightColor} p-6 flex items-start gap-4`}>
                <div className={`w-16 h-16 rounded-2xl ${element.color} flex items-center justify-center text-white shrink-0 shadow-lg`}>
                  <element.icon className="w-8 h-8" />
                </div>
                <div>
                  <h2 className={`text-2xl font-semibold ${element.textColor}`}>{element.name}</h2>
                  <div className="mt-4 space-y-3">
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">מערכות בגוף</h4>
                      <p className="text-sm font-medium text-foreground">{element.systems}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">היבט רגשי/נפשי</h4>
                      <p className="text-sm font-medium text-foreground">{element.emotions}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">אזורי מיקוד ברגל</h4>
                      <p className="text-sm font-medium text-foreground">{element.focus}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card className="border-none shadow-sm bg-gradient-to-br from-card to-card/50">
        <CardContent className="p-8 text-center">
          <h3 className="text-xl font-medium mb-4">איזון יסודות</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            בריאות מושגת כאשר כל ארבעת היסודות מאוזנים. עודף אש דורש מים להרגעה, חוסר אדמה מצריך טיפול מקרקע, ועודף אוויר (מחשבות) יאוזן על ידי טיפול פיזי עמוק.
          </p>
          <div className="flex justify-center">
            <div className="relative w-48 h-48">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#8b5cf6]/20 rounded-full flex items-center justify-center"><Wind className="text-[#8b5cf6] w-6 h-6"/></div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#8b5a2b]/20 rounded-full flex items-center justify-center"><Mountain className="text-[#8b5a2b] w-6 h-6"/></div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#3b82f6]/20 rounded-full flex items-center justify-center"><Droplets className="text-[#3b82f6] w-6 h-6"/></div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#ef4444]/20 rounded-full flex items-center justify-center"><Flame className="text-[#ef4444] w-6 h-6"/></div>
              <div className="absolute inset-8 rounded-full border border-dashed border-primary/30 flex items-center justify-center">
                <Circle className="w-4 h-4 text-primary/40" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
