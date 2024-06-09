"use client"

import { useState } from "react"
import MockDataForm from "./mock-data-form"
import ResultsList from "./results-list"

export default function GeneratorWrapper() {
    const [result, setResult] = useState<
        { resultName: string; json: string }[] | null
    >([
        {
            resultName: "User",
            json: '[{\n  "id": 1,\n  "name": "John Doe",\n  "age": 30\n},{\n  "id": 2,\n  "name": "Jane Smith",\n  "age": 25\n},{\n  "id": 3,\n  "name": "Alice Johnson",\n  "age": 35\n},{\n  "id": 4,\n  "name": "Bob White",\n  "age": 27\n},{\n  "id": 5,\n  "name": "Eve Brown",\n  "age": 40\n}]',
        },
        {
            resultName: "Friend",
            json: '[{\n  "userId": 1,\n  "friendId": 2\n},{\n  "userId": 2,\n  "friendId": 3\n},{\n  "userId": 3,\n  "friendId": 4\n},{\n  "userId": 4,\n  "friendId": 5\n},{\n  "userId": 5,\n  "friendId": 1\n}]',
        },
    ])

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
