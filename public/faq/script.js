document.addEventListener("DOMContentLoaded", function () {
    const menuButton = document.querySelector(".menu-button");
    const menuPopup = document.querySelector(".menu-popup");

    menuButton.addEventListener("mouseenter", () => {
        menuPopup.style.display = "block";
    });

    menuPopup.addEventListener("mouseleave", () => {
        menuPopup.style.display = "none";
    });

    const logo = document.getElementById('logo');

    logo.addEventListener("mouseenter", () => {
        logo.src = '/spotdb/spotdb_themed.png';
    });

    logo.addEventListener("mouseleave", () => {
        logo.src = '/spotdb/spotdb_white.png';
    });
});

function toggleDarkMode() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';

    if (isDarkMode) {
        localStorage.setItem('darkMode', 'false');
        document.body.classList.remove('dark-mode');
    } else {
        localStorage.setItem('darkMode', 'true');
        document.body.classList.add('dark-mode');
    }
}

if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
} else {
    document.body.classList.remove('dark-mode');
}

const navSearchInput = document.getElementById('nav-search-input');
navSearchInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        window.location.href = `/q?=${encodeURIComponent(navSearchInput.value)}`;
    }
});

function search(q) {
    if (q) {
        window.location.href = `/r/${encodeURIComponent(q)}`;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const questions = document.querySelectorAll('.faq-question');
    const answers = document.querySelectorAll('.faq-answer');
  
    function resetActiveState() {
      questions.forEach(question => question.classList.remove('active'));
      answers.forEach(answer => answer.style.display = 'none');
    }
  
    function showAnswer(questionId) {
      const question = document.getElementById(questionId);
      const answerId = question.getAttribute('data-answer-id');
      const answer = document.getElementById(answerId);
  
      resetActiveState();
      question.classList.add('active');
      answer.style.display = 'block';
    }
  
    questions.forEach(question => {
      question.addEventListener('click', function () {
        const answerId = question.getAttribute('data-answer-id');
        const answer = document.getElementById(answerId);
  
        resetActiveState();
        question.classList.add('active');
        answer.style.display = 'block';
      });
    });
  
    if (questions.length > 0) {
      questions[0].click();
    }
  
    window.addEventListener('hashchange', function () {
      const hash = window.location.hash;
      if (hash) {
        const questionId = 'question' + hash.substring(1); // e.g., "question1"
        if (document.getElementById(questionId)) {
          showAnswer(questionId);
        }
      }
    });
  
    if (window.location.hash) {
      const hash = window.location.hash;
      const questionId = 'question' + hash.substring(1);
      if (document.getElementById(questionId)) {
        showAnswer(questionId);
      }
    }
  });
  
const faqToggleBtn = document.getElementById('faqToggleBtn');
const faqQuestions = document.querySelector('.faq-questions');
const faqQuestionItems = document.querySelectorAll('.faq-question');

faqToggleBtn.addEventListener('click', () => {
    faqQuestions.classList.toggle('show');
    if (faqQuestions.classList.contains('show')) {
        faqToggleBtn.textContent = 'Hide Questions';
    } else {
        faqToggleBtn.textContent = 'Show Questions';
    }
});

faqQuestionItems.forEach((question) => {
    question.addEventListener('click', () => {
        const answer = question.nextElementSibling;
        answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
    });
});
