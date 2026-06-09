document.addEventListener("DOMContentLoaded", () => {
  "use strict";


  

  /**
   * Preloader
   */
  const preloader = document.querySelector("#preloader");
  if (preloader) {
    window.addEventListener("load", () => {
      setTimeout(() => {
        preloader.classList.add("loaded");
      }, 1000);
      setTimeout(() => {
        preloader.remove();
      }, 2000);
    });
  }

  /**
   * Notification Bar
   */
  const notificationBar = document.querySelector(".notification-bar");

  if (notificationBar) {
    // Clone the inner children
    const clonedChildren = Array.from(notificationBar.children).map(child => child.cloneNode(true));
    // Append the cloned children back
    clonedChildren.forEach(clone => notificationBar.appendChild(clone));
  }

  /**
   * Mobile nav toggle
   */
  const mobileNavShow = document.querySelector(".mobile-nav-show");
  const mobileNavHide = document.querySelector(".mobile-nav-hide");

  document.querySelectorAll(".mobile-nav-toggle").forEach((el) => {
    el.addEventListener("click", function (event) {
      event.preventDefault();
      mobileNavToogle();
    });
  });

  function mobileNavToogle() {
    document.querySelector("body").classList.toggle("mobile-nav-active");
    mobileNavShow.classList.toggle("d-none");
    mobileNavHide.classList.toggle("d-none");
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll("#navbar a").forEach((navbarlink) => {
    if (!navbarlink.hash) return;

    let section = document.querySelector(navbarlink.hash);
    if (!section) return;

    navbarlink.addEventListener("click", () => {
      if (document.querySelector(".mobile-nav-active")) {
        mobileNavToogle();
      }
    });
  });

  /**
   * Toggle mobile nav dropdowns
   */
  const navDropdowns = document.querySelectorAll(".navbar .dropdown > a");

  navDropdowns.forEach((el) => {
    el.addEventListener("click", function (event) {
      if (document.querySelector(".mobile-nav-active")) {
        event.preventDefault();
        this.classList.toggle("active");
        this.nextElementSibling.classList.toggle("dropdown-active");

        let dropDownIndicator = this.querySelector(".dropdown-indicator");
        dropDownIndicator.classList.toggle("bi-chevron-up");
        dropDownIndicator.classList.toggle("bi-chevron-down");
      }
    });
  });

  /**
   * Scroll top button
   */
  const scrollTop = document.querySelector(".scroll-top");
  if (scrollTop) {
    const togglescrollTop = function () {
      window.scrollY > 100
        ? scrollTop.classList.add("active")
        : scrollTop.classList.remove("active");
    };
    window.addEventListener("load", togglescrollTop);
    document.addEventListener("scroll", togglescrollTop);
    scrollTop.addEventListener(
      "click",
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    );
  }

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: ".glightbox",
  });

  /**
   * Init swiper slider with 1 slide at once in desktop view
   */
  new Swiper(".slides-1", {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    slidesPerView: "auto",
    pagination: {
      el: ".swiper-pagination",
      type: "bullets",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

  /**
   * Init swiper slider with 3 slides at once in desktop view
   */
  new Swiper(".slides-3", {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    slidesPerView: "auto",
    pagination: {
      el: ".swiper-pagination",
      type: "bullets",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 40,
      },

      1200: {
        slidesPerView: 3,
      },
    },
  });

  /**
   * Animation on scroll function and init
   */
  function aos_init() {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }
  window.addEventListener("load", () => {
    aos_init();
  });
});

document
  .getElementById("subscribeForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;

    try {
      const response = await fetch("https://gtx.pythonanywhere.com/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        alert("✅ Thank you! You’ve been subscribed.");
        document.getElementById("subscribeForm").reset();
      } else {
        alert("⚠️ Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Network error. Please check your connection.");
    }
  });

/**
 * Gen button
 */
const gen = document.querySelector(".gen");
const genClose = document.querySelector(".gen-close");
const chatWrapper = document.querySelector(".chatbot-wrapper");

function cleanChatBox() {
  document.querySelector(".chatbot-box").innerHTML = `
    <div class="item">
        <div class="msg">
          <p>Hi, I’m Gnosis. How can I assist you today?</p>
        </div>
      </div>
      <br clear="both" />
  `;
}

function openChatWrapper() {
  gen.classList.add("deactive");
  chatWrapper.classList.add("active");
}

function closeChatWrapper() {
  chatWrapper.classList.remove("active");
  gen.classList.remove("deactive");
  cleanChatBox();
}

gen.addEventListener("click", openChatWrapper);
genClose.addEventListener("click", closeChatWrapper);

const input = document.querySelector(".typing-area .input-field input");
const sendBtn = document.getElementById("sendBtn");
const chatBox = document.querySelector(".chatbot-box");

function getTemplate(who, text) {
  let txt = "";

  if (who == "user") {
    txt = `
    <div class="item right">
        <div class="msg">
          <p>${text}</p>
        </div>
      </div>
      <br clear="both">
  `;
  } else {
    txt = `
    <div class="item">
        <div class="msg">
          <p>${text}</p>
        </div>
      </div>
      <br clear="both">
  `;
  }
  return txt;
}

function addChatBubble(who, text) {
  const template = getTemplate(who, text);
  chatBox.insertAdjacentHTML("beforeend", template);
  answering();
}

sendBtn.addEventListener("click", () => {
  addChatBubble("user", input.value); // logs the text typed
  input.value = ""; // clear input after sending
});

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addChatBubble("user", input.value);
    input.value = "";
  }
});

function answering(question) {
  waiting();
  getAnswer(question);
}

function waiting() {
  const waiting = `
    <div class="item answering">
        <div class="msg">
          <p>Genarating<span> ...</span></p>
        </div>
      </div>
  `;

  chatBox.insertAdjacentHTML("beforeend", waiting);
}

async function getAnswer(question) {
  try {
    const response = await fetch("https://gtx.pythonanywhere.com/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    });

    if (response.ok) {
      console.log(response);
    } else {
      console.log(response);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("❌ Network error. Please check your connection.");
  }
}
