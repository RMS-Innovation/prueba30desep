"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  MessageSquare,
  Search,
  Plus,
  ThumbsUp,
  MessageCircle,
  Eye,
  Pin,
  CheckCircle2,
  Clock,
  TrendingUp,
} from "lucide-react"
import { StudentAvatar } from "@/components/ui/student-avatar"
import Link from "next/link"

interface ForumPost {
  id: string
  title: string
  content: string
  authorName: string
  authorAvatar?: string
  courseTitle: string
  courseId: string
  createdAt: Date
  replies: number
  likes: number
  views: number
  isPinned: boolean
  isResolved: boolean
  tags: string[]
}

export default function StudentForumsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCourse, setFilterCourse] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    courseId: "",
    tags: "",
  })

  const mockPosts: ForumPost[] = [
    {
      id: "1",
      title: "¿Cuál es la mejor técnica para preparación de conductos?",
      content:
        "Estoy estudiando diferentes técnicas de preparación de conductos radiculares y me gustaría conocer sus experiencias...",
      authorName: "María González",
      courseTitle: "Técnicas de Endodoncia",
      courseId: "2",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      replies: 12,
      likes: 24,
      views: 156,
      isPinned: true,
      isResolved: false,
      tags: ["endodoncia", "técnicas", "conductos"],
    },
    {
      id: "2",
      title: "Duda sobre anatomía del primer molar superior",
      content: "Tengo una pregunta sobre la anatomía radicular del primer molar superior. ¿Alguien puede ayudarme?",
      authorName: "Carlos Ruiz",
      courseTitle: "Anatomía Dental Avanzada",
      courseId: "1",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      replies: 8,
      likes: 15,
      views: 89,
      isPinned: false,
      isResolved: true,
      tags: ["anatomía", "molares"],
    },
    {
      id: "3",
      title: "Recomendaciones de materiales para prostodoncia digital",
      content: "¿Qué materiales recomiendan para trabajar con prostodoncia digital? Estoy empezando en este campo...",
      authorName: "Ana López",
      courseTitle: "Prostodoncia Digital",
      courseId: "3",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      replies: 20,
      likes: 35,
      views: 234,
      isPinned: false,
      isResolved: false,
      tags: ["prostodoncia", "materiales", "digital"],
    },
  ]

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setPosts(mockPosts)
      } catch (error) {
        console.error("Error loading forum posts:", error)
        setPosts(mockPosts)
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [])

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCourse = filterCourse === "all" || post.courseId === filterCourse
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "resolved" && post.isResolved) ||
      (filterStatus === "unresolved" && !post.isResolved)

    return matchesSearch && matchesCourse && matchesStatus
  })

  const handleCreatePost = async () => {
    if (!newPost.title || !newPost.content || !newPost.courseId) {
      return
    }

    // TODO: Implement API call to create post
    console.log("Creating post:", newPost)
    setIsCreateDialogOpen(false)
    setNewPost({ title: "", content: "", courseId: "", tags: "" })
  }

  const getTimeAgo = (date: Date) => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userRole="student" />

      <div className="md:ml-64">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <StudentAvatar size="lg" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Foros de Discusión</h1>
                  <p className="text-gray-600">Comparte conocimientos y resuelve dudas con la comunidad</p>
                </div>
              </div>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-purple-800 hover:bg-purple-900">
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Discusión
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Crear Nueva Discusión</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="course">Curso</Label>
                      <Select
                        value={newPost.courseId}
                        onValueChange={(value) => setNewPost({ ...newPost, courseId: value })}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Selecciona un curso" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Anatomía Dental Avanzada</SelectItem>
                          <SelectItem value="2">Técnicas de Endodoncia</SelectItem>
                          <SelectItem value="3">Prostodoncia Digital</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="title">Título</Label>
                      <Input
                        id="title"
                        placeholder="¿Cuál es tu pregunta o tema?"
                        value={newPost.title}
                        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="content">Descripción</Label>
                      <Textarea
                        id="content"
                        placeholder="Describe tu pregunta o tema en detalle..."
                        value={newPost.content}
                        onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                        rows={6}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="tags">Etiquetas (separadas por comas)</Label>
                      <Input
                        id="tags"
                        placeholder="endodoncia, técnicas, materiales"
                        value={newPost.tags}
                        onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                        className="mt-2"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleCreatePost} className="bg-purple-800 hover:bg-purple-900">
                        Publicar Discusión
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Discusiones</p>
                    <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
                  </div>
                  <MessageSquare className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Mis Respuestas</p>
                    <p className="text-2xl font-bold text-gray-900">24</p>
                  </div>
                  <MessageCircle className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Resueltas</p>
                    <p className="text-2xl font-bold text-gray-900">{posts.filter((p) => p.isResolved).length}</p>
                  </div>
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Más Activas</p>
                    <p className="text-2xl font-bold text-gray-900">{posts.filter((p) => p.replies > 10).length}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar discusiones..."
                  className="w-full pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterCourse} onValueChange={setFilterCourse}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filtrar por curso" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los cursos</SelectItem>
                  <SelectItem value="1">Anatomía Dental</SelectItem>
                  <SelectItem value="2">Endodoncia</SelectItem>
                  <SelectItem value="3">Prostodoncia</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="resolved">Resueltas</SelectItem>
                  <SelectItem value="unresolved">Sin resolver</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Forum Posts */}
          <div className="space-y-4">
            {filteredPosts.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron discusiones</h3>
                  <p className="text-gray-600 mb-4">Intenta ajustar tus filtros o crea una nueva discusión</p>
                  <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-purple-800 hover:bg-purple-900">
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Discusión
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-800 font-semibold text-lg">{post.authorName.charAt(0)}</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              {post.isPinned && <Pin className="w-4 h-4 text-purple-600" />}
                              {post.isResolved && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                              <Link
                                href={`/dashboard/student/forums/${post.id}`}
                                className="text-lg font-semibold text-gray-900 hover:text-purple-800 transition-colors"
                              >
                                {post.title}
                              </Link>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">{post.content}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="font-medium text-gray-700">{post.authorName}</span>
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
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center space-x-2">
                            {post.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center">
                              <ThumbsUp className="w-4 h-4 mr-1" />
                              {post.likes}
                            </span>
                            <span className="flex items-center">
                              <MessageCircle className="w-4 h-4 mr-1" />
                              {post.replies}
                            </span>
                            <span className="flex items-center">
                              <Eye className="w-4 h-4 mr-1" />
                              {post.views}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
