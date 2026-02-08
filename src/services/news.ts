
export interface NewsArticle {
    title: string;
    description: string;
    content: string;
    url: string;
    image: string;
    publishedAt: string;
    source: {
        name: string;
        url: string;
    };
}

export interface NewsResponse {
    totalArticles: number;
    articles: NewsArticle[];
    errors?: any;
}

export const getLiveNews = async (
    { query }: { query: string }
): Promise<NewsArticle[]> => {
    if (!query) return [];

    try {
        const response = await fetch(`/api/news?q=${encodeURIComponent(query)}`);

        if (!response.ok) {
            console.error("News search failed:", response.statusText);
            return [];
        }

        const data: NewsResponse = await response.json();

        if (data.errors) {
            console.error("News API error:", data.errors);
            return [];
        }

        return data.articles || [];

    } catch (error) {
        console.error("Error performing news search:", error);
        return [];
    }
};
