import { connectToDatabase } from "../../../utils/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: `Method ${req.method} not allowed.` });
  }

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

    res.status(201).json({
      message: "Order placed successfully.",
      orderId: result.insertedId,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Failed to place order." });
  }
}