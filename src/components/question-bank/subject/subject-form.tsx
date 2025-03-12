"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/question-bank/store"
import { supabase, type Subject } from "@/lib/question-bank/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

interface SubjectFormProps {
  subject?: Subject
}

export default function SubjectForm({ subject }: SubjectFormProps) {
  const router = useRouter()
  const { addSubject, updateSubject } = useStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: subject?.name || "",
    description: subject?.description || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (subject) {
        // Update existing subject
        const { data, error } = await supabase
          .from("subjects")
          .update({
            name: formData.name,
            description: formData.description,
          })
          .eq("id", subject.id)
          .select()
          .single()

        if (error) throw error

        updateSubject(data as Subject)
        toast({
          title: "Thành công",
          description: "Đã cập nhật môn học",
        })
      } else {
        // Create new subject
        const { data, error } = await supabase
          .from("subjects")
          .insert({
            name: formData.name,
            description: formData.description,
          })
          .select()
          .single()

        if (error) throw error

        addSubject(data as Subject)
        toast({
          title: "Thành công",
          description: "Đã thêm môn học mới",
        })
      }

      router.push("/subjects")
    } catch (error) {
      console.error("Error saving subject:", error)
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể lưu môn học",
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
            <Label htmlFor="name">Tên môn học</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập tên môn học"
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
              placeholder="Nhập mô tả về môn học"
              rows={4}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.push("/subjects")}>
            Hủy
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Đang lưu..." : subject ? "Cập nhật" : "Thêm mới"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

