import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/common/table"
import { Badge } from "../components/ui/badge"

const students = [
  { id: 1, name: 'Alice Johnson', grade: '10th', performance: 'Excellent', attendance: '98%' },
  { id: 2, name: 'Bob Smith', grade: '9th', performance: 'Good', attendance: '95%' },
  { id: 3, name: 'Charlie Brown', grade: '11th', performance: 'Average', attendance: '92%' },
  { id: 4, name: 'Diana Miller', grade: '10th', performance: 'Good', attendance: '97%' },
  { id: 5, name: 'Ethan Davis', grade: '12th', performance: 'Excellent', attendance: '99%' },
]

const getPerformanceColor = (performance: string) => {
  switch (performance.toLowerCase()) {
    case 'excellent':
      return 'bg-black text-white'
    case 'good':
      return 'bg-gray-700 text-white'
    case 'average':
      return 'bg-gray-400 text-black'
    default:
      return 'bg-gray-200 text-black'
  }
}

export default function StudentsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold mb-6 text-black">Student Performance Tracking</h1>
      <Card className="overflow-hidden border-2 border-black">
        <CardHeader>
          <CardTitle className="text-2xl text-black">Student Overview</CardTitle>
          <CardDescription>A summary of student performance and attendance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg overflow-hidden border border-gray-200">
            <Table>
              <TableHeader className="bg-gray-100">
                <TableRow>
                  <TableHead className="font-bold">Name</TableHead>
                  <TableHead className="font-bold">Grade</TableHead>
                  <TableHead className="font-bold">Performance</TableHead>
                  <TableHead className="font-bold">Attendance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.grade}</TableCell>
                    <TableCell>
                      <Badge className={getPerformanceColor(student.performance)}>
                        {student.performance}
                      </Badge>
                    </TableCell>
                    <TableCell>{student.attendance}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

