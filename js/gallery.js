/*
  gallery.js
  Page 2 scrapbook carousel logic.
  The data model is designed so placeholder cards can later be swapped to real images without changing the carousel behavior.
*/

const galleryRoot = document.querySelector('[data-gallery-root]');

if (galleryRoot) {
  const photos = [
    { id: 1, src: 'assets/images/001.webp', caption: 'คบกันวันแรก อิ้อิ้' },
    { id: 2, src: 'assets/images/002.webp', caption: 'แก้มเธอน่าหยิกมากรูปนี้' },
    { id: 3, src: 'assets/images/003.webp', caption: 'น่ารักจริงๆ เจ้าแว่น หิหิ' },
    { id: 4, src: 'assets/images/004.webp', caption: 'ฉันว่าหน้าฉันค่อนข้างแปลก555' },
    { id: 5, src: 'assets/images/005.webp', caption: 'หิหิ เจ้าแว่นตัวเล็ก' },
    { id: 6, src: 'assets/images/006.webp', caption: 'มอม5555' },
    { id: 7, src: 'assets/images/007.webp', caption: 'แก้มแมวกับแก้มเธอพอๆกันเลย' },
    { id: 8, src: 'assets/images/008.webp', caption: 'อุ้ยย' },
    { id: 9, src: 'assets/images/009.webp', caption: 'โครตมอม ทั้งคู่555' },
    { id: 10, src: 'assets/images/010.webp', caption: 'ชิ มองอะไร เจ้าแว่น!' },
    { id: 11, src: 'assets/images/011.webp', caption: 'อันนี้ผีแว่น555' },
    { id: 12, src: 'assets/images/012.webp', caption: 'หน้าเธอค่อนข้างทะเล้นนะ' },
    { id: 13, src: 'assets/images/013.webp', caption: 'แต่ไม่เป็นไร น่ารักดี อิ้อิ้' },
    { id: 14, src: 'assets/images/014.webp', caption: 'ตอนถ่ายรูปนี้อะ กำลังคิดอยู่' },
    { id: 15, src: 'assets/images/015.webp', caption: 'ว่าจะกอดดมั้ยนะ หิหิ' },
    { id: 16, src: 'assets/images/016.webp', caption: 'สุดท้ายก็เลยกอด :>' },
    { id: 17, src: 'assets/images/017.webp', caption: 'แอบขโมยรถแม่ขับไปเชียร์เด็ก' },
    { id: 18, src: 'assets/images/018.webp', caption: 'ทิ้งแม่ พาเด็กไปเที่ยว555' },
    { id: 19, src: 'assets/images/019.webp', caption: 'วันนนั้นเธอดูเหนื่อยมาก' },
    { id: 20, src: 'assets/images/020.webp', caption: 'ไม่ค่อยยิ้มเลย' },
    { id: 21, src: 'assets/images/021.webp', caption: 'บอกเลยว่าไม่รู้จะทำอะไรเลย' },
    { id: 22, src: 'assets/images/022.webp', caption: 'แต่สุดท้ายก็ทำให้เจ้าแว่นยิ้มได้ หิหิ' },
    { id: 23, src: 'assets/images/023.webp', caption: 'คบกันนานๆ นะ เจ้าแว่น' },
  ];

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const autoplayDelay = 5000;
  const resumeDelay = 5000;

  const state = {
    activeIndex: 0,
    slides: [],
    track: null,
    viewport: null,
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

  const getSlideWidth = () => state.slides[0]?.offsetWidth || state.viewport.clientWidth;

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

    // const controls = document.createElement('div');
    // controls.className = 'gallery-carousel__meta';

    // const counter = document.createElement('div');
    // counter.className = 'gallery-carousel__counter';
    // counter.setAttribute('aria-live', 'polite');
    // counter.innerHTML = '<span data-counter-current>1</span> / <span data-counter-total>3</span>';

    // controls.append(counter);

    // carousel.append(viewport, controls);
    const controls = document.createElement('div');
    controls.className = 'gallery-carousel__meta';

    const counter = document.createElement('div');
    counter.className = 'gallery-carousel__counter';
    counter.setAttribute('aria-live', 'polite');
    counter.innerHTML =
      '<span data-counter-current>1</span> / <span data-counter-total>3</span>';

    const nextSectionButton = document.createElement('button');
    nextSectionButton.type = 'button';
    nextSectionButton.className =
      'storybook__nav gallery-carousel__next-section js-page-next';

    nextSectionButton.textContent = 'Continue Our Story →';

    controls.append(counter, nextSectionButton);

    carousel.append(viewport, controls);
    stage.appendChild(carousel);
    page.append(header, stage);
    galleryRoot.appendChild(page);

    state.slides = Array.from(track.children);
    state.track = track;
    state.viewport = viewport;
    state.counterCurrent = counter.querySelector('[data-counter-current]');
    state.counterTotal = counter.querySelector('[data-counter-total]');

    state.slides.forEach((slide) => {
      slide.setAttribute('aria-hidden', 'true');
    });
  };

  const updateControls = () => {
    return;
  };

  const updateState = (nextIndex, { fromInteraction = false } = {}) => {
    state.activeIndex = normalizeIndex(nextIndex);

    const slideWidth = getSlideWidth();
    state.track.style.transform = `translate3d(-${state.activeIndex * slideWidth}px, 0, 0)`;

    state.slides.forEach((slide, index) => {
      const isActive = index === state.activeIndex;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
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
    state.track.style.transform = `translate3d(${offset}px, 0, 0)`;
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
      //event.preventDefault();
      goToSlide(state.activeIndex - 1);
    }

    if (event.key === 'ArrowRight') {
      //event.preventDefault();
      goToSlide(state.activeIndex + 1);
    }
  };

  renderCarousel();

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
