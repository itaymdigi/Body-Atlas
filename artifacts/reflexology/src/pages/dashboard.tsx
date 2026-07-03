import { useGetDashboardStats, useGetRecentActivity } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { UserPlus, Pause, Footprints, Wind, Layers, Activity, MessageCircle, TrendingUp, BookOpen, Zap } from "lucide-react";

const QUICK_ACTIONS = [
  { href: "/patients/new", label: "פריקה מהירה", sub: "מטופל חדש", icon: UserPlus, color: "from-blue-50 to-blue-100", icon_color: "text-blue-600", badge: null },
  { href: "/foot-model", label: "כפות רגליים", sub: "מיפוי מלא", icon: Footprints, color: "from-purple-50 to-purple-100", icon_color: "text-purple-600", badge: null },
  { href: "/pause", label: "כאב ואי נוחות", sub: "עצירה עכשיו", icon: Activity, color: "from-rose-50 to-rose-100", icon_color: "text-rose-600", badge: null },
  { href: "/vital-zones", label: "תרגול נשימה", sub: "4 דקות", icon: Wind, color: "from-teal-50 to-teal-100", icon_color: "text-teal-600", badge: null },
  { href: "/ai-guide", label: "AI מדריך", sub: "AI מדריך גוף", icon: MessageCircle, color: "from-amber-50 to-amber-100", icon_color: "text-amber-600", badge: null },
  { href: "/progress", label: "יומן דפוסים", sub: "מעקב שבועי", icon: TrendingUp, color: "from-indigo-50 to-indigo-100", icon_color: "text-indigo-600", badge: null },
];

const DEMO_STATS = { totalPatients: 12, totalSessions: 38, avgImprovementPct: 42, activePatientsThisWeek: 4 };
const DEMO_ACTIVITIES = [
  { id: 1, patientName: "מרים כהן", description: "שיפור בתדירות מיגרנה, עייפות — כליות ובלוטות", timestamp: new Date().toISOString() },
  { id: 2, patientName: "יוסף לוי", description: "המשך מיגרנה, הוספת עבודה על כבד ועיכול", timestamp: new Date(Date.now() - 86400000).toISOString() },
  { id: 3, patientName: "רחל אברהם", description: "מיגרנה — עבודה על אזורי ראש, סינוסים ועיניים", timestamp: new Date(Date.now() - 172800000).toISOString() },
];

