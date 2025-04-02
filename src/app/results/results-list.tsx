"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Eye, Trash2 } from "lucide-react"
import ResultDetailDialog from "./result-detail-dialog"
import { useToast } from "@/components/ui/use-toast"
import {
    fetchResults,
    toggleApiStatus,
    deleteResult,
    getTotalPages,
} from "./actions"
import type { ResultWithGenerations } from "@/types/types"

interface ResultsListProps {
    currentPage: number
}

export default function ResultsList({ currentPage }: ResultsListProps) {
    const router = useRouter()
    const { toast } = useToast()
    const [results, setResults] = useState<ResultWithGenerations[]>([])
    const [totalPages, setTotalPages] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [selectedResult, setSelectedResult] =
        useState<ResultWithGenerations | null>(null)
    const [detailDialogOpen, setDetailDialogOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState<string | null>(null)
    const [isToggling, setIsToggling] = useState<string | null>(null)

    useEffect(() => {
        const loadResults = async () => {
            setIsLoading(true)
            try {
                const data = await fetchResults(currentPage)
                const totalPages = await getTotalPages()
                setResults(data)
                setTotalPages(totalPages)
            } catch (error) {
                toast({
                    title: "Error loading results",
                    description:
                        "Failed to load your generated results. Please try again.",
                    variant: "destructive",
                })
            } finally {
                setIsLoading(false)
            }
        }

        loadResults()
    }, [currentPage])

    const handlePageChange = (page: number) => {
        router.push(`/results?page=${page}`)
    }

    const handleViewDetail = (result: ResultWithGenerations) => {
        setSelectedResult(result)
        setDetailDialogOpen(true)
    }

    const handleToggleApi = async (
        resultId: string,
        currentStatus: boolean
    ) => {
        setIsToggling(resultId)
        try {
            await toggleApiStatus(resultId, !currentStatus)

            // Update the local state
            setResults(
                results.map((result) =>
                    result.id === resultId
                        ? { ...result, apiEnabled: !currentStatus }
                        : result
                )
            )

            toast({
                title: `API ${!currentStatus ? "enabled" : "disabled"}`,
                description: `The API for this result has been ${
                    !currentStatus ? "enabled" : "disabled"
                }.`,
            })
        } catch (error) {
            toast({
                title: "Error updating API status",
                description:
                    "Failed to update the API status. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsToggling(null)
        }
    }

    const handleDeleteResult = async (resultId: string) => {
        if (
            confirm(
                "Are you sure you want to delete this result? This action cannot be undone."
            )
        ) {
            setIsDeleting(resultId)
            try {
                await deleteResult(resultId)

                // Remove from local state
                setResults(results.filter((result) => result.id !== resultId))

                toast({
                    title: "Result deleted",
                    description: "The result has been permanently deleted.",
                })
            } catch (error) {
                toast({
                    title: "Error deleting result",
                    description:
                        "Failed to delete the result. Please try again.",
                    variant: "destructive",
                })
            } finally {
                setIsDeleting(null)
            }
        }
    }

    // For demo purposes, generate mock data if no results are available
    if (isLoading && results.length === 0) {
        // This will be replaced by the skeleton component
        return null
    }

    // If there are no results after loading
    if (!isLoading && results.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <h3 className="text-xl font-medium mb-2">No results found</h3>
                <p className="text-muted-foreground mb-6">
                    You haven't generated any data yet. Go to the home page to
                    create your first dataset.
                </p>
                <Button onClick={() => router.push("/")}>Generate Data</Button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Your Generated Data</h2>
                <Button onClick={() => router.push("/")}>
                    Generate New Data
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((result) => (
                    <Card key={result.id} className="overflow-hidden">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center justify-between">
                                <span>Result {result.id.substring(0, 8)}</span>
                                <Badge
                                    variant={
                                        result.apiEnabled
                                            ? "default"
                                            : "outline"
                                    }
                                >
                                    {result.apiEnabled
                                        ? "API Enabled"
                                        : "API Disabled"}
                                </Badge>
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Created:{" "}
                                {format(
                                    new Date(result.createdAt),
                                    "MMM d, yyyy h:mm a"
                                )}
                            </p>
                        </CardHeader>
                        <CardContent className="pb-3">
                            <div className="bg-muted/30 rounded-md p-3 mb-3 h-24 overflow-hidden">
                                <pre className="text-xs font-mono overflow-hidden">
                                    {JSON.stringify(
                                        result.generationResults[0]?.json
                                            ? JSON.parse(
                                                  result.generationResults[0]
                                                      .json
                                              ).slice(0, 2)
                                            : {},
                                        null,
                                        2
                                    )}
                                </pre>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Badge variant="secondary">
                                    {result.generationResults.length} Types
                                </Badge>
                                <Badge variant="outline">
                                    {result.generationResults.reduce(
                                        (acc, curr) => {
                                            const parsed = JSON.parse(
                                                curr.json || "[]"
                                            )
                                            return (
                                                acc +
                                                (Array.isArray(parsed)
                                                    ? parsed.length
                                                    : 0)
                                            )
                                        },
                                        0
                                    )}{" "}
                                    Items
                                </Badge>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <div className="flex items-center gap-2">
                                <Switch
                                    id={`api-toggle-${result.id}`}
                                    checked={result.apiEnabled}
                                    onCheckedChange={() =>
                                        handleToggleApi(
                                            result.id,
                                            result.apiEnabled
                                        )
                                    }
                                    disabled={isToggling === result.id}
                                />
                                <Label
                                    htmlFor={`api-toggle-${result.id}`}
                                    className="text-sm"
                                >
                                    {isToggling === result.id
                                        ? "Updating..."
                                        : "API"}
                                </Label>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleViewDetail(result)}
                                >
                                    <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="text-destructive hover:bg-destructive/10"
                                    onClick={() =>
                                        handleDeleteResult(result.id)
                                    }
                                    disabled={isDeleting === result.id}
                                >
                                    {isDeleting === result.id ? (
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    ) : (
                                        <Trash2 className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {totalPages > 1 && (
                <Pagination className="mt-8">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href={`/results?page=${Math.max(
                                    1,
                                    currentPage - 1
                                )}`}
                                onClick={(e) => {
                                    e.preventDefault()
                                    if (currentPage > 1)
                                        handlePageChange(currentPage - 1)
                                }}
                                className={
                                    currentPage <= 1
                                        ? "pointer-events-none opacity-50"
                                        : ""
                                }
                            />
                        </PaginationItem>

                        {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1
                        ).map((page) => (
                            <PaginationItem key={page}>
                                <PaginationLink
                                    href={`/results?page=${page}`}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        handlePageChange(page)
                                    }}
                                    isActive={page === currentPage}
                                >
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                        <PaginationItem>
                            <PaginationNext
                                href={`/results?page=${Math.min(
                                    totalPages,
                                    currentPage + 1
                                )}`}
                                onClick={(e) => {
                                    e.preventDefault()
                                    if (currentPage < totalPages)
                                        handlePageChange(currentPage + 1)
                                }}
                                className={
                                    currentPage >= totalPages
                                        ? "pointer-events-none opacity-50"
                                        : ""
                                }
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}

            {selectedResult && (
                <ResultDetailDialog
                    result={selectedResult}
                    open={detailDialogOpen}
                    onOpenChange={setDetailDialogOpen}
                />
            )}
        </div>
    )
}
