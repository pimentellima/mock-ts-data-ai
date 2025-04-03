import useClipboard from "@/app/hooks/use-clipboard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Clipboard } from "lucide-react"

interface ApiEndpointSelectProps {
    endpoints: { name: string; url: string }[]
    selectedApi: string
    setSelectedApi: (api: string) => void
    currentApiUrl: string
}
export default function ApiEndpointSelect({
    currentApiUrl,
    endpoints,
    selectedApi,
    setSelectedApi,
}: ApiEndpointSelectProps) {
    const { copyToClipboard } = useClipboard()
    return (
        <div className="flex items-center justify-between">
            <Label>API Endpoint:</Label>
            <div className="flex items-center gap-2">
                {endpoints?.length > 1 && (
                    <Select value={selectedApi} onValueChange={setSelectedApi}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            {endpoints.map((endpoint) => (
                                <SelectItem
                                    key={endpoint.name}
                                    value={endpoint.name}
                                >
                                    {endpoint.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
                <Input
                    value={currentApiUrl}
                    readOnly
                    className="font-mono text-sm bg-muted/30"
                />
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                        copyToClipboard(currentApiUrl)
                    }}
                >
                    <Clipboard className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
