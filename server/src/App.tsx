import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import "./App.css";
import Campaign from "./components/Campaign";
import { ToastContainer } from "react-toastify";
const App = () => {
  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/campaign/:id" element={<Campaign />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
