import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const lang = searchParams.get('lang') || 'en';
    const country = searchParams.get('country') || 'us';
    const max = searchParams.get('max') || '10';

    if (!query) {
        return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
    }

    const apiKey = process.env.GNEWS_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: 'GNEWS_API_KEY is not configured' }, { status: 500 });
    }

    try {
        const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=${lang}&country=${country}&max=${max}&apikey=${apiKey}`;
        const response = await fetch(url);

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: errorData.message || 'Failed to fetch news' }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch news results' }, { status: 500 });
    }
}
