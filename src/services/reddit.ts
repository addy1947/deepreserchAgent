
import { z } from "zod";

export interface RedditPost {
    title: string;
    url: string;
    author: string;
    subreddit: string;
    score: number;
    num_comments: number;
    created_utc: number;
    selftext: string;
    thumbnail: string | null;
}

export interface RedditThread {
    title: string;
    selftext: string;
    url: string;
    author: string;
    score: number;
    comments: {
        author: string;
        body: string;
        score: number;
    }[];
}

export const searchRedditReviews = async ({ query }: { query: string }): Promise<RedditPost[]> => {
    try {
        const response = await fetch(`/api/reddit/search?q=${encodeURIComponent(query)}&sort=relevance&limit=8`);
        if (!response.ok) return [];
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (e) {
        console.error("Reddit search tool failed", e);
        return [];
    }
};

export const getRedditThread = async ({ url }: { url: string }): Promise<RedditThread | null> => {
    try {
        const response = await fetch(`/api/reddit/thread?url=${encodeURIComponent(url)}`);
        if (!response.ok) return null;
        return await response.json();
    } catch (e) {
        console.error("Reddit thread fetch failed", e);
        return null;
    }
};
