'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import SearchFilters, { SearchFilters as SearchFiltersType } from './SearchFilters';

interface User {
  id: string;
  name: string;
  email: string;
  type: string;
  profile: {
    bio: string;
    niches: string[];
    metrics: {
      followers: number;
      engagementRate: number;
    } | null;
  } | null;
}

interface SearchResult {
  id: string;
  score: number;
  metadata: {
    type: string;
    niches: string[];
    followers: number;
    engagementRate: number;
  };
  user?: User;
}

export default function SearchUsers() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<SearchFiltersType>({
    type: 'ALL',
    niches: [],
    minFollowers: undefined,
    engagementRate: undefined
  });

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          type: 'user',
          topK: 10,
          filters
        }),
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: SearchFiltersType) => {
    setFilters(newFilters);
    if (query.trim()) {
      handleSearch();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search users..."
            className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <SearchFilters onFilterChange={handleFilterChange} />
        </div>
        
        <div className="md:col-span-3">
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              {results.map((result) => (
                <div
                  key={result.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{result.user?.name}</h3>
                      <p className="text-sm text-gray-600">{result.user?.email}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Type: {result.user?.type}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      Score: {(result.score * 100).toFixed(1)}%
                    </div>
                  </div>
                  
                  {result.user?.profile && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-700">
                        {result.user.profile.bio}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {result.user.profile.niches.map((niche) => (
                          <span
                            key={niche}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            {niche}
                          </span>
                        ))}
                      </div>
                      {result.user.profile.metrics && (
                        <div className="mt-2 text-sm text-gray-600">
                          <p>
                            Followers: {result.user.profile.metrics.followers?.toLocaleString() ?? 'N/A'}
                          </p>
                          <p>
                            Engagement Rate: {result.user.profile.metrics.engagementRate?.toFixed(2) ?? 'N/A'}%
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : query ? (
            <div className="text-center py-8 text-gray-500">
              No results found
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
} 