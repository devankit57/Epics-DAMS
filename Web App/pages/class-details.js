// pages/class-details.js
import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import {
  Home, School, Activity, BarChart, Settings, LogOut, Bell, User
} from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ClassDetails = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { className } = router.query;

  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    fatherName: "",
    mobile: "",
    address: "",
  });

  const [students, setStudents] = useState([]);
  const [editStudent, setEditStudent] = useState(null);
  const [form, setForm] = useState({});

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");

    const fetchStudents = async () => {
      try {
        const res = await fetch("/api/fetch-students", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ className }),
        });
        const data = await res.json();
        setStudents(data);
      } catch (err) {
        console.error("Failed to fetch students", err);
      }
    };

    if (status === "authenticated" && className) {
      fetchStudents();
    }
  }, [status, className, router]);

  const handleEdit = (student) => {
    setForm(student);
    setEditStudent(student._id);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpdate = async () => {
    try {
      const res = await fetch("/api/update-student", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const updated = students.map((s) =>
          s._id === form._id ? form : s
        );
        setStudents(updated);
        setEditStudent(null);
      }
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleDeleteStudent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    try {
      const res = await fetch("/api/delete-student", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (res.ok) {
        setStudents((prev) => prev.filter((student) => student._id !== id));
        alert("Student deleted successfully");
      } else {
        alert(data.message || "Failed to delete student");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Something went wrong");
    }
  };

  const handleAddStudent = async () => {
    if (!newStudent.name) {
      alert("Name is required");
      return;
    }

    try {
      const payload = { ...newStudent, className };

      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setStudents((prev) => [...prev, ...(Array.isArray(data) ? data : [data])]);
        setShowAddModal(false);
        setNewStudent({ name: "", fatherName: "", mobile: "", address: "" });
      } else {
        alert(data.message || "Failed to add student");
      }
    } catch (err) {
      console.error("Add Student Error:", err);
      alert("Something went wrong");
    }
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      students.map((s, index) => ({
        "Roll No": index + 1,
        Name: s.name,
        "Father's Name": s.fatherName,
        Mobile: s.mobile,
        Address: s.address,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `${className}-students.xlsx`);
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
        <title>DAMS | Class Details</title>
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
          <h1 className="text-2xl font-bold text-gray-700">{`Class - ${className}`}</h1>
          <div className="flex items-center space-x-4">
            <Bell className="text-gray-600" />
            <User className="rounded-full bg-gray-300 p-1 w-8 h-8" />
          </div>
        </div>

        {/* Students Table */}
        <div className="p-6">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">Student List</h2>
            <div className="space-x-2">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => setShowAddModal(true)}
              >
                Add Student
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={downloadExcel}
              >
                Download Excel
              </button>
            </div>
          </div>

          <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-[#55823d] text-white">
                  <th className="p-4">Roll No</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Father's Name</th>
                  <th className="p-4">Mobile</th>
                  <th className="p-4">Address</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.map((student, index) => (
                    <tr key={student._id} className="border-b">
                      <td className="p-4">{index + 1}</td>
                      <td className="p-4">{student.name}</td>
                      <td className="p-4">{student.fatherName}</td>
                      <td className="p-4">{student.mobile}</td>
                      <td className="p-4">{student.address}</td>
                      <td className="p-4 flex gap-2">
                        <button className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600" onClick={() => handleEdit(student)}>Edit</button>
                        <button className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600" onClick={() => handleDeleteStudent(student._id)}>Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-4" colSpan="6">No students found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-[400px]">
            <h3 className="text-xl font-bold mb-4">Edit Student</h3>
            <input className="mb-2 p-2 border w-full rounded" name="name" placeholder="Name" value={form.name} onChange={handleChange} />
            <input className="mb-2 p-2 border w-full rounded" name="fatherName" placeholder="Father's Name" value={form.fatherName} onChange={handleChange} />
            <input className="mb-2 p-2 border w-full rounded" name="mobile" placeholder="Mobile" value={form.mobile} onChange={handleChange} />
            <input className="mb-2 p-2 border w-full rounded" name="address" placeholder="Address" value={form.address} onChange={handleChange} />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setEditStudent(null)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
              <button onClick={handleUpdate} className="bg-blue-600 text-white px-4 py-2 rounded">Update</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Student</h3>
            <div className="space-y-3">
              <input type="text" placeholder="Name" value={newStudent.name} onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} className="w-full border p-2 rounded" />
              <input type="text" placeholder="Father's Name" value={newStudent.fatherName} onChange={(e) => setNewStudent({ ...newStudent, fatherName: e.target.value })} className="w-full border p-2 rounded" />
              <input type="text" placeholder="Mobile" value={newStudent.mobile} onChange={(e) => setNewStudent({ ...newStudent, mobile: e.target.value })} className="w-full border p-2 rounded" />
              <input type="text" placeholder="Address" value={newStudent.address} onChange={(e) => setNewStudent({ ...newStudent, address: e.target.value })} className="w-full border p-2 rounded" />
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                <button onClick={handleAddStudent} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Add</button>
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

export default ClassDetails;
