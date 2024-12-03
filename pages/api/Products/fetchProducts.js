import { connectToDatabase } from "../../../utils/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  try {
    const { db } = await connectToDatabase();

    // Fetch all products and sort by title
    const products = await db
      .collection("products")
      .find({})
      .sort({ title: 1 })
      .toArray();

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products." });
  }
}