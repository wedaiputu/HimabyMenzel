import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import MenuSection from "../Components/MenuSection";
import Footer from "../Components/Footer";
import { NAV_ITEMS } from "../data/navItems";
import { categories, MENU_ITEMS } from "../data/menu";
import "../HimaTemplate3.css";

const MENU_PAGE_SIZE = 8;

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [showAllDishes, setShowAllDishes] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Filter menu items based on active tab category
  const filteredItems =
    activeCategory === "All"
      ? MENU_ITEMS
      : MENU_ITEMS.filter((item) => item.category === activeCategory);

  const visibleItems = showAllDishes
    ? filteredItems
    : filteredItems.slice(0, MENU_PAGE_SIZE);

  function selectCategory(category) {
    setActiveCategory(category);
    setShowAllDishes(false);
  }

  return (
    <div className="hima-page" lang="en">
      <Navbar navItems={NAV_ITEMS} />

      <div style={{ paddingTop: "120px" }}>
        <MenuSection
          categories={categories}
          activeCategory={activeCategory}
          selectCategory={selectCategory}
          visibleItems={visibleItems}
          filteredItems={filteredItems}
          showAllDishes={showAllDishes}
          setShowAllDishes={setShowAllDishes}
          pageSize={MENU_PAGE_SIZE}
        />
      </div>

      <Footer />
    </div>
  );
}