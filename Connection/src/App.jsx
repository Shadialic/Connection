import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import UserRoutes from "./routes/Routes";

function App() {
  return (
    <div className="App">

   
  
    <Router>
      <Routes>
        <Route path="/*" element={<UserRoutes />}/>
      </Routes>
    </Router>
    </div>
  );
}

export default App;
