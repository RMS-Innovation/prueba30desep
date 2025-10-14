"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Search, Eye, CheckCircle, XCircle, Star, Users } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"

interface Course {
  id: string
  title: string
  description: string
  thumbnail_url: string | null
  price: number
  is_published: boolean
  is_featured: boolean
  difficulty_level: string
  total_enrollments: number
  average_rating: number
  total_reviews: number
  instructors: {
    users: {
      first_name: string
      last_name: string
    }
  }
  categories: {
    name: string
  } | null
}

interface CoursesTableProps {
  courses: Course[]
  onViewCourse: (courseId: string) => void
  onApproveCourse: (courseId: string) => void
  onRejectCourse: (courseId: string) => void
  onToggleFeatured: (courseId: string, isFeatured: boolean) => void
}

export function CoursesTable({
  courses,
  onViewCourse,
  onApproveCourse,
  onRejectCourse,
  onToggleFeatured,
}: CoursesTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all")

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "published" && course.is_published) ||
      (statusFilter === "draft" && !course.is_published) ||
      (statusFilter === "featured" && course.is_featured)

    const matchesDifficulty = difficultyFilter === "all" || course.difficulty_level === difficultyFilter

    return matchesSearch && matchesStatus && matchesDifficulty
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="featured">Featured</SelectItem>
          </SelectContent>
        </Select>
        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
            <SelectItem value="expert">Expert</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Course</TableHead>
              <TableHead>Instructor</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Enrollments</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCourses.map((course) => (
              <TableRow key={course.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-16 overflow-hidden rounded-md bg-muted">
                      {course.thumbnail_url ? (
                        <Image
                          src={course.thumbnail_url || "/placeholder.svg"}
                          alt={course.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="max-w-[300px]">
                      <p className="font-medium line-clamp-1">{course.title}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">{course.description}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {course.instructors.users.first_name} {course.instructors.users.last_name}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{course.categories?.name || "Uncategorized"}</Badge>
                </TableCell>
                <TableCell className="font-mono">${course.price.toFixed(2)}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {course.is_published ? (
                      <Badge variant="default" className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                        Published
                      </Badge>
                    ) : (
                      <Badge variant="default" className="bg-gray-500/10 text-gray-500 hover:bg-gray-500/20">
                        Draft
                      </Badge>
                    )}
                    {course.is_featured && (
                      <Badge variant="default" className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">
                        Featured
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {course.total_enrollments}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span className="text-sm font-medium">{course.average_rating.toFixed(1)}</span>
                    <span className="text-xs text-muted-foreground">({course.total_reviews})</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onViewCourse(course.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {!course.is_published && (
                        <DropdownMenuItem onClick={() => onApproveCourse(course.id)}>
                          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                          Approve & Publish
                        </DropdownMenuItem>
                      )}
                      {course.is_published && (
                        <DropdownMenuItem onClick={() => onRejectCourse(course.id)}>
                          <XCircle className="mr-2 h-4 w-4 text-red-500" />
                          Unpublish
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => onToggleFeatured(course.id, !course.is_featured)}>
                        <Star className="mr-2 h-4 w-4" />
                        {course.is_featured ? "Remove from Featured" : "Mark as Featured"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredCourses.length === 0 && (
        <div className="flex h-32 items-center justify-center text-muted-foreground">
          No courses found matching your criteria.
        </div>
      )}
    </div>
  )
}
