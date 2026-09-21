import { BrowserRouter, Route, Routes } from "react-router-dom";
import HimaTemplate from "./Pages/HimaTemplate";
import HimaTemplate2 from "./Pages/HimaTemplate2";

export default function AppRoute() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HimaTemplate2 />} />
        <Route path="/1" element={<HimaTemplate />} />
      </Routes>
    </BrowserRouter>
  );
}
