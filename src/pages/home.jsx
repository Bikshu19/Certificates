import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Certificate Generator</h1>

      {/* Buttons with links */}
      <div style={{ marginTop: "20px" }}>
        <Link to="/manual">
          <button
            style={{
              padding: "10px 20px",
              marginRight: "15px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Manual Generate
          </button>
        </Link>

        <Link to="/bulk">
          <button
            style={{
              padding: "10px 20px",
              backgroundColor: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Bulk Generate
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
