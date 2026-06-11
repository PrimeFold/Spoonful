

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
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-white backdrop-blur-xl safe-area-pb">
      <div className="max-w-lg mx-auto flex items-center justify-between gap-2 rounded-t-[2rem] bg-card/95 px-3 py-3 shadow-[0_-20px_50px_-40px_rgba(15,23,42,0.35)]">
        {navItems.map(({ to, label, icon: Icon }) => {
          const isAdd = label === "Add";
          return (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center gap-1 rounded-3xl transition-all duration-200",
                  isAdd
                    ? "bg-primary text-primary-foreground p-3 shadow-xl shadow-primary/20"
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
