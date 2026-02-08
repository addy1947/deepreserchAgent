import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
        return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
    }

    const appId = process.env.WOLFRAM_APP_ID;
    if (!appId) {
        console.error("WOLFRAM_APP_ID is missing from environment variables");
        return NextResponse.json({ error: 'WOLFRAM_APP_ID is not configured' }, { status: 500 });
    }

    try {
        console.log(`Querying Wolfram Alpha for: ${query}`);
        // Use the Short Answer API (v1/result) for calculations
        const response = await fetch(`https://api.wolframalpha.com/v1/result?appid=${appId}&i=${encodeURIComponent(query)}`);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Wolfram API failed: ${response.status} - ${errorText}`);
            return NextResponse.json({ error: errorText || 'Wolfram API error' }, { status: response.status });
        }

        const data = await response.text();
        return NextResponse.json({ result: data });
    } catch (error) {
        console.error("Wolfram API Proxy Error:", error);
        return NextResponse.json({ error: 'Failed to fetch from Wolfram Alpha' }, { status: 500 });
    }
}
