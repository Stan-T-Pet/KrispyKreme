import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../../utils/mongodb";
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { customerId, products, totalPrice, email } = req.body;

  if (!customerId || !products || !totalPrice || !email) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const { db } = await connectToDatabase();

    // Create a new order document
    const order = {
      customerId: new ObjectId(customerId),
      products,
      totalPrice,
      orderTime: new Date(),
    };

    // Insert the order into the database
    const result = await db.collection("orders").insertOne(order);

    // Send email confirmation to the customer
    const transporter = nodemailer.createTransport({
      service: "Gmail", // You can change this to your preferred email service
      auth: {
        user: process.env.EMAIL_USER, // Set this in your .env file
        pass: process.env.EMAIL_PASS, // Set this in your .env file
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Order Confirmation",
      text: `Thank you for your order! Here are the details:\n\nOrder ID: ${
        result.insertedId
      }\nProducts:\n${products
        .map((p) => `${p.name} x${p.quantity} - €${p.price}`)
        .join("\n")}\n\nTotal: €${totalPrice}\n\nOrder Time: ${new Date().toLocaleString()}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: "Order placed successfully!",
      orderId: result.insertedId,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Error placing order", error });
  }
}
