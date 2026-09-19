import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import InputField from "../components/InputField";
import AuthButton from "../components/AuthButton";

// Handles login and sends authenticated users to the dashboard.
export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(
    location.state?.successMessage || ""
  );

  // Sends credentials to Flask and handles success or validation errors.
  async function handleLogin(event) {
    event.preventDefault();
    const payload = {
      email: loginData.email,
      password: loginData.password,
    };

    setLoading(true);
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      {/* This is here for debugging for the back */}
      const text = await response.text();
      let result = {};

      try {
        result = text ? JSON.parse(text) : {};
      } catch {
        console.error("Backend did not return valid JSON:", text);
        setErrorMessage("Server error. Please try again.");
        setSuccessMessage("");
        return;
      }

      if (!response.ok) {
        setErrorMessage(result.error || "Login failed. Please try again.");
        setSuccessMessage("");
        return;
      }

      setSuccessMessage(result.message || "Logged in successfully");
      setErrorMessage("");
      setLoginData({
        email: "",
        password: "",
      });
      
      navigate("/dashboard")
    } catch (error) {
      console.error("Failed to login:", error);
      setErrorMessage(
        error.message || "Something went wrong. Please try again."
      );
      setSuccessMessage("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Login">
      {errorMessage && (
        <p className="mb-4 text-left font-sans text-sm text-error">
          {errorMessage}
        </p>
      )}
      {successMessage && (
        <p className="mb-4 text-left font-sans text-sm text-accent">
          {successMessage}
        </p>
      )}

      <form onSubmit={handleLogin} className="text-left">
        <InputField
          id="email"
          label="Email"
          type="email"
          name="email"
          value={loginData.email}
          onChange={(e) => {
            setLoginData({ ...loginData, email: e.target.value });
            setErrorMessage("");
          }}
          required
          autoComplete="email"
        />

        <InputField
          id="password"
          label="Password"
          type="password"
          name="password"
          value={loginData.password}
          onChange={(e) => {
            setLoginData({ ...loginData, password: e.target.value });
            setErrorMessage("");
          }}
          required
          autoComplete="current-password"
        />

        <div className="mb-6 flex items-center justify-between gap-4">
          <label className="flex cursor-pointer items-center gap-2 font-sans text-sm text-text">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border border-border accent-accent"
            />
            Remember me
          </label>
          <a
            href="#"
            className="font-sans text-sm text-accent underline-offset-2 hover:underline"
          >
            Forgot password?
          </a>
        </div>

        <AuthButton loading={loading} loadingLabel="Signing in…">
          Sign in
        </AuthButton>

        <p className="mt-6 font-sans text-sm text-text/80">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-accent underline-offset-2 hover:underline"
          >
            Create one
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
