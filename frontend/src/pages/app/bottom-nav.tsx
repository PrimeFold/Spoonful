

import { NavLink } from "react-router-dom";
import { Home, Search, PlusCircle, User } from "lucide-react";
import { cn } from "../../../lib/utils";

const navItems = [
  { to: "/app/home", label: "Home", icon: Home },
  { to: "/app/search", label: "Search", icon: Search },
  { to: "/app/add-spot", label: "Add", icon: PlusCircle },
  { to: "/app/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-area-pb">
      <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-2">
        {navItems.map(({ to, label, icon: Icon }) => {
          const isAdd = label === "Add";
          return (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl transition-colors",
                  isAdd
                    ? "bg-primary text-primary-foreground rounded-2xl p-3 -mt-4 shadow-lg shadow-primary/30"
                    : isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )
              }
              aria-label={label}
            >
              {({ isActive }) => (
                <>
                  <Icon className={cn("h-5 w-5", isAdd && "h-6 w-6")} />
                  {!isAdd && (
                    <span className={cn("text-[10px] font-semibold", isActive ? "text-primary" : "text-muted-foreground")}>
                      {label}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
