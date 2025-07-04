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
  Download,
  Upload,
} from "lucide-react";
import * as XLSX from "xlsx";
import { Dialog } from "@headlessui/react";

const ScoreDetails = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [active, setActive] = useState("score");

  const [className, setClassName] = useState("");
  const [scoreRecords, setScoreRecords] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status]);

  const fetchScores = async () => {
    if (!className) return;

    try {
      const res = await fetch("/api/fetch-scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ className }),
      });

      const data = await res.json();
      setScoreRecords(data);
    } catch (error) {
      console.error("Failed to fetch scores:", error);
    }
  };

  useEffect(() => {
    if (className) fetchScores();
  }, [className]);

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(scoreRecords);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Scores");
    XLSX.writeFile(workbook, "score_details.xlsx");
  };

  const handleExcelUpload = async () => {
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      try {
        const res = await fetch("/api/upload-scores", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ className, scores: jsonData }),
        });

        if (res.ok) {
          fetchScores();
          setShowUploadModal(false);
        } else {
          alert("Failed to upload scores.");
        }
      } catch (err) {
        console.error(err);
        alert("Error uploading file.");
      }
    };

    reader.readAsArrayBuffer(selectedFile);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Head>
        <title>DAMS | Scores</title>
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
          <h1 className="text-3xl font-bold text-gray-700">Score Details</h1>
          <div className="flex items-center space-x-6">
            <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-500 transition" />
            <User className="w-8 h-8 rounded-full bg-gray-300 cursor-pointer" />
          </div>
        </div>

        {/* Filters + Table */}
        <div className="p-8">
          <div className="flex flex-col md:flex-row justify-between gap-4 items-center mb-4">
            <div className="flex items-center gap-4">
              <label className="text-gray-700 font-medium">Select :</label>
              <select
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="border px-4 py-2 rounded-lg shadow-sm"
              >
                <option value="">-- Choose Term --</option>
                <option value="midTerm">Mid-Term</option>
                <option value="termEnd">Term-End</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDownloadExcel}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow"
              >
                <Download className="w-5 h-5" />
                Download Excel
              </button>

              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
              >
                <Upload className="w-5 h-5" />
                Upload Excel
              </button>
            </div>
          </div>

          <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white text-left">
                  <th className="p-4">Student Name</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Score</th>
                  <th className="p-4">Total</th>
                </tr>
              </thead>
              <tbody>
                {scoreRecords.length > 0 ? (
                  scoreRecords.map((record, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-4">{record.studentName}</td>
                      <td className="p-4">{record.subject}</td>
                      <td className="p-4">{record.score}</td>
                      <td className="p-4">{record.total}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-4" colSpan="4">No score records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Upload Modal (Fixed) */}
     {/* Upload Modal (Modern UI) */}
     <Dialog open={showUploadModal} onClose={() => setShowUploadModal(false)} className="relative z-50">
  <div className="fixed inset-0 flex items-center justify-center p-4">
    {/* Overlay */}
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm transition-opacity" aria-hidden="true" />

    {/* Modal Panel */}
    <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full p-8 z-50 animate-fade-in">
      <Dialog.Title className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Upload className="w-6 h-6 text-blue-600" />
        Upload Excel File
      </Dialog.Title>

      {/* Category Selection */}
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium text-gray-700">Select Category</label>
        <select
          value={className}
          
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Choose Term --</option>
          <option value="midTerm">Mid-Term</option>
          <option value="termEnd">Term-End</option>
        </select>
      </div>

      {/* Drop Area */}
      <label
        htmlFor="excel-upload"
        className="flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-xl p-6 text-center cursor-pointer hover:bg-blue-50 transition"
      >
        <Upload className="w-12 h-12 text-blue-400 mb-2" />
        <span className="text-sm text-gray-600">Click to browse or drag & drop your Excel file here</span>
        <input
          id="excel-upload"
          type="file"
          accept=".xlsx, .xls"
          onChange={(e) => setSelectedFile(e.target.files[0])}
          className="hidden"
        />
      </label>

      {selectedFile && (
        <p className="mt-3 text-sm text-green-600 font-medium truncate">
          Selected File: <span className="text-gray-800">{selectedFile.name}</span>
        </p>
      )}

      {/* Buttons */}
      <div className="flex justify-end mt-6 space-x-3">
        <button
          onClick={() => setShowUploadModal(false)}
          className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleExcelUpload}
          className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
        >
          Upload
        </button>
      </div>
    </div>
  </div>
</Dialog>


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

export default ScoreDetails;
