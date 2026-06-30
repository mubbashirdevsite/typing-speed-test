const paragraphs = [
    "The quick brown fox jumps over the lazy dog near the river bank.",
    "Typing speed is an essential skill for developers and writers alike.",
    "JavaScript makes web pages interactive and dynamic.",
    "Practice every day to improve your coding skills.",
    "Consistency is more important than intensity in learning.",
    "Frontend development includes HTML CSS and JavaScript.",
    "Clean code is better than clever code.",
    "Debugging is twice as hard as writing the code.",
    "Small steps lead to big improvements over time.",
    "Focus on building real projects to grow faster."
];

// DOM
const textDisplay = document.getElementById("textDisplay");
const inputBox = document.getElementById("inputBox");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

const wpmEl = document.getElementById("wpm");
const cpmEl = document.getElementById("cpm");
const accuracyEl = document.getElementById("accuracy");
const timeEl = document.getElementById("time");
const progressBar = document.getElementById("progressBar");
const resultBox = document.getElementById("result");
const timeSelect = document.getElementById("timeSelect");

let timer;
let timeLeft;
let totalTime;
let isTyping = false;

// Setup text
function loadText(){
    const random = paragraphs[Math.floor(Math.random()*paragraphs.length)];
    textDisplay.innerHTML = random.split("").map(char => `<span>${char}</span>`).join("");
}

// Start test
startBtn.addEventListener("click", () => {

    reset();
    loadText();

    totalTime = parseInt(timeSelect.value);
    timeLeft = totalTime;

    inputBox.disabled = false;
    inputBox.value = "";
    inputBox.focus();

    isTyping = true;

    timer = setInterval(updateTime, 1000);

});

// Restart
restartBtn.addEventListener("click", reset);

// Typing logic
inputBox.addEventListener("input", () => {

    const arrayText = textDisplay.querySelectorAll("span");
    const value = inputBox.value.split("");

    let correct = 0;

    arrayText.forEach((char, index) => {

        const typed = value[index];

        if(typed == null){
            char.classList.remove("correct","incorrect");
        }else if(typed === char.innerText){
            char.classList.add("correct");
            char.classList.remove("incorrect");
            correct++;
        }else{
            char.classList.add("incorrect");
            char.classList.remove("correct");
        }

    });

    updateStats(correct, value.length);

});

// Update stats
function updateStats(correct, typed){

    const cpm = typed;
    const wpm = Math.round(correct/5);
    const accuracy = typed === 0 ? 0 : Math.round((correct/typed)*100);

    cpmEl.textContent = cpm;
    wpmEl.textContent = wpm;
    accuracyEl.textContent = accuracy + "%";

}

// Timer
function updateTime(){

    if(timeLeft > 0){
        timeLeft--;
        timeEl.textContent = timeLeft;

        progressBar.style.width = (timeLeft/totalTime)*100 + "%";
    }else{
        endTest();
    }

}

// End test
function endTest(){

    clearInterval(timer);
    inputBox.disabled = true;

    const wpm = wpmEl.textContent;

    let best = localStorage.getItem("bestWPM") || 0;

    if(wpm > best){
        localStorage.setItem("bestWPM", wpm);
    }

    resultBox.innerHTML = `
        <h2>Test Completed 🎉</h2>
        <p>Best WPM: ${localStorage.getItem("bestWPM")}</p>
    `;
}

// Reset
function reset(){

    clearInterval(timer);

    inputBox.disabled = true;
    inputBox.value = "";

    wpmEl.textContent = 0;
    cpmEl.textContent = 0;
    accuracyEl.textContent = "0%";
    timeEl.textContent = timeSelect.value;
    progressBar.style.width = "100%";

    resultBox.innerHTML = "";

    loadText();
}

// Init
loadText();