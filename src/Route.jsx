import { BrowserRouter, Routes, Route } from "react-router-dom";
import HimaTemplate3 from "./Pages/HimaTemplate3";
import MenuPage from "./Pages/MenuPage";
import SuitesPage from "./Pages/SuitesPage";
import MenuTemplate from "./Pages/MenuTemplate";
import MenuTemplate2 from "./Pages/MenuTemplate2";
import MenuTemplate3 from "./Pages/MenuTemplate3";  
import MenuTemplate4 from "./Pages/MenuTemplate4";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HimaTemplate3 />} />
        <Route path="/Menus" element={<MenuTemplate4 />} />
        <Route path="/Suites" element={<SuitesPage />} />
        <Route path="/Menus1" element={<MenuTemplate />} />
        <Route path="/Menus2" element={<MenuTemplate2 />} />
        <Route path="/Menus3" element={<MenuTemplate3 />} />
        <Route path="/Menus4" element={<MenusPage />} />
      </Routes>
    </BrowserRouter>
  );
}