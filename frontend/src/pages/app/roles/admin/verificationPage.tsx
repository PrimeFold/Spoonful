

import { useMutation, useQuery } from "@tanstack/react-query";
import { Badge } from "../../../../components/ui/badge";
import  { Button } from "../../../../components/ui/button";
import  { CardHeader, CardTitle, CardDescription, CardContent, Card } from "../../../../components/ui/card";
import { Separator } from "../../../../components/ui/separator";
import { useParams } from "react-router-dom";
import { GetPendingFoodSpotById, VerifyPendingFoodSpots } from "../../../../../lib/actions";
import toast from "react-hot-toast";
import LoaderComponent from "../../../../../components/loader";
import ErrorPage from "../../../error/error";
import type { FoodSpotDTO } from "../../../../../../shared/food-spots.type";
import { queryClient } from "../../../../../lib/queryClient";

const VerificationPage = () => {

  const {id} = useParams();

  if(!id){
    return toast.error("Id not found !")
  }
  const {data,error,isLoading,isError} = useQuery({
    queryKey:['pending-submission',id],
    queryFn:()=>GetPendingFoodSpotById(id),
  })

  const ApproveMutation = useMutation({
    mutationFn: () => VerifyPendingFoodSpots(id, "VERIFIED"),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["pending-submission", id]});
      queryClient.invalidateQueries({queryKey:['admin:pending-requests']})
    },
  });


  const RejectMutation = useMutation({
    mutationFn:()=> VerifyPendingFoodSpots(id,"REJECTED"),
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:["pending-submissions",id]})
      queryClient.invalidateQueries({queryKey:['admin:pending-requests']})
    },
  })

  const handleVerification = (task:string)=>{
    if(task=="APPROVE"){
      ApproveMutation.mutate;
    }else if(task=="REJECT"){
      RejectMutation.mutate
    }
  }

  const PendingFoodSpot : FoodSpotDTO = data;

  if(isLoading){
    return <LoaderComponent/>
  }

  if(isError) return <ErrorPage error={error}/>
  
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Verify Food Spot
        </h1>

        <p className="text-muted-foreground mt-2">
          Review submission details before approving or rejecting.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Main Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  {PendingFoodSpot.name}
                </CardTitle>

                <CardDescription>
                  Submitted By {PendingFoodSpot.name}
                </CardDescription>
              </div>

              <Badge variant="secondary">
                Pending Review
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Location */}
           <div>
            <h3 className="font-medium mb-3">
              Location
            </h3>
              <div className="rounded-lg border p-4">
                <div className="space-y-1">
                  <p className="font-semibold">
                    {PendingFoodSpot.location.locality}
                  </p>

                  {PendingFoodSpot.location.town && (
                    <p className="text-muted-foreground">
                      {PendingFoodSpot.location.town}
                    </p>
                  )}

                  <p className="text-muted-foreground">
                    {PendingFoodSpot.location.city},{" "}
                    {PendingFoodSpot.location.state}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Tags */}
            <div>
              <h3 className="font-medium mb-3">
                Tags
              </h3>

              <div className="flex flex-wrap gap-2">
                {PendingFoodSpot.tags?.map((tag) => (
                  <Badge key={tag}>
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <Separator />

            {/* Rating */}
            <div>
              <h3 className="font-medium mb-2">
                Rating
              </h3>

              <Badge variant="outline">
                {PendingFoodSpot.spotRating}
              </Badge>
            </div>

            <Separator />

            {/* Images */}
            {PendingFoodSpot.imageUrl && ( 
              <div>
                <h3 className="font-medium mb-3">
                  Photos
                </h3>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="aspect-video rounded-lg border bg-muted" />
                  <div className="aspect-video rounded-lg border bg-muted" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Moderation Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                Review Actions
              </CardTitle>

              <CardDescription>
                Decide whether this submission
                should appear publicly.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              <Button
                className="w-full"
                size="lg"
                onClick={()=>handleVerification("APPROVE")}
              >
                Approve Spot
              </Button>

              <Button
                variant="destructive"
                className="w-full"
                size="lg"
                onClick={()=>handleVerification("REJECT")}
              >
                Reject Spot
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Submission Details
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground">
                  Submitted By 
                </p>

                <p className="font-medium">
                  User : {PendingFoodSpot.userid}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground">
                  Submitted At
                </p>

                <p className="font-medium">
                  {PendingFoodSpot.createAt}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground">
                  Status
                </p>

                <Badge variant="secondary">
                  {PendingFoodSpot.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Moderation Notes
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-muted-foreground">
                Check for duplicate listings,
                misleading tags, fake locations,
                or spam submissions before
                approving.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;