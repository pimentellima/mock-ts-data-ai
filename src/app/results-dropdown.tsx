"use client"
import * as React from "react"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function ResultsDropdown({
    results,
    setResultIndex: setResult,
}: {
    results: { resultName: string; json: string }[]
    setResultIndex: React.Dispatch<React.SetStateAction<number | null>>
}) {
    return (
        <Select
            defaultValue={results[0].resultName}
            onValueChange={(value) =>
                setResult(
                    results.findIndex((result) => result.resultName === value)
                )
            }
        >
            <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Select a result to show" />
            </SelectTrigger>
            <SelectContent>
                {results.map(({ resultName }, index) => (
                    <SelectItem key={resultName + index} value={resultName}>
                        {resultName}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
