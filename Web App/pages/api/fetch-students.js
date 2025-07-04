// pages/api/fetch-students.js
import { connectToDatabase } from "../../utils/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { className } = req.body;

    if (!className) {
      return res.status(400).json({ message: "Class name is required" });
    }

    try {
      const { db } = await connectToDatabase();

      const students = await db
        .collection("students")
        .find({ className })
        .toArray();

      return res.status(200).json(students);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
