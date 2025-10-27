import "./App.css";
import ChatWindow from "./ChatWindow";
import Sidebar from "./Sidebar";
import MyContext from "./MyContext";
import { useState } from "react";
import { v1 as uuidv1 } from "uuid";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]); // For storing previous prompts and replies
  const [newChat, setNewChat] = useState(true); // For handling new chat creation
  const [allThreads, setAllThreads] = useState([]); // For storing all chat threads
  const providerValues = {
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
    allThreads,
    setAllThreads,
  };

  return (
    <div className="app">
      <MyContext.Provider value={providerValues}>
        <Sidebar />
        <ChatWindow />
      </MyContext.Provider>
    </div>
  );
}

export default App;

// import "./App.css";
// import ChatWindow from "./ChatWindow";
// import Sidebar from "./Sidebar";
// import MyContext from "./MyContext";
// import { useState } from "react";
// import { v1 as uuidv1 } from "uuid";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// // Auth pages
// import Login from "./Login";
// import Register from "./Register";
// import ForgotPassword from "./ForgotPassword";
// import ResetPassword from "./ResetPassword";

// function App() {
//   const [prompt, setPrompt] = useState("");
//   const [reply, setReply] = useState(null);
//   const [currThreadId, setCurrThreadId] = useState(uuidv1());
//   const [prevChats, setPrevChats] = useState([]);
//   const [newChat, setNewChat] = useState(true);
//   const [allThreads, setAllThreads] = useState([]);

//   const providerValues = {
//     prompt,
//     setPrompt,
//     reply,
//     setReply,
//     currThreadId,
//     setCurrThreadId,
//     prevChats,
//     setPrevChats,
//     newChat,
//     setNewChat,
//     allThreads,
//     setAllThreads,
//   };

//   // Auth check
//   const token = localStorage.getItem("token");

//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Auth routes */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/forgot-password" element={<ForgotPassword />} />
//         <Route path="/reset-password/:token" element={<ResetPassword />} />

//         {/* Main Chat App (protected route) */}
//         <Route
//           path="/"
//           element={
//             token ? (
//               <div className="app">
//                 <MyContext.Provider value={providerValues}>
//                   <Sidebar />
//                   <ChatWindow />
//                 </MyContext.Provider>
//               </div>
//             ) : (
//               <Navigate to="/login" replace />
//             )
//           }
//         />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;
