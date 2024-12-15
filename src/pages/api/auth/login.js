import { connectToDatabase } from "../../../utils/db";
import { compare } from "bcryptjs";
import validator from "validator";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const sanitizedEmail = validator.escape(email.trim());
  const sanitizedPassword = validator.escape(password.trim());

  if (!validator.isEmail(sanitizedEmail)) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  try {
    const { db } = await connectToDatabase();
    const user = await db.collection("users").findOne({ email: sanitizedEmail });

    if (!user || !(await compare(sanitizedPassword, user.password))) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const redirectPath = user.role === "manager" ? "/manager" : "/customer";
    res.status(200).json({ redirectTo: redirectPath });
  } catch (error) {
    console.error("Internal login error:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
}