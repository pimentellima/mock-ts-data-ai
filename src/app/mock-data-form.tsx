"use client"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { useSession } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import CodeEditor from "@uiw/react-textarea-code-editor"
import { useRouter } from "next/navigation"
import { Dispatch, SetStateAction } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { generateMockData } from "./actions"

function extractTypesAndInterfaces(tsCode: string) {
    const typePattern = /type\s+(\w+)\s*=\s*([^;]*);?/g
    const interfacePattern = /interface\s+(\w+)\s*{[^}]*}/g

    let types = []
    let interfaces = []

    let match

    // Extract types
    while ((match = typePattern.exec(tsCode)) !== null) {
        types.push({ name: match[1], type: match[2].trim() })
    }

    // Extract interfaces
    while ((match = interfacePattern.exec(tsCode)) !== null) {
        interfaces.push({ name: match[1], type: match[0].trim() })
    }

    // Combine both lists and return
    return types.concat(interfaces)
}

export const formSchema = z.object({
    typescriptCode: z
        .string()
        .max(1000, {
            message: "Your typescript code exceeds the character limit.",
        })
        .superRefine((val, ctx) => {
            const types = extractTypesAndInterfaces(val).map(({ name }) => name)
            const duplicates = types.filter(
                (item, index) => types.indexOf(item) !== index
            )
            if (duplicates.length !== 0) {
                return ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "You have duplicate types/interfaces.",
                })
            }
        }),
    description: z
        .string()
        .max(300, { message: "Your description exceeds the character limit." })
        .optional(),
    types: z.array(
        z.object({
            name: z.string(),
            typeDefinition: z.string(),
            numberOfMocks: z.string(),
        })
    ),
})

export default function MockDataForm({
    setResult,
}: {
    setResult: Dispatch<
        SetStateAction<
            | {
                  resultName: string
                  json: string
              }[]
            | null
        >
    >
}) {
    const queryClient = useQueryClient()
    const { session, isSignedIn } = useSession()
    const router = useRouter()
    const { toast } = useToast()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            typescriptCode:
                "interface User {\n  id: number\n  name: string\n  }\n\ninterface Friend {\n  userId: number\n  friendId: number\n}",
            description: "",
            types: [
                {
                    name: "User",
                    typeDefinition:
                        "interface User {\n  id: number\n  name: string\n }",
                    numberOfMocks: "25",
                },
                {
                    name: "Friend",
                    typeDefinition:
                        "interface Friend {\n  userId: number\n  friendId: number\n}",
                    numberOfMocks: "25",
                },
            ],
        },
    })

    const { fields: types } = useFieldArray({
        control: form.control,
        name: "types",
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if (!isSignedIn) {
                toast({
                    title: "You have to sign in to generate data",
                    action: (
                        <ToastAction
                            onClick={() => router.push("sign-in")}
                            altText="Sign in"
                        >
                            Sign in
                        </ToastAction>
                    ),
                })
                return
            }
            setResult(null)
            const { types, description } = values
            const response = await generateMockData({ types, description })
            if (response.error) {
                toast({
                    title: "An error occurred",
                    description: response.error,
                    variant: "destructive",
                })
                return
            }
            if (response.result) {
                setResult(response.result)
                queryClient.refetchQueries({
                    queryKey: ["user credits", session.user.id],
                })
            }
        } catch (e) {
            toast({
                title: "An error occurred",
                description: "Failed to generate mock data.",
                variant: "destructive",
            })
        }
    }

    return (
        <Form {...form}>
            <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    name="typescriptCode"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Types/interfaces</FormLabel>
                            <FormControl>
                                <CodeEditor
                                    value={field.value}
                                    language="ts"
                                    onChange={(evn) => {
                                        field.onChange(evn.target.value)
                                        const types = extractTypesAndInterfaces(
                                            evn.target.value
                                        )
                                        form.setValue(
                                            "types",
                                            types.map(({ name, type }) => ({
                                                name,
                                                typeDefinition: type,
                                                numberOfMocks: "25",
                                            }))
                                        )
                                    }}
                                    padding={15}
                                    className="border rounded-sm bg-inherit"
                                    style={{
                                        fontSize: 14,
                                    }}
                                />
                            </FormControl>
                            <FormDescription>
                                The TypeScript types or interfaces for which you
                                want to generate data.
                            </FormDescription>
                            {!!form.formState.errors.typescriptCode && (
                                <FormMessage>
                                    {
                                        form.formState.errors.typescriptCode
                                            .message
                                    }
                                </FormMessage>
                            )}
                        </FormItem>
                    )}
                />
                <FormField
                    name="description"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description (optional)</FormLabel>
                            <FormControl>
                                <Textarea
                                    value={field.value}
                                    onChange={field.onChange}
                                    className="rounded-md"
                                    rows={2}
                                    placeholder="Type here"
                                />
                            </FormControl>
                            <FormDescription>
                                Additional context to help the AI generate more
                                accurate data.
                            </FormDescription>
                            {!!form.formState.errors.description && (
                                <FormMessage>
                                    {form.formState.errors.description.message}
                                </FormMessage>
                            )}
                        </FormItem>
                    )}
                />
                <div>
                    {!!types && (
                        <div className="grid grid-cols-2 gap-2">
                            {types.map((arrayField, index) => (
                                <FormField
                                    key={arrayField.id}
                                    name={`types.${index}.numberOfMocks`}
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Number of mocks for{" "}
                                                {arrayField.name}
                                            </FormLabel>
                                            <FormControl>
                                                <Select
                                                    value={field.value}
                                                    onValueChange={(value) =>
                                                        field.onChange(value)
                                                    }
                                                >
                                                    <SelectTrigger className="w-[180px]">
                                                        <SelectValue
                                                            placeholder={`Click here`}
                                                        />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="25">
                                                            25
                                                        </SelectItem>
                                                        <SelectItem value="50">
                                                            50
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            ))}
                        </div>
                    )}
                    <FormDescription className="mt-1">
                        The number of mock data entries you want to generate.
                    </FormDescription>
                </div>
                <Button
                    disabled={form.formState.isSubmitting}
                    className="mt-4 disabled:opacity-70 disabled:cursor-default"
                    type="submit"
                >
                    {form.formState.isSubmitting ? "Generating..." : "Generate"}
                </Button>
            </form>
        </Form>
    )
}
