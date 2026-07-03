import { useState } from "react";
import { Link } from "wouter";
import { useListPatients } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, User, Activity, TrendingUp, Calendar } from "lucide-react";

// Demo data fallback
const DEMO_PATIENTS = [
  { id: 1, name: "מרים כהן", age: 45, treatmentCount: 12, avgPainScore: 4.5, improvementPct: 30, lastTreatmentDate: "2023-10-15T10:00:00Z" },
  { id: 2, name: "יוסף לוי", age: 52, treatmentCount: 5, avgPainScore: 6.2, improvementPct: 15, lastTreatmentDate: "2023-10-12T14:30:00Z" },
  { id: 3, name: "רחל אברהם", age: 38, treatmentCount: 24, avgPainScore: 2.1, improvementPct: 75, lastTreatmentDate: "2023-10-10T09:15:00Z" },
  { id: 4, name: "דוד ששון", age: 61, treatmentCount: 2, avgPainScore: 7.8, improvementPct: 5, lastTreatmentDate: "2023-10-18T11:00:00Z" },
];

export default function PatientsList() {
  const { data: patients, isLoading } = useListPatients();
  const [searchTerm, setSearchTerm] = useState("");

  const displayPatients = (patients && patients.length > 0) ? patients : DEMO_PATIENTS;
  
  const filteredPatients = displayPatients.filter(p => 
    p.name.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-light text-primary">מטופלים</h1>
          <p className="text-muted-foreground mt-1">ניהול תיקים אישיים ומעקב התקדמות</p>
        </div>
        <Button className="shrink-0 gap-2">
          <Plus className="w-4 h-4" />
          מטופל חדש
        </Button>
      </header>

      <div className="relative max-w-md">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="חיפוש מטופל..." 
          className="pr-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredPatients.map(patient => (
          <Link key={patient.id} href={`/patients/${patient.id}`}>
            <Card className="hover:border-primary/50 transition-colors cursor-pointer group bg-card hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">{patient.name}</h3>
                      <p className="text-sm text-muted-foreground">גיל {patient.age}</p>
                    </div>
                  </div>
                  <div className="px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-medium">
                    {patient.treatmentCount} טיפולים
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border/50">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                      <Activity className="w-3 h-3" />
                      <span className="text-[10px] uppercase">כאב ממוצע</span>
                    </div>
                    <span className="font-medium">{patient.avgPainScore.toFixed(1)}/10</span>
                  </div>
                  <div className="text-center border-r border-border/50">
                    <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                      <TrendingUp className="w-3 h-3 text-emerald-500" />
                      <span className="text-[10px] uppercase">שיפור</span>
                    </div>
                    <span className="font-medium text-emerald-600">{patient.improvementPct}%</span>
                  </div>
                  <div className="text-center border-r border-border/50">
                    <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                      <Calendar className="w-3 h-3" />
                      <span className="text-[10px] uppercase">ביקור אחרון</span>
                    </div>
                    <span className="font-medium text-sm">
                      {patient.lastTreatmentDate 
                        ? new Date(patient.lastTreatmentDate).toLocaleDateString('he-IL', {day: 'numeric', month:'numeric'})
                        : '-'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
        {filteredPatients.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground bg-muted/30 rounded-xl border border-dashed">
            לא נמצאו מטופלים התואמים לחיפוש.
          </div>
        )}
      </div>
    </div>
  );
}
