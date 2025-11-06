import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { postJSON } from "../api.js";
import Swal from "sweetalert2";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [dark, setDark] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const nav = useNavigate();

  // 🎤 Define speak function
  const speak = (text) => {
    if (!voiceEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  // 👋 Initial greeting
  useEffect(() => {
    speak("Welcome to the Student Portal. Please log in to continue.");
  }, []);

  // 🤖 Smart username listener
  useEffect(() => {
    const trimmed = username.trim();
    window.speechSynthesis.cancel();

    if (trimmed === "") {
      speak("Oh, you're entering a new name. Let's see who it is!");
      return;
    }

    const delay = setTimeout(() => {
      speak(`Hi ${trimmed}. Please enter your password to log in.`);
    }, 1000);

    return () => clearTimeout(delay);
  }, [username]);

  // 🧠 Form Submit
  async function submit(e) {
    e.preventDefault();

    try {
      const res = await postJSON("/student/login", { username, password });

      if (res.error) {
        Swal.fire({
          icon: "error",
          title: "Login Failed 😢",
          text: res.error || "Invalid username or password.",
          confirmButtonColor: "#6246ea",
        });
        speak("Login failed. Please check your credentials.");
        return;
      }

      const user = res.student;
      if (remember)
        localStorage.setItem("sms_user", JSON.stringify(user));
      else
        sessionStorage.setItem("sms_user", JSON.stringify(user));

      if (user?.id) localStorage.setItem("studentId", user.id);

      speak(`Welcome back ${user.name}. Redirecting to your dashboard.`);
      Swal.fire({
        icon: "success",
        title: `Welcome, ${user.name}! 🎉`,
        text: "Redirecting to your dashboard...",
        timer: 2000,
        showConfirmButton: false,
      });

      setTimeout(() => {
        if (user.role === "admin") nav("/admin");
        else nav(`/student/${user.id}`);
      }, 2000);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Unable to connect. Please try again later.",
      });
      speak("Unable to connect to the server right now.");
    }
  }

  return (
    <div
      style={{
        height: "100vh",
        background: dark
          ? "linear-gradient(135deg, #1a1a2e, #16213e)"
          : "url('https://images.unsplash.com/photo-1605902711622-cfb43c4437b5?auto=format&fit=crop&w=1600&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "#fff",
        transition: "background 0.5s ease",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Poppins, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 🌗 Theme + Voice Toggles */}
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 30,
          display: "flex",
          gap: "10px",
          zIndex: 100,
        }}
      >
        <button onClick={() => setDark(!dark)} style={iconBtn} title="Toggle Theme">
          {dark ? "☀️" : "🌙"}
        </button>
        <button onClick={() => setVoiceEnabled(!voiceEnabled)} style={iconBtn} title="Toggle Voice">
          {voiceEnabled ? "🔊" : "🔇"}
        </button>
      </div>

      {/* 🤖 AI Avatar */}
      <div
        style={{
          position: "absolute",
          bottom: 50,
          left: 80,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: speaking
              ? "radial-gradient(circle, #7b61ff 0%, #6246ea 70%)"
              : "rgba(255,255,255,0.3)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            animation: speaking ? "pulse 1s infinite" : "none",
            transition: "0.3s",
          }}
        >
          <span style={{ fontSize: 26 }}>👨‍🏫</span>
        </div>
        <p
          style={{
            background: "rgba(255,255,255,0.2)",
            padding: "10px 16px",
            borderRadius: 12,
            color: "#fff",
            fontSize: 14,
            backdropFilter: "blur(8px)",
          }}
        >
          {speaking
            ? "Hi! I'm your AI assistant."
            : "Say hi! I'm here to help you log in."}
        </p>
      </div>

      {/* 💎 Login Card */}
      <div
        style={{
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(15px)",
          borderRadius: 20,
          padding: "40px 50px",
          width: 380,
          textAlign: "center",
          boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
          animation: "fadeIn 1.5s ease",
        }}
      >
        <h1 style={{ fontWeight: 800, marginBottom: 10 }}>Student Portal</h1>
        <p style={{ opacity: 0.8, marginBottom: 25 }}>Login to your account</p>

        <form onSubmit={submit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 14,
            }}
          >
            <label>
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
              />{" "}
              Remember Me
            </label>
            <a href="/forgot-password" style={{ color: "#fff", textDecoration: "underline" }}>
              Forgot Password?
            </a>
          </div>

          <button type="submit" style={buttonStyle}>
            Login
          </button>

          <p style={{ marginTop: 10 }}>
            Don’t have an account?{" "}
            <a href="/register" style={{ color: "#fff", fontWeight: 600 }}>
              Register
            </a>
          </p>
        </form>
      </div>

      {/* 💫 Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  marginBottom: 15,
  borderRadius: 10,
  border: "none",
  outline: "none",
  background: "rgba(255,255,255,0.2)",
  color: "white",
};

const buttonStyle = {
  width: "100%",
  padding: "10px 0",
  background: "linear-gradient(90deg, #667eea, #764ba2)",
  color: "white",
  fontWeight: 600,
  border: "none",
  borderRadius: 10,
  marginTop: 15,
  cursor: "pointer",
};

const iconBtn = {
  background: "rgba(255,255,255,0.2)",
  border: "none",
  borderRadius: "50%",
  width: 36,
  height: 36,
  cursor: "pointer",
  fontSize: 18,
};
