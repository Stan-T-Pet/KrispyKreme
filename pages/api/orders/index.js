import { connectToDatabase } from "../../../utils/db";

export default async function handler(req, res) {
  // Allow only GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  try {
    // Connect to the database
    const { db } = await connectToDatabase();

    // Fetch orders from the "orders" collection
    const orders = await db.collection("orders").find().toArray();

    // Respond with the orders
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders." });
  }
}