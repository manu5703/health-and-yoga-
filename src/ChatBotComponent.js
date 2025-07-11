import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import './App.css';

function ChatBotComponent() {
  const [inputText, setInputText] = useState("");
  const [chatOutput, setChatOutput] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);

  // 🔽 Scroll to bottom when chat updates or loading changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatOutput, isLoading]);

  const handleSend = async () => {
    if (inputText.trim()) {
      const userMessage = { sender: "user", text: inputText };
      setChatOutput(prev => [...prev, userMessage]);
      setIsLoading(true);

      try {
        console.log("Sending request with prompt:", inputText);
        const res = await axios.post("http://localhost:5000/generate-response", { prompt: inputText });

        const botLines = res.data.response.split(/\n|\\n/);
        const botMessages = botLines.map((line) => ({ sender: "bot", text: line }));

        setChatOutput(prev => [...prev, ...botMessages]);
        setInputText("");
      } catch (error) {
        console.error("Error fetching response", error);
        setChatOutput(prev => [
          ...prev,
          { sender: "bot", text: "Sorry, I couldn't fetch a response at the moment." }
        ]);
        setInputText("");
      }

      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="manuscript-style">
        <div className="chat-history">
          {chatOutput.map((message, index) => (
            <div key={index} className={message.sender === "user" ? "user-text" : "bot-text"}>
              {message.text}
            </div>
          ))}

          {isLoading && (
            <div className="spinner-container">
              <div className="spinner"></div>
            </div>
          )}

          {/* 🔽 Keeps scroll at bottom */}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-section">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message here..."
            className="text-input"
          />
          <button onClick={handleSend} className="send-button">Send</button>
        </div>
      </div>
    </div>
  );
}

export default ChatBotComponent;
