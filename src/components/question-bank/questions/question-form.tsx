"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/question-bank/store"
import { supabase, type Question, type Subject } from "@/lib/question-bank/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

interface QuestionFormProps {
  question?: Question
}

const difficultyLevels = ["Dễ", "Trung bình", "Khó", "Rất khó"]

export default function QuestionForm({ question }: QuestionFormProps) {
  const router = useRouter()
  const { subjects, setSubjects, addQuestion, updateQuestion } = useStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    subject_id: question?.subject_id || "",
    content: question?.content || "",
    difficulty_level: question?.difficulty_level || "Trung bình",
    knowledge_area: question?.knowledge_area || "",
  })

  useEffect(() => {
    async function fetchSubjects() {
      if (subjects.length === 0) {
        try {
          const { data, error } = await supabase.from("subjects").select("*").order("name")

          if (error) throw error
          setSubjects(data as Subject[])
        } catch (error) {
          console.error("Error fetching subjects:", error)
          toast({
            variant: "destructive",
            title: "Lỗi",
            description: "Không thể tải danh sách môn học",
          })
        }
      }
    }

    fetchSubjects()
  }, [subjects, setSubjects, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (question) {
        // Update existing question
        const { data, error } = await supabase
          .from("questions")
          .update({
            subject_id: formData.subject_id,
            content: formData.content,
            difficulty_level: formData.difficulty_level,
            knowledge_area: formData.knowledge_area,
          })
          .eq("id", question.id)
          .select()
          .single()

        if (error) throw error

        updateQuestion(data as Question)
        toast({
          title: "Thành công",
          description: "Đã cập nhật câu hỏi",
        })
      } else {
        // Create new question
        const { data, error } = await supabase
          .from("questions")
          .insert({
            subject_id: formData.subject_id,
            content: formData.content,
            difficulty_level: formData.difficulty_level,
            knowledge_area: formData.knowledge_area,
          })
          .select()
          .single()

        if (error) throw error

        addQuestion(data as Question)
        toast({
          title: "Thành công",
          description: "Đã thêm câu hỏi mới",
        })
      }

      router.push("/questions")
    } catch (error) {
      console.error("Error saving question:", error)
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể lưu câu hỏi",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="subject_id">Môn học</Label>
            <Select
              value={formData.subject_id}
              onValueChange={(value) => handleSelectChange("subject_id", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn môn học" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Nội dung câu hỏi</Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Nhập nội dung câu hỏi"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="difficulty_level">Mức độ khó</Label>
              <Select
                value={formData.difficulty_level}
                onValueChange={(value) => handleSelectChange("difficulty_level", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn mức độ khó" />
                </SelectTrigger>
                <SelectContent>
                  {difficultyLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="knowledge_area">Khối kiến thức</Label>
              <Input
                id="knowledge_area"
                name="knowledge_area"
                value={formData.knowledge_area}
                onChange={handleChange}
                placeholder="Ví dụ: Đại số, Hình học, Vật lý nhiệt..."
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.push("/questions")}>
            Hủy
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Đang lưu..." : question ? "Cập nhật" : "Thêm mới"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

