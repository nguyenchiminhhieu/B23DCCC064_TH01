import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Hệ Thống Quản Lý Ngân Hàng Câu Hỏi</h1>
          <p className="text-lg text-gray-600">Quản lý môn học, câu hỏi và tạo đề thi tự động</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <DashboardCard
            title="Quản Lý Môn Học"
            description="Thêm, sửa, xóa và quản lý các môn học"
            href="/subjects"
            count="0"
          />
          <DashboardCard
            title="Ngân Hàng Câu Hỏi"
            description="Quản lý câu hỏi theo môn học và khối kiến thức"
            href="/questions"
            count="0"
          />
          <DashboardCard title="Đề Thi" description="Tạo và quản lý đề thi tự động" href="/exams" count="0" />
        </div>
      </div>
    </div>
  )
}

function DashboardCard({
  title,
  description,
  href,
  count,
}: {
  title: string
  description: string
  href: string
  count: string
}) {
  return (
    <div className="bg-white rounded-lg border shadow-sm p-6 transition-all hover:shadow-md">
      <div className="flex justify-between items-start">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="bg-primary/10 text-primary rounded-full w-10 h-10 flex items-center justify-center font-medium">
          {count}
        </div>
      </div>
      <p className="text-gray-600 mt-2 mb-4">{description}</p>
      <Link href={href}>
        <Button className="w-full">Truy cập</Button>
      </Link>
    </div>
  )
}

