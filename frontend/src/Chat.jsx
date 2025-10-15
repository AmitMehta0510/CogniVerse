import "./Chat.css";
import { useContext, useState, useEffect } from "react";
import MyContext from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
//react-markdown, rehype-highlight for formating code blocks

function Chat() {
  const { newChat, prevChats, reply } = useContext(MyContext);
  const [latestReply, setLatestReply] = useState(null);

  useEffect(() => {
    if (reply === null) {
      setLatestReply(null);
      return;
    }
    //separate latest reply and add typing effect
    if (!prevChats.length) return;
    const content = reply.split(" ");
    let index = 0;
    const interval = setInterval(() => {
      setLatestReply(content.slice(0, index + 1).join(" "));
      index++;
      if (index >= content.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [prevChats, reply]);

  return (
    <>
      {newChat && <h1>Start a New Chat</h1>}
      <div className="chats">
        {prevChats.map((chat, idx) => {
          <div
            className={chat.role === "user" ? "userDiv" : "gptDiv"}
            key={idx}
          >
            {chat.role === "user" ? (
              <p className="userMessage">{chat.content}</p>
            ) : (
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {chat.content}
              </ReactMarkdown>
            )}
          </div>;
        })}

        {prevChats.length > 0 && (
          <>
            {latestReply === null ? (
              <div className="gptDiv" key="non-typing">
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {prevChats[prevChats.length - 1].content}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="gptDiv" key="typing">
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {latestReply}
                </ReactMarkdown>
              </div>
            )}
          </>
        )}

      </div>
    </>
  );
}

export default Chat;
