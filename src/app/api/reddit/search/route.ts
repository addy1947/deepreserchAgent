
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = searchParams.get('limit') || '10';
    const sort = searchParams.get('sort') || 'relevance'; // relevance, hot, top, new, comments

    if (!query) {
        return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
    }

    try {
        // Reddit public API: https://www.reddit.com/search.json?q=...
        // We need a User-Agent to avoid "Too Many Requests" (429) errors from Reddit
        const redditUrl = `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&limit=${limit}&sort=${sort}&type=link`;

        const response = await fetch(redditUrl, {
            headers: {
                'User-Agent': 'TamboAI/1.0 (by /u/your_username_if_you_have_one)'
            }
        });

        if (!response.ok) {
            return NextResponse.json({ error: `Reddit API error: ${response.statusText}` }, { status: response.status });
        }

        const data = await response.json();

        // Extract useful fields
        const posts = data.data.children.map((child: any) => {
            const p = child.data;
            return {
                title: p.title,
                url: `https://www.reddit.com${p.permalink}`,
                author: p.author,
                subreddit: p.subreddit_name_prefixed,
                score: p.score,
                num_comments: p.num_comments,
                created_utc: p.created_utc,
                selftext: p.selftext ? p.selftext.substring(0, 300) + '...' : '', // Preview
                thumbnail: p.thumbnail !== 'self' && p.thumbnail !== 'default' ? p.thumbnail : null
            };
        });

        return NextResponse.json(posts);
    } catch (error) {
        console.error("Reddit search error:", error);
        return NextResponse.json({ error: 'Failed to fetch reddit results' }, { status: 500 });
    }
}
