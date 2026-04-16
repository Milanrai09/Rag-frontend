import { BrowserRouter, Routes, Route } from "react-router-dom";


import './App.css'
import Home from "./pages/Home";
import Website from "./pages/Website";
import Pdf from "./pages/Pdf";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pdf" element={<Pdf />} />
        <Route path="/website" element={<Website />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App
