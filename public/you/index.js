async function fetchUserProfile() {
    try {
        const response = await fetch('/api/me');
        if (!response.ok) {
            window.location.href = '/';
            return;
        }

        const data = await response.json();
        console.log(data);

        const buttonRow = document.createElement('div');
        buttonRow.classList.add('button-row');

        const gotoUserPage = document.createElement('button');
        gotoUserPage.id = 'userpage-button';
        gotoUserPage.classList.add('button');
        gotoUserPage.innerHTML = '<i style="margin-right: 5px" class="fas fa-user"></i> Go to User page';

        const visitSpotifyButton = document.createElement('button');
        visitSpotifyButton.id = 'visit-spotify';
        visitSpotifyButton.classList.add('button');
        visitSpotifyButton.innerHTML = '<i style="margin-right: 5px" class="fas fa-external-link-alt"></i> Open Spotify URL';

        const openSpotifyButton = document.createElement('button');
        openSpotifyButton.id = 'open-spotify';
        openSpotifyButton.classList.add('button');
        openSpotifyButton.classList.add('openinspotify');
        openSpotifyButton.innerHTML = '<i style="margin-right: 5px" class="fab fa-spotify"></i> Open in Spotify app';

        buttonRow.appendChild(gotoUserPage);
        buttonRow.appendChild(visitSpotifyButton);
        buttonRow.appendChild(openSpotifyButton);

        gotoUserPage.addEventListener('click', function() {
            window.location.href = `/r/${data.id}`;
        });

        visitSpotifyButton.addEventListener('click', () => {
            window.open(data.external_urls.spotify, '_blank');
        });

        openSpotifyButton.addEventListener('click', () => {
            window.location.href = data.uri;
        });

        const page = document.querySelector('.page');
        const topSection = document.createElement('div');
        topSection.classList.add('top-section');

        const backgroundBlur = document.createElement('div');
        backgroundBlur.classList.add('background-blur');
        backgroundBlur.style.backgroundImage = `url("${data.images?.[0]?.url || '/default-profile.png'}")`;
        document.body.insertBefore(backgroundBlur, document.body.firstChild);

        const headerContainer = document.createElement('div');
        headerContainer.classList.add('header-container');

        const headerLeft = document.createElement('div');
        headerLeft.classList.add('header-left');

        const headerImage = document.createElement('img');
        headerImage.classList.add('header-image');
        headerImage.src = data.images?.[0]?.url || '/default-profile.png';
        headerImage.alt = data.display_name;
        headerImage.addEventListener('click', () => handleImageClick(headerImage.src));

        const headerTitle = document.createElement('div');
        headerTitle.classList.add('header-title');
        headerTitle.innerHTML = `<a href="/r/${data.id}">${data.display_name}</a>`;

        headerLeft.appendChild(headerImage);
        headerLeft.appendChild(headerTitle);

        const headerButtons = document.createElement('div');
        headerButtons.classList.add('header-buttons');
        headerButtons.appendChild(buttonRow);

        headerContainer.appendChild(headerLeft);
        headerContainer.appendChild(headerButtons);

        topSection.appendChild(headerContainer);

        const cont = document.createElement('div');
        cont.classList.add('container');

        const table = document.createElement('table');
        table.classList.add('info-table');
        table.innerHTML = `
            <tr><td>Type</td><td>${data.type}</td></tr>
            <tr><td>Country</td><td>${data.country}</td></tr>
            <tr id="emailRow"><td>Email</td></tr>
            <tr><td>Followers</td><td>${data.followers?.total || '0'}</td></tr>
            <tr><td>ID</td><td>${data.id}</td></tr>
            <tr><td>Spotify URL</td><td><a href="${data.external_urls?.spotify || '#'}" target="_blank">${data.external_urls?.spotify ? 'Open link' : 'N/A'}</a></td></tr>
        `;

        const emailRow = table.querySelector('#emailRow');
        emailRow.appendChild(createEmailCell(data.email));

        const buttonContainer = document.createElement('div');
buttonContainer.classList.add('action-buttons');

const signOutBtn = document.createElement('button');
signOutBtn.classList.add('sign-out-btn');
signOutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Sign out';

signOutBtn.addEventListener('click', async () => {
    try {
        const response = await fetch('/api/signout', {
            method: 'POST'
        });

        if (response.ok) {
            window.location.href = '/';
        } else {
            throw new Error('Failed to sign out');
        }
    } catch (error) {
        console.error('Error signing out:', error);
    }
});

        const fullTableBtn = document.createElement('button');
        fullTableBtn.classList.add('full-table-btn');
        fullTableBtn.innerHTML = '<i class="fas fa-table"></i> All information';

        buttonContainer.appendChild(fullTableBtn);
        buttonContainer.appendChild(signOutBtn);

        const fullTableModal = document.createElement('div');
        fullTableModal.classList.add('full-table-modal');
        fullTableModal.innerHTML = `
            <div class="full-table-content">
                <h2>Full entry information</h2>
                <p>All information the Spotify WebAPI provides about your profile.<br></p>
                <table class="info-table full-info-table">
                    <tr><td>country</td><td>${data.country}</td></tr>
                    <tr><td>display_name</td><td>${data.display_name}</td></tr>
                    <tr id="fullEmailRow"><td>email</td></tr>
                    <tr><td>filter_enabled</td><td>${data.explicit_content?.filter_enabled}</td></tr>
                    <tr><td>filter_locked</td><td>${data.explicit_content?.filter_locked}</td></tr>
                    <tr><td>external_urls</td><td>${Object.entries(data.external_urls || {}).map(([key, value]) => `${key}: <a href="${value}" target="_blank">${value}</a>`).join(', ') || 'N/A'}</td></tr>
                    <tr><td>followers</td><td>${data.followers?.total || '0'}</td></tr>
                    <tr><td>href</td><td>${data.href}</td></tr>
                    <tr><td>id</td><td>${data.id}</td></tr>
                    <tr><td>Profile picture sizes included</td><td>${data.images?.length}</td></tr>
                    <tr><td>product</td><td>${data.product}</td></tr>
                    <tr><td>type</td><td>${data.type}</td></tr>
                    <tr><td>uri</td><td>${data.uri}</td></tr>
                </table>
                <button class="close-full-table">Close</button>
            </div>
        `;
        document.body.appendChild(fullTableModal);

        const fullEmailRow = fullTableModal.querySelector('#fullEmailRow');
        fullEmailRow.appendChild(createEmailCell(data.email));

        fullTableBtn.addEventListener('click', () => {
            fullTableModal.style.display = 'flex';
        });

        fullTableModal.querySelector('.close-full-table').addEventListener('click', () => {
            fullTableModal.style.display = 'none';
        });

        fullTableModal.addEventListener('click', (e) => {
            if (e.target === fullTableModal) {
                fullTableModal.style.display = 'none';
            }
        });

        const tar = document.createElement('div');
        tar.classList.add('tar');
        tar.appendChild(table);
        tar.appendChild(buttonContainer);
        topSection.appendChild(tar);
        page.appendChild(topSection);

        const tabsContainer = document.createElement('div');
    tabsContainer.classList.add('tabs');
    cont.appendChild(tabsContainer);

    const menuContainer = document.createElement('div');
    menuContainer.classList.add('menu');
    cont.insertBefore(menuContainer, tabsContainer);

    page.appendChild(cont);

    createTabMenu([
        { text: 'Top artists', tabId: 'topartists', icon: 'fas fa-star' },
        { text: 'Top tracks', tabId: 'toptracks', icon: 'fas fa-music' },
        { text: 'Following', tabId: 'following', icon: 'fas fa-users' },
        { text: 'Follow/Unfollow', tabId: 'follow', icon: 'fas fa-user-plus' },
        { text: 'Media', tabId: 'media', icon: 'fas fa-images' }
    ]);

    await createTopArtistsTab();
    await createTopTracksTab();
    await createFollowingTab();
    createFollowInfoTab();
    createMediaTab(data);

    switchTab('topartists');

    } catch (error) {
        console.error('Error fetching profile:', error);
    }
}

