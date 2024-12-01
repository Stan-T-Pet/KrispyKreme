import { compare } from "bcryptjs";
import { connectToDatabase } from "../../../utils/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  try {
    const { db } = await connectToDatabase();

    // Find user in the database
    const user = await db.collection("users").findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare passwords
    const isValid = await compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Optional: Generate a session or token (e.g., JWT)
    // const token = generateToken({ email: user.email, role: user.role });

    // Return the user's role
    return res.status(200).json({ role: user.role });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Error logging in" });
  }
}