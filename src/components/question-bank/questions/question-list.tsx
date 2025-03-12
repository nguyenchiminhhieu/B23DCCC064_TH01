"use client"

import { useEffect, useState } from "react"
import { useStore } from "@/lib/question-bank/store"
import { supabase, type Question, type Subject } from "@/lib/question-bank/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"

export default function QuestionList() {
  const { questions, subjects, setQuestions, setSubjects, deleteQuestion } = useStore()
  const { toast } = useToast()
  const [selectedSubject, setSelectedSubject] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch subjects
        const { data: subjectsData, error: subjectsError } = await supabase.from("subjects").select("*").order("name")

        if (subjectsError) throw subjectsError
        setSubjects(subjectsData as Subject[])

        // Fetch questions
        const { data: questionsData, error: questionsError } = await supabase
          .from("questions")
          .select(`
            *,
            subjects(name)
          `)
          .order("created_at", { ascending: false })

        if (questionsError) throw questionsError
        setQuestions(questionsData as Question[])
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Không thể tải dữ liệu")
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Không thể tải dữ liệu",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [setQuestions, setSubjects, toast])

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("questions").delete().eq("id", id)

      if (error) throw error

      deleteQuestion(id)
      toast({
        title: "Thành công",
        description: "Đã xóa câu hỏi",
      })
    } catch (error) {
      console.error("Error deleting question:", error)
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể xóa câu hỏi",
      })
    }
  }

  const filteredQuestions =
    selectedSubject === "all" ? questions : questions.filter((q) => q.subject_id === selectedSubject)

  const getDifficultyColor = (level: string) => {
    switch (level.toLowerCase()) {
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

  if (questions.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground mb-4">Chưa có câu hỏi nào</p>
        <Link href="/questions/new">
          <Button>Thêm câu hỏi đầu tiên</Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Chọn môn học" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả môn học</SelectItem>
            {subjects.map((subject) => (
              <SelectItem key={subject.id} value={subject.id}>
                {subject.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <p className="text-center py-4 text-muted-foreground">Không có câu hỏi nào cho môn học này</p>
        ) : (
          filteredQuestions.map((question) => (
            <Card key={question.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <div className="flex-1">
                    <span className="text-base font-medium">
                      {question.content.length > 100 ? `${question.content.substring(0, 100)}...` : question.content}
                    </span>
                  </div>
                  <Badge className={`ml-2 ${getDifficultyColor(question.difficulty_level)}`}>
                    {question.difficulty_level}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{question.knowledge_area}</Badge>
                  {question.subjects && <Badge variant="secondary">{(question as any).subjects.name}</Badge>}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link href={`/questions/${question.id}`}>
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Sửa
                  </Button>
                </Link>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(question.id)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xóa
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

