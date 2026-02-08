import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const currency = searchParams.get('currency');
    const filter = searchParams.get('filter') || 'rising'; // rising, hot, bullish, bearish, important, saved, lol
    const kind = searchParams.get('kind') || 'news';

    const apiKey = process.env.CRYPTOPANIC_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: 'CRYPTOPANIC_API_KEY is not configured' }, { status: 500 });
    }

    try {
        let url = `https://cryptopanic.com/api/developer/v2/posts/?auth_token=${apiKey}&filter=${filter}&kind=${kind}`;

        if (currency) {
            url += `&currencies=${currency}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: errorData || 'Failed to fetch crypto news' }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch crypto news results' }, { status: 500 });
    }
}
