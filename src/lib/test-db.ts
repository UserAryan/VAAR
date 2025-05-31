import { userQueries, campaignQueries, contentQueries, analyticsQueries, notificationQueries } from './db-queries'

async function testDatabase() {
  try {
    // Test creating a new user
    console.log('Creating a new user...')
    const newUser = await userQueries.createUser({
      email: 'test@example.com',
      name: 'Test User',
      type: 'INFLUENCER'
    })
    console.log('Created user:', newUser)

    // Test getting user profile
    console.log('\nGetting user profile...')
    const userProfile = await userQueries.getUserWithProfile(newUser.id)
    console.log('User profile:', userProfile)

    // Test updating profile
    console.log('\nUpdating user profile...')
    const updatedProfile = await userQueries.updateProfile(newUser.id, {
      bio: 'Test bio',
      socialLinks: {
        instagram: 'https://instagram.com/testuser'
      },
      niches: ['Testing', 'Development']
    })
    console.log('Updated profile:', updatedProfile)

    // Test creating a campaign
    console.log('\nCreating a new campaign...')
    const newCampaign = await campaignQueries.createCampaign({
      name: 'Test Campaign',
      description: 'A test campaign',
      brandId: newUser.id,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      budget: 1000,
      requirements: {
        platforms: ['Instagram'],
        contentTypes: ['POST'],
        targetAudience: ['Testers']
      }
    })
    console.log('Created campaign:', newCampaign)

    // Test creating content
    console.log('\nCreating new content...')
    const newContent = await contentQueries.createContent({
      title: 'Test Content',
      description: 'A test content piece',
      type: 'POST',
      userId: newUser.id,
      campaignId: newCampaign.id
    })
    console.log('Created content:', newContent)

    // Test recording analytics
    console.log('\nRecording analytics...')
    const newAnalytics = await analyticsQueries.recordAnalytics({
      userId: newUser.id,
      campaignId: newCampaign.id,
      contentId: newContent.id,
      metrics: {
        views: 100,
        likes: 10,
        comments: 5
      },
      date: new Date()
    })
    console.log('Recorded analytics:', newAnalytics)

    // Test creating notification
    console.log('\nCreating notification...')
    const newNotification = await notificationQueries.createNotification({
      userId: newUser.id,
      type: 'CAMPAIGN_INVITE',
      message: 'You have been invited to a test campaign'
    })
    console.log('Created notification:', newNotification)

    console.log('\nAll tests completed successfully!')
  } catch (error) {
    console.error('Error testing database:', error)
  }
}

// Run the tests
testDatabase() 