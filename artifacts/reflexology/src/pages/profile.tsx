import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Settings, Bell, Shield, ChevronLeft, Edit2, LogOut, HelpCircle, Star, TrendingUp, Calendar, Activity } from "lucide-react";

const STATS = [
  { label: "זמן כולל", value: "28\nשעות", icon: Calendar, color: "text-teal-600", bg: "bg-teal-50" },
  { label: "רגשות נוספו", value: "4.2\nממוצע", icon: Star, color: "text-amber-600", bg: "bg-amber-50" },
  { label: "טיפולים", value: "28", icon: Activity, color: "text-purple-600", bg: "bg-purple-50" },
  { label: "שיפור", value: "42%", icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
];

const MENU_ITEMS = [
  { icon: Bell, label: "התראות", sub: "מפגשים תזכורות", href: "#" },
  { icon: Settings, label: "הגדרות", sub: "שפה, נגישות ועיצוב", href: "#" },
  { icon: Shield, label: "פרטיות ואבטחה", sub: "נתוני הפרופיל שלך", href: "#" },
  { icon: HelpCircle, label: "עזרה ותמיכה", sub: "שאלות נפוצות", href: "#" },
  { icon: Shield, label: "חשוב לדעת", sub: "הצהרת בריאות", href: "/disclaimer" },
];

export default function Profile() {
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("דנה לוי");

  return (
    <div className="flex flex-col gap-6" data-testid="profile-page">
      {/* Header */}
      <div className="pb-3 border-b border-border flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">הפרופיל שלי</h1>
        <button
          data-testid="edit-profile-btn"
          onClick={() => setEditMode(!editMode)}
          className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <Edit2 className="w-4 h-4"/>
        </button>
      </div>

      {/* Avatar & name */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-4 py-4"
      >
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {name.charAt(0)}
          </div>
          {editMode && (
            <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow-md">
              <Edit2 className="w-3 h-3"/>
            </button>
          )}
        </div>
        {editMode ? (
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            className="text-2xl font-bold text-center bg-transparent border-b-2 border-primary outline-none text-foreground"
            data-testid="edit-name-input"
          />
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground">{name}</h2>
            <p className="text-muted-foreground text-sm mt-1">מתרגלת רפלקסולוגיה · מאז ינואר 2026</p>
          </div>
        )}
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="border-none shadow-sm bg-card">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`}/>
                </div>
                <div>
                  <div className="text-base font-bold text-foreground whitespace-pre-line leading-tight">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent sessions section */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">הטיפולים האחרונים שלי</h3>
            <Link href="/progress"><span className="text-xs text-primary hover:underline">הכל</span></Link>
          </div>
          <div className="space-y-3">
            {[
              { date: "3.7.2026", patient: "מרים כהן", duration: "45 דקות", pain_before: 7, pain_after: 3 },
              { date: "2.7.2026", patient: "יוסף לוי", duration: "50 דקות", pain_before: 6, pain_after: 2 },
              { date: "1.7.2026", patient: "רחל אברהם", duration: "60 דקות", pain_before: 8, pain_after: 4 },
            ].map((session, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Activity className="w-4 h-4 text-primary"/>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">{session.patient}</div>
                  <div className="text-xs text-muted-foreground">{session.date} · {session.duration}</div>
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="text-rose-500 font-semibold">{session.pain_before}</span>
                  <span>→</span>
                  <span className="text-teal-600 font-semibold">{session.pain_after}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Menu items */}
      <Card className="border-none shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {MENU_ITEMS.map((item, i) => (
            <Link href={item.href} key={i}>
              <div className={`flex items-center gap-4 px-5 py-4 hover:bg-muted/40 transition-colors cursor-pointer ${i < MENU_ITEMS.length - 1 ? "border-b border-border" : ""}`}
                data-testid={`menu-item-${i}`}>
                <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-4 h-4 text-muted-foreground"/>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">{item.label}</div>
                  <div className="text-xs text-muted-foreground">{item.sub}</div>
                </div>
                <ChevronLeft className="w-4 h-4 text-muted-foreground rotate-180"/>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>

      {/* Logout */}
      <Button variant="ghost" className="text-muted-foreground hover:text-destructive" data-testid="logout-btn">
        <LogOut className="w-4 h-4 ml-2"/>
        התנתקות
      </Button>

      <p className="text-center text-xs text-muted-foreground pb-4">
        רפלקסולוגיה — מרחב למודעות · גרסת בטא 1.0
      </p>
    </div>
  );
}
