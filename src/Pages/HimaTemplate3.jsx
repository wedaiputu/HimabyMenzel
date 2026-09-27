import { useEffect, useRef, useState } from "react";
import "../HimaTemplate3.css";

import { suiteCountWord } from "../data/site";
import { HERO_VIDEO, HERO_POSTER } from "../data/photos";
import { NAV_ITEMS } from "../data/navItems";

import Navbar from "../Components/Navbar";
import Hero from "../Components/Hero";
import ExperienceSection from "../Components/ExperienceSection";
import DiningSection from "../Components/DiningSection";
import SuitesSection from "../Components/SuitesSection";
import EventsSection from "../Components/EventsSection";
import BookSection from "../Components/BookSection";
import Footer from "../Components/Footer";

export default function HimaTemplate3() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const heroRef = useRef(null);
  const videoRef = useRef(null);
  const [heroSrc, setHeroSrc] = useState(null);
  const [posterSrc, setPosterSrc] = useState(HERO_POSTER.mobile);
  const [videoReady, setVideoReady] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 768px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pick = () => {
      setPosterSrc(wide.matches ? HERO_POSTER.desktop : HERO_POSTER.mobile);
      setHeroSrc(
        reduce.matches
          ? null
          : wide.matches
            ? HERO_VIDEO.desktop
            : HERO_VIDEO.mobile
      );
    };
    pick();
    wide.addEventListener("change", pick);
    reduce.addEventListener("change", pick);
    return () => {
      wide.removeEventListener("change", pick);
      reduce.removeEventListener("change", pick);
    };
  }, []);

  const scrollTo = (id) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileMenu(false);
  };

  return (
    <div className="hima-page" lang="en">
      <Navbar
        navItems={NAV_ITEMS}
        mobileMenu={mobileMenu}
        setMobileMenu={setMobileMenu}
        scrollTo={scrollTo}
      />

      <Hero
        heroRef={heroRef}
        videoRef={videoRef}
        heroSrc={heroSrc}
        posterSrc={posterSrc}
        videoReady={videoReady}
        setVideoReady={setVideoReady}
        logoFailed={logoFailed}
        setLogoFailed={setLogoFailed}
        scrollTo={scrollTo}
      />

      <ExperienceSection />
      <DiningSection />
      <SuitesSection suiteCountWord={suiteCountWord} />
      <EventsSection scrollTo={scrollTo} />
      <BookSection />
      <Footer />
    </div>
  );
}