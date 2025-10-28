import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { ChatContext } from "../../context/ChatContext";
import { v4 as uuidv4 } from "uuid";
import { authFetch } from "../../utils/api";

export default function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    setPrevChats,
  } = useContext(ChatContext);

  const getAllThreads = async () => {
    const res = await authFetch("/chat/threads", { method: "GET" });
    if (res.ok) {
      setAllThreads(res.data);
    } else {
      console.error("Failed to load threads", res);
    }
  };

  useEffect(() => {
    getAllThreads();
    // eslint-disable-next-line
  }, [currThreadId]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(null); // new chat
    setPrevChats([]);
  };

  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);
    try {
      const res = await authFetch(`/chat/thread/${newThreadId}`, { method: "GET" });
      if (res.ok) {
        setPrevChats(res.data);
        setNewChat(false);
        setReply(null);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const deleteThread = async (threadId) => {
    try {
      const res = await authFetch(`/chat/thread/${threadId}`, { method: "DELETE" });
      if (res.ok) {
        setAllThreads((prev) => prev.filter((t) => t.threadId !== threadId));
        if (threadId === currThreadId) createNewChat();
      } else {
        console.error("Delete failed", res);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <section className="sidebar">
      <div style={{ padding: "10px" }}>
        <button className="newBtn" onClick={createNewChat}>
          <img className="logo" src="/src/assets/blacklogo.png" alt="logo" />
          <span>New Chat</span>
        </button>
      </div>

      <ul className="history">
        {allThreads?.map((thread) => (
          <li
            key={thread.threadId}
            className={thread.threadId === currThreadId ? "highlighted" : ""}
            onClick={() => changeThread(thread.threadId)}
          >
            {thread.title || "Untitled"}
            <i
              className="fa-solid fa-trash"
              onClick={(e) => {
                e.stopPropagation();
                deleteThread(thread.threadId);
              }}
            />
          </li>
        ))}
      </ul>

      <div className="sign">
        <button onClick={handleLogout} className="logoutBtn">
          Logout
        </button>
        <p>Made with ❤️ by Amit Mehta</p>
      </div>
    </section>
  );
}
