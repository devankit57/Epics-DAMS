import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Users, BookOpen, Calendar, BarChart } from 'lucide-react'

const stats = [
  { name: 'Total Students', value: '1,234', icon: Users, href: '/students' },
  { name: 'Total Teachers', value: '56', icon: Users, href: '/teachers' },
  { name: 'Courses', value: '12', icon: BookOpen, href: '/curriculum' },
  { name: 'Attendance Rate', value: '92%', icon: Calendar, href: '/attendance' },
]

export default function Dashboard() {
  return (
    <div className="space-y-8 px-6 lg:px-12">
      {/* Content Wrapper with Padding */}
      <h1 className="text-4xl font-bold mb-6 text-black">Dashboard</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.name} href={stat.href}>
            <Card className="hover:shadow-lg transition-shadow duration-200 overflow-hidden border-2 border-black">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.name}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-black" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="overflow-hidden border-2 border-black">
          <CardHeader>
            <CardTitle className="text-xl text-black">Student Performance</CardTitle>
            <CardDescription>Average scores across subjects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center bg-gray-100 rounded-lg">
              <BarChart className="h-16 w-16 text-black" />
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden border-2 border-black">
          <CardHeader>
            <CardTitle className="text-xl text-black">Teacher Evaluation</CardTitle>
            <CardDescription>Recent feedback and ratings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center bg-gray-100 rounded-lg">
              <BarChart className="h-16 w-16 text-black" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
