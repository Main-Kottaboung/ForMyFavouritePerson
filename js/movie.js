/*
  movie.js
  Page 3 cinematic memory playback.
  The video source is intentionally isolated so the final file path can be swapped later without changing the interaction logic.
*/

const movieRoot = document.querySelector('[data-movie-root]');

if (movieRoot) {
  const movie = {
    src: 'assets/videos/little-movie.mp4',
    poster: createPosterDataUri(),
    durationLabel: '01:42',
  };

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealDelay = prefersReducedMotion ? 0 : 900;
  const continueDelay = prefersReducedMotion ? 0 : 1400;

  const state = {
    video: null,
    card: null,
    overlay: null,
    playButton: null,
    message: null,
    continueButton: null,
    skipButton: null,
    title: null,
    subtitle: null,
    hasEnded: false,
    endTimers: [],
  };

  function createPosterDataUri() {
    const posterMarkup = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" role="img" aria-label="Cinematic memory poster">
        <defs>
          <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#f3e6d6"/>
            <stop offset="45%" stop-color="#e6d6c7"/>
            <stop offset="100%" stop-color="#d9c2be"/>
          </linearGradient>
          <radialGradient id="glow" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stop-color="#fff8ef" stop-opacity="0.95"/>
            <stop offset="55%" stop-color="#fff8ef" stop-opacity="0.25"/>
            <stop offset="100%" stop-color="#fff8ef" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="1200" height="675" fill="url(#bg)"/>
        <circle cx="600" cy="300" r="330" fill="url(#glow)"/>
        <rect x="160" y="130" width="880" height="415" rx="36" fill="rgba(255,255,255,0.16)" stroke="rgba(255,255,255,0.22)"/>
        <text x="600" y="300" text-anchor="middle" fill="#4b3f40" font-family="Georgia, serif" font-size="52" font-weight="700">Our Little Movie</text>
        <text x="600" y="362" text-anchor="middle" fill="#6a5c5d" font-family="Georgia, serif" font-size="24">A memory waiting to play</text>
        <circle cx="600" cy="470" r="54" fill="rgba(255,255,255,0.72)"/>
        <path d="M584 444 L584 496 L632 470 Z" fill="#5e4c4e"/>
      </svg>
    `;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(posterMarkup)}`;
  }

  const clearTimers = () => {
    state.endTimers.forEach((timerId) => window.clearTimeout(timerId));
    state.endTimers = [];
  };

  const queueTimer = (callback, delay) => {
    const timerId = window.setTimeout(callback, delay);
    state.endTimers.push(timerId);
    return timerId;
  };

  const render = () => {
    const page = document.createElement('div');
    page.className = 'movie-page__shell';

    const header = document.createElement('header');
    header.className = 'movie-page__header movie-fade-in';

    const eyebrow = document.createElement('p');
    eyebrow.className = 'movie-page__eyebrow';
    eyebrow.textContent = 'Page 3';

    const title = document.createElement('h2');
    title.className = 'movie-page__title';
    title.textContent = 'Our Little Movie';

    const subtitle = document.createElement('p');
    subtitle.className = 'movie-page__subtitle';
    subtitle.textContent = 'Some moments are better felt than described.';

    header.append(eyebrow, title, subtitle);

    const stage = document.createElement('section');
    stage.className = 'movie-page__stage';
    stage.setAttribute('aria-label', 'Romantic memory movie');

    const card = document.createElement('div');
    card.className = 'movie-card movie-fade-in';
    card.setAttribute('data-state', 'idle');

    const video = document.createElement('video');
    video.className = 'movie-card__video';
    video.src = movie.src;
    video.poster = movie.poster;
    video.preload = 'metadata';
    video.controls = false;
    video.playsInline = true;
    video.setAttribute('aria-label', 'A short memory video');

    const overlay = document.createElement('div');
    overlay.className = 'movie-card__overlay';

    const playButton = document.createElement('button');
    playButton.className = 'movie-card__play';
    playButton.type = 'button';
    playButton.setAttribute('aria-label', 'Play the memory video');
    playButton.innerHTML = '<span aria-hidden="true">▶</span>';

    const badge = document.createElement('p');
    badge.className = 'movie-card__badge';
    badge.textContent = 'Recorded with Love ❤️';

    const duration = document.createElement('p');
    duration.className = 'movie-card__duration';
    duration.textContent = movie.durationLabel;

    overlay.append(playButton, badge, duration);
    card.append(video, overlay);

    const message = document.createElement('div');
    message.className = 'movie-page__message';
    message.setAttribute('aria-live', 'polite');
    message.innerHTML = '<p>Every second with you</p><p>is my favorite memory.</p>';

    const continueButton = document.createElement('button');
    continueButton.className = 'movie-page__continue js-page-next';
    continueButton.type = 'button';
    continueButton.textContent = 'Continue Our Story →';
    continueButton.hidden = true;

    const skipButton = document.createElement('button');
    skipButton.className = 'movie-page__skip js-page-next';
    skipButton.type = 'button';
    skipButton.textContent = 'Skip →';
    skipButton.setAttribute('aria-label', 'Skip to the next page');

    stage.append(card, message, continueButton, skipButton);
    page.append(header, stage);
    movieRoot.appendChild(page);

    state.video = video;
    state.card = card;
    state.overlay = overlay;
    state.playButton = playButton;
    state.message = message;
    state.continueButton = continueButton;
    state.skipButton = skipButton;
    state.title = title;
    state.subtitle = subtitle;
  };

  const setPlayingState = (isPlaying) => {
    state.card.classList.toggle('is-playing', isPlaying);
    state.card.dataset.state = isPlaying ? 'playing' : 'idle';
    state.overlay.classList.toggle('is-hidden', isPlaying);
    state.playButton.classList.toggle('is-hidden', isPlaying);
    state.video.controls = isPlaying;
  };

  const showEnding = () => {
    if (state.hasEnded) {
      return;
    }

    state.hasEnded = true;
    clearTimers();

    queueTimer(() => {
      state.message.classList.add('is-visible');
    }, revealDelay);

    queueTimer(() => {
      state.continueButton.hidden = false;
      state.continueButton.classList.add('is-visible');
    }, revealDelay + continueDelay);
  };

  const playMovie = async () => {
    try {
      setPlayingState(true);
      await state.video.play();
    } catch (error) {
      setPlayingState(false);
    }
  };

  render();

  state.playButton.addEventListener('click', playMovie);
  state.video.addEventListener('play', () => {
    setPlayingState(true);
  });
  state.video.addEventListener('pause', () => {
    if (!state.hasEnded) {
      setPlayingState(false);
    }
  });
  state.video.addEventListener('ended', showEnding);

  if (prefersReducedMotion) {
    state.title.classList.add('movie-fade-in');
    state.subtitle.classList.add('movie-fade-in');
  }
}
