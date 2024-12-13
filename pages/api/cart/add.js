import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { connectToDatabase } from "../../../utils/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    const { productId, quantity } = req.body;

    if (!productId || typeof quantity !== "number" || quantity <= 0) {
      return res.status(400).json({ message: "Invalid product or quantity." });
    }

    const { db } = await connectToDatabase();
    const userId = session.user.id;

    await db.collection("cart").updateOne(
      { userId, productId: new ObjectId(productId) },
      { $inc: { quantity } },
      { upsert: true }
    );

    res.status(200).json({ message: "Product added to cart successfully." });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}