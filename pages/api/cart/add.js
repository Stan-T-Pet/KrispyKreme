import { getSession } from "next-auth/react";
import { connectToDatabase } from "../../../utils/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  const session = await getSession({ req });

  console.log("Session Data:", session); // Debug log to inspect the session

  if (!session) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  const { productId, quantity } = req.body;

  if (!productId || !quantity || quantity <= 0) {
    return res.status(400).json({ message: "Invalid product or quantity." });
  }

  try {
    const { db } = await connectToDatabase();

    const product = await db.collection("products").findOne({ _id: productId });

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    await db.collection("cart").updateOne(
      { userId: session.user.id, productId },
      {
        $set: {
          userId: session.user.id,
          productId,
          productName: product.title,
          price: product.price,
        },
        $inc: { quantity },
      },
      { upsert: true }
    );

    res.status(200).json({ message: "Product added to cart successfully." });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Failed to add product to cart." });
  }
}