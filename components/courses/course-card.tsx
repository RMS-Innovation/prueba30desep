import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface CourseCardProps {
  course: {
    id: string
    title: string
    description: string
    instructor_name: string
    price: number
    duration_hours: number
    level: "beginner" | "intermediate" | "advanced"
    category: string
    thumbnail_url?: string
    rating: number
    student_count: number
  }
}

export function CourseCard({ course }: CourseCardProps) {
  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getLevelText = (level: string) => {
    switch (level) {
      case "beginner":
        return "Principiante"
      case "intermediate":
        return "Intermedio"
      case "advanced":
        return "Avanzado"
      default:
        return level
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <Image
          src={course.thumbnail_url || "/placeholder.svg?height=200&width=300&query=dental+course"}
          alt={course.title}
          width={300}
          height={200}
          className="w-full h-48 object-cover"
        />
        <Badge className={`absolute top-2 right-2 ${getLevelColor(course.level)}`}>{getLevelText(course.level)}</Badge>
      </div>

      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <Badge variant="secondary" className="text-xs">
            {course.category}
          </Badge>
          <div className="flex items-center text-sm text-gray-600">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
            {course.rating}
          </div>
        </div>
        <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
        <CardDescription className="line-clamp-2">{course.description}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {course.duration_hours}h
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            {course.student_count} estudiantes
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-2">Por {course.instructor_name}</p>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-purple-600">${course.price}</span>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Link href={`/courses/${course.id}`} className="w-full">
          <Button className="w-full bg-purple-600 hover:bg-purple-700">Ver Curso</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
