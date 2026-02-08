
export interface CryptoPriceData {
    data?: Record<string, {
        id: string;
        type: string;
        price: string;
    }>;
    timeTaken?: number;
}

export interface CryptoHistoryData {
    mintAddress: string;
    results: {
        t: number;
        c: number;
    }[];
    error?: string;
}

export const getCryptoPrice = async ({ mintAddress }: { mintAddress: string }): Promise<CryptoPriceData | { error: string }> => {
    try {
        const response = await fetch(`/api/web3?mintAddress=${mintAddress}`);
        const data = await response.json();

        if (!response.ok) {
            return { error: data.error || "Failed to fetch crypto price" };
        }

        if (data.data && !data.data[mintAddress]) {
            return { error: `No price data found for mint address: ${mintAddress}.` };
        }

        return data;
    } catch (error) {
        console.error('Crypto service error:', error);
        return { error: "Network error while fetching crypto price" };
    }
};

export const getCryptoHistory = async ({ mintAddress }: { mintAddress: string }): Promise<CryptoHistoryData | { error: string }> => {
    try {
        const response = await fetch(`/api/web3?mintAddress=${mintAddress}&type=history`);
        const data = await response.json();

        if (!response.ok) {
            return { error: data.error || "Failed to fetch crypto history" };
        }

        const rawResults = data.results || [];
        // Filter result to get ~50 data points for better graph readability
        const results = rawResults.filter((_: any, index: number) => {
            const step = Math.max(1, Math.floor(rawResults.length / 50));
            return index % step === 0;
        });

        return { ...data, results };
    } catch (error) {
        console.error('Crypto history service error:', error);
        return { error: "Network error while fetching crypto history" };
    }
};
