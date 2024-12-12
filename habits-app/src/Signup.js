import React, { useState } from "react";
import { auth } from "./Firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Signup({ onSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      onSignup(); // Set the user as authenticated in App.js
      navigate("/"); // Redirect to the main page
    } catch (err) {
      console.error("Error during signup:", err.message);

      // Friendly error messages
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already in use.");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSignUp}>
        <h2>Sign Up</h2>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          className="input-field"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          className="input-field"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="form-button">
          Sign Up
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <p>
          Already have an account? Log in <a href="/login">here</a>.
        </p>
      </form>
    </div>
  );
}

export default Signup;
