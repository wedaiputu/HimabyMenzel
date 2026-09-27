import Art from "../data/Art";

export default function MenuSection({
  categories = [],
  activeCategory = "All",
  selectCategory = () => {},
  visibleItems = [],
  filteredItems = [],
  showAllDishes = false,
  setShowAllDishes = () => {},
  pageSize = 8,
}) {
  return (
    <section className="menu-detail" id="menu" aria-label="Menu">
      <div className="section-header">
        <div>
          <div className="eyebrow-num">
            <span className="num">—</span> From the Kitchen
          </div>
          <h2>Our favourites</h2>
        </div>
        <p>
          Simple, fresh and generous. A short menu, cooked properly and served
          warm.
        </p>
      </div>

      <div className="filters" role="group" aria-label="Menu category">
        {categories.map((category) => (
          <button
            key={category}
            className={`filter ${activeCategory === category ? "active" : ""}`}
            aria-pressed={activeCategory === category}
            onClick={() => selectCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="menu-grid">
        {visibleItems.map((item, index) => (
          <article className="menu-card" key={`${item.name}-${index}`}>
            <Art
              className="menu-img"
              src={item.img}
              variant={(index % 3) + 1}
              alt={item.name}
            />
            <div className="menu-content">
              <div className="menu-category">{item.category}</div>
              <div className="menu-name serif">{item.name}</div>
              {item.price && <div className="menu-price">{item.price}</div>}
            </div>
          </article>
        ))}
      </div>

      {filteredItems.length > pageSize && (
        <div className="menu-more">
          <button
            type="button"
            className="pill-btn pill-btn--outline"
            onClick={() => setShowAllDishes((s) => !s)}
          >
            {showAllDishes
              ? "Show less"
              : `Show all ${filteredItems.length} ${
                  activeCategory === "All"
                    ? "dishes"
                    : activeCategory.toLowerCase()
                }`}
          </button>
        </div>
      )}
    </section>
  );
}