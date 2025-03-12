"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Edit, FileDown, Printer } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import type { Exam } from "@/lib/question-bank/supabase"

interface ExamDetailProps {
  exam: Exam
  examQuestions: any[]
}

export default function ExamDetail({ exam, examQuestions }: ExamDetailProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isExporting, setIsExporting] = useState(false)

  const handleExportPDF = () => {
    setIsExporting(true)
    toast({
      title: "Đang xuất PDF",
      description: "Đang chuẩn bị tải xuống đề thi...",
    })

    // In a real application, this would call a server action to generate and download the PDF
    setTimeout(() => {
      setIsExporting(false)
      toast({
        title: "Thành công",
        description: "Đã tải xuống đề thi",
      })
    }, 1500)
  }

  const handlePrint = () => {
    window.print()
  }

  const getDifficultyColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "dễ":
        return "bg-green-100 text-green-800"
      case "trung bình":
        return "bg-blue-100 text-blue-800"
      case "khó":
        return "bg-orange-100 text-orange-800"
      case "rất khó":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Group questions by difficulty for statistics
  const questionsByDifficulty: Record<string, number> = {}
  examQuestions.forEach((eq) => {
    const difficulty = eq.questions.difficulty_level
    questionsByDifficulty[difficulty] = (questionsByDifficulty[difficulty] || 0) + 1
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{exam.title}</h1>
          <p className="text-muted-foreground">Tạo ngày: {new Date(exam.created_at).toLocaleDateString("vi-VN")}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            In
          </Button>
          <Button variant="outline" onClick={handleExportPDF} disabled={isExporting}>
            <FileDown className="mr-2 h-4 w-4" />
            {isExporting ? "Đang xuất..." : "Xuất PDF"}
          </Button>
          <Link href={`/exams/${exam.id}/edit`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin đề thi</CardTitle>
          {exam.description && <CardDescription>{exam.description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Tổng số câu hỏi</p>
              <p className="text-2xl font-bold">{examQuestions.length}</p>
            </div>

            {Object.entries(questionsByDifficulty).map(([difficulty, count]) => (
              <div key={difficulty} className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  <Badge className={getDifficultyColor(difficulty)}>{difficulty}</Badge>
                </p>
                <p className="text-2xl font-bold">{count} câu</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6 print:space-y-4">
        <h2 className="text-xl font-bold">Nội dung đề thi</h2>

        <div className="space-y-6 print:space-y-4">
          {examQuestions.map((eq, index) => (
            <div key={eq.id} className="space-y-2 print:space-y-1">
              <div className="flex items-start gap-2">
                <span className="font-bold">{index + 1}.</span>
                <div className="flex-1">
                  <p>{eq.questions.content}</p>
                  <div className="flex gap-2 mt-2 print:hidden">
                    <Badge className={getDifficultyColor(eq.questions.difficulty_level)}>
                      {eq.questions.difficulty_level}
                    </Badge>
                    {eq.questions.subjects && <Badge variant="outline">{eq.questions.subjects.name}</Badge>}
                    {eq.questions.knowledge_area && <Badge variant="secondary">{eq.questions.knowledge_area}</Badge>}
                  </div>
                </div>
              </div>
              {index < examQuestions.length - 1 && <Separator className="my-4 print:my-2" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

