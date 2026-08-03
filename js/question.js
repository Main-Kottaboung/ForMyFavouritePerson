/*
  question.js
  Page 4 - Q&A
*/

const questionRoot = document.querySelector("[data-question-root]");

if (questionRoot) {

  const formUrl =
    "https://docs.google.com/forms/d/e/1FAIpQLScTiyLg-NgCd1Pc9yz4Q1a9ZarQJyCu5NPPTkHe23_V-ZglUQ/viewform?usp=header";

  const state = {
    formOpened: localStorage.getItem("formOpened") === "true",
  };

  const page = document.createElement("div");
  page.className = "question-page__shell";

  page.innerHTML = `
    <div class="question-page__content">

      <p class="question-page__eyebrow">
        Page 4
      </p>

      <h2 class="question-page__title">
        One Last Thing ❤️
      </h2>

      <p class="question-page__subtitle">
        Before our story ends...
        <br>
        I have a few little questions for you.
      </p>

      <button
        class="question-page__button"
        type="button">
        💌 Answer My Questions
      </button>

      <p class="question-page__status" hidden>
        ❤️ Welcome back! <br>
        I'm excited to read your answers.
      </p>

      <button
        class="question-page__continue js-page-next"
        type="button"
        hidden>
        Continue Our Story →
      </button>

    </div>
  `;

  questionRoot.appendChild(page);

  const openButton = page.querySelector(".question-page__button");
  const status = page.querySelector(".question-page__status");
  const continueButton = page.querySelector(".question-page__continue");

  function showCompletedState() {
    status.hidden = false;
    continueButton.hidden = false;

    requestAnimationFrame(() => {
      status.classList.add("is-visible");
      continueButton.classList.add("is-visible");
    });

    openButton.textContent = "💌 Open Form Again";
  }

  if (state.formOpened) {
    showCompletedState();
  }

  openButton.addEventListener("click", () => {

    localStorage.setItem("formOpened", "true");
    state.formOpened = true;

    showCompletedState();

    window.open(formUrl, "_blank");

  });

}