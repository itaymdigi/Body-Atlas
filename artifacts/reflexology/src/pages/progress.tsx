import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, Calendar, HeartPulse } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

// Demo data
const TREND_DATA = [
  { name: 'שבוע 1', pain: 6.5, sessions: 12 },
  { name: 'שבוע 2', pain: 5.8, sessions: 15 },
  { name: 'שבוע 3', pain: 5.0, sessions: 10 },
  { name: 'שבוע 4', pain: 4.2, sessions: 18 },
];

const ZONES_DATA = [
  { name: 'סרעפת', count: 45 },
  { name: 'גב תחתון', count: 32 },
  { name: 'צוואר', count: 28 },
  { name: 'כבד', count: 15 },
  { name: 'ראש', count: 12 },
];

export default function Progress() {
  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-light text-primary">דוחות והתקדמות</h1>
          <p className="text-muted-foreground mt-1">מבט רחב על מגמות המטופלים והקליניקה</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          ייצוא דוח
        </Button>
      </header>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-none shadow-sm bg-gradient-to-br from-card to-emerald-50/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2 text-muted-foreground">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium uppercase tracking-wider">שיפור ממוצע</span>
            </div>
            <div className="text-4xl font-light text-emerald-600">24%</div>
            <p className="text-xs text-muted-foreground mt-2">ירידה ברמות הכאב המדווחות החודש</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-gradient-to-br from-card to-blue-50/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium uppercase tracking-wider">טיפולים החודש</span>
            </div>
            <div className="text-4xl font-light text-blue-600">55</div>
            <p className="text-xs text-muted-foreground mt-2">12 טיפולים יותר מחודש שעבר</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-gradient-to-br from-card to-purple-50/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2 text-muted-foreground">
              <HeartPulse className="w-4 h-4" />
              <span className="text-sm font-medium uppercase tracking-wider">אזור נפוץ לטיפול</span>
            </div>
            <div className="text-2xl font-medium text-purple-600 mt-2">סרעפת ומקלעת השמש</div>
            <p className="text-xs text-muted-foreground mt-2">מופיע ב-65% מהטיפולים</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="month" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="week">שבועי</TabsTrigger>
          <TabsTrigger value="month">חודשי</TabsTrigger>
          <TabsTrigger value="year">שנתי</TabsTrigger>
        </TabsList>

        <TabsContent value="month" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-medium">מגמת כאב כללית (ממוצע 0-10)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={TREND_DATA} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#6b7280' }} dy={10} />
                      <YAxis tickLine={false} axisLine={false} tick={{ fill: '#6b7280' }} domain={[0, 10]} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Line type="monotone" dataKey="pain" stroke="#0d9488" strokeWidth={3} dot={{ r: 4, fill: '#0d9488', strokeWidth: 0 }} activeDot={{ r: 6 }} name="ממוצע כאב" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-medium">אזורי טיפול שכיחים</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ZONES_DATA} margin={{ top: 20, right: 0, left: -20, bottom: 0 }} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                      <XAxis type="number" tickLine={false} axisLine={false} tick={{ fill: '#6b7280' }} />
                      <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tick={{ fill: '#4b5563', fontSize: 13 }} dx={-10} width={80} />
                      <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="count" fill="#14b8a6" radius={[0, 4, 4, 0]} name="מספר דיווחים/טיפולים" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
