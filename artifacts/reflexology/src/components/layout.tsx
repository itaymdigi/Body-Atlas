import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Home, Users, Search, Activity, FileText, Info, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "בית", icon: Home },
  { href: "/patients", label: "מטופלים", icon: Users },
  { href: "/vital-zones", label: "אזורים", icon: Search },
  { href: "/pause", label: "עצירה", icon: Activity },
  { href: "/progress", label: "דוחות", icon: BarChart2 },
  { href: "/disclaimer", label: "מידע", icon: Info },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="flex min-h-[100dvh] w-full bg-background flex-col md:flex-row rtl">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-l bg-card px-4 py-6 sticky top-0 h-screen shrink-0">
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
            ר
          </div>
          <span className="text-lg font-bold text-foreground">רפלקסולוגיה</span>
        </div>
        
        <nav className="flex flex-col gap-2 flex-1">
          {NAV_ITEMS.map((item) => {
            const isActive = location === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="mt-auto">
          <div className="px-4 py-4 rounded-xl bg-primary/5 text-center text-sm text-primary">
            <span className="block font-medium">מרחב למודעות</span>
            <span className="block text-xs opacity-80 mt-1">גרסת בטא</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col pb-20 md:pb-0 overflow-y-auto">
        <div className="max-w-5xl w-full mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card border-t flex items-center justify-around px-2 z-50">
        {NAV_ITEMS.slice(0, 5).map((item) => {
          const isActive = location === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
