import CopyButton from "./copy-button"

export default function ResultsList({ resultJson }: { resultJson: string }) {
    return (
        <div
            className="border px-3 py-3 
                    rounded-md flex flex-col"
        >
            <div className="text-muted-foreground flex justify-end text-sm pb-3">
                <CopyButton textToCopy={resultJson} />
            </div>
            <div>
                <div className="h-[500px] overflow-y-auto">
                    <div>
                        <pre>
                            {JSON.stringify(JSON.parse(resultJson), null, 2)}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    )
}
