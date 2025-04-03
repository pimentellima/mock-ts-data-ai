import useClipboard from "@/app/hooks/use-clipboard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clipboard } from "lucide-react"
import { useState } from "react"
import { Button } from "../ui/button"
import { Label } from "../ui/label"

interface ApiUsageExamplesTabsProps {
    selectedApi: string
    currentApiUrl: string
}
export default function ApiUsageExamplesTabs({
    selectedApi,
    currentApiUrl,
}: ApiUsageExamplesTabsProps) {
    const { copyToClipboard } = useClipboard()
    const [activeTab, setActiveTab] = useState("fetch")
    const fetchCode = `// Get all ${selectedApi} records
    fetch("${currentApiUrl}")
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error("Error:", error));
    
    // Get a specific ${selectedApi} by ID
    fetch("${currentApiUrl}?record_id=<record_id>")
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error("Error:", error));`

    const axiosCode = `import axios from 'axios';
    
    // Get all ${selectedApi} records
    axios.get("${currentApiUrl}")
      .then(response => console.log(response.data))
      .catch(error => console.error("Error:", error));
    
    // Get a specific ${selectedApi} by ID
    axios.get("${currentApiUrl}?record_id=<record_id>")
      .then(response => console.log(response.data))
      .catch(error => console.error("Error:", error));`

    const curlCode = `# Get all ${selectedApi} records
    curl -X GET "${currentApiUrl}" -H "Accept: application/json"
    
    # Get a specific ${selectedApi} by ID
    curl -X GET "${currentApiUrl}?record_id=<record_id>" -H "Accept: application/json"`

    return (
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
                        onClick={() => copyToClipboard(fetchCode)}
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
                        onClick={() => copyToClipboard(axiosCode)}
                    >
                        <Clipboard className="h-4 w-4" />
                    </Button>
                </TabsContent>

                <TabsContent value="curl" className="relative">
                    <pre className="p-3 rounded-md bg-muted/50 text-sm font-mono overflow-x-auto sm:max-w-[870px]">
                        {curlCode}
                    </pre>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(curlCode)}
                    >
                        <Clipboard className="h-4 w-4" />
                    </Button>
                </TabsContent>
            </Tabs>
        </div>
    )
}
