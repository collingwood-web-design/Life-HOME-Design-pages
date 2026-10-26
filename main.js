(function () {
  var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
  var thumbs = Array.prototype.slice.call(document.querySelectorAll(".hero-thumb"));
  var playButton = document.querySelector(".hero-play");
  var playIcon = playButton ? playButton.querySelector(".icon-play") : null;
  var pauseIcon = playButton ? playButton.querySelector(".icon-pause") : null;
  var index = 0;
  var timer = null;
  var fadeTimer = null;
  var slideDelay = 4000;

  function show(next) {
    var previous = index;
    index = (next + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      var active = i === index;
      slide.classList.toggle("is-active", active);
      slide.classList.toggle("is-fading", i === previous && !active);
      slide.setAttribute("aria-hidden", active ? "false" : "true");
    });
    window.clearTimeout(fadeTimer);
    fadeTimer = window.setTimeout(function () {
      slides.forEach(function (slide) {
        slide.classList.remove("is-fading");
      });
    }, 900);
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
    }, slideDelay);
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
  if (newsletter && newsletterSuccess) {
    var newsletterNote = newsletter.querySelector(".newsletter-note");
    newsletter.addEventListener("submit", function (event) {
      event.preventDefault();
      var email = newsletter.querySelector("[name='EMAIL']");
      if (email) {
        email.value = email.value.trim().toLowerCase();
      }
      if (!newsletter.reportValidity()) {
        return;
      }
      var button = newsletter.querySelector("[type='submit']");
      if (button) {
        button.disabled = true;
      }
      if (newsletterNote) {
        newsletterNote.hidden = true;
        newsletterNote.textContent = "";
      }
      var callbackName = "lhdMailchimp" + Date.now();
      var script = document.createElement("script");
      window[callbackName] = function (data) {
        delete window[callbackName];
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
        if (button) {
          button.disabled = false;
        }
        var message = String((data && data.msg) || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
        if (data && data.result === "success") {
          newsletter.hidden = true;
          newsletterSuccess.hidden = false;
        } else if (newsletterNote) {
          newsletterNote.textContent = message || "Please try again.";
          newsletterNote.hidden = false;
        }
      };
      script.onerror = function () {
        delete window[callbackName];
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
        if (button) {
          button.disabled = false;
        }
        if (newsletterNote) {
          newsletterNote.textContent = "Please try again.";
          newsletterNote.hidden = false;
        }
      };
      var params = new URLSearchParams(new FormData(newsletter));
      params.set("c", callbackName);
      var action = newsletter.getAttribute("action").replace("/subscribe/post", "/subscribe/post-json");
      script.src = action + "&" + params.toString();
      document.body.appendChild(script);
    });
  }

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
    var photos = Array.prototype.slice.call(document.querySelectorAll(".project-photo"));
    var lightboxImg = lightbox.querySelector("img");
    var lightboxCount = lightbox.querySelector(".lightbox-count");
    var prevButton = lightbox.querySelector(".lightbox-prev");
    var nextButton = lightbox.querySelector(".lightbox-next");
    var index = 0;

    var showPhoto = function (next) {
      if (!photos.length) {
        return;
      }
      index = (next + photos.length) % photos.length;
      var link = photos[index];
      var img = link.querySelector("img");
      lightboxImg.src = link.getAttribute("href");
      lightboxImg.alt = img ? img.alt : "";
      if (lightboxCount) {
        lightboxCount.textContent = (index + 1) + " of " + photos.length;
      }
      lightbox.hidden = false;
    };

    var closeLightbox = function () {
      lightbox.hidden = true;
      lightboxImg.removeAttribute("src");
    };

    if (photos.length < 2) {
      if (prevButton) {
        prevButton.hidden = true;
      }
      if (nextButton) {
        nextButton.hidden = true;
      }
      if (lightboxCount) {
        lightboxCount.hidden = true;
      }
    }

    photos.forEach(function (link, i) {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        showPhoto(i);
      });
    });

    if (prevButton) {
      prevButton.addEventListener("click", function () {
        showPhoto(index - 1);
      });
    }
    if (nextButton) {
      nextButton.addEventListener("click", function () {
        showPhoto(index + 1);
      });
    }

    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox || event.target.closest(".lightbox-close")) {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (lightbox.hidden) {
        return;
      }
      if (event.key === "Escape") {
        closeLightbox();
      } else if (event.key === "ArrowLeft" && photos.length > 1) {
        event.preventDefault();
        showPhoto(index - 1);
      } else if (event.key === "ArrowRight" && photos.length > 1) {
        event.preventDefault();
        showPhoto(index + 1);
      }
    });
  }
})();
