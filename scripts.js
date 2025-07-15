// Глобальные переменные
const screenHistory = [];
let digits = ""; // Хранит только цифры номера (без маски)
let codeInputHandler = null;
// Основная функция переключения экранов
function showScreen(screenId, rememberHistory = true) {
  const currentScreen = document.querySelector(".screen.active");

  if (currentScreen && rememberHistory) {
    screenHistory.push(currentScreen.id);
  }

  document.querySelectorAll(".screen").forEach((el) => {
    el.classList.remove("active");
  });

  const nextScreen = document.getElementById(screenId);
  if (nextScreen) {
    nextScreen.classList.add("active");
  }
  if (screenId === "enter-code" && codeInputHandler) {
    codeInputHandler.clearCode(); // Добавьте этот метод в initCodeInput()
  }

  if (screenId === "screen-check-enter-code" && codeInputHandler) {
    codeInputHandler.clearCode(); // Добавьте этот метод в initCodeInput()
  }

  if (screenId === "open-return-box" && codeInputHandler) {
    codeInputHandler.clearCode(); // Добавьте этот метод в initCodeInput()
  }
}

// Инициализация ввода телефона
function initPhoneInput() {
  const phoneInput = document.getElementById("phone-input");
  const clearIcon = document.getElementById("clear-icon");
  const keypadKeys = document.querySelectorAll(".key:not(.empty)");

  // Обновление поля с маской
  function updatePhoneInput() {
    const format = "+7 (___) ___-__-__";
    let masked = "";
    let digitIndex = 0;

    for (let char of format) {
      if (char === "_") {
        masked += digits[digitIndex] || "_";
        digitIndex++;
      } else {
        masked += char;
      }
    }
    phoneInput.value = masked;
    clearIcon.style.display = digits.length > 0 ? "block" : "none";
  }

  // Обработка цифровых клавиш
  keypadKeys.forEach((key) => {
    key.addEventListener("click", () => {
      if (digits.length < 10) {
        digits += key.textContent;
        updatePhoneInput();
      }
    });
  });

  // Очистка одной цифры (крестик)
  clearIcon.addEventListener("click", (e) => {
    e.stopPropagation();
    if (digits.length > 0) {
      digits = digits.slice(0, -1);
      updatePhoneInput();
    }
    phoneInput.focus();
  });
}

// Инициализация обработчиков
function initEventHandlers() {
  // Универсальная кнопка "Назад"
  document.querySelectorAll(".back-btn").forEach((btn) => {
    btn.addEventListener("click", handleBackButton);
  });

  // Обработчик для кнопки "Верно"
  document
    .querySelector(".correct-btn")
    ?.addEventListener("click", function () {
      showScreen("screen-package");
    });

  // Обработчик для кнопки "У меня проблема" (ВЫНЕСЕН ОТДЕЛЬНО)
  document.querySelectorAll(".problem-button").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      showScreen("screen-problems");
    });
  });

  document.querySelectorAll(".problem-button-ins").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      showScreen("screen-problems");
    });
  });

  // Обработчик для кнопки "Далее" на экране ввода телефона
  document
    .querySelector("#screen-phone .next-btn")
    ?.addEventListener("click", () => {
      if (digits.length === 10) {
        document.getElementById("displayed-phone").textContent =
          document.getElementById("phone-input").value;
        showScreen("screen-checkphone");
      } else {
        alert("Пожалуйста, введите полный номер телефона");
      }
    });

  // Новый обработчик для кнопки "Далее" на экране ввода кода
  document
    .querySelector("#enter-code .next-btn")
    ?.addEventListener("click", () => {
      if (codeInputHandler.getCode().length === 4) {
        showScreen("opening-now");
      } else {
        alert("Пожалуйста, введите полный 4-значный код");
      }
    });
  //обработчик далее на П:мастер код для непроверненых посылок
  document
    .querySelector("#screen-check-enter-code .next-btn")
    ?.addEventListener("click", () => {
      if (codeInputHandler.getCode().length === 4) {
        showScreen("instr-screen");
      } else {
        alert("Пожалуйста, введите полный 4-значный код");
      }
    });

  //обработчик далее на П:мастер код для возврата
  document
    .querySelector("#instr-screen .next-btn")
    ?.addEventListener("click", () => {
      showScreen("ins2-screen");
    });

  document
    .querySelector("#instr2-screen .next-btn")
    ?.addEventListener("click", () => {
      showScreen("instr2-screen-end");
    });

  document
    .querySelector("#open-return-box .next-btn")
    ?.addEventListener("click", () => {
      if (codeInputHandler.getCode().length === 4) {
        showScreen("instr2-screen");
      } else {
        alert("Пожалуйста, введите полный 4-значный код");
      }
    });

  // Кнопка "Ошибка в номере"
  document.querySelector(".mistake-btn")?.addEventListener("click", () => {
    showScreen("screen-phone");
  });

  //ячейка грязная
  document.querySelector(".problem-button-1")?.addEventListener("click", () => {
    showScreen("screen1-problems");
  });
  //ячейка сломана, другое
  document.querySelector(".problem-button-2")?.addEventListener("click", () => {
    showScreen("screen2-problems");
  });
  //ячейка сломана, другое
  document.querySelector(".problem-button-3")?.addEventListener("click", () => {
    showScreen("screen2-problems");
  });
  // Обработчик для клика на иконку персонала
  document.querySelector(".icon-pp")?.addEventListener("click", function () {
    showScreen("screen-check");
  });
}

function handleBackButton() {
  if (screenHistory.length > 0) {
    showScreen(screenHistory.pop(), false);
  } else {
    showScreen("screen-welcome");
  }
}

function initCodeInput() {
  const CodeInput = document.getElementById("code-input");
  const clearIcon = document.getElementById("clear-icon-code");
  const keypadKeys = document.querySelectorAll(".key:not(.empty)");

  // Используем отдельную переменную для кода
  let codeDigits = "";

  function updateCodeInput() {
    const format = "_ _ _ _";
    let masked = "";
    let digitIndex = 0;

    for (let char of format) {
      if (char === "_") {
        masked += codeDigits[digitIndex] || "_";
        digitIndex++;
      } else {
        masked += char;
      }
    }
    CodeInput.value = masked;
    clearIcon.style.display = codeDigits.length > 0 ? "block" : "none";
  }

  keypadKeys.forEach((key) => {
    key.addEventListener("click", () => {
      if (codeDigits.length < 4) {
        codeDigits += key.textContent;
        updateCodeInput();
      }
    });
  });

  clearIcon.addEventListener("click", (e) => {
    e.stopPropagation();
    if (codeDigits.length > 0) {
      codeDigits = codeDigits.slice(0, -1);
      updateCodeInput();
    }
    CodeInput.focus();
  });

  // Возвращаем функцию для проверки кода

  return {
    getCode: () => codeDigits,
    clearCode: () => {
      codeDigits = "";
      updateCodeInput();
    },
  };
}

// Запуск при загрузке
document.addEventListener("DOMContentLoaded", () => {
  // Сначала скрываем все экраны
  document.querySelectorAll(".screen").forEach((el) => {
    el.classList.remove("active");
  });

  // Показываем только welcome-экран
  document.getElementById("screen-welcome").classList.add("active");
  const codeInput = initCodeInput();
  codeInputHandler = codeInput;

  // Инициализируем остальное
  initPhoneInput();
  initEventHandlers();
  initCodeInput();
});
