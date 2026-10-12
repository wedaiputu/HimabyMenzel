import { useNavigate } from "react-router-dom";
import { DINING_PHOTO } from "../data/photos";

export default function DiningSection() {
  const navigate = useNavigate();

  return (
    <section className="dining-screen" id="dining" aria-label="Dining">
      <img
        className="bg-photo"
        src={DINING_PHOTO}
        alt="A signature dish at Hima by Menzel"
      />
      <div className="scrim" />

      <div className="dining-heading">
        <div className="eyebrow-num">
          <span className="num">02</span> / Dining
        </div>
        <h2 className="serif">
          Asian Fusion
          <span className="small">with a sense of place.</span>
        </h2>
      </div>

      <div className="dining-foot">
        <button
          className="pill-btn pill-btn--light"
          onClick={() => navigate("/Menus")}
        >
          Check Menu
        </button>
        <div className="hours-line">Breakfast · Brunch · Lunch · Dinner</div>
      </div>
    </section>
  );
}