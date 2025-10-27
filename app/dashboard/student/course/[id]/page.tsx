"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Clock, Award } from "lucide-react"
import { VideoPlayer } from "@/components/course/video-player"
import { QuizViewer, type Quiz } from "@/components/course/quiz-viewer"
import { ContentList } from "@/components/course/content-list"
import {
  getCourseProgress,
  initializeCourseProgress,
  updateVideoProgress,
  markVideoCompleted,
  updateQuizProgress,
  getQuizProgress,
  calculateProgressPercentage,
  getVideoProgress,
} from "@/lib/progress-tracker"

interface ContentItem {
  id: number
  type: "video" | "quiz"
  title: string
  duration?: string
  videoUrl?: string
  durationSeconds?: number
  quiz?: Quiz
  questionCount?: number
  completed: boolean
  locked: boolean
}

interface CourseData {
  id: number
  title: string
  description: string
  instructor: string
  modules: Array<{
    id: number
    title: string
    content: ContentItem[]
  }>
}

export default function CoursePage() {
  const params = useParams()
  const router = useRouter()
  const courseId = Number.parseInt(params.id as string)

  const [courseData, setCourseData] = useState<CourseData | null>(null)
  const [currentContentId, setCurrentContentId] = useState<number | null>(null)
  const [currentContentType, setCurrentContentType] = useState<"video" | "quiz">("video")
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(true)

  const mockCourseData: Record<number, CourseData> = {
    1: {
      id: 1,
      title: "Anatomía Dental Avanzada",
      description: "Curso completo sobre anatomía dental con casos clínicos reales",
      instructor: "Dr. María González",
      modules: [
        {
          id: 1,
          title: "Módulo 1: Introducción a la Anatomía Dental",
          content: [
            {
              id: 1,
              type: "video",
              title: "Bienvenida al curso",
              duration: "5:30",
              videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
              durationSeconds: 330,
              completed: false,
              locked: false,
            },
            {
              id: 2,
              type: "video",
              title: "Conceptos básicos de anatomía dental",
              duration: "12:45",
              videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
              durationSeconds: 765,
              completed: false,
              locked: false,
            },
            {
              id: 1,
              type: "quiz",
              title: "Evaluación: Conceptos Básicos",
              questionCount: 3,
              completed: false,
              locked: false,
              quiz: {
                id: 1,
                title: "Evaluación: Conceptos Básicos",
                description: "Evalúa tu comprensión de los conceptos básicos de anatomía dental",
                passingScore: 2,
                questions: [
                  {
                    id: 1,
                    question: "¿Cuántos dientes tiene un adulto completo?",
                    options: [
                      { id: 1, text: "28 dientes" },
                      { id: 2, text: "32 dientes" },
                      { id: 3, text: "30 dientes" },
                      { id: 4, text: "26 dientes" },
                    ],
                    correctAnswerId: 2,
                    explanation: "Un adulto tiene 32 dientes en total, incluyendo las muelas del juicio.",
                  },
                  {
                    id: 2,
                    question: "¿Qué parte del diente es visible en la boca?",
                    options: [
                      { id: 1, text: "La raíz" },
                      { id: 2, text: "La corona" },
                      { id: 3, text: "La pulpa" },
                      { id: 4, text: "El cemento" },
                    ],
                    correctAnswerId: 2,
                    explanation: "La corona es la parte visible del diente que está cubierta por esmalte.",
                  },
                  {
                    id: 3,
                    question: "¿Cuál es el tejido más duro del cuerpo humano?",
                    options: [
                      { id: 1, text: "El hueso" },
                      { id: 2, text: "La dentina" },
                      { id: 3, text: "El esmalte dental" },
                      { id: 4, text: "El cartílago" },
                    ],
                    correctAnswerId: 3,
                    explanation: "El esmalte dental es el tejido más duro y mineralizado del cuerpo humano.",
                  },
                ],
              },
            },
            {
              id: 3,
              type: "video",
              title: "Nomenclatura dental internacional",
              duration: "8:20",
              videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
              durationSeconds: 500,
              completed: false,
              locked: false,
            },
          ],
        },
        {
          id: 2,
          title: "Módulo 2: Anatomía de Dientes Anteriores",
          content: [
            {
              id: 4,
              type: "video",
              title: "Incisivos centrales superiores",
              duration: "15:10",
              videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
              durationSeconds: 910,
              completed: false,
              locked: false,
            },
            {
              id: 5,
              type: "video",
              title: "Incisivos laterales y caninos",
              duration: "18:30",
              videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
              durationSeconds: 1110,
              completed: false,
              locked: false,
            },
            {
              id: 2,
              type: "quiz",
              title: "Evaluación: Dientes Anteriores",
              questionCount: 2,
              completed: false,
              locked: false,
              quiz: {
                id: 2,
                title: "Evaluación: Dientes Anteriores",
                description: "Evalúa tu conocimiento sobre la anatomía de los dientes anteriores",
                passingScore: 2,
                questions: [
                  {
                    id: 1,
                    question: "¿Cuál es la función principal de los incisivos?",
                    options: [
                      { id: 1, text: "Triturar alimentos" },
                      { id: 2, text: "Cortar alimentos" },
                      { id: 3, text: "Desgarrar alimentos" },
                      { id: 4, text: "Moler alimentos" },
                    ],
                    correctAnswerId: 2,
                    explanation: "Los incisivos están diseñados principalmente para cortar los alimentos.",
                  },
                  {
                    id: 2,
                    question: "¿Cuántos incisivos tiene un adulto?",
                    options: [
                      { id: 1, text: "4 incisivos" },
                      { id: 2, text: "6 incisivos" },
                      { id: 3, text: "8 incisivos" },
                      { id: 4, text: "10 incisivos" },
                    ],
                    correctAnswerId: 3,
                    explanation: "Un adulto tiene 8 incisivos en total: 4 superiores y 4 inferiores.",
                  },
                ],
              },
            },
          ],
        },
      ],
    },
    2: {
      id: 2,
      title: "Técnicas de Endodoncia",
      description: "Aprende las técnicas más avanzadas en endodoncia moderna",
      instructor: "Dr. Carlos Ruiz",
      modules: [
        {
          id: 1,
          title: "Módulo 1: Fundamentos de Endodoncia",
          content: [
            {
              id: 1,
              type: "video",
              title: "Introducción a la endodoncia",
              duration: "10:00",
              videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
              durationSeconds: 600,
              completed: false,
              locked: false,
            },
          ],
        },
      ],
    },
  }

  useEffect(() => {
    const loadCourse = async () => {
      setLoading(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 500))

        const course = mockCourseData[courseId]
        if (!course) {
          router.push("/dashboard/student/courses")
          return
        }

        let courseProgress = getCourseProgress(courseId)
        if (!courseProgress) {
          const firstContent = course.modules[0]?.content[0]
          if (firstContent) {
            courseProgress = initializeCourseProgress(courseId, firstContent.id)
          }
        }

        const updatedCourse = {
          ...course,
          modules: course.modules.map((module) => ({
            ...module,
            content: module.content.map((item) => {
              if (!item || !item.id) {
                console.error("[v0] Invalid content item:", item)
                return item
              }

              if (item.type === "video") {
                const videoProgress = getVideoProgress(courseId, item.id)
                return { ...item, completed: videoProgress?.completed || false }
              } else if (item.type === "quiz") {
                const quizProgress = getQuizProgress(courseId, item.id)
                return { ...item, completed: quizProgress?.completed || false }
              }
              return item
            }),
          })),
        }

        setCourseData(updatedCourse)

        const totalItems = updatedCourse.modules.reduce((sum, module) => sum + module.content.length, 0)

        setCurrentContentId(courseProgress?.currentVideoId || updatedCourse.modules[0]?.content[0]?.id || null)
        setCurrentContentType(updatedCourse.modules[0]?.content[0]?.type || "video")
        setProgress(calculateProgressPercentage(courseId, totalItems))
      } catch (error) {
        console.error("[v0] Error loading course:", error)
      } finally {
        setLoading(false)
      }
    }

    loadCourse()
  }, [courseId, router])

  const handleVideoProgress = (currentTime: number, duration: number) => {
    if (!currentContentId || currentContentType !== "video") return

    updateVideoProgress(courseId, currentContentId, currentTime, duration)

    const totalItems = courseData?.modules.reduce((sum, module) => sum + module.content.length, 0) || 0
    const newProgress = calculateProgressPercentage(courseId, totalItems)
    setProgress(newProgress)
  }

  const handleVideoComplete = () => {
    if (!currentContentId || !courseData || currentContentType !== "video") return

    markVideoCompleted(courseId, currentContentId)

    setCourseData({
      ...courseData,
      modules: courseData.modules.map((module) => ({
        ...module,
        content: module.content.map((item) =>
          item.id === currentContentId && item.type === "video" ? { ...item, completed: true } : item,
        ),
      })),
    })

    const totalItems = courseData.modules.reduce((sum, module) => sum + module.content.length, 0)
    const newProgress = calculateProgressPercentage(courseId, totalItems)
    setProgress(newProgress)

    // Auto-advance to next content
    const allContent = courseData.modules.flatMap((m) => m.content)
    const currentIndex = allContent.findIndex((c) => c.id === currentContentId && c.type === currentContentType)
    if (currentIndex < allContent.length - 1) {
      const nextContent = allContent[currentIndex + 1]
      setCurrentContentId(nextContent.id)
      setCurrentContentType(nextContent.type)
    }
  }

  const handleQuizComplete = (score: number, answers: Record<number, number>) => {
    if (!currentContentId || !courseData || currentContentType !== "quiz") return

    const currentQuiz = courseData.modules
      .flatMap((m) => m.content)
      .find((c) => c.id === currentContentId && c.type === "quiz")

    if (!currentQuiz?.quiz) return

    updateQuizProgress(
      courseId,
      currentContentId,
      answers,
      score,
      currentQuiz.quiz.questions.length,
      currentQuiz.quiz.passingScore,
    )

    const quizProgress = getQuizProgress(courseId, currentContentId)

    setCourseData({
      ...courseData,
      modules: courseData.modules.map((module) => ({
        ...module,
        content: module.content.map((item) =>
          item.id === currentContentId && item.type === "quiz"
            ? { ...item, completed: quizProgress?.completed || false }
            : item,
        ),
      })),
    })

    const totalItems = courseData.modules.reduce((sum, module) => sum + module.content.length, 0)
    const newProgress = calculateProgressPercentage(courseId, totalItems)
    setProgress(newProgress)
  }

  const handleContentSelect = (contentId: number, contentType: "video" | "quiz") => {
    setCurrentContentId(contentId)
    setCurrentContentType(contentType)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar userRole="student" />
        <div className="md:ml-64">
          <div className="p-6">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!courseData) {
    return null
  }

  const currentContent = courseData.modules
    .flatMap((m) => m.content)
    .find((c) => c.id === currentContentId && c.type === currentContentType)

  const videoProgress =
    currentContentId && currentContentType === "video" ? getVideoProgress(courseId, currentContentId) : null
  const quizProgress =
    currentContentId && currentContentType === "quiz" ? getQuizProgress(courseId, currentContentId) : null

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userRole="student" />

      <div className="md:ml-64">
        <div className="p-6">
          <div className="mb-6">
            <Button variant="ghost" onClick={() => router.push("/dashboard/student/courses")} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Mis Cursos
            </Button>

            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{courseData.title}</h1>
                <p className="text-gray-600 mb-2">{courseData.description}</p>
                <p className="text-sm text-gray-500">Instructor: {courseData.instructor}</p>
              </div>
              <Badge className="bg-purple-600">{progress}% Completado</Badge>
            </div>

            <Progress value={progress} className="h-2" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {currentContent && (
                <>
                  {currentContent.type === "video" && currentContent.videoUrl && (
                    <>
                      <VideoPlayer
                        videoUrl={currentContent.videoUrl}
                        onProgress={handleVideoProgress}
                        onComplete={handleVideoComplete}
                        initialPosition={videoProgress?.lastPosition || 0}
                        autoPlay={false}
                      />

                      <Card>
                        <CardHeader>
                          <CardTitle>{currentContent.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {currentContent.duration}
                            </div>
                            {currentContent.completed && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                <Award className="h-3 w-3 mr-1" />
                                Completado
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}

                  {currentContent.type === "quiz" && currentContent.quiz && (
                    <QuizViewer
                      quiz={currentContent.quiz}
                      onComplete={handleQuizComplete}
                      savedAnswers={quizProgress?.answers}
                      savedScore={quizProgress?.score}
                    />
                  )}
                </>
              )}
            </div>

            <div className="lg:col-span-1">
              <ContentList
                modules={courseData.modules}
                currentContentId={currentContentId || 0}
                currentContentType={currentContentType}
                onContentSelect={handleContentSelect}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
