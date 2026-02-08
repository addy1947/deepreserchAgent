import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
        return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
    }

    const apiKey = process.env.SERPAPI_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: 'SERPAPI_API_KEY is not configured' }, { status: 500 });
    }

    try {
        const response = await fetch(`https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${apiKey}`);
        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch search results' }, { status: 500 });
    }
}
