"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { generateMockData } from "./actions"
import { Button } from "@/components/ui/button"
import { Dispatch, SetStateAction, useMemo, useState } from "react"
import CodeEditor from "@uiw/react-textarea-code-editor"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { useToast } from "@/components/ui/use-toast"

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
    typescriptCode: z.string().superRefine((val, ctx) => {
        const types = extractTypesAndInterfaces(val).map(({ name }) => name)
        const duplicates = types.filter(
            (item, index) => types.indexOf(item) !== index
        )
        if (duplicates.length !== 0) {
            return ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Duplicate types/interfaces are not allowed.",
            })
        }
    }),
    description: z
        .string()
        .max(300, { message: "Description is too large" })
        .optional(),
    types: z.array(
        z.object({
            name: z.string(),
            typeDefinition: z.string(),
            maxNumberOfMocks: z.string(),
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
    const { toast } = useToast()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            typescriptCode:
                "interface User {\n  id: number\n  name: string\n  age: number\n}\n\ninterface Friend {\n  userId: number\n  friendId: number\n}",
            description: "",
            types: [
                {
                    name: "User",
                    typeDefinition:
                        "interface User {\n  id: number\n  name: string\n  age: number\n}",
                    maxNumberOfMocks: "5",
                },
                {
                    name: "Friend",
                    typeDefinition:
                        "interface Friend {\n  userId: number\n  friendId: number\n}",
                    maxNumberOfMocks: "10",
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
            const { types, description } = values
            const result = await generateMockData({ types, description })
            setResult(result)
        } catch {
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
                                                maxNumberOfMocks: "5",
                                            }))
                                        )
                                    }}
                                    padding={15}
                                    className="border rounded-sm"
                                    style={{
                                        fontSize: 14,
                                        backgroundColor: "inherit",
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
                                    name={`types.${index}.maxNumberOfMocks`}
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Max number of mocks for{" "}
                                                {arrayField.name}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    type="number"
                                                    className="mt-2"
                                                    placeholder="Click here..."
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            ))}
                        </div>
                    )}
                    <FormDescription>
                        The maximum number of mock data entries you want to
                        generate.
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
