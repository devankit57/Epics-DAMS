// pages/api/fetch-attendance.js
import { connectToDatabase } from "../../utils/db";
import { startOfDay, endOfDay } from "date-fns";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { db } = await connectToDatabase();
      const { date, className } = req.query;

      const query = {};

      // Filter by className if provided
      if (className) {
        query["user.classGroup"] = className;
      }

      // Filter by date if provided
      if (date) {
        const start = startOfDay(new Date(date));
        const end = endOfDay(new Date(date));
        query.timestamp = {
          $gte: start,
          $lte: end,
        };
      }

      const attendanceRecords = await db
        .collection("attendance")
        .find(query)
        .sort({ timestamp: -1 }) // latest first
        .toArray();

      return res.status(200).json({ attendance: attendanceRecords });
    } catch (error) {
      console.error("Error fetching attendance:", error);
      return res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
