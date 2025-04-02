"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Clipboard, Play, Info } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { GenerationResult, TypeDefinition } from "@/types/types"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog"

interface ApiConfigProps {
    endpoints: { type: string; url: string }[]
}

export default function ApiConfig({ endpoints }: ApiConfigProps) {
    const [activeTab, setActiveTab] = useState("fetch")
    const [selectedType, setSelectedType] = useState(
        endpoints.length > 0 ? endpoints[0].type : ""
    )
    const currentEndpoint =
        endpoints.find((e) => e.type === selectedType)?.url || ""
    const [testDialogOpen, setTestDialogOpen] = useState(false)
    const [testTabValue, setTestTabValue] = useState("all")
    const [testEndpoint, setTestEndpoint] = useState("")
    const [testResponse, setTestResponse] = useState<any>(null)
    const [testError, setTestError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code)
        toast({
            title: "Copied to clipboard",
            description: "Code snippet has been copied",
        })
    }

    const fetchCode = `// Get all ${selectedType} records
fetch("${currentEndpoint}")
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error("Error:", error));

// Get a specific ${selectedType} by ID
fetch("${currentEndpoint}?record_id=<record_id>")
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error("Error:", error));`

    const axiosCode = `import axios from 'axios';

// Get all ${selectedType} records
axios.get("${currentEndpoint}")
  .then(response => console.log(response.data))
  .catch(error => console.error("Error:", error));

// Get a specific ${selectedType} by ID
axios.get("${currentEndpoint}?record_id=<record_id>")
  .then(response => console.log(response.data))
  .catch(error => console.error("Error:", error));`

    const curlCode = `# Get all ${selectedType} records
curl -X GET "${currentEndpoint}" -H "Accept: application/json"

# Get a specific ${selectedType} by ID
curl -X GET "${currentEndpoint}?record_id=<record_id>" -H "Accept: application/json"`

    const testApiEndpoint = async (endpointType: "all" | "single") => {
        setIsLoading(true)
        setTestError(null)
        setTestResponse(null)

        // Set the endpoint to test
        let endpoint = currentEndpoint

        setTestTabValue(endpointType)

        try {
            const response = await fetch(endpoint)
            if (!response.ok) {
                throw new Error(`No data found for type: ${selectedType}`)
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
        <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
                <Label>API Endpoint:</Label>
                <div className="flex items-center gap-2">
                    <Select
                        value={selectedType}
                        onValueChange={setSelectedType}
                    >
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            {endpoints.map((endpoint) => (
                                <SelectItem
                                    key={endpoint.type}
                                    value={endpoint.type}
                                >
                                    {endpoint.type}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Input
                        value={currentEndpoint}
                        readOnly
                        className="font-mono text-sm bg-muted/30"
                    />
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                            navigator.clipboard.writeText(currentEndpoint)
                            toast({
                                title: "Copied to clipboard",
                                description: "API endpoint has been copied",
                            })
                        }}
                    >
                        <Clipboard className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="space-y-2">
                <Label>Usage Examples:</Label>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="fetch">Fetch</TabsTrigger>
                        <TabsTrigger value="axios">Axios</TabsTrigger>
                        <TabsTrigger value="curl">cURL</TabsTrigger>
                    </TabsList>

                    <TabsContent value="fetch" className="relative">
                        <pre className="p-3 rounded-md bg-muted/50 text-sm font-mono overflow-x-auto">
                            {fetchCode}
                        </pre>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => copyCode(fetchCode)}
                        >
                            <Clipboard className="h-4 w-4" />
                        </Button>
                    </TabsContent>

                    <TabsContent value="axios" className="relative">
                        <pre className="p-3 rounded-md bg-muted/50 text-sm font-mono overflow-x-auto">
                            {axiosCode}
                        </pre>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => copyCode(axiosCode)}
                        >
                            <Clipboard className="h-4 w-4" />
                        </Button>
                    </TabsContent>

                    <TabsContent value="curl" className="relative">
                        <pre className="p-3 rounded-md bg-muted/50 text-sm font-mono overflow-x-auto">
                            {curlCode}
                        </pre>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => copyCode(curlCode)}
                        >
                            <Clipboard className="h-4 w-4" />
                        </Button>
                    </TabsContent>
                </Tabs>
            </div>

            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="api-docs">
                    <AccordionTrigger className="text-sm">
                        <div className="flex items-center">
                            <Info className="h-4 w-4 mr-2" />
                            API Documentation
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-3 text-sm">
                            <p>
                                The mock API provides the following endpoints:
                            </p>

                            {endpoints.map((endpoint) => (
                                <div key={endpoint.type} className="space-y-2">
                                    <h4 className="font-medium">
                                        {endpoint.type} Endpoints
                                    </h4>
                                    <div className="space-y-1">
                                        <div>
                                            <code className="bg-muted/50 p-1 rounded">
                                                {endpoint.url}
                                            </code>
                                            <p className="text-muted-foreground">
                                                Returns all {endpoint.type}{" "}
                                                records
                                            </p>
                                        </div>
                                        <div>
                                            <code className="bg-muted/50 p-1 rounded">
                                                {endpoint.url}?record_id={"<"}
                                                {endpoint.type.toLowerCase()}_id
                                                {">"}
                                            </code>
                                            <p className="text-muted-foreground">
                                                Returns a specific{" "}
                                                {endpoint.type} by ID
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

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
            </div>

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
                                                    testTabValue !== "single"
                                                }
                                            >
                                                Single Item
                                            </TabsTrigger>
                                        </TabsList>
                                    </TabsContent>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            navigator.clipboard.writeText(
                                                JSON.stringify(
                                                    testResponse,
                                                    null,
                                                    2
                                                )
                                            )
                                            toast({
                                                title: "Copied to clipboard",
                                                description:
                                                    "Response data has been copied",
                                            })
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
