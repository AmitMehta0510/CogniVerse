import Sidebar from "../components/Sidebar/Sidebar";
import ChatWindow from "../components/Chat/ChatWindow";
import "../App.css";

const ChatPage = () => (
  <div className="app">
    <Sidebar />
    <ChatWindow />
  </div>
);

export default ChatPage;
