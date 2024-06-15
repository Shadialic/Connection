import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import UserRoutes from "./routes/Routes";

function App() {
  return (
    <div className="App">

   
  
  
      <Routes>
        <Route path="/*" element={<UserRoutes />}/>
      </Routes>
  
    </div>
  );
}

export default App;
