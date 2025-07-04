// pages/api/add-lesson.js
import { connectToDatabase } from "../../utils/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { week, description, className } = req.body;

    if (!week || !description || !className) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const { db } = await connectToDatabase();

    const result = await db.collection("lessons").insertOne({
      week,
      description,
      className,
      createdAt: new Date(),
    });

    res.status(200).json({ message: "Lesson added successfully", id: result.insertedId });
  } catch (error) {
    console.error("Error adding lesson:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
