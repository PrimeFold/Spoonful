import toast from "react-hot-toast";
import { authClient } from "../../../../../lib/auth";
import Navbar from "../../../../components/Navbar";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { GetPendingFoodSpots } from "../../../../../lib/actions";
import ErrorPage from "../../../error/error";
import type { TagsDTO } from "../../../../../../shared/food-spots.type";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const {
    data: session,
    error: sessionError,
    isPending: sessionLoading,
  } = authClient.useSession();

  useEffect(() => {
    if (sessionError) toast.error(sessionError.message);
  }, [sessionError]);

  const user = session?.user;

  const {
    data,
    isError,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["admin:pending-requests"],
    queryFn: async () => await GetPendingFoodSpots(),
  });

  if (isError) {
    return <ErrorPage error={error} />;
  }

  const showSkeleton = isLoading || sessionLoading;

  const pendingSpots = data?.data?.items ?? [];


  if (showSkeleton) {
    return (
      <div className="min-h-screen bg-background pb-36 md:pb-28">
        <Navbar
          username={user?.name || "A"}
          variant="ADMIN"
        />

        <main className="mx-auto max-w-7xl px-4 py-8">
          <div className="mb-8 space-y-3">
            <div className="h-9 w-64 rounded-full bg-secondary animate-pulse" />
            <div className="h-5 w-80 rounded-full bg-secondary animate-pulse" />
          </div>

          <div className="grid gap-4 md:grid-cols-3 mb-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <div className="h-4 w-24 rounded-full bg-secondary animate-pulse" />
                  <div className="h-8 w-20 rounded-full bg-secondary animate-pulse" />
                </CardHeader>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <div className="h-6 w-44 rounded-full bg-secondary animate-pulse" />
              <div className="h-4 w-72 rounded-full bg-secondary animate-pulse" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="rounded-3xl border border-border p-4 space-y-3">
                  <div className="h-5 w-40 rounded-full bg-secondary animate-pulse" />
                  <div className="h-4 w-full rounded-full bg-secondary animate-pulse" />
                  <div className="flex gap-2">
                    <div className="h-6 w-16 rounded-full bg-secondary animate-pulse" />
                    <div className="h-6 w-20 rounded-full bg-secondary animate-pulse" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-36 md:pb-28">
      <Navbar
        username={user?.name || "A"}
        variant="ADMIN"
      />

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Admin Dashboard
          </h1>

          <p className="text-muted-foreground mt-2">
            Review and verify submitted food spots.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>
                Pending Reviews
              </CardDescription>

              <CardTitle className="text-3xl">
                {pendingSpots.length}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>
                Queue Status
              </CardDescription>

              <CardTitle className="text-lg">
                Active
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>
                Moderator
              </CardDescription>

              <CardTitle className="text-lg truncate">
                {user?.name}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Pending Spots */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              Pending Requests
            </h2>

            <Badge variant="secondary">
              {pendingSpots.length} Pending
            </Badge>
          </div>

          {pendingSpots.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-16">
                <p className="text-muted-foreground">
                  No pending submissions 🎉
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {pendingSpots.map((spot: any) => (
                <Card key={spot.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle>
                          {spot.name}
                        </CardTitle>

                        <CardDescription>
                          {[
                            spot.location?.locality,
                            spot.location?.city,
                            spot.location?.state,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </CardDescription>
                      </div>

                      <Badge>
                        {spot.spotRating}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {spot.tags?.map((tag: TagsDTO) => (
                        <Badge
                          key={tag}
                          variant="outline"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Link to={`/admin/food-spots/${spot.id}`}>
                        <Button variant="outline">
                          View Details
                        </Button>
                      </Link>

                      <Button>
                        Approve
                      </Button>

                      <Button variant="destructive">
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
