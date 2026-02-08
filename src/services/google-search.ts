
export interface GoogleSearchResult {
    title: string;
    link: string;
    snippet: string;
    source?: string;
    date?: string;
}

export interface GoogleSearchResponse {
    organic_results?: {
        title: string;
        link: string;
        snippet: string;
        source?: string;
        date?: string;
    }[];
    error?: string;
}

export const performGoogleSearch = async (
    { query }: { query: string }
): Promise<GoogleSearchResult[]> => {
    if (!query) return [];

    try {
        const response = await fetch(`/api/google?q=${encodeURIComponent(query)}`);

        if (!response.ok) {
            console.error("Google search failed:", response.statusText);
            return [];
        }

        const data: GoogleSearchResponse = await response.json();

        if (data.error) {
            console.error("Google search API error:", data.error);
            return [];
        }

        // Transform the SerpApi response to a simpler format for the AI
        return (data.organic_results || []).map(result => ({
            title: result.title,
            link: result.link,
            snippet: result.snippet,
            source: result.source,
            date: result.date
        }));

    } catch (error) {
        console.error("Error performing Google search:", error);
        return [];
    }
};
