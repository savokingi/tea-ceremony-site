'use strict';
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.nav');
function closeMenu(returnFocus = false) {
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Открыть меню');
  if (returnFocus) menuButton.focus();
}
menuButton.addEventListener('click', () => {
  const open = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('open')) closeMenu(true);
});
document.addEventListener('click', event => {
  if (!event.target.closest('.header')) closeMenu();
});
window.matchMedia('(min-width: 641px)').addEventListener('change', event => {
  if (event.matches) closeMenu();
});
const formatSelect = document.querySelector('#guest-format');
const guestCount = document.querySelector('#guest-count');
const minusButton = document.querySelector('#guest-minus');
const plusButton = document.querySelector('#guest-plus');
const bookingForm = document.querySelector('#booking-form');
const bookingStatus = document.querySelector('.booking-status');
function updateDraft() {
  const count = Number(guestCount.value);
  const guestWord = count === 1 ? 'гость' : count < 5 ? 'гостя' : 'гостей';
  const message = `Андрей, привет! Хочу прийти на чай. Формат: ${formatSelect.value}. Планируем прийти: ${count} ${guestWord}. Подскажи, пожалуйста, ближайшие даты, стоимость и свободные места.`;
  bookingForm.action = `https://t.me/midkam?text=${encodeURIComponent(message)}`;
  minusButton.disabled = count <= 1;
  plusButton.disabled = count >= 7;
  bookingStatus.textContent = '';
}
document.querySelectorAll('.format-row').forEach(link => link.addEventListener('click', () => {
  formatSelect.value = link.dataset.format;
  updateDraft();
}));
formatSelect.addEventListener('change', updateDraft);
minusButton.addEventListener('click', () => { guestCount.value = Math.max(1, Number(guestCount.value) - 1); updateDraft(); });
plusButton.addEventListener('click', () => { guestCount.value = Math.min(7, Number(guestCount.value) + 1); updateDraft(); });
bookingForm.addEventListener('submit', event => {
  event.preventDefault();
  window.open(bookingForm.action, '_blank', 'noopener,noreferrer');
  bookingStatus.replaceChildren();
  const fallback = document.createElement('a');
  fallback.href = bookingForm.action;
  fallback.target = '_blank';
  fallback.rel = 'noopener noreferrer';
  fallback.textContent = 'Если чат не открылся, нажмите здесь ↗';
  fallback.style.textDecoration = 'underline';
  bookingStatus.append(fallback);
});
updateDraft();
document.querySelector('#year').textContent = new Date().getFullYear();
