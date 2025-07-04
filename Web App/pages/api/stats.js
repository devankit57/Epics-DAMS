import { connectToDatabase } from "../../utils/db";

export default async function handler(req, res) {
  const { db } = await connectToDatabase();

  try {
    // Total number of students
    const totalStudents = await db.collection("students").countDocuments();

    // Today's present students from "attendance" collection
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const todayPresent = await db.collection("attendance").countDocuments({
      date: { $gte: startOfDay, $lte: endOfDay },
      status: "present",
    });

    // Pending leave requests from "leaves" collection
    const pendingLeaves = await db.collection("leaves").countDocuments({ status: "pending" });

    return res.status(200).json({
      success: true,
      data: {
        totalStudents,
        todayPresent,
        pendingLeaves,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
