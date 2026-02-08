
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const repoUrl = searchParams.get("url");

    if (!repoUrl) {
        return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
    }

    try {
        const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
        if (!match) {
            return NextResponse.json({ error: "Invalid GitHub URL format" }, { status: 400 });
        }
        const owner = match[1];
        const repo = match[2];

        const headers: any = {
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "Tambo-DeepResearch-Agent"
        };

        console.log(`Analyzing GitHub repo: ${owner}/${repo}`);

        const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
        if (!repoRes.ok) {
            throw new Error(`GitHub API error: ${repoRes.statusText}`);
        }
        const repoData = await repoRes.json();

        let readmeContent = "";
        try {
            const readmeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, { headers });
            if (readmeRes.ok) {
                const readmeData = await readmeRes.json();
                const downloadUrl = readmeData.download_url;
                if (downloadUrl) {
                    const rawRes = await fetch(downloadUrl);
                    readmeContent = await rawRes.text();
                }
            }
        } catch (e) {
            console.warn("Failed to fetch README", e);
        }

        let fileStructure: string[] = [];
        try {
            const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents`, { headers });
            if (treeRes.ok) {
                const treeData = await treeRes.json();
                if (Array.isArray(treeData)) {
                    fileStructure = treeData.map((item: any) => item.name);
                }
            }
        } catch (e) {
            console.warn("Failed to fetch file tree", e);
        }

        let dependencies: any = {};
        if (fileStructure.includes("package.json")) {
            try {
                const defaultBranch = repoData.default_branch || "main";
                const pkgRes = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/${defaultBranch}/package.json`);
                if (pkgRes.ok) {
                    const pkgJson = await pkgRes.json();
                    dependencies = { ...pkgJson.dependencies, ...pkgJson.devDependencies };
                }
            } catch (e) {
                console.warn("Failed to fetch package.json", e);
            }
        }


        return NextResponse.json({
            name: repoData.name,
            full_name: repoData.full_name,
            description: repoData.description,
            stars: repoData.stargazers_count,
            forks: repoData.forks_count,
            language: repoData.language,
            updated_at: repoData.updated_at,
            default_branch: repoData.default_branch,
            readme: readmeContent.substring(0, 15000),
            files: fileStructure,
            dependencies: Object.keys(dependencies).slice(0, 50)
        });

    } catch (error: any) {
        console.error("Error analyzing GitHub repo:", error);
        return NextResponse.json(
            { error: `Failed to analyze repo: ${error.message}` },
            { status: 500 }
        );
    }
}
