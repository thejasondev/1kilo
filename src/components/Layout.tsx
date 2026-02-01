import { Home, Wallet, Settings, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      {/* Main Content Area */}
      <main className="flex-1 p-4 pb-20">{children}</main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 border-t bg-card pb-safe">
        <div className="flex items-center justify-around p-3">
          <NavItem
            icon={Home}
            label="Home"
            isActive={activeTab === "home"}
            onClick={() => setActiveTab("home")}
          />
          <NavItem
            icon={Wallet}
            label="Wallet"
            isActive={activeTab === "wallet"}
            onClick={() => setActiveTab("wallet")}
          />
          <NavItem
            icon={Menu}
            label="Menu"
            isActive={activeTab === "menu"}
            onClick={() => setActiveTab("menu")}
          />
          <NavItem
            icon={Settings}
            label="Settings"
            isActive={activeTab === "settings"}
            onClick={() => setActiveTab("settings")}
          />
        </div>
      </nav>
    </div>
  );
}

function NavItem({
  icon: Icon,
  label,
  isActive,
  onClick,
}: {
  icon: any;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 transition-colors",
        isActive
          ? "text-primary"
          : "text-muted-foreground hover:text-primary/80",
      )}
    >
      <Icon className="h-6 w-6" />
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}
