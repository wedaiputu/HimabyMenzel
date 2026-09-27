// NOTE: path is relative to this file (Hima/data/menu.js). The original
// import in HimaTemplate3.jsx was "../assets/json/HimaRestaurant.json" one
// level up from the page file — adjust this path if your folder layout
// differs.
import MENU from "../assets/json/HimaRestaurant.json";

export const MENU_ITEMS = MENU;

const MENU_CATEGORIES = [...new Set(MENU.map((item) => item.category))];
export const categories = ["All", ...MENU_CATEGORIES];