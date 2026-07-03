import { useState } from "react";
import { useParams, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Activity, Calendar, FileText, Plus, TrendingUp, User } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useGetPatient, useListPainRecords, useListSessions, useGetPainTrends } from "@workspace/api-client-react";

// Demo data
const DEMO_PATIENT = { id: 1, name: "מרים כהן", age: 45, treatmentCount: 12, avgPainScore: 4.5, improvementPct: 30, notes: "רגישות גבוהה בכפות רגליים. עובדת בעבודה יושבנית.", phone: "050-1234567" };
const DEMO_SESSIONS = [
  { id: 1, date: "2023-10-15T10:00:00Z", durationMin: 45, notes: "התמקדות באלמנט המים. המטופלת דיווחה על שיפור בשינה." },
  { id: 2, date: "2023-10-08T10:00:00Z", durationMin: 50, notes: "רגישות באזור הכבד. עבודה עדינה לשחרור כעסים." }
];
const DEMO_PAIN_RECORDS = [
  { id: 1, date: "2023-10-15", bodyArea: "גב תחתון", painIntensity: 6, painType: "קהה" },
  { id: 2, date: "2023-10-08", bodyArea: "שכמות", painIntensity: 8, painType: "נוקשות" }
];
const DEMO_TRENDS = [
  { date: "10/09", avgPain: 7.5, sessionCount: 1 },
  { date: "17/09", avgPain: 6.8, sessionCount: 1 },
  { date: "24/09", avgPain: 6.0, sessionCount: 1 },
  { date: "01/10", avgPain: 5.2, sessionCount: 1 },
  { date: "08/10", avgPain: 5.5, sessionCount: 1 },
  { date: "15/10", avgPain: 4.5, sessionCount: 1 },
];

export default function PatientDetail() {
  const params = useParams();
  const id = Number(params.id);

  // In a real app we'd use these, here we fallback to demo data gracefully
  const { data: patientData } = useGetPatient(id, { query: { enabled: !!id && !isNaN(id) } });
  const { data: recordsData } = useListPainRecords({ patientId: id }, { query: { enabled: !!id && !isNaN(id) } });
  const { data: sessionsData } = useListSessions({ patientId: id }, { query: { enabled: !!id && !isNaN(id) } });
  const { data: trendsData } = useGetPainTrends({ patientId: id, period: "month" }, { query: { enabled: !!id && !isNaN(id) } });

  const patient = patientData && typeof patientData === "object" && "name" in patientData ? patientData : DEMO_PATIENT;
  const sessions = Array.isArray(sessionsData) && sessionsData.length > 0 ? sessionsData : DEMO_SESSIONS;
  const records = Array.isArray(recordsData) && recordsData.length > 0 ? recordsData : DEMO_PAIN_RECORDS;
  const trends = Array.isArray(trendsData) && trendsData.length > 0 ? trendsData : DEMO_TRENDS;

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="bg-gradient-to-l from-primary/10 to-transparent border-none shadow-sm">
        <CardContent className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-foreground">{patient.name}</h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span>גיל {patient.age}</span>
                {patient.phone && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/50"></span>
                    <span>{patient.phone}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="bg-card px-4 py-2 rounded-lg border shadow-sm flex-1 md:flex-initial text-center">
              <span className="block text-xs text-muted-foreground mb-1">טיפולים</span>
              <span className="font-semibold text-lg">{patient.treatmentCount}</span>
            </div>
            <div className="bg-card px-4 py-2 rounded-lg border shadow-sm flex-1 md:flex-initial text-center">
              <span className="block text-xs text-muted-foreground mb-1">כאב ממוצע</span>
              <span className="font-semibold text-lg text-rose-500">{patient.avgPainScore}</span>
            </div>
            <div className="bg-card px-4 py-2 rounded-lg border shadow-sm flex-1 md:flex-initial text-center">
              <span className="block text-xs text-muted-foreground mb-1">שיפור</span>
              <span className="font-semibold text-lg text-emerald-500">{patient.improvementPct}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto border-b rounded-none h-12 bg-transparent space-x-reverse space-x-6 px-2">
          <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-3">מבט על</TabsTrigger>
          <TabsTrigger value="pain" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-3">תיעוד כאב</TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-3">היסטוריית טיפולים</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-2 shadow-sm border-none">
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  מגמת כאב
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trends} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                      <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} domain={[0, 10]} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        labelStyle={{ fontWeight: 'bold', color: '#374151' }}
                      />
                      <Line type="monotone" dataKey="avgPain" stroke="#0d9488" strokeWidth={3} dot={{ r: 4, fill: '#0d9488', strokeWidth: 0 }} activeDot={{ r: 6 }} name="רמת כאב" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="shadow-sm border-none bg-primary/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground uppercase">הערות מטפל</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{patient.notes || "אין הערות כלליות."}</p>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-none">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground uppercase">פעולות</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href={`/pain-record/new?patientId=${patient.id}`} className="w-full block">
                    <Button variant="outline" className="w-full justify-start gap-2 h-10">
                      <Activity className="w-4 h-4 text-rose-500" />
                      הוסף רשומת כאב
                    </Button>
                  </Link>
                  <Link href={`/treatment?patientId=${patient.id}`} className="w-full block">
                    <Button variant="outline" className="w-full justify-start gap-2 h-10">
                      <FileText className="w-4 h-4 text-blue-500" />
                      תוכנית טיפול חדשה
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pain" className="mt-6">
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium">רשומות כאב אחרונות</CardTitle>
              <Link href={`/pain-record/new?patientId=${patient.id}`}>
                <Button size="sm" className="gap-2"><Plus className="w-4 h-4"/> רשומה חדשה</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {records.map(record => (
                  <div key={record.id} className="p-4 rounded-xl border bg-card flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-foreground">{record.bodyArea}</h4>
                      <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(record.date).toLocaleDateString('he-IL')} • {record.painType}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold" style={{
                      backgroundColor: record.painIntensity > 7 ? '#fee2e2' : record.painIntensity > 4 ? '#fef3c7' : '#dcfce7',
                      color: record.painIntensity > 7 ? '#dc2626' : record.painIntensity > 4 ? '#d97706' : '#16a34a'
                    }}>
                      {record.painIntensity}
                    </div>
                  </div>
                ))}
                {records.length === 0 && <div className="text-center text-muted-foreground py-8">אין רשומות כאב.</div>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-medium">יומן טיפולים</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative border-r-2 border-primary/20 pr-6 space-y-8 py-4 mr-2">
                {sessions.map(session => (
                  <div key={session.id} className="relative">
                    <span className="absolute -right-[33px] top-1 w-4 h-4 rounded-full bg-primary ring-4 ring-card"></span>
                    <div className="bg-card p-4 rounded-xl border shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{new Date(session.date).toLocaleDateString('he-IL')}</h4>
                        <span className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">{session.durationMin} דקות</span>
                      </div>
                      <p className="text-sm text-foreground/80 leading-relaxed">{session.notes}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
