import { faker } from '@faker-js/faker';

// Helper function to generate random data with realistic patterns
const generateTimeSeriesData = (days: number, baseValue: number, variance: number) => {
  return Array.from({ length: days }, (_, i) => {
    const trend = Math.sin(i / days * Math.PI) * variance;
    const noise = (Math.random() - 0.5) * variance * 0.2;
    return Math.max(0, baseValue + trend + noise);
  });
};

// Generate mock campaign data
export const mockCampaigns = [
  {
    id: 'campaign-1',
    name: 'Summer Product Launch',
    metrics: {
      engagement: {
        likes: generateTimeSeriesData(30, 5000, 2000),
        comments: generateTimeSeriesData(30, 500, 200),
        shares: generateTimeSeriesData(30, 200, 100),
      },
      reach: {
        impressions: generateTimeSeriesData(30, 50000, 20000),
        uniqueViewers: generateTimeSeriesData(30, 25000, 10000),
      },
      conversion: {
        clicks: generateTimeSeriesData(30, 1000, 500),
        purchases: generateTimeSeriesData(30, 100, 50),
      },
      demographics: {
        ageGroups: [
          { range: '18-24', percentage: 35 },
          { range: '25-34', percentage: 45 },
          { range: '35-44', percentage: 15 },
          { range: '45+', percentage: 5 },
        ],
        gender: [
          { type: 'Male', percentage: 40 },
          { type: 'Female', percentage: 55 },
          { type: 'Other', percentage: 5 },
        ],
        locations: [
          { city: 'New York', percentage: 25 },
          { city: 'Los Angeles', percentage: 20 },
          { city: 'Chicago', percentage: 15 },
          { city: 'Miami', percentage: 10 },
          { city: 'Other', percentage: 30 },
        ],
      },
      roi: {
        investment: 10000,
        revenue: 25000,
        profit: 15000,
        roi: 150,
      },
    },
  },
  {
    id: 'campaign-2',
    name: 'Holiday Special',
    metrics: {
      engagement: {
        likes: generateTimeSeriesData(30, 8000, 3000),
        comments: generateTimeSeriesData(30, 800, 300),
        shares: generateTimeSeriesData(30, 400, 200),
      },
      reach: {
        impressions: generateTimeSeriesData(30, 80000, 30000),
        uniqueViewers: generateTimeSeriesData(30, 40000, 15000),
      },
      conversion: {
        clicks: generateTimeSeriesData(30, 2000, 800),
        purchases: generateTimeSeriesData(30, 200, 100),
      },
      demographics: {
        ageGroups: [
          { range: '18-24', percentage: 40 },
          { range: '25-34', percentage: 40 },
          { range: '35-44', percentage: 15 },
          { range: '45+', percentage: 5 },
        ],
        gender: [
          { type: 'Male', percentage: 45 },
          { type: 'Female', percentage: 50 },
          { type: 'Other', percentage: 5 },
        ],
        locations: [
          { city: 'New York', percentage: 30 },
          { city: 'Los Angeles', percentage: 25 },
          { city: 'Chicago', percentage: 15 },
          { city: 'Miami', percentage: 10 },
          { city: 'Other', percentage: 20 },
        ],
      },
      roi: {
        investment: 15000,
        revenue: 45000,
        profit: 30000,
        roi: 200,
      },
    },
  },
];

// Helper functions for analytics calculations
export const calculateMetrics = {
  // Calculate engagement rate
  engagementRate: (likes: number[], comments: number[], shares: number[], impressions: number[]) => {
    return likes.map((like, i) => {
      const totalEngagement = like + comments[i] + shares[i];
      return (totalEngagement / impressions[i]) * 100;
    });
  },

  // Calculate conversion rate
  conversionRate: (purchases: number[], clicks: number[]) => {
    return purchases.map((purchase, i) => (purchase / clicks[i]) * 100);
  },

  // Calculate average engagement per post
  averageEngagement: (likes: number[], comments: number[], shares: number[]) => {
    const total = likes.reduce((a, b) => a + b, 0) +
                 comments.reduce((a, b) => a + b, 0) +
                 shares.reduce((a, b) => a + b, 0);
    return total / likes.length;
  },

  // Calculate growth rate
  growthRate: (values: number[]) => {
    return values.map((value, i) => {
      if (i === 0) return 0;
      return ((value - values[i - 1]) / values[i - 1]) * 100;
    });
  },
}; 