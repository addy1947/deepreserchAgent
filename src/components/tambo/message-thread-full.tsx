"use client";

import type { messageVariants } from "@/components/tambo/message";
import {
  MessageInput,
  MessageInputError,
  MessageInputFileButton,
  MessageInputMcpPromptButton,
  MessageInputMcpResourceButton,
  MessageInputSubmitButton,
  MessageInputTextarea,
  MessageInputToolbar,
} from "@/components/tambo/message-input";
import {
  MessageSuggestions,
  MessageSuggestionsList,
  MessageSuggestionsStatus,
} from "@/components/tambo/message-suggestions";
import { ScrollableMessageContainer } from "@/components/tambo/scrollable-message-container";
import { MessageInputMcpConfigButton } from "@/components/tambo/message-input";
import { ThreadContainer, useThreadContainerContext } from "./thread-container";
import {
  ThreadContent,
  ThreadContentMessages,
} from "@/components/tambo/thread-content";
import {
  ThreadHistory,
  ThreadHistoryHeader,
  ThreadHistoryList,
  ThreadHistoryNewButton,
  ThreadHistorySearch,
} from "@/components/tambo/thread-history";
import { useMergeRefs } from "@/lib/thread-hooks";
import type { Suggestion } from "@tambo-ai/react";
import { useTambo } from "@tambo-ai/react";
import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { Sparkles, BarChart3, Search, Globe2 } from "lucide-react";

export interface MessageThreadFullProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: VariantProps<typeof messageVariants>["variant"];
}

export const MessageThreadFull = React.forwardRef<
  HTMLDivElement,
  MessageThreadFullProps
>(({ className, variant, ...props }, ref) => {
  const { containerRef, historyPosition } = useThreadContainerContext();
  const mergedRef = useMergeRefs<HTMLDivElement | null>(ref, containerRef);
  const { thread } = useTambo();
  const messages = thread?.messages;

  const threadHistorySidebar = (
    <ThreadHistory position={historyPosition}>
      <ThreadHistoryHeader />
      <ThreadHistoryNewButton />
      <ThreadHistorySearch />
      <ThreadHistoryList />
    </ThreadHistory>
  );

  const defaultSuggestions: Suggestion[] = [
    {
      id: "suggestion-1",
      title: "Market Analysis",
      detailedSuggestion: "Analyze the current stock performance of Tesla (TSLA) and show me a chart.",
      messageId: "market-analysis",
    },
    {
      id: "suggestion-2",
      title: "Reddit Reviews",
      detailedSuggestion: "Find detailed reviews and user opinions about the iPhone 15 Pro on Reddit.",
      messageId: "reddit-reviews",
    },
    {
      id: "suggestion-3",
      title: "Crypto News",
      detailedSuggestion: "What are the latest breaking news stories in the crypto world right now?",
      messageId: "crypto-news",
    },
  ];

  return (
    <div className="flex h-full w-full bg-[#f8f9fa] relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #eef2ff 0%, transparent 50%)' }} />

      {historyPosition === "left" && threadHistorySidebar}

      <ThreadContainer
        ref={mergedRef}
        disableSidebarSpacing
        className={className}
        {...props}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white/60 backdrop-blur-md sticky top-0 z-10 transition-all">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl text-white shadow-sm ring-1 ring-gray-100">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-sm tracking-tight">DeepResearch AI</h1>
              <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Powered by Tambo</p>
            </div>
          </div>
        </div>

        <ScrollableMessageContainer className="p-4 md:p-8 space-y-6 relative min-h-0 flex-1 z-0">
          {(!messages || messages.length === 0) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-0 animate-in fade-in duration-700">
              <div className="max-w-2xl w-full text-center space-y-8">

                <div className="relative inline-block group">
                  <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 group-hover:opacity-30 transition-opacity rounded-full"></div>
                  <div className="relative w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center mx-auto border border-gray-50 group-hover:-translate-y-1 transition-transform duration-500">
                    <Sparkles className="w-10 h-10 text-blue-600" />
                  </div>
                </div>

                <div className="space-y-3">
                  <h2 className="text-3xl font-bold text-gray-900 tracking-tight">How can I help you research?</h2>
                  <p className="text-gray-500 text-lg max-w-md mx-auto leading-relaxed">
                    I can analyze markets, scrape reviews, and track crypto trends in real-time.
                  </p>
                </div>

                <div className="pt-4 flex justify-center">
                  <MessageSuggestions initialSuggestions={defaultSuggestions}>
                    <MessageSuggestionsList />
                  </MessageSuggestions>
                </div>

              </div>
            </div>
          )}

          <div className="relative z-10 max-w-4xl mx-auto w-full">
            <ThreadContent variant={variant}>
              <ThreadContentMessages />
            </ThreadContent>
          </div>
        </ScrollableMessageContainer>

        <MessageSuggestions>
          <MessageSuggestionsStatus />
        </MessageSuggestions>

        <div className="px-4 pb-6 pt-2 z-20">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden ring-1 ring-gray-50 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-300">
              <MessageInput>
                <MessageInputTextarea
                  placeholder="Ask follow-up..."
                  className="min-h-[52px] max-h-[200px] py-3.5 px-4 text-gray-800 placeholder:text-gray-400 text-base"
                />
                <div className="flex items-center justify-between px-2 py-2 bg-gray-50/30">
                  <div className="flex gap-1">
                    <MessageInputFileButton />
                    <MessageInputMcpPromptButton />
                  </div>
                  <div className="flex gap-2">
                    <MessageInputMcpResourceButton />
                    <MessageInputSubmitButton />
                  </div>
                </div>
                <MessageInputError />
              </MessageInput>
            </div>
            <div className="text-center mt-3">
              <p className="text-[10px] text-gray-300">AI can make mistakes. Check important info.</p>
            </div>
          </div>
        </div>

      </ThreadContainer>

      {historyPosition === "right" && threadHistorySidebar}
    </div>
  );
});
MessageThreadFull.displayName = "MessageThreadFull";
