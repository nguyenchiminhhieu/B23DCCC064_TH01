"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useStore } from "@/lib/question-bank/store"
import { supabase, type Exam, type Question, type Subject } from "@/lib/question-bank/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Slider } from "@/components/ui/slider"
import { Trash2, GripVertical, Plus } from "lucide-react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"

interface ExamFormProps {
  exam?: Exam
  examQuestions?: any[]
}

interface QuestionWithSubject extends Question {
  subjects?: { name: string }
}

// Removed unused interface ExamQuestionItem

export default function ExamForm({ exam, examQuestions = [] }: ExamFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { subjects, setSubjects, addExam, updateExam } = useStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: exam?.title || "",
    description: exam?.description || "",
  })
  const [selectedSubject, setSelectedSubject] = useState<string>("all")
  const [difficultyDistribution, setDifficultyDistribution] = useState({
    Dễ: 25,
    "Trung bình": 50,
    Khó: 20,
    "Rất khó": 5,
  })
  const [totalQuestions, setTotalQuestions] = useState(10)
  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([])
  const [selectedQuestions, setSelectedQuestions] = useState<QuestionWithSubject[]>(
    examQuestions.map((eq) => eq.questions) || [],
  )
  const [activeTab, setActiveTab] = useState("manual")
  const [isGenerating, setIsGenerating] = useState(false)

  // Check if we're coming from search page with selected questions
  useEffect(() => {
    const fromSearch = searchParams.get("fromSearch")
    if (fromSearch === "true") {
      const storedQuestions = localStorage.getItem("selectedQuestions")
      if (storedQuestions) {
        const questionIds = JSON.parse(storedQuestions)
        fetchQuestionsById(questionIds)
        setActiveTab("manual")
        localStorage.removeItem("selectedQuestions")
      }
    }
  }, [searchParams])

  // Fetch subjects if needed
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

  // Fetch available questions based on selected subject
  useEffect(() => {
    async function fetchAvailableQuestions() {
      try {
        let queryBuilder = supabase.from("questions").select(`
            *,
            subjects(name)
          `)

        if (selectedSubject !== "all") {
          queryBuilder = queryBuilder.eq("subject_id", selectedSubject) as any
        }

        const { data, error } = await queryBuilder.order("created_at", { ascending: false })

        if (error) throw error
        setAvailableQuestions(data as Question[])
      } catch (error) {
        console.error("Error fetching available questions:", error)
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Không thể tải danh sách câu hỏi",
        })
      }
    }

    fetchAvailableQuestions()
  }, [selectedSubject, toast])

  async function fetchQuestionsById(questionIds: string[]) {
    try {
      if (questionIds.length === 0) return

      const { data, error } = await supabase
        .from("questions")
        .select(`
          *,
          subjects(name)
        `)
        .in("id", questionIds)

      if (error) throw error
      setSelectedQuestions(data as QuestionWithSubject[])
    } catch (error) {
      console.error("Error fetching questions by ID:", error)
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tải thông tin câu hỏi",
      })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDifficultyChange = (difficulty: string, value: number) => {
    setDifficultyDistribution((prev) => ({
      ...prev,
      [difficulty]: value,
    }))
  }

  const handleGenerateExam = () => {
    setIsGenerating(true)

    // Calculate number of questions for each difficulty level
    const totalPercentage = Object.values(difficultyDistribution).reduce((sum, val) => sum + val, 0)
    const questionCounts: Record<string, number> = {}

    Object.entries(difficultyDistribution).forEach(([difficulty, percentage]) => {
      questionCounts[difficulty] = Math.round((percentage / totalPercentage) * totalQuestions)
    })

    // Ensure we have exactly totalQuestions by adjusting the most common difficulty
    const sum = Object.values(questionCounts).reduce((sum, val) => sum + val, 0)
    if (sum !== totalQuestions) {
      const diff = totalQuestions - sum
      const maxDifficulty = Object.entries(difficultyDistribution).sort((a, b) => b[1] - a[1])[0][0]
      questionCounts[maxDifficulty] += diff
    }

    // Group available questions by difficulty
    const questionsByDifficulty: Record<string, Question[]> = {}
    availableQuestions.forEach((question) => {
      if (!questionsByDifficulty[question.difficulty_level]) {
        questionsByDifficulty[question.difficulty_level] = []
      }
      questionsByDifficulty[question.difficulty_level].push(question)
    })

    // Select random questions for each difficulty level
    const selectedQuestionsArray: Question[] = []

    Object.entries(questionCounts).forEach(([difficulty, count]) => {
      const questions = questionsByDifficulty[difficulty] || []
      const shuffled = [...questions].sort(() => 0.5 - Math.random())
      const selected = shuffled.slice(0, count)
      selectedQuestionsArray.push(...selected)
    })

    setSelectedQuestions(selectedQuestionsArray)
    setIsGenerating(false)

    toast({
      title: "Đề thi đã được tạo",
      description: `Đã tạo đề thi với ${selectedQuestionsArray.length} câu hỏi`,
    })
  }

  const handleAddQuestion = (question: Question) => {
    if (selectedQuestions.some((q) => q.id === question.id)) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Câu hỏi này đã được thêm vào đề thi",
      })
      return
    }

    setSelectedQuestions((prev) => [...prev, question as QuestionWithSubject])
  }

  const handleRemoveQuestion = (id: string) => {
    setSelectedQuestions((prev) => prev.filter((q) => q.id !== id))
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(selectedQuestions)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setSelectedQuestions(items)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedQuestions.length === 0) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng thêm ít nhất một câu hỏi vào đề thi",
      })
      return
    }

    setIsLoading(true)

    try {
      if (exam) {
        // Update existing exam
        const { data: updatedExam, error: examError } = await supabase
          .from("exams")
          .update({
            title: formData.title,
            description: formData.description,
          })
          .eq("id", exam.id)
          .select()
          .single()

        if (examError) throw examError

        // Delete existing exam questions
        const { error: deleteError } = await supabase.from("exam_questions").delete().eq("exam_id", exam.id)

        if (deleteError) throw deleteError

        // Insert new exam questions
        const examQuestionsData = selectedQuestions.map((question, index) => ({
          exam_id: exam.id,
          question_id: question.id,
          order: index + 1,
        }))

        const { error: insertError } = await supabase.from("exam_questions").insert(examQuestionsData)

        if (insertError) throw insertError

        updateExam(updatedExam as Exam)
        toast({
          title: "Thành công",
          description: "Đã cập nhật đề thi",
        })
      } else {
        // Create new exam
        const { data: newExam, error: examError } = await supabase
          .from("exams")
          .insert({
            title: formData.title,
            description: formData.description,
          })
          .select()
          .single()

        if (examError) throw examError

        // Insert exam questions
        const examQuestionsData = selectedQuestions.map((question, index) => ({
          exam_id: newExam.id,
          question_id: question.id,
          order: index + 1,
        }))

        const { error: insertError } = await supabase.from("exam_questions").insert(examQuestionsData)

        if (insertError) throw insertError

        addExam(newExam as Exam)
        toast({
          title: "Thành công",
          description: "Đã tạo đề thi mới",
        })
      }

      router.push("/exams")
    } catch (error) {
      console.error("Error saving exam:", error)
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể lưu đề thi",
      })
    } finally {
      setIsLoading(false)
    }
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

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin đề thi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Tiêu đề đề thi</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Nhập tiêu đề đề thi"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Nhập mô tả về đề thi"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Chọn câu hỏi</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="manual">Chọn thủ công</TabsTrigger>
                <TabsTrigger value="auto">Tạo tự động</TabsTrigger>
              </TabsList>

              <TabsContent value="manual" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Câu hỏi đã chọn ({selectedQuestions.length})</Label>

                    <DragDropContext onDragEnd={onDragEnd}>
                      <Droppable droppableId="selected-questions">
                        {(provided) => (
                          <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                            {selectedQuestions.length === 0 ? (
                              <div className="text-center py-8 border border-dashed rounded-md">
                                <p className="text-muted-foreground">Chưa có câu hỏi nào được chọn</p>
                              </div>
                            ) : (
                              selectedQuestions.map((question, index) => (
                                <Draggable key={question.id} draggableId={question.id} index={index}>
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      className="flex items-center gap-2 p-3 border rounded-md bg-background"
                                    >
                                      <div {...provided.dragHandleProps} className="cursor-move">
                                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                                      </div>
                                      <div className="flex-1">
                                        <div className="font-medium">
                                          {index + 1}. {question.content}
                                        </div>
                                        <div className="flex gap-2 mt-1">
                                          <Badge className={getDifficultyColor(question.difficulty_level)}>
                                            {question.difficulty_level}
                                          </Badge>
                                          {question.subjects && (
                                            <Badge variant="secondary">{question.subjects.name}</Badge>
                                          )}
                                        </div>
                                      </div>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemoveQuestion(question.id)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  )}
                                </Draggable>
                              ))
                            )}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  </div>

                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <Label>Thêm câu hỏi từ ngân hàng</Label>
                      <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                        <SelectTrigger className="w-[200px]">
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

                    <div className="border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nội dung</TableHead>
                            <TableHead className="w-[150px]">Mức độ</TableHead>
                            <TableHead className="w-[100px]">Thao tác</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {availableQuestions.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={3} className="text-center h-24">
                                Không có câu hỏi nào
                              </TableCell>
                            </TableRow>
                          ) : (
                            availableQuestions.map((question) => (
                              <TableRow key={question.id}>
                                <TableCell>
                                  <div className="font-medium">{question.content}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {(question as any).subjects?.name || ""}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge className={getDifficultyColor(question.difficulty_level)}>
                                    {question.difficulty_level}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleAddQuestion(question)}
                                    disabled={selectedQuestions.some((q) => q.id === question.id)}
                                  >
                                    <Plus className="h-4 w-4 mr-1" />
                                    Thêm
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="auto" className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Môn học</Label>
                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                      <SelectTrigger>
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

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Tổng số câu hỏi</Label>
                      <span className="font-medium">{totalQuestions}</span>
                    </div>
                    <Slider
                      value={[totalQuestions]}
                      min={5}
                      max={30}
                      step={1}
                      onValueChange={(value) => setTotalQuestions(value[0])}
                    />
                  </div>

                  <div className="space-y-4">
                    <Label>Phân bố mức độ khó</Label>

                    {Object.entries(difficultyDistribution).map(([difficulty, value]) => (
                      <div key={difficulty} className="space-y-2">
                        <div className="flex justify-between">
                          <div className="flex items-center gap-2">
                            <Badge className={getDifficultyColor(difficulty)}>{difficulty}</Badge>
                            <span>{Math.round((value / 100) * totalQuestions)} câu</span>
                          </div>
                          <span>{value}%</span>
                        </div>
                        <Slider
                          value={[value]}
                          min={0}
                          max={100}
                          step={5}
                          onValueChange={(val) => handleDifficultyChange(difficulty, val[0])}
                        />
                      </div>
                    ))}
                  </div>

                  <Button
                    type="button"
                    onClick={handleGenerateExam}
                    disabled={isGenerating || availableQuestions.length === 0}
                    className="w-full"
                  >
                    {isGenerating ? "Đang tạo..." : "Tạo đề thi tự động"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <CardFooter className="flex justify-between px-0">
          <Button type="button" variant="outline" onClick={() => router.push("/exams")}>
            Hủy
          </Button>
          <Button type="submit" disabled={isLoading || selectedQuestions.length === 0}>
            {isLoading ? "Đang lưu..." : exam ? "Cập nhật" : "Tạo đề thi"}
          </Button>
        </CardFooter>
      </div>
    </form>
  )
}

