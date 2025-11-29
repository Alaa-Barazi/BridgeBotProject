import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import MainLayout from "./layout/mainLayout";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <MainLayout />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<MainLayout />} />
        {/*<Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />*/}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
