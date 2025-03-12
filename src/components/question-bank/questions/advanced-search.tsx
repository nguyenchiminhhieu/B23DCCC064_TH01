"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { supabase, type Subject } from "@/lib/question-bank/supabase"
import { useStore } from "@/lib/question-bank/store"
import { useToast } from "@/components/ui/use-toast"

const difficultyLevels = ["Dễ", "Trung bình", "Khó", "Rất khó"]

export default function AdvancedSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { subjects, setSubjects } = useStore()
  const { toast } = useToast()

  const [selectedSubject, setSelectedSubject] = useState<string>(searchParams.get("subject") || "all")
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>(
    searchParams.get("difficulty")?.split(",") || [],
  )
  const [knowledgeArea, setKnowledgeArea] = useState<string>(searchParams.get("knowledge") || "")

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

  const handleDifficultyChange = (difficulty: string) => {
    setSelectedDifficulties((prev) =>
      prev.includes(difficulty) ? prev.filter((d) => d !== difficulty) : [...prev, difficulty],
    )
  }

  const handleSearch = () => {
    const params = new URLSearchParams()

    if (selectedSubject && selectedSubject !== "all") {
      params.set("subject", selectedSubject)
    }

    if (selectedDifficulties.length > 0) {
      params.set("difficulty", selectedDifficulties.join(","))
    }

    if (knowledgeArea) {
      params.set("knowledge", knowledgeArea)
    }

    router.push(`/questions/search?${params.toString()}`)
  }

  const handleReset = () => {
    setSelectedSubject("all")
    setSelectedDifficulties([])
    setKnowledgeArea("")
    router.push("/questions/search")
  }

  return (
    <Accordion type="single" collapsible defaultValue="filters">
      <AccordionItem value="filters">
        <AccordionTrigger>Tìm kiếm nâng cao</AccordionTrigger>
        <AccordionContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Môn học</Label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger id="subject">
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
                <Label>Mức độ khó</Label>
                <div className="flex flex-wrap gap-4 pt-2">
                  {difficultyLevels.map((level) => (
                    <div key={level} className="flex items-center space-x-2">
                      <Checkbox
                        id={`difficulty-${level}`}
                        checked={selectedDifficulties.includes(level)}
                        onCheckedChange={() => handleDifficultyChange(level)}
                      />
                      <Label htmlFor={`difficulty-${level}`} className="text-sm font-normal">
                        {level}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="knowledge">Khối kiến thức</Label>
                <Select value={knowledgeArea} onValueChange={setKnowledgeArea}>
                  <SelectTrigger id="knowledge">
                    <SelectValue placeholder="Chọn khối kiến thức" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="Đại số">Đại số</SelectItem>
                    <SelectItem value="Hình học">Hình học</SelectItem>
                    <SelectItem value="Giải tích">Giải tích</SelectItem>
                    <SelectItem value="Cơ học">Cơ học</SelectItem>
                    <SelectItem value="Nhiệt học">Nhiệt học</SelectItem>
                    <SelectItem value="Điện từ học">Điện từ học</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <Button variant="outline" onClick={handleReset}>
                Đặt lại
              </Button>
              <Button onClick={handleSearch}>Tìm kiếm</Button>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

