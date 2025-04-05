export function formatCredits(credits: number) {
    if (credits < 1) {
        const formattedCredits = credits.toFixed(2)
        return formattedCredits
    }
    return credits.toFixed(0)
}
