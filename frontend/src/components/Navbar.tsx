import { Link, useNavigate } from "react-router-dom"
import { authClient } from "../../lib/auth";
import { ArrowLeft, LogOut, Search } from "lucide-react";
import { useState } from "react";

const Navbar = ({ username, variant }: { username?: string, variant: string }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const { data: session } = authClient.useSession();
  const user = session?.user;
  const role = (user as any)?.role;

  const handleLogout = async () => {
    try {
      await authClient.signOut();
    } catch (error) {
      console.log((error as Error).message);
    }
  };

  if (variant === "HOME") return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="max-w-lg md:max-w-3xl lg:max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-black">S</span>
          </div>
          <span className="font-black text-foreground tracking-tight text-lg">
            Spoonful
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {role && role !== "STUDENT" && (
            <Link
              to={role === "ADMIN" ? "/admin/dashboard" : "/owner/dashboard"}
              className="text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-xl transition-all"
            >
              {role === "ADMIN" ? "Admin Panel" : "Owner Panel"}
            </Link>
          )}
          <Link to="/app/profile">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center font-bold text-primary-foreground text-sm ring-2 ring-primary/30 hover:ring-primary/60 transition-all">
              {username?.charAt(0)?.toUpperCase() || "U"}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );

  if (variant === "PROFILE") return (
    <header className="sticky top-0 z-40 bg-card/95 backdrop-blur border-b border-border">
      <div className="max-w-lg md:max-w-3xl lg:max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="font-bold text-lg text-foreground">
          My Profile
        </h1>

        <div className="flex items-center gap-3">
          {role && role !== "STUDENT" && (
            <Link
              to={role === "ADMIN" ? "/admin/dashboard" : "/owner/dashboard"}
              className="text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-xl transition-all"
            >
              {role === "ADMIN" ? "Admin Panel" : "Owner Panel"}
            </Link>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
            aria-label="Log out"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:block">Log out</span>
          </button>
        </div>
      </div>
    </header>
  );

  if (variant === "SEARCH") return (
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-sm border-b border-border">
      <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
        <button type="button" onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center shrink-0" aria-label="Go back">
          <ArrowLeft className="h-4 w-4 text-foreground" />
        </button>
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            autoFocus
            placeholder="Spots, dishes, areas..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-card border border-border rounded-2xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
          />
        </div>
      </div>
    </header>
  );

  if (variant === "ADMIN" || variant === "OWNER") return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="max-w-lg md:max-w-3xl lg:max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-black">S</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-black text-foreground tracking-tight text-lg">
              Spoonful
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              {variant === "OWNER" ? "Owner Dashboard" : "Admin Dashboard"}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/app/home"
            className="text-xs font-semibold text-muted-foreground hover:text-foreground border border-border px-3.5 py-1.5 rounded-xl transition-all"
          >
            Student View
          </Link>
          <Link to="/app/profile">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center font-bold text-primary-foreground text-sm ring-2 ring-primary/30 hover:ring-primary/60 transition-all">
              {username?.charAt(0)?.toUpperCase() || "U"}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );

  return null;
}

export default Navbar;
