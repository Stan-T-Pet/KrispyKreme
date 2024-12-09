import { connectToDatabase } from "../../../utils/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password } = req.body;

  try {
    const { db } = await connectToDatabase(); // Ensure this line works
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password." });
    }

    if (user.role === "manager") {
      return res.status(200).json({ redirectTo: "/manager" });
    } else if (user.role === "customer") {
      return res.status(200).json({ redirectTo: "/customer" });
    } else {
      return res.status(403).json({ message: "Unauthorized role." });
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}