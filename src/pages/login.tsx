import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

import Layout from "../layouts/Main";
import { server } from "../utils/server";

type LoginMail = {
  email: string;
  password: string;
  keepSigned?: boolean;
};

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginMail>();
  const router = useRouter();

  const onSubmit = async (data: LoginMail) => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        // Store token and user data in localStorage
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));

        // Redirect to home page or dashboard
        router.push("/");
      } else {
        // Handle error messages
        setError("email", {
          type: "manual",
          message: result.message,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("email", {
        type: "manual",
        message: "An error occurred during login",
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
            <h2 className="form-block__title">Log in</h2>
            <p className="form-block__description">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s
            </p>

            <form className="form" onSubmit={handleSubmit(onSubmit)}>
              <div className="form__input-row">
                <input
                  className="form__input"
                  placeholder="email"
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
                  type="password"
                  placeholder="Password"
                  {...register("password", {
                    required: "Password is required",
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
                      {...register("keepSigned")}
                    />
                    <span className="checkbox__check" />
                    <p>Keep me signed in</p>
                  </label>
                </div>
                <Link
                  href="/forgot-password"
                  className="form__info__forgot-password"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="form__btns">
                <button type="button" className="btn-social fb-btn">
                  <i className="icon-facebook" />
                  Facebook
                </button>
                <button type="button" className="btn-social google-btn">
                  <img src="/images/icons/gmail.svg" alt="gmail" /> Gmail
                </button>
              </div>

              <button
                type="submit"
                className="btn btn--rounded btn--yellow btn-submit"
              >
                Sign in
              </button>

              <p className="form__signup-link">
                Not a member yet? <Link href="/register">Sign up</Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default LoginPage;
