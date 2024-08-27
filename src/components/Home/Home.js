import React from "react";
import "./Home.css";

const HomePage = () => {
  return (
    <div className="home-page">
      <div className="home-animation">
        {/* Add your animation here */}
        <img
          src={
            "https://digitalt3.com/wp-content/uploads/2024/08/FastAI-logo-wob.png"
          }
          alt="Flash-AI"
          className="logo"
          style={{ width: "400px", height: "300px" }}
        />
        <h1>FlashAI!</h1>
        <p>
        Answer general, related questions with Our FlashAI and SambaNova
        Powered FastAPI
        </p>
        <button
          className="launch-button"
          onClick={() => (window.location.href = "/chat")}
        >
          Launch Now!
        </button>
      </div>
    </div>
  );
};

export default HomePage;
