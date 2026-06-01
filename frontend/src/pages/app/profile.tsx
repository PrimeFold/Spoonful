import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  Edit2,
  MapPin,
  GraduationCap,
  Star,
  CheckCircle,
  Clock,
} from "lucide-react";

import { cn } from "../../../lib/utils";
import { BottomNav } from "./bottom-nav";

const MY_SUBMISSIONS = [
  {}
]

const MY_REVIEWS = [
  {}
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<   "submissions" | "reviews" >("submissions");

  return (
    <div className="min-h-screen bg-background pb-36 md:pb-28">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur border-b border-border">
        <div className="max-w-lg md:max-w-3xl lg:max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="font-extrabold text-lg text-foreground">
            My Profile
          </h1>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-destructive transition-colors"
            aria-label="Log out"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:block">Log out</span>
          </button>
        </div>
      </header>

      <main className="max-w-lg md:max-w-3xl lg:max-w-5xl mx-auto px-4">
        {/* Profile card */}
        <div className="mt-5 bg-card rounded-3xl border border-border p-5">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center font-extrabold text-primary text-2xl flex-shrink-0">
              R
            </div>

            <div className="flex-1 w-full min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-extrabold text-lg text-foreground truncate">
                    Rahul Sharma
                  </p>

                  <div className="flex items-center gap-1.5 mt-1">
                    <GraduationCap className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm text-muted-foreground truncate">
                      IIT Bombay
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 mt-0.5">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm text-muted-foreground truncate">
                      Koramangala
                    </span>
                  </div>
                </div>

                <button className="flex items-center justify-center gap-1.5 text-xs font-semibold text-foreground bg-secondary border border-border px-3 py-2 rounded-xl hover:bg-border transition-colors w-full sm:w-auto">
                  <Edit2 className="h-3 w-3" />
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mt-3">
          {[
            {
              icon: "🏪",
              label: "Spots Added",
              value: MY_SUBMISSIONS.length,
            },
            {
              icon: "⭐",
              label: "Reviews Given",
              value: MY_REVIEWS.length,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-card rounded-2xl border border-border p-4 text-center"
            >
              <p className="text-2xl mb-1">{stat.icon}</p>
              <p className="text-2xl font-extrabold text-foreground">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-secondary rounded-2xl p-1 mt-5">
          {(["submissions", "reviews"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 py-2.5 px-3 rounded-xl text-sm font-bold transition-all capitalize whitespace-nowrap",
                activeTab === tab
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab === "submissions"
                ? "My Submissions"
                : "My Reviews"}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="mt-4 flex flex-col gap-3">
          {activeTab === "submissions" && (
            <>
              {MY_SUBMISSIONS.map((spot) => (
                <div
                  key={spot.id}
                  className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl flex-shrink-0">
                    🍽️
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-foreground truncate">
                      {spot.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {spot.area}
                    </p>
                  </div>

                  <div
                    className={cn(
                      "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0 whitespace-nowrap",
                      spot.status === "verified"
                        ? "bg-green-50 text-green-700"
                        : "bg-amber-50 text-amber-700"
                    )}
                  >
                    {spot.status === "verified" ? (
                      <>
                        <CheckCircle className="h-3 w-3" />
                        Verified
                      </>
                    ) : (
                      <>
                        <Clock className="h-3 w-3" />
                        Pending
                      </>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}

          {activeTab === "reviews" && (
            <>
              {MY_REVIEWS.map((rev, i) => (
                <div
                  key={i}
                  className="bg-card rounded-2xl border border-border p-4"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-foreground truncate">
                        {rev.spotName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {rev.area}
                      </p>
                    </div>

                    <span className="text-xs text-muted-foreground flex-shrink-0 whitespace-nowrap">
                      {rev.date}
                    </span>
                  </div>

                  <div className="flex gap-0.5 mb-2">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        className={`h-3.5 w-3.5 ${
                          j < rev.rating
                            ? "fill-primary text-primary"
                            : "text-border"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed break-words">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}