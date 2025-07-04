// pages/api/fetch-lessons.js
import { connectToDatabase } from "../../utils/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { className } = req.body;

    if (!className) {
      return res.status(400).json({ message: "Class name is required" });
    }

    const { db } = await connectToDatabase();
    const lessons = await db.collection("lessons").find({ className }).toArray();

    res.status(200).json(lessons);
  } catch (error) {
    console.error("Error fetching lessons:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
