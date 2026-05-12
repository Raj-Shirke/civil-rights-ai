import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Scale,
  User,
  Bot,
  Loader2,
  Mic,
  MicOff,
  Volume2,
} from "lucide-react";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Namaste! I am Nyaya AI. I can help you with Indian Civil Rights and laws. Click the mic to speak or type your question.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef(null);

  // --- Bulletproof Speech Setup ---
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition && !recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-IN";

      recognitionRef.current.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInput(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech Error:", event.error);
        setIsListening(false);
      };
    }
  }, []);

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setInput("");
      setIsListening(true);
      try {
        recognitionRef.current?.start();
      } catch (err) {
        console.log("Mic already active");
      }
    }
  };

  // --- Manual Text to Speech ---
  const speak = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/[#*`]/g, ""));
    utterance.lang = "en-IN";
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  // --- Auto Scroll ---
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // --- API Call (Auto-Speech Disabled) ---
  const handleSend = async (overrideInput) => {
    const textToSend = overrideInput || input;
    if (!textToSend.trim() || loading) return;

    const userMessage = { role: "user", content: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://10.209.216.192:5000/api/ai/chat",
        {
          message: textToSend,
        },
      );

      const aiReply = response.data.reply;
      setMessages((prev) => [...prev, { role: "assistant", content: aiReply }]);

      // Auto-speech is now removed. User must click the button to hear it.
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "⚠️ Connection error. Please check if the backend is running.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f1f5f9",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Navbar */}
      <nav
        style={{
          padding: "1rem 1.5rem",
          backgroundColor: "#0f172a",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Scale size={24} color="#38bdf8" />
          <span style={{ fontWeight: "700", fontSize: "1.2rem" }}>
            NYAYA AI 🇮🇳
          </span>
        </div>
      </nav>

      {/* Chat Messages */}
      <main
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={idx}
              style={{
                display: "flex",
                gap: "10px",
                flexDirection: msg.role === "user" ? "row-reverse" : "row",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: msg.role === "user" ? "#3b82f6" : "#334155",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div
                style={{
                  backgroundColor: msg.role === "user" ? "#3b82f6" : "white",
                  color: msg.role === "user" ? "white" : "#1e293b",
                  padding: "0.8rem 1rem",
                  borderRadius: "15px",
                  maxWidth: "85%",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                }}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.content}
                </ReactMarkdown>

                {msg.role === "assistant" && (
                  <div
                    style={{
                      marginTop: "10px",
                      borderTop: "1px solid #e2e8f0",
                      paddingTop: "8px",
                    }}
                  >
                    <button
                      onClick={() => speak(msg.content)}
                      style={{
                        background: "#f1f5f9",
                        border: "1px solid #cbd5e1",
                        borderRadius: "20px",
                        padding: "4px 12px",
                        cursor: "pointer",
                        color: "#475569",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "0.75rem",
                        fontWeight: "500",
                      }}
                    >
                      <Volume2 size={14} /> Listen to Response
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <div
            style={{ color: "#64748b", fontSize: "0.8rem", marginLeft: "42px" }}
          >
            <Loader2
              className="spin"
              size={14}
              style={{ display: "inline", marginRight: "5px" }}
            />
            Consulting Indian Laws...
          </div>
        )}
        <div ref={scrollRef} />
      </main>

      {/* Footer / Input */}
      <footer
        style={{
          padding: "1rem",
          backgroundColor: "white",
          borderTop: "1px solid #e2e8f0",
        }}
      >
        <div
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            display: "flex",
            gap: "10px",
          }}
        >
          <button
            onClick={toggleListen}
            className={isListening ? "pulse" : ""}
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              border: "none",
              backgroundColor: isListening ? "#ef4444" : "#f1f5f9",
              color: isListening ? "white" : "#475569",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          <input
            style={{
              flex: 1,
              padding: "0.8rem 1.2rem",
              borderRadius: "25px",
              border: "1px solid #cbd5e1",
              outline: "none",
              fontSize: "1rem",
            }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder={isListening ? "Listening..." : "Ask Nyaya AI..."}
          />

          <button
            onClick={() => handleSend()}
            disabled={loading}
            style={{
              width: "50px",
              height: "50px",
              backgroundColor: "#0f172a",
              color: "white",
              border: "none",
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Send size={18} />
          </button>
        </div>
        <p
          style={{
            textAlign: "center",
            fontSize: "0.65rem",
            color: "#94a3b8",
            marginTop: "10px",
          }}
        >
          Nyaya AI provides general legal information. For serious matters,
          please consult a legal professional.
        </p>
      </footer>

      <style>{`
        .spin { animation: rotation 1s linear infinite; }
        @keyframes rotation { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .pulse { animation: pulse-red 1.5s infinite; }
        @keyframes pulse-red { 
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); } 
          70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); } 
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); } 
        }
        p { margin: 0 0 8px 0; }
        p:last-child { margin-bottom: 0; }
        ul, ol { margin: 8px 0; padding-left: 1.5rem; }
      `}</style>
    </div>
  );
}

export default App;
