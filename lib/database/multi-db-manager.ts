import { SQLAdapter } from "./adapters/sql-adapter"
import { MongoDBAdapter } from "./adapters/mongodb-adapter"
import { RedisAdapter } from "./adapters/redis-adapter"

export class MultiDBManager {
  public sql: SQLAdapter
  public mongodb: MongoDBAdapter
  public redis: RedisAdapter

  constructor() {
    this.sql = new SQLAdapter()
    this.mongodb = new MongoDBAdapter()
    this.redis = new RedisAdapter()
  }

  async initialize() {
    try {
      await this.mongodb.connect()
      console.log("[v0] Multi-database system initialized successfully")
    } catch (error) {
      console.error("[v0] Error initializing databases:", error)
      throw error
    }
  }

  async cleanup() {
    try {
      await this.mongodb.disconnect()
      console.log("[v0] Database connections closed")
    } catch (error) {
      console.error("[v0] Error closing database connections:", error)
    }
  }

  // High-level operations that use multiple databases
  async authenticateUser(email: string, password: string) {
    // Check cache first
    const cacheKey = `auth:${email}`
    let user = await this.redis.getCache(cacheKey)

    if (!user) {
      // Get from SQL database
      user = await this.sql.getUserByEmail(email)
      if (user) {
        // Cache for 5 minutes
        await this.redis.setCache(cacheKey, user, 300)
      }
    }

    return user
  }

  async getStudentDashboardData(studentId: string) {
    // Get basic profile from SQL
    const profile = await this.sql.getStudentProfile(studentId)

    // Get progress from MongoDB
    const progress = await this.mongodb.getStudentProgress(studentId)

    // Get recent activity from cache
    const recentActivity = await this.redis.getCache(`activity:${studentId}`)

    return {
      profile,
      progress,
      recentActivity: recentActivity || [],
    }
  }

  async enrollStudentInCourse(studentId: string, courseId: string) {
    // Create enrollment in SQL
    const enrollment = await this.sql.enrollStudent(studentId, courseId)

    // Initialize progress tracking in MongoDB
    await this.mongodb.saveStudentProgress(studentId, courseId, {
      completedLessons: [],
      currentLesson: null,
      timeSpent: 0,
      startedAt: new Date(),
    })

    // Clear relevant caches
    await this.redis.deleteCache(`enrollments:${studentId}`)

    return enrollment
  }

  async saveStudentActivity(studentId: string, activity: any) {
    // Save detailed activity in MongoDB
    await this.mongodb.saveLearningAnalytics({
      studentId,
      activity,
      type: "student_activity",
    })

    // Update recent activity cache
    const recentKey = `activity:${studentId}`
    let recent = (await this.redis.getCache(recentKey)) || []
    recent.unshift(activity)
    recent = recent.slice(0, 10) // Keep only last 10 activities

    await this.redis.setCache(recentKey, recent, 3600)
  }
}

// Singleton instance
export const dbManager = new MultiDBManager()
