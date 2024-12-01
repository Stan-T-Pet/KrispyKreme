const { MongoClient } = require("mongodb");

// Recreate Database
async function recreateDatabase() {
  if (!process.env.MONGODB_URI || !process.env.MONGODB_DB) {
    throw new Error("Environment variables MONGODB_URI and MONGODB_DB must be defined");
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db(process.env.MONGODB_DB);

  try {
    console.log("Dropping existing collections...");
    const collections = await db.collections();
    for (let collection of collections) {
      await db.collection(collection.collectionName).drop();
    }

    console.log("Creating collections...");

    // Users collection
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

    // Products collection
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

    // Orders collection
    await db.createCollection("orders", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["customerId", "products", "totalCost", "date"],
          properties: {
            customerId: { bsonType: "objectId" },
            products: {
              bsonType: "array",
              items: {
                bsonType: "object",
                required: ["productId", "name", "quantity", "price"],
                properties: {
                  productId: { bsonType: "objectId" },
                  name: { bsonType: "string" },
                  quantity: { bsonType: "int" },
                  price: { bsonType: "double" },
                },
              },
            },
          },
        },
      },
    });

    console.log("Database setup complete.");
  } catch (error) {
    console.error("Error recreating database:", error);
  } finally {
    client.close();
  }
}

// Populate Database
async function populateDatabase() {
  const client = await MongoClient.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db(process.env.MONGODB_DB);

  try {
    console.log("Populating database with initial data...");

    // Insert initial users
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

    // Insert initial products
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

    console.log("Initial data inserted.");
  } catch (error) {
    console.error("Error populating database:", error);
  } finally {
    client.close();
  }
}

// Main Execution
(async () => {
  await recreateDatabase();
  await populateDatabase();
})();