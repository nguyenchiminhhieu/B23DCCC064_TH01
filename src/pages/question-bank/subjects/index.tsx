import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import SubjectList from "@/components/question-bank/subject/subject-list"

export default function SubjectsPage() {
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản Lý Môn Học</h1>
          <p className="text-muted-foreground">Thêm, sửa, xóa và quản lý các môn học trong hệ thống</p>
        </div>
        <Link href="/subjects/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Thêm môn học
          </Button>
        </Link>
      </div>

      <SubjectList />
    </div>
  )
}

