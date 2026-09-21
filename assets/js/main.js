(function () {
  "use strict";

  var body = document.body;
  var gate = document.getElementById("gate");
  var openBtn = document.getElementById("openBtn");
  var music = document.getElementById("bgMusic");
  var musicToggle = document.getElementById("musicToggle");

  /* ---------- Abrir la sorpresa: revela el sitio y arranca la música ---------- */
  function setPlayingUI(isPlaying) {
    musicToggle.classList.toggle("is-playing", isPlaying);
    musicToggle.setAttribute("aria-pressed", isPlaying ? "true" : "false");
  }

  function openGate() {
    if (body.classList.contains("is-revealed")) return;
    body.classList.add("is-revealed");
    gate.classList.add("is-open");
    musicToggle.classList.add("is-visible");

    music.volume = 0.85;
    var playPromise = music.play();
    if (playPromise && typeof playPromise.then === "function") {
      playPromise.then(function () {
        setPlayingUI(true);
      }).catch(function () {
        setPlayingUI(false);
      });
    }

    window.setTimeout(function () {
      gate.style.display = "none";
    }, 950);
  }

  openBtn.addEventListener("click", openGate);

  musicToggle.addEventListener("click", function () {
    if (music.paused) {
      var p = music.play();
      if (p && typeof p.then === "function") {
        p.then(function () { setPlayingUI(true); }).catch(function () {});
      } else {
        setPlayingUI(true);
      }
    } else {
      music.pause();
      setPlayingUI(false);
    }
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* stagger the gallery cards a little as they cascade in */
  document.querySelectorAll(".gallery__item").forEach(function (el, i) {
    el.style.transitionDelay = (i % 4) * 0.08 + "s";
  });

  /* ---------- Lightbox de la galería ---------- */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = lightbox.querySelector(".lightbox__img");
  var lightboxCaption = lightbox.querySelector(".lightbox__caption");
  var closeBtn = lightbox.querySelector(".lightbox__close");
  var prevBtn = lightbox.querySelector(".lightbox__prev");
  var nextBtn = lightbox.querySelector(".lightbox__next");
  var items = Array.prototype.slice.call(document.querySelectorAll(".gallery__item"));
  var currentIndex = 0;

  function showImage(index) {
    currentIndex = (index + items.length) % items.length;
    var img = items[currentIndex].querySelector("img");
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = img.alt;
  }

  function openLightbox(index) {
    showImage(index);
    lightbox.classList.add("is-open");
    body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    body.style.overflow = "";
  }

  items.forEach(function (item, i) {
    item.addEventListener("click", function () { openLightbox(i); });
  });

  closeBtn.addEventListener("click", closeLightbox);
  prevBtn.addEventListener("click", function () { showImage(currentIndex - 1); });
  nextBtn.addEventListener("click", function () { showImage(currentIndex + 1); });

  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showImage(currentIndex - 1);
    if (e.key === "ArrowRight") showImage(currentIndex + 1);
  });
})();
