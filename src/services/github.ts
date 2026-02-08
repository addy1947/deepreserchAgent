
export interface GithubRepoAnalysis {
    name: string;
    full_name: string;
    description: string;
    stars: number;
    forks: number;
    language: string;
    updated_at: string;
    default_branch: string;
    readme: string;
    files: string[];
    dependencies: string[];
}

export async function analyzeGithubRepo({
    repoUrl,
}: {
    repoUrl: string;
}): Promise<GithubRepoAnalysis | null> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_TAMBO_URL || "http://localhost:3000";
        const response = await fetch(
            `${baseUrl}/api/github/analyze?url=${encodeURIComponent(repoUrl)}`
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to analyze repo: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        return {
            name: data.name,
            full_name: data.full_name,
            description: data.description || "No description provided.",
            stars: data.stars || 0,
            forks: data.forks || 0,
            language: data.language || "Unknown",
            updated_at: data.updated_at,
            default_branch: data.default_branch,
            readme: data.readme,
            files: data.files,
            dependencies: data.dependencies || []
        };

    } catch (error) {
        console.error("Error analyzing GitHub repo:", error);
        return null;
    }
}
