
export interface ArxivPaper {
    title: string;
    summary: string;
    authors: string[];
    published: string;
    updated: string;
    pdfUrl: string;
    articleUrl: string;
}

export async function searchArxivPapers({
    query,
    max_results = 5,
}: {
    query: string;
    max_results?: number;
}): Promise<ArxivPaper[]> {
    try {
        const params = new URLSearchParams({
            query,
            max_results: max_results.toString(),
        });

        const baseUrl = process.env.NEXT_PUBLIC_TAMBO_URL || "http://localhost:3000";
        const response = await fetch(
            `${baseUrl}/api/arxiv?${params.toString()}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch papers: ${response.statusText}`);
        }

        const data = await response.json();
        return data.papers || [];
    } catch (error) {
        console.error("Error searching ArXiv papers:", error);
        return [];
    }
}

export async function readArxivPaper({ pdfUrl }: { pdfUrl: string }): Promise<{
    title: string;
    text: string;
    pages: number;
    url: string;
}> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_TAMBO_URL || "http://localhost:3000";
        const response = await fetch(
            `${baseUrl}/api/read-pdf?url=${encodeURIComponent(pdfUrl)}`
        );

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Failed to fetch PDF content: ${response.status} ${text}`);
        }

        const data = await response.json();
        const cleanText = (data.text || "").replace(/\s+/g, ' ').trim();

        return {
            title: data.info?.Title || "Unknown Title",
            text: cleanText,
            pages: data.pages || 0,
            url: data.url
        };

    } catch (error) {
        console.error("Error reading ArXiv PDF:", error);
        return {
            title: "Error",
            text: `Failed to read the paper. The PDF might be restricted or too large. Error: ${(error as Error).message}`,
            pages: 0,
            url: pdfUrl
        };
    }
}
