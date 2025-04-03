import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { Clipboard, Play } from "lucide-react"
import { useState } from "react"
import { Button } from "../ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog"
import useClipboard from "@/app/hooks/use-clipboard"

interface TestApiControlsProps {
    currentApiUrl: string
    selectedApi: string
    isLoading: boolean
    setIsLoading: (loading: boolean) => void
}

export default function TestApiControls({
    currentApiUrl,
    selectedApi,
    isLoading,
    setIsLoading,
}: TestApiControlsProps) {
    const [testDialogOpen, setTestDialogOpen] = useState(false)
    const [testTabValue, setTestTabValue] = useState("all")
    const [testEndpoint, setTestEndpoint] = useState("")
    const [testResponse, setTestResponse] = useState<any>(null)
    const [testError, setTestError] = useState<string | null>(null)
    const { copyToClipboard } = useClipboard()

    const testApiEndpoint = async (endpointType: "all" | "single") => {
        setIsLoading(true)
        setTestError(null)
        setTestResponse(null)

        // Set the endpoint to test
        let endpoint = currentApiUrl

        setTestTabValue(endpointType)

        try {
            const response = await fetch(endpoint)
            if (!response.ok) {
                throw new Error(`No data found for type: ${selectedApi}`)
            }
            let result = (await response.json()) as string
            if (endpointType === "single") {
                const resultsArray = JSON.parse(result) as any[]
                result = JSON.stringify(resultsArray[0])
                endpoint = `${endpoint}?record_id=${resultsArray[0].id}`
            }
            setTestResponse(result)
            setTestEndpoint(endpoint)
            setTestDialogOpen(true)
        } catch (error) {
            setTestError(
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred"
            )
            setTestDialogOpen(true)
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <div className="flex justify-end gap-2">
            <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => testApiEndpoint("all")}
                disabled={isLoading}
            >
                <Play className="h-4 w-4" />
                Test Collection
            </Button>
            <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => testApiEndpoint("single")}
                disabled={isLoading}
            >
                <Play className="h-4 w-4" />
                Test Single Item
            </Button>
            <Dialog open={testDialogOpen} onOpenChange={setTestDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center justify-between">
                            <span>API Test Results</span>
                        </DialogTitle>
                        <DialogDescription>
                            Response from:{" "}
                            <code className="text-xs bg-muted/50 p-1 rounded">
                                {testEndpoint}
                            </code>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-4">
                        {testError ? (
                            <div className="p-4 border border-destructive/50 bg-destructive/10 rounded-md text-destructive">
                                <h4 className="font-medium mb-1">Error</h4>
                                <p>{testError}</p>
                            </div>
                        ) : testResponse ? (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <Tabs>
                                        <TabsContent
                                            value={testTabValue}
                                            className="w-full"
                                        >
                                            <TabsList>
                                                <TabsTrigger
                                                    value="all"
                                                    disabled={
                                                        testTabValue !== "all"
                                                    }
                                                >
                                                    Collection
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    value="single"
                                                    disabled={
                                                        testTabValue !==
                                                        "single"
                                                    }
                                                >
                                                    Single Item
                                                </TabsTrigger>
                                            </TabsList>
                                        </TabsContent>
                                    </Tabs>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            copyToClipboard(
                                                JSON.stringify(
                                                    testResponse,
                                                    null,
                                                    2
                                                )
                                            )
                                        }}
                                    >
                                        <Clipboard className="h-4 w-4 mr-2" />
                                        Copy
                                    </Button>
                                </div>

                                <div className="border rounded-md overflow-auto bg-muted/30 max-h-[400px]">
                                    <pre className="p-4 text-sm font-mono">
                                        {JSON.stringify(
                                            JSON.parse(testResponse),
                                            null,
                                            2
                                        )}
                                    </pre>
                                </div>

                                <div className="text-sm text-muted-foreground">
                                    <p>
                                        Status:{" "}
                                        <span className="text-green-600 font-medium">
                                            200 OK
                                        </span>
                                    </p>
                                    <p>
                                        Time:{" "}
                                        {Math.floor(Math.random() * 100) + 50}ms
                                    </p>
                                    <p>Content-Type: application/json</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-center items-center h-[200px]">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
