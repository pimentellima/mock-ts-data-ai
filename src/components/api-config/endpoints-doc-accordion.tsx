import { Info } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

interface EndpointsDocAccordionProps {
    endpoints: { name: string; url: string }[]
}
export default function EndpointsDocAccordion({
    endpoints,
}: EndpointsDocAccordionProps) {
    return (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="api-docs">
                <AccordionTrigger className="text-sm">
                    <div className="flex items-center">
                        <Info className="h-4 w-4 mr-2" />
                        API Documentation
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <div className="space-y-3 text-sm">
                        <p>The mock API provides the following endpoints:</p>

                        {endpoints.map((endpoint) => (
                            <div key={endpoint.name} className="space-y-2">
                                <h4 className="font-medium">
                                    {endpoint.name} Endpoints
                                </h4>
                                <div className="space-y-1">
                                    <div>
                                        <code className="bg-muted/50 p-1 rounded">
                                            {endpoint.url}
                                        </code>
                                        <p className="text-muted-foreground">
                                            Returns all {endpoint.name} records
                                        </p>
                                    </div>
                                    <div>
                                        <code className="bg-muted/50 p-1 rounded">
                                            {endpoint.url}?record_id={"<"}
                                            {endpoint.name.toLowerCase()}_id
                                            {">"}
                                        </code>
                                        <p className="text-muted-foreground">
                                            Returns a specific {endpoint.name}{" "}
                                            by ID
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}
