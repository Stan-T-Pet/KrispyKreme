import { connectToDatabase } from "../../../utils/db";
import { hash } from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Method not allowed." });
  }

  const { email, password, role } = req.body;

  // Validate request body
  if (!email || !password || !role) {
    return res.status(400).json({ message: "Missing required fields." });
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

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Insert the new user into the database
    const newUser = {
      email,
      password: hashedPassword,
      role,
      createdAt: new Date(),
    };

    await db.collection("users").insertOne(newUser);

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    // Log errors for debugging
    console.error("Error during registration:", error);

    // Return a generic error response to avoid exposing sensitive details
    res.status(500).json({ message: "Internal server error." });
  }
}