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

document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get("");

    if (query) {
        setTimeout(() => {
            document.querySelector("#search-input").value = decodeURIComponent(query);
            document.querySelector("#nav-search-input").value = decodeURIComponent(query);
            search(query);
        }, 1);
    }

    const navSearchInput = document.getElementById('nav-search-input');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-btn');
    const resultsContainer = document.getElementById('results-container');
    const marketSelect = document.getElementById('market-select');
    const limitInput = document.getElementById('limit-input');
    const tabsContainer = document.createElement('div');
    tabsContainer.classList.add('tabs-container');

    const filters = ["All", "Albums", "Tracks", "Artists", "Playlists", "Episodes", "Shows"];
    let activeFilter = "All";

    Object.entries(regionMappings).forEach(([code, name]) => {
        const option = document.createElement('option');
        option.value = code;
        option.textContent = name;
        marketSelect.appendChild(option);
    });

    function getTopResult(items) {
        return items.reduce((top, item) => (item.popularity > top.popularity ? item : top), items[0]);
    }

    marketSelect.value = "US";

    const savedMarket = getCookie('market');
    const savedLimit = getCookie('limit');

    if (savedMarket) {
        marketSelect.value = savedMarket;
    }
    if (savedLimit) {
        limitInput.value = savedLimit;
    }

    marketSelect.addEventListener('change', function () {
        setCookie('market', marketSelect.value, 7);
    });
    
    limitInput.addEventListener('input', function () {
        setCookie('limit', limitInput.value, 7);
    });

    function createTabs() {
        tabsContainer.innerHTML = "";
        tabsContainer.classList.add('tabs-container');
    
        filters.forEach(filter => {
            const button = document.createElement("button");
            button.textContent = filter;
            button.classList.add("tab-btn");
            if (filter === activeFilter) button.classList.add("active");
            button.addEventListener("click", function () {
                document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
                button.classList.add("active");
                activeFilter = filter;
                updateResults();
            });
            tabsContainer.appendChild(button);
        });
    
        resultsContainer.innerHTML = "";
        resultsContainer.appendChild(tabsContainer);
    }
    

    let searchResults = { albums: [], tracks: [], artists: [], playlists: [], episodes: [], shows: [] };

    async function search(q) {
        let query = q;

        const market = marketSelect.value;
        const limit = Math.min(Math.max(parseInt(limitInput.value) || 10, 1), 50);

        if (!query) {
            showerror('Write something!');
            return;
        }

        try {
            const response = await fetch(`/api/search/advanced?q=${encodeURIComponent(query)}&market=${market}&limit=${limit}`);
            const data = await response.json();

            if (response.status === 429) {
                alert(`You're searching too much! Try again in ${data.retryAfter} seconds, thanks :)`);
                return;
            }    

            searchResults = data;
            createTabs();
            updateResults();
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    }

    function updateResults() {
        resultsContainer.innerHTML = "";
        resultsContainer.appendChild(tabsContainer);
    
        if (activeFilter === "All") {
            const topResults = ['albums', 'tracks', 'artists']
                .map(type => searchResults[type].length > 0 ? getTopResult(searchResults[type]) : null)
                .filter(item => item !== null);
    
            if (topResults.length > 0) {
                const topResultsSection = document.createElement('div');
                topResultsSection.classList.add('results-category');
                topResultsSection.innerHTML = `<h2>Top Results</h2>`;
                const topResultsGrid = document.createElement('div');
                topResultsGrid.classList.add('grid');
    
                topResults.forEach(item => {
                    const topResultItem = document.createElement('div');
                    topResultItem.classList.add('search-item');
                    topResultItem.addEventListener('click', function() {
                        window.location.href = `/r/${item.id}`;
                    });
    
                    topResultItem.innerHTML = `
                        <img src="${item.cover || item.icon}" alt="${item.name}">
                        <div class="content">
                            <div class="name">${item.name}</div>
                            ${item.artists ? `<div class="artists">${item.artists.join(', ')}</div>` : ''}
                            <div class="type">${item.type.charAt(0).toUpperCase() + item.type.slice(1)}</div>
                        </div>
                    `;
                    topResultsGrid.appendChild(topResultItem);
                });
    
                topResultsSection.appendChild(topResultsGrid);
                resultsContainer.appendChild(topResultsSection);
            }
        }
    
        ['albums', 'tracks', 'artists', 'playlists', 'episodes', 'shows'].forEach(type => {
            if (activeFilter === "All" || activeFilter.toLowerCase() === type) {
                appendResults(type, searchResults[type]);
            }
        });
    }    
    

    function appendResults(type, items) {
        const category = document.createElement('div');
        category.classList.add('results-category');
    
        const categoryTitle = document.createElement('h2');
        categoryTitle.textContent = type.charAt(0).toUpperCase() + type.slice(1);
        category.appendChild(categoryTitle);
    
        if (items.length > 0) {
            const grid = document.createElement('div');
            grid.classList.add('grid');
    
            items.forEach(item => {
                const searchItem = document.createElement('div');
                searchItem.classList.add('search-item');
                searchItem.addEventListener('click', function() {
                    window.location.href = `/r/${item.id}`;
                });
    
                let explicitTag = '';
                if (item.type === 'track' && item.explicit) {
                    explicitTag = '<span class="explicit-tag">E</span>';
                }

                searchItem.innerHTML = `
                    <img src="${item.cover || item.icon}" alt="${item.name}">
                    <div class="content">
                        <div class="name">${item.name} ${explicitTag}</div>
                        ${item.artists ? `<div class="artists">${item.artists.join(', ')}</div>` : ''}
                        <div class="type">${item.type.charAt(0).toUpperCase() + item.type.slice(1)}</div>
                    </div>
                `;
    
                grid.appendChild(searchItem);
            });
    
            category.appendChild(grid);
        } else {
            const noResultsMessage = document.createElement('h4');
            noResultsMessage.textContent = `No ${type.charAt(0).toUpperCase() + type.slice(1)} found`;
            category.appendChild(noResultsMessage);
        }
    
        resultsContainer.appendChild(category);
    }

    searchButton.addEventListener('click', function () {
        startsearch(searchInput.value || navSearchInput.value);
    });
    searchInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            startsearch(searchInput.value);
        }
    });

    navSearchInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            startsearch(navSearchInput.value);
        }
    });

    function startsearch(q) {
        if (!q) {
            return;
        }
        window.location.href = `/q?=${encodeURIComponent(q)}`;
    }
});

function showerror(p) {
    er = document.getElementById('error');

    er.style.display = 'flex';
    er.textContent = p;
}

function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name) {
    const nameEq = name + "=";
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let c = cookies[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEq) === 0) return decodeURIComponent(c.substring(nameEq.length, c.length));
    }
    return null;
}