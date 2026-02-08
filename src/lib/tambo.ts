import { Graph, graphSchema } from "@/components/tambo/graph";
import { DataCard, dataCardSchema } from "@/components/ui/card-data";
import { NewsList, newsListSchema } from "@/components/tambo/news-list";

import { performGoogleSearch } from "@/services/google-search";
import { getStockHistory } from "@/services/stock";
import { generatePdf } from "@/services/pdf";

import { getCryptoPrice, getCryptoHistory } from "@/services/crypto";
import { performWolframCalculation } from "@/services/wolfram";
import { getYoutubeTranscript } from "@/services/youtube";
import { getLiveNews } from "@/services/news";
import { getCryptoNews } from "@/services/crypto-news";
import { searchRedditReviews, getRedditThread } from "@/services/reddit";
import { searchArxivPapers, readArxivPaper } from "@/services/arxiv";
import { analyzeGithubRepo } from "@/services/github";
import { analyzeDomain } from "@/services/domain";
import type { TamboComponent } from "@tambo-ai/react";
import { TamboTool } from "@tambo-ai/react";
import { z } from "zod";

export const tools: TamboTool[] = [
  {
    name: "googleSearch",
    description: "A tool to perform a Google Search to find information about a topic or answer a question.",
    tool: performGoogleSearch,
    inputSchema: z.object({
      query: z.string().describe("The search query"),
    }),
    outputSchema: z.array(
      z.object({
        title: z.string(),
        link: z.string(),
        snippet: z.string(),
        source: z.string().optional(),
        date: z.string().optional(),
      })
    ),
  },
  {
    name: "getStockHistory",
    description: "Get historical stock prices for a given ticker symbol (US stocks only). Use this data to render a Graph component.",
    tool: getStockHistory,
    inputSchema: z.object({
      ticker: z.string().describe("The stock ticker symbol (e.g. AAPL, MSFT)"),
    }),
    outputSchema: z.object({
      ticker: z.string(),
      error: z.string().optional(),
      results: z.array(z.object({
        c: z.number().describe("Close price"),
        t: z.number().describe("Timestamp"),
        h: z.number().optional(),
        l: z.number().optional(),
        o: z.number().optional(),
        v: z.number().optional(),
      })).optional(),
    }),
  },
  {
    name: "getCryptoPrice",
    description: "Get the real-time price of a Solana token using Jupiter API. IMPORTANT: You usually do NOT know the mint address. You MUST FIRST use the 'googleSearch' tool to find the 'Solana mint address' for the coin (e.g. search 'Bonk coin mint address'). Then pass that exact address here as the 'mintAddress'.",
    tool: getCryptoPrice,
    inputSchema: z.object({
      mintAddress: z.string().describe("The Solana Mint Address (Token ID) of the coin."),
    }),
    outputSchema: z.object({
      data: z.record(z.string(), z.object({
        id: z.string(),
        type: z.string(),
        price: z.string(),
      })).optional(),
      error: z.string().optional(),
    }),
  },
  {
    name: "getCryptoHistory",
    description: "Get historical price data for a Solana token to render a chart/graph. You MUST use 'googleSearch' first to find the Mint Address if you don't have it.",
    tool: getCryptoHistory,
    inputSchema: z.object({
      mintAddress: z.string().describe("The Solana Mint Address (Token ID)."),
    }),
    outputSchema: z.object({
      mintAddress: z.string(),
      results: z.array(z.object({
        t: z.number().describe("Timestamp"),
        c: z.number().describe("Price"),
      })),
      error: z.string().optional(),
    }),
  },
  {
    name: "getYoutubeTranscript",
    description: "Get the transcript (subtitles/captions) of a YouTube video. You must provide the 'videoId' (the 11-character string from the URL, e.g., 'dQw4w9WgXcQ').When showing the transcript to the user , show the full transcript do not cut any part of it.",
    tool: getYoutubeTranscript,
    inputSchema: z.object({
      videoId: z.string().describe("The YouTube Video ID."),
    }),
    outputSchema: z.object({
      transcript: z.array(z.object({
        text: z.string(),
        start: z.number(),
        duration: z.number(),
      })).optional(),
      error: z.string().optional(),
    }),
  },
  {
    name: "generatePdf",
    description: "Generate a PDF file from text content and download it to the user's device. Useful for saving summaries, notes, or reports.",
    tool: generatePdf,
    inputSchema: z.object({
      text: z.string().describe("The text content to put in the PDF."),
      filename: z.string().optional().describe("The filename for the downloaded PDF (e.g. 'summary.pdf'). Defaults to 'document.pdf'."),
    }),
    outputSchema: z.object({
      success: z.boolean(),
      message: z.string(),
    }),
  },
  {
    name: "wolframCalculation",
    description: "Perform mathematical calculations or get factual answers using WolframAlpha. Useful for math, physics, unit conversions, and general knowledge questions. Returns a simple text result.",
    tool: performWolframCalculation,
    inputSchema: z.object({
      query: z.string().describe("The calculation or question to send to WolframAlpha (e.g. 'integrate x^2', 'distance to sun')."),
    }),
    outputSchema: z.string(),
  },
  {
    name: "getLiveNews",
    description: "Get live news articles about a specific topic using GNews API. Use this when the user asks for 'latest news', 'news about X', or current events updates. Returns a list of articles with titles, descriptions, and links.",
    tool: getLiveNews,
    inputSchema: z.object({
      query: z.string().describe("The topic to search for news about (e.g. 'Bitcoin', 'Tesla', 'Global warming')."),
    }),
    outputSchema: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
        url: z.string(),
        source: z.object({
          name: z.string(),
          url: z.string().optional(),
        }),
        publishedAt: z.string(),
      })
    ),
  },
  {
    name: "getCryptoNews",
    description: "Get the latest crypto news from CryptoPanic. Use this when the user asks for 'crypto news', 'bitcoin news', or market sentiment. You can filter by currency (e.g. BTC, ETH) or type (rising, hot). Returns a list of articles compatible with the NewsList component.",
    tool: getCryptoNews,
    inputSchema: z.object({
      currency: z.string().optional().describe("The crypto currency code to filter by (e.g. BTC, ETH)."),
      filter: z.enum(["rising", "hot", "bullish", "bearish", "important", "saved", "lol"]).optional().describe("Filter for the news type. Defaults to 'rising'."),
    }),
    outputSchema: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
        url: z.string(),
        source: z.object({
          name: z.string(),
          url: z.string().optional(),
        }),
        publishedAt: z.string(),
      })
    ),
  },
  {
    name: "searchRedditReviews",
    description: "STEP 1: Search Reddit for product reviews, user discussions, or opinions. Returns a list of thread summaries. ALWAYS use this first when the user asks for reviews. Then, proceed to STEP 2 (getRedditThread) with the URL of the most relevant thread to get the full detailed review.",
    tool: searchRedditReviews,
    inputSchema: z.object({
      query: z.string().describe("The product name or topic to search for (e.g. 'iPhone 15 review', 'best running shoes')."),
    }),
    outputSchema: z.array(z.object({
      title: z.string(),
      url: z.string(),
      author: z.string(),
      subreddit: z.string(),
      score: z.number(),
      num_comments: z.number(),
      selftext: z.string(),
    })),
  },
  {
    name: "getRedditThread",
    description: "STEP 2: Fetch the FULL detailed content and comments of a specific Reddit thread. Use this immediately after 'searchRedditReviews' to get the deep dive data, then summarize it for the user.",
    tool: getRedditThread,
    inputSchema: z.object({
      url: z.string().describe("The full URL of the Reddit thread to scrape."),
    }),
    outputSchema: z.object({
      title: z.string(),
      selftext: z.string(),
      url: z.string(),
      author: z.string(),
      comments: z.array(z.object({
        author: z.string(),
        body: z.string(),
        score: z.number(),
      })),
    }).nullable(),
  },
  {
    name: "searchArxiv",
    description: "Search for authentic scientific and academic research papers on ArXiv. Use this when the user asks for 'papers', 'research about X', or 'scientific studies'. Returns a list of papers with summaries and PDF links.",
    tool: searchArxivPapers,
    inputSchema: z.object({
      query: z.string().describe("The topic to search for research papers about (e.g. 'Large Language Models', 'Quantum Computing')."),
    }),
    outputSchema: z.array(z.object({
      title: z.string(),
      summary: z.string(),
      authors: z.array(z.string()),
      published: z.string(),
      pdfUrl: z.string(),
      articleUrl: z.string(),
    })),
  },
  {
    name: "readArxivPaper",
    description: "Read the full text content of an ArXiv PDF. Use this to summarize or explain a specific paper found via 'searchArxiv'. IMPORTANT: Pass the 'pdfUrl' from the search results.",
    tool: readArxivPaper,
    inputSchema: z.object({
      pdfUrl: z.string().describe("The direct URL to the PDF file (e.g. from searchArxiv results)."),
    }),
    outputSchema: z.object({
      title: z.string(),
      text: z.string(),
      pages: z.number(),
      url: z.string(),
    }),
  },
  {
    name: "analyzeGithubRepo",
    description: "Analyze a GitHub repository to understand its purpose, code structure, and dependencies. Use this when the user asks to 'check this repo', 'explain this project', or 'is this safe?'. Returns repo stats, full readme content (truncated), file list, and package dependencies.",
    tool: analyzeGithubRepo,
    inputSchema: z.object({
      repoUrl: z.string().describe("The full specialized GitHub URL (e.g. https://github.com/facebook/react)."),
    }),
    outputSchema: z.object({
      name: z.string(),
      description: z.string(),
      stars: z.number(),
      language: z.string(),
      updated_at: z.string(),
      readme: z.string(),
      files: z.array(z.string()),
      dependencies: z.array(z.string()),
    }).nullable(),
  },
  {
    name: "analyzeDomain",
    description: "Analyze a domain name to get its WHOIS registration data (Registrar, Expiry, Owner) and DNS records (A, MX, NS). Use this for 'who owns this site', 'is this domain safe', or checking server location.",
    tool: analyzeDomain,
    inputSchema: z.object({
      domain: z.string().describe("The domain name (e.g. google.com). Do NOT include http/https."),
    }),
    outputSchema: z.object({
      whois: z.any(),
      dns: z.any(),
    }),
  },
];

export const components: TamboComponent[] = [
  {
    name: "Graph",
    description:
      "A component that renders various types of charts (bar, line, pie) using Recharts. Use 'line' for time-series data like stock prices. CRITICAL: The data usually contains 't' (timestamp in ms). You MUST parse EACH 't' value mathematically to generate the corresponding 'label' (e.g. new Date(t).toLocaleDateString()). DO NOT guess dates or sequence them manually. 176... timestamps are in 2026.",
    component: Graph,
    propsSchema: graphSchema,
  },
  {
    name: "DataCard",
    description:
      "A component that displays options as clickable cards with links and summaries with the ability to select multiple items.",
    component: DataCard,
    propsSchema: dataCardSchema,
  },
  {
    name: "NewsList",
    description: "A component to display a list of news articles. Use this component when you have fetched news using the 'getLiveNews' tool. Pass the articles array directly.",
    component: NewsList,
    propsSchema: newsListSchema,
  },
];
