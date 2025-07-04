import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import {
  Home, School, Activity, BarChart, Settings, LogOut, Bell, User
} from "lucide-react";

const Leaves = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [leaves, setLeaves] = useState([]);
  const [newLeave, setNewLeave] = useState({
    leaveDate: "",
    reason: ""
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      const fetchLeaves = async () => {
        try {
          const res = await fetch("/api/fetch-leaves", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
          const data = await res.json();
          if (res.ok) {
            setLeaves(data);
          } else {
            console.error("Failed to fetch leaves:", data.message);
          }
        } catch (err) {
          console.error("Error fetching leaves:", err);
        }
      };

      fetchLeaves();
    }
  }, [status]);

  const handleApplyLeave = async () => {
    if (!newLeave.leaveDate || !newLeave.reason) {
      alert("All fields are required");
      return;
    }

    try {
      const payload = {
        date: newLeave.leaveDate,
        reason: newLeave.reason,
      };

      const res = await fetch("/api/apply-leave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setLeaves(prev => [...prev, data.leave]);
        setShowApplyModal(false);
        setNewLeave({ leaveDate: "", reason: "" });
      } else {
        alert(data.message || "Failed to apply for leave");
      }
    } catch (err) {
      console.error("Apply Leave Error:", err);
      alert("Something went wrong");
    }
  };

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

  const [active, setActive] = useState(getActiveTab());

  useEffect(() => {
    setActive(getActiveTab());
  }, [router.pathname]);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      <Head>
        <title>DAMS | Leaves</title>
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
      <div className="flex-1 overflow-auto">
        <div className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-700">Leaves</h1>
          <div className="flex items-center space-x-4">
            <Bell className="text-gray-600" />
            <User className="rounded-full bg-gray-300 p-1 w-8 h-8" />
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">Leave Applications</h2>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => setShowApplyModal(true)}
            >
              Apply Leave
            </button>
          </div>

          <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-green-700">
      <tr>
        {["S/No", "Date", "Reason", "Status"].map((head, idx) => (
          <th
            key={idx}
            className="px-6 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider"
          >
            {head}
          </th>
        ))}
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-100">
      {leaves.length > 0 ? (
        leaves.map((leave, index) =>
          leave && leave.date && leave.reason ? (
            <tr
              key={index}
              className="hover:bg-gray-50 transition duration-150"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{index + 1}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{leave.date}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{leave.reason}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex px-2 text-xs font-medium leading-5 rounded-full bg-yellow-100 text-yellow-800">
                  {leave.status || "Pending"}
                </span>
              </td>
            </tr>
          ) : null
        )
      ) : (
        <tr>
          <td colSpan="4" className="p-4 text-center text-gray-500 text-sm">
            No leave applications found.
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

        </div>
      </div>

      {/* Apply Leave Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h3 className="text-lg font-semibold mb-4">Apply for Leave</h3>
            <div className="space-y-3">
              <input
                type="date"
                value={newLeave.leaveDate}
                onChange={(e) => setNewLeave({ ...newLeave, leaveDate: e.target.value })}
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Reason"
                value={newLeave.reason}
                onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
                className="w-full border p-2 rounded"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setShowApplyModal(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                <button onClick={handleApplyLeave} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Apply</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SidebarItem = ({ icon, text, active, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`flex items-center px-4 py-3 cursor-pointer rounded-lg transition ${active ? "bg-gradient-to-r from-green-400 to-blue-500 text-white" : "text-gray-200 hover:bg-blue-800"}`}
    onClick={onClick}
  >
    {React.cloneElement(icon, { className: "w-5 h-5 mr-3" })}
    <span className="text-base">{text}</span>
  </motion.div>
);

export default Leaves;
