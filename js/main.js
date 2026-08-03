/*
  main.js
  Vertical Storybook Navigation
*/

const pages = [...document.querySelectorAll(".storybook__page")];

const scrollToPage = (index) => {
  if (index < 0 || index >= pages.length) return;

  pages[index].scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
};

document.addEventListener("click", (event) => {
  const next = event.target.closest(".js-page-next");
  if (next) {
    //event.preventDefault();

    const currentPage = next.closest(".storybook__page");
    const currentIndex = pages.indexOf(currentPage);

    scrollToPage(currentIndex + 1);
    return;
  }

  const prev = event.target.closest(".js-page-prev");
  if (prev) {
    //event.preventDefault();

    const currentPage = prev.closest(".storybook__page");
    const currentIndex = pages.indexOf(currentPage);

    scrollToPage(currentIndex - 1);
  }
});

// Highlight active page (optional)
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("is-active", entry.isIntersecting);
    });
  },
  {
    threshold: 0.6
  }
);

pages.forEach((page) => observer.observe(page));