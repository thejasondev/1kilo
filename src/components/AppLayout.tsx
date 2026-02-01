import { Outlet, NavLink } from "react-router-dom";
import { BookOpen, Dumbbell, TrendingUp, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      {/* Main Content Area */}
      {/* Pb-24 ensures content isn't hidden behind the floating navbar */}
      <main className="flex-1 px-4 py-8 pb-32">
        <Outlet />
      </main>

      {/* Floating Bottom Navigation */}
      <nav className="fixed bottom-4 left-4 right-4 z-50">
        <div className="mx-auto max-w-md rounded-2xl border bg-card/90 px-2 py-3 shadow-lg backdrop-blur-md supports-[backdrop-filter]:bg-card/60">
          <div className="flex items-center justify-around">
            <NavItem to="/diary" icon={BookOpen} label="Diario" />
            <NavItem to="/workout" icon={Dumbbell} label="Entreno" />
            <NavItem to="/progress" icon={TrendingUp} label="Progreso" />
            <NavItem to="/profile" icon={User} label="Perfil" />
          </div>
        </div>
      </nav>
    </div>
  );
}

function NavItem({
  to,
  icon: Icon,
  label,
}: {
  to: string;
  icon: any;
  label: string;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex flex-col items-center gap-1 p-2 transition-all duration-200",
          isActive
            ? "scale-110 text-primary"
            : "text-muted-foreground hover:text-primary/80",
        )
      }
    >
      <Icon className="h-6 w-6" strokeWidth={2.5} />
      <span className="text-[10px] font-semibold tracking-wide">{label}</span>
    </NavLink>
  );
}
