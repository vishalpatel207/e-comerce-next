import { useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";

const AdminLogin: NextPage = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.username,
          password: credentials.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Store admin status in localStorage
        localStorage.setItem("isAdmin", "true");
        router.push("/admin/dashboard");
      } else {
        setError(data.message || "Invalid credentials. Please try again.");
      }
    } catch (error: any) {
      setError("An error occurred. Please try again.");
      console.error("Login error:", error);
    }
  };

  return (
    <div className="admin-login">
      <Head>
        <title>Admin Login</title>
        <meta name="description" content="Admin login panel" />
      </Head>

      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>Admin Login</h1>
            <p>Sign in to access the admin panel</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Email</label>
              <input
                type="email"
                id="username"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn--primary">
              Sign In
            </button>
          </form>

          <div className="login-footer">
            <Link href="/">← Back to Store</Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-login {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .login-container {
          width: 100%;
          max-width: 400px;
        }

        .login-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          padding: 2rem;
        }

        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .login-header h1 {
          margin: 0 0 0.5rem 0;
          color: #333;
          font-size: 1.75rem;
        }

        .login-header p {
          margin: 0;
          color: #666;
        }

        .error-message {
          background-color: #f8d7da;
          color: #721c24;
          padding: 0.75rem;
          border-radius: 4px;
          margin-bottom: 1.5rem;
          border: 1px solid #f5c6cb;
        }

        .login-form {
          margin-bottom: 1.5rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #555;
        }

        .form-group input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
          box-sizing: border-box;
        }

        .form-group input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.25);
        }

        .btn {
          display: inline-block;
          font-weight: 500;
          text-align: center;
          vertical-align: middle;
          cursor: pointer;
          border: 1px solid transparent;
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          line-height: 1.5;
          border-radius: 4px;
          transition: all 0.2s;
          width: 100%;
        }

        .btn--primary {
          color: #fff;
          background-color: #667eea;
          border-color: #667eea;
        }

        .btn--primary:hover {
          background-color: #5a6fd8;
          border-color: #5a6fd8;
        }

        .login-footer {
          text-align: center;
        }

        .login-footer a {
          color: #667eea;
          text-decoration: none;
        }

        .login-footer a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
