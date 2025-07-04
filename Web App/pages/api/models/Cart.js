import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String },
  size: { type: String }
});

export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);
