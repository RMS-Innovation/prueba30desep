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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, Search, CheckCircle, XCircle, Eye, Star } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Instructor {
  id: string
  user_id: string
  instructor_code: string
  specialization: string
  status: string
  is_verified: boolean
  total_courses_created: number
  total_students_taught: number
  average_rating: number
  users: {
    email: string
    first_name: string
    last_name: string
    profile_image_url: string | null
  }
}

interface InstructorsTableProps {
  instructors: Instructor[]
  onViewInstructor: (instructorId: string) => void
  onApprove: (instructorId: string) => void
  onReject: (instructorId: string) => void
}

export function InstructorsTable({ instructors, onViewInstructor, onApprove, onReject }: InstructorsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredInstructors = instructors.filter((instructor) => {
    const matchesSearch =
      instructor.users.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${instructor.users.first_name} ${instructor.users.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.specialization.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || instructor.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="default" className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
            Approved
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="default" className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">
            Pending
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="default" className="bg-red-500/10 text-red-500 hover:bg-red-500/20">
            Rejected
          </Badge>
        )
      case "suspended":
        return (
          <Badge variant="default" className="bg-orange-500/10 text-orange-500 hover:bg-orange-500/20">
            Suspended
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search instructors by name, email, or specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Instructor</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Specialization</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Courses</TableHead>
              <TableHead>Students</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInstructors.map((instructor) => (
              <TableRow key={instructor.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={instructor.users.profile_image_url || "/placeholder.svg"} />
                      <AvatarFallback>
                        {instructor.users.first_name[0]}
                        {instructor.users.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {instructor.users.first_name} {instructor.users.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">{instructor.users.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm text-muted-foreground">{instructor.instructor_code}</TableCell>
                <TableCell>{instructor.specialization}</TableCell>
                <TableCell>{getStatusBadge(instructor.status)}</TableCell>
                <TableCell className="text-muted-foreground">{instructor.total_courses_created}</TableCell>
                <TableCell className="text-muted-foreground">{instructor.total_students_taught}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span className="text-sm font-medium">{instructor.average_rating.toFixed(1)}</span>
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
                      <DropdownMenuItem onClick={() => onViewInstructor(instructor.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      {instructor.status === "pending" && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onApprove(instructor.id)}>
                            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onReject(instructor.id)}>
                            <XCircle className="mr-2 h-4 w-4 text-red-500" />
                            Reject
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredInstructors.length === 0 && (
        <div className="flex h-32 items-center justify-center text-muted-foreground">
          No instructors found matching your criteria.
        </div>
      )}
    </div>
  )
}
