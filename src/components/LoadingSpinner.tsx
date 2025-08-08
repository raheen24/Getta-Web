// LoadingSpinner.tsx
import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <div style={spinnerStyle}>
      <div style={spinnerCircle}></div>
    </div>
  );
};

// Spinner CSS
const spinnerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  zIndex: 9999,
};

const spinnerCircle = {
  border: "6px solid #f3f3f3", // Light gray background
  borderTop: "6px solid #3498db", // Blue color
  borderRadius: "50%",
  width: "50px",
  height: "50px",
  animation: "spin 2s linear infinite",
};

// Add spin animation keyframes globally
const spinnerAnimation = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

if (typeof window !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = spinnerAnimation;
  document.head.appendChild(styleSheet);
}

export default LoadingSpinner;
