import { useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const AdminPanel: NextPage = () => {
  const [productData, setProductData] = useState({
    name: "",
    price: "",
    discount: "",
    quantityAvailable: "",
    category: "",
    currentPrice: "",
    sizes: "",
    colors: "",
    images: "",
  });
  const [message, setMessage] = useState<{ type: string; text: string } | null>(
    null
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Convert form data to proper types
    const product = {
      name: productData.name,
      price: parseFloat(productData.price),
      discount: productData.discount
        ? parseFloat(productData.discount)
        : undefined,
      quantityAvailable: parseInt(productData.quantityAvailable),
      category: productData.category,
      currentPrice: parseFloat(productData.currentPrice),
      sizes: productData.sizes
        ? productData.sizes.split(",").map((s) => s.trim())
        : [],
      colors: productData.colors
        ? productData.colors.split(",").map((c) => c.trim())
        : [],
      images: productData.images
        ? productData.images.split(",").map((i) => i.trim())
        : [],
      punctuation: {
        countOpinions: 0,
        punctuation: 0,
        votes: [],
      },
      reviews: [],
    };

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: `Product added successfully! ID: ${result.product._id}`,
        });
        // Reset form
        setProductData({
          name: "",
          price: "",
          discount: "",
          quantityAvailable: "",
          category: "",
          currentPrice: "",
          sizes: "",
          colors: "",
          images: "",
        });
      } else {
        setMessage({ type: "error", text: `Error: ${result.message}` });
      }
    } catch (error: any) {
      setMessage({ type: "error", text: `Error: ${error.message}` });
    }
  };

  return (
    <div className="admin-panel">
      <Head>
        <title>Admin Panel - Add Product</title>
        <meta name="description" content="Admin panel to add products" />
      </Head>

      <header className="admin-header">
        <div className="container">
          <h1>Admin Dashboard</h1>
          <nav>
            <Link href="/">← Back to Store</Link>
          </nav>
        </div>
      </header>

      <main className="container">
        <section className="admin-content">
          <h2>Add New Product</h2>

          {message && (
            <div className={`message ${message.type}`}>{message.text}</div>
          )}

          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-group">
              <label htmlFor="name">Product Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={productData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Original Price *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={productData.price}
                  onChange={handleChange}
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="currentPrice">Current Price *</label>
                <input
                  type="number"
                  id="currentPrice"
                  name="currentPrice"
                  value={productData.currentPrice}
                  onChange={handleChange}
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="discount">Discount (%)</label>
                <input
                  type="number"
                  id="discount"
                  name="discount"
                  value={productData.discount}
                  onChange={handleChange}
                  step="0.01"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="quantityAvailable">Quantity Available *</label>
                <input
                  type="number"
                  id="quantityAvailable"
                  name="quantityAvailable"
                  value={productData.quantityAvailable}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={productData.category}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="sizes">Sizes (comma separated)</label>
              <input
                type="text"
                id="sizes"
                name="sizes"
                value={productData.sizes}
                onChange={handleChange}
                placeholder="Small, Medium, Large"
              />
            </div>

            <div className="form-group">
              <label htmlFor="colors">Colors (comma separated)</label>
              <input
                type="text"
                id="colors"
                name="colors"
                value={productData.colors}
                onChange={handleChange}
                placeholder="Red, Blue, Green"
              />
            </div>

            <div className="form-group">
              <label htmlFor="images">Image URLs (comma separated)</label>
              <textarea
                id="images"
                name="images"
                value={productData.images}
                onChange={handleChange}
                rows={3}
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
              />
            </div>

            <button type="submit" className="btn btn--primary">
              Add Product
            </button>
          </form>
        </section>
      </main>

      <style jsx>{`
        .admin-panel {
          min-height: 100vh;
          background-color: #f8f9fa;
        }

        .admin-header {
          background-color: #fff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          padding: 1rem 0;
        }

        .admin-header .container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .admin-header h1 {
          margin: 0;
          color: #333;
        }

        .admin-header nav a {
          text-decoration: none;
          color: #007bff;
        }

        .admin-content {
          max-width: 800px;
          margin: 2rem auto;
          background: #fff;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .admin-content h2 {
          margin-top: 0;
          color: #333;
        }

        .message {
          padding: 1rem;
          border-radius: 4px;
          margin-bottom: 1.5rem;
        }

        .message.success {
          background-color: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .message.error {
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .product-form {
          margin-top: 1.5rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #555;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
          box-sizing: border-box;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
        }

        .btn {
          display: inline-block;
          font-weight: 400;
          text-align: center;
          vertical-align: middle;
          cursor: pointer;
          border: 1px solid transparent;
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          line-height: 1.5;
          border-radius: 0.25rem;
          transition:
            color 0.15s ease-in-out,
            background-color 0.15s ease-in-out,
            border-color 0.15s ease-in-out,
            box-shadow 0.15s ease-in-out;
        }

        .btn--primary {
          color: #fff;
          background-color: #007bff;
          border-color: #007bff;
        }

        .btn--primary:hover {
          background-color: #0069d9;
          border-color: #0062cc;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }

          .admin-content {
            margin: 1rem;
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminPanel;
