import { Input } from "@/components/ui/input"

export default function CurrencyInput({
    disabled = false,
    value,
    id,
    onChangeValue,
}: {
    id: string
    disabled?: boolean
    value: string
    onChangeValue: (value: string) => void
}) {
    const formatValue = (value?: string) => {
        if (!value) return ""
        let text = value.replace(".", "").replace(/\D/g, "").split("")

        let formattedText = text.reduce((acc, char, index) => {
            if (index === text.length - 2) {
                return `${acc}.${char}`
            }
            return `${acc}${char}`
        }, "")

        if (formattedText[0] === "0" && formattedText[1] !== ".") {
            formattedText = formattedText.slice(1)
        }

        if (formattedText[0] === ".") {
            formattedText = `0${formattedText}`
        }

        return formattedText
    }

    return (
        <div className="w-full items-center">
            <div className="relative">
                <span
                    data-disabled={disabled}
                    className="absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-muted-foreground data-[disabled=true]:opacity-50"
                >
                    $
                </span>
                <Input
                    id={id || "currency"}
                    disabled={disabled}
                    type="text"
                    placeholder="0.00"
                    className="pl-10"
                    value={formatValue(value)}
                    onChange={(e) => onChangeValue(formatValue(e.target.value))}
                />
            </div>
        </div>
    )
}
