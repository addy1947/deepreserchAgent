
import { ApiKeyCheck } from "@/components/ApiKeyCheck";
import Image from "next/image";
import { ArrowRight, Search, BarChart3, MessageSquareText, Globe2, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">

      {/* Hero Section */}
      <main className="flex-1 w-full max-w-5xl px-6 py-20 flex flex-col items-center text-center">

        {/* Logo and Branding */}
        <div className="mb-8 relative group cursor-pointer">
          <div className="absolute inset-0 bg-blue-200 blur-2xl rounded-full opacity-20 group-hover:opacity-50 group-hover:blur-3xl transition-all duration-500"></div>
          <div className="relative bg-white p-4 rounded-2xl shadow-xl border border-gray-100 group-hover:-translate-y-2 transition-transform duration-300">
            <Image
              src="/Octo-Icon.svg"
              alt="Tambo AI"
              width={80}
              height={80}
              className="w-20 h-20 group-hover:rotate-12 transition-transform duration-500"
            />
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 flex flex-wrap justify-center gap-x-3 animate-in fade-in slide-in-from-bottom-4 duration-1000 cursor-default text-gray-900">
          {["DeepResearch", "AI", "Agent"].map((word, wIndex) => (
            <span key={wIndex} className="whitespace-nowrap">
              {word.split("").map((char, cIndex) => (
                <span
                  key={cIndex}
                  className="inline-block transition-all duration-200 hover:text-green-500 hover:-translate-y-2 hover:rotate-12 hover:scale-110"
                >
                  {char}
                </span>
              ))}
            </span>
          ))}
        </h1>

        <div className="mb-8 -mt-2 animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-300">
          <span className="text-sm font-medium text-gray-500 bg-white px-4 py-1.5 rounded-full shadow-sm border border-gray-100">
            Powered by <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">Tambo AI</span>
          </span>
        </div>

        <p className="text-xl text-gray-500 max-w-2xl mb-10 leading-relaxed cursor-default">
          {"Your intelligent partner for deep market analysis, real-time crypto insights, and authentic product research. Cut through the noise with AI-powered data aggregation.".split(" ").map((word, index) => (
            <span
              key={index}
              className="inline-block transition-transform duration-200 hover:text-blue-600 hover:scale-110 mr-1.5 last:mr-0"
            >
              {word}
            </span>
          ))}
        </p>

        {/* Call to Action */}
        <div className="mb-20">
          <ApiKeyCheck>
            <a
              href="/chat"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-full font-medium text-lg shadow-lg hover:bg-gray-800 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
            >
              <Sparkles className="w-5 h-5 text-yellow-300" />
              Start Researching
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </ApiKeyCheck>
          <p className="mt-4 text-sm text-gray-400">Powered by Tambo AI & Next.js</p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 w-full text-left">

          {/* Feature 1 */}
          <div className="group p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:scale-105 hover:border-blue-200 transition-all duration-300">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">Market Intelligence</h3>
            <p className="text-gray-500 leading-relaxed">
              Interactive stock charts and historical data analysis. Get instant price checks and trend visualization for any US stock.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="group p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:scale-105 hover:border-purple-200 transition-all duration-300">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
              <Globe2 className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">Crypto Pulse</h3>
            <p className="text-gray-500 leading-relaxed">
              Real-time crypto news aggregator powered by CryptoPanic. Filter by currency, sentiment, or trending topics instantly.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="group p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:scale-105 hover:border-orange-200 transition-all duration-300">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
              <MessageSquareText className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">Review Scraper</h3>
            <p className="text-gray-500 leading-relaxed">
              Search Reddit for honest product reviews. The AI reads threads and comments to summarize real user experiences for you.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="group p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:scale-105 hover:border-green-200 transition-all duration-300">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
              <Search className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">Deep Web Search</h3>
            <p className="text-gray-500 leading-relaxed">
              Comprehensive web search capabilities with GNews integration for breaking headlines and structured result cards.
            </p>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="w-full py-8 border-t border-gray-200 mt-auto bg-white/50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© 2026 DeepResearch AI Agent. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="https://tambo.co/docs" target="_blank" className="hover:text-gray-900 transition-colors">Documentation</a>
            <a href="https://github.com/tambo-ai" target="_blank" className="hover:text-gray-900 transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
