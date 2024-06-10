"use client"

import { useState } from "react"
import CopyButton from "./copy-button"
import { ResultsDropdown } from "./results-dropdown"

export default function ResultsList({
    results,
}: {
    results: { resultName: string; json: string }[]
}) {
    const [selectedResultIndex, setSelectedResultIndex] = useState<
        number | null
    >(0)

    return (
        <div
            className="border px-3 py-3 
                    rounded-md flex flex-col"
        >
            <div className="text-muted-foreground flex justify-between text-sm pt-1">
                {selectedResultIndex !== null ? (
                    <div className="flex justify-between w-full">
                        <div className="flex items-center gap-3">
                            Showing results for{" "}
                            <ResultsDropdown
                                setResultIndex={setSelectedResultIndex}
                                results={results}
                            />
                        </div>
                        <CopyButton
                            textToCopy={
                                selectedResultIndex !== null
                                    ? results[selectedResultIndex].json
                                    : ""
                            }
                        />
                    </div>
                ) : (
                    <div>
                        <ResultsDropdown
                            setResultIndex={setSelectedResultIndex}
                            results={results}
                        />
                    </div>
                )}
            </div>
            {selectedResultIndex !== null && (
                <div>
                    <div className="h-[500px] overflow-y-auto">
                        <div>
                            <pre>
                                {JSON.stringify(
                                    JSON.parse(
                                        results[selectedResultIndex].json
                                    ),
                                    null,
                                    2
                                )}
                            </pre>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
