import type { Metadata } from "next"
import DataGenerator from "@/components/data-generator"
import { Code, Database, Server, Download } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
    title: "AI Mock Data Generator | Generate realistic JSON data",
    description:
        "Generate realistic mock data based on TypeScript interfaces and objects. Create mock APIs, export to JSON, CSV, SQL, and test endpoints with our AI-powered data generator.",
    keywords: [
        "AI data generator",
        "mock data generator",
        "prototype data tool",
        "TypeScript data generator",
        "frontend development tool",
        "UI/UX prototyping data",
        "React test data",
        "Next.js development tools",
        "realistic test data",
        "interface-based data generation",
        "frontend prototyping",
        "TypeScript interface data",
        "web application testing",
        "mock API data",
        "development test data",
        "QA testing tools",
        "dummy data generator",
        "AI-powered test data",
        "data scaffolding tool",
        "frontend testing utilities",
        "JSON data generator",
        "CSV data generator",
        "XML data generator",
        "XLSX data generator",
        "SQL data generator",
        "export mock data to JSON",
        "export mock data to CSV",
        "export mock data to XML",
        "export mock data to XLSX",
        "export mock data to SQL",
        "structured data formats",
        "data generation for testing",
        "data generation for prototyping",
        "data generation for UI/UX design",
    ],
    openGraph: {
        title: "AI Mock Data Generator | TypeScript Mock Data Tool",
        description:
            "Generate realistic mock data from TypeScript interfaces. Create mock APIs, export to JSON, CSV, SQL formats for frontend development.",
        type: "website",
    },
}

export default function Home() {
    return (
        <div className="container mx-auto py-6 px-4 md:px-6 min-h-screen flex flex-col">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">
                    AI Mock Data Generator
                </h1>
                <p className="text-muted-foreground mt-2">
                    Generate realistic mock data based on TypeScript
                    objects or interfaces
                </p>
            </header>

            <main className="flex-grow">
                <DataGenerator />
            </main>

            <footer className="mt-16 border-t pt-8 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h2 className="text-xl font-semibold mb-4">
                            About This Tool
                        </h2>
                        <p className="text-muted-foreground mb-4">
                            The AI Mock Data Generator is a powerful tool
                            for frontend developers, UI/UX designers, and QA
                            engineers who need realistic data for prototyping
                            and testing applications.
                        </p>
                        <p className="text-muted-foreground">
                            Built with Next.js and TypeScript, this tool helps
                            you quickly generate structured data based on your
                            TypeScript interfaces or object definitions.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-4">
                            Key Features
                        </h2>
                        <ul className="space-y-2 text-muted-foreground">
                            <li className="flex items-start">
                                <Code className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                                <span>
                                    Generate data from TypeScript interfaces
                                    with customizable counts
                                </span>
                            </li>
                            <li className="flex items-start">
                                <Database className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                                <span>
                                    Define relationships between data types for
                                    connected datasets
                                </span>
                            </li>
                            <li className="flex items-start">
                                <Server className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                                <span>
                                    Create and test mock API endpoints for your
                                    prototype data
                                </span>
                            </li>
                            <li className="flex items-start">
                                <Download className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                                <span>
                                    Export data in JSON, CSV, XML, XLSX, or SQL formats for
                                    various use cases
                                </span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-4">
                            Use Cases
                        </h2>
                        <div className="space-y-3 text-muted-foreground">
                            <p>
                                <strong className="font-medium text-foreground">
                                    Frontend Development:
                                </strong>{" "}
                                Generate realistic data to test UI components
                                and layouts without waiting for backend APIs.
                            </p>
                            <p>
                                <strong className="font-medium text-foreground">
                                    API Prototyping:
                                </strong>{" "}
                                Design and test API structures before
                                implementing the actual backend services.
                            </p>
                            <p>
                                <strong className="font-medium text-foreground">
                                    Data Visualization:
                                </strong>{" "}
                                Create sample datasets for charts, graphs, and
                                other data visualization components.
                            </p>
                            <p>
                                <strong className="font-medium text-foreground">
                                    Testing:
                                </strong>{" "}
                                Generate consistent test data for unit tests,
                                integration tests, and QA processes.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-6 border-t">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-medium mb-3">
                                How It Works
                            </h3>
                            <ol className="list-decimal list-inside space-y-2 text-muted-foreground pl-2">
                                <li>
                                    Define your TypeScript interfaces or object
                                    structures
                                </li>
                                <li>
                                    Set the number of items to generate for each
                                    type
                                </li>
                                <li>
                                    Optionally define relationships between your
                                    data types
                                </li>
                                <li>
                                    Generate the data with AI assistance for
                                    realistic values
                                </li>
                                <li>
                                    Export the data or test the mock API
                                    endpoints
                                </li>
                            </ol>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium mb-3">
                                Related Resources
                            </h3>
                            <ul className="space-y-2 text-muted-foreground">
                                <li>
                                    <Link
                                        href="https://www.typescriptlang.org/docs/handbook/interfaces.html"
                                        className="text-primary hover:underline"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        TypeScript Interfaces Documentation
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="https://nextjs.org/docs"
                                        className="text-primary hover:underline"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Next.js Documentation
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="https://json-schema.org/"
                                        className="text-primary hover:underline"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        JSON Schema Specification
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center text-sm text-muted-foreground">
                    <p>
                        AI Mock Data Generator — A powerful tool for
                        generating TypeScript-based data for frontend
                        development, API testing, and application prototyping.
                    </p>
                    <p className="mt-2">
                        © {new Date().getFullYear()} AI Mock Data
                        Generator. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    )
}
