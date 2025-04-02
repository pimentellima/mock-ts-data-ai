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
import { TypeDefinition } from "@/types/types"

interface ApiConfigProps {
    endpoints: { type: string; url: string }[]
    typeDefinitions: TypeDefinition[]
}

export default function ApiConfig({
    endpoints,
    typeDefinitions,
}: ApiConfigProps) {
    const [activeTab, setActiveTab] = useState("fetch")
    const [selectedType, setSelectedType] = useState(
        endpoints.length > 0 ? endpoints[0].type : ""
    )
    const currentEndpoint =
        endpoints.find((e) => e.type === selectedType)?.url || ""

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

            <div className="flex justify-end">
                <Button variant="outline" size="sm" className="gap-2">
                    <Play className="h-4 w-4" />
                    Test Endpoint
                </Button>
            </div>
        </div>
    )
}