function createTabMenu(buttons) {
    const menuContainer = document.querySelector('.menu');
    menuContainer.innerHTML = '';

    buttons.forEach(button => {
        const btn = document.createElement('button');

        const icon = document.createElement('i');
        icon.style.marginRight = '10px';
        icon.classList.add(...button.icon.split(' '));

        btn.appendChild(icon);
        btn.appendChild(document.createTextNode(` ${button.text}`));

        btn.addEventListener('click', () => switchTab(button.tabId));
        menuContainer.appendChild(btn);
    });
}

function switchTab(tabId) {
    const allTabs = document.querySelector('.tabs').querySelectorAll('div');
    allTabs.forEach(tab => tab.classList.remove('active'));

    const activeTab = document.querySelector(`#${tabId}`);
    if (activeTab) activeTab.classList.add('active');
}

async function getTopArtists(timeRange = 'medium_term', limit = 10) {
    try {
        const response = await fetch(`/api/me/top-artists?time_range=${timeRange}&limit=${limit}`);
        if (!response.ok) {
            throw new Error('Failed to fetch top artists');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching top artists:', error);
        return null;
    }
}

async function getTopTracks(timeRange = 'medium_term', limit = 10) {
    try {
        const response = await fetch(`/api/me/top-tracks?time_range=${timeRange}&limit=${limit}`);
        if (!response.ok) {
            throw new Error('Failed to fetch top tracks');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching top tracks:', error);
        return null;
    }
}

async function getFollowed(limit = 10) {
    try {
        const response = await fetch(`/api/me/followed?limit=${limit}`);
        if (!response.ok) {
            throw new Error('Failed to fetch followed artists');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching followed artists:', error);
        return null;
    }
}

async function createTopArtistsTab() {
    const tab = document.createElement('div');
    tab.id = 'topartists';
    tab.classList.add('tab-content');
    tab.innerHTML = '<h3>Your Top Artists</h3>';

    const filtersContainer = document.createElement('div');
    filtersContainer.classList.add('filters-container');

    const timeSelect = document.createElement('select');
    timeSelect.innerHTML = `
        <option value="short_term">Last month</option>
        <option value="medium_term" selected>Last 6 months</option>
        <option value="long_term">Last year</option>
    `;

    const limitSelect = document.createElement('select');
    limitSelect.innerHTML = `
        <option value="3">3 artists</option>
        <option value="5">5 artists</option>
        <option value="10" selected>10 artists</option>
        <option value="20">20 artists</option>
        <option value="50">50 artists (max)</option>
    `;

    filtersContainer.appendChild(createFilterGroup('Time range:', timeSelect));
    filtersContainer.appendChild(createFilterGroup('Show:', limitSelect));
    tab.appendChild(filtersContainer);

    const contentContainer = document.createElement('div');
    tab.appendChild(contentContainer);

    async function updateContent() {
        const data = await getTopArtists(timeSelect.value, limitSelect.value);
        contentContainer.innerHTML = '';

        if (data.items?.length) {
            const grid = document.createElement('div');
            grid.classList.add('grid');

            data.artists.items.forEach(artist => {
                const item = document.createElement('div');
                item.classList.add('track-item', 'artist-item');
                item.innerHTML = `
                    <img src="${artist.images?.[0]?.url}" class='artist-img' alt="${artist.name}">
                    <div class="track-name">${artist.name}</div>
                `;
                item.addEventListener('click', () => window.location.href = `/r/${artist.id}`);
                grid.appendChild(item);
            });
            contentContainer.appendChild(grid);
        } else {
            contentContainer.innerHTML += '<p>No top artists found. Try changing the filters!</p>';
        }
    }

    timeSelect.addEventListener('change', updateContent);
    limitSelect.addEventListener('change', updateContent);
    await updateContent();

    document.querySelector('.tabs').appendChild(tab);
}

async function createTopTracksTab() {
    const tab = document.createElement('div');
    tab.id = 'toptracks';
    tab.classList.add('tab-content');
    tab.innerHTML = '<h3>Your Top Tracks</h3>';

    const filtersContainer = document.createElement('div');
    filtersContainer.classList.add('filters-container');

    const timeSelect = document.createElement('select');
    timeSelect.innerHTML = `
        <option value="short_term">Last month</option>
        <option value="medium_term" selected>Last 6 months</option>
        <option value="long_term">Last year</option>
    `;

    const limitSelect = document.createElement('select');
    limitSelect.innerHTML = `
        <option value="3">3 tracks</option>
        <option value="5">5 tracks</option>
        <option value="10" selected>10 tracks</option>
        <option value="20">20 tracks</option>
        <option value="50">50 tracks (max)</option>
    `;

    filtersContainer.appendChild(createFilterGroup('Time range:', timeSelect));
    filtersContainer.appendChild(createFilterGroup('Show:', limitSelect));
    tab.appendChild(filtersContainer);

    const contentContainer = document.createElement('div');
    tab.appendChild(contentContainer);

    async function updateContent() {
        const data = await getTopTracks(timeSelect.value, limitSelect.value);
        contentContainer.innerHTML = '';

        if (data?.items?.length) {
            data.items.forEach(track => {
                const trackItem = document.createElement('div');
                trackItem.classList.add('track-item');
                trackItem.innerHTML = `
                    <img src="${track.album.images?.[0]?.url}" class="track-img" style="width: 50px;">
                    <div style="width: 100%;">
                        <div style="display: flex; justify-content: space-between;">
                            <div class="track-name">${track.name}</div>
                            <div class="track-duration">${formatDuration(track.duration_ms)}</div>
                        </div>
                        <div class="artist-name">${track.artists.map(a => a.name).join(', ')}</div>
                    </div>
                `;
                trackItem.addEventListener('click', () => window.location.href = `/r/${track.id}`);
                contentContainer.appendChild(trackItem);
            });
        } else {
            contentContainer.innerHTML += '<p>No top tracks found. Try changing the filters!</p>';
        }
    }

    timeSelect.addEventListener('change', updateContent);
    limitSelect.addEventListener('change', updateContent);
    await updateContent();

    document.querySelector('.tabs').appendChild(tab);
}

function createFilterGroup(label, select) {
    const group = document.createElement('div');
    group.classList.add('filter-group');

    const labelElem = document.createElement('label');
    labelElem.textContent = label;

    group.appendChild(labelElem);
    group.appendChild(select);

    return group;
}

async function createFollowingTab() {
    const tab = document.createElement('div');
    tab.id = 'following';
    tab.classList.add('tab-content');
    tab.innerHTML = '<h3>Artists you follow</h3><p>Note: this tab does not show followed users.</p>';

    const filtersContainer = document.createElement('div');
    filtersContainer.classList.add('filters-container');

    const limitSelect = document.createElement('select');
    limitSelect.innerHTML = `
        <option value="3">3 artists</option>
        <option value="5">5 artists</option>
        <option value="10" selected>10 artists</option>
        <option value="20">20 artists</option>
        <option value="50">50 artists (max)</option>
    `;

    filtersContainer.appendChild(createFilterGroup('Show:', limitSelect));
    tab.appendChild(filtersContainer);

    const contentContainer = document.createElement('div');
    tab.appendChild(contentContainer);

    async function updateContent() {
        const data = await getFollowed(limitSelect.value);
        contentContainer.innerHTML = '';

        if (data?.artists?.items?.length) {
            const grid = document.createElement('div');
            grid.classList.add('grid');

            data.artists.items.forEach(artist => {
                const item = document.createElement('div');
                item.classList.add('track-item', 'artist-item');
                item.innerHTML = `
                    <img src="${artist.images?.[0]?.url}" class='artist-img' alt="${artist.name}">
                    <div class="track-name">${artist.name}</div>
                `;
                item.addEventListener('click', () => window.location.href = `/r/${artist.id}`);
                grid.appendChild(item);
            });
            contentContainer.appendChild(grid);
        } else {
            contentContainer.innerHTML = '<p>No followed artists found. Try changing the limit!</p>';
        }
    }

    limitSelect.addEventListener('change', updateContent);
    await updateContent();

    document.querySelector('.tabs').appendChild(tab);
}

function createEmailCell(email) {
    const cell = document.createElement('td');
    const emailContainer = document.createElement('div');
    emailContainer.style.display = 'flex';
    emailContainer.style.alignItems = 'center';
    emailContainer.style.gap = '10px';

    const emailText = document.createElement('span');
    emailText.textContent = '••••••••';
    emailText.dataset.email = email;

    const toggleButton = document.createElement('button');
    toggleButton.classList.add('eye-button');
    toggleButton.innerHTML = '<i class="fas fa-eye"></i>';
    toggleButton.title = 'Show/Hide email';

    toggleButton.addEventListener('click', () => {
        if (emailText.textContent === '••••••••') {
            emailText.textContent = emailText.dataset.email;
            toggleButton.innerHTML = '<i class="fas fa-eye-slash"></i>';
        } else {
            emailText.textContent = '••••••••';
            toggleButton.innerHTML = '<i class="fas fa-eye"></i>';
        }
    });

    emailContainer.appendChild(emailText);
    emailContainer.appendChild(toggleButton);
    cell.appendChild(emailContainer);
    return cell;
}

function createFollowInfoTab() {
    const tab = document.createElement('div');
    tab.id = 'follow';
    tab.classList.add('tab-content');
    tab.innerHTML = `
        <h3>Follow/Unfollow Information</h3>
        <div class="info-box">
            <p>When browsing SpotDB while signed in with your Spotify account, you can follow or unfollow artists and users directly from their pages.</p>
            <p>Simply visit any artist or user page and look for the Follow/Unfollow button in their profile.</p>
            <ul>
                <li>Following artists helps you stay updated with their new releases</li>
                <li>Following users lets you see their public playlists and activity</li>
                <li>You can manage your followed artists and users directly on Spotify</li>
            </ul>
        </div>
    `;

    document.querySelector('.tabs').appendChild(tab);
}

async function createMediaTab(data) {
    const mediatab = document.createElement('div');
    mediatab.id = 'media';
    mediatab.classList.add('tab-content');
    mediatab.innerHTML = `<h3>Images</h3>`;

    if (data.images && Array.isArray(data.images)) {
        data.images.forEach(image => {
            const imageContainer = document.createElement('div');
            imageContainer.classList.add('image-item');

            const img = document.createElement('img');
            img.src = image.url;
            img.alt = image.name || 'Album Image';
            img.addEventListener("click", () => handleImageClick(img.src));

            img.onload = () => {
                const width = img.naturalWidth;
                const height = img.naturalHeight;

                const name = document.createElement('p');
                name.textContent = `${width}x${height}`;

                imageContainer.appendChild(img);
                imageContainer.appendChild(name);
            };

            mediatab.appendChild(imageContainer);
        });
    } else {
        const noImagesMessage = document.createElement('p');
        noImagesMessage.textContent = 'No images available for this album.';
        mediatab.appendChild(noImagesMessage);
    }

    document.querySelector('.tabs').appendChild(mediatab);
}

function formatDuration(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function handleImageClick(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const saveButton = document.getElementById('saveImage');
    const copyButton = document.getElementById('copyImage');
    const closeButton = document.getElementById('closeModal');

    modalImage.src = imageSrc;

    modal.style.display = 'flex';

    saveButton.addEventListener('click', () => {
        window.open(imageSrc, '_blank');
    });

    copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(imageSrc)
            .then(() => {
                alert('Image URL copied to clipboard!');
            })
            .catch(err => {
                console.error('Error copying image URL:', err);
            });
    });

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

document.addEventListener('DOMContentLoaded', fetchUserProfile);

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