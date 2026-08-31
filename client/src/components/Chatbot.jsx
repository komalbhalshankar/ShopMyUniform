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
        "http://localhost:5000/api/ai/chat",
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
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "AI request failed"
        );
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
        }}
      >
        🤖 ShopMyUniform Support
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
              textAlign:
                chat.sender === "user"
                  ? "right"
                  : "left",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "10px",
                borderRadius: "10px",
                maxWidth: "80%",
                backgroundColor:
                  chat.sender === "user"
                    ? "#dbeafe"
                    : "#e5e7eb",
              }}
            >
              {chat.text}
            </span>
          </div>
        ))}

        {loading && (
          <p style={{ color: "#666" }}>
            AI is typing...
          </p>
        )}
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

        <button
          onClick={sendMessage}
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chatbot;