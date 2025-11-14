const fetch = require("node-fetch");

async function addProduct() {
  try {
    const response = await fetch("http://localhost:3000/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "iPhone 15 Pro",
        price: 79999,
        discount: 10,
        quantityAvailable: 50,
        category: "Electronics",
        currentPrice: 71999,
        sizes: ["Small", "Medium", "Large"],
        colors: ["Black", "White", "Blue"],
        images: [
          "https://example.com/image1.jpg",
          "https://example.com/image2.jpg",
        ],
        punctuation: {
          countOpinions: 100,
          punctuation: 4.5,
          votes: [
            { value: 5, count: 60 },
            { value: 4, count: 30 },
            { value: 3, count: 10 },
          ],
        },
        reviews: [
          {
            name: "John Doe",
            avatar: "https://example.com/avatar1.jpg",
            description: "Great phone with excellent camera quality",
            punctuation: 5,
          },
          {
            name: "Jane Smith",
            avatar: "https://example.com/avatar2.jpg",
            description: "Good performance but battery could be better",
            punctuation: 4,
          },
        ],
      }),
    });

    const result = await response.json();
    console.log("Product added result:", result);
  } catch (error) {
    console.error("Error adding product:", error);
  }
}

addProduct();
