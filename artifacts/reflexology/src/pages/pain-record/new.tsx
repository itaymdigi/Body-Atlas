import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Activity } from "lucide-react";
// import { useCreatePainRecord } from "@workspace/api-client-react";

const formSchema = z.object({
  date: z.string().min(1, "תאריך חובה"),
  bodyArea: z.string().min(2, "אזור גוף חובה"),
  side: z.string().min(1, "צד חובה"),
  painIntensity: z.number().min(0).max(10),
  sensitivityLevel: z.string().min(1, "רמת רגישות חובה"),
  pressureDepth: z.string().min(1, "עומק לחץ חובה"),
  painType: z.string().min(1, "סוג כאב חובה"),
  notes: z.string().optional(),
  recommendation: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewPainRecord() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  // const createRecord = useCreatePainRecord();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      bodyArea: "",
      side: "מרכז",
      painIntensity: 5,
      sensitivityLevel: "בינונית",
      pressureDepth: "בינוני",
      painType: "עמום",
      notes: "",
      recommendation: "",
    },
  });

  const intensity = form.watch("painIntensity");

  const onSubmit = (data: FormValues) => {
    // In a real app we'd get patientId from query params and use createRecord mutation
    console.log(data);
    toast({
      title: "נשמר בהצלחה",
      description: "רשומת הכאב התווספה לתיק המטופל.",
    });
    setLocation("/patients");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-10">
      <header>
        <h1 className="text-3xl font-light text-primary flex items-center gap-3">
          <Activity className="w-8 h-8" />
          תיעוד כאב חדש
        </h1>
        <p className="text-muted-foreground mt-2">הוספת רשומת כאב, רגישות או חסימה מטיפול.</p>
      </header>

      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="grid md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>תאריך</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bodyArea"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>אזור בגוף / כף רגל</FormLabel>
                      <FormControl>
                        <Input placeholder="לדוגמה: כתף ימין, קשת פנימית..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="side"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>צד</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ימין">ימין</SelectItem>
                          <SelectItem value="שמאל">שמאל</SelectItem>
                          <SelectItem value="מרכז">מרכז/שניהם</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="pt-4 border-t border-border/50">
                <FormField
                  control={form.control}
                  name="painIntensity"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <div className="flex justify-between items-center">
                        <FormLabel className="text-base">עוצמת כאב / רגישות</FormLabel>
                        <span className="font-bold text-xl" style={{
                          color: intensity > 7 ? '#dc2626' : intensity > 4 ? '#d97706' : '#16a34a'
                        }}>{intensity}/10</span>
                      </div>
                      <FormControl>
                        <Slider 
                          min={0} max={10} step={1} 
                          value={[field.value]} 
                          onValueChange={(vals) => field.onChange(vals[0])}
                          className="py-4"
                        />
                      </FormControl>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>ללא כאב</span>
                        <span>כאב בינוני</span>
                        <span>כאב בלתי נסבל</span>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-border/50">
                <FormField
                  control={form.control}
                  name="painType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>סוג כאב</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="חד">חד / דוקר</SelectItem>
                          <SelectItem value="קהה">קהה / עמום</SelectItem>
                          <SelectItem value="לחץ">לחץ / כיווץ</SelectItem>
                          <SelectItem value="צריבה">צריבה / שריפה</SelectItem>
                          <SelectItem value="עקצוץ">עקצוץ / נימול</SelectItem>
                          <SelectItem value="נוקשות">נוקשות</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sensitivityLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>רמת רגישות למגע</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="נמוכה">נמוכה</SelectItem>
                          <SelectItem value="בינונית">בינונית</SelectItem>
                          <SelectItem value="גבוהה">גבוהה (קפיצה)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pressureDepth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>עומק לחץ שבוהה</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="שטחי">שטחי (עור)</SelectItem>
                          <SelectItem value="בינוני">בינוני (שריר)</SelectItem>
                          <SelectItem value="עמוק">עמוק (עצם/מפרק)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="pt-4 border-t border-border/50 space-y-4">
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>הערות קליניות</FormLabel>
                      <FormControl>
                        <Textarea placeholder="פירוט תחושות, הקשרים רגשיים שעלו בטיפול..." className="h-24" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="recommendation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>המלצה להמשך / תרגיל לבית</FormLabel>
                      <FormControl>
                        <Input placeholder="לדוגמה: תרגילי נשימה, חימום המקום..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="pt-4 flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => setLocation("/patients")}>ביטול</Button>
                <Button type="submit">שמירת רשומה</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
