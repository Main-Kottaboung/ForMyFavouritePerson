/*
  main.js
  Entry point for general page initialization.
  Section logic will be wired in later after approval for each feature area.
*/

const storybook = document.querySelector('.storybook');
const pages = Array.from(document.querySelectorAll('.storybook__page'));
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let activePageIndex = 0;

const getChapterLabel = (pageIndex) => `Chapter ${pageIndex + 1} / ${pages.length}`;

const createNavigationButton = (label, directionClass, direction) => {
  const button = document.createElement('button');
  button.className = `storybook__nav storybook__chapter-nav-button ${directionClass} js-page-${direction}`;
  button.type = 'button';
  button.textContent = label;
  return button;
};

const createSectionNavigation = (pageIndex) => {
  const navigation = document.createElement('nav');
  navigation.className = 'storybook__section-nav';
  navigation.setAttribute('aria-label', getChapterLabel(pageIndex));

  const row = document.createElement('div');
  row.className = 'storybook__section-nav-row';

  if (pageIndex > 0) {
    row.appendChild(createNavigationButton('← Previous', 'storybook__chapter-nav-button--prev', 'prev'));
  }

  if (pageIndex < pages.length - 1) {
    row.appendChild(createNavigationButton('Next →', 'storybook__chapter-nav-button--next', 'next'));
  }

  const counter = document.createElement('p');
  counter.className = 'storybook__section-nav-counter';
  counter.textContent = getChapterLabel(pageIndex);

  navigation.append(row, counter);
  return navigation;
};

const updateStorybook = (index) => {
  const nextIndex = Math.max(0, Math.min(index, pages.length - 1));
  activePageIndex = nextIndex;
  storybook.style.transform = `translate3d(-${nextIndex * 100}vw, 0, 0)`;

  pages.forEach((page, pageIndex) => {
    const isActive = pageIndex === nextIndex;
    page.classList.toggle('is-active', isActive);
    page.setAttribute('aria-hidden', String(!isActive));

    if (isActive) {
      page.removeAttribute('inert');
    } else {
      page.setAttribute('inert', '');
    }
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

const injectSectionNavigation = () => {
  pages.forEach((page, pageIndex) => {
    if (pageIndex === 0) {
      return;
    }

    page.appendChild(createSectionNavigation(pageIndex));
  });
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

storybook?.addEventListener('wheel', (event) => {
  event.preventDefault();
}, { passive: false });

if (storybook && pages.length > 0) {
  injectSectionNavigation();
  updateStorybook(0);
}
