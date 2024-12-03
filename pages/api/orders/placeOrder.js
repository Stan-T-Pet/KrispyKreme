import { connectToDatabase } from "@/utils/mongoDb"; // Assumes a utility function to connect to MongoDB

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { db } = await connectToDatabase();
      const { customerName, products, totalCost } = req.body;

      if (!customerName || !products || !totalCost) {
        return res.status(400).json({ message: "Missing required fields." });
      }

      const newOrder = {
        customerName,
        products,
        totalCost,
        date: new Date().toISOString(),
      };

      const result = await db.collection("orders").insertOne(newOrder);

      res.status(201).json({ message: "Order placed successfully.", orderId: result.insertedId });
    } catch (error) {
      console.error("Error placing order:", error);
      res.status(500).json({ message: "Failed to place order." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}