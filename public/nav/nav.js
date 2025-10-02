function createNav() {
    const nav = document.createElement('nav');
    nav.classList.add('navbar');

    // Left section
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

    // Center section
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

    // Right section
    const right = document.createElement('div');
    right.classList.add('navbar-right', 'm-h');
    right.innerHTML = `<button onclick='toggleDarkMode()' class="menu-button">Dark mode</button>`;

    // Check if user is logged in
    fetch('/api/me')
        .then(response => response.json())
        .then(userData => {
            if (userData.error) {
                // Not logged in - show sign in button
                right.innerHTML += `
                    <button onclick="window.location.href='/auth/login'" class="spotify-button">
                        <i style="margin-right: 5px;" class="fab fa-spotify"></i>Sign in with Spotify
                    </button>
                `;
            } else {
                // Logged in - show profile dropdown
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

                // Add dropdown toggle functionality
                const profileButton = profileDropdown.querySelector('.profile-button');
                const profileMenu = profileDropdown.querySelector('.profile-menu');
                
                profileButton.addEventListener('mouseenter', () => {
                    profileMenu.classList.toggle('show');
                });

                // Close dropdown when clicking outside
                profileMenu.addEventListener('mouseleave', (e) => {
                    profileMenu.classList.remove('show');
                });
            }
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
            // Show sign in button as fallback
            right.innerHTML += `
                <button onclick="window.location.href='/auth/login'" class="spotify-button">
                    <i style="margin-right: 5px;" class="fab fa-spotify"></i>Sign in with Spotify
                </button>
            `;
        });

    // Assemble nav
    nav.appendChild(left);
    nav.appendChild(center);
    nav.appendChild(right);

    // Add event listeners
    document.addEventListener("DOMContentLoaded", function () {
        const menuButton = nav.querySelector(".menu-button");
        const menuPopup = nav.querySelector(".menu-popup");
        const logo = nav.querySelector('#logo');

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

        // Handle search
        const navSearchInput = nav.querySelector('#nav-search-input');
        navSearchInput.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                if (navSearchInput.value) {
                    window.location.href = `/q?=${encodeURIComponent(navSearchInput.value)}`;
                }
            }
        });
    });

    // Insert nav at the start of body
    document.body.insertBefore(nav, document.body.firstChild);
}

function handleSignOut() {
    fetch('/api/signout', { method: 'POST' })
        .then(response => {
            if (response.ok) {
                window.location.href = '/';
            }
        })
        .catch(error => console.error('Error signing out:', error));
}

// Initialize navigation
createNav();