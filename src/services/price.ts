export interface PriceComparisonResult {
    title: string;
    originalUrl: string;
    buyhatkeUrl: string;
    comparisons: {
        store: string;
        price: string;
        link?: string;
    }[];
    error?: string;
}

export const comparePrices = async ({ productUrl }: { productUrl: string }): Promise<PriceComparisonResult> => {
    try {
        const response = await fetch(`/api/price-compare?url=${encodeURIComponent(productUrl)}`);
        const data = await response.json();

        if (!response.ok) {
            return {
                title: "Error",
                originalUrl: productUrl,
                buyhatkeUrl: "",
                comparisons: [],
                error: data.error || "Failed to compare prices"
            };
        }

        return data;
    } catch (error) {
        console.error("Error comparing prices:", error);
        return {
            title: "Error",
            originalUrl: productUrl,
            buyhatkeUrl: "",
            comparisons: [],
            error: "Network error while comparing prices"
        };
    }
};
