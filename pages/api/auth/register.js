import {hash } from "bcryptjs";
import {connectToDatabase } from "../../../utils/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, pass, confirmEmail, confirmPass } = req.body;

  if (!email || !pass || !confirmEmail || !confirmPass) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (email !== confirmEmail || pass !== confirmPass) {
    return res.status(400).json({ message: "Emails or passwords do not match." });
  }

  try {
    const { db } = await connectToDatabase();

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists." });
    }

    // Hash the password
    const hashedPassword = await hash(pass, 10);

    // Insert new user into the database
    await db.collection("users").insertOne({
      email,
      password: hashedPassword,
      role: "customer", // Default role
      createdAt: new Date(),
    });

    return res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Internal server error." });
    return res.status(500).json({ message: "Internal server error." });
  }
}