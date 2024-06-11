"use client"
import { useState } from "react"
import MockDataForm from "./mock-data-form"
import ResultsList from "./results-list"

export default function Home() {
    const [result, setResult] = useState<
        { resultName: string; json: string }[] | null
    >([
        {
            resultName: "User",
            json: '[\n  {\n    "id": 1,\n    "name": "John Doe"\n  },\n  {\n    "id": 2,\n    "name": "Jane Smith"\n  },\n  {\n    "id": 3,\n    "name": "Alice Johnson"\n  },\n  {\n    "id": 4,\n    "name": "Bob Williams"\n  },\n  {\n    "id": 5,\n    "name": "Emma Brown"\n  },\n  {\n    "id": 6,\n    "name": "Michael Davis"\n  },\n  {\n    "id": 7,\n    "name": "Jessica Wilson"\n  },\n  {\n    "id": 8,\n    "name": "David Martinez"\n  },\n  {\n    "id": 9,\n    "name": "Sophia Anderson"\n  },\n  {\n    "id": 10,\n    "name": "William Garcia"\n  },\n  {\n    "id": 11,\n    "name": "Olivia Rodriguez"\n  },\n  {\n    "id": 12,\n    "name": "James Hernandez"\n  },\n  {\n    "id": 13,\n    "name": "Emily Lopez"\n  },\n  {\n    "id": 14,\n    "name": "Matthew Scott"\n  },\n  {\n    "id": 15,\n    "name": "Ava King"\n  },\n  {\n    "id": 16,\n    "name": "Daniel Perez"\n  },\n  {\n    "id": 17,\n    "name": "Sofia Thompson"\n  },\n  {\n    "id": 18,\n    "name": "Logan White"\n  },\n  {\n    "id": 19,\n    "name": "Victoria Hall"\n  },\n  {\n    "id": 20,\n    "name": "Joseph Lee"\n  },\n  {\n    "id": 21,\n    "name": "Kimberly Clark"\n  },\n  {\n    "id": 22,\n    "name": "Nicholas Green"\n  },\n  {\n    "id": 23,\n    "name": "Grace Baker"\n  },\n  {\n    "id": 24,\n    "name": "Benjamin Adams"\n  },\n  {\n    "id": 25,\n    "name": "Lily Wright"\n  }\n]',
        },
        {
            resultName: "Friend",
            json: '[\n  {\n    "userId": 1,\n    "friendId": 2\n  },\n  {\n    "userId": 2,\n    "friendId": 3\n  },\n  {\n    "userId": 3,\n    "friendId": 4\n  },\n  {\n    "userId": 4,\n    "friendId": 5\n  },\n  {\n    "userId": 5,\n    "friendId": 6\n  },\n  {\n    "userId": 6,\n    "friendId": 7\n  },\n  {\n    "userId": 7,\n    "friendId": 8\n  },\n  {\n    "userId": 8,\n    "friendId": 9\n  },\n  {\n    "userId": 9,\n    "friendId": 10\n  },\n  {\n    "userId": 10,\n    "friendId": 11\n  },\n  {\n    "userId": 11,\n    "friendId": 12\n  },\n  {\n    "userId": 12,\n    "friendId": 13\n  },\n  {\n    "userId": 13,\n    "friendId": 14\n  },\n  {\n    "userId": 14,\n    "friendId": 15\n  },\n  {\n    "userId": 15,\n    "friendId": 16\n  },\n  {\n    "userId": 16,\n    "friendId": 17\n  },\n  {\n    "userId": 17,\n    "friendId": 18\n  },\n  {\n    "userId": 18,\n    "friendId": 19\n  },\n  {\n    "userId": 19,\n    "friendId": 20\n  },\n  {\n    "userId": 20,\n    "friendId": 21\n  },\n  {\n    "userId": 21,\n    "friendId": 22\n  },\n  {\n    "userId": 22,\n    "friendId": 23\n  },\n  {\n    "userId": 23,\n    "friendId": 24\n  },\n  {\n    "userId": 24,\n    "friendId": 25\n  }\n]',
        },
    ])

    return (
        <main className="flex flex-col justify-center h-full gap-2">
            <h1 className="text-2xl text-center tracking-tight font-semibold mt-5">
                Typescript to Mock Data Generator
            </h1>
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
        </main>
    )
}
