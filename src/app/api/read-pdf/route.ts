
import { NextResponse } from "next/server";

/* eslint-disable @typescript-eslint/no-var-requires */
const pdf = require("pdf-parse");

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const pdfUrl = searchParams.get("url");

    if (!pdfUrl) {
        return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
    }

    try {
        console.log(`Fetching PDF from: ${pdfUrl}`);

        const response = await fetch(pdfUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const data = await pdf(buffer);

        const textContent = data.text.substring(0, 50000);

        return NextResponse.json({
            url: pdfUrl,
            text: textContent,
            pages: data.numpages,
            info: data.info
        });

    } catch (error: any) {
        console.error("Error reading PDF:", error);
        return NextResponse.json(
            { error: `Failed to read PDF content: ${error.message}` },
            { status: 500 }
        );
    }
}
