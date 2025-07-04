import React, { useState, useEffect } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
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

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [notifications, setNotifications] = useState([]);

  const fetchDashboardData = async () => {
    const res = await fetch("/api/notifications");
    const data = await res.json();
    if (data.success) {
      setNotifications(data.notifications);
    }
  };

  // Initial Data Fetch
  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetchDashboardData();
    }
  }, [status, session]);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    todayPresent: 0,
    pendingLeaves: 0,
  });
  
  const fetchDashboardStats = async () => {
    const res = await fetch("/api/stats");
    const data = await res.json();
    if (data.success) {
      setStats(data.data);
    }
  };
  
  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetchDashboardStats();
      fetchDashboardData(); // notifications
    }
  }, [status, session]);
  
  // Determine active tab from route
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
    <div className="flex h-screen bg-gray-100">
      <Head>
        <title>DAMS | Dashboard</title>
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
          <h1 className="text-3xl font-bold text-gray-700 capitalize">
            {active}
          </h1>
          <div className="flex items-center space-x-6">
            <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-500 transition" />
            <User className="w-8 h-8 rounded-full bg-gray-300 cursor-pointer" />
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
  title="Total Students"
  value={stats.totalStudents.toString()}
  percentage="+12%" // Optional: You can calculate trends later
  color="from-green-400 to-green-600"
/>
<DashboardCard
  title="Today's Present"
  value={stats.todayPresent.toString()}
  percentage="+3%"
  color="from-blue-400 to-blue-600"
/>
<DashboardCard
  title="Pending Leaves"
  value={stats.pendingLeaves.toString()}
  percentage=""
  color="from-yellow-400 to-yellow-600"
/>

        </div>

        {/* Recent Notifications */}
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Recent Notifications</h2>
          <div className="bg-white shadow-lg rounded-xl p-6 space-y-4">
            {notifications.length === 0 ? (
              <p className="text-gray-500">No recent notifications available.</p>
            ) : (
              notifications.map((item) => (
                <ActivityItem
                  key={item._id}
                  title={item.title}
                  description={item.description}
                />
              ))
            )}
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

// Dashboard Card Component
const DashboardCard = ({ title, value, percentage, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className={`p-6 bg-gradient-to-br ${color} rounded-2xl shadow-lg text-white`}
  >
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="text-3xl font-bold mt-2">{value}</p>
    <p
      className={`mt-1 text-sm ${
        percentage.startsWith("+") ? "text-green-200" : "text-red-200"
      }`}
    >
      {percentage} from last month
    </p>
  </motion.div>
);

// Activity Item Component
const ActivityItem = ({ title, description }) => (
  <div className="flex items-start space-x-4">
    <div className="w-3 h-3 bg-blue-500 rounded-full mt-1"></div>
    <div>
      <h4 className="text-lg font-semibold text-gray-800">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

export default Dashboard;
