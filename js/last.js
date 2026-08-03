/*
  last.js
  Page 5 - Final Letter
*/

const lastRoot = document.querySelector("[data-last-root]");
console.log("LAST JS LOADED");

if (lastRoot) {

  const paragraphs = [
    "If you've made it all the way here...",
    "Thank you for spending all this time with me. ❤️",
    "Thank you for every laugh, every memory, and every little moment that made this past month the happiest month of my life.",
    "This website may come to an end here...",
    "But I hope our story is only just beginning.",
    "I don't know what the future has in store for us, but I do know one thing...",
    "As long as you're by my side, every single day feels special to me.",
    "Soon, we'll have to be apart for quite a while.",
    "I hope you'll stay strong and wait for the day we can finally be together again.",
    "Please don't give up on us, no matter how far apart we are or how difficult the distance may feel.",
    "Stay with me a little longer... I'll be waiting for the day I can hold you in my arms again.",
    "I hope we'll keep making beautiful memories, laughing together, teasing each other, making up after little arguments, and walking hand in hand for a very, very long time.",
    "I love you. ❤️",
    "Happy One Month Anniversary.",
    "So... stay with me, okay? ❤️"
    ];

  const page = document.createElement("div");
  page.className = "last-page__shell";

  page.innerHTML = `
      <div class="last-page__content">

          <p class="last-page__eyebrow">
              The End
          </p>

          <h2 class="last-page__title">
              Happy One Month ❤️
          </h2>

          <div class="last-page__letter"></div>

          <p class="last-page__love">
              I love you so much ❤️
          </p>

          <p class="last-page__signature">
              — From your boyfriend 🤍
          </p>

          <div class="last-page__hearts">
              ❤️ 🤍 ❤️ 🤍 ❤️
          </div>

      </div>
  `;

  lastRoot.appendChild(page);

  const letter = page.querySelector(".last-page__letter");
  const love = page.querySelector(".last-page__love");
  const sign = page.querySelector(".last-page__signature");
  const hearts = page.querySelector(".last-page__hearts");

  paragraphs.forEach(text => {

      const p = document.createElement("p");

      p.textContent = text;

      p.className = "last-page__paragraph";

      letter.appendChild(p);

  });

  const items = [
      ...letter.children,
      love,
      sign,
      hearts
  ];

  const observer = new IntersectionObserver(entries => {

    console.log("observer fired");
    const entry = entries[0];

    console.log("isIntersecting:", entry.isIntersecting);
    console.log("rect:", entry.boundingClientRect);

      entries.forEach(entry => {

          if (!entry.isIntersecting) return;

          console.log("START ANIMATION");

          items.forEach((item,index)=>{

              setTimeout(()=>{

                  item.classList.add("is-visible");

              },index*1200);

          });

          observer.disconnect();

      });

  },{

      threshold:0

  });

    // items.forEach((item,index)=>{

    //     setTimeout(()=>{

    //         item.classList.add("is-visible");

    //     }, index * 400);

    // });

  //observer.observe(page);
  observer.observe(lastRoot);

}