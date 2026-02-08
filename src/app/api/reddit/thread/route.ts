
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
        return NextResponse.json({ error: 'Query parameter "url" is required' }, { status: 400 });
    }

    try {
        // Append .json to get JSON data for a thread
        // e.g. https://www.reddit.com/r/Android/comments/xyz/pixel_7_review/.json
        let jsonUrl = url;
        if (!jsonUrl.endsWith('.json')) {
            jsonUrl = jsonUrl.split('?')[0] + '.json';
        }

        const response = await fetch(jsonUrl, {
            headers: {
                'User-Agent': 'TamboAI/1.0'
            }
        });

        if (!response.ok) {
            return NextResponse.json({ error: `Reddit API error: ${response.statusText}` }, { status: response.status });
        }

        const data = await response.json();

        // Reddit thread JSON is an array: [ { kind: 'Listing', data: { children: [OP_POST] } }, { kind: 'Listing', data: { children: [COMMENTS...] } } ]

        const originalPost = data[0]?.data?.children?.[0]?.data;
        const comments = data[1]?.data?.children?.map((child: any) => child.data).filter((c: any) => c.body);

        if (!originalPost) {
            return NextResponse.json({ error: 'Could not parse Reddit thread' }, { status: 500 });
        }

        const threadData = {
            title: originalPost.title,
            selftext: originalPost.selftext || '(Link post or image post)',
            url: originalPost.url, // linked content if link post
            author: originalPost.author,
            score: originalPost.score,
            comments: comments.slice(0, 10).map((c: any) => ({ // limit comments to top 10 to save context
                author: c.author,
                body: c.body,
                score: c.score
            }))
        };

        return NextResponse.json(threadData);
    } catch (error) {
        console.error("Reddit thread fetch error:", error);
        return NextResponse.json({ error: 'Failed to fetch reddit thread' }, { status: 500 });
    }
}
