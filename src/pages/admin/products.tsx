import { useState, useEffect } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import useSWR from "swr";

const AdminProducts: NextPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data: products, error, mutate } = useSWR("/api/products", fetcher);

  // Check if user is admin
  useEffect(() => {
    const adminStatus = localStorage.getItem("isAdmin");
    if (adminStatus !== "true") {
      router.push("/admin/login");
    } else {
      setIsAdmin(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    router.push("/admin/login");
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`/api/product/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          // Refresh the product list
          mutate();
          alert("Product deleted successfully!");
        } else {
          alert("Failed to delete product");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Error deleting product");
      }
    }
  };

  if (!isAdmin) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-products">
      <Head>
        <title>Manage Products - Admin Dashboard</title>
        <meta name="description" content="Manage products in admin dashboard" />
      </Head>

      <header className="admin-header">
        <div className="container">
          <h1>Manage Products</h1>
          <nav>
            <button onClick={handleLogout} className="btn btn--secondary">
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="container">
        <section className="admin-content">
          <div className="admin-sidebar">
            <ul>
              <li>
                <Link href="/admin/dashboard">Add Product</Link>
              </li>
              <li className="active">
                <Link href="/admin/products">Manage Products</Link>
              </li>
              <li>
                <Link href="/admin/orders">Orders</Link>
              </li>
              <li>
                <Link href="/admin/users">Users</Link>
              </li>
            </ul>
          </div>

          <div className="admin-main">
            <div className="admin-main-header">
              <h2>Product List</h2>
              <Link href="/admin/dashboard">
                <button className="btn btn--primary">Add New Product</button>
              </Link>
            </div>

            {error && (
              <div className="message error">
                Failed to load products: {error.message}
              </div>
            )}

            {!products && !error && (
              <div className="loading">Loading products...</div>
            )}

            {products && (
              <div className="products-table">
                <table>
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product: any) => (
                      <tr key={product.id}>
                        <td>
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              width="50"
                              height="50"
                            />
                          ) : (
                            <div className="no-image">No Image</div>
                          )}
                        </td>
                        <td>{product.name}</td>
                        <td>{product.category}</td>
                        <td>${product.currentPrice}</td>
                        <td>{product.quantityAvailable}</td>
                        <td>
                          <button
                            className="btn btn--danger"
                            onClick={() => handleDelete(product.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>

      <style jsx>{`
        .admin-products {
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

        .btn {
          display: inline-block;
          font-weight: 500;
          text-align: center;
          vertical-align: middle;
          cursor: pointer;
          border: 1px solid transparent;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
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

        .btn--secondary {
          color: #fff;
          background-color: #6c757d;
          border-color: #6c757d;
        }

        .btn--secondary:hover {
          background-color: #5a6268;
          border-color: #545b62;
        }

        .btn--danger {
          color: #fff;
          background-color: #dc3545;
          border-color: #dc3545;
        }

        .btn--danger:hover {
          background-color: #c82333;
          border-color: #bd2130;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .admin-content {
          display: flex;
          gap: 2rem;
          margin: 2rem 0;
        }

        .admin-sidebar {
          flex: 0 0 250px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 1.5rem;
        }

        .admin-sidebar ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .admin-sidebar li {
          margin-bottom: 0.5rem;
        }

        .admin-sidebar a {
          display: block;
          padding: 0.75rem 1rem;
          text-decoration: none;
          color: #333;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .admin-sidebar a:hover,
        .admin-sidebar .active a {
          background-color: #007bff;
          color: #fff;
        }

        .admin-main {
          flex: 1;
          background: #fff;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .admin-main-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .admin-main-header h2 {
          margin: 0;
          color: #333;
        }

        .message {
          padding: 1rem;
          border-radius: 4px;
          margin-bottom: 1.5rem;
        }

        .message.error {
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .loading {
          text-align: center;
          padding: 2rem;
          color: #666;
        }

        .products-table {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th,
        td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #dee2e6;
        }

        th {
          background-color: #f8f9fa;
          font-weight: 600;
          color: #495057;
        }

        tr:hover {
          background-color: #f8f9fa;
        }

        img {
          border-radius: 4px;
        }

        .no-image {
          width: 50px;
          height: 50px;
          background-color: #e9ecef;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          font-size: 0.75rem;
          color: #6c757d;
        }

        @media (max-width: 768px) {
          .admin-content {
            flex-direction: column;
          }

          .admin-sidebar {
            flex: 0 0 auto;
          }

          .admin-main-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminProducts;
