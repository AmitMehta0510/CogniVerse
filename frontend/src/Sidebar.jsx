import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext";
import { v1 as uuidv1 } from "uuid";

function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    setPrevChats,
  } = useContext(MyContext);

  const getAllThreads = async () => {
    try {
      const response = await fetch("http://localhost:5000/threads");
      const res = await response.json();
      const filteredData = res.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));
      setAllThreads(filteredData);
    } catch (err) {}
  };
  useEffect(() => {
    getAllThreads();
  }, currThreadId);

  const createNewChat = async () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  };

  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);
    try {
      const response = await fetch(
        `http://localhost:5000/thread/${newThreadId}`
      );
      const res = await response.json();
      setPrevChats(res);
      setNewChat(false);
      setReply(null);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteThread = async (threadId) => {
    try {
      const response = await fetch(`http://localhost:5000/thread/${threadId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setAllThreads((prevThreads) =>
          prevThreads.filter((thread) => thread.threadId !== threadId)
        );
      }
      if(threadId === currThreadId) {
        createNewChat();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="sidebar">
      <button onClick={createNewChat}>
        <img className="logo" src="src/assets/blacklogo.png" alt="logo" />
        <span>
          <i className="fa-solid fa-pen-to-square"></i>
        </span>
      </button>

      <ul className="history">
        {allThreads?.map((thread, idx) => (
          <li key={idx} onClick={changeThread}>
            {thread.title}
            <i className="fa-solid fa-trash" onClick={() => {
              e.stopPropagation();//stop event bubbling
              deleteThread(currThreadId)
            }}></i>
          </li>
        ))}
      </ul>

      <div className="sign">
        <p>Made with ❤️ by Amit Mehta</p>
      </div>
    </section>
  );
}
export default Sidebar;
