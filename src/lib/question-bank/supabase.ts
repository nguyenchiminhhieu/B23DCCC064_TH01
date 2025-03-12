import { createClient } from "@supabase/supabase-js"

// Get environment variables with fallbacks for development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Create a custom client factory function
export const createSupabaseClient = () => {
  // Only create a real client if we have the credentials
  if (supabaseUrl && supabaseAnonKey) {
    return createClient(supabaseUrl, supabaseAnonKey)
  }

  // Return a mock client for development/preview
  return createMockClient()
}

// Create a singleton instance
export const supabase = createSupabaseClient()

// Mock client for development/preview when env vars aren't available
function createMockClient() {
  console.warn("Using mock Supabase client. Please set environment variables for production.")

  // Mock data
  const mockSubjects = [
    {
      id: "1",
      name: "Toán học",
      description: "Môn học về số học, đại số và hình học",
      created_at: new Date().toISOString(),
    },
    { id: "2", name: "Vật lý", description: "Môn học về các quy luật tự nhiên", created_at: new Date().toISOString() },
  ]

  const mockQuestions = [
    {
      id: "1",
      subject_id: "1",
      content: "Giải phương trình bậc 2: x² + 5x + 6 = 0",
      difficulty_level: "Trung bình",
      knowledge_area: "Đại số",
      created_at: new Date().toISOString(),
      subjects: { name: "Toán học" },
    },
    {
      id: "2",
      subject_id: "2",
      content: "Nêu ba định luật Newton về chuyển động",
      difficulty_level: "Dễ",
      knowledge_area: "Cơ học",
      created_at: new Date().toISOString(),
      subjects: { name: "Vật lý" },
    },
  ]

  // Return a mock client with the same API shape
  return {
    from: (table: string) => ({
      select: (query?: string) => ({
        eq: (column: string, value: any) => ({
          single: () => Promise.resolve({ data: mockData(table).find((item) => item[column] === value), error: null }),
          order: () => Promise.resolve({ data: mockData(table).filter((item) => item[column] === value), error: null }),
        }),
        order: (column: string, { ascending = true } = {}) => {
          return Promise.resolve({
            data: [...mockData(table)].sort((a, b) => {
              return ascending ? (a[column] > b[column] ? 1 : -1) : a[column] < b[column] ? 1 : -1
            }),
            error: null,
          })
        },
      }),
      insert: (data: any) => ({
        select: () => ({
          single: () => {
            const newItem = {
              id: String(Math.random()),
              created_at: new Date().toISOString(),
              ...data,
            }
            return Promise.resolve({ data: newItem, error: null })
          },
        }),
      }),
      update: (data: any) => ({
        eq: (column: string, value: any) => ({
          select: () => ({
            single: () => {
              const updatedItem = {
                ...mockData(table).find((item) => item[column] === value),
                ...data,
              }
              return Promise.resolve({ data: updatedItem, error: null })
            },
          }),
        }),
      }),
      delete: () => ({
        eq: (column: string, value: any) => {
          return Promise.resolve({ data: null, error: null })
        },
      }),
    }),
  }
}

function mockData(table: string) {
  switch (table) {
    case "subjects":
      return mockSubjects
    case "questions":
      return mockQuestions
    default:
      return []
  }
}

// Type definitions
export type Subject = {
  id: string
  name: string
  description: string
  created_at: string
}

export type Question = {
  id: string
  subject_id: string
  content: string
  difficulty_level: string
  knowledge_area: string
  created_at: string
  subjects?: { name: string }
}

export type Exam = {
  id: string
  title: string
  description: string
  created_at: string
}

export type ExamQuestion = {
  id: string
  exam_id: string
  question_id: string
  order: number
}

