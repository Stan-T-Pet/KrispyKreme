import { connectToDatabase } from "../../../utils/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  const { productId, quantity } = req.body;

  if (!productId || !quantity || quantity <= 0) {
    return res.status(400).json({ message: "Invalid product or quantity." });
  }

  try {
    const { db } = await connectToDatabase();

    // Add product to cart collection
    await db.collection("cart").updateOne(
      { productId },
      { $inc: { quantity } },
      { upsert: true } // Create if not exists
    );

    res.status(200).json({ message: "Product added to cart." });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Failed to add to cart." });
  }
}