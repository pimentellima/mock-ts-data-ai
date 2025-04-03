"use client"

import ApiEndpointSelect from "@/components/api-config/api-endpoint-select"
import ApiUsageExamplesTabs from "@/components/api-config/api-usage-examples-tabs"
import EndpointsDocAccordion from "@/components/api-config/endpoints-doc-accordion"
import TestApiControls from "@/components/api-config/test-api-controls"
import ExportResultsControls from "@/components/export-results-controls"
import ResultsDisplay from "@/components/results-display"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import type { ResultWithGenerations } from "@/types/types"
import { format } from "date-fns"
import { useState } from "react"

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
    const apiEndpoints: { name: string; url: string }[] =
        result.generationResults.map((gen) => ({
            name: gen.name,
            url: `${process.env.NEXT_PUBLIC_URL}/api/mock/${gen.id}`,
        }))
    const [selectedApi, setSelectedApi] = useState(
        apiEndpoints.length > 0 ? apiEndpoints[0].name : ""
    )
    const currentApiUrl =
        apiEndpoints.find((e) => e.name === selectedApi)?.url || ""
    const [isLoading, setIsLoading] = useState(false)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[950px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
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
                                {result.generationResults.reduce(
                                    (acc, curr) => {
                                        const parsed = JSON.parse(
                                            curr.json || "[]"
                                        )
                                        return (
                                            acc +
                                            (Array.isArray(parsed)
                                                ? parsed.length
                                                : 0)
                                        )
                                    },
                                    0
                                )}{" "}
                                Items
                            </Badge>
                        </div>
                    </div>
                    <ExportResultsControls results={result.generationResults} />

                    <ResultsDisplay
                        activeTab={selectedApi}
                        setActiveTab={setSelectedApi}
                        results={result.generationResults}
                    />

                    {result.apiEnabled && apiEndpoints.length > 0 && (
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
                            <EndpointsDocAccordion endpoints={apiEndpoints} />
                        </div>
                    )}
                </div>
                {result.apiEnabled && apiEndpoints.length > 0 && (
                    <DialogFooter className="bg-background p-3 rounded-md border place-self-end w-min sticky bottom-0 z-10">
                        <TestApiControls
                            isLoading={isLoading}
                            setIsLoading={setIsLoading}
                            currentApiUrl={currentApiUrl}
                            selectedApi={selectedApi}
                        />
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    )
}
