import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import { Layout } from '@/components/Layout'
import { GridSkeleton } from '@/components/Skeleton'

const Home = lazy(() => import('@/pages/Home'))
const Catalog = lazy(() => import('@/pages/Catalog'))
const Detail = lazy(() => import('@/pages/Detail'))
const Cart = lazy(() => import('@/pages/Cart'))
const MyLearning = lazy(() => import('@/pages/MyLearning'))
const Login = lazy(() => import('@/pages/Login'))
const Learn = lazy(() => import('@/pages/Learn'))

export default function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="container-page py-10">
            <GridSkeleton />
          </div>
        }
      >
        <Routes>
          <Route path="/learn/:courseId/:lessonId" element={<Learn />} />
          <Route
            path="*"
            element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/courses" element={<Catalog />} />
                  <Route path="/course/:slug" element={<Detail />} />
                  <Route path="/my-learning" element={<MyLearning />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </Suspense>
      <Toaster richColors position="top-right" />
    </BrowserRouter>
  )
}
