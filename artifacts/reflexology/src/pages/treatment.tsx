import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { FileText, Sparkles } from "lucide-react";

const GOALS = [
  "הפחתת מתח כללי",
  "שיפור מודעות גוף",
  "תמיכה בהרפיה",
  "שיפור שינה",
  "זיהוי דפוסי כאב חוזרים",
  "מודעות לנשימה/סרעפת"
];

const ELEMENTS = ["אדמה", "מים", "אש", "אוויר", "משולב"];

export default function Treatment() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [summary, setSummary] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGoalToggle = (goal: string) => {
    setSelectedGoals(prev => 
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
    );
  };

  const generateSummary = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setSummary(`התוכנית מתמקדת ב${selectedGoals.length > 0 ? selectedGoals.join(", ") : 'איזון כללי'}. נשים דגש על האלמנטים הנבחרים תוך עבודה עמוקה על רפלקסולוגיה משחררת. מומלץ מעקב שבועי.`);
      setIsGenerating(false);
    }, 1500);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "תוכנית הטיפול נשמרה",
      description: "התוכנית התווספה בהצלחה.",
    });
    setLocation("/patients");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-10">
      <header>
        <h1 className="text-3xl font-light text-primary flex items-center gap-3">
          <FileText className="w-8 h-8" />
          בניית תוכנית טיפול
        </h1>
        <p className="text-muted-foreground mt-2">הגדרת מטרות, מיקוד ויצירת רצף טיפולי רפלקסולוגי.</p>
      </header>

      <form onSubmit={onSubmit} className="space-y-6">
        <Card className="border-none shadow-sm">
          <CardContent className="p-6 space-y-6">
            
            <div className="space-y-4">
              <Label className="text-lg font-medium">מטרות הטיפול</Label>
              <div className="grid sm:grid-cols-2 gap-3">
                {GOALS.map(goal => (
                  <div key={goal} className="flex items-center space-x-2 space-x-reverse border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                    <Checkbox 
                      id={`goal-${goal}`} 
                      checked={selectedGoals.includes(goal)}
                      onCheckedChange={() => handleGoalToggle(goal)}
                    />
                    <Label htmlFor={`goal-${goal}`} className="cursor-pointer flex-1 font-normal text-sm">
                      {goal}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-border/50">
              <div className="space-y-2">
                <Label>אלמנט מוביל למיקוד</Label>
                <Select defaultValue="אדמה">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ELEMENTS.map(el => <SelectItem key={el} value={el}>{el}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>משך פגישה (דקות)</Label>
                <Input type="number" defaultValue={45} />
              </div>
              <div className="space-y-2">
                <Label>תדירות (פגישות בשבוע)</Label>
                <Input type="number" defaultValue={1} />
              </div>
              <div className="space-y-2">
                <Label>תאריך מעקב / הערכה מחדש</Label>
                <Input type="date" />
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-border/50">
              <Label>אזורי רפלקסולוגיה מרכזיים לעבודה</Label>
              <Input placeholder="לדוגמה: סרעפת, מקלעת השמש, עמוד שדרה..." />
            </div>

          </CardContent>
        </Card>

        <Card className="border border-primary/20 bg-primary/5 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <Label className="text-lg font-medium text-primary">סיכום התוכנית</Label>
              <Button type="button" variant="outline" size="sm" onClick={generateSummary} disabled={isGenerating} className="gap-2 bg-white/50">
                <Sparkles className="w-4 h-4 text-amber-500" />
                {isGenerating ? "מייצר סיכום..." : "צור סיכום חכם"}
              </Button>
            </div>
            <Textarea 
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="כאן יופיע סיכום התוכנית..." 
              className="h-32 bg-white"
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => setLocation("/")}>ביטול</Button>
          <Button type="submit">שמירת תוכנית</Button>
        </div>
      </form>
    </div>
  );
}
