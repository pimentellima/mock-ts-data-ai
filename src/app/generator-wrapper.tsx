"use client"

import { useState } from "react"
import MockDataForm from "./mock-data-form"
import ResultsList from "./results-list"

export default function GeneratorWrapper() {
    const [result, setResult] = useState<
        { resultName: string; json: string }[] | null
    >(null)

    return (
        <div className="grid grid-cols-2 gap-5">
            <MockDataForm setResult={setResult} />
            <div className="mt-8">
                {!!result ? (
                    <ResultsList results={result} />
                ) : (
                    <div>
                        <p
                            className="border px-3 py-3
                        rounded-md text-sm text-muted-foreground"
                        >
                            The results will show here
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
