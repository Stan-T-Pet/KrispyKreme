import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { connectToDatabase } from "../../../utils/db";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    const { db } = await connectToDatabase();
    const userId = session.user.id;

    await db.collection("cart").deleteMany({ userId });

    res.status(200).json({ message: "Cart cleared successfully." });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ message: "Failed to clear cart." });
  }
}
