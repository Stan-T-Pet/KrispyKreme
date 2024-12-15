import { connectToDatabase } from "../../../utils/db";
import { hash } from "bcryptjs";
import validator from "validator";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Method not allowed." });
  }

  const { email, password, role } = req.body;

  // Validate and sanitize inputs
  if (!email || !password || !role) {
    return res.status(400).json({ message: "Missing required fields." });
  }
  const sanitizedEmail = validator.escape(email.trim());
  const sanitizedPassword = validator.escape(password.trim());
  const sanitizedRole = validator.escape(role.trim());

  if (!validator.isEmail(sanitizedEmail)) {
    return res.status(400).json({ message: "Invalid email format." });
  }
  if (sanitizedPassword.length < 6 || sanitizedPassword.length > 50) {
    return res.status(400).json({ message: "Password must be between 6 and 50 characters." });
  }

  try {
    const { db } = await connectToDatabase();

    const existingUser = await db.collection("users").findOne({ email: sanitizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists." });
    }

    const hashedPassword = await hash(sanitizedPassword, 10);
    await db.collection("users").insertOne({
      email: sanitizedEmail,
      password: hashedPassword,
      role: sanitizedRole,
      createdAt: new Date(),
    });

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}