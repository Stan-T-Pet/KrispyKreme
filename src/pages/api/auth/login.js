import { connectToDatabase } from "../../../utils/db";
import { compare } from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  const { email, password } = req.body;

  // Validate input
  if (!email || !password || typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ message: "Email and password are required." }); 
  }else{
    if (email.length > 50 || password.length > 50) {
      return res.status(400).json({ message: "Email/Password must be less than 50 characters." });
    }
  }

  try {
    const { db } = await connectToDatabase();

    // Find the user by email
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Compare the entered password with the hashed password in the database
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Redirect based on user role
    const redirectPath = user.role === "manager" ? "/manager" : "/customer";

    return res.status(200).json({ redirectTo: redirectPath });
  } catch (error) {
    console.error("Internal login error:", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
}