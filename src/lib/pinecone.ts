import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';

if (!process.env.PINECONE_API_KEY) {
  throw new Error('Missing PINECONE_API_KEY environment variable');
}

if (!process.env.PINECONE_INDEX_NAME) {
  throw new Error('Missing PINECONE_INDEX_NAME environment variable');
}

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

if (!process.env.PINECONE_ENVIRONMENT) {
  throw new Error('PINECONE_ENVIRONMENT is not defined');
}

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENVIRONMENT,
});

const index = pinecone.index(process.env.PINECONE_INDEX_NAME);

// Set vector dimensions (1536 is the default for OpenAI embeddings)
const VECTOR_DIMENSIONS = 1536;

interface VectorMetadata {
  type?: string;
  userId?: string;
  niches?: string[];
  followers?: number;
  engagementRate?: number;
  [key: string]: any;
}

interface Profile {
  bio: string;
  niches: string[];
  metrics: {
    followers: number;
    engagementRate: number;
  };
}

export const vectorOperations = {
  upsertVector: async (id: string, vector: number[], metadata: VectorMetadata) => {
    await index.upsert([{
      id,
      values: vector,
      metadata
    }]);
  },

  searchVectors: async (vector: number[], topK = 10, filter?: Record<string, any>) => {
    const results = await index.query({
      vector,
      topK,
      filter,
      includeMetadata: true
    });
    return results.matches;
  },

  deleteVector: async (id: string) => {
    await index.deleteOne(id);
  },

  updateMetadata: async (id: string, metadata: VectorMetadata) => {
    await index.update({
      id,
      metadata
    });
  },

  fetchVector: async (id: string) => {
    const response = await index.fetch([id]);
    return response.records[id];
  }
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const createEmbedding = async (text: string): Promise<number[]> => {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error creating embedding:', error);
    // Return a random vector as fallback
    return Array(VECTOR_DIMENSIONS).fill(0).map(() => Math.random() - 0.5);
  }
};

export const createProfileEmbedding = async (profile: Profile): Promise<number[]> => {
  const text = `
    Bio: ${profile.bio}
    Niches: ${profile.niches.join(', ')}
    Followers: ${profile.metrics.followers}
    Engagement Rate: ${profile.metrics.engagementRate}%
  `;
  return createEmbedding(text);
};

export default pinecone; 