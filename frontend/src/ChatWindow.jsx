import "./ChatWindow.css";
import Chat from "./Chat";
import MyContext from "./MyContext";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";

function ChatWindow() {
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
  } = useContext(MyContext);
  const [loading, setLoading] = useState(false);

  const getreply = async () => {
    setLoading(true);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: prompt,
        threadId: currThreadId,
      }),
    };
    try {
      const response = await fetch("http://localhost:3000/api/chat", options);
      const data = await response.json();
      console.log(data);
      setReply(data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };
  //Append new chat to prevChats
  useEffect(() => {
    if (prompt && reply) {
      setPrevChats((prevChats) => {
        [
          ...prevChats,
          {
            role: "user",
            content: prompt,
          },
          {
            role: "assistant",
            content: reply,
          },
        ];
      });
    }
    setPrompt("");
  }, [reply]);

  return (
    <div className="chatWindow">
      <div className="navbar">
        <span>
          CogniVerse <i className="fa-solid fa-chevron-down"></i>
        </span>
        <div className="userIconDiv">
          <span className="userIcon">
            <i className="fa-solid fa-user userIcon"></i>
          </span>
        </div>
      </div>
      <Chat></Chat>
      <ScaleLoader color="white" loading={loading} />
      <div className="chatInput">
        <div className="inputBox">
          <input
            placeholder="Ask Anything"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? getreply() : "")}
          ></input>
          <div id="submit" onClick={getreply}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>
        <p className="info">
          CogniVerse can make mistakes. Check important info. See Cookie
          Preferences.
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;
