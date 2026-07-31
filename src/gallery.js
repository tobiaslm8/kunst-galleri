(() => {
  const cards = Array.from(document.querySelectorAll("[data-artwork]"));
  const lightbox = document.querySelector("[data-lightbox]");

  document.querySelectorAll(".mobileNav a").forEach((link) => {
    link.addEventListener("click", () => link.closest("details")?.removeAttribute("open"));
  });

  if (!lightbox || cards.length === 0) return;

  const image = lightbox.querySelector("[data-lightbox-image]");
  const title = lightbox.querySelector("[data-lightbox-title]");
  const artist = lightbox.querySelector("[data-lightbox-artist]");
  const counter = lightbox.querySelector("[data-lightbox-counter]");
  const closeButton = lightbox.querySelector("[data-lightbox-close]");
  const previousButton = lightbox.querySelector("[data-lightbox-previous]");
  const nextButton = lightbox.querySelector("[data-lightbox-next]");

  let activeIndex = 0;
  let lastTrigger = null;
  let touchStartX = 0;

  const update = () => {
    const card = cards[activeIndex];
    image.src = card.dataset.src || "";
    image.alt = card.dataset.alt || "";
    title.textContent = card.dataset.title || "Uden titel";
    artist.textContent = card.dataset.artist || "";
    artist.href = card.dataset.artistUrl || "#";
    counter.textContent = `${activeIndex + 1} / ${cards.length}`;
    const multiple = cards.length > 1;
    previousButton.hidden = !multiple;
    nextButton.hidden = !multiple;
  };

  const open = (index, trigger) => {
    activeIndex = index;
    lastTrigger = trigger;
    update();
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    closeButton.focus();
  };

  const close = () => {
    lightbox.hidden = true;
    document.body.style.overflow = "";
    lastTrigger?.focus();
  };

  const move = (direction) => {
    activeIndex = (activeIndex + direction + cards.length) % cards.length;
    update();
  };

  cards.forEach((card, index) => {
    card.addEventListener("click", () => open(index, card));
  });

  closeButton.addEventListener("click", close);
  previousButton.addEventListener("click", () => move(-1));
  nextButton.addEventListener("click", () => move(1));

  lightbox.addEventListener("mousedown", (event) => {
    if (event.target === lightbox) close();
  });

  lightbox.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0]?.clientX || 0;
  }, { passive: true });

  lightbox.addEventListener("touchend", (event) => {
    const touchEndX = event.changedTouches[0]?.clientX || 0;
    const distance = touchEndX - touchStartX;
    if (Math.abs(distance) > 55) move(distance > 0 ? -1 : 1);
  }, { passive: true });

  document.addEventListener("keydown", (event) => {
    if (lightbox.hidden) return;
    if (event.key === "Escape") close();
    if (event.key === "ArrowLeft") move(-1);
    if (event.key === "ArrowRight") move(1);
  });
})();
