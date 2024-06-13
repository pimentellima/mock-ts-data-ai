export const initialCredits = 5

export const creditPriceMap =
    process.env.NODE_ENV === "production"
        ? ({
            150: "price_1PQFyfEyugco4uX2lrAx2FZJ",
            300: "price_1PQFycEyugco4uX24ETerPNl",
            900: "price_1PQFyaEyugco4uX2A2hNP6Uu",
        } as const)
        : ({
            150: "price_1PPyasEyugco4uX2EuK9WWkZ",
            300: "price_1PPyb5Eyugco4uX2I3SlzwBs",
            900: "price_1PPycnEyugco4uX2iZBEeaLC",
        } as const)