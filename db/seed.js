import db from "#db/client";
import bcrypt from "bcrypt";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  const hashedPassword = await bcrypt.hash("password123", 10);
  const {
    rows: [user],
  } = await db.query(
    "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
    ["shopuser", hashedPassword],
  );

  const productData = [
    {
      title: "Wireless Headphones",
      description: "Over-ear noise cancelling headphones",
      price: 79.99,
    },
    {
      title: "Mechanical Keyboard",
      description: "Tenkeyless mechanical keyboard with RGB",
      price: 59.99,
    },
    {
      title: "USB-C Hub",
      description: "7-in-1 hub with HDMI and SD card slots",
      price: 34.99,
    },
    {
      title: "Webcam",
      description: "1080p HD webcam with built-in microphone",
      price: 49.99,
    },
    {
      title: "Monitor Stand",
      description: "Adjustable aluminum monitor riser",
      price: 29.99,
    },
    {
      title: "Mouse Pad",
      description: "Extra large desk mat in black",
      price: 14.99,
    },
    {
      title: "LED Desk Lamp",
      description: "Dimmable LED lamp with USB charging port",
      price: 24.99,
    },
    {
      title: "Laptop Stand",
      description: "Foldable aluminum laptop stand",
      price: 39.99,
    },
    {
      title: "Cable Management Box",
      description: "Large cable organizer with cord clips",
      price: 19.99,
    },
    {
      title: "Wireless Mouse",
      description: "Ergonomic wireless mouse with long battery life",
      price: 27.99,
    },
    {
      title: "Desk Organizer",
      description: "Bamboo desktop organizer with drawer",
      price: 22.99,
    },
    {
      title: "Screen Cleaner Kit",
      description: "Microfiber cloth and spray for screens",
      price: 9.99,
    },
  ];

  const insertedProducts = [];
  for (const p of productData) {
    const {
      rows: [product],
    } = await db.query(
      "INSERT INTO products (title, description, price) VALUES ($1, $2, $3) RETURNING *",
      [p.title, p.description, p.price],
    );
    insertedProducts.push(product);
  }

  const {
    rows: [order],
  } = await db.query(
    "INSERT INTO orders (date, note, user_id) VALUES ($1, $2, $3) RETURNING *",
    ["2024-01-15", "First order", user.id],
  );

  for (const product of insertedProducts.slice(0, 5)) {
    await db.query(
      "INSERT INTO orders_products (order_id, product_id, quantity) VALUES ($1, $2, $3)",
      [order.id, product.id, 1],
    );
  }
}
