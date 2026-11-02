export type Sport =
  | 'Fútbol'
  | 'Baloncesto'
  | 'Natación'
  | 'Running'
  | 'Yoga'
  | 'Crossfit'
  | 'Tenis'
  | 'Ciclismo'
  | 'Artes marciales'
  | 'Fitness'
  | 'Nutrición'
  | 'Psicología deportiva'
export interface Lesson {
  id: string
  title: string
  duration: string
  videoUrl: string
  isFree: boolean
  completed: boolean
}
export interface Instructor {
  id: string
  name: string
  avatar: string
  bio: string
  rating: number
  students: number
  coursesCount: number
}
export interface Course {
  id: string
  slug: string
  title: string
  subtitle: string
  description: string
  sport: Sport
  level: 'Principiante' | 'Intermedio' | 'Avanzado'
  price: number
  rating: number
  reviewsCount: number
  students: number
  duration: string
  thumbnail: string
  previewVideo: string
  instructor: Instructor
  lessons: Lesson[]
  tags: string[]
  updatedAt: string
}
export interface Review {
  id: string
  user: string
  avatar: string
  rating: number
  comment: string
  date: string
}
export interface Category {
  id: string
  name: string
  icon: string
  slug: string
  coursesCount: number
}
