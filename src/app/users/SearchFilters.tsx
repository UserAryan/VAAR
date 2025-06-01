'use client';

import React from 'react';

export interface SearchFilters {
  type: 'ALL' | 'INFLUENCER' | 'BRAND';
  niches: string[];
  minFollowers?: number;
  engagementRate?: number;
}

interface SearchFiltersProps {
  onFilterChange: (filters: SearchFilters) => void;
}

const NICHE_OPTIONS = [
  'Fashion',
  'Beauty',
  'Technology',
  'Fitness',
  'Food',
  'Travel',
  'Lifestyle',
  'Gaming',
  'Business',
  'Education'
];

export default function SearchFilters({ onFilterChange }: SearchFiltersProps) {
  const [filters, setFilters] = React.useState<SearchFilters>({
    type: 'ALL',
    niches: [],
    minFollowers: undefined,
    engagementRate: undefined
  });

  const handleChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          User Type
        </label>
        <select
          value={filters.type}
          onChange={(e) => handleChange('type', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="ALL">All Types</option>
          <option value="INFLUENCER">Influencers</option>
          <option value="BRAND">Brands</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Niches
        </label>
        <div className="space-y-2">
          {NICHE_OPTIONS.map((niche) => (
            <label key={niche} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.niches.includes(niche)}
                onChange={(e) => {
                  const newNiches = e.target.checked
                    ? [...filters.niches, niche]
                    : filters.niches.filter((n) => n !== niche);
                  handleChange('niches', newNiches);
                }}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">{niche}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Minimum Followers
        </label>
        <input
          type="number"
          value={filters.minFollowers || ''}
          onChange={(e) => handleChange('minFollowers', e.target.value ? Number(e.target.value) : undefined)}
          placeholder="Enter minimum followers"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Minimum Engagement Rate (%)
        </label>
        <input
          type="number"
          value={filters.engagementRate || ''}
          onChange={(e) => handleChange('engagementRate', e.target.value ? Number(e.target.value) : undefined)}
          placeholder="Enter minimum engagement rate"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
} 