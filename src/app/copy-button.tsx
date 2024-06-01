"use client"

import { Check, Clipboard } from "lucide-react"
import { useState } from "react"

export default function CopyButton({ textToCopy }: { textToCopy: string }) {
    const [copied, setCopied] = useState(false)

    return (
        <button
            className="opacity-80 hover:opacity-100 transition-opacity"
            title="Copy"
            onClick={() => {
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
                navigator.clipboard.writeText(textToCopy)
            }}
        >
            {copied ? (
                <Check className="h-5 w-5" />
            ) : (
                <Clipboard className="h-5 w-5" />
            )}
        </button>
    )
}