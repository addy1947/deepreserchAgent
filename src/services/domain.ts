
export interface DomainAnalysis {
    domain: string;
    whois: {
        registrar: string;
        createdDate: string;
        updatedDate: string;
        expirationDate: string;
        status: string;
        error?: string;
    };
    dns: {
        a: string[];
        mx: Array<{ exchange: string; priority: number }>;
        ns: string[];
        txt: string[];
    };
}

export async function analyzeDomain({
    domain,
}: {
    domain: string;
}): Promise<DomainAnalysis | null> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_TAMBO_URL || "http://localhost:3000";
        const response = await fetch(
            `${baseUrl}/api/whois?domain=${encodeURIComponent(domain)}`
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to analyze domain: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Error analyzing domain:", error);
        return null;
    }
}
