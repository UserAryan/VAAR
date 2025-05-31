import { Pinecone } from '@pinecone-database/pinecone'

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || '',
  environment: process.env.PINECONE_ENVIRONMENT || ''
})

export const vectorSearch = {
  // Initialize index
  index: pinecone.Index('influencerflow'),

  // Create user vector
  createUserVector: async (userId: string, vector: number[], metadata: any) => {
    await pinecone.Index('influencerflow').upsert([{
      id: userId,
      values: vector,
      metadata
    }])
  },

  // Search similar users
  searchSimilarUsers: async (vector: number[], topK: number = 10) => {
    const results = await pinecone.Index('influencerflow').query({
      vector,
      topK,
      includeMetadata: true
    })
    return results.matches
  },

  // Update user vector
  updateUserVector: async (userId: string, vector: number[], metadata: any) => {
    await pinecone.Index('influencerflow').update({
      id: userId,
      values: vector,
      metadata
    })
  },

  // Delete user vector
  deleteUserVector: async (userId: string) => {
    await pinecone.Index('influencerflow').deleteOne(userId)
  }
}

export default pinecone 