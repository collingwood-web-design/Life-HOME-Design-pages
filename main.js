(function () {
  var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
  var thumbs = Array.prototype.slice.call(document.querySelectorAll(".hero-thumb"));
  var playButton = document.querySelector(".hero-play");
  var playIcon = playButton ? playButton.querySelector(".icon-play") : null;
  var pauseIcon = playButton ? playButton.querySelector(".icon-pause") : null;
  var index = 0;
  var timer = null;

  function show(next) {
    index = (next + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      var active = i === index;
      slide.classList.toggle("is-active", active);
      slide.hidden = !active;
    });
    thumbs.forEach(function (thumb, i) {
      var active = i === index;
      thumb.classList.toggle("is-active", active);
      if (active) {
        thumb.setAttribute("aria-current", "true");
      } else {
        thumb.removeAttribute("aria-current");
      }
    });
  }

  function setPlaying(playing) {
    playIcon.hidden = playing;
    pauseIcon.hidden = !playing;
    playButton.setAttribute("aria-label", playing ? "Pause slideshow" : "Play slideshow");
  }

  function stop() {
    window.clearInterval(timer);
    timer = null;
    setPlaying(false);
  }

  function start() {
    if (timer) {
      return;
    }
    timer = window.setInterval(function () {
      show(index + 1);
    }, 5000);
    setPlaying(true);
  }

  if (playButton) {
    thumbs.forEach(function (thumb, i) {
      thumb.addEventListener("click", function () {
        show(i);
      });
    });

    playButton.addEventListener("click", function () {
      if (timer) {
        stop();
      } else {
        start();
      }
    });
  }

  var menuToggle = document.querySelector(".menu-toggle");
  var mobileNav = document.getElementById("mobile-nav");
  menuToggle.addEventListener("click", function () {
    var open = mobileNav.hasAttribute("hidden");
    mobileNav.hidden = !open;
    menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  var newsletter = document.getElementById("newsletter-form");
  var newsletterSuccess = document.getElementById("newsletter-success");
  if (newsletter) newsletter.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!newsletter.reportValidity()) {
      return;
    }
    newsletter.hidden = true;
    newsletterSuccess.hidden = false;
  });

  var toTop = document.querySelector(".to-top");
  window.addEventListener("scroll", function () {
    toTop.classList.toggle("is-visible", window.scrollY > 500);
  });
  toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  document.querySelectorAll(".toggle-head").forEach(function (button) {
    button.addEventListener("click", function () {
      var toggle = button.closest(".toggle");
      var group = toggle.closest(".timeline");
      var willOpen = !toggle.classList.contains("is-open");
      group.querySelectorAll(":scope > .toggle").forEach(function (item) {
        var head = item.querySelector(":scope > h2 .toggle-head, :scope > h3 .toggle-head");
        var panel = item.querySelector(":scope > .toggle-panel");
        var open = willOpen && item === toggle;
        item.classList.toggle("is-open", open);
        if (head) {
          head.setAttribute("aria-expanded", open ? "true" : "false");
        }
        if (panel) {
          panel.hidden = !open;
        }
      });
    });
  });

  var lightbox = document.querySelector(".lightbox");
  if (lightbox) {
    var lightboxImg = lightbox.querySelector("img");
    var closeLightbox = function () {
      lightbox.hidden = true;
      lightboxImg.removeAttribute("src");
    };
    document.querySelectorAll(".project-photo").forEach(function (link) {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        var img = link.querySelector("img");
        lightboxImg.src = link.getAttribute("href");
        lightboxImg.alt = img ? img.alt : "";
        lightbox.hidden = false;
      });
    });
    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox || event.target.closest(".lightbox-close")) {
        closeLightbox();
      }
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !lightbox.hidden) {
        closeLightbox();
      }
    });
  }
})();
