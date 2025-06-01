import { NextResponse } from 'next/server';
import { vectorOperations, createEmbedding } from '@/lib/pinecone';
import { db } from '@/lib/db';

interface SearchFilters {
  type: 'INFLUENCER' | 'BRAND' | 'ALL';
  minFollowers?: number;
  niches: string[];
  engagementRate?: number;
}

async function POST(req: Request) {
  try {
    const { query, type = 'user', topK = 10, filters } = await req.json();

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    // Create embedding for the search query
    const embedding = await createEmbedding(query);

    // Search for similar vectors
    const searchResults = await vectorOperations.searchVectors(embedding, topK, {
      type: filters?.type === 'ALL' ? undefined : filters?.type,
      ...(filters?.niches?.length > 0 && {
        niches: { $in: filters.niches }
      }),
      ...(filters?.minFollowers && {
        followers: { $gte: filters.minFollowers }
      }),
      ...(filters?.engagementRate && {
        engagementRate: { $gte: filters.engagementRate }
      })
    });

    // If searching for users, enrich the results with user data
    if (type === 'user') {
      const enrichedResults = await Promise.all(
        searchResults.map(async (result) => {
          if (!result.metadata?.userId) {
            return result;
          }

          const user = await db.user.findUnique({
            where: { id: result.metadata.userId },
            include: {
              profile: true
            }
          });

          return {
            ...result,
            user: user ? {
              ...user,
              profile: user.profile || {
                bio: '',
                niches: [],
                followers: 0,
                engagementRate: 0
              }
            } : undefined
          };
        })
      );

      return NextResponse.json(enrichedResults);
    }

    return NextResponse.json(searchResults);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export { POST }; 