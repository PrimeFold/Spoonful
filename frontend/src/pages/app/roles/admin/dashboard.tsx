import toast from "react-hot-toast";
import { authClient } from "../../../../../lib/auth";
import Navbar from "../../../../components/Navbar";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { GetPendingFoodSpots, VerifyPendingFoodSpots } from "../../../../../lib/actions";
import ErrorPage from "../../../error/error";
import LoaderComponent from "../../../../../components/loader";
import type { FoodSpotDTO, TagsDTO, VerificationStatusDTO } from "../../../../../../shared/food-spots.type";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { useParams } from "react-router-dom";
import { queryClient } from "../../../../../lib/queryClient";

const AdminDashboard = () => {
    const { id } = useParams();
    if(!id){
        return toast.error("Id not found !")
    }
    const [status,setStatus] = useState<VerificationStatusDTO>();
    const {
      data: session,
      error: sessionError,
      isPending: sessionLoading,
    } = authClient.useSession();

    if(!status){
      return toast.error("Select a status first!")
    }

    const mutation = useMutation({
      mutationFn:async()=>VerifyPendingFoodSpots(id,status),
      onSuccess: () => {
        queryClient.setQueryData<FoodSpotDTO[]>(
          ["admin:pending-requests"],
          (old) => old?.filter((s) => s.id !== id) ?? []
        );
      }
    })

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
      return <ErrorPage error={error}/>;
    }

    if (isLoading || sessionLoading) {
      return <LoaderComponent />;
    }

    const pendingSpots = data?.data ?? [];


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
                {pendingSpots.map((spot:any) => (
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
                        {spot.tags?.map((tag:TagsDTO) => (
                          <Badge
                            key={tag}
                            variant="outline"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline">
                          View Details
                        </Button>

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