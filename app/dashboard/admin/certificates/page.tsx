import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CertificatesTable } from "@/components/admin/certificates-table"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Award, CheckCircle, XCircle, TrendingUp } from "lucide-react"

async function getCertificates() {
  const supabase = await getSupabaseServerClient()

  const { data: certificates, error } = await supabase
    .from("certificates")
    .select(`
      *,
      students (
        users (
          email,
          first_name,
          last_name
        )
      ),
      courses (
        title
      )
    `)
    .order("issued_at", { ascending: false })

  if (error) {
    console.error("Error fetching certificates:", error)
    return []
  }

  return certificates || []
}

export default async function CertificatesPage() {
  const certificates = await getCertificates()

  const totalCertificates = certificates.length
  const validCertificates = certificates.filter((c: any) => c.is_valid).length
  const revokedCertificates = certificates.filter((c: any) => !c.is_valid).length

  // Calculate certificates issued this month
  const thisMonth = new Date()
  thisMonth.setDate(1)
  thisMonth.setHours(0, 0, 0, 0)
  const thisMonthCertificates = certificates.filter((c: any) => new Date(c.issued_at) >= thisMonth).length

  const handleViewCertificate = (certificateId: string) => {
    console.log("[v0] View certificate:", certificateId)
  }

  const handleDownloadCertificate = (certificateId: string) => {
    console.log("[v0] Download certificate:", certificateId)
  }

  const handleRevokeCertificate = (certificateId: string) => {
    console.log("[v0] Revoke certificate:", certificateId)
  }

  const handleVerifyCertificate = (certificateId: string) => {
    console.log("[v0] Verify certificate:", certificateId)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Certificate Management</h1>
        <p className="text-muted-foreground">Manage, verify, and revoke digital certificates</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Issued</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCertificates}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valid</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{validCertificates}</div>
            <p className="text-xs text-muted-foreground">Active certificates</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revoked</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{revokedCertificates}</div>
            <p className="text-xs text-muted-foreground">Invalidated</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{thisMonthCertificates}</div>
            <p className="text-xs text-muted-foreground">Recently issued</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>All Certificates</CardTitle>
          <CardDescription>View, verify, download, and manage all issued certificates</CardDescription>
        </CardHeader>
        <CardContent>
          <CertificatesTable
            certificates={certificates}
            onViewCertificate={handleViewCertificate}
            onDownloadCertificate={handleDownloadCertificate}
            onRevokeCertificate={handleRevokeCertificate}
            onVerifyCertificate={handleVerifyCertificate}
          />
        </CardContent>
      </Card>
    </div>
  )
}
