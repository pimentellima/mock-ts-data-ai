"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Plus, Trash2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Relationship } from "@/types/types"

interface RelationshipEditorProps {
    types: { id: string; name: string; code: string }[]
    relationships: Relationship[]
    setRelationships: (relationships: Relationship[]) => void
}

export default function RelationshipEditor({
    types,
    relationships,
    setRelationships,
}: RelationshipEditorProps) {
    const [newRelationship, setNewRelationship] = useState<Omit<Relationship, 'id'>>({
        sourceId: types[0]?.id || "",
        sourceField: "",
        targetId: "",
        targetField: "",
        type: "one-to-many",
    })

    const addRelationship = () => {
        if (
            !newRelationship.sourceId ||
            !newRelationship.targetId ||
            !newRelationship.type
        ) {
            toast({
                title: "Missing information",
                description: "Please fill in all required fields",
                variant: "destructive",
            })
            return
        }

        if (newRelationship.sourceId === newRelationship.targetId) {
            toast({
                title: "Invalid relationship",
                description: "Source and target types cannot be the same",
                variant: "destructive",
            })
            return
        }

        const id = String(Date.now())
        setRelationships([...relationships, { id, ...newRelationship }])

        // Reset form
        setNewRelationship({
            sourceId: types[0]?.id || "",
            sourceField: "",
            targetId: "",
            targetField: "",
            type: "one-to-many",
        })

        toast({
            title: "Relationship added",
            description: "The relationship has been added successfully",
        })
    }

    const removeRelationship = (id: string) => {
        setRelationships(relationships.filter((rel) => rel.id !== id))
    }

    const getTypeName = (id: string) => {
        return types.find((type) => type.id === id)?.name || "Unknown"
    }

    const relationshipTypes = [
        { value: "one-to-one", label: "One-to-One" },
        { value: "one-to-many", label: "One-to-Many" },
        { value: "many-to-many", label: "Many-to-Many" },
    ]

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Define Relationships</h3>
                <p className="text-sm text-muted-foreground">
                    Define how your types relate to each other to generate
                    connected data
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="source-type">Source Type</Label>
                        <Select
                            value={newRelationship.sourceId}
                            onValueChange={(value) =>
                                setNewRelationship({
                                    ...newRelationship,
                                    sourceId: value,
                                })
                            }
                        >
                            <SelectTrigger id="source-type">
                                <SelectValue placeholder="Select source type" />
                            </SelectTrigger>
                            <SelectContent>
                                {types.map((type) => (
                                    <SelectItem key={type.id} value={type.id}>
                                        {type.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="source-field">
                            Source Field (optional)
                        </Label>
                        <Input
                            id="source-field"
                            placeholder="e.g., userId"
                            value={newRelationship.sourceField}
                            onChange={(e) =>
                                setNewRelationship({
                                    ...newRelationship,
                                    sourceField: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="relationship-type">
                            Relationship Type
                        </Label>
                        <Select
                            value={newRelationship.type}
                            onValueChange={(value) =>
                                setNewRelationship({
                                    ...newRelationship,
                                    type: value,
                                })
                            }
                        >
                            <SelectTrigger id="relationship-type">
                                <SelectValue placeholder="Select relationship type" />
                            </SelectTrigger>
                            <SelectContent>
                                {relationshipTypes.map((type) => (
                                    <SelectItem
                                        key={type.value}
                                        value={type.value}
                                    >
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="target-type">Target Type</Label>
                        <Select
                            value={newRelationship.targetId}
                            onValueChange={(value) =>
                                setNewRelationship({
                                    ...newRelationship,
                                    targetId: value,
                                })
                            }
                        >
                            <SelectTrigger id="target-type">
                                <SelectValue placeholder="Select target type" />
                            </SelectTrigger>
                            <SelectContent>
                                {types.map((type) => (
                                    <SelectItem key={type.id} value={type.id}>
                                        {type.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="target-field">
                            Target Field (optional)
                        </Label>
                        <Input
                            id="target-field"
                            placeholder="e.g., id"
                            value={newRelationship.targetField}
                            onChange={(e) =>
                                setNewRelationship({
                                    ...newRelationship,
                                    targetField: e.target.value,
                                })
                            }
                        />
                    </div>
                </div>

                <Button variant={'outline'} onClick={addRelationship} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Relationship
                </Button>
            </div>

            {relationships.length > 0 && (
                <div className="space-y-4">
                    <h4 className="font-medium">Defined Relationships</h4>
                    <div className="space-y-2">
                        {relationships.map((rel) => (
                            <div
                                key={rel.id}
                                className="flex items-center justify-between p-3 border rounded-md bg-muted/30"
                            >
                                <div>
                                    <span className="font-medium">
                                        {getTypeName(rel.sourceId)}
                                    </span>
                                    {rel.sourceField && (
                                        <span className="text-muted-foreground">
                                            .{rel.sourceField}
                                        </span>
                                    )}
                                    <span className="mx-2">→</span>
                                    <span className="text-sm text-muted-foreground">
                                        ({rel.type})
                                    </span>
                                    <span className="mx-2">→</span>
                                    <span className="font-medium">
                                        {getTypeName(rel.targetId)}
                                    </span>
                                    {rel.targetField && (
                                        <span className="text-muted-foreground">
                                            .{rel.targetField}
                                        </span>
                                    )}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeRelationship(rel.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
