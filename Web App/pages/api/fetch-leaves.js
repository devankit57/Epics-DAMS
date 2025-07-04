
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]"; // Adjust the import path if needed

import { connectToDatabase } from "../../utils/db";

export default async function handler(req, res) {
  

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user?.email) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userEmail = session.user.email;

    const { db } = await connectToDatabase();

    const leaves = await db
      .collection("leaves")
      .find({ email: userEmail })
      .sort({ date: -1 }) // Sort by latest first
      .toArray();

    res.status(200).json(leaves);
  } catch (error) {
    console.error("Error fetching leaves:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
