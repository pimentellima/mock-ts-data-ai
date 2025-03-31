"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clipboard, Play } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface ApiConfigProps {
    endpoint: string
}

export default function ApiConfig({ endpoint }: ApiConfigProps) {
    const [activeTab, setActiveTab] = useState("fetch")

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code)
        toast({
            title: "Copied to clipboard",
            description: "Code snippet has been copied",
        })
    }

    const fetchCode = `fetch("${endpoint}")
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error("Error:", error));`

    const axiosCode = `import axios from 'axios';

axios.get("${endpoint}")
  .then(response => console.log(response.data))
  .catch(error => console.error("Error:", error));`

    const curlCode = `curl -X GET "${endpoint}" -H "Accept: application/json"`

    return (
        <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
                <Label>API Endpoint:</Label>
                <div className="flex items-center gap-2">
                    <Input
                        value={endpoint}
                        readOnly
                        className="font-mono text-sm bg-muted/30"
                    />
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                            navigator.clipboard.writeText(endpoint)
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

            <div className="flex justify-end">
                <Button variant="outline" size="sm" className="gap-2">
                    <Play className="h-4 w-4" />
                    Test Endpoint
                </Button>
            </div>
        </div>
    )
}
