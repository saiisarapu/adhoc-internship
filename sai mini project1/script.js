const quizData = [
    {
        question: "What does HTML stand for?",
        options: [
            "Hyper Text Markup Language",
            "High Tech Modern Language",
            "Home Tool Markup Language",
            "Hyperlinks and Text Management Language"
        ],
        answer: "Hyper Text Markup Language"
    },
    {
        question: "Which language is used for styling web pages?",
        options: ["HTML", "Python", "CSS", "Java"],
        answer: "CSS"
    },
    {
        question: "Which JavaScript method is used to map arrays?",
        options: ["forEach()", "filter()", "map()", "reduce()"],
        answer: "map()"
    },
    {
        question: "Which company developed JavaScript?",
        options: ["Microsoft", "Netscape", "Google", "Apple"],
        answer: "Netscape"
    }
];

let currentQuestion = 0;
let score = 0;
let timeLeft = 15;
let timer;

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const nextBtn = document.getElementById("nextBtn");

function loadQuestion() {
    clearInterval(timer);
    startTimer();

    const currentQuiz = quizData[currentQuestion];

    questionEl.textContent = currentQuiz.question;

    optionsEl.innerHTML = "";

    // Array Mapping
    currentQuiz.options.map(option => {
        const button = document.createElement("button");
        button.textContent = option;
        button.classList.add("option-btn");

        button.addEventListener("click", () => selectAnswer(button, option));

        optionsEl.appendChild(button);
    });
}

function selectAnswer(button, selectedOption) {
    const correctAnswer = quizData[currentQuestion].answer;

    const buttons = document.querySelectorAll(".option-btn");

    buttons.forEach(btn => btn.disabled = true);

    if (selectedOption === correctAnswer) {
        button.classList.add("correct");
        score++;
        scoreEl.textContent = score;
    } else {
        button.classList.add("wrong");

        buttons.forEach(btn => {
            if (btn.textContent === correctAnswer) {
                btn.classList.add("correct");
            }
        });
    }

    clearInterval(timer);
}

function startTimer() {
    timeLeft = 15;
    timerEl.textContent = timeLeft;

    timer = setInterval(() => {
        timeLeft--;
        timerEl.textContent = timeLeft;

        if (timeLeft === 0) {
            clearInterval(timer);
            nextQuestion();
        }
    }, 1000);
}

function nextQuestion() {
    currentQuestion++;

    if (currentQuestion < quizData.length) {
        loadQuestion();
    } else {
        showResult();
    }
}

nextBtn.addEventListener("click", nextQuestion);

function showResult() {
    clearInterval(timer);

    document.getElementById("quiz-box").innerHTML = `
        <h2>Quiz Completed!</h2>
        <p>Your Score: ${score} / ${quizData.length}</p>
        <p>${(score / quizData.length * 100).toFixed(0)}%</p>
    `;

    nextBtn.style.display = "none";
}

loadQuestion();