//////////////////////////1.clock and calendar
const time = document.querySelector(".time");
function showTime() {
  time.textContent = new Date().toLocaleTimeString();
}
setInterval(showTime, 1000);

const date = document.querySelector(".date");
const options = {
  weekday: "long",
  month: "long",
  day: "numeric",
};
function showDate() {
  date.textContent = new Date().toLocaleDateString("ru-RU", options);
}
setInterval(showDate, 1000);

//////////////2.greeting
const greeting = document.querySelector(".greeting");
function getTimeOfDay() {
  let hours = new Date().getHours();
  let timeOfDate;
  if (hours > 5 && hours < 12) {
    timeOfDate = "Доброе утро";
  } else if (hours > 11 && hours < 18) {
    timeOfDate = "Добрый день";
  } else if (hours > 17 && hours < 24) {
    timeOfDate = "Добрый вечер";
  } else {
    timeOfDate = "Доброй ночи";
  }
  greeting.textContent = `${timeOfDate},`;
}
setInterval(getTimeOfDay, 1000);

let input = document.querySelector(".name");
input.oninput = function () {
  localStorage.setItem("inputName", input.value);
};
window.onload = function () {
  input.value = localStorage.getItem("inputName");
  inputCity.value = localStorage.getItem("inputCity");
  getWeather();
};

/////////////3.image slider
let getRandom = function () {
  let numb = Math.ceil(Math.random() * 20);
  //return numb.toString().length < 2 ? "0" + numb : numb;
  return numb.toString().padStart(2, "0");
};
let getR = getRandom();

let getTimeOfDay3 = function () {
  let hours = new Date().getHours();
  let timeOfDate;
  if (hours > 5 && hours < 12) {
    timeOfDate = "morning";
  } else if (hours > 11 && hours < 18) {
    timeOfDate = "afternoon";
  } else if (hours > 17 && hours < 24) {
    timeOfDate = "evening";
  } else {
    timeOfDate = "night";
  }
  return timeOfDate;
};
setInterval(getTimeOfDay3, 1000);

function setBg() {
  const img = new Image();
  img.src = `https://raw.githubusercontent.com/VolhaBehunovich/stage1-tasks/assets/images/${getTimeOfDay3()}/${getR}.jpg`;
  img.onload = () => {
    document.body.style.backgroundImage = `url('https://raw.githubusercontent.com/VolhaBehunovich/stage1-tasks/assets/images/${getTimeOfDay3()}/${getR}.jpg')`;
  };
}
setBg();

let buttNext = document.querySelector(".slide-next");
let buttPrev = document.querySelector(".slide-prev");

function getSlideNext() {
  if (getR == "20") {
    getR = "01";
    setBg();
  } else {
    getR = (+getR + 1).toString().padStart(2, "0");
    setBg();
  }
}
function getSlidePrev() {
  if (getR == "01") {
    getR = "20";
    setBg();
  } else {
    getR = (+getR - 1).toString().padStart(2, "0");
    setBg();
  }
}
buttNext.addEventListener("click", getSlideNext);
buttPrev.addEventListener("click", getSlidePrev);

///////////////////////4.weather widget
const weatherIcon = document.querySelector(".weather-icon");
const temperature = document.querySelector(".temperature");
const weatherDescription = document.querySelector(".weather-description");
const wind = document.querySelector(".wind-speed");
const humidity = document.querySelector(".air-humidity");

let inputCity = document.querySelector(".city");

async function getWeather() {
  if (inputCity.value === "") {
    inputCity.value = "Минск";
  }
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputCity.value}&lang=ru&appid=b5b7dbc06c5b3f4538b61ed09cd90b1b&units=metric`;
  const res = await fetch(url);
  const data = await res.json();

  weatherIcon.className = "weather-icon owf";
  weatherIcon.classList.add(`owf-${data.weather[0].id}`);
  temperature.textContent = `${Math.round(data.main.temp)}°C`;
  weatherDescription.textContent = data.weather[0].description;
  wind.textContent = `Скорость ветра: ${Math.round(data.wind.speed)} м/с`;
  humidity.textContent = `Влажность ${Math.round(data.main.humidity)}%`;
}
getWeather();

inputCity.addEventListener("change", getWeather);

inputCity.oninput = function () {
  localStorage.setItem("inputCity", inputCity.value);
};
// вставлен в 2.greeting
// window.onload = function () {
//   inputCity.value = localStorage.getItem("inputCity");
//   getWeather();
// };

//////////////////5.day quote
let quote = document.querySelector(".quote");
let author = document.querySelector(".author");
let changeQuote = document.querySelector(".change-quote");

function getQuote() {
  let request = new XMLHttpRequest();

  request.open("GET", "./js/quotes_by.json", true);
  request.send();

  request.onload = function () {
    let jsObj = JSON.parse(request.response);
    let randomNum = Math.floor(Math.random() * jsObj.quotes.length);
    if (request.status === 200) {
      quote.textContent = `"${jsObj.quotes[randomNum].text}"`;
      author.textContent = `${jsObj.quotes[randomNum].author}`;
    }
  };
}
getQuote();
changeQuote.addEventListener("click", getQuote);

////////////////////////6.audio
import playList from "./playList.js";
console.log(playList);

let buttPlay = document.querySelector(".play");
let buttPlayPrev = document.querySelector(".play-prev");
let buttPlayNext = document.querySelector(".play-next");
let isPlay = false;
let playNum = 0;
let ul = document.querySelector(".play-list");

for (let i = 0; i < playList.length; i++) {
  let li = document.createElement("li");
  li.classList.add("play-item");
  li.textContent = playList[i].title;
  ul.append(li);
}

let allLi = document.querySelectorAll("li");

const audio = new Audio();

function playAudio() {
  if (isPlay == false) {
    audio.src = playList[playNum].src;
    audio.currentTime = 0;
    audio.play();
    isPlay = true;
    buttPlay.classList.add("pause");
    allLi.forEach(function (li) {
      li.classList.remove("item-active");
    });
    allLi[playNum].classList.add("item-active");
  } else {
    audio.pause();
    isPlay = false;
    buttPlay.classList.remove("pause");
  }
}
buttPlay.addEventListener("click", playAudio);

function playPrev() {
  if (playNum == 0) {
    playNum = 3;
  } else {
    playNum -= 1;
  }
  isPlay = false;
  playAudio();
  buttPlay.classList.add("pause");
}
function playNext() {
  if (playNum == 3) {
    playNum = 0;
  } else {
    playNum = playNum + 1;
  }
  isPlay = false;
  playAudio();
  buttPlay.classList.add("pause");
}
buttPlayPrev.addEventListener("click", playPrev);
buttPlayNext.addEventListener("click", playNext);

audio.addEventListener("ended", playNext);
