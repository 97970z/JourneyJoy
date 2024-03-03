// frontend/src/components/Home.jsx
import React from "react";

function Home() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Welcome to JourneyJoy!</h1>

      <div style={{ marginTop: "20px" }}>
        <h2>검색</h2>
        <input
          type="text"
          placeholder="Search for a location..."
          style={{ width: "300px", marginRight: "10px" }}
        />
        <button>Search</button>
      </div>
    </div>
  );
}

export default Home;
