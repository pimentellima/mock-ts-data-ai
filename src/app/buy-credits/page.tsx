import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { auth } from "@clerk/nextjs/server"
import BuyCreditsForm from "./buy-credits-form"

export default function Page() {
    const { userId } = auth()

    return (
        <div className="flex justify-center items-center">
            <Card className="bg-primary-foreground">
                <CardHeader>
                    <CardTitle>Buy credits</CardTitle>
                </CardHeader>
                <CardContent>
                    <BuyCreditsForm isAuth={!!userId} />
                </CardContent>
            </Card>
        </div>
    )
}
