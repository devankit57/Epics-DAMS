import { connectToDatabase } from "../../utils/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const { db } = await connectToDatabase();
    const notifications = await db
      .collection("notifications")
      .find({})
      .sort({ _id: -1 })
      .limit(5)
      .toArray();

    res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}
