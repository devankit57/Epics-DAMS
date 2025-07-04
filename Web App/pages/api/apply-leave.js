// pages/api/add-leaves.js
import { connectToDatabase } from "../../utils/db";

import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]"; // Adjust the import path if needed

export default async function handler(req, res) {
  
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user?.email) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { date, reason } = req.body;

    if (!date || !reason) {
      return res.status(400).json({ message: "Date and reason are required" });
    }

    const { db } = await connectToDatabase();

    const result = await db.collection("leaves").insertOne({
      email: session.user.email,
      date,
      reason,
      status: "Pending", // default status
      createdAt: new Date(),
    });

    res.status(200).json({ message: "Leave applied successfully", id: result.insertedId });
  } catch (error) {
    console.error("Error applying leave:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