export default function Dashboard() {
  const { data: stats } = useGetDashboardStats();
  const { data: activities } = useGetRecentActivity();

  const displayStats = stats && typeof stats === "object" && "totalPatients" in stats ? stats : DEMO_STATS;
  const displayActivities = Array.isArray(activities) && activities.length > 0 ? activities : DEMO_ACTIVITIES;

  const statItems = [
    { label: "מטופלים", value: displayStats.totalPatients, icon: UserPlus, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "טיפולים", value: displayStats.totalSessions, icon: Activity, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "שיפור ממוצע", value: `${displayStats.avgImprovementPct}%`, icon: TrendingUp, color: "text-teal-600", bg: "bg-teal-50" },
    { label: "פעילים השבוע", value: displayStats.activePatientsThisWeek, icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700" data-testid="dashboard-page">
      {/* Header */}
      <header className="space-y-1">
        <p className="text-sm text-muted-foreground font-medium">שלום, דנה</p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">איך הגוף שלך היום?</h1>
        <p className="text-muted-foreground text-sm">בחרי את מה שתשכלל כדי שתוכלי ללמוד יותר.</p>
      </header>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {QUICK_ACTIONS.map((action, i) => (
          <motion.div
            key={action.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Link href={action.href}>
              <div className={`bg-gradient-to-br ${action.color} rounded-2xl p-4 cursor-pointer hover:shadow-md transition-all border border-white/60 h-full flex flex-col items-center text-center gap-2`}
                data-testid={`quick-action-${i}`}>
                <div className={`w-10 h-10 rounded-xl bg-white/70 flex items-center justify-center ${action.icon_color}`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-foreground leading-tight">{action.label}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{action.sub}</div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statItems.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + i * 0.08 }}
          >
            <Card className="border-none shadow-sm bg-card">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <div>
                  <div className="text-xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-5 gap-4">
        {/* Recent activity */}
        <Card className="md:col-span-3 border-none shadow-sm bg-card">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">פעילות אחרונה</h3>
              <Link href="/patients">
                <span className="text-xs text-primary hover:underline">כל המטופלים</span>
              </Link>
            </div>
            <div className="space-y-3">
              {displayActivities.slice(0, 4).map((activity, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Activity className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(activity.timestamp).toLocaleDateString("he-IL")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right column */}
        <div className="md:col-span-2 flex flex-col gap-4">
          {/* CTA Card */}
          <Card className="border-none shadow-sm bg-primary text-primary-foreground">
            <CardContent className="p-5 flex flex-col gap-4">
              <div>
                <h3 className="text-base font-semibold mb-1">עצירה עכשיו</h3>
                <p className="text-primary-foreground/80 text-xs leading-relaxed">
                  לחץ על אזור שמרגיש מאומץ ולאחר מכן לפסוע לפנות.
                </p>
              </div>
              <Link href="/pause" className="w-full">
                <Button
                  data-testid="pause-now-btn"
                  variant="secondary"
                  className="w-full rounded-xl bg-white/20 hover:bg-white/30 text-white border-none text-sm"
                >
                  התחלי עצירה
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Programs preview */}
          <Card className="border-none shadow-sm bg-card">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground text-sm">תכניות</h3>
                <Link href="/programs">
                  <span className="text-xs text-primary hover:underline">הכל</span>
                </Link>
              </div>
              <div className="space-y-2">
                {[
                  { label: "הפחתת מתח", sub: "7–5 דקות", icon: "🌿", color: "bg-teal-50" },
                  { label: "שיפור שינה", sub: "10 דקות", icon: "🌙", color: "bg-indigo-50" },
                  { label: "איזון אנרגיה", sub: "14 דקות", icon: "⚡", color: "bg-amber-50" },
                ].map((prog, i) => (
                  <Link href="/programs" key={i}>
                    <div className={`flex items-center gap-3 p-2.5 rounded-xl ${prog.color} cursor-pointer hover:opacity-80 transition-opacity`}>
                      <span className="text-lg">{prog.icon}</span>
                      <div>
                        <div className="text-xs font-semibold text-foreground">{prog.label}</div>
                        <div className="text-[10px] text-muted-foreground">{prog.sub}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Daily check-in */}
          <Card className="border-none shadow-sm">
            <CardContent className="p-5">
              <h3 className="font-semibold text-sm text-foreground mb-3">בדיקה יומית</h3>
              <p className="text-xs text-muted-foreground mb-4">איך את מרגישה היום בגוף?</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "מצוין", icon: "😊", val: "good" },
                  { label: "בינוני", val: "ok", icon: "😐" },
                  { label: "קשה", val: "hard", icon: "😟" },
                ].map(opt => (
                  <button key={opt.val}
                    data-testid={`checkin-${opt.val}`}
                    className="flex flex-col items-center gap-1 p-2 rounded-xl bg-muted/40 hover:bg-primary/10 hover:text-primary transition-colors text-xs text-muted-foreground border border-transparent hover:border-primary/20">
                    <span className="text-xl">{opt.icon}</span>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-3 text-xs text-primary h-8" asChild>
                <Link href="/progress">המשך</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom educational section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { href: "/elements", label: "4 היסודות", desc: "אש, מים, אוויר, אדמה", icon: Wind, color: "text-amber-600", bg: "bg-amber-50" },
          { href: "/layers", label: "שכבות אנטומיה", desc: "עור, שריר, עצבים", icon: Layers, color: "text-indigo-600", bg: "bg-indigo-50" },
          { href: "/ai-guide", label: "AI מדריך גוף", desc: "הנחיה אישית", icon: MessageCircle, color: "text-teal-600", bg: "bg-teal-50" },
          { href: "/disclaimer", label: "חשוב לדעת", desc: "הצהרת בריאות", icon: BookOpen, color: "text-slate-600", bg: "bg-slate-50" },
        ].map((item, i) => (
          <Link href={item.href} key={i}>
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-border hover:shadow-sm transition-all cursor-pointer">
              <div className={`w-9 h-9 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0`}>
                <item.icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium text-foreground truncate">{item.label}</div>
                <div className="text-xs text-muted-foreground truncate">{item.desc}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
