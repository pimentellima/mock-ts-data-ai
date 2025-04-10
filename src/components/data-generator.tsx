"use client"

import { generateMockData } from "@/app/actions"
import CodeEditor from "@/components/code-editor"
import RelationshipEditor from "@/components/relationship-editor"
import ResultsDisplay from "@/components/results/results-display"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Toaster } from "@/components/ui/toaster"
import { toast } from "@/components/ui/use-toast"
import { GenerationResult, Relationship, TypeDefinition } from "@/types/types"
import { Plus, Server, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import ApiEndpointSelect from "./api-config/api-endpoint-select"
import ApiUsageExamplesTabs from "./api-config/api-usage-examples-tabs"
import EndpointsDocAccordion from "./api-config/endpoints-doc-accordion"
import ExportResultsControls from "./results/export-results-controls"
import TestApiControls from "./api-config/test-api-controls"
import { ITEMS_PER_CREDIT } from "@/constants"
import { formatCredits } from "@/lib/format-credits"
import { useSession } from "next-auth/react"
import { ToastAction } from "./ui/toast"
import Link from "next/link"

export default function DataGenerator() {
    const session = useSession()
    const [formData, setFormData] = useState<{
        typeDefinitions: TypeDefinition[]
        description: string
        relationships: Relationship[]
    }>({
        typeDefinitions: [
            {
                id: "1",
                name: "User",
                code: "interface User {\n  id: number;\n  name: string;\n  email: string;\n  age?: number;\n}",
                count: 15,
            },
        ],
        description: "",
        relationships: [],
    })
    const [apiEndpoints, setApiEndpoints] = useState<
        { name: string; url: string }[]
    >([])
    const [results, setResults] = useState<GenerationResult[]>()
    const [isGenerating, setIsGenerating] = useState(false)
    const [activeTab, setActiveTab] = useState("editor")
    const [apiEnabled, setApiEnabled] = useState(false)
    const [selectedApi, setSelectedApi] = useState(
        apiEndpoints.length > 0 ? apiEndpoints[0].name : ""
    )
    const currentApiUrl =
        apiEndpoints.find((e) => e.name === selectedApi)?.url || ""

    useEffect(() => {
        const formData = localStorage.getItem("formData")
        if (formData) {
            setFormData(JSON.parse(formData))
            localStorage.removeItem("formData")
        }
    }, [])

    const totalCredits =
        formData.typeDefinitions.reduce((acc, def) => acc + def.count, 0) /
        ITEMS_PER_CREDIT

    const addTypeDefinition = () => {
        const newId = String(Date.now())
        const oldTypeDefinitions = formData.typeDefinitions
        const typeDefinitions = [
            ...oldTypeDefinitions,
            {
                id: newId,
                name: `Type${oldTypeDefinitions.length + 1}`,
                code: `interface ${`Type${
                    oldTypeDefinitions.length + 1
                }`} {\n  id: number;\n  name: string;\n}`,
                count: 10,
            },
        ]
        setFormData({ ...formData, typeDefinitions })
    }

    const updateTypeDefinition = (
        id: string,
        field: "name" | "code",
        value: string
    ) => {
        setFormData({
            ...formData,
            typeDefinitions: formData.typeDefinitions.map((def) => {
                if (def.id === id) {
                    // Create updated definition with the changed field
                    const updatedDef = { ...def, [field]: value }

                    if (field === "name") {
                        // Check for different patterns in the code
                        const namedInterfaceMatch =
                            def.code.match(/interface\s+(\w+)/)
                        const unnamedInterfaceMatch =
                            def.code.match(/interface\s*{/)
                        const namedTypeMatch =
                            def.code.match(/type\s+(\w+)\s*=/)

                        if (
                            namedInterfaceMatch &&
                            namedInterfaceMatch[1] === def.name
                        ) {
                            // Replace existing interface name
                            updatedDef.code = def.code.replace(
                                /(interface\s+)(\w+)(.*)/,
                                `$1${value}$3`
                            )
                        } else if (unnamedInterfaceMatch) {
                            // Add a name to unnamed interface
                            updatedDef.code = def.code.replace(
                                /(interface)(\s*)({)/,
                                `$1 ${value} $3`
                            )
                        } else if (
                            namedTypeMatch &&
                            namedTypeMatch[1] === def.name
                        ) {
                            // Replace type name
                            updatedDef.code = def.code.replace(
                                /(type\s+)(\w+)(\s*=.*)/,
                                `$1${value}$3`
                            )
                        }
                        // If none of the patterns match, only the name will be updated
                    } else if (field === "code") {
                        // Check if new code has named interface or type
                        const namedInterfaceMatch =
                            value.match(/interface\s+(\w+)/)
                        const namedTypeMatch = value.match(/type\s+(\w+)\s*=/)

                        // Check previous code patterns
                        const oldNamedInterfaceMatch =
                            def.code.match(/interface\s+(\w+)/)
                        const oldUnnamedInterfaceMatch =
                            def.code.match(/interface\s*{/)
                        const oldNamedTypeMatch =
                            def.code.match(/type\s+(\w+)\s*=/)

                        // If name previously matched or there was an unnamed interface, update name
                        if (
                            namedInterfaceMatch &&
                            ((oldNamedInterfaceMatch &&
                                def.name === oldNamedInterfaceMatch[1]) ||
                                oldUnnamedInterfaceMatch)
                        ) {
                            updatedDef.name = namedInterfaceMatch[1]
                        } else if (
                            namedTypeMatch &&
                            oldNamedTypeMatch &&
                            def.name === oldNamedTypeMatch[1]
                        ) {
                            updatedDef.name = namedTypeMatch[1]
                        }
                    }

                    return updatedDef
                }
                return def
            }),
        })
    }
    const removeTypeDefinition = (id: string) => {
        if (formData.typeDefinitions.length > 1) {
            setFormData({
                ...formData,
                typeDefinitions: formData.typeDefinitions.filter(
                    (def) => def.id !== id
                ),
            })
            setFormData({
                ...formData,
                relationships: formData.relationships.filter(
                    (rel) => rel.sourceId !== id && rel.targetId !== id
                ),
            })
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
        if (!session.data?.user) {
            localStorage.setItem("formData", JSON.stringify(formData))
            toast({
                title: "You need to sign in to generate data",
                variant: "destructive",
                action: (
                    <ToastAction altText="Sign in ">
                        <Button asChild variant="link">
                            <Link href="/sign-in">Sign in</Link>
                        </Button>
                    </ToastAction>
                ),
            })
            setIsGenerating(false)
            return
        }
        try {
            const result = await generateMockData(formData)
            if (result.error) {
                toast({
                    title: "Generation failed",
                    description: result.error,
                    variant: "destructive",
                })
                return
            }
            const endpoints = result.result!.map((res) => ({
                name: res.name,
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
            localStorage.removeItem("formData")
            setIsGenerating(false)
        }
    }

    const updateTypeCount = (id: string, count: number) => {
        setFormData({
            ...formData,
            typeDefinitions: formData.typeDefinitions.map((def) =>
                def.id === id ? { ...def, count } : def
            ),
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
                                {formData.typeDefinitions.map((def, index) => (
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
                                                    max="100"
                                                    value={def.count}
                                                    onChange={(e) =>
                                                        updateTypeCount(
                                                            def.id,
                                                            Number.parseInt(
                                                                e.target.value
                                                            )
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
                                                        formData.typeDefinitions
                                                            .length <= 1
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
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value,
                                        })
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
                                types={formData.typeDefinitions}
                                relationships={formData.relationships}
                                setRelationships={(relationships) =>
                                    setFormData({
                                        ...formData,
                                        relationships,
                                    })
                                }
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="results">
                    <Card>
                        <CardContent className="pt-6 space-y-4">
                            <ExportResultsControls results={results} />

                            <ResultsDisplay
                                activeTab={selectedApi}
                                setActiveTab={setSelectedApi}
                                results={results}
                            />

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
                                    <div className="mt-4 space-y-4">
                                        <ApiEndpointSelect
                                            currentApiUrl={currentApiUrl}
                                            endpoints={apiEndpoints}
                                            selectedApi={selectedApi}
                                            setSelectedApi={setSelectedApi}
                                        />
                                        <ApiUsageExamplesTabs
                                            currentApiUrl={currentApiUrl}
                                            selectedApi={selectedApi}
                                        />
                                        <EndpointsDocAccordion
                                            endpoints={apiEndpoints}
                                        />
                                        <TestApiControls
                                            currentApiUrl={currentApiUrl}
                                            selectedApi={selectedApi}
                                        />
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
            {activeTab !== "results" && (
                <Button
                    onClick={generateData}
                    disabled={isGenerating}
                    className="w-full"
                >
                    {isGenerating
                        ? "Generating..."
                        : `Generate Data (${formatCredits(
                              totalCredits
                          )} credits)`}
                </Button>
            )}
            <Toaster />
        </div>
    )
}
