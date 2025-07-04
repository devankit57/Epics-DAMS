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

const Attendance = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [active, setActive] = useState("classes");
  const [classData, setClassData] = useState([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  
    const fetchClasses = async () => {
      try {
        const res = await fetch("/api/fetch-classes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: session?.user?.email }),
        });
  
        const data = await res.json();
        setClassData(data);
      } catch (err) {
        console.error("Failed to fetch class data", err);
      }
    };
  
    if (status === "authenticated") {
      fetchClasses();
    }
  }, [status, router, session]);
  
  const getActiveTab = () => {
    const path = router.pathname;
    if (path.includes("dashboard")) return "dashboard";
    if (path.includes("classes")) return "classes";
    if (path.includes("attendance")) return "attendance";
    if (path.includes("score")) return "score";
    if (path.includes("lesson")) return "lesson";
    if (path.includes("leaves")) return "leaves";
    return "";
  };

  

  
    useEffect(() => {
      setActive(getActiveTab());
    }, [router.pathname]);
  

  return (
    <div className="flex h-screen bg-gray-100">
      <Head>
        <title>DAMS | Classes</title>
      </Head>

      
            {/* Sidebar */}
            <div className="w-72 bg-gradient-to-b from-[#1d3557] to-[#457b9d] shadow-xl p-5 flex flex-col">
              <h2 className="text-3xl font-extrabold text-white mb-8">DAMS</h2>
              <nav className="flex-1 space-y-4">
                <SidebarItem icon={<Home />} text="Dashboard" active={active === "dashboard"} onClick={() => router.push("/dashboard")} />
                <SidebarItem icon={<School />} text="Classes" active={active === "classes"} onClick={() => router.push("/classes")} />
                <SidebarItem icon={<Activity />} text="Attendance" active={active === "attendance"} onClick={() => router.push("/attendance")} />
                <SidebarItem icon={<BarChart />} text="Score" active={active === "score"} onClick={() => router.push("/score")} />
                <SidebarItem icon={<Settings />} text="Lesson Planner" active={active === "lesson"} onClick={() => router.push("/lesson")} />
                <SidebarItem icon={<Activity />} text="Leaves" active={active === "leaves"} onClick={() => router.push("/leaves")} />
              </nav>
              <SidebarItem icon={<LogOut />} text="Logout" onClick={() => signOut()} />
            </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Top Navbar */}
        <div className="bg-white shadow-md px-8 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-700">Academic Score</h1>
          <div className="flex items-center space-x-6">
            <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-500 transition" />
            <User className="w-8 h-8 rounded-full bg-gray-300 cursor-pointer" />
          </div>
        </div>

        {/* Class Table Section */}
        <div className="p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Select Class</h2>

          <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white text-left">
                  <th className="p-4">Class Name</th>
                  <th className="p-4">Class Teacher</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
  {classData.length > 0 ? (
    classData.map((cls) => (
      <tr key={cls._id} className="border-b">
        <td className="p-4">{cls.className}</td>
        <td className="p-4">{cls.classTeacher}</td>
        <td className="p-4">{cls.teacherEmail}</td>
        <td className="p-4 space-x-2">
          <button onClick={() => router.push(`/score-details?className=${encodeURIComponent(cls.className)}`)}
 className="px-4 py-1 text-sm bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white rounded hover:bg-blue-600">
            View
          </button>
          
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td className="p-4" colSpan="4">No class assigned to you.</td>
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
    <span className="text-lg">{text}</span>
  </motion.div>
);

export default Attendance;
