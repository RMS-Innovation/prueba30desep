import { Redis } from "@upstash/redis"
import { dbConfig } from "../config"

export class RedisAdapter {
  private client: Redis

  constructor() {
    this.client = new Redis({
      url: dbConfig.redis.url,
      token: dbConfig.redis.token,
    })
  }

  // Session management
  async setSession(sessionId: string, sessionData: any, ttl = 86400) {
    await this.client.setex(`session:${sessionId}`, ttl, JSON.stringify(sessionData))
  }

  async getSession(sessionId: string) {
    const data = await this.client.get(`session:${sessionId}`)
    return data ? JSON.parse(data as string) : null
  }

  async deleteSession(sessionId: string) {
    await this.client.del(`session:${sessionId}`)
  }

  // Caching
  async setCache(key: string, data: any, ttl = 3600) {
    await this.client.setex(key, ttl, JSON.stringify(data))
  }

  async getCache(key: string) {
    const data = await this.client.get(key)
    return data ? JSON.parse(data as string) : null
  }

  async deleteCache(key: string) {
    await this.client.del(key)
  }

  // Real-time features
  async publishMessage(channel: string, message: any) {
    await this.client.publish(channel, JSON.stringify(message))
  }

  // Rate limiting
  async checkRateLimit(key: string, limit: number, window: number) {
    const current = await this.client.incr(key)

    if (current === 1) {
      await this.client.expire(key, window)
    }

    return {
      count: current,
      remaining: Math.max(0, limit - current),
      resetTime: Date.now() + window * 1000,
    }
  }

  // Leaderboards
  async addToLeaderboard(leaderboard: string, member: string, score: number) {
    await this.client.zadd(leaderboard, { score, member })
  }

  async getLeaderboard(leaderboard: string, start = 0, end = 9) {
    return await this.client.zrevrange(leaderboard, start, end, {
      withScores: true,
    })
  }
}
