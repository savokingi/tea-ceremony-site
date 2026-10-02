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
const ritualDescriptions = [
  'Приходите, выбираете место и знакомитесь. Никакого экзамена на знание традиций: мы расскажем всё, что захочется узнать.',
  'Знакомимся с сухим листом, согреваем посуду, делаем первый пролив. Пробуем несколько чаёв и замечаем, как меняется вкус одной и той же заварки.',
  'Разговариваем, задаём вопросы или просто пьём чай в тишине. У вечера нет обязательной темы — найдётся место и для вашей.'
];
const ritualTabs = [...document.querySelectorAll('.ritual-tab')];
function selectRitual(index, focus = false) {
  ritualTabs.forEach((tab, tabIndex) => {
    const active = tabIndex === index;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  document.querySelector('#ritual-description').textContent = ritualDescriptions[index];
  document.querySelector('#ritual-panel').setAttribute('aria-labelledby', ritualTabs[index].id);
  if (focus) ritualTabs[index].focus();
}
ritualTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectRitual(index));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % ritualTabs.length;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index + ritualTabs.length - 1) % ritualTabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = ritualTabs.length - 1;
    if (next !== undefined) { event.preventDefault(); selectRitual(next, true); }
  });
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
  const message = `Андрей, здравствуйте! Хочу узнать о ближайшей встрече. Формат: ${formatSelect.value}. Нас будет ${count} ${guestWord}. Подскажите, пожалуйста, даты, стоимость и свободные места.`;
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
