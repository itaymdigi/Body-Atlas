import { ShieldAlert } from "lucide-react";

export default function Disclaimer() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-light text-primary">הצהרת אחריות וגבולות גזרה</h1>
        
        <div className="text-right space-y-6 text-muted-foreground leading-relaxed bg-card p-8 rounded-2xl border shadow-sm mt-8">
          <p className="font-medium text-foreground">
            האפליקציה נועדה למטרות מודעות גוף, תיעוד קליני לרפלקסולוגים ולמידה עצמית בלבד. היא אינה מהווה תחליף לייעוץ או טיפול רפואי מקצועי.
          </p>
          
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">חשוב לדעת:</h3>
            <ul className="list-disc list-inside pr-4 space-y-2">
              <li>המידע המוצג במפות ההשתקפות (אזורים חיוניים) מבוסס על מסורות הטיפול ההוליסטי והרפלקסולוגיה. הוא אינו משמש לאבחון מחלות.</li>
              <li>כל שימוש באפליקציה לצורך הרפיה עצמית נמצא באחריות המשתמש בלבד.</li>
              <li>אין לשנות או להפסיק טיפול תרופתי בעקבות שימוש באפליקציה או בעקבות טיפול רפלקסולוגי ללא התייעצות עם רופא מטפל.</li>
            </ul>
          </div>

          <div className="space-y-2 bg-destructive/5 p-4 rounded-lg border border-destructive/10 text-destructive-foreground/90">
            <h3 className="font-semibold text-destructive">מצבים המחייבים פנייה לרופא:</h3>
            <p className="text-sm">
              בכל מקרה של כאב אקוטי או בלתי מוסבר, הופעת תסמינים חדשים, הריון (בפרט שליש ראשון), סוכרת עם נוירופתיה, בעיות כלי דם קשות, דלקות זיהומיות או מצוקה נפשית חריפה - חובה לפנות לייעוץ רפואי, פסיכולוגי או לפיזיותרפיסט מוסמך באופן מיידי.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
