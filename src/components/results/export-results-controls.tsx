"use client"
import { GenerationResult } from "@/types/types"
import { saveAs } from "file-saver"
import JSZip from "jszip"
import { Clipboard, Download } from "lucide-react"
import { useState } from "react"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { useToast } from "../ui/use-toast"
import { toXML } from "jstoxml"
import useClipboard from "@/app/hooks/use-clipboard"
import xlsx from "json-as-xlsx"

async function downloadXlsx(results: GenerationResult[]) {
    const zip = new JSZip()

    results.forEach(async (result) => {
        const json = JSON.parse(result.json)
        const buffer = xlsx(
            [
                {
                    sheet: result.name,
                    columns: Object.keys(json[0]).map((key) => ({
                        label: key,
                        value: key,
                    })),
                    content: json,
                },
            ],
            {
                writeOptions: {
                    type: "buffer",
                    bookType: "xlsx",
                },
            }
        )
        const blob = new Blob([buffer!], {
            type: "",
        })
        zip.file(`${result.name}.xlsx`, blob)
    })
    const zipBlob = await zip.generateAsync({ type: "blob" })
    saveAs(zipBlob, "generation_results.zip")
}

function downloadXml(results: GenerationResult[]) {
    const combined = results.reduce((acc, result) => {
        acc[result.name] = JSON.parse(result.json)
        return acc
    }, {} as Record<string, any>)
    const xmlData = toXML({ results: combined })
    const blob = new Blob([xmlData], {
        type: "text/xml",
    })
    saveAs(blob, "mock-data.xml")
}

async function downloadCsv(results: GenerationResult[]) {
    const zip = new JSZip()

    results.forEach(async (result) => {
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
    })

    const zipBlob = await zip.generateAsync({ type: "blob" })
    saveAs(zipBlob, "generation_results.zip")
}
function downloadJson(results: GenerationResult[]) {
    const combined =
        results.length > 1
            ? results.reduce((acc, result) => {
                  acc[result.name] = JSON.parse(result.json)
                  return acc
              }, {} as Record<string, any>)
            : JSON.parse(results[0].json)

    const blob = new Blob([JSON.stringify(combined, null, 2)], {
        type: "application/json",
    })
    saveAs(blob, "mock-data.json")
}

export default function ExportResultsControls({
    results,
}: {
    results?: GenerationResult[]
}) {
    const { toast } = useToast()
    const [exportFormat, setExportFormat] = useState<
        "json" | "csv" | "xml" | "xlsx" | "sql"
    >("json")
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

        try {
            switch (exportFormat) {
                case "csv":
                    await downloadCsv(results)
                    break
                case "json":
                    downloadJson(results)
                    break
                case "xml":
                    downloadXml(results)
                    break
                case "xlsx":
                    await downloadXlsx(results)
                    break
                default:
                    console.error("Unsupported export format")
                    return
            }
            toast({
                title: "Download started",
                description: `Data exported as ${exportFormat.toUpperCase()}`,
            })
        } catch (e) {
            console.error("Error downloading results:", e)
            toast({
                title: "Download failed",
                description: `Failed to export data as ${exportFormat.toUpperCase()}`,
                variant: "destructive",
            })
        }
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
                        variant={exportFormat === "xml" ? "secondary" : "ghost"}
                        size="sm"
                        className="rounded-none border-x"
                        onClick={() => setExportFormat("xml")}
                    >
                        XML
                    </Button>
                    <Button
                        variant={
                            exportFormat === "xlsx" ? "secondary" : "ghost"
                        }
                        size="sm"
                        className="rounded-none border-x"
                        onClick={() => setExportFormat("xlsx")}
                    >
                        XLSX
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
