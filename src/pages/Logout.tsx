import React from "react";
import axios from "axios";

export default function LogoutModule() {
  const handleLogout = async () => {
    const refresh = localStorage.getItem("refresh_token");
    const access = localStorage.getItem("access_token");

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/auth/logout/",
        { refresh },
        { headers: { Authorization: `Bearer ${access}` } }
      );
    } catch (err) {
      console.log("Logout error:", err);
    }

    // Clear tokens locally
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    // Redirect to login page
    window.location.href = "/";
  };

  return (
    <div>
      <h2>Are you sure you want to logout?</h2>
      <button
        onClick={handleLogout}
        style={{
          padding: "10px 16px",
          background: "#ef4444",
          color: "white",
          border: "none",
          borderRadius: "8px",
          marginTop: "20px",
          cursor: "pointer",
        }}
      >
        Yes, Logout
      </button>
    </div>
  );
}
