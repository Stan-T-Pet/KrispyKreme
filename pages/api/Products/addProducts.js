import { connectToDatabase } from "../../../utils/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  const { title, description, price, image } = req.body;

  if (!title || !description || !price || !image) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const { db } = await connectToDatabase();

    const newProduct = {
      title,
      description,
      price: parseFloat(price),
      image,
      createdAt: new Date(),
    };

    await db.collection("products").insertOne(newProduct);

    res.status(201).json({ message: "Product added successfully!" });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Failed to add product." });
  }
}
