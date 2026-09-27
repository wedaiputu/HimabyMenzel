import { useEffect } from "react";
import Navbar from "../Components/Navbar";
import SuitesDetailSection from "../Components/SuitesDetailSection";
import Footer from "../Components/Footer";
import { NAV_ITEMS } from "../data/navItems";
import "../HimaTemplate3.css";

export default function SuitesPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="hima-page" lang="en">
      <Navbar navItems={NAV_ITEMS} />
      <div style={{ paddingTop: "100px" }}>
        <SuitesDetailSection />
      </div>
      <Footer />
    </div>
  );
}