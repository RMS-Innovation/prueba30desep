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
import { MoreHorizontal, Search, Eye, Download, XCircle, CheckCircle, LinkIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatDistanceToNow, format } from "date-fns"

interface Certificate {
  id: string
  certificate_number: string
  issued_at: string
  is_valid: boolean
  revoked_at: string | null
  revoked_reason: string | null
  verification_token: string
  students: {
    users: {
      email: string
      first_name: string
      last_name: string
    }
  }
  courses: {
    title: string
  }
}

interface CertificatesTableProps {
  certificates: Certificate[]
  onViewCertificate: (certificateId: string) => void
  onDownloadCertificate: (certificateId: string) => void
  onRevokeCertificate: (certificateId: string) => void
  onVerifyCertificate: (certificateId: string) => void
}

export function CertificatesTable({
  certificates,
  onViewCertificate,
  onDownloadCertificate,
  onRevokeCertificate,
  onVerifyCertificate,
}: CertificatesTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredCertificates = certificates.filter((certificate) => {
    const matchesSearch =
      certificate.certificate_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      certificate.students.users.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${certificate.students.users.first_name} ${certificate.students.users.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      certificate.courses.title.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "valid" && certificate.is_valid) ||
      (statusFilter === "revoked" && !certificate.is_valid)

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by certificate number, student, or course..."
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
            <SelectItem value="valid">Valid</SelectItem>
            <SelectItem value="revoked">Revoked</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Certificate Number</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Issued Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCertificates.map((certificate) => (
              <TableRow key={certificate.id}>
                <TableCell>
                  <div>
                    <p className="font-mono font-medium">{certificate.certificate_number}</p>
                    <p className="text-xs text-muted-foreground">
                      Token: {certificate.verification_token.slice(0, 8)}...
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">
                      {certificate.students.users.first_name} {certificate.students.users.last_name}
                    </p>
                    <p className="text-sm text-muted-foreground">{certificate.students.users.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="max-w-[300px] line-clamp-2">{certificate.courses.title}</p>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm">{format(new Date(certificate.issued_at), "MMM d, yyyy")}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(certificate.issued_at), { addSuffix: true })}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  {certificate.is_valid ? (
                    <Badge variant="default" className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                      Valid
                    </Badge>
                  ) : (
                    <div className="space-y-1">
                      <Badge variant="default" className="bg-red-500/10 text-red-500 hover:bg-red-500/20">
                        Revoked
                      </Badge>
                      {certificate.revoked_reason && (
                        <p className="text-xs text-muted-foreground">{certificate.revoked_reason}</p>
                      )}
                    </div>
                  )}
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
                      <DropdownMenuItem onClick={() => onViewCertificate(certificate.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDownloadCertificate(certificate.id)}>
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onVerifyCertificate(certificate.id)}>
                        <LinkIcon className="mr-2 h-4 w-4" />
                        Copy Verification Link
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {certificate.is_valid ? (
                        <DropdownMenuItem onClick={() => onRevokeCertificate(certificate.id)}>
                          <XCircle className="mr-2 h-4 w-4 text-red-500" />
                          Revoke Certificate
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => onVerifyCertificate(certificate.id)}>
                          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                          Restore Certificate
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredCertificates.length === 0 && (
        <div className="flex h-32 items-center justify-center text-muted-foreground">
          No certificates found matching your criteria.
        </div>
      )}
    </div>
  )
}
