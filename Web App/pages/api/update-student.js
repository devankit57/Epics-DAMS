// pages/api/update-student.js

import { connectToDatabase } from "../../utils/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { _id, name, fatherName, mobile, address } = req.body;

    if (!_id) return res.status(400).json({ message: "Missing student ID" });

    const { db } = await connectToDatabase();

    const result = await db.collection("students").updateOne(
      { _id: new ObjectId(_id) },
      {
        $set: {
          name,
          fatherName,
          mobile,
          address,
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ message: "Student updated successfully" });
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
