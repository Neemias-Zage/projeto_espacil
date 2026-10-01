const quizQuestions = [
  { question: "Qual é a estrela no centro do Sistema Solar?", answers: ["Sirius", "O Sol", "Estrela Polar"], correct: 1 },
  { question: "Qual é o maior planeta do Sistema Solar?", answers: ["Júpiter", "Saturno", "Neptuno"], correct: 0 },
  { question: "Qual planeta é conhecido como Planeta Vermelho?", answers: ["Vénus", "Mercúrio", "Marte"], correct: 2 },
  { question: "Que planeta tem os anéis mais conhecidos?", answers: ["Terra", "Saturno", "Marte"], correct: 1 },
  { question: "Qual é o satélite natural da Terra?", answers: ["Lua", "Fobos", "Europa"], correct: 0 }
];

function initializeQuiz() {
  const answers = document.getElementById("quiz-answers");
  if (!answers) return;
  const progress = document.getElementById("quiz-progress");
  const question = document.getElementById("quiz-question");
  const feedback = document.getElementById("quiz-feedback");
  const next = document.getElementById("quiz-next");
  const restart = document.getElementById("quiz-restart");
  const launch = document.getElementById("launch");
  const launchOverlay = document.getElementById("launch-overlay");
  let current = 0;
  let score = 0;

  function showQuestion() {
    const item = quizQuestions[current];
    progress.textContent = `Pergunta ${current + 1} de ${quizQuestions.length}`;
    question.textContent = item.question;
    feedback.textContent = "";
    next.hidden = true;
    answers.replaceChildren(...item.answers.map((label, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "quiz-answer";
      button.textContent = label;
      button.addEventListener("click", () => {
        answers.querySelectorAll("button").forEach(option => { option.disabled = true; });
        if (index === item.correct) {
          score++;
          button.classList.add("correct");
          feedback.textContent = "Correcto!";
        } else {
          button.classList.add("incorrect");
          answers.children[item.correct].classList.add("correct");
          feedback.textContent = `Ainda não. A resposta certa é ${item.answers[item.correct]}.`;
        }
        if (current < quizQuestions.length - 1) next.hidden = false;
        else {
          feedback.textContent += ` Resultado final: ${score} em ${quizQuestions.length}.`;
          restart.hidden = false;
          launch.hidden = false;
        }
      });
      return button;
    }));
  }

  next.addEventListener("click", () => { current++; showQuestion(); question.focus(); });
  restart.addEventListener("click", () => {
    current = 0;
    score = 0;
    restart.hidden = true;
    launch.hidden = true;
    showQuestion();
    question.focus();
  });
  launch.addEventListener("click", () => {
    try { sessionStorage.setItem("solar-arrival", "1"); } catch (_) {}
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.location.assign("sistema-solar.html");
      return;
    }
    launch.disabled = true;
    launchOverlay.setAttribute("aria-hidden", "false");
    launchOverlay.classList.add("active");
    document.querySelectorAll("#nav, main, #footer").forEach(element => { element.inert = true; });
    launchOverlay.focus();
    window.setTimeout(() => window.location.assign("sistema-solar.html"), 1700);
  });
  showQuestion();
}

document.addEventListener("DOMContentLoaded", initializeQuiz);
