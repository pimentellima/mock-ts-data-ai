import { useToast } from "@/components/ui/use-toast"

export default function useClipboard() {
    const { toast } = useToast()
    const copyToClipboard = (content: string) => {
        navigator.clipboard.writeText(content)
        toast({
            title: "Copied to clipboard",
            description: "The data has been copied to your clipboard",
        })
    }

    return { copyToClipboard }
}
