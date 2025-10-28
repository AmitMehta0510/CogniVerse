import "./Chat.css";
import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

export default function Chat() {
  const { newChat, prevChats, reply } = useContext(ChatContext);
  const [latestReply, setLatestReply] = useState(null);

  useEffect(() => {
    if (reply === null) {
      setLatestReply(null);
      return;
    }
    if (!prevChats.length) return;

    const content = reply.split(" ");
    let index = 0;
    const interval = setInterval(() => {
      setLatestReply(content.slice(0, index + 1).join(" "));
      index++;
      if (index >= content.length) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, [prevChats, reply]);

  return (
    <>
      {newChat && <h1 style={{ marginTop: 40 }}>Start a New Chat</h1>}
      <div className="chats">
        {prevChats.map((chat, idx) => (
          <div key={idx} className={chat.role === "user" ? "userDiv" : "gptDiv"}>
            {chat.role === "user" ? (
              <p className="userMessage">{chat.content}</p>
            ) : (
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {chat.content}
              </ReactMarkdown>
            )}
          </div>
        ))}

        {prevChats.length > 0 && latestReply && (
          <div className="gptDiv" key="typing">
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
              {latestReply}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </>
  );
}
