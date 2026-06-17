import toast from "react-hot-toast";
import { authClient } from "../../../../../lib/auth";
import Navbar from "../../../../components/Navbar";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { GetPendingFoodSpots, GetAdminStats, VerifyPendingFoodSpots } from "../../../../../lib/actions";
import ErrorPage from "../../../error/error";
import type { TagsDTO } from "../../../../../../shared/food-spots.type";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { Link } from "react-router-dom";
import LoaderComponent from "../../../../../components/loader";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card/90 backdrop-blur-md border border-border p-3 rounded-2xl shadow-xl">
        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{payload[0].payload.label}</p>
        <p className="text-sm font-black text-primary mt-1">
          {payload[0].value} Submissions
        </p>
      </div>
    );
  }
  return null;
};

const AdminDashboard = () => {
  const queryClient = useQueryClient();
  const [period, setPeriod] = useState<"day" | "week" | "month">("day");

  const {
    data: session,
    error: sessionError,
    isPending: sessionLoading,
  } = authClient.useSession();

  useEffect(() => {
    if (sessionError) toast.error(sessionError.message);
  }, [sessionError]);

  const user = session?.user;

  // Pending spots query
  const {
    data,
    isError,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["admin:pending-requests"],
    queryFn: async () => await GetPendingFoodSpots(),
  });

  // Stats query with cache persistence (keepPreviousData)
  const {
    data: statsData,
    isLoading: statsLoading,
  } = useQuery({
    queryKey: ["admin:stats:submissions"],
    queryFn: async () => await GetAdminStats(),
    placeholderData: keepPreviousData,
  });

  // Verification mutations
  const approveMutation = useMutation({
    mutationFn: (id: string) => VerifyPendingFoodSpots(id, "VERIFIED"),
    onSuccess: () => {
      toast.success("Spot approved!");
      queryClient.invalidateQueries({ queryKey: ["admin:pending-requests"] });
      queryClient.invalidateQueries({ queryKey: ["admin:stats:submissions"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to approve spot");
    }
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => VerifyPendingFoodSpots(id, "REJECTED"),
    onSuccess: () => {
      toast.success("Spot rejected");
      queryClient.invalidateQueries({ queryKey: ["admin:pending-requests"] });
      queryClient.invalidateQueries({ queryKey: ["admin:stats:submissions"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to reject spot");
    }
  });

  if (isError) {
    return <ErrorPage error={error} />;
  }

  const showSkeleton = isLoading || sessionLoading || statsLoading;
  const pendingSpots = data?.data?.items ?? [];
  const chartData = statsData?.data?.[period] ?? [];

  if (showSkeleton) {
    return <LoaderComponent />;
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Navbar
        username={user?.name || "A"}
        variant="ADMIN"
      />

      <main className="flex-1 flex flex-col p-6 gap-6 min-h-0 overflow-hidden">
        {/* Stats Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3 shrink-0">
          <Card className="border-border/60 shadow-sm rounded-2xl bg-card">
            <CardHeader className="p-4 flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Pending Reviews</CardDescription>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-0 rounded-full font-bold">
                Active
              </Badge>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0">
              <CardTitle className="text-2xl font-black">{pendingSpots.length}</CardTitle>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm rounded-2xl bg-card">
            <CardHeader className="p-4 flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Verification Queue</CardDescription>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0">
              <CardTitle className="text-2xl font-black">Live & Active</CardTitle>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm rounded-2xl bg-card">
            <CardHeader className="p-4 flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Current Moderator</CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0">
              <CardTitle className="text-2xl font-black truncate max-w-[220px]">{user?.name}</CardTitle>
            </CardContent>
          </Card>
        </div>

        {/* Dynamic Split Section */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1.2fr_1.8fr] gap-6 min-h-0 overflow-hidden pb-2">
          {/* Left Panel: Pending Spots list (internally scrollable) */}
          <Card className="border-border/60 shadow-sm rounded-3xl flex flex-col min-h-0 overflow-hidden bg-card">
            <CardHeader className="border-b border-border/40 p-5 shrink-0 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-black">Review Queue</CardTitle>
                <CardDescription className="text-xs mt-0.5">Approve or reject student submissions.</CardDescription>
              </div>
              <Badge className="rounded-full px-2.5 py-0.5 font-bold text-xs">{pendingSpots.length}</Badge>
            </CardHeader>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-hide">
              {pendingSpots.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center py-12 text-center">
                  <span className="text-3xl mb-2">🎉</span>
                  <p className="text-sm font-bold text-muted-foreground">No pending submissions</p>
                </div>
              ) : (
                pendingSpots.map((spot: any) => (
                  <div key={spot.id} className="rounded-2xl border border-border/75 bg-card p-4 hover:shadow-md transition-all duration-300">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="font-extrabold text-sm text-foreground">{spot.name}</h4>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {[
                            spot.location?.locality,
                            spot.location?.city,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {spot.tags?.map((tag: TagsDTO) => (
                            <Badge key={tag} variant="outline" className="text-[9px] px-1.5 py-0 rounded-full font-medium">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Badge className="bg-primary/20 text-primary border-0 rounded-lg text-xs font-bold shrink-0">
                        ⭐ {spot.spotRating}
                      </Badge>
                    </div>

                    <div className="flex gap-2 mt-4 pt-3 border-t border-border/40">
                      <Link to={`/admin/food-spots/${spot.id}`} className="flex-1">
                        <Button variant="outline" className="w-full text-[11px] h-8 rounded-lg cursor-pointer font-bold">
                          Review
                        </Button>
                      </Link>

                      <Button
                        size="sm"
                        disabled={approveMutation.isPending}
                        onClick={() => approveMutation.mutate(spot.id)}
                        className="flex-1 text-[11px] h-8 rounded-lg cursor-pointer bg-primary text-primary-foreground font-bold"
                      >
                        Approve
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={rejectMutation.isPending}
                        onClick={() => rejectMutation.mutate(spot.id)}
                        className="flex-1 text-[11px] h-8 rounded-lg cursor-pointer font-bold"
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Right Panel: Recharts Area Chart */}
          <Card className="border-border/60 shadow-sm rounded-3xl p-5 flex flex-col min-h-0 overflow-hidden bg-card">
            <div className="flex items-center justify-between pb-4 border-b border-border/40 shrink-0">
              <div>
                <CardTitle className="text-lg font-black">Submission Activity</CardTitle>
                <CardDescription className="text-xs mt-0.5">Spoonful food spot request metrics.</CardDescription>
              </div>

              {/* Day / Week / Month Tab Switcher */}
              <div className="flex bg-secondary p-1 rounded-xl gap-1 border border-border/30">
                {(["day", "week", "month"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setPeriod(t)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all duration-300 transform active:scale-95 cursor-pointer uppercase ${
                      period === t
                        ? "bg-card text-foreground shadow-sm font-extrabold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Recharts Container */}
            <div className="flex-1 w-full h-full min-h-0 mt-6 relative">
              <ResponsiveContainer width="100%" height="95%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="adminChartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.01}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.3} />
                  <XAxis
                    dataKey="label"
                    stroke="var(--color-muted-foreground)"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis
                    stroke="var(--color-muted-foreground)"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--color-border)', strokeWidth: 1 }} />
                  <Area
                    type="monotone"
                    dataKey="requests"
                    stroke="var(--color-primary)"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#adminChartGrad)"
                    isAnimationActive={true}
                    animationDuration={500}
                    animationEasing="ease-out"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
