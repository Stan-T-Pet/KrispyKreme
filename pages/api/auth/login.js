import { connectToDatabase } from "../../../utils/db";
import { compare } from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    // Connect to the database
    const { db } = await connectToDatabase();
    
    // Find the user by email
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      console.error("User not found:", email); // Debugging log
      return res.status(404).json({ message: "User not found." });
    }

    // Compare the entered password with the hashed password in the database
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      console.error("Invalid password for user:", email); // Debugging log
      return res.status(401).json({ message: "Invalid password." });
    }

    // Redirect based on user role
    if (user.role === "manager") {
      console.log("Manager login successful:", email); // Debugging log
      return res.status(200).json({ redirectTo: "/manager" });
    } else if (user.role === "customer") {
      console.log("Customer login successful:", email); // Debugging log
      return res.status(200).json({ redirectTo: "/customer" });
    } else {
      console.error("Unauthorized role for user:", email); // Debugging log
      return res.status(403).json({ message: "Unauthorized role." });
    }
  } catch (error) {
    console.error("Login error:", error.message); // Debugging log
    return res.status(500).json({ message: "Internal server error." });
  }
}