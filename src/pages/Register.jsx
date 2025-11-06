import React, { useState, useEffect } from "react";
import { postJSON } from "../api.js";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
    department: "",
    semester: "",
    question: "",
    answer: "",
  });

  const [show, setShow] = useState(false);
  const [userHint, setUserHint] = useState("");
  const [passHint, setPassHint] = useState("");
  const nav = useNavigate();

  // 🗣️ speech helper
  function speak(text) {
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1;
    utter.pitch = 1;
    utter.volume = 1;
    speechSynthesis.speak(utter);
  }

  // 👋 speak greeting on load
  useEffect(() => {
    setTimeout(() => setShow(true), 200);
    speak(
      "Welcome to the Student Registration Portal. Please fill in your details carefully to access your assignments, health tracker, and more."
    );
  }, []);

  // 🗣️ dynamic name greeting
  useEffect(() => {
    if (form.name.trim().length > 0) {
      speak(`Hi ${form.name}. Please continue your registration.`);
    }
  }, [form.name]);

  // 🧠 validation and voice hints
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "username") {
      const numCount = (value.match(/\d/g) || []).length;
      if (value && numCount < 2) {
        setUserHint("⚠️ Username should include at least 2 numbers.");
        speak("Username should include at least two numbers.");
      } else if (value.length > 0) {
        setUserHint("✅ Username looks good!");
      } else setUserHint("");
    }

    if (name === "password") {
      const upper = (value.match(/[A-Z]/g) || []).length >= 2;
      const lower = (value.match(/[a-z]/g) || []).length >= 1;
      const special = /[!@#$%^&*(),.?":{}|<>]/.test(value);

      if (!value) setPassHint("");
      else if (upper && lower && special) {
        setPassHint("✅ Strong password!");
        speak("Nice! That looks like a strong password.");
      } else {
        setPassHint(
          "⚠️ Password must have 2 uppercase, 1 lowercase, and 1 special character."
        );
        speak("Password must include two uppercase letters, one lowercase, and one special character.");
      }
    }
  };

  async function submit(e) {
    e.preventDefault();

    if (userHint.includes("⚠️") || passHint.includes("⚠️")) {
      alert("Please fix the highlighted issues before submitting.");
      speak("Please fix the highlighted issues before submitting.");
      return;
    }

    const res = await postJSON("/student/register", form);
    if (res.error) {
      alert(res.error);
      speak("Registration failed. Please try again.");
      return;
    }

    speak(`Registration successful! Welcome ${form.name}. Redirecting you to login.`);
    alert("🎉 Registration successful! You can now login.");
    nav("/login");
  }

  return (
    <div
      style={{
        height: "100vh",
        backgroundImage:
          "url('https://images.unsplash.com/photo-1531256379411-9f000e90aacc?auto=format&fit=crop&w=1920&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <form
        onSubmit={submit}
        style={{
          opacity: show ? 1 : 0,
          transform: show ? "translateY(0)" : "translateY(40px)",
          transition: "all 0.8s ease",
          background: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(14px)",
          padding: "40px 45px",
          borderRadius: 20,
          width: 420,
          boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
          color: "#222",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: 10,
            color: "#4b2ae6",
            fontWeight: 800,
          }}
        >
          Student Registration
        </h2>
        <p
          style={{
            textAlign: "center",
            marginBottom: 25,
            fontSize: 14,
            lineHeight: 1.5,
            color: "#333",
          }}
        >
          Fill in your details to unlock access to assignments, notices, health
          tracker, and more.
        </p>

        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          name="username"
          placeholder="Username (must contain 2 numbers)"
          value={form.username}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        {userHint && (
          <p
            style={{
              fontSize: 12,
              marginTop: -6,
              marginBottom: 10,
              color: userHint.includes("⚠️") ? "red" : "green",
            }}
          >
            {userHint}
          </p>
        )}

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        {passHint && (
          <p
            style={{
              fontSize: 12,
              marginTop: -6,
              marginBottom: 10,
              color: passHint.includes("⚠️") ? "red" : "green",
            }}
          >
            {passHint}
          </p>
        )}

        <input
          name="department"
          placeholder="Department"
          value={form.department}
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          name="semester"
          type="number"
          placeholder="Semester"
          value={form.semester}
          onChange={handleChange}
          style={inputStyle}
        />

        <select
          name="question"
          value={form.question}
          onChange={handleChange}
          style={inputStyle}
        >
          <option value="">Select Secret Question</option>
          <option>What is your favorite color?</option>
          <option>What is your favorite game?</option>
          <option>What is your pet’s name?</option>
        </select>

        <input
          name="answer"
          placeholder="Your Answer"
          value={form.answer}
          onChange={handleChange}
          style={inputStyle}
        />

        <button type="submit" style={buttonStyle}>
          Register
        </button>

        <p style={{ textAlign: "center", marginTop: 10, fontSize: 14 }}>
          Already have an account?{" "}
          <a href="/login" style={{ color: "#4b2ae6", fontWeight: 600 }}>
            Login
          </a>
        </p>
      </form>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  marginBottom: 10,
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.4)",
  outline: "none",
  background: "rgba(255,255,255,0.7)",
  color: "#222",
  fontSize: 14,
};

const buttonStyle = {
  width: "100%",
  background: "linear-gradient(90deg, #6a11cb, #2575fc)",
  color: "white",
  fontWeight: 600,
  border: "none",
  borderRadius: 10,
  padding: "12px",
  marginTop: 12,
  cursor: "pointer",
  transition: "0.4s",
};
