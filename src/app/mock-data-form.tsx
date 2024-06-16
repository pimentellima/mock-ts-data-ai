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
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import CodeEditor from "@uiw/react-textarea-code-editor"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Dispatch, SetStateAction } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { generateMockData } from "./actions"

export const formSchema = z.object({
    typeDefinition: z.string().max(3000, {
        message: "Your type definition code exceeds the character limit.",
    }),
    description: z
        .string()
        .max(300, { message: "Your description exceeds the character limit." })
        .optional(),
    numberOfMocks: z.string(),
})

export default function MockDataForm({
    setResultJson,
}: {
    setResultJson: Dispatch<SetStateAction<string | null>>
}) {
    const queryClient = useQueryClient()
    const { data: sessionData } = useSession()
    const router = useRouter()
    const { toast } = useToast()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            typeDefinition:
                "interface User {\n  id: number\n  name: string\n  country: string\n  city: string\n  hobbies: string[]\n}",
            description: "All users are from Brazil.",
            numberOfMocks: "25",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if (!sessionData?.user) {
                toast({
                    title: "You have to be signed in to generate data",
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
            setResultJson(null)
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
            if (response.resultJson) {
                setResultJson(response.resultJson)
                queryClient.refetchQueries({
                    queryKey: ["credits"],
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
                                            <SelectItem value="5">5</SelectItem>
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
                    <FormDescription className="mt-1">
                        The number of items you want to generate.
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
