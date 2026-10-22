// Каталог: фильтрация, сортировка, счётчик и высота шапки для sticky-фильтра
const header = document.querySelector('.site-header');
const filtersForm = document.getElementById('catalog-filters-form');
const resetButton = document.getElementById('reset-filters');
const grid = document.getElementById('catalog-grid');
const cards = Array.from(grid.querySelectorAll('.product-card'));
const countOutput = document.getElementById('catalog-count');
const emptyMessage = document.getElementById('catalog-empty');
const sortSelect = document.getElementById('catalog-sort');

// Исходный порядок карточек нужен для сортировки «По умолчанию»
const originalOrder = new Map(cards.map((card, index) => [card, index]));

// Высота шапки → CSS-переменная, чтобы sticky-фильтр не уходил под шапку
function updateHeaderHeight() {
  document.documentElement.style.setProperty('--header-height', header.offsetHeight + 'px');
}

function getSelectedCategories() {
  return Array.from(filtersForm.querySelectorAll('input[name="category"]:checked'))
    .map((input) => input.value);
}

function matchesFilters(card, categories, priceFrom, priceTo, onlyInStock) {
  const price = Number(card.dataset.price);
  const cardCategories = card.dataset.category.split(' ');

  // Если категории выбраны, товар должен относиться хотя бы к одной из них
  if (categories.length && !categories.some((c) => cardCategories.includes(c))) {
    return false;
  }
  if (!Number.isNaN(priceFrom) && price < priceFrom) return false;
  if (!Number.isNaN(priceTo) && price > priceTo) return false;
  if (onlyInStock && card.dataset.stock !== 'in') return false;
  return true;
}

function getSortedCards() {
  const mode = sortSelect.value;
  const sorted = [...cards];

  sorted.sort((a, b) => {
    if (mode === 'price-asc') return Number(a.dataset.price) - Number(b.dataset.price);
    if (mode === 'price-desc') return Number(b.dataset.price) - Number(a.dataset.price);
    if (mode === 'rating-desc') return Number(b.dataset.rating) - Number(a.dataset.rating);
    return originalOrder.get(a) - originalOrder.get(b);
  });

  return sorted;
}

function applyCatalog() {
  const categories = getSelectedCategories();
  const priceFrom = parseFloat(filtersForm.elements['price-from'].value);
  const priceTo = parseFloat(filtersForm.elements['price-to'].value);
  const onlyInStock = filtersForm.elements['in-stock'].checked;

  let visibleCount = 0;

  // Пересобираем порядок карточек по выбранной сортировке
  getSortedCards().forEach((card) => {
    grid.appendChild(card);
    const visible = matchesFilters(card, categories, priceFrom, priceTo, onlyInStock);
    card.hidden = !visible;
    if (visible) visibleCount += 1;
  });

  countOutput.textContent = `Показано товаров: ${visibleCount} из ${cards.length}`;
  emptyMessage.hidden = visibleCount > 0;
}

// Фильтры применяются сразу, отправка формы не нужна
filtersForm.addEventListener('submit', (event) => {
  event.preventDefault();
  applyCatalog();
});
filtersForm.addEventListener('change', applyCatalog);
filtersForm.addEventListener('input', applyCatalog);
sortSelect.addEventListener('change', applyCatalog);

// Reset срабатывает до сброса полей, поэтому пересчитываем после него
resetButton.addEventListener('click', () => {
  setTimeout(applyCatalog, 0);
});

window.addEventListener('resize', updateHeaderHeight);
updateHeaderHeight();
applyCatalog();
