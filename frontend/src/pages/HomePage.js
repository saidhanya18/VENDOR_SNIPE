import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!input) return;
    navigate(`/results?query=${encodeURIComponent(input)}`);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>VendorSnipe AI</h1>
      <p>AI agent that finds the best vendors for your business</p>

      <input
        style={{ width: "400px", padding: "10px" }}
        placeholder="e.g. best HR tools for startup"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <br /><br />

      <button onClick={handleSearch}>Search</button>

      <br /><br />

      {/* PRESET BUTTONS */}
      <button onClick={() => navigate("/results?query=best cloud provider")}>
        Cloud Tools
      </button>

      <button onClick={() => navigate("/results?query=best HR tools startup")}>
        HR Tools
      </button>

      <button onClick={() => navigate("/results?query=best payment gateway India")}>
        Payments
      </button>
    </div>
  );
}

export default HomePage;