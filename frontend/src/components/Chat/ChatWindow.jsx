import "./ChatWindow.css";
import Chat from "./Chat";
import { ChatContext } from "../../context/ChatContext";
import { useContext, useState } from "react";
import { ScaleLoader } from "react-spinners";
import { authFetch } from "../../utils/api";

export default function ChatWindow() {
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setCurrThreadId,
    prevChats,
    setPrevChats,
    newChat,
    setNewChat,
  } = useContext(ChatContext);

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const getreply = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setNewChat(false);

    // If currThreadId is null, backend will create new thread
    const body = currThreadId ? { threadId: currThreadId, message: prompt } : { message: prompt };

    const res = await authFetch("/chat/chat", {
      method: "POST",
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setReply(res.data.reply);
      // set current thread if backend returned it
      if (res.data.threadId) setCurrThreadId(res.data.threadId);
      // append to prevChats is handled by effect in Chat component; but we keep local append too:
      setPrevChats((p) => [
        ...p,
        { role: "user", content: prompt },
        { role: "assistant", content: res.data.reply },
      ]);
    } else {
      console.error("Chat error", res);
    }

    setPrompt("");
    setLoading(false);
  };

  const handleProfileClick = () => setIsOpen(!isOpen);

  return (
    <div className="chatWindow">
      <div className="navbar">
        <span>
          CogniVerse <i className="fa-solid fa-chevron-down"></i>
        </span>
        <div className="userIconDiv" onClick={handleProfileClick}>
          <span className="userIcon">
            <i className="fa-solid fa-user userIcon"></i>
          </span>
        </div>
      </div>

      {isOpen && (
        <div className="dropDown">
          <div className="dropDownItem">Upgrade</div>
          <div className="dropDownItem">Settings</div>
          <div
            className="dropDownItem"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.href = "/login";
            }}
          >
            Logout
          </div>
        </div>
      )}

      <Chat />
      <ScaleLoader color="white" loading={loading} />

      <div className="chatInput">
        <div className="inputBox">
          <input
            placeholder="Ask Anything"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? getreply() : "")}
          />
          <div id="submit" onClick={getreply}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>
        <p className="info">CogniVerse can make mistakes. Check important info.</p>
      </div>
    </div>
  );
}
