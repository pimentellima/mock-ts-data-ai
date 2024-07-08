"use client"
import Result from "@/components/result"
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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { defaultResultJson } from "@/constants"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import CodeEditor from "@uiw/react-textarea-code-editor"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Dispatch, SetStateAction, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { generateMockData } from "./actions"
import Link from "next/link"

export default function Generator() {
    const [result, setResult] = useState<{
        jsonString: string
        resultId: string
    } | null>({
        resultId: "default",
        jsonString: defaultResultJson,
    })

    return (
        <div className="flex flex-col gap-10 md:grid md:grid-cols-2 md:gap-5">
            <div className="mt-3 md:mt-0">
                <MockDataForm setResult={setResult} />
            </div>
            <div className="md:mt-8">
                {!!result?.jsonString ? (
                    <Result id={result.resultId} json={result.jsonString} />
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

const mockFormSchema = z.object({
    typeDefinition: z.string().max(3000, {
        message: "Your type definition code exceeds the character limit.",
    }),
    description: z
        .string()
        .max(300, { message: "Your description exceeds the character limit." })
        .optional(),
    numberOfMocks: z.coerce
        .number()
        .min(1, { message: "Number of mocks must be at least 1." })
        .max(50, { message: "Number of mocks must be at most 50." }),
})

function MockDataForm({
    setResult,
}: {
    setResult: Dispatch<
        SetStateAction<{
            jsonString: string
            resultId: string
        } | null>
    >
}) {
    const queryClient = useQueryClient()
    const { data: sessionData } = useSession()
    const router = useRouter()
    const { toast } = useToast()
    const form = useForm<z.infer<typeof mockFormSchema>>({
        resolver: zodResolver(mockFormSchema),
        mode: "onChange",
        defaultValues: {
            typeDefinition:
                "interface User {\n  id: number\n  name: string\n  country: string\n  city: string\n  hobbies: string[]\n}",
            description: "All users are from Brazil.",
            numberOfMocks: 25,
        },
    })

    async function onSubmit(values: z.infer<typeof mockFormSchema>) {
        try {
            if (!sessionData?.user) {
                toast({
                    title: "You have to be signed in to generate data",
                    action: (
                        <Button asChild variant={"link"}>
                            <Link href={"sign-in"}>Sign in</Link>
                        </Button>
                    ),
                })
                return
            }
            setResult(null)
            const { numberOfMocks, typeDefinition, description } = values
            const response = await generateMockData({
                numberOfMocks,
                typeDefinition,
                description,
            })
            if (response.error) {
                toast({
                    title: "An error occurred",
                    description: response.error,
                    variant: "destructive",
                })
                return
            }
            if (response.resultId && response.jsonString) {
                setResult({
                    resultId: response.resultId,
                    jsonString: response.jsonString,
                })
                queryClient.refetchQueries({
                    queryKey: ["credits", sessionData.user.id],
                })
                queryClient.refetchQueries({
                    queryKey: ["results", sessionData.user.id],
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
                    name="typeDefinition"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Type definition</FormLabel>
                            <FormControl>
                                <CodeEditor
                                    value={field.value}
                                    language="ts"
                                    onChange={(evn) => {
                                        field.onChange(evn.target.value)
                                    }}
                                    padding={15}
                                    className="border rounded-sm bg-inherit"
                                    style={{
                                        fontSize: 14,
                                    }}
                                />
                            </FormControl>
                            <FormDescription>
                                The typescript type or interface for which you
                                want to generate data.
                            </FormDescription>
                            {!!form.formState.errors.typeDefinition && (
                                <FormMessage>
                                    {
                                        form.formState.errors.typeDefinition
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
                    <FormField
                        name="numberOfMocks"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Number of mocks</FormLabel>
                                <FormControl>
                                    <Input
                                        value={field.value}
                                        onChange={(e) =>
                                            field.onChange(e.target.value)
                                        }
                                        type="number"
                                    />
                                </FormControl>
                                <FormDescription className="mt-1">
                                    The number of items you want to generate.
                                </FormDescription>
                                {!!form.formState.errors.numberOfMocks && (
                                    <FormMessage>
                                        {
                                            form.formState.errors.numberOfMocks
                                                .message
                                        }
                                    </FormMessage>
                                )}
                            </FormItem>
                        )}
                    />
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
