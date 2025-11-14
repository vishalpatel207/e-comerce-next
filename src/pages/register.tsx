import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

import Layout from "../layouts/Main";
import { server } from "../utils/server";

type RegisterData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  signedIn?: boolean;
};

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterData>();
  const router = useRouter();

  const onSubmit = async (data: RegisterData) => {
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        // Registration successful, redirect to login page
        router.push("/login");
      } else {
        // Handle error messages
        let errorMessage = result.message;
        // Provide more specific error message for database issues
        if (result.error === "Authentication failed") {
          errorMessage =
            "Database connection failed. Please contact the administrator.";
        }
        setError("email", {
          type: "manual",
          message: errorMessage,
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("email", {
        type: "manual",
        message: "An error occurred during registration",
      });
    }
  };

  return (
    <Layout>
      <section className="form-page">
        <div className="container">
          <div className="back-button-section">
            <Link href="/products">
              <i className="icon-left" />
              Back to store
            </Link>
          </div>

          <div className="form-block">
            <h2 className="form-block__title">
              Create an account and discover the benefits
            </h2>
            <p className="form-block__description">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s
            </p>

            <form className="form" onSubmit={handleSubmit(onSubmit)}>
              <div className="form__input-row">
                <input
                  className="form__input"
                  placeholder="First Name"
                  type="text"
                  {...register("firstName", {
                    required: "First name is required",
                  })}
                />
                {errors.firstName && (
                  <p className="message message--error">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="form__input-row">
                <input
                  className="form__input"
                  placeholder="Last Name"
                  type="text"
                  {...register("lastName", {
                    required: "Last name is required",
                  })}
                />
                {errors.lastName && (
                  <p className="message message--error">
                    {errors.lastName.message}
                  </p>
                )}
              </div>

              <div className="form__input-row">
                <input
                  className="form__input"
                  placeholder="Email"
                  type="text"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value:
                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                      message: "Please enter a valid email",
                    },
                  })}
                />
                {errors.email && (
                  <p className="message message--error">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="form__input-row">
                <input
                  className="form__input"
                  type="Password"
                  placeholder="Password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                {errors.password && (
                  <p className="message message--error">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="form__info">
                <div className="checkbox-wrapper">
                  <label
                    htmlFor="check-signed-in"
                    className="checkbox checkbox--sm"
                  >
                    <input
                      type="checkbox"
                      id="check-signed-in"
                      {...register("signedIn")}
                    />
                    <span className="checkbox__check" />
                    <p>
                      I agree to the Google Terms of Service and Privacy Policy
                    </p>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn--rounded btn--yellow btn-submit"
              >
                Sign up
              </button>

              <p className="form__signup-link">
                <Link href="/login">Are you already a member?</Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default RegisterPage;
