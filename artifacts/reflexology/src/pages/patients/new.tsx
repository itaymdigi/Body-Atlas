import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { UserPlus } from "lucide-react";
// import { useCreatePatient } from "@workspace/api-client-react";

const formSchema = z.object({
  name: z.string().min(2, "שם חובה"),
  age: z.coerce.number().min(1, "גיל חובה"),
  phone: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewPatient() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  // const createPatient = useCreatePatient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: 30,
      phone: "",
      notes: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    // In a real app we'd use createPatient mutation
    console.log(data);
    toast({
      title: "מטופל חדש נוצר",
      description: "המטופל התווסף למערכת בהצלחה.",
    });
    setLocation("/patients");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-10">
      <header>
        <h1 className="text-3xl font-light text-primary flex items-center gap-3">
          <UserPlus className="w-8 h-8" />
          מטופל חדש
        </h1>
        <p className="text-muted-foreground mt-2">הוספת פרופיל מטופל חדש למערכת.</p>
      </header>

      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>שם מלא</FormLabel>
                      <FormControl>
                        <Input placeholder="ישראל ישראלי" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>גיל</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>טלפון (אופציונלי)</FormLabel>
                    <FormControl>
                      <Input placeholder="050-0000000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>הערות כלליות (אופציונלי)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="רקע רפואי רלוונטי, סיבת פנייה ראשונית..." className="h-24" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-4 flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => setLocation("/patients")}>ביטול</Button>
                <Button type="submit">יצירת מטופל</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
