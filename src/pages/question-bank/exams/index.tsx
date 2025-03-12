import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import SubjectList from "@/components/question-bank/subject/subject-list"
export default function ExamsPage() {
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản Lý Đề Thi</h1>
          <p className="text-muted-foreground">Tạo và quản lý đề thi tự động từ ngân hàng câu hỏi</p>
        </div>
        <div className="flex gap-2">
          <Link href="/questions/search">
            <Button variant="outline">Tìm kiếm câu hỏi</Button>
          </Link>
          <Link href="/exams/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Tạo đề thi mới
            </Button>
          </Link>
        </div>
      </div>

      <SubjectList />
    </div>
  )
}

