import { supabase } from "@/lib/question-bank/supabase"
import QuestionForm from "@/components/question-bank/questions/question-form"
import { notFound } from "next/navigation"

export default async function EditQuestionPage({
  params,
}: {
  params: { id: string }
}) {
  try {
    const { data: question, error } = await supabase.from("questions").select("*").eq("id", params.id).single()

    if (error || !question) {
      return notFound()
    }

    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Chỉnh Sửa Câu Hỏi</h1>
        <QuestionForm question={question} />
      </div>
    )
  } catch (error) {
    console.error("Error fetching question:", error)
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Chỉnh Sửa Câu Hỏi</h1>
        <p className="text-red-500">Không thể tải thông tin câu hỏi. Vui lòng thử lại sau.</p>
      </div>
    )
  }
}

