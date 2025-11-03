// Progress tracking utility using localStorage
// This can be easily migrated to Supabase later

export interface VideoProgress {
  videoId: number
  watchedSeconds: number
  totalSeconds: number
  completed: boolean
  lastPosition: number
}

export interface QuizProgress {
  quizId: number
  completed: boolean
  score: number
  totalQuestions: number
  answers: Record<number, number> // questionId -> selectedAnswerId
  attempts: number
  lastAttemptAt: string
}

export interface CourseProgress {
  courseId: number
  currentVideoId: number | null
  currentModuleId: number | null
  currentQuizId: number | null
  progressPercentage: number
  completedVideos: number[]
  completedQuizzes: number[]
  videoProgress: Record<number, VideoProgress>
  quizProgress: Record<number, QuizProgress>
  lastAccessedAt: string
  timeSpentMinutes: number
}

const STORAGE_KEY = "course_progress"

// Get all course progress data
export function getAllProgress(): Record<number, CourseProgress> {
  if (typeof window === "undefined") return {}

  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : {}
  } catch (error) {
    console.error("[v0] Error reading progress:", error)
    return {}
  }
}

// Get progress for a specific course
export function getCourseProgress(courseId: number): CourseProgress | null {
  const allProgress = getAllProgress()
  return allProgress[courseId] || null
}

export function initializeCourseProgress(courseId: number, firstVideoId: number): CourseProgress {
  const progress: CourseProgress = {
    courseId,
    currentVideoId: firstVideoId,
    currentModuleId: null,
    currentQuizId: null,
    progressPercentage: 0,
    completedVideos: [],
    completedQuizzes: [],
    videoProgress: {},
    quizProgress: {},
    lastAccessedAt: new Date().toISOString(),
    timeSpentMinutes: 0,
  }

  saveCourseProgress(progress)
  return progress
}

// Save course progress
export function saveCourseProgress(progress: CourseProgress): void {
  if (typeof window === "undefined") return

  try {
    const allProgress = getAllProgress()
    allProgress[progress.courseId] = {
      ...progress,
      lastAccessedAt: new Date().toISOString(),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress))
  } catch (error) {
    console.error("[v0] Error saving progress:", error)
  }
}

// Update video progress
export function updateVideoProgress(
  courseId: number,
  videoId: number,
  watchedSeconds: number,
  totalSeconds: number,
  completed = false,
): void {
  const progress = getCourseProgress(courseId)
  if (!progress) return

  // Asegurar que las propiedades existan
  if (!progress.videoProgress) {
    progress.videoProgress = {}
  }
  if (!progress.completedVideos) {
    progress.completedVideos = []
  }

  progress.videoProgress[videoId] = {
    videoId,
    watchedSeconds,
    totalSeconds,
    completed,
    lastPosition: watchedSeconds,
  }

  // Mark as completed if watched more than 90%
  if (watchedSeconds / totalSeconds > 0.9 && !progress.completedVideos.includes(videoId)) {
    progress.completedVideos.push(videoId)
    progress.videoProgress[videoId].completed = true
  }

  progress.currentVideoId = videoId

  saveCourseProgress(progress)
}

// Helper function to get total content items for consistent progress calculation
export function getTotalContentItems(courseId: number, courseData?: any): number {
  // If course data is provided, count from it
  if (courseData?.modules) {
    return courseData.modules.reduce((sum: number, module: any) => sum + (module.content?.length || 0), 0)
  }

  // Otherwise, try to get from stored progress
  const progress = getCourseProgress(courseId)
  if (!progress) return 0

  // Count unique items from both videos and quizzes
  const totalVideos = progress.videoProgress ? Object.keys(progress.videoProgress).length : 0
  const totalQuizzes = progress.quizProgress ? Object.keys(progress.quizProgress).length : 0
  const completedTotal = (progress.completedVideos?.length || 0) + (progress.completedQuizzes?.length || 0)

  // Return the maximum to account for all content
  return Math.max(totalVideos + totalQuizzes, completedTotal)
}

export function calculateProgressPercentage(courseId: number, totalItems?: number): number {
  const progress = getCourseProgress(courseId)
  if (!progress) return 0

  // Usar operador de encadenamiento opcional para evitar errores
  const completedVideosCount = progress.completedVideos?.length || 0
  const completedQuizzesCount = progress.completedQuizzes?.length || 0
  const completedItems = completedVideosCount + completedQuizzesCount

  // If totalItems is provided, use it; otherwise calculate from progress data
  const total = totalItems || getTotalContentItems(courseId)

  if (total === 0) return 0

  return Math.round((completedItems / total) * 100)
}

