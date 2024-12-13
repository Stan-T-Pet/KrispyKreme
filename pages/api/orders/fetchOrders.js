import { connectToDatabase } from "../../../utils/db";

export default async function handler(req, res) {
  const { method } = req;

  if (method === "GET") {
    try {
      const { db } = await connectToDatabase();
      
      // Fetch all orders from the database
      const orders = await db.collection("orders").find().toArray();
      
      return res.status(200).json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      return res.status(500).json({ message: "Failed to fetch orders." });
    }
  }

  if (method === "POST") {
    const { customerName, products, totalCost } = req.body;

    if (!customerName || !products || !totalCost || !Array.isArray(products)) {
      return res.status(400).json({ message: "Invalid request body." });
    }

    try {
      const { db } = await connectToDatabase();

      const newOrder = {
        customerName,
        products,
        totalCost,
        date: new Date(),
      };

      const result = await db.collection("orders").insertOne(newOrder);

      return res.status(201).json({
        message: "Order placed successfully.",
        orderId: result.insertedId,
      });
    } catch (error) {
      console.error("Error placing order:", error);
      return res.status(500).json({ message: "Failed to place order." });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ message: `Method ${method} not allowed.` });
}
