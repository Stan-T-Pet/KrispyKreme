import { connectToDatabase } from "../../../utils/db";
import { hash } from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Method not allowed." });
  }

  const { email, password, role } = req.body;

  // Validate input
  if (!email || !password || !role) {
    return res.status(400).json({ message: "Missing required fields." });
  }
  if (email.length > 50) {
    return res.status(400).json({ message: "Email must be less than 50 characters." });
  }
  if (password.length > 50) {
    return res.status(400).json({ message: "Password must be less than 50 characters." });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long." });
  }

  try {
    const { db } = await connectToDatabase();

    // Check if the user already exists
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists." });
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Insert new user into the database, with hashed pass
    const newUser = {
      email,
      password: hashedPassword,
      role,
      createdAt: new Date(),
    };

    await db.collection("users").insertOne(newUser);

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}