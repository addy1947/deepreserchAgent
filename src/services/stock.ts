
export interface StockData {
    ticker: string;
    resultsCount?: number;
    results?: {
        c: number; // close price
        h: number; // high
        l: number; // low
        o: number; // open
        v: number; // volume
        t: number; // timestamp
    }[];
    status?: string;
    error?: string;
}

export const getStockHistory = async ({ ticker }: { ticker: string }): Promise<StockData> => {
    try {
        const response = await fetch(`/api/stocks?ticker=${ticker}&type=history`);

        let data;
        try {
            data = await response.json();
        } catch (e) {
            return { ticker, error: "Invalid response from server" };
        }

        // Handle error responses or empty data
        if (!response.ok || data.resultsCount === 0) {
            // Use the error message from the backend if available
            return {
                ticker,
                error: data.error || "No data found. Massive API primarily supports US stocks."
            };
        }

        return data;
    } catch (error) {
        console.error('Stock service error:', error);
        return { ticker, error: "Failed to connect to stock service" };
    }
};
