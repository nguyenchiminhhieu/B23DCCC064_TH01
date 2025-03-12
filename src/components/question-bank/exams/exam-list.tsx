"use client"

import { useEffect, useState } from "react"
import { useStore } from "@/lib/store"
import { supabase, type Exam } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Trash2, FileDown, Eye } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"

export default function ExamList() {
  const { exams, setExams, deleteExam } = useStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchExams() {
      try {
        setIsLoading(true)
        setError(null)

        const { data, error } = await supabase.from("exams").select("*").order("created_at", { ascending: false })

        if (error) throw error

        setExams(data as Exam[])
      } catch (error) {
        console.error("Error fetching exams:", error)
        setError("Không thể tải danh sách đề thi")
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Không thể tải danh sách đề thi",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchExams()
  }, [setExams, toast])

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("exams").delete().eq("id", id)

      if (error) throw error

      deleteExam(id)
      toast({
        title: "Thành công",
        description: "Đã xóa đề thi",
      })
    } catch (error) {
      console.error("Error deleting exam:", error)
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể xóa đề thi",
      })
    }
  }

  const handleExportPDF = (id: string, title: string) => {
    toast({
      title: "Đang xuất PDF",
      description: "Đang chuẩn bị tải xuống đề thi...",
    })

    // In a real application, this would call a server action to generate and download the PDF
    setTimeout(() => {
      toast({
        title: "Thành công",
        description: "Đã tải xuống đề thi",
      })
    }, 1500)
  }

  if (isLoading) {
    return <div className="text-center py-10">Đang tải dữ liệu...</div>
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Thử lại</Button>
      </div>
    )
  }

  if (exams.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground mb-4">Chưa có đề thi nào</p>
        <Link href="/exams/new">
          <Button>Tạo đề thi đầu tiên</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {exams.map((exam) => (
        <Card key={exam.id} className="transition-all hover:shadow-md">
          <CardHeader>
            <CardTitle>{exam.title}</CardTitle>
            <CardDescription>Tạo ngày: {new Date(exam.created_at).toLocaleDateString("vi-VN")}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-2">{exam.description || "Không có mô tả"}</p>
            <div className="flex gap-2">
              <Badge>10 câu hỏi</Badge>
              <Badge variant="outline">Đã tạo</Badge>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex gap-2">
              <Link href={`/exams/${exam.id}`}>
                <Button variant="outline" size="sm">
                  <Eye className="mr-2 h-4 w-4" />
                  Xem
                </Button>
              </Link>
              <Link href={`/exams/${exam.id}/edit`}>
                <Button variant="outline" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Sửa
                </Button>
              </Link>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => handleExportPDF(exam.id, exam.title)}>
                <FileDown className="mr-2 h-4 w-4" />
                PDF
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(exam.id)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

