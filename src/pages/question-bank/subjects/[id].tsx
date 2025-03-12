import { supabase } from "@/lib/question-bank/supabase"
import SubjectForm from "@/components/question-bank/subject/subject-form"
import { notFound } from "next/navigation"

export default async function EditSubjectPage({
  params,
}: {
  params: { id: string }
}) {
  try {
    const { data: subject, error } = await supabase.from("subjects").select("*").eq("id", params.id).single()

    if (error || !subject) {
      return notFound()
    }

    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Chỉnh Sửa Môn Học</h1>
        <SubjectForm subject={subject} />
      </div>
    )
  } catch (error) {
    console.error("Error fetching subject:", error)
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Chỉnh Sửa Môn Học</h1>
        <p className="text-red-500">Không thể tải thông tin môn học. Vui lòng thử lại sau.</p>
      </div>
    )
  }
}

