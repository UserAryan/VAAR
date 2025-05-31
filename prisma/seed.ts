import { PrismaClient, UserType, CampaignStatus, ContentType, ContentStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create a brand user
  const brand = await prisma.user.create({
    data: {
      email: 'brand@example.com',
      name: 'Example Brand',
      type: UserType.BRAND,
      profile: {
        create: {
          bio: 'A leading brand in the industry',
          socialLinks: {
            instagram: 'https://instagram.com/examplebrand',
            twitter: 'https://twitter.com/examplebrand'
          },
          metrics: {
            followers: 100000,
            engagement: 3.5
          },
          niches: ['Fashion', 'Lifestyle']
        }
      }
    }
  })

  // Create an influencer user
  const influencer = await prisma.user.create({
    data: {
      email: 'influencer@example.com',
      name: 'Example Influencer',
      type: UserType.INFLUENCER,
      profile: {
        create: {
          bio: 'Lifestyle and fashion content creator',
          socialLinks: {
            instagram: 'https://instagram.com/exampleinfluencer',
            youtube: 'https://youtube.com/exampleinfluencer'
          },
          metrics: {
            followers: 50000,
            engagement: 4.2
          },
          niches: ['Fashion', 'Lifestyle', 'Beauty']
        }
      }
    }
  })

  // Create a campaign
  const campaign = await prisma.campaign.create({
    data: {
      name: 'Summer Collection Launch',
      description: 'Promote our new summer collection',
      brandId: brand.id,
      status: CampaignStatus.ACTIVE,
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-08-31'),
      budget: 5000,
      requirements: {
        platforms: ['Instagram', 'YouTube'],
        contentTypes: ['POST', 'VIDEO'],
        targetAudience: ['Fashion enthusiasts', 'Young adults']
      }
    }
  })

  // Create content
  const content = await prisma.content.create({
    data: {
      title: 'Summer Collection Lookbook',
      description: 'Showcasing the new summer collection',
      type: ContentType.VIDEO,
      mediaUrl: 'https://example.com/video1',
      userId: influencer.id,
      campaignId: campaign.id,
      status: ContentStatus.PUBLISHED
    }
  })

  // Create analytics
  await prisma.analytics.create({
    data: {
      userId: influencer.id,
      campaignId: campaign.id,
      contentId: content.id,
      metrics: {
        views: 10000,
        likes: 500,
        comments: 100,
        shares: 50
      },
      date: new Date()
    }
  })

  // Create notification
  await prisma.notification.create({
    data: {
      userId: influencer.id,
      type: 'CAMPAIGN_INVITE',
      message: 'You have been invited to participate in the Summer Collection Launch campaign'
    }
  })

  console.log('Seed data created successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 