"use client"
import { GenerationResult } from "@/types/types"
import { saveAs } from "file-saver"
import JSZip from "jszip"
import { Clipboard, Download } from "lucide-react"
import { useState } from "react"
import { Button } from "./ui/button"
import { Label } from "./ui/label"
import { useToast } from "./ui/use-toast"
import useClipboard from "@/app/hooks/use-clipboard"

export default function ExportResultsControls({
    results,
}: {
    results?: GenerationResult[]
}) {
    const { toast } = useToast()
    const [exportFormat, setExportFormat] = useState("json")
    const clipboard = useClipboard()
    const copyToClipboard = () => {
        if (!results) return
        const combined = results.reduce((acc, result) => {
            acc[result.name] = JSON.parse(result.json)
            return acc
        }, {} as Record<string, any>)

        clipboard.copyToClipboard(JSON.stringify(combined, null, 2))
    }

    const downloadResults = async () => {
        if (!results) return
        if (exportFormat === "csv") {
            const zip = new JSZip()

            results.forEach(async (result) => {
                try {
                    const jsonData = JSON.parse(result.json)
                    if (!Array.isArray(jsonData)) {
                        console.error(
                            `Invalid JSON format for ${result.name}, expected an array.`
                        )
                        return
                    }

                    const csvHeader = Object.keys(jsonData[0]).join(",") + "\n"
                    const csvRows = jsonData
                        .map((obj) => Object.values(obj).join(","))
                        .join("\n")
                    const csvContent = csvHeader + csvRows

                    zip.file(`${result.name}.csv`, csvContent)
                } catch (error) {
                    console.error(`Error processing ${result.name}:`, error)
                }
            })

            const zipBlob = await zip.generateAsync({ type: "blob" })
            saveAs(zipBlob, "generation_results.zip")
            toast({
                title: "CSV Export",
                description:
                    "For multiple types, each type will be exported as a separate JSON file",
            })
        } else {
            const element = document.createElement("a")
            const combined = results.reduce((acc, result) => {
                acc[result.name] = JSON.parse(result.json)
                return acc
            }, {} as Record<string, any>)

            let content = JSON.stringify(combined, null, 2)
            let mimeType = "application/json"
            let extension = "json"

            const blob = new Blob([content], { type: mimeType })
            element.href = URL.createObjectURL(blob)
            element.download = `mock-data.${extension}`
            document.body.appendChild(element)
            element.click()
            document.body.removeChild(element)
        }
        toast({
            title: "Download started",
            description: `Data exported as ${exportFormat.toUpperCase()}`,
        })
    }
    
    return (
        <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
                <Label>Export format:</Label>
                <div className="flex border rounded-md">
                    <Button
                        variant={
                            exportFormat === "json" ? "secondary" : "ghost"
                        }
                        size="sm"
                        className="rounded-r-none"
                        onClick={() => setExportFormat("json")}
                    >
                        JSON
                    </Button>
                    <Button
                        variant={exportFormat === "csv" ? "secondary" : "ghost"}
                        size="sm"
                        className="rounded-none border-x"
                        onClick={() => setExportFormat("csv")}
                    >
                        CSV
                    </Button>
                    <Button
                        disabled
                        variant={exportFormat === "sql" ? "secondary" : "ghost"}
                        size="sm"
                        className="rounded-l-none"
                    >
                        SQL (soon)
                    </Button>
                </div>
            </div>
            <div className="flex gap-1">
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    <Clipboard className="mr-2 h-4 w-4" />
                    Copy
                </Button>
                <Button variant="outline" size="sm" onClick={downloadResults}>
                    <Download className="mr-2 h-4 w-4" />
                    Export
                </Button>
            </div>
        </div>
    )
}
