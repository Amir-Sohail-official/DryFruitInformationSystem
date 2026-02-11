import React, { useState, useRef, useEffect } from "react";
import api from "../../api";
import styles from "./ChatBoard.module.css";

const predefinedQuestions = [
  "Which province in Afghanistan grows Almond?",
  "Which province has the best quality Walnut?",
];

export default function ChatBoard({ show, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false); // typing indicator
  const [loading, setLoading] = useState(false); // spinner
  const chatBodyRef = useRef(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const sendMessage = async (question) => {
    if (!question) return;

    setMessages((prev) => [...prev, { sender: "user", text: question }]);
    setInput("");

    setTyping(true);
    setLoading(true);

    try {
      const res = await api.post("/qa/ask", {
        question,
      });

      setTimeout(() => {
        setTyping(false);
        setLoading(false);

        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: res.data.answer },
        ]);
      }, 700);
    } catch (err) {
      setTyping(false);
      setLoading(false);

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Something went wrong. Please try again." },
      ]);
    }
  };

  if (!show) return null;

  return (
    <div className={`${styles.chatWrapper} ${styles.slideIn}`}>
      <div className={styles.chatHeader}>
        <span>Dry Fruit QA Chatbot</span>
        <button className={styles.closeBtn} onClick={onClose}>
          ×
        </button>
      </div>

      <div className={styles.chatBody} ref={chatBodyRef}>
        {messages.map((m, i) => (
          <div
            key={i}
            className={
              m.sender === "user" ? styles.messageUser : styles.messageBot
            }
          >
            {m.text}
          </div>
        ))}

        {typing && (
          <div className={styles.messageBot}>
            <span className={styles.typingDots}></span>
          </div>
        )}
      </div>

      <div className={styles.predefinedButtons}>
        {predefinedQuestions.map((q, i) => (
          <button
            key={i}
            className={styles.preBtn}
            onClick={() => sendMessage(q)}
          >
            {q}
          </button>
        ))}
      </div>

      <form
        className={styles.inputArea}
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
      >
        <input
          type="text"
          placeholder="Type your question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={styles.input}
        />

        <button type="submit" className={styles.sendBtn}>
          {loading ? <div className={styles.spinner}></div> : "Send"}
        </button>
      </form>
    </div>
  );
}
