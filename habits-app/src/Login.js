import React, { useState } from "react";
import { auth } from "./Firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogIn = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin(); // Callback to update the authenticated state
      navigate("/"); // Redirect to the main page after successful login
    } catch (err) {
      console.error("Error during login:", err.message);

      // Friendly error messages
      if (err.code === "auth/invalid-email") {
        setError("Invalid email. Please check and try again.");
      } else if (err.code === "auth/user-not-found") {
        setError("No account found with this email.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleLogIn}>
        <h2>Log In</h2>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          className="input-field"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          className="input-field"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="form-button">
          Log In
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <p>
          New user? Sign up <a href="/signup">here</a>.
        </p>
      </form>
    </div>
  );
}

export default Login;
