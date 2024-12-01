import { connectToDatabase } from "../../../utils/mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { db } = await connectToDatabase();

    // Fetch all orders from the "orders" collection
    const orders = await db.collection("orders").find({}).toArray();

    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching orders", error });
  }
}
