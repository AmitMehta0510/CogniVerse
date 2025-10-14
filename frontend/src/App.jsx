import { useState } from "react";
import "./App.css";
import ChatWindow from "./ChatWindow";
import Sidebar from "./Sidebar";
import MyContext from "./MyContext";

function App() {
  const providerValues = {};

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
