import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import Layout from "../layouts/Main";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

const ProfilePage = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      // Redirect to login if not authenticated
      router.push("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setLoading(false);
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Redirect to login page
    router.push("/login");
  };

  if (loading) {
    return (
      <Layout>
        <div className="container">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="form-page">
        <div className="container">
          <div className="back-button-section">
            <Link href="/">
              <i className="icon-left" />
              Back to home
            </Link>
          </div>

          <div className="form-block">
            <h2 className="form-block__title">My Profile</h2>

            {user && (
              <div className="profile-info">
                <div className="profile-info__item">
                  <label>First Name:</label>
                  <p>{user.firstName}</p>
                </div>

                <div className="profile-info__item">
                  <label>Last Name:</label>
                  <p>{user.lastName}</p>
                </div>

                <div className="profile-info__item">
                  <label>Email:</label>
                  <p>{user.email}</p>
                </div>

                <button
                  onClick={handleLogout}
                  className="btn btn--rounded btn--yellow"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <style jsx>{`
        .profile-info {
          margin-top: 2rem;
        }

        .profile-info__item {
          margin-bottom: 1.5rem;
        }

        .profile-info__item label {
          display: block;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }

        .profile-info__item p {
          padding: 0.5rem;
          background-color: #f5f5f5;
          border-radius: 4px;
        }
      `}</style>
    </Layout>
  );
};

export default ProfilePage;
