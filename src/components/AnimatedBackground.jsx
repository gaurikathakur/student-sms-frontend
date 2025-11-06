import React from "react";

const AnimatedBackground = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        zIndex: 0,
        background:
          "linear-gradient(120deg, rgba(37,99,235,0.25), rgba(236,72,153,0.25))",
        animation: "gradientMove 8s ease infinite alternate",
      }}
    >
      {/* Floating particles */}
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.12)",
            width: `${10 + Math.random() * 25}px`,
            height: `${10 + Math.random() * 25}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `float ${8 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 4}s`,
          }}
        ></div>
      ))}

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); opacity: 0.7; }
          50% { transform: translateY(-30px); opacity: 1; }
          100% { transform: translateY(0px); opacity: 0.7; }
        }
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
};

export default AnimatedBackground;
