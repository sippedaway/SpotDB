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

function closeBanner() {
    const banner = document.querySelector('.auth-banner');
    banner.style.animation = 'slideUp 0.3s ease forwards';
    setTimeout(() => {
        banner.style.display = 'none';
    }, 300);

    localStorage.setItem('bannerClosed', 'true');
}

const spotdblogo = document.querySelector('.spotdb-logo');

function toggleDarkMode() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';

    if (isDarkMode) {
        localStorage.setItem('darkMode', 'false');
        document.body.classList.remove('dark-mode');
        spotdblogo.src = '/spotdb/SpotDB_Black.png';
    } else {
        localStorage.setItem('darkMode', 'true');
        document.body.classList.add('dark-mode');
        spotdblogo.src = '/spotdb/SpotDB_White.png';
    }
}

if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    spotdblogo.src = '/spotdb/SpotDB_White.png';
} else if (localStorage.getItem('darkMode') === 'false'){
    document.body.classList.remove('dark-mode');
    spotdblogo.src = '/spotdb/SpotDB_Black.png';
} else {
    toggleDarkMode();
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
                topResultsSection.classList.add('results-category', 'tr-div');
                topResultsSection.innerHTML = `<h2>Top Results</h2>`;
                const topResultsGrid = document.createElement('div');
                topResultsGrid.classList.add('grid');

                topResults.forEach(item => {
                    const topResultItem = document.createElement('div');
                    topResultItem.classList.add('search-item');
                    topResultItem.classList.add('top-result');
                    topResultItem.addEventListener('click', function() {
                        window.location.href = `/r/${item.id}`;
                    });

                    let explicitTag = '';
                    if (item.type === 'track' && item.explicit) {
                        explicitTag = '<span class="explicit-tag">E</span>';
                    }

                    console.log(item);
                    topResultItem.innerHTML = `
                        <div class="top-result-div">
                            <img src="${item.cover || item.icon}" alt="${item.name}">
                            <div class="content" style="text-align: left;">
                                <div class="name">${item.name.length > 20 ? item.name.substring(0, 30) + '…' : item.name} ${explicitTag}</div>
                                ${item.artists ? `<div class="artists">${item.artists.join(', ').length > 20 
    ? item.artists.join(', ').substring(0, 20) + '…' 
    : item.artists.join(', ')}</div>` : ''}
                                <div class="type">${item.type.charAt(0).toUpperCase() + item.type.slice(1)}</div>
                            </div>
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

                let explicitTag = '';
                if (item.type === 'track' && item.explicit) {
                    explicitTag = '<span class="explicit-tag">E</span>';
                }

                const imgUrl = item.cover || item.icon;
                searchItem.innerHTML += `
                    <img src="${imgUrl}" alt="${item.name}">
                    <div class="content">
                        <div class="name" title="${item.name}">${item.name.length > 20 ? item.name.substring(0, 30) + '…' : item.name} ${explicitTag}</div>
                        ${item.artists ? `<div class="artists" title="${item.artists.join(', ')}">
  ${item.artists.join(', ').length > 50 
    ? item.artists.join(', ').substring(0, 50) + '…' 
    : item.artists.join(', ')}
</div>
` : ''}

                    </div>
                    <div class="type">${item.type.charAt(0).toUpperCase() + item.type.slice(1)}</div>
                `;

                searchItem.addEventListener('click', () => {
                    window.location.href = `/r/${item.id}`;
                });

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

const recommendations = [
    {
        name: "the now now and never",
        id: "1JqSKahgRfnmk4rw82BBTL",
        image: "https://i.scdn.co/image/ab67616d0000b2736f2e5817230413edcd000cc6",
        type: "Album"
    },
    {
        name: "Adrianne Lenker",
        id: "4aKWmkWAKviFlyvHYPTNQY",
        image: "https://i.scdn.co/image/ab6761610000e5eb5a7d5278cf9deda53119028c",
        type: "Artist"
    },
    {
        name: "The Winner Takes It All",
        id: "3oEkrIfXfSh9zGnE7eBzSV",
        image: "https://i.scdn.co/image/ab67616d0000b2734d08fc99eff4ed52dfce91fa",
        type: "Track"
    },
    {
        name: "To Pimp a Butterfly",
        id: "7ycBtnsMtyVbbwTfJwRjSP",
        image: "https://i.scdn.co/image/ab67616d0000b273cdb645498cd3d8a2db4d05e1",
        type: "Album"
    },
    {
        name: 'Something Stupid (From "Better Call Saul")',
        id: "4kxZ8kCU7sL8YWBCuo0kIF",
        image: "https://i.scdn.co/image/ab67616d0000b273263e48c2162aaa9ae5104daf",
        type: "Track"
    },
    {
        name: "Roads",
        id: "2sW8fmnISifQTRgnRrQTYW",
        image: "https://i.scdn.co/image/ab67616d0000b273dc20397b139223620af148f6",
        type: "Track"
    }
];

async function loadTrendingContent() {
    const trendingSection = document.createElement('div');
    trendingSection.classList.add('trending-section');

    const newReleasesContainer = document.createElement('div');
    newReleasesContainer.classList.add('results-category');
    newReleasesContainer.innerHTML = '<h2>Albums</h2>';

    const newReleasesGrid = document.createElement('div');
    newReleasesGrid.classList.add('grid');

    try {
        const newReleasesResponse = await fetch('/api/browse/new-releases');
        const newReleasesData = await newReleasesResponse.json();

        newReleasesData.albums.items.forEach(album => {
            const item = document.createElement('div');
            item.classList.add('search-item');
            item.innerHTML = `
                <img src="${album.images[0].url}" alt="${album.name}">
                <div class="content">
                    <div class="name">${album.name}</div>
                    <div class="artists">${album.artists.map(a => a.name).join(', ')}</div>
                </div>
                <div class="lol" style="color: #999">Album</div>

            `;
            item.addEventListener('click', () => {
                window.location.href = `/r/${album.id}`;
            });
            newReleasesGrid.appendChild(item);
        });
    } catch (error) {
        console.error('Error loading new releases:', error);
        newReleasesGrid.innerHTML = '<p>Failed to load new releases</p>';
    }

    const recommendedContainer = document.createElement('div');
    recommendedContainer.classList.add('results-category');
    recommendedContainer.innerHTML = '<h2>Recommended by us</h2>';

    const recommendedGrid = document.createElement('div');
    recommendedGrid.classList.add('grid');

    recommendations.forEach(artist => {
        const item = document.createElement('div');
        item.classList.add('search-item');
        item.innerHTML = `
            <img src="${artist.image}" alt="${artist.name}">
            <div class="content">
                <div class="name">${artist.name}</div>
            </div>
            <div class="lol" style="color: #999">${artist.type}</div>
        `;
        item.addEventListener('click', () => {
            window.location.href = `/r/${artist.id}`;
        });
        recommendedGrid.appendChild(item);
    });

    newReleasesContainer.appendChild(newReleasesGrid);

    recommendedContainer.appendChild(recommendedGrid);

    trendingSection.appendChild(newReleasesContainer);
    trendingSection.appendChild(recommendedContainer);

    const searchContainer = document.querySelector('.results-container');
    searchContainer.appendChild(trendingSection);
}

document.addEventListener('DOMContentLoaded', loadTrendingContent);

async function updateAuthBanner() {
    const banner = document.querySelector('.auth-banner');
    if (!banner) return;

    try {
        const response = await fetch('/api/me');
        const userData = await response.json();
        const messages = [
            "Yo! ",
            "Well hey there, ",
            "welcome back ",
            "Greetings, ",
            "HEYYYY ",
            "Hiya, ",
            "What’s up, ",
            "Hey hey, "
        ];

        if (!userData.error) {

            banner.innerHTML = `
                <div class="banner-content">
                    <div class="banner-text">
                        <div style="display: flex; align-items: center;">
                            <img src="${userData.images[0].url}" alt="User avatar" style="width: 50px; height: 50px; border-radius: 50%; margin-right: 15px;">
                            <p><strong>${messages[Math.floor(Math.random() * messages.length)]}${userData.display_name}!</strong> View your Spotify statistics, liked songs, and playlists.</p>
                        </div>
                    </div>
                </div>
                </div>
                    <button onclick="window.location.href='/you'" class="spotify-button" style="padding: 10px 18px; font-size: 14px; margin-right: 10px;">
                        <i class="fas fa-user"></i>Go to your page
                    </button>
                    <button class="banner-close" onclick="closeBanner()">
                        <i class="fas fa-times"></i>
                    </button>
            `;
        }
    } catch (error) {
        console.error('Error checking auth status:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const banner = document.querySelector('.auth-banner');
    if (localStorage.getItem('bannerClosed') === 'true') {
        banner.style.display = 'none';
    } else {
        updateAuthBanner();
    }
});