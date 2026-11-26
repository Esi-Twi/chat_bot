import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./App.css";
import MarkdownMessage from "./components/MarkdownMessage";

const API_URL = "http://127.0.0.1:8000";
const MAX_CHARS = 3000;

const FASHION_PROMPTS = [
  {
    title: "Collection Concept",
    prompt: "Develop a seasonal capsule collection concept with color palette, silhouettes, and key fabrics.",
    colorClass: "badge-amber",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
      </svg>
    ),
  },
  {
    title: "Fabric & Textile",
    prompt: "Recommend sustainable fabrics, drape characteristics, and lining pairings for an evening gown.",
    colorClass: "badge-blue",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    title: "Tech Pack Specs",
    prompt: "Draft a detailed garment tech pack specification sheet including stitch types, trims, and measurements.",
    colorClass: "badge-green",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    title: "Trend Forecasting",
    prompt: "Analyze upcoming runway color trends, street-style silhouettes, and textile innovations for next season.",
    colorClass: "badge-pink",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z" />
      </svg>
    ),
  },
];

function App() {
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const createConversation = async () => {
      try {
        const response = await axios.post(`${API_URL}/api/v1/conversations`);
        setConversationId(response.data.conversation_id);
      } catch (err) {
        setError("Could not connect to the Fashion design server.");
      }
    };

    createConversation();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (e, overrideText = null) => {
    if (e) e.preventDefault();

    const textToSend = overrideText !== null ? overrideText : input;
    if (!textToSend.trim() || !conversationId || loading) return;

    const userMessage = textToSend.trim();

    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${API_URL}/api/v1/chat`, {
        conversation_id: conversationId,
        message: userMessage,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.data.reply,
        },
      ]);
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong in the studio.");
    } finally {
      setLoading(false);
    }
  };

  const newChat = async () => {
    try {
      setMessages([]);
      setError("");
      setInput("");
      setConversationId(null);

      const response = await axios.post(`${API_URL}/api/v1/conversations`);
      setConversationId(response.data.conversation_id);
    } catch (err) {
      setError("Could not start a new design session.");
    }
  };

  const handleCardSelect = (promptText) => {
    setInput(promptText);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  return (
    <div className="atelier-app">
      {/* Minimal Top Bar */}
      <header className="atelier-header">
        <div className="brand-mark">
          <span className="brand-dot"></span>
          <span className="brand-name">Fashion AI</span>
          <span className="brand-tag">Couture & Design Studio</span>
        </div>

        <button className="new-session-btn" onClick={newChat} type="button">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>New Design</span>
        </button>
      </header>

      {/* Main Workspace (Centered 820px Chatbot Width) */}
      <main className="atelier-workspace">
        {messages.length === 0 ? (
          <div className="hero-container">
            <h1 className="hero-title">Welcome to Fashion AI</h1>
            <p className="hero-subtitle">
              Start by selecting a design brief below, or describe your garment, fabric, or collection concept.
            </p>

            <div className="prompt-grid">
              {FASHION_PROMPTS.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="prompt-card"
                  onClick={() => handleCardSelect(item.prompt)}
                >
                  <div className={`card-icon-badge ${item.colorClass}`}>
                    {item.icon}
                  </div>
                  <span className="card-title">{item.title}</span>
                  <span className="card-plus">+</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="messages-feed">
            {messages.map((message, index) => (
              <div key={index} className={`chat-bubble-row ${message.role}`}>
                <div className={`chat-bubble ${message.role}`}>
                  <div className="bubble-meta">
                    {message.role === "assistant" ? "Atelier Director" : "Designer"}
                  </div>
                  <div className="bubble-content">
                    <MarkdownMessage content={message.content} />
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="chat-bubble-row assistant">
                <div className="chat-bubble assistant thinking">
                  <div className="bubble-meta">Fashion Director</div>
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Full-Width Bottom Gradient-Bordered Composer (3-line height) */}
      <footer className="composer-wrapper">
        {error && <div className="error-banner">{error}</div>}

        <form className="composer-gradient-box" onSubmit={sendMessage}>
          <div className="composer-inner">
            <div className="composer-top">
              <textarea
                ref={inputRef}
                rows="3"
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, MAX_CHARS))}
                onKeyDown={handleKeyDown}
                placeholder="Describe a silhouette, textile pairing, garment construction details, or collection moodboard..."
                disabled={!conversationId || loading}
              />
              <button
                type="submit"
                className="send-icon-btn"
                disabled={!conversationId || loading || !input.trim()}
                title="Send brief"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>

            <div className="composer-toolbar">
              <div className="toolbar-actions">
                <button
                  type="button"
                  className="toolbar-action-btn"
                  onClick={() => handleCardSelect("Create a moodboard color & fabric palette for: ")}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="13.5" cy="6.5" r=".5"></circle>
                    <circle cx="17.5" cy="10.5" r=".5"></circle>
                    <circle cx="8.5" cy="7.5" r=".5"></circle>
                    <circle cx="6.5" cy="12.5" r=".5"></circle>
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
                  </svg>
                  <span>Swatch Palette</span>
                </button>

                <button
                  type="button"
                  className="toolbar-action-btn"
                  onClick={() => handleCardSelect("Generate garment sizing & pattern grading notes for: ")}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"></path>
                    <path d="m14.5 12.5 2-2"></path>
                    <path d="m11.5 9.5 2-2"></path>
                    <path d="m8.5 6.5 2-2"></path>
                    <path d="m17.5 15.5 2-2"></path>
                  </svg>
                  <span>Pattern & Fit</span>
                </button>

                <button
                  type="button"
                  className="toolbar-action-btn"
                  onClick={() => handleCardSelect("Write runway show notes & styling direction for: ")}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="9" y1="3" x2="9" y2="21"></line>
                  </svg>
                  <span>Lookbook Briefs</span>
                </button>
              </div>

              <span className="char-counter">
                {input.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}
              </span>
            </div>
          </div>
        </form>
      </footer>
    </div>
  );
}

export default App;