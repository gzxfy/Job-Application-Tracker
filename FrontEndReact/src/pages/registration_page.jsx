
import { useState } from "react"
import { Link, useNavigate } from 'react-router-dom';

export default function Registration() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirm_password: ""
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    async function handleRegistration(event) {
        event.preventDefault();
        const payload = {
            email: formData.email,
            password: formData.password,
            confirm_password: formData.confirm_password
        };
    
        try{
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            {/* This is here for debugging for the back */}
            const text = await response.text();
            let result = {};

            try {
                result = text ? JSON.parse(text) : {};
            } catch {
                console.error('Backend did not return valid JSON:', text);
                setErrorMessage('Server error. Please try again.');
                setSuccessMessage('');
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
                email: "",
                password: "",
                confirm_password: ""
            });
            navigate("/login", {
                state: {
                    successMessage: result.message || "Account created successfully. Please log in."
                }
            });
        } catch (error) {
            console.error('Failed to register:', error);
            setErrorMessage(error.message || 'Something went wrong. Please try again.');
            setSuccessMessage('');
        }
    }

    return (
        <div>
            <main>
                <h1>Create an Account</h1>
                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
                {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
                <form onSubmit={handleRegistration} className="registration-form">

                    {/* Email Field */}
                    <div className="form-group">
                        <label htmlFor="email">Enter Your Email: </label>
                        <input type="email" id="email" className="auth-box" name="email" value={formData.email} 
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required />
                    </div>

                    {/* Password Field */}
                    <div className="form-group">
                        <label htmlFor="password">Enter a password</label>
                        <input type="password" id="password" className="auth-box"  name="password" value={formData.password} 
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required />
                    </div>

                    {/* Confirm Password Field */}
                    <div className="form-group">
                        <label htmlFor="confirm_password">Confirm Your Password: </label>
                        <input type="password" id="confirm-password" className="auth-box"  name="confirm_password" value={formData.confirm_password} 
                        onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                        required />
                    </div>

                    <button type="submit">Register</button>
                    <button type="button"><Link to="/login">Already have an account? Login</Link> </button>
                </form>
            </main>
        </div>
    )
}