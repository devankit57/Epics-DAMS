import { connectToDatabase } from "../../../utils/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    if (req.method !== "DELETE") {
        res.setHeader("Allow", ["DELETE"]);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }

    try {
        const { id } = req.query;
        const { db } = await connectToDatabase();

        // Ensure the ID is valid
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        const result = await db.collection("cart").deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        res.status(200).json({ message: "Item removed from cart successfully" });
    } catch (error) {
        console.error("Error deleting cart item:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}