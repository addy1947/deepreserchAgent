import React from "react";
import Image from "next/image";
import { z } from "zod";

export const newsListSchema = z.object({
    articles: z.array(
        z.object({
            title: z.string(),
            description: z.string(),
            url: z.string(),
            image: z.string().optional(),
            source: z.object({
                name: z.string(),
                url: z.string().optional(),
            }).optional(),
            publishedAt: z.string(),
        })
    ).describe("Array of news articles to display"),
});

type NewsListProps = z.infer<typeof newsListSchema>;

export const NewsList: React.FC<NewsListProps> = ({ articles }) => {
    if (!articles || articles.length === 0) {
        return (
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 text-gray-500 text-sm">
                No news articles found.
            </div>
        );
    }

    return (
        <div className="w-full space-y-4 my-4 font-sans">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Latest News
            </h3>
            <div className="grid gap-3">
                {articles.map((article, index) => (
                    <a
                        key={index}
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-gray-200 bg-white hover:shadow-md hover:border-blue-200 transition-all duration-200 group no-underline"
                    >
                        {article.image && (
                            <div className="flex-shrink-0 w-full sm:w-24 h-32 sm:h-24 relative rounded-lg overflow-hidden bg-gray-100">
                                <img
                                    src={article.image}
                                    alt={article.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                        )}

                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                                        {article.source?.name || "Unknown Source"}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {new Date(article.publishedAt).toLocaleDateString(undefined, {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>

                                <h4 className="text-base font-semibold text-gray-900 leading-snug group-hover:text-blue-600 transition-colors mb-1 line-clamp-2">
                                    {article.title}
                                </h4>

                                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                                    {article.description}
                                </p>
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
};
