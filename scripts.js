// === Глобальные переменные ===
const screenHistory = [];
let phoneDigits = ""; // Хранит цифры номера телефона
let codeInputHandler = null;

// === Утилиты ===
function showScreen(screenId, rememberHistory = true) {
  const currentScreen = document.querySelector(".screen.active");
  if (currentScreen && rememberHistory) screenHistory.push(currentScreen.id);
  document
    .querySelectorAll(".screen")
    .forEach((el) => el.classList.remove("active"));
  const nextScreen = document.getElementById(screenId);
  if (nextScreen) {
    nextScreen.classList.add("active");
    if (
      ["enter-code", "screen-check-enter-code", "open-return-box"].includes(
        screenId
      )
    ) {
      codeInputHandler?.clearCode();
    }
  }
}

function handleBackButton() {
  if (screenHistory.length > 0) {
    showScreen(screenHistory.pop(), false);
  } else {
    showScreen("screen-welcome");
  }
}

// === Инициализация ввода телефона ===
function initPhoneInput() {
  const phoneInput = document.getElementById("phone-input");
  const clearIcon = document.getElementById("clear-icon");
  const keypadKeys = document.querySelectorAll(".key:not(.empty)");

  function updatePhoneInput() {
    const format = "+7 (___) ___-__-__";
    let masked = "";
    let digitIndex = 0;
    for (let char of format) {
      masked += char === "_" ? phoneDigits[digitIndex++] || "_" : char;
    }
    phoneInput.value = masked;
    clearIcon.style.display = phoneDigits.length > 0 ? "block" : "none";
  }

  keypadKeys.forEach((key) => {
    key.addEventListener("click", () => {
      if (phoneDigits.length < 10) {
        phoneDigits += key.textContent.trim();
        updatePhoneInput();
      }
    });
  });

  clearIcon.addEventListener("click", (e) => {
    e.stopPropagation();
    if (phoneDigits.length > 0) {
      phoneDigits = phoneDigits.slice(0, -1);
      updatePhoneInput();
    }
    phoneInput.focus();
  });
}

// === Инициализация ввода кода ===
function initCodeInput() {
  let digits = [];

  function updateInput() {
    const input = document.querySelector(
      ".screen.active input.code-input, .screen.active input.code-input-check"
    );
    const clearIcon = input?.parentElement.querySelector(
      ".clear-icon-code, .clear-icon-code-check"
    );

    if (input) {
      input.value = digits.join("");
    }

    if (clearIcon) {
      clearIcon.style.display = digits.length > 0 ? "inline" : "none";
    }
  }

  document.querySelectorAll(".keypad").forEach((keypad) => {
    keypad.addEventListener("click", (e) => {
      if (
        e.target.classList.contains("key") &&
        !e.target.classList.contains("empty")
      ) {
        if (digits.length < 4) {
          digits.push(e.target.textContent.trim());
          updateInput();
        }
      }
    });
  });

  document
    .querySelectorAll(".clear-icon-code, .clear-icon-code-check")
    .forEach((clearIcon) => {
      clearIcon.addEventListener("click", (e) => {
        e.stopPropagation();
        if (digits.length > 0) {
          digits.pop();
          updateInput();
        }

        const input = clearIcon.parentElement.querySelector("input");
        if (input) input.focus();
      });
    });

  return {
    getCode: () => digits.join(""),
    clearCode: () => {
      digits = [];
      updateInput();
    },
  };
}

// === Инициализация событий ===
function initEventHandlers() {
  document
    .querySelectorAll(".back-btn")
    .forEach((btn) => btn.addEventListener("click", handleBackButton));

  document
    .querySelector(".correct-btn")
    ?.addEventListener("click", () => showScreen("screen-package"));

  document
    .querySelectorAll(".problem-button, .problem-button-ins")
    .forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        showScreen("screen-problems");
      });
    });

  document
    .querySelector("#screen-phone .next-btn")
    ?.addEventListener("click", () => {
      if (phoneDigits.length === 10) {
        document.getElementById("displayed-phone").textContent =
          document.getElementById("phone-input").value;
        showScreen("screen-checkphone");
      } else {
        alert("Пожалуйста, введите полный номер телефона");
      }
    });

  document
    .querySelector("#enter-code .next-btn")
    ?.addEventListener("click", () => {
      if (codeInputHandler.getCode().length === 4) {
        showScreen("opening-now");
      } else {
        alert("Пожалуйста, введите полный 4-значный код");
      }
    });

  document
    .querySelector("#screen-check-enter-code .next-btn")
    ?.addEventListener("click", () => {
      if (codeInputHandler.getCode().length === 4) {
        showScreen("instr-screen");
      } else {
        alert("Пожалуйста, введите полный 4-значный код");
      }
    });

  document
    .querySelector("#instr-screen .next-btn")
    ?.addEventListener("click", () => showScreen("ins2-screen"));
  document
    .querySelector("#instr2-screen .next-btn")
    ?.addEventListener("click", () => showScreen("instr2-screen-end"));
  document
    .querySelector("#open-return-box .next-btn")
    ?.addEventListener("click", () => {
      if (codeInputHandler.getCode().length === 4) {
        showScreen("instr2-screen");
      } else {
        alert("Пожалуйста, введите полный 4-значный код");
      }
    });
  document
    .querySelector("#ins2-screen .next-btn")
    ?.addEventListener("click", () => showScreen("end-screen"));
  document
    .querySelector("#instr2-screen-end .next-btn")
    ?.addEventListener("click", () => showScreen("end-screen"));

  document
    .querySelector(".mistake-btn")
    ?.addEventListener("click", () => showScreen("screen-phone"));
  document
    .querySelector(".problem-button-1")
    ?.addEventListener("click", () => showScreen("screen1-problems"));
  document
    .querySelector(".problem-button-2")
    ?.addEventListener("click", () => showScreen("screen2-problems"));
  document
    .querySelector(".problem-button-3")
    ?.addEventListener("click", () => showScreen("screen2-problems"));
  document
    .querySelector(".icon-pp")
    ?.addEventListener("click", () => showScreen("screen-check"));
}

// === Запуск ===
document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelectorAll(".screen")
    .forEach((el) => el.classList.remove("active"));
  document.getElementById("screen-welcome").classList.add("active");
  codeInputHandler = initCodeInput();
  initPhoneInput();
  initEventHandlers();
});
