import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import InputField from "../components/InputField";
import AuthButton from "../components/AuthButton";

export default function Registration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(field, value) {
    setFormData({ ...formData, [field]: value });
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
    setErrorMessage("");
  }

  async function handleRegistration(event) {
    event.preventDefault();

    if (formData.password !== formData.confirm_password) {
      setFieldErrors({ confirm_password: "Passwords don't match" });
      return;
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      confirm_password: formData.confirm_password,
    };

    setLoading(true);
    try {
      const response = await fetch("/api/register", {
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
        setErrorMessage(result.error || "Registration failed");
        setSuccessMessage("");
        return;
      }

      setSuccessMessage(result.message || "User registered successfully");
      setErrorMessage("");
      setFormData({
        name: "",
        email: "",
        password: "",
        confirm_password: "",
      });
      navigate("/login", {
        state: {
          successMessage:
            result.message || "Account created successfully. Please log in.",
        },
      });
    } catch (error) {
      console.error("Failed to register:", error);
      setErrorMessage(
        error.message || "Something went wrong. Please try again."
      );
      setSuccessMessage("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Create an account">
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

      <form onSubmit={handleRegistration} className="text-left">
        <InputField
          id="name"
          label="Name"
          type="text"
          name="name"
          value={formData.name}
          onChange={(e) => updateField("name", e.target.value)}
          required
          autoComplete="name"
        />

        <InputField
          id="email"
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={(e) => updateField("email", e.target.value)}
          required
          autoComplete="email"
        />

        <InputField
          id="password"
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={(e) => updateField("password", e.target.value)}
          required
          autoComplete="new-password"
        />

        <InputField
          id="confirm-password"
          label="Confirm password"
          type="password"
          name="confirm_password"
          value={formData.confirm_password}
          onChange={(e) => updateField("confirm_password", e.target.value)}
          error={fieldErrors.confirm_password}
          required
          autoComplete="new-password"
        />

        <div className="mt-2">
          <AuthButton loading={loading} loadingLabel="Creating account…">
            Create account
          </AuthButton>
        </div>

        <p className="mt-6 font-sans text-sm text-text/80">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-accent underline-offset-2 hover:underline"
          >
            Log in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
