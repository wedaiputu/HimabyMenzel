import { BrowserRouter, Routes, Route } from "react-router-dom";
import HimaTemplate3 from "./Pages/HimaTemplate3";
import MenuPage from "./Pages/MenuPage";
import SuitesPage from "./Pages/SuitesPage";
import MenuTemplate from "./Pages/MenuTemplate";
import MenuTemplate2 from "./Pages/MenuTemplate2";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HimaTemplate3 />} />
        <Route path="/Menus" element={<MenuPage />} />
        <Route path="/Suites" element={<SuitesPage />} />
        <Route path="/Menus1" element={<MenuTemplate />} />
        <Route path="/Menus2" element={<MenuTemplate2 />} />
      </Routes>
    </BrowserRouter>
  );
}