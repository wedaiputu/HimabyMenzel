import { BrowserRouter, Route, Routes } from "react-router-dom";
import HimaTemplate from "./Pages/HimaTemplate";
import HimaTemplate2 from "./Pages/HimaTemplate2";
import HimaTemplate3 from "./Pages/HimaTemplate3";

export default function AppRoute() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HimaTemplate3 />} />
        <Route path="/1" element={<HimaTemplate />} />
        <Route path="/2" element={<HimaTemplate2/>} />
      </Routes>
    </BrowserRouter>
  );
}
