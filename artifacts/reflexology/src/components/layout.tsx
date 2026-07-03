import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Home, Users, Footprints, Pause, BarChart2, Info, MessageCircle, Layers, BookOpen, User } from "lucide-react";
import { cn } from "@/lib/utils";

const BOTTOM_NAV = [
  { href: "/", label: "בית", icon: Home },
  { href: "/ai-guide", label: "AI מדריך", icon: MessageCircle },
  { href: "/programs", label: "תכניות", icon: BookOpen },
  { href: "/pause", label: "עצירה", icon: Pause },
  { href: "/profile", label: "פרופיל", icon: User },
];

const SIDEBAR_NAV = [
  { href: "/", label: "בית", icon: Home },
  { href: "/patients", label: "מטופלים", icon: Users },
  { href: "/foot-model", label: "מפת כף הרגל", icon: Footprints },
  { href: "/vital-zones", label: "אזורים חיוניים", icon: Footprints },
  { href: "/elements", label: "4 היסודות", icon: Layers },
  { href: "/layers", label: "שכבות", icon: Layers },
  { href: "/programs", label: "תכניות", icon: BookOpen },
  { href: "/ai-guide", label: "AI מדריך", icon: MessageCircle },
  { href: "/pause", label: "עצירה עכשיו", icon: Pause },
  { href: "/progress", label: "דוחות", icon: BarChart2 },
  { href: "/profile", label: "פרופיל", icon: User },
  { href: "/disclaimer", label: "חשוב לדעת", icon: Info },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="flex min-h-dvh w-full bg-background flex-col md:flex-row rtl">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-60 flex-col border-l bg-card px-3 py-5 sticky top-0 h-dvh shrink-0 overflow-y-auto safe-area-top">
        <div className="flex items-center gap-3 px-3 mb-6">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
            ר
          </div>
          <div>
            <div className="text-sm font-bold text-foreground">רפלקסולוגיה</div>
            <div className="text-[10px] text-muted-foreground">מרחב למודעות</div>
          </div>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {SIDEBAR_NAV.map((item) => {
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
                {isActive && <div className="mr-auto w-1.5 h-1.5 rounded-full bg-primary"/>}
              </Link>
            );
          })}
        </nav>

        <div className="mt-4 px-3 py-3 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-100">
          <div className="text-xs font-semibold text-teal-700">גרסת בטא</div>
          <div className="text-[10px] text-teal-600/80 mt-0.5">הכנות האפליקציה לשחרור</div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0 overflow-y-auto min-h-0">
        <div className="max-w-5xl w-full mx-auto p-4 md:p-6 safe-area-top md:pt-6">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Tab Bar */}
      <nav
        aria-label="ניווט ראשי"
        className="md:hidden fixed bottom-0 left-0 right-0 h-[60px] bg-card/95 backdrop-blur-md border-t border-border flex items-center justify-around px-2 z-50 safe-area-bottom"
      >
        {BOTTOM_NAV.map((item) => {
          const isActive = location === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1 transition-all relative min-w-11"
              , isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-primary"/>
              )}
              <item.icon className={cn("w-5 h-5 transition-transform", isActive && "scale-110")} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
