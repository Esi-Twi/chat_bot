
import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import MarkdownMessage from "./components/MarkdownMessage";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Create a conversation when the app loads
  useEffect(() => {
    const createConversation = async () => {
      try {
        const response = await axios.post(
          `${API_URL}/api/v1/conversations`
        );

        setConversationId(response.data.conversation_id);
      } catch (error) {
        setError("Could not connect to the chatbot server.");
      }
    };

    createConversation();
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!input.trim() || !conversationId || loading) return;

    const userMessage = input.trim();

    setMessages((previous) => [
      ...previous,
      { role: "user", content: userMessage }
    ]);

    setInput("");
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${API_URL}/api/v1/chat`,
        {
          conversation_id: conversationId,
          message: userMessage
        }
      );

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: response.data.reply
        }
      ]);

    } catch (error) {
      setError(
        error.response?.data?.detail || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  const newChat = async () => {
    try {
      setMessages([]);
      setError("");
      setConversationId(null);

      const response = await axios.post(
        `${API_URL}/api/v1/conversations`
      );

      setConversationId(response.data.conversation_id);
    } catch (error) {
      setError("Could not create a new conversation.");
    }
  };

  return (
    <div className="app">
      <div className="chat-container">

        <header>
          <div>
            <h2>My Groq Assistant</h2>
            <p>Powered by Groq</p>
          </div>

          <button onClick={newChat}>
            New Chat
          </button>
        </header>

        <div className="messages">

          {messages.length === 0 && (
            <div className="welcome">
              <h1>Hello! 👋</h1>
              <p>Ask me anything. I'll try not to complain.</p>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.role}`}
            >
              <div className="message-role">
                {message.role === "assistant" ? "Assistant" : "You"}
              </div>

              <MarkdownMessage content={message.content} />
            </div>
          ))}
          
          {loading && (
            <div className="message assistant">
              <strong>Assistant</strong>
              <p>Thinking...</p>
            </div>
          )}

        </div>

        {error && <p className="error">{error}</p>}

        <form onSubmit={sendMessage}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me something..."
            disabled={!conversationId || loading}
          />

          <button
            type="submit"
            disabled={!conversationId || loading || !input.trim()}
          >
            Send
          </button>
        </form>

      </div>
    </div>
  );
}

export default App;