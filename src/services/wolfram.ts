export interface WolframResponse {
    result?: string;
    error?: string;
}

export const performWolframCalculation = async (
    { query }: { query: string }
): Promise<string> => {
    if (!query) return "No query provided";

    try {
        const response = await fetch(`/api/wolfram?q=${encodeURIComponent(query)}`);

        if (!response.ok) {
            console.error("Wolfram request failed:", response.statusText);
            // Try to get error details
            try {
                const errData = await response.json();
                return `Error: ${errData.error || response.statusText}`;
            } catch {
                return `Error: ${response.statusText}`;
            }
        }

        const data: WolframResponse = await response.json();

        if (data.error) {
            return `Error: ${data.error}`;
        }

        return data.result || "No result found";

    } catch (error) {
        console.error("Error performing Wolfram calculation:", error);
        return "Error performing calculation";
    }
};
