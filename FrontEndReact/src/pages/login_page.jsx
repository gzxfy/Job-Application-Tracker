import { useState } from "react"
import { Link, useLocation } from "react-router-dom"

export default function Login() {
    const location = useLocation();
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    })

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState(
        location.state?.successMessage || ""
    );

     async function handleLogin(event) {
        event.preventDefault();
        const payload = {
            email: loginData.email,
            password: loginData.password,
        };
    
        try{
            const response = await fetch('/api/login', {
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
            setLoginData({
                email: "",
                password: "",
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
                <h1>Login</h1>
                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
                {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
                <form onSubmit={handleLogin} className="registration-form">

                    {/* Email Field */}
                    <div className="form-group">
                        <label htmlFor="email">Enter Your Email: </label>
                        <input type="email" id="email" className="auth-box" name="email" value={loginData.email} 
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        required />
                    </div>

                    {/* Password Field */}
                    <div className="form-group">
                        <label htmlFor="password">Enter a password</label>
                        <input type="password" id="password" className="auth-box"  name="password" value={loginData.password} 
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required />
                    </div>

                    <button type="submit">Login</button>
                    <button type="button"><Link to="/register">Don't have an Account</Link> </button>
                </form>
            </main>
        </div>
    )
}