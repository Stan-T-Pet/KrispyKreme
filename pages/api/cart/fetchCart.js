import { getSession } from "next-auth/react";
import { connectToDatabase } from "../../../utils/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  try {
    const { db } = await connectToDatabase();
    const cartItems = await db
      .collection("cart")
      .find({ userId: session.user.id })
      .toArray();

    res.status(200).json(cartItems);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ message: "Failed to fetch cart items." });
  }
}