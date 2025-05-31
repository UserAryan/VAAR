import { prisma } from './db'
import { UserType, CampaignStatus, ContentType, ContentStatus } from '@prisma/client'

// User Queries
export const userQueries = {
  // Create a new user
  createUser: async (data: {
    email: string
    name: string
    type: UserType
  }) => {
    return await prisma.user.create({
      data: {
        ...data,
        profile: {
          create: {
            bio: '',
            socialLinks: {},
            metrics: {},
            niches: []
          }
        }
      }
    })
  },

  // Get user with profile
  getUserWithProfile: async (userId: string) => {
    return await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    })
  },

  // Update user profile
  updateProfile: async (userId: string, data: {
    bio?: string
    avatar?: string
    socialLinks?: any
    metrics?: any
    niches?: string[]
  }) => {
    return await prisma.profile.update({
      where: { userId },
      data
    })
  }
}

// Campaign Queries
export const campaignQueries = {
  // Create a new campaign
  createCampaign: async (data: {
    name: string
    description: string
    brandId: string
    startDate: Date
    endDate: Date
    budget: number
    requirements: any
  }) => {
    return await prisma.campaign.create({
      data: {
        ...data,
        status: CampaignStatus.DRAFT
      }
    })
  },

  // Get campaign with content and analytics
  getCampaignDetails: async (campaignId: string) => {
    return await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: {
        content: true,
        analytics: true,
        brand: {
          include: { profile: true }
        }
      }
    })
  },

  // Update campaign status
  updateCampaignStatus: async (campaignId: string, status: CampaignStatus) => {
    return await prisma.campaign.update({
      where: { id: campaignId },
      data: { status }
    })
  }
}

// Content Queries
export const contentQueries = {
  // Create new content
  createContent: async (data: {
    title: string
    description: string
    type: ContentType
    mediaUrl?: string
    userId: string
    campaignId?: string
  }) => {
    return await prisma.content.create({
      data: {
        ...data,
        status: ContentStatus.DRAFT
      }
    })
  },

  // Get content with analytics
  getContentWithAnalytics: async (contentId: string) => {
    return await prisma.content.findUnique({
      where: { id: contentId },
      include: {
        analytics: true,
        user: {
          include: { profile: true }
        }
      }
    })
  },

  // Update content status
  updateContentStatus: async (contentId: string, status: ContentStatus) => {
    return await prisma.content.update({
      where: { id: contentId },
      data: { status }
    })
  }
}

// Analytics Queries
export const analyticsQueries = {
  // Record analytics
  recordAnalytics: async (data: {
    userId: string
    campaignId?: string
    contentId?: string
    metrics: any
    date: Date
  }) => {
    return await prisma.analytics.create({
      data
    })
  },

  // Get user analytics
  getUserAnalytics: async (userId: string, startDate: Date, endDate: Date) => {
    return await prisma.analytics.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        campaign: true,
        content: true
      }
    })
  }
}

// Notification Queries
export const notificationQueries = {
  // Create notification
  createNotification: async (data: {
    userId: string
    type: 'CAMPAIGN_INVITE' | 'CONTENT_APPROVAL' | 'PAYMENT_RECEIVED' | 'SYSTEM_UPDATE'
    message: string
  }) => {
    return await prisma.notification.create({
      data
    })
  },

  // Get user notifications
  getUserNotifications: async (userId: string) => {
    return await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })
  },

  // Mark notification as read
  markNotificationAsRead: async (notificationId: string) => {
    return await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true }
    })
  }
} 