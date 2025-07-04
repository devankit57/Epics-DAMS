import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import {
  Home,
  School,
  Activity,
  BarChart,
  Settings,
  LogOut,
  Bell,
  User,
} from "lucide-react";

const AttendancePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { className } = router.query;

  // Default selectedDate to today's date in YYYY-MM-DD format
  const [selectedDate, setSelectedDate] = useState(() =>
    new Date().toISOString().split("T")[0]
  );
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  // Redirect to login if unauthenticated; otherwise, fetch attendance
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Re-fetch whenever selectedDate or className changes and user is authenticated
  useEffect(() => {
    if (status === "authenticated") {
      fetchAttendance();
    }
  }, [status, selectedDate, className]);

  const fetchAttendance = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (selectedDate) queryParams.append("date", selectedDate);
  
      // Sanitize className before appending
      if (className) {
        const formattedClassName = className.toLowerCase().replace(/\s/g, "");
        queryParams.append("className", formattedClassName);
      }
  
      const res = await fetch(`/api/fetch-attendance?${queryParams.toString()}`, {
        method: "GET",
      });
  
      if (!res.ok) {
        const text = await res.text();
        console.error("Error fetching attendance:", text);
        return;
      }
  
      const data = await res.json();
      setAttendanceRecords(data.attendance || []);
    } catch (error) {
      console.error("Failed to fetch attendance:", error);
    }
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      <Head>
        <title>DAMS | Attendance</title>
      </Head>

      {/* Sidebar */}
      <div className="w-72 bg-gradient-to-b from-[#1d3557] to-[#457b9d] shadow-xl p-5 flex flex-col">
        <h2 className="text-3xl font-extrabold text-white mb-8">DAMS</h2>
        <nav className="flex-1 space-y-4">
          <SidebarItem
            icon={<Home />}
            text="Dashboard"
            onClick={() => router.push("/dashboard")}
          />
          <SidebarItem
            icon={<School />}
            text="Classes"
            onClick={() => router.push("/classes")}
          />
          <SidebarItem
            icon={<Activity />}
            text="Attendance"
            active
            onClick={() => router.push("/attendance")}
          />
          <SidebarItem
            icon={<BarChart />}
            text="Score"
            onClick={() => router.push("/score")}
          />
          <SidebarItem
            icon={<Settings />}
            text="Lesson Planner"
            onClick={() => router.push("/lesson")}
          />
          <SidebarItem
            icon={<Activity />}
            text="Leaves"
            onClick={() => router.push("/leaves")}
          />
        </nav>
        <SidebarItem icon={<LogOut />} text="Logout" onClick={() => signOut()} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Top Navbar */}
        <div className="bg-white shadow-md px-8 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-700">Attendance</h1>
          <div className="flex items-center space-x-6">
            <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-500 transition" />
            <User className="w-8 h-8 rounded-full bg-gray-300 cursor-pointer" />
          </div>
        </div>

        {/* Filters + Attendance Table */}
        <div className="p-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Showing Attendance for Class:{" "}
              <span className="text-blue-600">{className || "All"}</span>
            </h2>
            <div className="flex items-center gap-4">
              <label className="text-gray-700 font-medium">Select Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border px-3 py-2 rounded-lg shadow-sm"
                max={new Date().toISOString().split("T")[0]}
              />
              <button
                onClick={() => setSelectedDate(new Date().toISOString().split("T")[0])}
                className="text-sm text-blue-600 underline hover:text-blue-800"
              >
                Today
              </button>
            </div>
          </div>

          <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
  <table className="min-w-full table-auto">
    <thead>
      <tr className="bg-[#1d3557] text-white text-left">
        <th className="p-4">Roll No</th>
        <th className="p-4">Student Name</th>
        <th className="p-4">Class</th>
        <th className="p-4">Date</th>
        <th className="p-4">Captured Image</th>
      </tr>
    </thead>
    <tbody>
      {attendanceRecords.length > 0 ? (
        attendanceRecords.map((record, index) => (
          <tr key={index} className="border-b">
            <td className="p-4">{record.user.userId}</td>
            <td className="p-4">{record.user.name}</td>
            <td className="p-4">{record.user.classGroup}</td>
            <td className="p-4">
              {new Date(record.timestamp).toLocaleDateString()}
            </td>
            <td className="p-4">
              <img
                src={record.imageUrl}
                alt="Face"
                className="w-16 h-16 rounded-md object-cover border"
              />
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td className="p-4" colSpan="5">
            No attendance records found for the selected filters.
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>


        </div>
      </div>
    </div>
  );
};

// Sidebar Item Component
const SidebarItem = ({ icon, text, active, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`flex items-center px-5 py-3 cursor-pointer rounded-lg transition ${
      active
        ? "bg-gradient-to-r from-green-400 to-blue-500 text-white"
        : "text-gray-200 hover:bg-blue-800"
    }`}
    onClick={onClick}
  >
    {icon}
    <span className="text-lg ml-2">{text}</span>
  </motion.div>
);

export default AttendancePage;
