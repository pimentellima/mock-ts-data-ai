"use client"

import JSZip from "jszip"
import { saveAs } from "file-saver"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Clipboard, Download, Server, Plus, Trash2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import CodeEditor from "@/components/code-editor"
import RelationshipEditor from "@/components/relationship-editor"
import ResultsDisplay from "@/components/results-display"
import ApiConfig from "@/components/api-config"
import { GenerationResult, Relationship, TypeDefinition } from "@/types/types"
import { generateMockData } from "@/app/actions"

export default function DataGenerator() {
    const [typeDefinitions, setTypeDefinitions] = useState<TypeDefinition[]>([
        {
            id: "1",
            name: "User",
            code: "interface User {\n  id: number;\n  name: string;\n  email: string;\n  age?: number;\n}",
            count: 10,
        },
    ])
    const [apiEndpoints, setApiEndpoints] = useState<
        { type: string; url: string }[]
    >([])
    const [description, setDescription] = useState("")
    const [relationships, setRelationships] = useState<Relationship[]>([])
    const [results, setResults] = useState<GenerationResult[]>()
    const [isGenerating, setIsGenerating] = useState(false)
    const [activeTab, setActiveTab] = useState("editor")
    const [exportFormat, setExportFormat] = useState("json")
    const [apiEnabled, setApiEnabled] = useState(false)

    const addTypeDefinition = () => {
        const newId = String(Date.now())
        setTypeDefinitions([
            ...typeDefinitions,
            {
                id: newId,
                name: `Type${typeDefinitions.length + 1}`,
                code: "interface NewType {\n  id: number;\n  name: string;\n}",
                count: 10,
            },
        ])
    }

    const updateTypeDefinition = (
        id: string,
        field: "name" | "code",
        value: string
    ) => {
        setTypeDefinitions(
            typeDefinitions.map((def) =>
                def.id === id ? { ...def, [field]: value } : def
            )
        )
    }

    const removeTypeDefinition = (id: string) => {
        if (typeDefinitions.length > 1) {
            setTypeDefinitions(typeDefinitions.filter((def) => def.id !== id))
            // Also remove any relationships involving this type
            setRelationships(
                relationships.filter(
                    (rel) => rel.sourceId !== id && rel.targetId !== id
                )
            )
        } else {
            toast({
                title: "Cannot remove",
                description: "You need at least one type definition",
                variant: "destructive",
            })
        }
    }

    const generateData = async () => {
        setIsGenerating(true)

        try {
            const result = await generateMockData({
                relationships,
                typeDefinitions,
                description,
            })
            if (result.error) {
                toast({
                    title: "Generation failed",
                    description: result.error,
                    variant: "destructive",
                })
                return
            }
            const endpoints = result.result!.map((res) => ({
                type: res.name,
                url: `${process.env.NEXT_PUBLIC_URL}/api/mock/${res.id}`,
            }))
            setApiEndpoints(endpoints)
            setResults(result.result!)
            setActiveTab("results")

            toast({
                title: "Data generated",
                description: `Successfully generated data for ${result.result?.length} types`,
            })
        } catch (error) {
            toast({
                title: "Generation failed",
                description: "An error occurred while generating data",
                variant: "destructive",
            })
        } finally {
            setIsGenerating(false)
        }
    }

    const copyToClipboard = () => {
        if (!results) return
        const combined = results.reduce((acc, result) => {
            acc[result.name] = JSON.parse(result.json)
            return acc
        }, {} as Record<string, any>)

        navigator.clipboard.writeText(JSON.stringify(combined, null, 2))
        toast({
            title: "Copied to clipboard",
            description: "All generated data has been copied to your clipboard",
        })
    }

    // Add a function to update the count for a specific type
    const updateTypeCount = (id: string, count: number) => {
        setTypeDefinitions(
            typeDefinitions.map((def) =>
                def.id === id ? { ...def, count } : def
            )
        )
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
            element.download = `prototype-data.${extension}`
            document.body.appendChild(element)
            element.click()
            document.body.removeChild(element)
        }
        toast({
            title: "Download started",
            description: `Data exported as ${exportFormat.toUpperCase()}`,
        })
    }

    const enableApiEndpoint = async () => {
        setApiEnabled(true)
        toast({
            title: "API endpoints created",
            description: `Created mock API endpoints`,
        })
    }

    return (
        <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="editor">Type Definitions</TabsTrigger>
                    <TabsTrigger value="relationships">
                        Relationships
                    </TabsTrigger>
                    <TabsTrigger value="results">Results</TabsTrigger>
                </TabsList>

                <TabsContent value="editor" className="space-y-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="space-y-6">
                                {typeDefinitions.map((def, index) => (
                                    <div
                                        key={def.id}
                                        className="space-y-2 border-b pb-6 last:border-0 last:pb-0"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Label
                                                    htmlFor={`typename-${def.id}`}
                                                >
                                                    Type Name:
                                                </Label>
                                                <Input
                                                    id={`typename-${def.id}`}
                                                    value={def.name}
                                                    onChange={(e) =>
                                                        updateTypeDefinition(
                                                            def.id,
                                                            "name",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="max-w-[200px]"
                                                />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Label
                                                    htmlFor={`count-${def.id}`}
                                                    className="whitespace-nowrap"
                                                >
                                                    Count:
                                                </Label>
                                                <Input
                                                    id={`count-${def.id}`}
                                                    type="number"
                                                    min="1"
                                                    max="100"
                                                    value={def.count}
                                                    onChange={(e) =>
                                                        updateTypeCount(
                                                            def.id,
                                                            Number.parseInt(
                                                                e.target.value
                                                            ) || 1
                                                        )
                                                    }
                                                    className="w-20"
                                                />
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        removeTypeDefinition(
                                                            def.id
                                                        )
                                                    }
                                                    disabled={
                                                        typeDefinitions.length <=
                                                        1
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <Label
                                                htmlFor={`typecode-${def.id}`}
                                            >
                                                TypeScript Definition:
                                            </Label>
                                            <CodeEditor
                                                id={`typecode-${def.id}`}
                                                value={def.code}
                                                onChange={(value) =>
                                                    updateTypeDefinition(
                                                        def.id,
                                                        "code",
                                                        value
                                                    )
                                                }
                                                language="typescript"
                                                height="150px"
                                            />
                                        </div>
                                    </div>
                                ))}

                                <Button
                                    onClick={addTypeDefinition}
                                    variant="outline"
                                    className="w-full"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Type Definition
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="description">
                                    Description (helps AI understand your data
                                    needs):
                                </Label>
                                <Textarea
                                    id="description"
                                    placeholder="E.g., Generate realistic user data with names, emails, and ages between 18-65"
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    rows={3}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="relationships">
                    <Card>
                        <CardContent className="pt-6">
                            <RelationshipEditor
                                types={typeDefinitions}
                                relationships={relationships}
                                setRelationships={setRelationships}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="results">
                    <Card>
                        <CardContent className="pt-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium">
                                    Generated Data
                                </h3>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={copyToClipboard}
                                    >
                                        <Clipboard className="mr-2 h-4 w-4" />
                                        Copy
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
                                <Label>Export format:</Label>
                                <div className="flex border rounded-md">
                                    <Button
                                        variant={
                                            exportFormat === "json"
                                                ? "secondary"
                                                : "ghost"
                                        }
                                        size="sm"
                                        className="rounded-r-none"
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
                                        className="rounded-none border-x"
                                        onClick={() => setExportFormat("csv")}
                                    >
                                        CSV
                                    </Button>
                                    <Button
                                        disabled
                                        variant={
                                            exportFormat === "sql"
                                                ? "secondary"
                                                : "ghost"
                                        }
                                        size="sm"
                                        className="rounded-l-none"
                                    >
                                        SQL (soon)
                                    </Button>
                                </div>
                            </div>

                            <ResultsDisplay results={results} />

                            <div className="border-t pt-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            id="api-toggle"
                                            checked={apiEnabled}
                                            onCheckedChange={setApiEnabled}
                                        />
                                        <Label htmlFor="api-toggle">
                                            Enable Mock API Endpoint
                                        </Label>
                                    </div>
                                    {apiEndpoints.length === 0 && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={enableApiEndpoint}
                                            disabled={results?.length === 0}
                                        >
                                            <Server className="mr-2 h-4 w-4" />
                                            Generate Endpoints
                                        </Button>
                                    )}
                                </div>

                                {apiEnabled && apiEndpoints.length > 0 && (
                                    <ApiConfig endpoints={apiEndpoints} />
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
            <Button
                onClick={generateData}
                disabled={isGenerating}
                className="w-full"
            >
                {isGenerating ? "Generating..." : "Generate Data"}
            </Button>
            <Toaster />
        </div>
    )
}
