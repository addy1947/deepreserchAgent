
import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");
    const maxResults = searchParams.get("max_results") || "5";

    if (!query) {
        return NextResponse.json({ error: "Missing query parameter" }, { status: 400 });
    }

    try {
        const apiUrl = `http://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(query)}&start=0&max_results=${maxResults}&sortBy=submittedDate&sortOrder=descending`;

        console.log(`Fetching ArXiv data from: ${apiUrl}`);

        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`ArXiv API error: ${response.statusText}`);
        }

        const xmlData = await response.text();

        const $ = cheerio.load(xmlData, { xmlMode: true });

        const papers: any[] = [];

        $("entry").each((_, element) => {
            const entry = $(element);

            const title = entry.find("title").text().trim().replace(/\n/g, " ");
            const summary = entry.find("summary").text().trim().replace(/\n/g, " ");
            const published = entry.find("published").text().trim();
            const updated = entry.find("updated").text().trim();

            const authors: string[] = [];
            entry.find("author name").each((_, authorElem) => {
                authors.push($(authorElem).text().trim());
            });

            let pdfLink = entry.find("link[title='pdf']").attr("href");

            if (!pdfLink) {
                const idUrl = entry.find("id").text().trim();
                if (idUrl && idUrl.includes("/abs/")) {
                    pdfLink = idUrl.replace("/abs/", "/pdf/") + ".pdf";
                }
            }

            const articleUrl = entry.find("id").text().trim();

            papers.push({
                title,
                summary,
                authors,
                published,
                updated,
                pdfUrl: pdfLink || articleUrl,
                articleUrl
            });
        });

        return NextResponse.json({ papers });

    } catch (error) {
        console.error("Error fetching ArXiv data:", error);
        return NextResponse.json(
            { error: "Failed to fetch research papers" },
            { status: 500 }
        );
    }
}
