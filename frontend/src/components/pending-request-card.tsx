
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"


const PendingRequestCard = () => {
  return (
    <Card>
    <CardHeader>
        <CardTitle>
            Sharma Dhaba
        </CardTitle>

        <CardDescription>
            Ranchi • Jharkhand
        </CardDescription>
    </CardHeader>

    <CardContent>
        <div className="flex flex-wrap gap-2">
            <Badge>BUDGET</Badge>
            <Badge>LATE NIGHT</Badge>
            <Badge>NON VEG</Badge>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
            Submitted by Rahul Kumar
        </p>
    </CardContent>

    <CardFooter className="gap-2">
        <Button variant="outline">
            View
        </Button>

        <Button>
            Approve
        </Button>

        <Button variant="destructive">
            Reject
        </Button>
    </CardFooter>
</Card>
  )
}

export default PendingRequestCard