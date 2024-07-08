"use client"

import { format } from "date-fns"
import { Check, Clipboard, Server } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Result({
    json,
    createdAt,
    id,
}: {
    json: string
    createdAt?: Date | null
    id?: string
}) {
    return (
        <div
            className="border px-3 py-3 
             rounded-md flex flex-col"
        >
            <div className="text-muted-foreground flex justify-between items-center text-sm pb-3">
                <div>
                    {!!createdAt &&
                        `Generated at: ${format(
                            new Date(createdAt as Date),
                            "dd/MM/yyyy HH:mm"
                        )}`}
                </div>
                <div className="flex items-center gap-2">
                    {!!id && (
                        <EndpointDialog
                            url={`${process.env.NEXT_PUBLIC_URL}/api/results/${id}`}
                        />
                    )}
                    <CopyButton title="Copy JSON" textToCopy={json} />
                </div>
            </div>
            <div>
                <div className="max-h-[500px] overflow-y-auto">
                    <div>
                        <pre>{JSON.stringify(JSON.parse(json), null, 2)}</pre>
                    </div>
                </div>
            </div>
        </div>
    )
}

function EndpointDialog({ url }: { url: string }) {
    return (
        <Dialog>
            <DialogTrigger title="See endpoint URL">
                <Server className="w-5 h-5" />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Endpoint URL</DialogTitle>
                    <DialogDescription>
                        <Label>
                            Copy the URL below to mock the API response
                        </Label>
                    </DialogDescription>
                </DialogHeader>
                <div className="flex gap-2">
                    <Input value={url} readOnly />
                    <CopyButton title="Copy URL" textToCopy={url} />
                </div>
            </DialogContent>
        </Dialog>
    )
}

function CopyButton({
    textToCopy,
    title = "Copy",
}: {
    textToCopy: string
    title?: string
}) {
    const [copied, setCopied] = useState(false)

    return (
        <button
            className="opacity-80 hover:opacity-100 transition-opacity"
            title={title}
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
