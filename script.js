const CORRECT_TEXT = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const textEl = document.getElementById("text");

textEl.innerHTML = CORRECT_TEXT.split("")
    .map((letter) => `<span>${letter}</span>`)
    .join("");

const letterEls = textEl.querySelectorAll("span");
const input = document.getElementById("input");
const timeEl = document.getElementById("time");
const fastestEl = document.getElementById("fastest");

let prevInputValue = undefined;
let correctLength = 0;
let isGameStarted = false;
let initialTime = undefined;
let intermediateTime = undefined;
let fastestTime = Number.MAX_SAFE_INTEGER;
let gameLoop = undefined;

// Initialization
input.value = "";
input.focus();
setActiveLetter();

window.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        resetGame();
    }
});

input.addEventListener("input", (e) => {
    if (correctLength === CORRECT_TEXT.length) {
        input.value = prevInput;
        return;
    }

    const key = e.data;

    if (!isGameStarted) {
        startGame();
    }

    if (
        key &&
        key.toLowerCase() === CORRECT_TEXT[correctLength].toLowerCase()
    ) {
        correctLength++;
        setActiveLetter();
    } else {
        input.value = prevInput;
    }

    if (input.value.toLowerCase() === CORRECT_TEXT.toLowerCase()) {
        // YOU WON... NOTHING. Congrats!
        isGameStarted = false;
        fastestEl.classList.remove("hidden");

        fastestTime =
            intermediateTime < fastestTime ? intermediateTime : fastestTime;

        fastestEl.innerText = `🥇 Fastest: ${prettifyMe(fastestTime)}s`;
        clearInterval(gameLoop);
    }

    prevInput = input.value;
});

function setActiveLetter() {
    letterEls.forEach((letterEl, idx) => {
        // reset classes
        letterEl.classList.remove("text-purple-900");
        letterEl.classList.remove("text-green-600");

        if (idx < correctLength) {
            letterEl.classList.add("text-green-600");
        } else if (idx === correctLength) {
            letterEl.classList.add("text-purple-900");
        }
    });
}

function startGame() {
    initialTime = new Date();
    isGameStarted = true;
    gameLoop = setInterval(() => {
        const newTime = new Date();

        intermediateTime = newTime - initialTime;

        timeEl.innerHTML = `Timer: ${prettifyMe(intermediateTime)}s`;
    }, 1);
}

function resetGame() {
    console.log("RESET");
    isGameStarted = false;
    initialTime = undefined;
    input.value = "";
    timeEl.innerText = "Timer: 0.000s";
    correctLength = 0;
    setActiveLetter();
    clearInterval(gameLoop);
}

// This is becasue of bwbwbwbwbbwbwbw
function prettifyMe(num) {
    if (num < 1000) {
        return String(num).padStart(5, "0.");
    }

    const arr = String(num).split("").reverse();
    arr.splice(3, 0, ".");

    return arr.reverse().join("");
}
