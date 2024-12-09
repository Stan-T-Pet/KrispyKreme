//user1 = lIInUfkfo2vywxET


import { compare } from "bcryptjs";
import { connectToDatabase } from "../../../utils/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const { db } = await connectToDatabase();

    // Find the user in the database
    const user = await db.collection("users").findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Verify the password
    const isValidPassword = await compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    return res.status(200).json({ role: user.role });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}