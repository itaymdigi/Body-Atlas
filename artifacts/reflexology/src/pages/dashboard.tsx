import { useGetDashboardStats, useGetRecentActivity } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { UserPlus, Pause, Search, Footprints, Wind, Layers, Activity } from "lucide-react";

const QUICK_ACTIONS = [
  { href: "/patients/new", label: "מטופל חדש", icon: UserPlus, color: "bg-blue-50 text-blue-600" },
  { href: "/pause", label: "עצירה עכשיו", icon: Pause, color: "bg-teal-50 text-teal-600" },
  { href: "/foot-model", label: "מודל תלת-ממדי", icon: Footprints, color: "bg-purple-50 text-purple-600" },
  { href: "/vital-zones", label: "אזורים חיוניים", icon: Search, color: "bg-rose-50 text-rose-600" },
  { href: "/elements", label: "4 היסודות", icon: Wind, color: "bg-amber-50 text-amber-600" },
  { href: "/layers", label: "שכבות מודעות", icon: Layers, color: "bg-indigo-50 text-indigo-600" },
  { href: "/pain-record/new", label: "מפת כאב", icon: Activity, color: "bg-red-50 text-red-600" },
];

export default function Dashboard() {
  const { data: stats } = useGetDashboardStats();
  const { data: activities } = useGetRecentActivity();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="space-y-2">
        <h1 className="text-3xl font-light tracking-tight text-primary">שלום, איך הגוף שלך היום?</h1>
        <p className="text-muted-foreground text-lg">מעקב, מודעות והרפיה לחיים מאוזנים יותר.</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {QUICK_ACTIONS.map((action, i) => (
          <motion.div
            key={action.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link href={action.href}>
              <Card className="hover:shadow-md transition-all cursor-pointer h-full border-none shadow-sm bg-gradient-to-br from-card to-card/50">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${action.color}`}>
                    <action.icon className="w-6 h-6" />
                  </div>
                  <span className="font-medium text-sm text-foreground">{action.label}</span>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-medium">פעילות אחרונה</CardTitle>
          </CardHeader>
          <CardContent>
            {activities && activities.length > 0 ? (
              <ul className="space-y-4">
                {activities.map((activity, i) => (
                  <li key={i} className="flex justify-between items-center text-sm border-b pb-4 last:border-0 last:pb-0">
                    <span className="font-medium">{activity.description}</span>
                    <span className="text-muted-foreground">{new Date(activity.timestamp).toLocaleDateString("he-IL")}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-muted-foreground text-sm flex flex-col items-center py-6 text-center">
                <span className="block mb-2">אין נתונים להצגה כרגע.</span>
                <span className="opacity-80">נסו להוסיף מטופלים או רשומות כאב</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-primary text-primary-foreground">
          <CardContent className="p-8 flex flex-col items-center justify-center text-center space-y-6 min-h-[250px]">
            <Activity className="w-12 h-12 opacity-80" />
            <div>
              <h3 className="text-xl font-medium mb-2">מוכנים לטיפול הבא?</h3>
              <p className="opacity-90 text-sm">הגדירו מטרות, התמקדו באזורים הרגישים והתחילו לתעד.</p>
            </div>
            <Link href="/treatment" className="w-full">
              <Button variant="secondary" className="w-full rounded-full bg-white/20 hover:bg-white/30 text-white border-none transition-colors">
                התחלת תוכנית טיפול
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
