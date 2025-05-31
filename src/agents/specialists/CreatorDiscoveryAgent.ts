import { Search } from 'lucide-react';
import { Agent, Task } from '../base/Agent';

interface Creator {
  id: string;
  name: string;
  handle: string;
  platform: 'youtube' | 'instagram';
  niche: string;
  followers: number;
  engagement: string;
  avgViews: number;
  location: string;
  rate: number;
  score: number;
}

interface SearchCriteria {
  niche?: string;
  minFollowers?: number;
  maxBudget?: number;
  platform?: string;
}

export class CreatorDiscoveryAgent extends Agent {
  private creatorDatabase: Creator[];

  constructor() {
    super(
      'Creator Discovery Agent', 
      'creator_discovery', 
      ['DISCOVER_CREATORS', 'SEARCH_INFLUENCERS', 'PROFILE_ANALYSIS'],
      Search
    );
    this.creatorDatabase = this.generateMockCreators();
  }

  private generateMockCreators(): Creator[] {
    const creators: Creator[] = [];
    const niches = ['Tech', 'Fashion', 'Food', 'Travel', 'Fitness', 'Gaming', 'Beauty', 'Lifestyle'];
    const platforms = ['youtube', 'instagram'] as const;
    
    for (let i = 0; i < 50; i++) {
      creators.push({
        id: `creator_${i}`,
        name: `Creator ${i + 1}`,
        handle: `@creator${i + 1}`,
        platform: platforms[Math.floor(Math.random() * platforms.length)],
        niche: niches[Math.floor(Math.random() * niches.length)],
        followers: Math.floor(Math.random() * 900000 + 10000),
        engagement: (Math.random() * 8 + 2).toFixed(1), // 2-10%
        avgViews: Math.floor(Math.random() * 50000 + 5000),
        location: ['US', 'UK', 'India', 'Canada', 'Australia'][Math.floor(Math.random() * 5)],
        rate: Math.floor(Math.random() * 5000 + 500),
        score: Math.floor(Math.random() * 30 + 70) // 70-100
      });
    }
    return creators;
  }

  async executeTask(task: Task) {
    const { criteria } = task.payload as { criteria: SearchCriteria };
    
    // Simulate API calls to YouTube and Instagram
    await this.searchYouTubeCreators(criteria);
    await this.searchInstagramCreators(criteria);
    
    // Filter creators based on criteria
    let filtered = this.creatorDatabase.filter(creator => {
      if (criteria.niche && creator.niche.toLowerCase() !== criteria.niche.toLowerCase()) return false;
      if (criteria.minFollowers && creator.followers < criteria.minFollowers) return false;
      if (criteria.maxBudget && creator.rate > criteria.maxBudget) return false;
      if (criteria.platform && creator.platform !== criteria.platform) return false;
      return true;
    });

    // Sort by relevance score
    filtered = filtered.sort((a, b) => b.score - a.score).slice(0, 10);

    return {
      creators: filtered,
      totalFound: filtered.length,
      searchCriteria: criteria,
      platforms: ['YouTube', 'Instagram'],
      message: `Found ${filtered.length} relevant creators matching your criteria`
    };
  }

  private async searchYouTubeCreators(criteria: SearchCriteria): Promise<void> {
    // Simulate YouTube Data API call
    console.log('Searching YouTube creators...', criteria);
    return new Promise(resolve => setTimeout(resolve, 500));
  }

  private async searchInstagramCreators(criteria: SearchCriteria): Promise<void> {
    // Simulate Instagram Graph API call  
    console.log('Searching Instagram creators...', criteria);
    return new Promise(resolve => setTimeout(resolve, 500));
  }
} 