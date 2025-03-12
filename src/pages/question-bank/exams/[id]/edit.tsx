import { supabase } from "@/lib/question-bank/supabase"
import { notFound } from "next/navigation"
import ExamForm from "@/components/question-bank/exams/exam-form"

export default async function EditExamPage({
  params,
}: {
  params: { id: string }
}) {
  try {
    const { data: exam, error } = await supabase.from("exams").select("*").eq("id", params.id).single()

    if (error || !exam) {
      return notFound()
    }

    // Fetch exam questions
    const { data: examQuestions, error: questionsError } = await supabase
      .from("exam_questions")
      .select(`
        *,
        questions (
          id, content, difficulty_level, knowledge_area, subject_id,
          subjects (name)
        )
      `)
      .eq("exam_id", params.id)
      .order("order")

    if (questionsError) {
      console.error("Error fetching exam questions:", questionsError)
    }

    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Chỉnh Sửa Đề Thi</h1>
        <ExamForm exam={exam} examQuestions={examQuestions || []} />
      </div>
    )
  } catch (error) {
    console.error("Error fetching exam:", error)
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Chỉnh Sửa Đề Thi</h1>
        <p className="text-red-500">Không thể tải thông tin đề thi. Vui lòng thử lại sau.</p>
      </div>
    )
  }
}

