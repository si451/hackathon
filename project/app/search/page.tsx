"use client";

import { useState, useEffect } from "react";
import { InfluencerSearchEngine } from "@/lib/influencer-search";
import { Influencer } from "../../types/influencer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Import mock data
import youtubeMockData from "../../data/mock_youtube_influencers.json";
import instagramMockData from "../../data/mock_instagram_influencers.json";

export default function SearchPage() {
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRandomCreators = (data: { youtube_influencers?: any[], instagram_influencers?: any[] }, count: number) => {
    const creators = data.youtube_influencers || data.instagram_influencers || [];
    const shuffled = [...creators].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map(creator => ({
      ...creator,
      platform: creator.platform as "YouTube" | "Instagram"
    }));
  };

  const resetToFeatured = () => {
    setIsSearching(false);
    setQuery("");
    setError(null);
    const initialCreators = [
      ...getRandomCreators(youtubeMockData, 9),
      ...getRandomCreators(instagramMockData, 9)
    ];
    setResults(initialCreators);
  };

  // Handle initial mount
  useEffect(() => {
    setMounted(true);
    const initialCreators = [
      ...getRandomCreators(youtubeMockData, 9),
      ...getRandomCreators(instagramMockData, 9)
    ];
    setResults(initialCreators);
  }, []);

  // Handle auto-refresh
  useEffect(() => {
    if (!mounted) return;

    const interval = setInterval(() => {
      if (!isSearching) {
        const newCreators = [
          ...getRandomCreators(youtubeMockData, 9),
          ...getRandomCreators(instagramMockData, 9)
        ];
        setResults(newCreators);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isSearching, mounted]);

  const handleSearch = async () => {
    if (!query.trim()) {
      resetToFeatured();
      return;
    }

    setLoading(true);
    setIsSearching(true);
    setError(null);
    
    try {
      const searchEngine = InfluencerSearchEngine.getInstance();
      const searchResults = await searchEngine.search(query);
      
      if (!searchResults || searchResults.length === 0) {
        setResults([]);
        return;
      }

      // Filter and limit results to 9 per platform
      const youtubeFiltered = searchResults
        .filter(result => result.platform === "YouTube")
        .slice(0, 9);
      const instagramFiltered = searchResults
        .filter(result => result.platform === "Instagram")
        .slice(0, 9);
      
      setResults([...youtubeFiltered, ...instagramFiltered]);
    } catch (error) {
      console.error("Search error:", error);
      setError("Failed to search creators. Please try again.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    const formatter = new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1
    });
    return formatter.format(num);
  };

  const youtubeResults = results.filter(creator => creator.platform === "YouTube").slice(0, 9);
  const instagramResults = results.filter(creator => creator.platform === "Instagram").slice(0, 9);

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0A0A0A]">
        <div className="container py-6 space-y-6">
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight font-mono text-white">
              Discover Creators
            </h1>
            <p className="text-[#00FF94] text-lg font-mono">
              Find the perfect creators for your brand
            </p>
          </div>
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-[#00FF94]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="container py-6 space-y-6">
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight font-mono text-white">
            Discover Creators
          </h1>
          <p className="text-[#00FF94] text-lg font-mono">
            Find the perfect creators for your brand
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative flex gap-2">
            {isSearching && (
              <Button
                variant="ghost"
                size="icon"
                onClick={resetToFeatured}
                className="shrink-0 text-[#00FF94] hover:bg-[#1A1A1A]"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#00FF94]" />
              <Input
                placeholder="Search for creators (e.g., 'tech YouTubers with over 1M followers')"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-9 h-11 font-mono bg-[#1A1A1A] border-[#2A2A2A] text-white placeholder:text-gray-500"
              />
            </div>
            <Button 
              onClick={handleSearch} 
              disabled={loading} 
              className="shrink-0 bg-[#00FF94] text-black hover:bg-[#00FF94]/90"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00FF94] mx-auto"></div>
              <p className="mt-4 text-[#00FF94] font-mono">Searching for creators...</p>
            </motion.div>
          ) : error ? (
            <motion.div 
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <div className="rounded-full bg-destructive/10 p-3">
                <Search className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="mt-4 text-lg font-semibold font-mono text-destructive">{error}</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-sm font-mono">
                Please try searching again or return to featured creators.
              </p>
            </motion.div>
          ) : youtubeResults.length === 0 && instagramResults.length === 0 ? (
            <motion.div 
              key="no-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <div className="rounded-full bg-[#1A1A1A] p-3">
                <Search className="h-6 w-6 text-[#00FF94]" />
              </div>
              <h3 className="mt-4 text-lg font-semibold font-mono text-white">No creators found</h3>
              <p className="mt-2 text-sm text-[#00FF94] max-w-sm font-mono">
                Try a different search query to find creators.
              </p>
            </motion.div>
          ) : (
            <motion.div 
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              {!isSearching && (
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-semibold mb-2 font-mono text-white">Featured Creators</h2>
                  <p className="text-[#00FF94] font-mono">Discover top creators across platforms</p>
                </div>
              )}
              
              {youtubeResults.length > 0 && (
                <div className="overflow-hidden">
                  <h2 className="text-2xl font-bold mb-4">
                    <span className="text-[#00FF94] font-mono">YouTube</span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {youtubeResults.map((creator, index) => (
                      <motion.div
                        key={`${creator.username}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Card className="p-4 hover:shadow-lg transition-shadow bg-[#1A1A1A] border-[#2A2A2A]">
                          <div className="flex gap-3">
                            <div className="w-20 h-20 flex-shrink-0">
                              <img
                                src={creator.thumbnail}
                                alt={creator.username}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h2 className="text-lg font-semibold truncate font-mono text-white">{creator.username}</h2>
                              <p className="text-[#00FF94] text-sm mb-2 line-clamp-1 font-mono">{creator.description}</p>
                              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                                <div className="truncate font-mono">
                                  <span className="font-medium text-white">Subscribers:</span>{" "}
                                  <span className="text-[#00FF94]">{formatNumber(creator.followers)}</span>
                                </div>
                                <div className="truncate font-mono">
                                  <span className="font-medium text-white">Engagement:</span>{" "}
                                  <span className="text-[#00FF94]">{creator.engagement_rate.toFixed(1)}%</span>
                                </div>
                                <div className="truncate font-mono">
                                  <span className="font-medium text-white">Niche:</span>{" "}
                                  <span className="text-[#00FF94]">{creator.niche}</span>
                                </div>
                                <div className="truncate font-mono">
                                  <span className="font-medium text-white">Location:</span>{" "}
                                  <span className="text-[#00FF94]">{creator.location}</span>
                                </div>
                              </div>
                              <div className="mt-2">
                                <a
                                  href={`/negotiate/${creator.platform.toLowerCase()}/${creator.username}`}
                                  className="text-[#00FF94] hover:text-[#00FF94]/80 text-xs font-mono"
                                >
                                  Start Negotiation →
                                </a>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {instagramResults.length > 0 && (
                <div className="overflow-hidden">
                  <h2 className="text-2xl font-bold mb-4">
                    <span className="text-[#00FF94] font-mono">Instagram</span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {instagramResults.map((creator, index) => (
                      <motion.div
                        key={`${creator.username}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Card className="p-4 hover:shadow-lg transition-shadow bg-[#1A1A1A] border-[#2A2A2A]">
                          <div className="flex gap-3">
                            <div className="w-20 h-20 flex-shrink-0">
                              <img
                                src={creator.thumbnail}
                                alt={creator.username}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h2 className="text-lg font-semibold truncate font-mono text-white">{creator.username}</h2>
                              <p className="text-[#00FF94] text-sm mb-2 line-clamp-1 font-mono">{creator.description}</p>
                              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                                <div className="truncate font-mono">
                                  <span className="font-medium text-white">Followers:</span>{" "}
                                  <span className="text-[#00FF94]">{formatNumber(creator.followers)}</span>
                                </div>
                                <div className="truncate font-mono">
                                  <span className="font-medium text-white">Engagement:</span>{" "}
                                  <span className="text-[#00FF94]">{creator.engagement_rate.toFixed(1)}%</span>
                                </div>
                                <div className="truncate font-mono">
                                  <span className="font-medium text-white">Niche:</span>{" "}
                                  <span className="text-[#00FF94]">{creator.niche}</span>
                                </div>
                                <div className="truncate font-mono">
                                  <span className="font-medium text-white">Location:</span>{" "}
                                  <span className="text-[#00FF94]">{creator.location}</span>
                                </div>
                              </div>
                              <div className="mt-2">
                                <a
                                  href={`/negotiate/${creator.platform.toLowerCase()}/${creator.username}`}
                                  className="text-[#00FF94] hover:text-[#00FF94]/80 text-xs font-mono"
                                >
                                  Start Negotiation →
                                </a>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}