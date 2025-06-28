import React from "react";
import Homepage from "./assets/Homepage";
import Login from "./assets/Login";
import Register from "./assets/Register";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "lucide-react";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
