import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { connectToDatabase } from "../../../utils/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    const { db } = await connectToDatabase();
    const userId = session.user.id;

    const cartItems = await db
      .collection("cart")
      .aggregate([
        {
          $match: { userId },
        },
        {
          $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        {
          $unwind: "$productDetails",
        },
        {
          $project: {
            _id: 1,
            productId: 1,
            quantity: 1,
            price: "$productDetails.price",
            productName: "$productDetails.title",
          },
        },
      ])
      .toArray();

    res.status(200).json(cartItems);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Failed to fetch cart items." });
  }
}