import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  ShieldCheck,
  ShieldOff,
  School,
  Sparkles,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";

import Navbar from "../../../../components/Navbar";
import LoaderComponent from "../../../../../components/loader";
import ErrorPage from "../../../error/error";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card";
import { authClient } from "../../../../../lib/auth";
import {
  DemoteToStudent,
  GetAllAdmins,
  GetAllStudents,
  PromoteToAdmin,
  GetOwnerStats,
  GetAdminActions,
  GetSubmittedSpots,
} from "../../../../../lib/actions";
import type { ManagedUserDTO } from "../../../../../../shared/roles.type";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const STUDENT_LIMIT = 5;
const SPOTS_LIMIT = 5;

const formatDate = (value?: string | Date | null) => {
  if (!value) return "Unknown";
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

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

export default function OwnerDashboard() {
  const queryClient = useQueryClient();
  const { data: session, error: sessionError, isPending: sessionLoading } = authClient.useSession();
  const user = session?.user;

  const [studentSearch, setStudentSearch] = useState("");
  const [studentPage, setStudentPage] = useState(1);

  const [spotsSearch, setSpotsSearch] = useState("");
  const [spotsPage, setSpotsPage] = useState(1);

  const [period, setPeriod] = useState<"day" | "week" | "month" >("day");
  const [leftTab, setLeftTab] = useState<"admins" | "actions">("admins");
  const [rightTab, setRightTab] = useState<"students" | "spots">("students");

  useEffect(() => {
    if (sessionError) toast.error(sessionError.message);
  }, [sessionError]);

  // Queries
  const adminsQuery = useQuery({
    queryKey: ["owner:admins"],
    queryFn: GetAllAdmins,
    enabled: !!user,
  });

  const studentsQuery = useQuery({
    queryKey: ["owner:students", studentPage, studentSearch, STUDENT_LIMIT],
    queryFn: () =>
      GetAllStudents({
        page: studentPage,
        limit: STUDENT_LIMIT,
        search: studentSearch,
      }),
    enabled: !!user,
  });

  const statsQuery = useQuery({
    queryKey: ["owner:stats:submissions"],
    queryFn: GetOwnerStats,
    enabled: !!user,
    placeholderData: keepPreviousData,
  });

  const actionsQuery = useQuery({
    queryKey: ["owner:admin-actions"],
    queryFn: GetAdminActions,
    enabled: !!user && leftTab === "actions",
  });

  const spotsQuery = useQuery({
    queryKey: ["owner:submitted-spots", spotsPage, spotsSearch, SPOTS_LIMIT],
    queryFn: () =>
      GetSubmittedSpots({
        page: spotsPage,
        limit: SPOTS_LIMIT,
        search: spotsSearch,
      }),
    enabled: !!user && rightTab === "spots",
  });

  // Mutations
  const promoteMutation = useMutation({
    mutationFn: (targetId: string) => PromoteToAdmin(targetId),
    onSuccess: () => {
      toast.success("Student promoted to admin.");
      queryClient.invalidateQueries({ queryKey: ["owner:admins"] });
      queryClient.invalidateQueries({ queryKey: ["owner:students"] });
      queryClient.invalidateQueries({ queryKey: ["owner:admin-actions"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to promote student");
    },
  });

  const demoteMutation = useMutation({
    mutationFn: (targetId: string) => DemoteToStudent(targetId),
    onSuccess: () => {
      toast.success("Admin demoted to student.");
      queryClient.invalidateQueries({ queryKey: ["owner:admins"] });
      queryClient.invalidateQueries({ queryKey: ["owner:students"] });
      queryClient.invalidateQueries({ queryKey: ["owner:admin-actions"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to demote admin");
    },
  });

  const firstError = adminsQuery.error || studentsQuery.error || statsQuery.error;
  if (adminsQuery.isError || studentsQuery.isError || statsQuery.isError) {
    return <ErrorPage error={firstError as Error} />;
  }

  const showSkeleton = sessionLoading || adminsQuery.isLoading || studentsQuery.isLoading || statsQuery.isLoading;
  if (showSkeleton) {
    return <LoaderComponent />;
  }

  const admins = adminsQuery.data?.data ?? [];
  const students = studentsQuery.data?.data?.items ?? [];
  const studentPagination = studentsQuery.data?.data?.pagination;
  const totalStudents = studentPagination?.total ?? students.length;

  const chartData = statsQuery.data?.data?.[period] ?? [];
  const adminActions = actionsQuery.data?.data ?? [];
  
  const submittedSpots = spotsQuery.data?.data?.items ?? [];
  const spotsPagination = spotsQuery.data?.data?.pagination;

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Navbar username={user?.name || "O"} variant="OWNER" />

      <main className="flex-grow flex flex-col p-6 gap-6 min-h-0 overflow-hidden">
        {/* Top Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3 shrink-0">
          <Card className="border-border/60 shadow-sm rounded-2xl bg-card">
            <CardHeader className="p-4 flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                Active Admins
              </CardDescription>
              <ShieldCheck className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0">
              <CardTitle className="text-2xl font-black">{admins.length}</CardTitle>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm rounded-2xl bg-card">
            <CardHeader className="p-4 flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                Registered Students
              </CardDescription>
              <School className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0">
              <CardTitle className="text-2xl font-black">{totalStudents}</CardTitle>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm rounded-2xl bg-card">
            <CardHeader className="p-4 flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                Console Mode
              </CardDescription>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-0 rounded-full font-bold">
                Owner
              </Badge>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0">
              <CardTitle className="text-2xl font-black truncate max-w-[240px]">
                {user?.name || "System Owner"}
              </CardTitle>
            </CardContent>
          </Card>
        </div>

        {/* Dynamic Split Panels */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1.5fr_1.3fr] gap-6 min-h-0 overflow-hidden pb-2">
          {/* Left Column: Recharts activity + Bottom Admin Action/Log tabs */}
          <div className="flex flex-col gap-6 min-h-0 overflow-hidden">
            {/* Chart Area */}
            <Card className="border-border/60 shadow-sm rounded-3xl p-5 flex flex-col h-[280px] shrink-0 overflow-hidden bg-card">
              <div className="flex items-center justify-between pb-4 border-b border-border/40 shrink-0">
                <div>
                  <CardTitle className="text-sm font-black flex items-center gap-1">
                    <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                    Overall Submissions Log
                  </CardTitle>
                  <CardDescription className="text-[11px] mt-0.5">
                    Live analytics of Spoonful food spot additions.
                  </CardDescription>
                </div>

                <div className="flex bg-secondary p-1 rounded-xl gap-1 border border-border/30">
                  {(["day", "week", "month"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setPeriod(t)}
                      className={`text-[10px] px-2.5 py-1 rounded-lg font-bold transition-all duration-300 transform active:scale-95 cursor-pointer uppercase ${
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

              {/* Chart container */}
              <div className="flex-1 w-full h-full min-h-0 mt-4 relative">
                <ResponsiveContainer width="100%" height="95%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="ownerChartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.01} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.3} />
                    <XAxis
                      dataKey="label"
                      stroke="var(--color-muted-foreground)"
                      fontSize={9}
                      tickLine={false}
                      axisLine={false}
                      dy={5}
                    />
                    <YAxis
                      stroke="var(--color-muted-foreground)"
                      fontSize={9}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: "var(--color-border)", strokeWidth: 1 }} />
                    <Area
                      type="monotone"
                      dataKey="requests"
                      stroke="var(--color-primary)"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#ownerChartGrad)"
                      isAnimationActive={true}
                      animationDuration={500}
                      animationEasing="ease-out"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Bottom Card: Tabs for Admins list / Admin Actions log */}
            <Card className="flex-1 border-border/60 shadow-sm rounded-3xl flex flex-col min-h-0 overflow-hidden bg-card">
              <div className="border-b border-border/40 p-4 shrink-0 flex items-center justify-between">
                <div className="flex bg-secondary p-1 rounded-xl gap-1 border border-border/30">
                  <button
                    onClick={() => setLeftTab("admins")}
                    className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all duration-300 cursor-pointer ${
                      leftTab === "admins" ? "bg-card text-foreground shadow-sm font-extrabold" : "text-muted-foreground"
                    }`}
                  >
                    Admins
                  </button>
                  <button
                    onClick={() => setLeftTab("actions")}
                    className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all duration-300 cursor-pointer ${
                      leftTab === "actions" ? "bg-card text-foreground shadow-sm font-extrabold" : "text-muted-foreground"
                    }`}
                  >
                    Admin Actions Log
                  </button>
                </div>
                <Badge variant="outline" className="text-[10px] rounded-full">
                  {leftTab === "admins" ? `${admins.length} active` : "Recent 50"}
                </Badge>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
                {leftTab === "admins" ? (
                  admins.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center py-8 text-center">
                      <p className="text-xs font-bold text-muted-foreground">No admins found</p>
                    </div>
                  ) : (
                    admins.map((admin: ManagedUserDTO) => (
                      <div
                        key={admin.id}
                        className="flex items-center justify-between gap-4 p-3 rounded-2xl border border-border/60 bg-card/50 hover:shadow-sm transition-all duration-300"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary text-sm uppercase">
                            {admin.name?.charAt(0) ?? "A"}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-xs font-extrabold text-foreground">{admin.name}</p>
                            <p className="truncate text-[10px] text-muted-foreground">{admin.email}</p>
                          </div>
                        </div>

                        <Button
                          variant="destructive"
                          size="sm"
                          className="h-7 text-[10px] px-2.5 rounded-lg font-bold cursor-pointer shrink-0"
                          onClick={() => demoteMutation.mutate(admin.id)}
                          disabled={demoteMutation.isPending}
                        >
                          <ShieldOff className="mr-1 h-3.5 w-3.5" />
                          Demote
                        </Button>
                      </div>
                    ))
                  )
                ) : actionsQuery.isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  </div>
                ) : adminActions.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center py-8 text-center">
                    <p className="text-xs font-bold text-muted-foreground">No admin actions recorded yet</p>
                  </div>
                ) : (
                  adminActions.map((action: any) => (
                    <div
                      key={action.id}
                      className="flex items-center justify-between gap-4 p-3 rounded-2xl border border-border/50 bg-card/30"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {action.action === "VERIFIED" ? (
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                            <CheckCircle2 className="h-4.5 w-4.5" />
                          </div>
                        ) : (
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                            <XCircle className="h-4.5 w-4.5" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-extrabold text-foreground">
                            {action.metadata?.spotName || "Food Spot"}
                          </p>
                          <p className="text-[10px] text-muted-foreground truncate">
                            Action by <span className="font-bold text-foreground">{action.admin?.name || "Admin"}</span>
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <Badge
                          className={`text-[9px] font-bold rounded-lg border-0 ${
                            action.action === "VERIFIED" ? "bg-emerald-500/10 text-emerald-600" : "bg-destructive/10 text-destructive-foreground"
                          }`}
                        >
                          {action.action}
                        </Badge>
                        <p className="text-[8px] text-muted-foreground mt-1">{formatDate(action.createdAt)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Right Column: Tabs for Students list / Submitted spots with submitter info */}
          <Card className="border-border/60 shadow-sm rounded-3xl flex flex-col min-h-0 overflow-hidden bg-card">
            <div className="border-b border-border/40 p-4 shrink-0 flex items-center justify-between">
              <div className="flex bg-secondary p-1 rounded-xl gap-1 border border-border/30">
                <button
                  onClick={() => setRightTab("students")}
                  className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all duration-300 cursor-pointer ${
                    rightTab === "students" ? "bg-card text-foreground shadow-sm font-extrabold" : "text-muted-foreground"
                  }`}
                >
                  Students
                </button>
                <button
                  onClick={() => setRightTab("spots")}
                  className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all duration-300 cursor-pointer ${
                    rightTab === "spots" ? "bg-card text-foreground shadow-sm font-extrabold" : "text-muted-foreground"
                  }`}
                >
                  Submitted Spots
                </button>
              </div>
            </div>

            {/* Filter Input row (Shrink-0) */}
            <div className="px-4 pt-4 shrink-0">
              {rightTab === "students" ? (
                <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-card px-3 py-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <input
                    type="search"
                    value={studentSearch}
                    onChange={(event) => {
                      setStudentSearch(event.target.value);
                      setStudentPage(1);
                    }}
                    placeholder="Search students by name/email..."
                    className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground/75"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-card px-3 py-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <input
                    type="search"
                    value={spotsSearch}
                    onChange={(event) => {
                      setSpotsSearch(event.target.value);
                      setSpotsPage(1);
                    }}
                    placeholder="Search food spots..."
                    className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground/75"
                  />
                </div>
              )}
            </div>

            {/* Inner Content Area */}
            <div className="flex-grow overflow-y-auto p-4 space-y-3 scrollbar-hide min-h-0">
              {rightTab === "students" ? (
                students.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center py-8 text-center">
                    <p className="text-xs font-bold text-muted-foreground">No students match this query</p>
                  </div>
                ) : (
                  students.map((student: ManagedUserDTO) => (
                    <div
                      key={student.id}
                      className="rounded-2xl border border-border/60 bg-card p-3 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary font-black text-foreground text-xs uppercase">
                            {student.name?.charAt(0) ?? "S"}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-xs font-extrabold text-foreground">{student.name}</p>
                            <p className="truncate text-[10px] text-muted-foreground">{student.email}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-[9px] rounded-lg shrink-0">
                          {student.role}
                        </Badge>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-border/40 flex items-center justify-between gap-4">
                        <p className="text-[9px] text-muted-foreground">
                          Joined {formatDate(student.createdAt).split(",")[0]}
                        </p>
                        <Button
                          type="button"
                          size="sm"
                          className="h-7 text-[10px] px-2.5 rounded-lg cursor-pointer bg-primary text-primary-foreground font-bold hover:bg-primary/95"
                          onClick={() => promoteMutation.mutate(student.id)}
                          disabled={promoteMutation.isPending}
                        >
                          <Users className="mr-1 h-3.5 w-3.5" />
                          Promote
                        </Button>
                      </div>
                    </div>
                  ))
                )
              ) : spotsQuery.isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                </div>
              ) : submittedSpots.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-xs font-bold text-muted-foreground">No food spots recorded</p>
                </div>
              ) : (
                submittedSpots.map((spot: any) => (
                  <div
                    key={spot.id}
                    className="rounded-2xl border border-border/60 bg-card p-3 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-xs text-foreground truncate">{spot.name}</h4>
                        <p className="text-[9px] text-muted-foreground mt-0.5 truncate">
                          {[spot.location?.locality, spot.location?.city].filter(Boolean).join(", ")}
                        </p>
                      </div>
                      
                      <Badge
                        className={`text-[9px] font-bold rounded-lg border-0 shrink-0 flex items-center gap-1 ${
                          spot.status === "VERIFIED"
                            ? "bg-emerald-500/10 text-emerald-600"
                            : spot.status === "REJECTED"
                            ? "bg-destructive/10 text-destructive-foreground"
                            : "bg-amber-500/10 text-amber-600"
                        }`}
                      >
                        {spot.status === "VERIFIED" ? (
                          <CheckCircle2 className="h-2.5 w-2.5" />
                        ) : spot.status === "REJECTED" ? (
                          <XCircle className="h-2.5 w-2.5" />
                        ) : (
                          <Clock className="h-2.5 w-2.5" />
                        )}
                        {spot.status}
                      </Badge>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-border/40 flex items-center justify-between gap-4 text-[9px]">
                      <div className="min-w-0">
                        <span className="text-muted-foreground">Added by: </span>
                        <span className="font-bold text-foreground truncate block max-w-[120px]" title={spot.user?.email}>
                          {spot.user?.name || spot.userId}
                        </span>
                      </div>
                      <span className="text-muted-foreground shrink-0">{formatDate(spot.createdAt).split(",")[0]}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination footer (Shrink-0) */}
            <div className="border-t border-border/40 p-4 shrink-0 flex items-center justify-between">
              {rightTab === "students" && studentPagination ? (
                <>
                  <Button
                    type="button"
                    variant="secondary"
                    className="h-7 text-[10px] px-2.5 rounded-lg cursor-pointer flex items-center"
                    onClick={() => setStudentPage((p) => Math.max(1, p - 1))}
                    disabled={studentPagination.page <= 1}
                  >
                    <ChevronLeft className="mr-1 h-3.5 w-3.5" />
                    Prev
                  </Button>
                  <span className="text-[10px] text-muted-foreground font-bold">
                    Page {studentPagination.page} / {Math.max(1, Math.ceil(studentPagination.total / studentPagination.limit))}
                  </span>
                  <Button
                    type="button"
                    variant="secondary"
                    className="h-7 text-[10px] px-2.5 rounded-lg cursor-pointer flex items-center"
                    onClick={() => setStudentPage((p) => p + 1)}
                    disabled={!studentPagination.hasMore}
                  >
                    Next
                    <ChevronRight className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </>
              ) : rightTab === "spots" && spotsPagination ? (
                <>
                  <Button
                    type="button"
                    variant="secondary"
                    className="h-7 text-[10px] px-2.5 rounded-lg cursor-pointer flex items-center"
                    onClick={() => setSpotsPage((p) => Math.max(1, p - 1))}
                    disabled={spotsPagination.page <= 1}
                  >
                    <ChevronLeft className="mr-1 h-3.5 w-3.5" />
                    Prev
                  </Button>
                  <span className="text-[10px] text-muted-foreground font-bold">
                    Page {spotsPagination.page} / {Math.max(1, Math.ceil(spotsPagination.total / spotsPagination.limit))}
                  </span>
                  <Button
                    type="button"
                    variant="secondary"
                    className="h-7 text-[10px] px-2.5 rounded-lg cursor-pointer flex items-center"
                    onClick={() => setSpotsPage((p) => p + 1)}
                    disabled={!spotsPagination.hasMore}
                  >
                    Next
                    <ChevronRight className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </>
              ) : (
                <div />
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
