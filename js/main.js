/*
  main.js
  Entry point for general page initialization.
  Section logic will be wired in later after approval for each feature area.
*/

const storybook = document.querySelector('.storybook');
const pages = Array.from(document.querySelectorAll('.storybook__page'));
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let activePageIndex = 0;

const updateStorybook = (index) => {
  const nextIndex = Math.max(0, Math.min(index, pages.length - 1));
  activePageIndex = nextIndex;
  storybook.style.transform = `translateX(-${nextIndex * 100}vw)`;

  pages.forEach((page, pageIndex) => {
    const isActive = pageIndex === nextIndex;
    page.classList.toggle('is-active', isActive);
    page.setAttribute('aria-hidden', String(!isActive));
  });
	
  return nextIndex;
};

const goToPage = (index) => {
  if (!storybook || pages.length === 0) {
    return;
  }

  if (prefersReducedMotion) {
    updateStorybook(index);
    return;
  }

  storybook.classList.add('is-transitioning');
  updateStorybook(index);
  window.setTimeout(() => {
    storybook.classList.remove('is-transitioning');
  }, 750);
};

document.addEventListener('click', (event) => {
  const nextButton = event.target.closest('.js-page-next');
  if (nextButton) {
    goToPage(activePageIndex + 1);
    return;
  }

  const prevButton = event.target.closest('.js-page-prev');
  if (prevButton) {
    goToPage(activePageIndex - 1);
  }
});

if (storybook && pages.length > 0) {
  updateStorybook(0);
}
