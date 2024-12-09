import { connectToDatabase } from "../../../utils/db";
import { hash } from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  const { email, pass } = req.body;

  if (!email || !pass) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const { db } = await connectToDatabase();

    // Check if the user already exists
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists." });
    }

    // Hash the password
    const hashedPassword = await hash(pass, 10);

    // Insert the new user
    await db.collection("users").insertOne({
      email,
      password: hashedPassword,
      role: "customer", // Default role
      createdAt: new Date(),
    });

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Failed to register user." });
  }
}