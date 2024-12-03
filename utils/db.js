import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

export async function connectToDatabase() {
  if (!client.isConnected) {
    await client.connect();
  }
  const db = client.db();
  return { db };
}

export async function recreateDatabase() {
  const { db } = await connectToDatabase();
  try {
    //console.log("Dropping existing collections...");
    const collections = await db.collections();
    for (let collection of collections) {
      await db.collection(collection.collectionName).drop();
    }

    console.log("Creating collections...");
    await db.createCollection("users", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["name", "email", "password", "role", "createdAt"],
          properties: {
            name: { bsonType: "string" },
            email: { bsonType: "string" },
            password: { bsonType: "string" },
            role: { bsonType: "string", enum: ["customer", "manager"] },
            createdAt: { bsonType: "date" },
          },
        },
      },
    });

    await db.createCollection("products", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["title", "price", "createdAt"],
          properties: {
            title: { bsonType: "string" },
            description: { bsonType: "string" },
            price: { bsonType: "double" },
            image: { bsonType: "string" },
            createdAt: { bsonType: "date" },
          },
        },
      },
    });

    console.log("Database schema created successfully.");
  } catch (error) {
    console.error("Error recreating database:", error);
  }
}

export async function populateDatabase() {
  const { db } = await connectToDatabase();
  try {
    console.log("Populating database with initial data...");

    await db.collection("users").insertMany([
      {
        name: "Admin User",
        email: "admin@example.com",
        password: "hashed_password",
        role: "manager",
        createdAt: new Date(),
      },
      {
        name: "John Doe",
        email: "john@example.com",
        password: "hashed_password",
        role: "customer",
        createdAt: new Date(),
      },
    ]);

    await db.collection("products").insertMany([
      {
        title: "Chocolate Donut",
        description: "Delicious donut covered in chocolate.",
        price: 2.99,
        image: "https://example.com/donut.jpg",
        createdAt: new Date(),
      },
      {
        title: "Vanilla Donut",
        description: "Classic donut with vanilla glaze.",
        price: 2.49,
        image: "https://example.com/vanilla_donut.jpg",
        createdAt: new Date(),
      },
    ]);

    console.log("Database populated successfully.");
  } catch (error) {
    console.error("Error populating database:", error);
  }
}