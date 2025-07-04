// pages/api/fetch-classes.js
import { connectToDatabase } from "../../utils/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    try {
      const { db } = await connectToDatabase();

      const classes = await db
        .collection("classes")
        .find({ teacherEmail: email })
        .toArray();

      return res.status(200).json(classes);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
