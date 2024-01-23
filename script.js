let name = document.getElementById("name");
let second = document.getElementById("second");
let start_btn = document.getElementById("start_btn");
let time = document.getElementById("time");
let true_answer = document.getElementById("true_answer");
let false_answer = document.getElementById("false_answer");
let question_btn = document.getElementById("question_btn");
let answer_input = document.getElementById("answer_input");
let NameEditBtn = document.querySelector(".NameEditBtn");
let returnBtn = document.getElementById("returnBtn");

let Sitetime;
let AnswerTrue = 0;
let AnswerFalse = 0;

if (localStorage.getItem("KopaytirishName")) {
  name.value = localStorage.getItem("KopaytirishName");
  name.setAttribute("disabled", "disabled");
  NameEditBtn.classList.remove("d-none");
} else {
  NameEditBtn.classList.add("d-none");
  name.removeAttribute("disabled", "disabled");
}

// NameEditBtn

NameEditBtn.addEventListener("click", () => {
  name.removeAttribute("disabled", "disabled");
  name.value = "";
  name.focus();
});

start_btn.addEventListener("click", () => {
  if (name.value == "" || second.value == "") {
    alert("Formani to'liq to'ldiring");
    location.reload();
  } else {
    let userName = name.value;
    let userSecond = second.value;
    time.innerHTML = userSecond;
    localStorage.setItem("KopaytirishName", userName);
    localStorage.setItem("KopaytirishSecond", userSecond);
    Sitetime = localStorage.getItem("KopaytirishSecond");
    answer_input.removeAttribute("disabled");
    answer_input.value = "";
    answer_input.focus();
    document.querySelector(".sitebtn").setAttribute("disabled", "disabled");
    kopaytirish();
    sendtelegram(`${userName} ${userSecond} sekund vaqtni tanladi`);
  }
});

function kopaytirish() {
  let num1 = Math.floor(1 + Math.random() * 10);
  let num2 = Math.floor(1 + Math.random() * 10);
  localStorage.setItem("KopaytirishNum1", num1);
  localStorage.setItem("KopaytirishNum2", num2);
  question_btn.innerHTML = `${num1} * ${num2} = ?`;
  // answer_input.value = num1 * num2;
}
answer_input.addEventListener("keypress", mykeypress);
function mykeypress(event) {
  if (event.key === "Enter") {
    let localNum1 = localStorage.getItem("KopaytirishNum1");
    let localNum2 = localStorage.getItem("KopaytirishNum2");
    if (localNum1 * localNum2 == answer_input.value) {
      AnswerTrue++;
      true_answer.innerHTML = AnswerTrue;
      if (AnswerTrue == 1) {
        let localTime = localStorage.getItem("KopaytirishSecond");
        setInterval(timeFunction, 1000);
        setTimeout(StopMykeypress, 1000 * localTime);
      }
      playOn();
    } else {
      AnswerFalse++;
      false_answer.innerHTML = AnswerFalse;
      playOff();
    }
    kopaytirish();
    answer_input.value = "";
  }
}
// time
function timeFunction() {
  if (Sitetime > 0) {
    --Sitetime;
  }
  time.innerHTML = Sitetime;
}
// sendtelegram
function sendtelegram(message) {
  let telegram_bot_id = "6474959756:AAHc65MtbkyFroDsoOLzRIlfUKEaMAgMaL0";
  let chat_id = 5172116507; //chatID
  let settings = {
    async: true,
    crossDomain: true,
    url: "https://api.telegram.org/bot" + telegram_bot_id + "/sendMessage",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "cache-control": "no-cache",
    },
    data: JSON.stringify({ chat_id: chat_id, text: message }),
  };
  $.ajax(settings).done(function (response){});
}

// Play audio
let playOn = () => new Audio("audio/on.mp3").play();
let playOff = () => new Audio("audio/off.mp3").play();

// StopMykeypress

function StopMykeypress() {
  answer_input.removeEventListener("keypress", mykeypress);
  answer_input.setAttribute("disabled", "disabled");
  answer_input.placeholder = "Vaqt tugadi";
  userName = localStorage.getItem("KopaytirishName");
  userSecond = localStorage.getItem("KopaytirishSecond");
  sendtelegram(
    `${userName} ${userSecond} sekund vaqt davomida, ${AnswerTrue} ta to'g'ri va ${AnswerFalse} ta xato bajardi`
  );
  document.querySelector(
    ".info"
  ).innerHTML = `${userName} ${userSecond} sekund vaqt davomida, ${AnswerTrue} ta to'g'ri va ${AnswerFalse} ta xato bajardi`;
  returnBtn.classList.remove("d-none");
}

// returnBtn

returnBtn.addEventListener("click", () => {
  location.reload();
});
