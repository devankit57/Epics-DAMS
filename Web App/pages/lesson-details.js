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
  Plus,
} from "lucide-react";

const LessonPlanner = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [active, setActive] = useState("lesson");
  const [lessons, setLessons] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [week, setWeek] = useState("");
  const [description, setDescription] = useState("");
  const [className, setClassName] = useState("");

  // Fetch the className from the URL query
  useEffect(() => {
    if (router.query.className) {
      setClassName(router.query.className);
    }
  }, [router.query.className]);

  // Fetch lessons based on className
  const fetchLessons = async () => {
    if (!className) return; // Ensure className is available

    try {
      const res = await fetch("/api/fetch-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ className }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Error fetching lessons:", text);
        return;
      }

      const data = await res.json();
      setLessons(data);
    } catch (error) {
      console.error("Failed to fetch lessons:", error);
    }
  };

  const handleAddLesson = async () => {
    if (!week || !description || !className) return;

    try {
      const res = await fetch("/api/add-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ week, description, className }),
      });

      if (res.ok) {
        fetchLessons();
        setWeek("");
        setDescription("");
        setShowModal(false);
      } else {
        const text = await res.text();
        console.error("Add lesson failed:", text);
      }
    } catch (err) {
      console.error("Error adding lesson:", err);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status]);

  useEffect(() => {
    if (className) {
      fetchLessons();
    }
  }, [className]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Head>
        <title>DAMS | Lesson Planner</title>
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
          <h1 className="text-3xl font-bold text-gray-700">Lesson Planner</h1>
          <div className="flex items-center space-x-6">
            <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-500 transition" />
            <User className="w-8 h-8 rounded-full bg-gray-300 cursor-pointer" />
          </div>
        </div>

        {/* Lesson Table */}
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Lessons This Term</h2>
            <button onClick={() => setShowModal(true)} className="flex items-center bg-gradient-to-br from-yellow-400 to-yellow-600 text-white px-4 py-2 rounded hover:bg-green-700">
              <Plus className="w-5 h-5 mr-2" /> Add Lesson
            </button>
          </div>

          <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-white text-left">
                  <th className="p-4">Week</th>
                  <th className="p-4">Description</th>
                </tr>
              </thead>
              <tbody>
                {lessons.length > 0 ? (
                  lessons.map((lesson, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-4">{lesson.week}</td>
                      <td className="p-4">{lesson.description}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-4" colSpan="2">No lessons added yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-[400px]">
              <h2 className="text-xl font-semibold mb-4">Add Lesson</h2>
              <input
                type="text"
                placeholder="Week Name"
                value={week}
                onChange={(e) => setWeek(e.target.value)}
                className="w-full border px-3 py-2 mb-4 rounded"
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border px-3 py-2 mb-4 rounded"
              />
              <div className="flex justify-end space-x-3">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                <button onClick={handleAddLesson} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
              </div>
            </div>
          </div>
        )}
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

export default LessonPlanner;
