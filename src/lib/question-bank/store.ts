import { create } from "zustand"
import type { Subject, Question, Exam } from "./supabase"

interface StoreState {
  subjects: Subject[]
  questions: Question[]
  exams: Exam[]
  setSubjects: (subjects: Subject[]) => void
  setQuestions: (questions: Question[]) => void
  setExams: (exams: Exam[]) => void
  addSubject: (subject: Subject) => void
  updateSubject: (subject: Subject) => void
  deleteSubject: (id: string) => void
  addQuestion: (question: Question) => void
  updateQuestion: (question: Question) => void
  deleteQuestion: (id: string) => void
  addExam: (exam: Exam) => void
  updateExam: (exam: Exam) => void
  deleteExam: (id: string) => void
}

export const useStore = create<StoreState>((set) => ({
  subjects: [],
  questions: [],
  exams: [],

  setSubjects: (subjects) => set({ subjects }),
  setQuestions: (questions) => set({ questions }),
  setExams: (exams) => set({ exams }),

  addSubject: (subject) =>
    set((state) => ({
      subjects: [...state.subjects, subject],
    })),

  updateSubject: (updatedSubject) =>
    set((state) => ({
      subjects: state.subjects.map((subject) => (subject.id === updatedSubject.id ? updatedSubject : subject)),
    })),

  deleteSubject: (id) =>
    set((state) => ({
      subjects: state.subjects.filter((subject) => subject.id !== id),
    })),

  addQuestion: (question) =>
    set((state) => ({
      questions: [...state.questions, question],
    })),

  updateQuestion: (updatedQuestion) =>
    set((state) => ({
      questions: state.questions.map((question) => (question.id === updatedQuestion.id ? updatedQuestion : question)),
    })),

  deleteQuestion: (id) =>
    set((state) => ({
      questions: state.questions.filter((question) => question.id !== id),
    })),

  addExam: (exam) =>
    set((state) => ({
      exams: [...state.exams, exam],
    })),

  updateExam: (updatedExam) =>
    set((state) => ({
      exams: state.exams.map((exam) => (exam.id === updatedExam.id ? updatedExam : exam)),
    })),

  deleteExam: (id) =>
    set((state) => ({
      exams: state.exams.filter((exam) => exam.id !== id),
    })),
}))

