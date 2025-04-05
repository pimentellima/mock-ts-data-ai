"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface GenerationResult {
    name: string
    json: string
}

interface ResultsDisplayProps {
    results?: GenerationResult[]
    activeTab: string
    setActiveTab: (tab: string) => void
}

export default function ResultsDisplay({
    results,
    activeTab,
    setActiveTab,
}: ResultsDisplayProps) {

    useEffect(() => {
        if (!results || results.length === 0) return
        if (results.length > 0 && !results.some((r) => r.name === activeTab)) {
            setActiveTab(results[0].name)
        }
    }, [results, activeTab])

    if (!results || results.length === 0) {
        return (
            <div className="flex items-center justify-center h-[300px] border rounded-md bg-muted/30">
                <p className="text-muted-foreground">No data generated yet</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                {results.length > 1 && (
                    <TabsList className="flex flex-wrap">
                        {results.map((result) => (
                            <TabsTrigger
                                key={result.name}
                                value={result.name}
                                className="flex-grow"
                            >
                                {result.name}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                )}

                {results.map((result) => (
                    <TabsContent
                        key={result.name}
                        value={result.name}
                        className="overflow-auto max-h-[400px]"
                    >
                        <div className="border rounded-md bg-muted/30 ">
                            <pre className="p-4 text-sm font-mono">
                                {JSON.stringify(
                                    JSON.parse(result.json),
                                    null,
                                    2
                                )}
                            </pre>
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}
