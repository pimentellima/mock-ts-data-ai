"use client"

import { useState } from "react"
import { format } from "date-fns"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clipboard, Download, Server } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import type { ResultWithGenerations } from "@/types/types"

interface ResultDetailDialogProps {
    result: ResultWithGenerations
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function ResultDetailDialog({
    result,
    open,
    onOpenChange,
}: ResultDetailDialogProps) {
    const [activeTab, setActiveTab] = useState<string>(
        result.generationResults[0]?.name || ""
    )
    const [exportFormat, setExportFormat] = useState("json")

    const copyToClipboard = (content: string) => {
        navigator.clipboard.writeText(content)
        toast({
            title: "Copied to clipboard",
            description: "The data has been copied to your clipboard",
        })
    }

    const downloadResults = () => {
        // Create a combined object with all results
        const combined = result.generationResults.reduce((acc, genResult) => {
            acc[genResult.name] = JSON.parse(genResult.json)
            return acc
        }, {} as Record<string, any>)

        let content = JSON.stringify(combined, null, 2)
        let mimeType = "application/json"
        let extension = "json"

        if (exportFormat === "csv") {
            // For CSV, we'll create a zip file with multiple CSVs
            toast({
                title: "CSV Export",
                description:
                    "For multiple types, each type will be exported as a separate JSON file",
            })
        } else if (exportFormat === "sql") {
            // Convert JSON to SQL INSERT statements for all types
            try {
                const sqlStatements: string[] = []

                result.generationResults.forEach((genResult) => {
                    const data = JSON.parse(genResult.json)
                    if (Array.isArray(data) && data.length > 0) {
                        const tableName = genResult.name.toLowerCase()
                        const headers = Object.keys(data[0])

                        sqlStatements.push(
                            `CREATE TABLE ${tableName} (`,
                            headers
                                .map((header) => {
                                    if (header === "id")
                                        return "  id INT PRIMARY KEY"
                                    return `  ${header} VARCHAR(255)`
                                })
                                .join(",\n"),
                            ");\n",
                            ...data.map((row) => {
                                const values = headers.map((header) => {
                                    const val = row[header]
                                    if (val === null || val === undefined)
                                        return "NULL"
                                    if (typeof val === "number") return val
                                    return `'${String(val).replace(
                                        /'/g,
                                        "''"
                                    )}'`
                                })
                                return `INSERT INTO ${tableName} (${headers.join(
                                    ", "
                                )}) VALUES (${values.join(", ")});`
                            }),
                            "\n"
                        )
                    }
                })

                content = sqlStatements.join("\n")
                mimeType = "application/sql"
                extension = "sql"
            } catch (e) {
                toast({
                    title: "Export failed",
                    description: "Could not convert to SQL format",
                    variant: "destructive",
                })
                return
            }
        }

        const element = document.createElement("a")
        const blob = new Blob([content], { type: mimeType })
        element.href = URL.createObjectURL(blob)
        element.download = `prototype-data-${result.id.substring(
            0,
            8
        )}.${extension}`
        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)

        toast({
            title: "Download started",
            description: `Data exported as ${extension.toUpperCase()}`,
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                        <span>Result Details</span>
                        <Badge
                            variant={result.apiEnabled ? "default" : "outline"}
                        >
                            {result.apiEnabled ? "API Enabled" : "API Disabled"}
                        </Badge>
                    </DialogTitle>
                    <div className="text-sm text-muted-foreground">
                        <p>ID: {result.id}</p>
                        <p>
                            Created:{" "}
                            {format(
                                new Date(result.createdAt),
                                "MMMM d, yyyy h:mm a"
                            )}
                        </p>
                    </div>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary">
                                {result.generationResults.length} Types
                            </Badge>
                            <Badge variant="outline">
                                {result.generationResults.reduce((acc, curr) => {
                                    const parsed = JSON.parse(curr.json || "[]")
                                    return (
                                        acc +
                                        (Array.isArray(parsed)
                                            ? parsed.length
                                            : 0)
                                    )
                                }, 0)}{" "}
                                Items
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    copyToClipboard(
                                        JSON.stringify(
                                            result.generationResults.reduce((acc, r) => {
                                                acc[r.name] = JSON.parse(r.json)
                                                return acc
                                            }, {} as Record<string, any>),
                                            null,
                                            2
                                        )
                                    )
                                }
                            >
                                <Clipboard className="mr-2 h-4 w-4" />
                                Copy All
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={downloadResults}
                            >
                                <Download className="mr-2 h-4 w-4" />
                                Export
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm">Export format:</span>
                        <div className="flex border rounded-md">
                            <Button
                                variant={
                                    exportFormat === "json"
                                        ? "secondary"
                                        : "ghost"
                                }
                                size="sm"
                                className="rounded-r-none h-7 text-xs"
                                onClick={() => setExportFormat("json")}
                            >
                                JSON
                            </Button>
                            <Button
                                variant={
                                    exportFormat === "csv"
                                        ? "secondary"
                                        : "ghost"
                                }
                                size="sm"
                                className="rounded-none border-x h-7 text-xs"
                                onClick={() => setExportFormat("csv")}
                            >
                                CSV
                            </Button>
                            <Button
                                variant={
                                    exportFormat === "sql"
                                        ? "secondary"
                                        : "ghost"
                                }
                                size="sm"
                                className="rounded-l-none h-7 text-xs"
                                onClick={() => setExportFormat("sql")}
                            >
                                SQL
                            </Button>
                        </div>
                    </div>

                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="flex flex-wrap">
                            {result.generationResults.map((genResult) => (
                                <TabsTrigger
                                    key={genResult.name}
                                    value={genResult.name}
                                    className="flex-grow"
                                >
                                    {genResult.name}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {result.generationResults.map((genResult) => (
                            <TabsContent
                                key={genResult.name}
                                value={genResult.name}
                            >
                                <div className="border rounded-md overflow-auto bg-muted/30 max-h-[400px]">
                                    <div className="flex items-center justify-between p-2 border-b bg-muted/50">
                                        <div className="text-sm font-medium">
                                            {genResult.name} Data
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                copyToClipboard(genResult.json)
                                            }
                                        >
                                            <Clipboard className="h-3.5 w-3.5 mr-1" />
                                            Copy
                                        </Button>
                                    </div>
                                    <pre className="p-4 text-sm font-mono">
                                        {JSON.stringify(
                                            JSON.parse(genResult.json),
                                            null,
                                            2
                                        )}
                                    </pre>
                                </div>

                                <div className="mt-4 text-sm">
                                    <div className="font-medium mb-2">
                                        Type Definition:
                                    </div>
                                    <div className="border rounded-md overflow-auto bg-muted/30 max-h-[200px]">
                                        <pre className="p-4 text-sm font-mono">
                                            {genResult.typeDefinition}
                                        </pre>
                                    </div>
                                </div>
                            </TabsContent>
                        ))}
                    </Tabs>

                    {result.apiEnabled && (
                        <div className="mt-6 border-t pt-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Server className="h-4 w-4" />
                                <h3 className="font-medium">API Endpoints</h3>
                            </div>
                            <div className="space-y-3">
                                {result.generationResults.map((genResult) => (
                                    <div
                                        key={genResult.name}
                                        className="border rounded-md p-3 bg-muted/20"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium text-sm">
                                                {genResult.name} API
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7"
                                                onClick={() =>
                                                    copyToClipboard(
                                                        `https://api.example.com/mock/${
                                                            result.id
                                                        }/${genResult.name.toLowerCase()}`
                                                    )
                                                }
                                            >
                                                <Clipboard className="h-3.5 w-3.5 mr-1" />
                                                Copy URL
                                            </Button>
                                        </div>
                                        <code className="text-xs bg-muted/50 p-1 rounded block mb-1">
                                            GET https://api.example.com/mock/
                                            {result.id}/
                                            {genResult.name.toLowerCase()}
                                        </code>
                                        <code className="text-xs bg-muted/50 p-1 rounded block">
                                            GET https://api.example.com/mock/
                                            {result.id}/
                                            {genResult.name.toLowerCase()}/{"{"}
                                            {genResult.name.toLowerCase()}_id
                                            {"}"}
                                        </code>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
