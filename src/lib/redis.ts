import { Redis } from 'ioredis'

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000)
    return delay
  }
})

export const cache = {
  // Cache user data
  setUser: async (userId: string, data: any, ttl: number = 3600) => {
    await redis.set(`user:${userId}`, JSON.stringify(data), 'EX', ttl)
  },

  // Get cached user data
  getUser: async (userId: string) => {
    const data = await redis.get(`user:${userId}`)
    return data ? JSON.parse(data) : null
  },

  // Cache campaign data
  setCampaign: async (campaignId: string, data: any, ttl: number = 3600) => {
    await redis.set(`campaign:${campaignId}`, JSON.stringify(data), 'EX', ttl)
  },

  // Get cached campaign data
  getCampaign: async (campaignId: string) => {
    const data = await redis.get(`campaign:${campaignId}`)
    return data ? JSON.parse(data) : null
  },

  // Queue for async tasks
  queue: {
    add: async (queueName: string, data: any) => {
      await redis.lpush(queueName, JSON.stringify(data))
    },
    process: async (queueName: string) => {
      const data = await redis.rpop(queueName)
      return data ? JSON.parse(data) : null
    }
  }
}

export default redis 