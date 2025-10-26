function createNav() {
    const nav = document.createElement('nav');
    nav.classList.add('navbar');

    const left = document.createElement('div');
    left.classList.add('navbar-left');
    left.innerHTML = `
        <button onclick='window.location.href="/faq/#2"' class="menu-button m-h">API<i style="margin-left: 10px" class="fas fa-chevron-down"></i></button>
        <div class="menu-popup m-h">
            <button onclick='window.open("https://developer.spotify.com/documentation/web-api", "_blank")'><i style="margin-right:6px" class="fas fa-plug"></i>API</button>
            <button onclick='window.open("/faq", "_blank")'><i style="margin-right:6px" class="fas fa-circle-question"></i>FAQ & Documentation</button>
            <button onclick='window.open("https://github.com/sippedaway/SpotDB", "_blank")'><i style="margin-right:6px" class="fab fa-github"></i>GitHub repository</button>
        </div>
        <button onclick="window.location.href='/users'" class="menu-button m-h">Users</button>
    `;

    const center = document.createElement('div');
    center.classList.add('navbar-center');
    center.innerHTML = `
        <a href="/"><img class="logo" id="logo" src="https://raw.githubusercontent.com/sippedaway/SpotDB/refs/heads/main/public/spotdb/SpotDB_White.png" alt="SpotDB logo"></a>
        <div class="nav-search-container">
            <div class="nav-search-bar">
                <i style="margin-left: 5px;" class="fas fa-search"></i>
                <input type="text" id="nav-search-input" placeholder="Search for artists, albums, singles...">
            </div>
        </div>
    `;

    const right = document.createElement('div');
    right.classList.add('navbar-right', 'm-h');
    right.innerHTML = `<button onclick='toggleDarkMode()' class="menu-button">Dark mode</button>`;

    fetch('/api/me')
        .then(response => response.json())
        .then(userData => {
            if (userData.error) {

                right.innerHTML += `
                    <button onclick="window.location.href='/auth/login'" class="spotify-button">
                        <i style="margin-right: 5px;" class="fab fa-spotify"></i>Sign in with Spotify
                    </button>
                `;
            } else {

                const profileDropdown = document.createElement('div');
                profileDropdown.classList.add('profile-dropdown');
                profileDropdown.innerHTML = `
                    <button class="profile-button">
                        <img src="${userData.images?.[0]?.url || '/default-profile.png'}" alt="Profile">
                        <span>${userData.display_name}</span>
                        <i class="fas fa-chevron-down"></i>
                    </button>
                    <div class="profile-menu">
                        <button onclick="window.location.href='/you'">
                            <i class="fas fa-user"></i>Visit your page
                        </button>
                        <button onclick="window.location.href='/auth/login'">
                            <i class="fas fa-sync-alt"></i>Switch accounts
                        </button>
                        <button onclick="handleSignOut()">
                            <i class="fas fa-sign-out-alt"></i>Sign out
                        </button>
                    </div>
                `;
                right.appendChild(profileDropdown);

                const profileButton = profileDropdown.querySelector('.profile-button');
                const profileMenu = profileDropdown.querySelector('.profile-menu');

                profileButton.addEventListener('mouseenter', () => {
                    profileMenu.classList.toggle('show');
                });

                profileMenu.addEventListener('mouseleave', (e) => {
                    profileMenu.classList.remove('show');
                });
            }
        })
        .catch(error => {
            console.error('Error fetching user data:', error);

            right.innerHTML += `
                <button onclick="window.location.href='/auth/login'" class="spotify-button">
                    <i style="margin-right: 5px;" class="fab fa-spotify"></i>Sign in with Spotify
                </button>
            `;
        });

    nav.appendChild(left);
    nav.appendChild(center);
    nav.appendChild(right);

    const overlay = document.createElement('div');
    overlay.classList.add('nav-search-overlay');
    overlay.style.display = 'none';

    const panel = document.createElement('div');
    panel.classList.add('nav-search-panel');

    const resultsContainer = document.createElement('div');
    resultsContainer.classList.add('nav-search-results');
    resultsContainer.innerHTML = `
    <div class="nav-search-list">
    <div class="nav-search-loading" style="display:none; text-align:center; padding:20px;">
    <div class="skeleton-item"></div>
    <div class="skeleton-item"></div>
    <div class="skeleton-item"></div>
    <div class="skeleton-item"></div>
    <div class="skeleton-item"></div>
</div>

</div>
`;

    const bottomBar = document.createElement('div');
    bottomBar.classList.add('nav-search-bottom');
    bottomBar.innerHTML = `
        <div class="hints">
            <div>Enter — View all results</div>
            <div>Escape — Close search menu</div>
            <div>Type an ID to open directly</div>
            <div>Ctrl+U — Search Users</div>
        </div>
    `;

    panel.appendChild(resultsContainer);
    panel.appendChild(bottomBar);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    window.navSearchOverlayOpen = false;

    function openNavSearch() {
        overlay.style.display = 'block';
        window.navSearchOverlayOpen = true;
        document.body.style.overflow = 'hidden';
        nav.querySelector('#nav-search-input').focus();
    }

    function closeNavSearch() {
        overlay.style.display = 'none';
        window.navSearchOverlayOpen = false;
        document.body.style.overflow = '';

        panel.querySelector('.nav-search-list').innerHTML = '';
    }

    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) closeNavSearch();
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && window.navSearchOverlayOpen) {
            closeNavSearch();
        }
    });

    document.addEventListener("DOMContentLoaded", function() {
        const menuButton = nav.querySelector(".menu-button");
        const menuPopup = nav.querySelector(".menu-popup");
        const logo = nav.querySelector('#logo');

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && window.navSearchOverlayOpen) {
                e.preventDefault();
                closeNavSearch();
                navSearchInput.blur();
            }
        });

        menuButton.addEventListener("mouseenter", () => {
            menuPopup.style.display = "block";
        });

        menuPopup.addEventListener("mouseleave", () => {
            menuPopup.style.display = "none";
        });

        logo.addEventListener("mouseenter", () => {
            logo.src = 'https://raw.githubusercontent.com/sippedaway/SpotDB/refs/heads/main/public/spotdb/SpotDB_themed.png';
        });

        logo.addEventListener("mouseleave", () => {
            logo.src = 'https://raw.githubusercontent.com/sippedaway/SpotDB/refs/heads/main/public/spotdb/SpotDB_White.png';
        });

        const navSearchInput = nav.querySelector('#nav-search-input');

        navSearchInput.addEventListener('focus', () => {
            if (navSearchInput.value.trim().length >= 1) openNavSearch();
        });
        navSearchInput.addEventListener('click', () => {
            if (navSearchInput.value.trim().length >= 1) openNavSearch();
        });

        let debounceTimer = null;

        function debounce(fn, delay = 200) {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(fn, delay);
        }

        function looksLikeId(v) {
            return /^[A-Za-z0-9]{22}$/.test(v.trim());
        }

        async function fetchPreviewResults(q) {
            const listWrap = panel.querySelector('.nav-search-list');
let loadingDiv = listWrap.querySelector('.nav-search-loading');
if (!loadingDiv) {
    loadingDiv = document.createElement('div');
    loadingDiv.classList.add('nav-search-loading');
    listWrap.appendChild(loadingDiv);
}

loadingDiv.innerHTML = ''; 

for (let i = 0; i < 20; i++) {
    const skel = document.createElement('div');
    skel.classList.add('skeleton-item');
    skel.innerHTML = `
        <div class="text-placeholder"></div>
        <div class="sub-placeholder"></div>
    `;
    loadingDiv.appendChild(skel);
}

loadingDiv.style.display = 'block';
listWrap.querySelectorAll('.nav-section').forEach(sec => sec.remove());

            if (!q) {
                loadingDiv.style.display = 'block';
                return;
            }

            try {
                const market = 'US';
                const limit = 6;
                const res = await fetch(`/api/search/advanced?q=${encodeURIComponent(q)}&market=${market}&limit=${limit}`);
                if (!res.ok) return;
                const data = await res.json();
                renderPreviewResults(q, data);
            } catch (err) {
                console.error('Preview fetch error', err);
            } finally {
                const hasResults = listWrap.querySelectorAll('.nav-list-item').length > 0;
                loadingDiv.style.display = hasResults ? 'none' : 'block';
            }
        }

        function createListSection(title, items) {
            const section = document.createElement('div');
            section.classList.add('nav-section');
            const h = document.createElement('h4');
            h.textContent = title;
            section.appendChild(h);
            const ul = document.createElement('ul');
            ul.classList.add('nav-list');
            if (!items || items.length === 0) {
                const li = document.createElement('li');
                li.classList.add('nav-list-item', 'empty');
                li.textContent = 'No results';
                ul.appendChild(li);
            } else {
                items.slice(0, 10).forEach(it => {
                    const li = document.createElement('li');
                    li.classList.add('nav-list-item');
                    const a = document.createElement('a');
                    a.href = `/r/${it.id}`;
                    a.innerHTML = `
        <div class="left">
            <img src="${it.cover || it.icon || '/default-album-cover.png'}" alt="${it.name}">
        </div>
        <div class="middle">
            <div class="name">${it.name}</div>
            <div class="sub">${(it.artists || []).join ? (it.artists || []).join(', ') : ''}</div>
        </div>
        <div class="right">${it.type ? (it.type.charAt(0).toUpperCase()+it.type.slice(1)) : ''}</div>
    `;

                    li.appendChild(a);

                    li.addEventListener('mouseenter', () => {
                        const img = it.cover || it.icon || '/default-album-cover.png';
                        li.style.setProperty('--hover-bg', `url('${img}')`);
                        li.style.border = '1px solid rgba(255,255,255,0.4)';
                    });

                    li.addEventListener('mouseleave', () => {
                        li.style.removeProperty('--hover-bg');
                        li.style.border = '1px solid transparent';
                    });

                    ul.appendChild(li);
                });

            }
            section.appendChild(ul);
            return section;
        }

        function renderPreviewResults(query, data) {
    const listWrap = panel.querySelector('.nav-search-list');

    if (looksLikeId(query)) {
        window.location.href = `/r/${query}`;
    }

    const topItems = [];
    ['albums', 'tracks', 'artists'].forEach(key => {
        if (data[key] && data[key].length) topItems.push(...data[key].slice(0, 1));
    });
    if (topItems.length) {
        const topSec = createListSection('Top results', topItems);
        listWrap.appendChild(topSec);
    }

    listWrap.appendChild(createListSection('Albums', data.albums || []));
    listWrap.appendChild(createListSection('Tracks', data.tracks || []));
    listWrap.appendChild(createListSection('Artists', data.artists || []));

    panel.querySelector('.nav-search-results').style.paddingBottom = '170px';
}

        navSearchInput.addEventListener('input', (e) => {
            const val = e.target.value.trim();

            if (val.length >= 1 && !window.navSearchOverlayOpen) {
                openNavSearch();
            } else if (val.length === 0 && window.navSearchOverlayOpen) {
                closeNavSearch();
            }

            debounce(() => fetchPreviewResults(val), 200);
        });

        navSearchInput.addEventListener('keydown', (event) => {
            if (!window.navSearchOverlayOpen) return;

            if (event.ctrlKey && event.key.toLowerCase() === 'u') {
                event.preventDefault();
                const q = navSearchInput.value.trim();

                window.location.href = `/users?q=${encodeURIComponent(q)}`;
                return;
            }

            if (event.key === 'Enter') {
                event.preventDefault();
                const q = navSearchInput.value.trim();
                if (!q) return;
                if (looksLikeId(q)) {
                    window.location.href = `/r/${q}`;
                } else {
                    window.location.href = `/q?=${encodeURIComponent(q)}`;
                }
            }
        });
    });

    document.body.insertBefore(nav, document.body.firstChild);

    document.body.insertBefore(nav, document.body.firstChild);
}

function handleSignOut() {
    fetch('/api/signout', {
            method: 'POST'
        })
        .then(response => {
            if (response.ok) {
                window.location.href = '/';
            }
        })
        .catch(error => console.error('Error signing out:', error));
}

createNav();