
export interface CryptoNewsPost {
    id?: number;
    kind?: string;
    domain?: string;
    source?: {
        title: string;
        region?: string;
        domain?: string;
        path?: string | null;
    };
    title: string;
    published_at: string;
    slug?: string;
    currencies?: {
        code: string;
        title: string;
        slug: string;
        url: string;
    }[];
    url?: string;
    description?: string;
    created_at?: string;
    votes?: {
        negative: number;
        positive: number;
        important: number;
        liked: number;
        disliked: number;
        lol: number;
        toxic: number;
        saved: number;
        comments: number;
    };
}

export interface CryptoNewsResponse {
    count?: number;
    next?: string | null;
    previous?: string | null;
    results: CryptoNewsPost[];
}

export const getCryptoNews = async (
    { currency, filter }: { currency?: string, filter?: string }
): Promise<any[]> => {
    try {
        let url = `/api/crypto-news?filter=${filter || 'rising'}`;
        if (currency) {
            url += `&currency=${encodeURIComponent(currency)}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
            console.error("Crypto news search failed:", response.statusText);
            return [];
        }

        const data: CryptoNewsResponse = await response.json();

        return (data.results || []).map(post => {
            const domainInfo = post.domain || post.source?.domain || "cryptopanic.com";
            const voteInfo = post.votes
                ? `Votes: 👍${post.votes.positive} / 👎${post.votes.negative}`
                : "";

            const description = post.description || `${voteInfo} ${domainInfo}`.trim();

            return {
                title: post.title,
                description: description,
                url: post.url || `https://cryptopanic.com/news/${post.id || ''}`,
                source: {
                    name: post.source?.title || domainInfo || "CryptoPanic",
                    url: post.domain || post.source?.domain
                },
                publishedAt: post.published_at || new Date().toISOString()
            };
        });

    } catch (error) {
        console.error("Error performing crypto news search:", error);
        return [];
    }
};
