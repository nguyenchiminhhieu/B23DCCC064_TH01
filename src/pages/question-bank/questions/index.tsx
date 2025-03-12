import { Suspense } from "react"
import { SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import AdvancedSearch from "@/components/question-bank/questions/advanced-search";
import SearchResults from "@/components/question-bank/questions/search-results";
import { Skeleton } from "@/components/ui/skeleton"

export default function SearchQuestionsPage() {
  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Tìm Kiếm Câu Hỏi</h1>
        <p className="text-muted-foreground">Tìm kiếm và lọc câu hỏi theo nhiều tiêu chí khác nhau</p>
      </div>

      <div className="grid gap-6">
        <div className="relative">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Tìm kiếm câu hỏi..." className="w-full pl-8" />
        </div>

        <Suspense fallback={<AdvancedSearchSkeleton />}>
          <AdvancedSearch />
        </Suspense>

        <Suspense fallback={<SearchResultsSkeleton />}>
          <SearchResults />
        </Suspense>
      </div>
    </div>
  )
}

function AdvancedSearchSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  )
}

function SearchResultsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    </div>
  )
}

