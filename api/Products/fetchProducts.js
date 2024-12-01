import { connectToDatabase } from "../../../utils/mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { db } = await connectToDatabase();

    // Fetch all products from the "products" collection
    const products = await db.collection("products").find({}).toArray();

    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching products", error });
  }
}
