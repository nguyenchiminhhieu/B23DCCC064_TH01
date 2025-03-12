"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { supabase, type Question } from "@/lib/question-bank/supabase"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"

export default function SearchResults() {
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([])

  const subject = searchParams.get("subject")
  const difficulty = searchParams.get("difficulty")
  const knowledge = searchParams.get("knowledge")
  const query = searchParams.get("q")

  useEffect(() => {
    async function fetchQuestions() {
      try {
        setIsLoading(true)
        setError(null)

        let queryBuilder = supabase.from("questions").select(`
            *,
            subjects(name)
          `)

        // Apply filters
        if (subject && subject !== "all") {
          queryBuilder = queryBuilder.eq("subject_id", subject)
        }

        if (difficulty) {
          const difficultyLevels = difficulty.split(",")
          queryBuilder = queryBuilder.in("difficulty_level", difficultyLevels)
        }

        if (knowledge) {
          queryBuilder = queryBuilder.eq("knowledge_area", knowledge)
        }

        // Apply text search if provided
        if (query) {
          queryBuilder = queryBuilder.ilike("content", `%${query}%`)
        }

        const { data, error } = await queryBuilder.order("created_at", { ascending: false })

        if (error) throw error
        setQuestions(data as Question[])
      } catch (error) {
        console.error("Error fetching questions:", error)
        setError("Không thể tải danh sách câu hỏi")
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Không thể tải danh sách câu hỏi",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuestions()
  }, [subject, difficulty, knowledge, query, toast])

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("questions").delete().eq("id", id)

      if (error) throw error

      setQuestions(questions.filter((q) => q.id !== id))
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

  const toggleQuestionSelection = (id: string) => {
    setSelectedQuestions((prev) => (prev.includes(id) ? prev.filter((qId) => qId !== id) : [...prev, id]))
  }

  const handleCreateExam = () => {
    if (selectedQuestions.length === 0) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng chọn ít nhất một câu hỏi",
      })
      return
    }

    // Store selected questions in localStorage to use in exam creation
    localStorage.setItem("selectedQuestions", JSON.stringify(selectedQuestions))
    window.location.href = "/exams/new?fromSearch=true"
  }

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
    return <div className="text-center py-10">Đang tìm kiếm câu hỏi...</div>
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Thử lại</Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Kết quả tìm kiếm ({questions.length} câu hỏi)</h2>
        {selectedQuestions.length > 0 && (
          <Button onClick={handleCreateExam}>Tạo đề thi từ {selectedQuestions.length} câu hỏi đã chọn</Button>
        )}
      </div>

      {questions.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Không tìm thấy câu hỏi nào phù hợp với tiêu chí tìm kiếm</p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((question) => (
            <Card key={question.id} className="transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-start gap-2">
                  <Checkbox
                    id={`select-${question.id}`}
                    checked={selectedQuestions.includes(question.id)}
                    onCheckedChange={() => toggleQuestionSelection(question.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <CardTitle className="text-base font-medium">{question.content}</CardTitle>
                  </div>
                  <Badge className={getDifficultyColor(question.difficulty_level)}>{question.difficulty_level}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{question.knowledge_area}</Badge>
                  {question.subjects && <Badge variant="secondary">{(question as any).subjects.name}</Badge>}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
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
          ))}
        </div>
      )}
    </div>
  )
}

