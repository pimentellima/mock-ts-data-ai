export interface TypeDefinition {
    id: string
    name: string
    code: string
    count: number
}

export interface Relationship {
    id: string
    sourceId: string
    sourceField: string
    targetId: string
    targetField: string
    type: string
}

export interface GenerationResult {
    typeDefinition: string
    name: string
    json: string
}