import { BrowserRouter, Routes, Route } from "react-router-dom";
import HimaTemplate3 from "./Pages/HimaTemplate3";
import MenuPage from "./Pages/MenuPage";
import SuitesPage from "./Pages/SuitesPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HimaTemplate3 />} />
        <Route path="/Menus" element={<MenuPage />} />
        <Route path="/Suites" element={<SuitesPage />} />
      </Routes>
    </BrowserRouter>
  );
}