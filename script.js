// Hide the loading screen after the page is ready
const loader = document.querySelector(".loader");

window.addEventListener("load", () => {
  setTimeout(() => {
    loader.classList.add("hidden");
  }, 450);
});

// Mobile navigation toggle
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// Smooth cinematic section reveal and active navbar highlight
const sections = document.querySelectorAll(".page-section");
const navItems = document.querySelectorAll(".nav-links a");
let statsStarted = false;

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("is-visible");

      navItems.forEach((item) => {
        item.classList.toggle("active", item.getAttribute("href") === `#${entry.target.id}`);
      });

      if (entry.target.id === "about" && !statsStarted) {
        statsStarted = true;
        animateStats();
      }
    });
  },
  {
    threshold: 0.38,
  }
);

sections.forEach((section) => {
  sectionObserver.observe(section);
});

// Autoplay sample previews only when the user hovers or focuses the card
document.querySelectorAll(".sample-card").forEach((card) => {
  const previewVideo = card.querySelector("video");

  card.addEventListener("mouseenter", () => {
    previewVideo.play().catch(() => {
      // Add the local MP4 file to the videos folder to enable preview.
    });
  });

  card.addEventListener("mouseleave", () => {
    previewVideo.pause();
    previewVideo.currentTime = 0;
  });

  card.addEventListener("focusin", () => {
    previewVideo.play().catch(() => {});
  });

  card.addEventListener("focusout", () => {
    previewVideo.pause();
    previewVideo.currentTime = 0;
  });
});

// Video modal for sample play buttons
const modal = document.querySelector(".video-modal");
const modalTitle = document.querySelector("#modal-title");
const modalVideo = modal.querySelector("video");
const modalSource = modalVideo.querySelector("source");
const closeModal = document.querySelector(".modal-close");

document.querySelectorAll(".play-btn").forEach((button) => {
  button.addEventListener("click", () => {
    modalTitle.textContent = button.dataset.title;
    modalSource.src = button.dataset.video;
    modalVideo.load();
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    modalVideo.play().catch(() => {
      // The modal still opens even before the real local video is added.
    });
  });
});

function hideModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  modalVideo.pause();
}

closeModal.addEventListener("click", hideModal);

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    hideModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("open")) {
    hideModal();
  }
});

// Animated stats in the About section
function animateStats() {
  document.querySelectorAll("[data-count]").forEach((stat) => {
    const target = Number(stat.dataset.count);
    const duration = 1100;
    const startTime = performance.now();

    function update(currentTime) {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const currentValue = Math.floor(progress * target);
      stat.textContent = `${currentValue}+`;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        stat.textContent = `${target}+`;
      }
    }

    requestAnimationFrame(update);
  });
}

// FAQ accordion
document.querySelectorAll(".faq-question").forEach((button) => {
  button.addEventListener("click", () => {
    const faqItem = button.parentElement;
    const answer = faqItem.querySelector(".faq-answer");
    const isOpen = faqItem.classList.contains("open");

    document.querySelectorAll(".faq-item").forEach((item) => {
      item.classList.remove("open");
      item.querySelector(".faq-answer").style.maxHeight = null;
    });

    if (!isOpen) {
      faqItem.classList.add("open");
      answer.style.maxHeight = `${answer.scrollHeight}px`;
    }
  });
});

// Static booking form message for GitHub Pages and Netlify
const bookingForm = document.querySelector(".booking-form");
const bookingNote = document.querySelector(".booking-note");

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  bookingNote.textContent = "Booking request ready. Connect this form to Netlify Forms or Formspree later.";
  bookingForm.reset();
});

// Static contact form message for GitHub Pages and Netlify
const contactForm = document.querySelector(".contact-form");
const formNote = document.querySelector(".form-note");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formNote.textContent = "Message ready. Connect this form to Netlify Forms or Formspree later.";
  contactForm.reset();
});
