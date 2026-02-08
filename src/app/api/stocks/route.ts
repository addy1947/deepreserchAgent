import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get('ticker');
    const type = searchParams.get('type') || 'history'; // 'price' or 'history'

    if (!ticker) {
        return NextResponse.json({ error: 'Ticker is required' }, { status: 400 });
    }

    const apiKey = process.env.MASSIVE_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: 'MASSIVE_API_KEY is not configured' }, { status: 500 });
    }

    try {
        // Massive API (assuming Polygon.io compatible or similar structure based on docs) to api.massive.com
        const baseUrl = 'https://api.massive.com';

        let url = '';

        if (type === 'history') {
            // Get last 30 days of data
            const to = new Date().toISOString().split('T')[0];
            const from = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            // Endpoint structure based on common financial APIs (Polygon/Alpaca style)
            url = `${baseUrl}/v2/aggs/ticker/${ticker.toUpperCase()}/range/1/day/${from}/${to}?adjusted=true&sort=asc&apiKey=${apiKey}`;
        } else {
            // Current price snapshot
            url = `${baseUrl}/v2/snapshot/locale/us/markets/stocks/tickers/${ticker.toUpperCase()}?apiKey=${apiKey}`;
        }

        const response = await fetch(url);

        // Handle API errors
        if (!response.ok) {
            return NextResponse.json({ error: `API responded with ${response.status}: ${response.statusText}` }, { status: response.status });
        }

        const data = await response.json();

        // Check for empty results which implies invalid ticker for this API (likely non-US)
        // Massive API returns resultsCount: 0 for valid queries with no data
        if (data.resultsCount === 0) {
            return NextResponse.json(
                { ...data, error: 'Ticker not found or no data available. Note: This API primarily supports US stocks.' },
                { status: 404 }
            );
        }

        return NextResponse.json(data);

    } catch (error) {
        console.error('Stock API error:', error);
        return NextResponse.json({ error: 'Failed to fetch stock data' }, { status: 500 });
    }
}
