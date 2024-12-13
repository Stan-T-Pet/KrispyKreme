import { connectToDatabase } from "../../../utils/db";
import { compare } from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  const { email, password } = req.body;

  // Validate input
  if (!email || !password || typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ message: "Invalid email or password." });
  }

  try {
    // Connect to the database
    const { db } = await connectToDatabase();

    // Find the user by email
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      console.error("Authentication failed for email:", email); // Debugging log
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Compare the entered password with the hashed password in the database
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      console.error("Authentication failed for email:", email); // Debugging log
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Redirect based on user role
    const redirectPath = user.role === "manager" ? "/manager" : "/customer";

    console.log(`Login successful for ${user.role}:`, email); // Debugging log
    return res.status(200).json({ redirectTo: redirectPath });
  } catch (error) {
    console.error("Internal login error:", error.message); // Debugging log
    return res.status(500).json({ message: "Internal server error." });
  }
}