// Get video progress
export function getVideoProgress(courseId: number, videoId: number): VideoProgress | null {
  if (videoId === undefined || videoId === null) {
    console.error("[v0] getVideoProgress called with invalid videoId:", videoId)
    return null
  }

  const progress = getCourseProgress(courseId)
  if (!progress || !progress.videoProgress) return null

  return progress.videoProgress[videoId] || null
}

// Check if course has been started
export function hasCourseStarted(courseId: number): boolean {
  return getCourseProgress(courseId) !== null
}

// Get resume position for a course
export function getResumePosition(courseId: number): { videoId: number; position: number } | null {
  const progress = getCourseProgress(courseId)
  if (!progress || !progress.currentVideoId || !progress.videoProgress) return null

  const videoProgress = progress.videoProgress[progress.currentVideoId]
  return {
    videoId: progress.currentVideoId,
    position: videoProgress?.lastPosition || 0,
  }
}

export function updateQuizProgress(
  courseId: number,
  quizId: number,
  answers: Record<number, number>,
  score: number,
  totalQuestions: number,
  passingScore: number,
): void {
  const progress = getCourseProgress(courseId)
  if (!progress) return

  // Asegurar que las propiedades existan
  if (!progress.quizProgress) {
    progress.quizProgress = {}
  }
  if (!progress.completedQuizzes) {
    progress.completedQuizzes = []
  }

  const existingQuizProgress = progress.quizProgress[quizId]
  const attempts = existingQuizProgress ? existingQuizProgress.attempts + 1 : 1

  progress.quizProgress[quizId] = {
    quizId,
    completed: score >= passingScore,
    score,
    totalQuestions,
    answers,
    attempts,
    lastAttemptAt: new Date().toISOString(),
  }

  // Mark as completed if passed
  if (progress.quizProgress[quizId].completed && !progress.completedQuizzes.includes(quizId)) {
    progress.completedQuizzes.push(quizId)
  }

  progress.currentQuizId = quizId

  saveCourseProgress(progress)
}

export function getQuizProgress(courseId: number, quizId: number): QuizProgress | null {
  if (quizId === undefined || quizId === null) {
    console.error("[v0] getQuizProgress called with invalid quizId:", quizId)
    return null
  }

  const progress = getCourseProgress(courseId)
  if (!progress || !progress.quizProgress) return null

  return progress.quizProgress[quizId] || null
}

export function markQuizCompleted(courseId: number, quizId: number): void {
  const progress = getCourseProgress(courseId)
  if (!progress) return

  // Asegurar que las propiedades existan
  if (!progress.completedQuizzes) {
    progress.completedQuizzes = []
  }
  if (!progress.quizProgress) {
    progress.quizProgress = {}
  }

  if (!progress.completedQuizzes.includes(quizId)) {
    progress.completedQuizzes.push(quizId)
  }

  if (progress.quizProgress[quizId]) {
    progress.quizProgress[quizId].completed = true
  }

  saveCourseProgress(progress)
}

// Mark video as completed
export function markVideoCompleted(courseId: number, videoId: number): void {
  const progress = getCourseProgress(courseId)
  if (!progress) return

  // Asegurar que las propiedades existan
  if (!progress.completedVideos) {
    progress.completedVideos = []
  }
  if (!progress.videoProgress) {
    progress.videoProgress = {}
  }

  if (!progress.completedVideos.includes(videoId)) {
    progress.completedVideos.push(videoId)
  }

  if (progress.videoProgress[videoId]) {
    progress.videoProgress[videoId].completed = true
  }

  saveCourseProgress(progress)
}

// Función adicional para asegurar que un CourseProgress tenga todas las propiedades necesarias
export function ensureCourseProgressStructure(progress: CourseProgress): CourseProgress {
  return {
    ...progress,
    completedVideos: progress.completedVideos || [],
    completedQuizzes: progress.completedQuizzes || [],
    videoProgress: progress.videoProgress || {},
    quizProgress: progress.quizProgress || {},
    currentVideoId: progress.currentVideoId || null,
    currentModuleId: progress.currentModuleId || null,
    currentQuizId: progress.currentQuizId || null,
    progressPercentage: progress.progressPercentage || 0,
    lastAccessedAt: progress.lastAccessedAt || new Date().toISOString(),
    timeSpentMinutes: progress.timeSpentMinutes || 0,
  }
}