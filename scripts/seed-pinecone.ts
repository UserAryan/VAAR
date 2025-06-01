require('dotenv').config();
// @ts-nocheck
const { PrismaClient } = require('@prisma/client');
const { vectorOperations, createProfileEmbedding } = require('../src/lib/pinecone');

interface UserWithProfile {
  id: string;
  type: string;
  profile: {
    bio: string | null;
    niches: string[];
    metrics: any;
  } | null;
}

interface Metrics {
  followers?: number;
  engagementRate?: number;
  [key: string]: any;
}

const prisma = new PrismaClient();

async function seedPinecone() {
  try {
    console.log('Fetching users from database...');
    const users = await prisma.user.findMany({
      include: {
        profile: true
      }
    }) as UserWithProfile[];

    console.log(`Found ${users.length} users. Creating vectors...`);

    for (const user of users) {
      if (!user.profile) {
        console.log(`Skipping user ${user.id} - no profile found`);
        continue;
      }

      try {
        // Parse metrics from JSON
        const metrics = (user.profile.metrics as Metrics) || {};
        const followers = metrics.followers || 0;
        const engagementRate = metrics.engagementRate || 0;

        console.log(`Creating embedding for user ${user.id}...`);
        const embedding = await createProfileEmbedding({
          bio: user.profile.bio || '',
          niches: user.profile.niches,
          metrics: {
            followers,
            engagementRate
          }
        });

        console.log(`Upserting vector for user ${user.id}...`);
        await vectorOperations.upsertVector(user.id, embedding, {
          type: user.type,
          userId: user.id,
          niches: user.profile.niches,
          followers,
          engagementRate
        });

        console.log(`Successfully processed user ${user.id}`);
      } catch (error) {
        console.error(`Error processing user ${user.id}:`, error);
        continue; // Continue with next user even if one fails
      }
    }

    console.log('Pinecone seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding Pinecone:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
  process.exit(1);
});

seedPinecone(); 