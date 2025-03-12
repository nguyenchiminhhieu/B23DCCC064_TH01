"use client"

import { useEffect, useState } from "react"
import { useStore } from "@/lib/question-bank/store"
import { supabase, type Subject } from "@/lib/question-bank/supabase"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

export default function SubjectList() {
  const { subjects, setSubjects, deleteSubject } = useStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSubjects() {
      try {
        setIsLoading(true)
        setError(null)

        const { data, error } = await supabase.from("subjects").select("*").order("created_at", { ascending: false })

        if (error) throw error

        setSubjects(data as Subject[])
      } catch (error) {
        console.error("Error fetching subjects:", error)
        setError("Không thể tải danh sách môn học")
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Không thể tải danh sách môn học",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchSubjects()
  }, [setSubjects, toast])

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("subjects").delete().eq("id", id)

      if (error) throw error

      deleteSubject(id)
      toast({
        title: "Thành công",
        description: "Đã xóa môn học",
      })
    } catch (error) {
      console.error("Error deleting subject:", error)
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể xóa môn học",
      })
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

  if (subjects.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground mb-4">Chưa có môn học nào</p>
        <Link href="/subjects/new">
          <Button>Thêm môn học đầu tiên</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {subjects.map((subject) => (
        <Card key={subject.id}>
          <CardHeader>
            <CardTitle>{subject.name}</CardTitle>
            <CardDescription>{new Date(subject.created_at).toLocaleDateString("vi-VN")}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">{subject.description || "Không có mô tả"}</p>
          </CardContent>
          <CardFooter className="flex justify-between">
          <Link href={`/question-bank/subjects/${subject.id}`}>
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" />
                Sửa
              </Button>
            </Link>
            <Button variant="destructive" size="sm" onClick={() => handleDelete(subject.id)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

