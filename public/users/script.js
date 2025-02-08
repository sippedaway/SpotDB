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
        logo.src = 'https://raw.githubusercontent.com/sippedaway/SpotDB/refs/heads/main/public/spotdb/SpotDB_themed.png';
    });

    logo.addEventListener("mouseleave", () => {
        logo.src = 'https://raw.githubusercontent.com/sippedaway/SpotDB/refs/heads/main/public/spotdb/SpotDB_White.png';
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

const si = document.getElementById('search-input');
si.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        search(si.value);
    }
});

document.getElementById('search-btn').addEventListener('click', function () {
    search(si.value);
});

function search(q) {
    if (q) {
        window.location.href = `/r/${encodeURIComponent(q)}`;
    }
}