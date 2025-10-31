"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ThumbsUp, MessageCircle, Eye, Clock, CheckCircle2, Award } from "lucide-react"
import Link from "next/link"
import {
  getPostById,
  getRepliesByTopicId,
  createReply,
  toggleLikePost,
  toggleLikeReply,
  toggleResolvePost,
  markReplyAsSolution,
  getCurrentUser,
  type ForumPost,
  type ForumReply,
} from "@/lib/forum-storage"

export default function ForumDetailPage() {
  const params = useParams()
  const router = useRouter()
  const postId = params.id as string

  const [post, setPost] = useState<ForumPost | null>(null)
  const [replies, setReplies] = useState<ForumReply[]>([])
  const [loading, setLoading] = useState(true)
  const [replyContent, setReplyContent] = useState("")
  const [currentUser] = useState(getCurrentUser())

  const loadPostAndReplies = () => {
    setLoading(true)
    try {
      const postData = getPostById(postId)
      if (!postData) {
        router.push("/dashboard/student/forums")
        return
      }
      setPost(postData)

      const repliesData = getRepliesByTopicId(postId)
      setReplies(repliesData)
    } catch (error) {
      console.error("Error loading post:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPostAndReplies()
  }, [postId])

  const handleSubmitReply = () => {
    if (!replyContent.trim()) {
      alert("Por favor escribe una respuesta")
      return
    }

    createReply({
      topicId: postId,
      content: replyContent,
      authorName: currentUser,
      isSolution: false,
    })

    setReplyContent("")
    loadPostAndReplies()
  }

  const handleLikePost = () => {
    toggleLikePost(postId, currentUser)
    loadPostAndReplies()
  }

  const handleLikeReply = (replyId: string) => {
    toggleLikeReply(replyId, currentUser)
    loadPostAndReplies()
  }

  const handleMarkAsSolution = (replyId: string) => {
    markReplyAsSolution(replyId, postId)
    loadPostAndReplies()
  }

  const handleToggleResolve = () => {
    toggleResolvePost(postId)
    loadPostAndReplies()
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
    if (seconds < 60) return "hace un momento"
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `hace ${minutes} minuto${minutes > 1 ? "s" : ""}`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `hace ${hours} hora${hours > 1 ? "s" : ""}`
    const days = Math.floor(hours / 24)
    return `hace ${days} día${days > 1 ? "s" : ""}`
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

  if (!post) {
    return null
  }

  const isLikedByCurrentUser = post.likedBy.includes(currentUser)

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userRole="student" />

      <div className="md:ml-64">
        <div className="p-6 max-w-5xl mx-auto">
          {/* Back Button */}
          <Link href="/dashboard/student/forums">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Foros
            </Button>
          </Link>

          {/* Post Card */}
          <Card className="mb-6">
            <CardContent className="p-8">
              <div className="flex items-start space-x-4 mb-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-800 font-semibold text-2xl">{post.authorName.charAt(0)}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {post.isResolved && (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Resuelta
                      </Badge>
                    )}
                    <h1 className="text-2xl font-bold text-gray-900">{post.title}</h1>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                    <span className="font-medium text-gray-900">{post.authorName}</span>
                    <span>•</span>
                    <Link
                      href={`/dashboard/student/course/${post.courseId}`}
                      className="text-purple-600 hover:text-purple-800"
                    >
                      {post.courseTitle}
                    </Link>
                    <span>•</span>
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {getTimeAgo(post.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap mb-4">{post.content}</p>
                  <div className="flex items-center space-x-2 mb-4">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center space-x-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLikePost}
                      className={isLikedByCurrentUser ? "text-purple-600" : ""}
                    >
                      <ThumbsUp className={`w-4 h-4 mr-2 ${isLikedByCurrentUser ? "fill-current" : ""}`} />
                      {post.likes}
                    </Button>
                    <span className="flex items-center text-sm text-gray-600">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      {post.replies} respuestas
                    </span>
                    <span className="flex items-center text-sm text-gray-600">
                      <Eye className="w-4 h-4 mr-2" />
                      {post.views} vistas
                    </span>
                    <Button variant="outline" size="sm" onClick={handleToggleResolve}>
                      {post.isResolved ? "Marcar como no resuelta" : "Marcar como resuelta"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Replies Section */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{replies.length} Respuestas</h2>
            <div className="space-y-4">
              {replies.map((reply) => {
                const isLiked = reply.likedBy.includes(currentUser)
                return (
                  <Card key={reply.id} className={reply.isSolution ? "border-2 border-green-500" : ""}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-800 font-semibold text-lg">{reply.authorName.charAt(0)}</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-gray-900">{reply.authorName}</span>
                              {reply.isSolution && (
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                  <Award className="w-3 h-3 mr-1" />
                                  Solución
                                </Badge>
                              )}
                            </div>
                            <span className="text-sm text-gray-500 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {getTimeAgo(reply.createdAt)}
                            </span>
                          </div>
                          <p className="text-gray-700 whitespace-pre-wrap mb-3">{reply.content}</p>
                          <div className="flex items-center space-x-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleLikeReply(reply.id)}
                              className={isLiked ? "text-purple-600" : ""}
                            >
                              <ThumbsUp className={`w-4 h-4 mr-1 ${isLiked ? "fill-current" : ""}`} />
                              {reply.likes}
                            </Button>
                            {!reply.isSolution && !post.isResolved && (
                              <Button variant="outline" size="sm" onClick={() => handleMarkAsSolution(reply.id)}>
                                <Award className="w-4 h-4 mr-1" />
                                Marcar como solución
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Reply Form */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tu Respuesta</h3>
              <Textarea
                placeholder="Escribe tu respuesta aquí..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={6}
                className="mb-4"
              />
              <div className="flex justify-end">
                <Button onClick={handleSubmitReply} className="bg-purple-800 hover:bg-purple-900">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Publicar Respuesta
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
