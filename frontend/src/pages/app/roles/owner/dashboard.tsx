import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Search,
  ShieldCheck,
  ShieldOff,
  School,
  Sparkles,
  UtensilsCrossed,
  Users,
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
  GetOwnerPendingFoodSpots,
  PromoteToAdmin,
} from "../../../../../lib/actions";
import { queryClient } from "../../../../../lib/queryClient";
import type { ManagedUserDTO } from "../../../../../../shared/roles.type";

const STUDENT_LIMIT = 10;
const SPOT_LIMIT = 6;
const OWNER_KEYS = {
  pending: "owner:pending-food-spots",
  admins: "owner:admins",
  students: "owner:students",
} as const;

const formatDate = (value?: string | Date | null) => {
  if (!value) return "Unknown";
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

export default function OwnerDashboard() {
  const { data: session, error: sessionError, isPending: sessionLoading } = authClient.useSession();
  const user = session?.user;

  const [studentSearch, setStudentSearch] = useState("");
  const [studentPage, setStudentPage] = useState(1);
  const [pendingPage, setPendingPage] = useState(1);

  useEffect(() => {
    if (sessionError) toast.error(sessionError.message);
  }, [sessionError]);

  const pendingQueryKey = [OWNER_KEYS.pending, pendingPage, SPOT_LIMIT] as const;
  const adminsQueryKey = [OWNER_KEYS.admins] as const;
  const studentsQueryKey = [OWNER_KEYS.students, studentPage, studentSearch, STUDENT_LIMIT] as const;

  const pendingQuery = useQuery({
    queryKey: pendingQueryKey,
    queryFn: () => GetOwnerPendingFoodSpots({ page: pendingPage, limit: SPOT_LIMIT }),
    enabled: !!user,
  });

  const adminsQuery = useQuery({
    queryKey: adminsQueryKey,
    queryFn: GetAllAdmins,
    enabled: !!user,
  });

  const studentsQuery = useQuery({
    queryKey: studentsQueryKey,
    queryFn: () =>
      GetAllStudents({
        page: studentPage,
        limit: STUDENT_LIMIT,
        search: studentSearch,
      }),
    enabled: !!user,
  });

  const pendingSpots = pendingQuery.data?.data?.items ?? [];
  const pendingPagination = pendingQuery.data?.data?.pagination;
  const admins = adminsQuery.data?.data ?? [];
  const students = studentsQuery.data?.data?.items ?? [];
  const studentPagination = studentsQuery.data?.data?.pagination;

  const promoteMutation = useMutation({
    mutationFn: (target: ManagedUserDTO) => PromoteToAdmin(target.id),
    onMutate: async (target) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: adminsQueryKey }),
        queryClient.cancelQueries({ queryKey: studentsQueryKey }),
      ]);

      const previousAdmins = queryClient.getQueryData<typeof adminsQuery.data>(adminsQueryKey);
      const previousStudents = queryClient.getQueryData<typeof studentsQuery.data>(studentsQueryKey);

      queryClient.setQueryData<typeof adminsQuery.data>(adminsQueryKey, (current) => {
        if (!current?.data) return current;
        return {
          ...current,
          data: current.data.some((entry) => entry.id === target.id)
            ? current.data
            : [...current.data, { ...target, role: "ADMIN" }],
        };
      });

      queryClient.setQueryData<typeof studentsQuery.data>(studentsQueryKey, (current) => {
        if (!current?.data) return current;
        return {
          ...current,
          data: {
            ...current.data,
            items: current.data.items.filter((entry) => entry.id !== target.id),
          },
        };
      });

      return { previousAdmins, previousStudents };
    },
    onError: (_error, _target, context) => {
      if (context?.previousAdmins) {
        queryClient.setQueryData(adminsQueryKey, context.previousAdmins);
      }
      if (context?.previousStudents) {
        queryClient.setQueryData(studentsQueryKey, context.previousStudents);
      }
      toast.error("Could not promote the student.");
    },
    onSuccess: () => {
      toast.success("Student promoted to admin.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: adminsQueryKey });
      queryClient.invalidateQueries({ queryKey: [OWNER_KEYS.students] });
    },
  });

  const demoteMutation = useMutation({
    mutationFn: (target: ManagedUserDTO) => DemoteToStudent(target.id),
    onMutate: async (target) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: adminsQueryKey }),
        queryClient.cancelQueries({ queryKey: studentsQueryKey }),
      ]);

      const previousAdmins = queryClient.getQueryData<typeof adminsQuery.data>(adminsQueryKey);
      const previousStudents = queryClient.getQueryData<typeof studentsQuery.data>(studentsQueryKey);

      queryClient.setQueryData<typeof adminsQuery.data>(adminsQueryKey, (current) => {
        if (!current?.data) return current;
        return {
          ...current,
          data: current.data.filter((entry) => entry.id !== target.id),
        };
      });

      queryClient.setQueryData<typeof studentsQuery.data>(studentsQueryKey, (current) => {
        if (!current?.data) return current;
        return {
          ...current,
          data: {
            ...current.data,
            items: current.data.items.some((entry) => entry.id === target.id)
              ? current.data.items
              : [{ ...target, role: "STUDENT" }, ...current.data.items],
          },
        };
      });

      return { previousAdmins, previousStudents };
    },
    onError: (_error, _target, context) => {
      if (context?.previousAdmins) {
        queryClient.setQueryData(adminsQueryKey, context.previousAdmins);
      }
      if (context?.previousStudents) {
        queryClient.setQueryData(studentsQueryKey, context.previousStudents);
      }
      toast.error("Could not demote the admin.");
    },
    onSuccess: () => {
      toast.success("Admin demoted to student.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: adminsQueryKey });
      queryClient.invalidateQueries({ queryKey: [OWNER_KEYS.students] });
    },
  });

  const firstError = pendingQuery.error || adminsQuery.error || studentsQuery.error;
  if (pendingQuery.isError || adminsQuery.isError || studentsQuery.isError) {
    return <ErrorPage error={firstError as Error} />;
  }

  if (sessionLoading || pendingQuery.isLoading || adminsQuery.isLoading || studentsQuery.isLoading) {
    return <LoaderComponent />;
  }

  const totalPending = pendingPagination?.total ?? pendingSpots.length;
  const totalStudents = studentPagination?.total ?? students.length;

  return (
    <div className="min-h-screen bg-background pb-28">
      <Navbar username={user?.name || "O"} variant="OWNER" />

      <main className="mx-auto max-w-7xl px-4 py-6">
        <section className="relative overflow-hidden rounded-[2rem] border border-border bg-gradient-to-br from-foreground via-foreground to-primary/80 px-6 py-8 text-primary-foreground shadow-2xl shadow-primary/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.1),transparent_28%)]" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <Badge variant="secondary" className="mb-4 text-foreground">
                <Sparkles className="mr-1 h-3.5 w-3.5" />
                Owner console
              </Badge>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                Control every role change and submission from one place.
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-primary-foreground/80 sm:text-base">
                Keep the student network healthy, review the queue of incoming food spots,
                and move people between student and admin roles without bouncing between screens.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[420px] lg:grid-cols-1 xl:grid-cols-3">
              {[
                { label: "Pending spots", value: totalPending, icon: UtensilsCrossed },
                { label: "Admins", value: admins.length, icon: ShieldCheck },
                { label: "Students", value: totalStudents, icon: School },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-primary-foreground/70">{item.label}</p>
                      <p className="mt-1 text-2xl font-black">{item.value}</p>
                    </div>
                    <div className="rounded-2xl bg-white/15 p-3">
                      <item.icon className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="space-y-6">
            <Card className="border-border/70">
              <CardHeader className="border-b border-border/70">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle className="text-xl">Food spots being added</CardTitle>
                    <CardDescription>Latest submissions waiting in the owner queue.</CardDescription>
                  </div>
                  <Badge variant="outline">{totalPending} total</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 pt-6">
                {pendingSpots.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border p-8 text-center">
                    <p className="text-sm font-semibold text-muted-foreground">No submissions in the queue.</p>
                  </div>
                ) : (
                  pendingSpots.map((spot) => (
                    <article key={spot.id} className="rounded-3xl border border-border bg-card p-4 shadow-sm">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-bold text-foreground">{spot.name}</h3>
                            <Badge variant="secondary">{spot.spotRating}</Badge>
                            <Badge variant="outline">{spot.status ?? "PENDING"}</Badge>
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground">
                            {[spot.location?.locality, spot.location?.town, spot.location?.city, spot.location?.state]
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">Submitted on {formatDate(spot.createAt)}</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {spot.tags?.map((tag) => (
                              <Badge key={tag} variant="outline">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <Button asChild variant="outline" className="sm:self-start">
                          <Link to={`/admin/food-spots/${spot.id}`}>
                            Review
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </article>
                  ))
                )}

                {pendingPagination && (
                  <div className="flex items-center justify-between pt-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setPendingPage((page) => Math.max(1, page - 1))}
                      disabled={pendingPagination.page <= 1}
                    >
                      <ChevronLeft className="mr-1 h-4 w-4" />
                      Prev
                    </Button>

                    <span className="text-sm text-muted-foreground">
                      Page {pendingPagination.page} of {Math.max(1, Math.ceil(pendingPagination.total / pendingPagination.limit))}
                    </span>

                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setPendingPage((page) => page + 1)}
                      disabled={!pendingPagination.hasMore}
                    >
                      Next
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/70">
              <CardHeader className="border-b border-border/70">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-xl">Admins</CardTitle>
                    <CardDescription>Interact with admins and demote them back to students.</CardDescription>
                  </div>
                  <Badge variant="outline">{admins.length} active</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 pt-6">
                {admins.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border p-8 text-center">
                    <p className="text-sm font-semibold text-muted-foreground">No admins found.</p>
                  </div>
                ) : (
                  admins.map((admin) => (
                    <div
                      key={admin.id}
                      className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 font-black text-primary">
                          {admin.name?.charAt(0)?.toUpperCase() ?? "A"}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-bold text-foreground">{admin.name}</p>
                          <p className="truncate text-sm text-muted-foreground">{admin.email}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                        <Badge variant="secondary">{admin.role}</Badge>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => demoteMutation.mutate(admin)}
                          disabled={demoteMutation.isPending}
                        >
                          <ShieldOff className="mr-1 h-4 w-4" />
                          Demote
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </section>

          <aside className="space-y-6">
            <Card className="border-border/70">
              <CardHeader className="border-b border-border/70">
                <CardTitle className="text-xl">Students</CardTitle>
                <CardDescription>Promote students to admin, with pagination for larger cohorts.</CardDescription>
              </CardHeader>

              <CardContent className="pt-6">
                <div className="mb-4 flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2.5">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <input
                    type="search"
                    value={studentSearch}
                    onChange={(event) => {
                      setStudentSearch(event.target.value);
                      setStudentPage(1);
                    }}
                    placeholder="Search students..."
                    className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  />
                </div>

                <div className="space-y-3">
                  {students.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border p-8 text-center">
                      <p className="text-sm font-semibold text-muted-foreground">No students match this view.</p>
                    </div>
                  ) : (
                    students.map((student) => (
                      <div
                        key={student.id}
                        className="rounded-3xl border border-border bg-card p-4 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex min-w-0 items-center gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary font-black text-foreground">
                              {student.name?.charAt(0)?.toUpperCase() ?? "S"}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-bold text-foreground">{student.name}</p>
                              <p className="truncate text-sm text-muted-foreground">{student.email}</p>
                            </div>
                          </div>

                          <Badge variant="outline">{student.role}</Badge>
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-3">
                          <p className="text-xs text-muted-foreground">Joined {formatDate(student.createdAt)}</p>
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => promoteMutation.mutate(student)}
                            disabled={promoteMutation.isPending}
                          >
                            <Users className="mr-1 h-4 w-4" />
                            Promote
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {studentPagination && (
                  <div className="mt-5 flex items-center justify-between">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setStudentPage((page) => Math.max(1, page - 1))}
                      disabled={studentPagination.page <= 1}
                    >
                      <ChevronLeft className="mr-1 h-4 w-4" />
                      Prev
                    </Button>

                    <span className="text-xs text-muted-foreground">
                      {studentPagination.page} / {Math.max(1, Math.ceil(studentPagination.total / studentPagination.limit))}
                    </span>

                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setStudentPage((page) => page + 1)}
                      disabled={!studentPagination.hasMore}
                    >
                      Next
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/70 bg-secondary/20">
              <CardHeader>
                <CardTitle className="text-lg">Workflow</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <p>Demote admins to students when access needs to be reduced.</p>
                </div>
                <div className="flex items-start gap-2">
                  <Users className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <p>Promote trusted students to admin with one click.</p>
                </div>
                <div className="flex items-start gap-2">
                  <UtensilsCrossed className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <p>Review the incoming food spot queue before it goes live.</p>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}
