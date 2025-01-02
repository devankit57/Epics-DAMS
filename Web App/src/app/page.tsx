import Link from 'next/link'
import { ArrowRight, School, Users, BarChartIcon as ChartBar, BookOpen } from 'lucide-react'

export default function Home() {
  return (
    <div className="space-y-16 relative">
      <div className="absolute inset-0 z-0"></div>

      {/* Hero Section */}
      <section className="relative isolate px-6 pt-8 pb-12 lg:px-8 z-10">
        <div className="mx-auto max-w-2xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-black sm:text-6xl">
              Digital Academic Management System
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 bg-white bg-opacity-75 p-4 rounded-lg">
              Empowering government schools with digital tools for real-time tracking of student performance, attendance management, teacher evaluation, and curriculum progress monitoring.
            </p>
            <div className="mt-6 flex items-center justify-center gap-x-6">
              <Link
                href="/dashboard"
                className="rounded-md bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black transition-colors"
              >
                Get started
              </Link>
              <Link href="#about" className="text-sm font-semibold leading-6 text-black hover:text-gray-600 transition-colors">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Schools Section */}
      <section id="about" className="py-16 bg-white bg-opacity-90 relative z-10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">About Our Schools</h2>
          <div className="grid md:grid-cols-2 gap-8 mt-4">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Empowering Education</h3>
              <p className="text-gray-600">
                Our government schools are the backbone of our education system, providing quality learning opportunities to millions of students across the nation. We believe in the power of education to transform lives and communities.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Digital Transformation</h3>
              <p className="text-gray-600">
                Through the Digital Academic Management System (DAMS), we&apos;re bringing cutting-edge technology to our schools, enhancing the learning experience and improving administrative efficiency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How We Do It Section */}
      <section className="py-16 bg-white bg-opacity-90 relative z-10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How We Do It</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <School className="w-12 h-12 mx-auto mb-4 text-black" />
              <h3 className="text-xl font-semibold mb-2">School Management</h3>
              <p className="text-gray-600">Streamlining administrative tasks for efficient school operations</p>
            </div>
            <div className="text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-black" />
              <h3 className="text-xl font-semibold mb-2">Student Tracking</h3>
              <p className="text-gray-600">Real-time monitoring of student performance and attendance</p>
            </div>
            <div className="text-center">
              <ChartBar className="w-12 h-12 mx-auto mb-4 text-black" />
              <h3 className="text-xl font-semibold mb-2">Data Analytics</h3>
              <p className="text-gray-600">Insightful analytics to drive informed decision-making</p>
            </div>
            <div className="text-center">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-black" />
              <h3 className="text-xl font-semibold mb-2">Curriculum Management</h3>
              <p className="text-gray-600">Efficient tools for curriculum development and progress tracking</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black text-white relative z-10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your School?</h2>
          <p className="mb-8 text-gray-300">Join the digital revolution in education with DAMS</p>
          <Link
            href="/contact"
            className="inline-block rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-black shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  )
}
