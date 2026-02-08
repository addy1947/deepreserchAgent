import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const mintAddress = searchParams.get('mintAddress');
    const type = searchParams.get('type') || 'price'; // 'price' or 'history'

    if (!mintAddress) {
        return NextResponse.json({ error: 'Mint address (Token ID) is required' }, { status: 400 });
    }

    const apiKey = process.env.JUPITER_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: 'JUPITER_API_KEY is not configured' }, { status: 500 });
    }

    try {
        if (type === 'history') {
            // Jupiter does not support OHLCV history natively in Price API.
            // Falling back to CoinGecko for historical data (free public API for Solana contracts)
            // This provides the data needed for the graph.
            const coingeckoUrl = `https://api.coingecko.com/api/v3/coins/solana/contract/${mintAddress}/market_chart?vs_currency=usd&days=30`;
            const response = await fetch(coingeckoUrl);

            if (!response.ok) {
                // If rate limited or not found
                return NextResponse.json({ error: `Failed to fetch history from CoinGecko: ${response.statusText}` }, { status: response.status });
            }

            const data = await response.json();

            // Transform to a standard format similar to stock API
            // CoinGecko returns { prices: [[timestamp, price], ...] }
            const results = (data.prices || []).map((item: [number, number]) => ({
                t: item[0],
                c: item[1]
            }));

            return NextResponse.json({
                mintAddress,
                results
            });
        } else {
            // Jupiter Price API v3 (Current Price)
            const response = await fetch(`https://api.jup.ag/price/v3?ids=${mintAddress}`, {
                headers: {
                    'x-api-key': apiKey,
                },
            });

            if (!response.ok) {
                return NextResponse.json({ error: `Jupiter API error: ${response.statusText}` }, { status: response.status });
            }

            const data = await response.json();
            return NextResponse.json(data);
        }
    } catch (error) {
        console.error('Crypto API error:', error);
        return NextResponse.json({ error: 'Failed to fetch crypto data' }, { status: 500 });
    }
}
