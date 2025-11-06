import React, { useState, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";

export default function AIChatHelp() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "👋 Hi there! I'm your AI Assistant. Need help with attendance, marks, or timetable?" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Simulate AI typing animation
  const sendMessage = async () => {
  if (!input.trim()) return;

  const userMessage = { from: "user", text: input };
  setMessages((prev) => [...prev, userMessage]);
  setInput("");
  setIsTyping(true);

  try {
    const res = await fetch("http://127.0.0.1:5000/api/ai/respond", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: input,
        student_id: localStorage.getItem("studentId"), // Save studentId on login
      }),
    });

    const data = await res.json();
    setMessages((prev) => [...prev, { from: "bot", text: data.reply }]);
  } catch (err) {
    setMessages((prev) => [...prev, { from: "bot", text: "⚠️ Error connecting to the server." }]);
  } finally {
    setIsTyping(false);
  }
};

  // Close chat on ESC
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      {/* 💬 Floating Chat Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={chatButtonStyle}
          className="chat-bubble"
        >
          <MessageCircle size={26} />
        </button>
      )}

      {/* 🧠 Chat Window */}
      {open && (
        <div style={chatWindowStyle}>
          {/* Header */}
          <div style={headerStyle}>
            <strong>AI Assistant</strong>
            <X
              size={18}
              style={{ cursor: "pointer" }}
              onClick={() => setOpen(false)}
            />
          </div>

          {/* Messages Area */}
          <div style={chatBodyStyle}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  textAlign: m.from === "user" ? "right" : "left",
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    background:
                      m.from === "user" ? "#6246ea" : "rgba(0,0,0,0.08)",
                    color: m.from === "user" ? "white" : "black",
                    padding: "8px 12px",
                    borderRadius:
                      m.from === "user" ? "16px 16px 0 16px" : "16px 16px 16px 0",
                    maxWidth: "75%",
                    fontSize: 14,
                  }}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div style={{ textAlign: "left", marginBottom: 10 }}>
                <div style={typingDotsStyle}>
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Section */}
          <div style={inputContainerStyle}>
            <input
              type="text"
              value={input}
              placeholder="Ask me anything..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              style={inputStyle}
            />
            <button onClick={sendMessage} style={sendButtonStyle}>
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ✨ CSS Animations */}
      <style>
        {`
          .chat-bubble {
            animation: bounce 1.8s infinite;
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-6px); }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes typing {
            0%, 60%, 100% { opacity: 0.2; transform: scale(1); }
            30% { opacity: 1; transform: scale(1.3); }
          }
          .typing-dot span {
            animation: typing 1.4s infinite;
            display: inline-block;
            margin: 0 2px;
            font-size: 18px;
          }
        `}
      </style>
    </>
  );
}

//
// 💬 STYLES
//

const chatButtonStyle = {
  position: "fixed",
  bottom: 24,
  right: 24,
  backgroundColor: "#6246ea",
  color: "white",
  border: "none",
  borderRadius: "50%",
  width: 56,
  height: 56,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 6px 18px rgba(0,0,0,0.3)",
  transition: "transform 0.2s ease-in-out",
  zIndex: 9999,
};

const chatWindowStyle = {
  position: "fixed",
  bottom: 24,
  right: 24,
  width: 320,
  height: 440,
  background: "#fff",
  borderRadius: 16,
  boxShadow: "0 8px 28px rgba(0,0,0,0.25)",
  display: "flex",
  flexDirection: "column",
  animation: "fadeIn 0.2s ease-in-out",
  overflow: "hidden",
  zIndex: 10000,
};

const headerStyle = {
  background: "#6246ea",
  color: "white",
  padding: "10px 16px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const chatBodyStyle = {
  flex: 1,
  padding: "10px 12px",
  background: "#f9f9ff",
  overflowY: "auto",
};

const inputContainerStyle = {
  display: "flex",
  alignItems: "center",
  padding: "8px 10px",
  borderTop: "1px solid #ddd",
  background: "#fff",
};

const inputStyle = {
  flex: 1,
  border: "1px solid #ccc",
  borderRadius: 8,
  padding: "8px 10px",
  fontSize: 14,
};

const sendButtonStyle = {
  background: "#6246ea",
  color: "white",
  border: "none",
  borderRadius: 8,
  padding: "8px 10px",
  marginLeft: 6,
  cursor: "pointer",
};

const typingDotsStyle = {
  display: "inline-flex",
  gap: "2px",
  alignItems: "center",
  fontSize: "18px",
  color: "#888",
};
