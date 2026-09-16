import { BrowserRouter, Route, Routes } from "react-router-dom";
import HimaTemplate from "./Page/HimaTemplate";

export default function AppRoute() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HimaTemplate />} />
      </Routes>
    </BrowserRouter>
  );
}
