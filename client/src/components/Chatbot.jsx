import { useState } from "react";

function Chatbot() {
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hi! 👋 I'm your ShopMyUniform support assistant. I can help with products, sizes, orders, delivery, returns and exchanges.",
    },
  ]);

  const [loading, setLoading] = useState(false);

  // Controls whether chatbot window is visible
  const [isOpen, setIsOpen] = useState(true);

  const sendMessage = async () => {
    if (!message.trim() || loading) {
      return;
    }

    const userMessage = message.trim();

    setMessages((previousMessages) => [
      ...previousMessages,
      {
        sender: "user",
        text: userMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const storedUser = localStorage.getItem("user");

      let userId = null;

      if (storedUser) {
        const user = JSON.parse(storedUser);
        userId = user.id;
      }

      const response = await fetch(
        "https://shopmyuniform-qhwu.onrender.com/api/ai/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userMessage,
            userId: userId,
            conversation: [
              ...messages,
              {
                sender: "user",
                text: userMessage,
              },
            ],
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "AI request failed");
      }

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          sender: "ai",
          text: data.reply,
        },
      ]);
    } catch (error) {
      console.error("Chatbot error:", error);

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          sender: "ai",
          text: "Sorry, I couldn't connect to customer support right now.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  // When chatbot is minimized, show only the floating button
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        title="Open ShopMyUniform Support"
        style={{
          position: "fixed",
          right: "25px",
          bottom: "25px",
          width: "55px",
          height: "55px",
          borderRadius: "50%",
          border: "none",
          backgroundColor: "#1f2937",
          color: "white",
          fontSize: "24px",
          cursor: "pointer",
          boxShadow: "0 4px 15px rgba(0,0,0,0.25)",
          zIndex: 1000,
        }}
      >
        🤖
      </button>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        right: "25px",
        bottom: "25px",
        width: "350px",
        backgroundColor: "white",
        border: "1px solid #ccc",
        borderRadius: "12px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
        overflow: "hidden",
        zIndex: 1000,
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: "#1f2937",
          color: "white",
          padding: "15px",
          fontWeight: "bold",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>🤖 ShopMyUniform Support</span>

        {/* Minimize button */}
        <button
          onClick={() => setIsOpen(false)}
          title="Minimize chatbot"
          style={{
            background: "transparent",
            border: "none",
            color: "white",
            fontSize: "20px",
            cursor: "pointer",
            padding: "0 4px",
          }}
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div
        style={{
          height: "300px",
          overflowY: "auto",
          padding: "15px",
          backgroundColor: "#f9fafb",
        }}
      >
        {messages.map((chat, index) => (
          <div
            key={index}
            style={{
              marginBottom: "12px",
              textAlign: chat.sender === "user" ? "right" : "left",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "10px",
                borderRadius: "10px",
                maxWidth: "80%",
                backgroundColor: chat.sender === "user" ? "#dbeafe" : "#e5e7eb",
              }}
            >
              {chat.text}
            </span>
          </div>
        ))}

        {loading && <p style={{ color: "#666" }}>AI is typing...</p>}
      </div>

      {/* Input */}
      <div
        style={{
          display: "flex",
          padding: "10px",
          gap: "8px",
        }}
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask something..."
          disabled={loading}
          style={{
            flex: 1,
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        />

        <button onClick={sendMessage} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
}

export default Chatbot;
