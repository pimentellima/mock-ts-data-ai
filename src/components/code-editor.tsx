"use client"

import { useRef } from "react"

interface CodeEditorProps {
    id: string
    value: string
    onChange: (value: string) => void
    language?: string
    height?: string
}

export default function CodeEditor({
    id,
    value,
    onChange,
    language = "typescript",
    height = "200px",
}: CodeEditorProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    // In a real implementation, this would use a code editor like Monaco or CodeMirror
    // For this example, we'll use a styled textarea
    return (
        <div
            className="relative border rounded-md overflow-hidden"
            style={{ height }}
        >
            <textarea
                id={id}
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="font-mono text-sm p-3 w-full h-full resize-none bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary"
                spellCheck="false"
            />
        </div>
    )
}
