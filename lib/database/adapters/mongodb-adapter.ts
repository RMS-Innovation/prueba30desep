import { MongoClient, type Db } from "mongodb"
import { dbConfig } from "../config"

export class MongoDBAdapter {
  private client: MongoClient
  private db: Db

  constructor() {
    this.client = new MongoClient(dbConfig.mongodb.uri)
  }

  async connect() {
    await this.client.connect()
    this.db = this.client.db(dbConfig.mongodb.database)
  }

  async disconnect() {
    await this.client.close()
  }

  // Course content operations (flexible documents)
  async saveCourseContent(courseId: string, content: any) {
    const collection = this.db.collection("course_contents")

    const document = {
      courseId,
      content,
      version: content.version || 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await collection.insertOne(document)
    return result
  }

  async getCourseContent(courseId: string) {
    const collection = this.db.collection("course_contents")
    return await collection.findOne({ courseId })
  }

  // Student progress tracking (flexible structure)
  async saveStudentProgress(studentId: string, courseId: string, progress: any) {
    const collection = this.db.collection("student_progress")

    const document = {
      studentId,
      courseId,
      progress,
      lastAccessed: new Date(),
      completedLessons: progress.completedLessons || [],
      currentLesson: progress.currentLesson || null,
      timeSpent: progress.timeSpent || 0,
      quizScores: progress.quizScores || [],
      notes: progress.notes || [],
    }

    await collection.replaceOne({ studentId, courseId }, document, { upsert: true })

    return document
  }

  async getStudentProgress(studentId: string, courseId?: string) {
    const collection = this.db.collection("student_progress")

    const filter: any = { studentId }
    if (courseId) filter.courseId = courseId

    if (courseId) {
      return await collection.findOne(filter)
    } else {
      return await collection.find(filter).toArray()
    }
  }

  // Learning analytics (complex nested data)
  async saveLearningAnalytics(data: any) {
    const collection = this.db.collection("learning_analytics")

    const document = {
      ...data,
      timestamp: new Date(),
      processed: false,
    }

    return await collection.insertOne(document)
  }

  // Forum discussions (nested comments)
  async saveForumPost(courseId: string, post: any) {
    const collection = this.db.collection("forum_posts")

    const document = {
      courseId,
      ...post,
      createdAt: new Date(),
      updatedAt: new Date(),
      replies: [],
      likes: 0,
      views: 0,
    }

    return await collection.insertOne(document)
  }

  async getForumPosts(courseId: string) {
    const collection = this.db.collection("forum_posts")
    return await collection.find({ courseId }).sort({ createdAt: -1 }).toArray()
  }

  // Notifications (flexible structure)
  async saveNotification(userId: string, notification: any) {
    const collection = this.db.collection("notifications")

    const document = {
      userId,
      ...notification,
      createdAt: new Date(),
      read: false,
      delivered: false,
    }

    return await collection.insertOne(document)
  }

  async getUserNotifications(userId: string, unreadOnly = false) {
    const collection = this.db.collection("notifications")

    const filter: any = { userId }
    if (unreadOnly) filter.read = false

    return await collection.find(filter).sort({ createdAt: -1 }).toArray()
  }
}
