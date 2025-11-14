const fetch = require("node-fetch");

async function seedDatabase() {
  try {
    const response = await fetch("http://localhost:3000/api/seed-products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    console.log("Database seeding result:", result);
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seedDatabase();
