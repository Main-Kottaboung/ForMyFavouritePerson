/*
  gallery.js
  Page 2 scrapbook carousel logic.
  The data model is designed so placeholder cards can later be swapped to real images without changing the carousel behavior.
*/

const galleryRoot = document.querySelector('[data-gallery-root]');

if (galleryRoot) {
  const photos = [
    {
      id: 1,
      type: 'placeholder',
      color: '#FADADD',
      caption: 'Our Memory #1',
      label: 'Photo 1',
      rotation: -1.6,
    },
    {
      id: 2,
      type: 'placeholder',
      color: '#DCEBFF',
      caption: 'Our Memory #2',
      label: 'Photo 2',
      rotation: 1.2,
    },
    {
      id: 3,
      type: 'placeholder',
      color: '#E6DDF8',
      caption: 'Our Memory #3',
      label: 'Photo 3',
      rotation: -0.9,
    },
  ];

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const autoplayDelay = 5000;
  const resumeDelay = 5000;

  const state = {
    activeIndex: 0,
    slides: [],
    dots: [],
    track: null,
    viewport: null,
    prevButton: null,
    nextButton: null,
    counterCurrent: null,
    counterTotal: null,
    autoTimer: null,
    resumeTimer: null,
    drag: null,
  };

  const normalizeIndex = (index) => {
    const total = photos.length;
    return ((index % total) + total) % total;
  };
  
  const getSlideWidth = () => state.slides[0]?.getBoundingClientRect().width || state.viewport.clientWidth;

  const pauseAutoplay = () => {
    window.clearInterval(state.autoTimer);
    state.autoTimer = null;
    window.clearTimeout(state.resumeTimer);
    state.resumeTimer = null;
  };

  const startAutoplay = () => {
    if (prefersReducedMotion || photos.length < 2) {
      return;
    }

    pauseAutoplay();
    state.autoTimer = window.setInterval(() => {
      goToSlide(state.activeIndex + 1, 'auto');
    }, autoplayDelay);
  };

  const scheduleAutoplayResume = () => {
    if (prefersReducedMotion) {
      return;
    }

    window.clearTimeout(state.resumeTimer);
    state.resumeTimer = window.setTimeout(() => {
      startAutoplay();
    }, resumeDelay);
  };

  const createMedia = (photo) => {
    if (photo.src) {
      const image = document.createElement('img');
      image.className = 'polaroid__image';
      image.src = photo.src;
      image.alt = photo.alt || photo.caption || 'Memory photo';
      image.loading = 'lazy';
      image.decoding = 'async';
      return image;
    }

    const placeholder = document.createElement('div');
    placeholder.className = 'polaroid__placeholder';
    placeholder.textContent = photo.label || `Photo ${photo.id}`;
    return placeholder;
  };

  const renderCarousel = () => {
    const page = document.createElement('div');
    page.className = 'gallery-page';

    const header = document.createElement('header');
    header.className = 'gallery-page__header';

    const eyebrow = document.createElement('p');
    eyebrow.className = 'gallery-page__eyebrow';
    eyebrow.textContent = 'Page 2';

    const title = document.createElement('h2');
    title.className = 'gallery-page__title';
    title.textContent = 'Our Beautiful Memories';

    const subtitle = document.createElement('p');
    subtitle.className = 'gallery-page__subtitle';
    subtitle.textContent = 'Every photo is a little piece of my happiness.';

    header.append(eyebrow, title, subtitle);

    const stage = document.createElement('div');
    stage.className = 'gallery-page__stage';

    const carousel = document.createElement('section');
    carousel.className = 'gallery-carousel';
    carousel.setAttribute('aria-roledescription', 'carousel');
    carousel.setAttribute('aria-label', 'Photo album carousel');

    const viewport = document.createElement('div');
    viewport.className = 'gallery-carousel__viewport';
    viewport.tabIndex = 0;
    viewport.setAttribute('aria-label', 'Use swipe, drag, or arrow keys to move through the photos');

    const track = document.createElement('div');
    track.className = 'gallery-carousel__track';

    photos.forEach((photo, index) => {
      const slide = document.createElement('article');
      slide.className = 'gallery-carousel__slide';
      slide.id = `gallery-slide-${photo.id}`;
      slide.dataset.index = String(index);
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-roledescription', 'slide');
      slide.setAttribute('aria-label', `${index + 1} of ${photos.length}`);
      slide.setAttribute('aria-hidden', 'true');

      const polaroid = document.createElement('figure');
      polaroid.className = 'polaroid';
      polaroid.style.setProperty('--rotation', `${photo.rotation || 0}deg`);
      polaroid.style.setProperty('--photo-color', photo.color || '#FADADD');

      const frame = document.createElement('div');
      frame.className = 'polaroid__frame';
      frame.appendChild(createMedia(photo));

      const caption = document.createElement('figcaption');
      caption.className = 'polaroid__caption';
      caption.textContent = photo.caption;

      polaroid.append(frame, caption);
      slide.appendChild(polaroid);
      track.appendChild(slide);
    });

    viewport.appendChild(track);

    const controls = document.createElement('div');
    controls.className = 'gallery-carousel__meta';

    const prevButton = document.createElement('button');
    prevButton.className = 'storybook__nav gallery-carousel__arrow gallery-carousel__arrow--prev';
    prevButton.type = 'button';
    prevButton.setAttribute('aria-label', 'Show the previous memory');
    prevButton.textContent = 'Previous';

    const counter = document.createElement('div');
    counter.className = 'gallery-carousel__counter';
    counter.setAttribute('aria-live', 'polite');
    counter.innerHTML = '<span data-counter-current>1</span> / <span data-counter-total>3</span>';

    const nextButton = document.createElement('button');
    nextButton.className = 'storybook__nav gallery-carousel__arrow gallery-carousel__arrow--next';
    nextButton.type = 'button';
    nextButton.setAttribute('aria-label', 'Show the next memory');
    nextButton.textContent = 'Next';

    controls.append(prevButton, counter, nextButton);

    const dots = document.createElement('div');
    dots.className = 'gallery-carousel__dots';
    dots.setAttribute('role', 'tablist');
    dots.setAttribute('aria-label', 'Photo pagination');

    photos.forEach((photo, index) => {
      const dot = document.createElement('button');
      dot.className = 'gallery-carousel__dot';
      dot.type = 'button';
      dot.setAttribute('aria-label', `Go to photo ${index + 1}`);
      dot.setAttribute('aria-controls', `gallery-slide-${photo.id}`);
      dots.appendChild(dot);
    });

    carousel.append(viewport, controls, dots);
    stage.appendChild(carousel);
    page.append(header, stage);
    galleryRoot.appendChild(page);

    state.slides = Array.from(track.children);
    state.dots = Array.from(dots.children);
    state.track = track;
    state.viewport = viewport;
    state.prevButton = prevButton;
    state.nextButton = nextButton;
    state.counterCurrent = counter.querySelector('[data-counter-current]');
    state.counterTotal = counter.querySelector('[data-counter-total]');

    state.slides.forEach((slide) => {
      slide.setAttribute('aria-hidden', 'true');
    });
  };

  const updateControls = () => {
    state.prevButton.disabled = false;
    state.nextButton.disabled = false;
  };

  const updateState = (nextIndex, { fromInteraction = false } = {}) => {
    state.activeIndex = normalizeIndex(nextIndex);

    const slideWidth = getSlideWidth();
    state.track.style.transform = `translateX(-${state.activeIndex * slideWidth}px)`;

    state.slides.forEach((slide, index) => {
      const isActive = index === state.activeIndex;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
    });

    state.dots.forEach((dot, index) => {
      const isActive = index === state.activeIndex;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-selected', String(isActive));
      dot.tabIndex = isActive ? 0 : -1;
    });

    state.counterCurrent.textContent = String(state.activeIndex + 1);
    state.counterTotal.textContent = String(photos.length);
    updateControls();

    if (fromInteraction) {
      pauseAutoplay();
      scheduleAutoplayResume();
    }
  };

  const goToSlide = (index, source = 'manual') => {
    const nextIndex = normalizeIndex(index);

    if (nextIndex === state.activeIndex) {
      return;
    }

    updateState(nextIndex, { fromInteraction: source !== 'auto' });
  };

  const endDrag = () => {
    if (!state.drag) {
      return;
    }

    const { startX, currentX } = state.drag;
    const deltaX = currentX - startX;
    const threshold = Math.max(40, getSlideWidth() * 0.12);

    state.viewport.releasePointerCapture?.(state.drag.pointerId);

    state.viewport.classList.remove('is-dragging');
    state.drag = null;

    if (deltaX > threshold) {
      goToSlide(state.activeIndex - 1);
      return;
    }

    if (deltaX < -threshold) {
      goToSlide(state.activeIndex + 1);
      return;
    }

    updateState(state.activeIndex);
    scheduleAutoplayResume();
  };

  const handlePointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) {
      return;
    }

    state.drag = {
      pointerId: event.pointerId,
      startX: event.clientX,
      currentX: event.clientX,
    };

    state.viewport.classList.add('is-dragging');
    state.viewport.setPointerCapture(event.pointerId);
    pauseAutoplay();
  };

  const handlePointerMove = (event) => {
    if (!state.drag || state.drag.pointerId !== event.pointerId) {
      return;
    }

    state.drag.currentX = event.clientX;
    const deltaX = state.drag.currentX - state.drag.startX;
    const offset = (-state.activeIndex * getSlideWidth()) + deltaX;
    state.track.style.transform = `translateX(${offset}px)`;
  };

  const handlePointerUp = (event) => {
    if (!state.drag || state.drag.pointerId !== event.pointerId) {
      return;
    }

    endDrag();
  };

  const handlePointerCancel = (event) => {
    if (!state.drag || state.drag.pointerId !== event.pointerId) {
      return;
    }

    state.viewport.releasePointerCapture?.(event.pointerId);
    state.viewport.classList.remove('is-dragging');
    state.drag = null;
    updateState(state.activeIndex);
    scheduleAutoplayResume();
  };

  const handleResize = () => {
    updateState(state.activeIndex);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goToSlide(state.activeIndex - 1);
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      goToSlide(state.activeIndex + 1);
    }
  };

  renderCarousel();

  state.prevButton.addEventListener('click', () => goToSlide(state.activeIndex - 1));
  state.nextButton.addEventListener('click', () => goToSlide(state.activeIndex + 1));

  state.dots.forEach((dot, index) => {
    dot.addEventListener('click', () => goToSlide(index));
  });

  state.viewport.addEventListener('pointerdown', handlePointerDown);
  state.viewport.addEventListener('pointermove', handlePointerMove);
  state.viewport.addEventListener('pointerup', handlePointerUp);
  state.viewport.addEventListener('pointercancel', handlePointerCancel);
  state.viewport.addEventListener('keydown', handleKeyDown);
  state.viewport.addEventListener('mouseenter', pauseAutoplay);
  state.viewport.addEventListener('mouseleave', scheduleAutoplayResume);
  state.viewport.addEventListener('focusin', pauseAutoplay);
  state.viewport.addEventListener('focusout', scheduleAutoplayResume);
  window.addEventListener('resize', handleResize);

  updateState(0);

  if (!prefersReducedMotion) {
    startAutoplay();
  }
}
