import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";
import axios from "axios";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [timeSpent, setTimeSpent] = useState(0); // Track time spent in app
  const [dailyTip, setDailyTip] = useState(""); // Daily tip for users
  const [focusMode, setFocusMode] = useState(false); // Track if focus mode is active
  const apiKey = "";

  useEffect(() => {
    // Set daily tip on first load
    const tips = [
      "Take a 5-minute break every hour!",
      "Try putting your phone on airplane mode for 30 minutes.",
      "Start your day with 10 minutes of reading instead of scrolling.",
      "Set a timer for 20 minutes to focus on your tasks without distractions.",
      "Practice mindfulness and enjoy the moment!"
    ];
    setDailyTip(tips[Math.floor(Math.random() * tips.length)]);

    // Start tracking time spent in the app
    const interval = setInterval(() => {
      setTimeSpent((prevTime) => prevTime + 1);
    }, 1000); // Increment every second
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Check if the message is related to social media addiction
    const keywords = ["social media", "addiction", "time spent", "screen time", "focus"];
    const isRelatedToAddiction = keywords.some(keyword => input.toLowerCase().includes(keyword));

    if (!isRelatedToAddiction) {
      setMessages([...messages, { role: "assistant", content: "I have been made to help get rid of social media addiction." }]);
      setInput("");
      return;
    }

    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");

    try {
      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama3-8b-8192", // Corrected model name
          messages: [...messages, userMessage],
          temperature: 0.7,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );
      const assistantMessage = response.data.choices[0].message;
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error: " + (error.response?.data?.error?.message || error.message) },
      ]);
    }
  };

  const handleActivateFocusMode = () => {
    setFocusMode(true); // Activate focus mode
    alert("Focus Mode activated! Stay focused and reduce distractions.");
  };

  const handleDeactivateFocusMode = () => {
    setFocusMode(false); // Deactivate focus mode
    alert("Focus Mode deactivated! Take a moment to relax.");
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.role === "user" ? "user" : "assistant"}`}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>

      <div className="social-media-usage">
        <h2>Time Spent: {timeSpent}s</h2>
        <p>Consider taking a break to reduce screen time!</p>
      </div>

      <div className="inspiration">
        <h3>Daily Tip</h3>
        <p>{dailyTip}</p>
      </div>

      {/* Focus Mode Button */}
      {!focusMode ? (
        <button className="focus-button" onClick={handleActivateFocusMode}>
          Activate Focus Mode
        </button>
      ) : (
        <button className="deactivate-focus-button" onClick={handleDeactivateFocusMode}>
          Deactivate Focus Mode
        </button>
      )}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

