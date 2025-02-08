const id = window.location.pathname.split('/').pop();
const contentContainer = document.querySelector('.main-content');
const menuContainer = document.querySelector('.menu');
const tabsContainer = document.querySelector('.tabs');
let currentTab = 'tracklist';

async function fetchData() {
    try {
        const response = await fetch(`/api/get/${id}`);
        if (!response.ok) {
            contentContainer.style.marginTop = '20%';
            contentContainer.innerHTML = `
                <h1>Well, something's wrong</h1>
                <p style="margin-left: 0" ><b>404</b> Page not found</p>
                <button class="button" onclick="window.location.href='/'" style="margin-top: 3%;">Go home</button>
            `;
        }

        const data = await response.json();

        if (data.type === 'album') {
            const albumButtons = [{
                    text: 'Artists',
                    tabId: 'artists',
                    icon: 'fas fa-users'
                },
                {
                    text: 'Tracklist',
                    tabId: 'tracklist',
                    icon: 'fas fa-list'
                },
                {
                    text: 'Lyrics',
                    tabId: 'lyrics',
                    icon: 'fas fa-music'
                },
                {
                    text: 'Regions',
                    tabId: 'regions',
                    icon: 'fas fa-globe'
                },
                {
                    text: 'External IDs',
                    tabId: 'ids',
                    icon: 'fas fa-id-card'
                },
                {
                    text: 'Media',
                    tabId: 'media',
                    icon: 'fas fa-images'
                },
                {
                    text: 'Embed',
                    tabId: 'embed',
                    icon: 'fas fa-code'
                },
                {
                    text: 'More by artist',
                    tabId: 'more',
                    icon: 'fas fa-arrow-right'
                }
            ];
            createTabMenu(albumButtons);
            populateAlbumPage(data);
        } else if (data.type === 'artist') {
            const artistButtons = [{
                    text: 'Discography',
                    tabId: 'discography',
                    icon: 'fas fa-record-vinyl'
                },
                {
                    text: 'Albums',
                    tabId: 'albums',
                    icon: 'fas fa-layer-group'
                },
                {
                    text: 'Singles & EPs',
                    tabId: 'singles',
                    icon: 'fas fa-music'
                },
                {
                    text: 'Media',
                    tabId: 'media',
                    icon: 'fas fa-images'
                },
                {
                    text: 'Embed',
                    tabId: 'embed',
                    icon: 'fas fa-code'
                }
            ];
            createTabMenu(artistButtons);
            populateArtistPage(data);
        } else if (data.type === 'track') {
            const trackButtons = [{
                    text: 'Artists',
                    tabId: 'artists',
                    icon: 'fas fa-users'
                },
                {
                    text: 'Credits',
                    tabId: 'credits',
                    icon: 'fas fa-file-alt'
                },
                {
                    text: 'Album',
                    tabId: 'album',
                    icon: 'fas fa-list'
                },
                {
                    text: 'Lyrics',
                    tabId: 'lyrics',
                    icon: 'fas fa-music'
                },
                {
                    text: 'Regions',
                    tabId: 'regions',
                    icon: 'fas fa-globe'
                },
                {
                    text: 'External IDs',
                    tabId: 'ids',
                    icon: 'fas fa-id-card'
                },
                {
                    text: 'Media',
                    tabId: 'media',
                    icon: 'fas fa-images'
                },
                {
                    text: 'Embed',
                    tabId: 'embed',
                    icon: 'fas fa-code'
                },
                {
                    text: 'More by artist',
                    tabId: 'more',
                    icon: 'fas fa-arrow-right'
                }
            ];
            createTabMenu(trackButtons);
            populateTrackPage(data);
        } else if (data.type === 'playlist') {
            const trackButtons = [{
                text: 'Creator',
                tabId: 'creators',
                icon: 'fas fa-users'
            },
            {
                text: 'Tracklist',
                tabId: 'tracklist',
                icon: 'fas fa-list'
            },
            {
                text: 'Media',
                tabId: 'media',
                icon: 'fas fa-images'
            },
            {
                text: 'Embed',
                tabId: 'embed',
                icon: 'fas fa-code'
            }
        ]
        createTabMenu(trackButtons);
        populatePlaylistPage(data);
        } else if (data.type === 'user') {
            const trackButtons = [
            {
                text: 'Playlists',
                tabId: 'playlists',
                icon: 'fas fa-list'
            },
            {
                text: 'Media',
                tabId: 'media',
                icon: 'fas fa-images'
            },
            {
                text: 'Embed',
                tabId: 'embed',
                icon: 'fas fa-code'
            }
        ]
        createTabMenu(trackButtons);
        populateUserPage(data);
        } else if (data.type === 'episode') {
            const trackButtons = [{
                text: 'Show',
                tabId: 'show',
                icon: 'fas fa-tv'
            },
            {
                text: 'Description',
                tabId: 'description',
                icon: 'fas fa-info'
            },
            {
                text: 'Media',
                tabId: 'media',
                icon: 'fas fa-images'
            },
            {
                text: 'Embed',
                tabId: 'embed',
                icon: 'fas fa-code'
            }
        ];
        createTabMenu(trackButtons);
        populateEpisodesPage(data);
        } else if (data.type === 'show') {
            const trackButtons = [{
                text: 'Episodes',
                tabId: 'episodes',
                icon: 'fas fa-tv'
            },
            {
                text: 'Description',
                tabId: 'description',
                icon: 'fas fa-info'
            },
            {
                text: 'Regions',
                tabId: 'regions',
                icon: 'fas fa-globe'
            },
            {
                text: 'Media',
                tabId: 'media',
                icon: 'fas fa-images'
            },
            {
                text: 'Embed',
                tabId: 'embed',
                icon: 'fas fa-code'
            }
        ];
        createTabMenu(trackButtons);
        populateShowPage(data);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function createTabMenu(buttons) {
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
    const allTabs = tabsContainer.querySelectorAll('div');
    allTabs.forEach(tab => tab.classList.remove('active'));

    const activeTab = tabsContainer.querySelector(`#${tabId}`);
    if (activeTab) activeTab.classList.add('active');
    currentTab = tabId;
}

function addSpotifyButton(url) {
    const spotifyButton = document.createElement('a');
    spotifyButton.classList.add('spotify-url-btn');
    spotifyButton.href = url || '#';
    spotifyButton.target = '_blank';
    spotifyButton.innerText = 'Open in Spotify';
    contentContainer.appendChild(spotifyButton);
}

function formatDuration(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function convertToLocalTime(isoString) {
    const date = new Date(isoString);
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} (local time)`;
}

async function populateAlbumPage(data) {
    pagename = `${data.name} | SpotDB`;
    document.title = pagename;

    const albumContainer = document.createElement('div');

    const buttonRow = document.createElement('div');
    buttonRow.classList.add('button-row');

    const visitArtistButton = document.createElement('button');
    visitArtistButton.id = 'visit-artist';
    visitArtistButton.classList.add('button');
    visitArtistButton.innerHTML = '<i style="margin-right: 5px" class="fas fa-user"></i> Visit artist page';

    const visitSpotifyButton = document.createElement('button');
    visitSpotifyButton.id = 'visit-spotify';
    visitSpotifyButton.classList.add('button');
    visitSpotifyButton.innerHTML = '<i style="margin-right: 5px" class="fas fa-external-link-alt"></i> Open Spotify URL';

    const openSpotifyButton = document.createElement('button');
    openSpotifyButton.id = 'open-spotify';
    openSpotifyButton.classList.add('button');
    openSpotifyButton.classList.add('openinspotify');
    openSpotifyButton.innerHTML = '<i style="margin-right: 5px" class="fab fa-spotify"></i> Open in Spotify app';

    buttonRow.appendChild(visitArtistButton);
    buttonRow.appendChild(visitSpotifyButton);
    buttonRow.appendChild(openSpotifyButton);

    const topSection = document.createElement('div');

    topSection.appendChild(buttonRow);

    visitArtistButton.addEventListener('click', function() {
        window.location.href = `/r/${data.artists?.[0].id}`;
    });

    visitSpotifyButton.addEventListener('click', function() {
        window.open(data.external_urls.spotify, '_blank');
    });

    openSpotifyButton.addEventListener('click', function() {
        window.location.href = data.uri;
    });

    topSection.classList.add('top-section');

    const ts = document.createElement('div');
    ts.classList.add('ts');

    albumContainer.classList.add('album-row');
    albumContainer.innerHTML = `
        <img src="${data.images?.[0]?.url || '/default-album-cover.png'}" class="img" alt="Album Cover">
        <div class="album-details">
            <h3>${data.name}</h3>
            <p>${data.release_date || 'N/A'}</p>
        </div>
    `;

    const albumImage = albumContainer.querySelector('img');
    albumImage.addEventListener('click', () => handleImageClick(albumImage.src));

    const artistContainer = document.createElement('div');
    const artist = await fetchArtistDetails(data.artists?.[0].id);
    artistContainer.classList.add('album-row');
    artistContainer.innerHTML = `
        <img src="${artist.image}" class="img" alt="Artist Cover">
        <div class="album-details">
            <h3><a href="/r/${data.artists?.[0].id}">${data.artists?.[0].name}</a></h3>
            ${data.artists.length === 2 
                ? `<a href='#artists' onclick="switchTab('artists')">+ 1 artist</a>` 
                : data.artists.length > 2 
                ? `<a href='#artists' onclick="switchTab('artists')">+ ${data.artists.length - 1} artists</a>` 
                : ''}
        </div>
    `;
    const artistImage = artistContainer.querySelector('img');
    artistImage.addEventListener('click', () => handleImageClick(artistImage.src));

    const toappurl = `spotify:album:${data.id}`;

    ts.appendChild(albumContainer);
    ts.appendChild(artistContainer);
    topSection.appendChild(ts);
    contentContainer.prepend(topSection);

    const table = document.createElement('table');
    table.classList.add('info-table');
    table.innerHTML = `
        <tr><td>Type</td><td>${data.album_type}</td></tr>
        <tr><td>ID</td><td>${id}</td></tr>
        <tr><td>Genres</td><td>${data.genres?.map(c => c.text).join(', ') || "None provided"}</td></tr>
        <tr><td>Release Date</td><td>${data.release_date || 'N/A'}</td></tr>
        <tr><td>Label</td><td>${data.label || 'Unknown'}</td></tr>
        <tr><td>Copyrights</td><td>${data.copyrights?.map(c => c.text).join(', ') || 'N/A'}</td></tr>
        <tr><td>Spotify URL</td><td><a href="${data.external_urls?.spotify || '#'}" target="_blank">${data.external_urls?.spotify ? 'Open link' : 'N/A'}</a></td></tr>
    `;
    contentContainer.querySelector('.top-section').appendChild(table);

    await createArtistsTab(data);
    createTracklistTab(data);
    createRegionTab(data);
    createIDsTab(data);
    createMediaTab(data);
    createEmbedTab(data, 'album');
    createMoreTab(data);

    if (data.tracks.length > 1) {
        createLyricsTab();
    } else {
        const result = await fetchLyrics(data.name, data.artists?.[0].name);
        createLyricsTab(result.lyrics);
    }

    if (data.artists.length > 1) {
        switchTab('artists');
    } else {
        switchTab('tracklist');
    }
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

    tabsContainer.appendChild(mediatab);
}

async function createLyricsTab(data) {
    const lyricsTab = document.createElement('div');
    lyricsTab.id = 'lyrics';
    lyricsTab.classList.add('tab-content');
    lyricsTab.innerHTML = `<h3>Lyrics</h3><p>Searching for lyrics...</p>`;

    tabsContainer.appendChild(lyricsTab);

    try {
        const lyrics = await fetchGeniusLyrics(data.name, data.artists?.[0].name);
        
        const formattedLyrics = lyrics.replace(/\[(.*?)\]/g, `<span class="bold-section">[$1]</span>`);

        if (data === undefined) {
            lyricsTab.innerHTML = `<h3>Lyrics</h3><p>This release either doesn't have lyrics - or this release has more than one song. Click on an individual track to see its lyrics.</p>`
        } else {
            lyricsTab.innerHTML = `<h3>Lyrics</h3><p style="white-space: pre; max-width: 20ch; overflow-wrap: break-word;">${formattedLyrics}</p><p><b>Source:</b> Genius</p>`;
        }
    } catch (error) {
        lyricsTab.innerHTML = `<h3>Lyrics</h3><p>This release either doesn't have lyrics - or this release has more than one song. Click on an individual track to see its lyrics.</p>`
    }
}

async function createMoreTab(data) {
    const moreTab = document.createElement('div');
    moreTab.id = 'more';
    moreTab.classList.add('tab-content');
    moreTab.innerHTML = `<h3>More releases by ${data.artists?.[0].name}</h3>`;

    try {
        const albumResponse = await fetch(`/api/get/artist/albums/${data.artists?.[0].id}`);
        if (!albumResponse.ok) {
            throw new Error('Failed to fetch albums');
        }

        const ad = await albumResponse.json();

        if (ad.items.length > 0) {
            ad.items.slice(0, 10).forEach(album => {
                const item = document.createElement('div');
                item.classList.add('track-item');
                item.classList.add('artist-item');

                const albumImg = document.createElement('img');
                albumImg.classList.add('album-img');
                albumImg.src = album.images.length > 0 ? album.images[0].url : 'default-image.jpg';
                albumImg.alt = `${album.name} Cover`;

                const albumName = document.createElement('div');
                albumName.classList.add('track-name');
                albumName.textContent = album.name;

                item.appendChild(albumImg);
                item.appendChild(albumName);

                item.addEventListener('click', () => {
                    window.location.href = `/r/${album.id}`;
                });

                moreTab.appendChild(item);
            });
        } else {
            moreTab.innerHTML += '<p>No albums available for this artist.</p>';
        }
    } catch (error) {
        console.error('Error fetching albums:', error);
        moreTab.innerHTML += '<p>Failed to load albums.</p>';
    }

    const morebt = document.createElement('button');
    morebt.classList.add('button');
    morebt.style.marginTop = '20px';
    morebt.textContent = `More by ${data.artists?.[0].name}`;
    morebt.addEventListener("click", () => window.location.href = `/r/${data.artists?.[0].id}`);
    moreTab.appendChild(morebt);

    tabsContainer.appendChild(moreTab);
}

async function createArtistsTab(data) {
    const artistTab = document.createElement('div');
    artistTab.id = 'artists';
    artistTab.classList.add('tab-content');
    artistTab.innerHTML = '<h3>Artists</h3>';

    if (Array.isArray(data.artists) && data.artists.length > 0) {
        for (const artist of data.artists) {
            const ar = await fetchArtistDetails(artist.id);

            const item = document.createElement('div');
            item.classList.add('track-item');
            item.classList.add('artist-item');

            const artistname = document.createElement('div');
            artistname.classList.add('track-name');
            artistname.textContent = artist.name;

            const artistimg = document.createElement('img');
            artistimg.classList.add('artist-img');
            artistimg.src = ar.image;
            artistimg.alt = `${artist.name} Image`;

            item.appendChild(artistimg);
            item.appendChild(artistname);

            item.addEventListener('click', () => {
                window.location.href = `/r/${artist.id}`;
            });

            artistTab.appendChild(item);
        }
    } else {
        artistTab.innerHTML += '<p>No artists available.</p>';
    }

    if (typeof tabsContainer !== 'undefined' && tabsContainer) {
        tabsContainer.appendChild(artistTab);
    } else {
        console.error("tabsContainer is not defined or is null");
    }
}

function createTracklistTab(data) {
    const tracklistTab = document.createElement('div');
    tracklistTab.id = 'tracklist';
    tracklistTab.classList.add('tab-content');
    tracklistTab.innerHTML = '<h3>Tracklist</h3>';

    if (data.tracks.items.length) {
        data.tracks.items.forEach(track => {
            const trackItem = document.createElement('div');
            trackItem.classList.add('track-item');

            const trackName = document.createElement('div');
            trackName.classList.add('track-name');
            trackName.textContent = track.name;

            const artists = track.artists?.map(a => a.name).join(', ') || 'Unknown';
            const artistName = document.createElement('div');
            artistName.classList.add('artist-name');
            artistName.textContent = artists;

            const trackDuration = document.createElement('div');
            trackDuration.classList.add('track-duration');
            trackDuration.textContent = formatDuration(track.duration_ms);

            trackItem.appendChild(trackName);
            trackItem.appendChild(artistName);
            trackItem.appendChild(trackDuration);

            trackItem.addEventListener('click', () => {
                window.location.href = `/r/${track.id}`;
            });

            tracklistTab.appendChild(trackItem);
        });
    } else {
        tracklistTab.innerHTML += '<p>No tracklist available.</p>';
    }

    tabsContainer.appendChild(tracklistTab);
}

function createRegionTab(data) {
    const tbaTab = document.createElement('div');
    tbaTab.id = 'regions';
    tbaTab.classList.add('tab-content');

    const heading = document.createElement('h3');
    heading.textContent = 'Available in regions/markets';
    tbaTab.appendChild(heading);

    const table = document.createElement('table');
    table.classList.add('info-table');

    const headerRow = document.createElement('tr');
    const shortRegionHeader = document.createElement('th');
    const fullRegionHeader = document.createElement('th');

    headerRow.appendChild(shortRegionHeader);
    headerRow.appendChild(fullRegionHeader);
    table.appendChild(headerRow);

    data.available_markets.forEach((regionCode) => {
        const row = document.createElement('tr');

        const shortRegionCell = document.createElement('td');
        shortRegionCell.textContent = regionCode;

        const fullRegionCell = document.createElement('td');
        fullRegionCell.textContent = regionMappings[regionCode] || 'Unknown Region';

        row.appendChild(shortRegionCell);
        row.appendChild(fullRegionCell);
        table.appendChild(row);
    });

    tbaTab.appendChild(table);
    tabsContainer.appendChild(tbaTab);
}


function createIDsTab(data) {
    const idsTab = document.createElement('div');
    idsTab.id = 'ids';
    idsTab.classList.add('tab-content');

    const heading = document.createElement('h3');
    heading.textContent = 'External IDs';
    idsTab.appendChild(heading);

    for (const [key, value] of Object.entries(data.external_ids)) {
        const trackItem = document.createElement('div');
        trackItem.classList.add('track-item');
        trackItem.textContent = `${key.toUpperCase()}: ${value}`;
        idsTab.appendChild(trackItem);
    }

    tabsContainer.appendChild(idsTab);
}

function createEmbedTab(data, ln) {
    const embedTab = document.createElement('div');
    embedTab.id = 'embed';
    embedTab.classList.add('tab-content');

    const heading = document.createElement('h3');
    heading.textContent = 'Embed';
    embedTab.appendChild(heading);

    const sizeRow = document.createElement('div');
    sizeRow.classList.add('size-row');

    const widthLabel = document.createElement('label');
    widthLabel.textContent = 'Width: ';
    sizeRow.appendChild(widthLabel);

    const widthInput = document.createElement('input');
    widthInput.type = 'number';
    widthInput.value = 600;
    widthInput.min = 100;
    sizeRow.appendChild(widthInput);

    const heightLabel = document.createElement('label');
    heightLabel.textContent = 'Height: ';
    sizeRow.appendChild(heightLabel);

    const heightInput = document.createElement('input');
    heightInput.type = 'number';
    heightInput.value = 380;
    heightInput.min = 100;
    sizeRow.appendChild(heightInput);

    embedTab.appendChild(sizeRow);

    const buttonRow = document.createElement('div');
    buttonRow.classList.add('button-row');

    const generateButton = document.createElement('button');
    generateButton.textContent = 'Generate Embed';
    buttonRow.appendChild(generateButton);

    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copy Code';
    buttonRow.appendChild(copyButton);

    embedTab.appendChild(buttonRow);

    const lowerRow = document.createElement('div');
    lowerRow.classList.add('lower-row');

    const embedCodeInput = document.createElement('input');
    embedCodeInput.type = 'text';
    embedCodeInput.readOnly = true;
    embedCodeInput.placeholder = 'Embed code will appear here...';
    lowerRow.appendChild(embedCodeInput);

    const pt = document.createElement('h3');
    pt.textContent = 'Embed preview';
    embedTab.appendChild(pt);

    const previewContainer = document.createElement('div');
    previewContainer.id = 'embed-preview';
    lowerRow.appendChild(previewContainer);

    embedTab.appendChild(lowerRow);

    generateButton.addEventListener('click', () => {
        const width = widthInput.value;
        const height = heightInput.value;

        const embedCode = `
            <iframe src="https://open.spotify.com/embed/${ln}/${data.id}" width="${width}" height="${height}" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
        `;

        embedCodeInput.value = embedCode;

        previewContainer.innerHTML = embedCode;
    });

    copyButton.addEventListener('click', () => {
        embedCodeInput.select();
        document.execCommand('copy');
        alert('Embed code copied to clipboard!');
    });

    tabsContainer.appendChild(embedTab);
}

////////////////////////////////////////////////////////////////////// ARTISTS //////////////////////////////////////////////////////////////////////

async function populateArtistPage(data) {
    pagename = `${data.name} | SpotDB`;
    document.title = pagename;

    const buttonRow = document.createElement('div');
    buttonRow.classList.add('button-row');

    const visitSpotifyButton = document.createElement('button');
    visitSpotifyButton.id = 'visit-spotify';
    visitSpotifyButton.classList.add('button');
    visitSpotifyButton.innerHTML = '<i style="margin-right: 5px" class="fas fa-external-link-alt"></i> Open Spotify URL';

    const openSpotifyButton = document.createElement('button');
    openSpotifyButton.id = 'open-spotify';
    openSpotifyButton.classList.add('button');
    openSpotifyButton.classList.add('openinspotify');
    openSpotifyButton.innerHTML = '<i style="margin-right: 5px" class="fab fa-spotify"></i> Open in Spotify app';

    buttonRow.appendChild(visitSpotifyButton);
    buttonRow.appendChild(openSpotifyButton);

    const topSection = document.createElement('div');

    topSection.appendChild(buttonRow);

    visitSpotifyButton.addEventListener('click', function() {
        window.open(data.external_urls.spotify, '_blank');
    });

    openSpotifyButton.addEventListener('click', function() {
        window.location.href = data.uri;
    });

    topSection.classList.add('top-section');

    const ts = document.createElement('div');
    ts.classList.add('ts');

    const artistContainer = document.createElement('div');
    artistContainer.classList.add('album-row');
    artistContainer.innerHTML = `
        <img src="${data.images?.[0].url}" class="img" alt="Artist Cover">
        <div class="album-details">
            <h3>${data.name}</a></h3>
        </div>
    `;
    const artistImage = artistContainer.querySelector('img');
    artistImage.addEventListener('click', () => handleImageClick(artistImage.src));

    ts.appendChild(artistContainer);
    topSection.appendChild(ts);
    contentContainer.prepend(topSection);

    const table = document.createElement('table');
    table.classList.add('info-table');
    table.innerHTML = `
        <tr><td>Type</td><td>${data.type}</td></tr>
        <tr><td>ID</td><td>${id}</td></tr>
        <tr><td>Genres</td><td>${data.genres?.map(c => c.text).join(', ') || "None provided"}</td></tr>
        <tr><td>Popularity</td><td>${data.popularity || 'N/A'}</td></tr>
        <tr><td>Followers</td><td>${data.followers.total || 'N/A'}</td></tr>
        <tr><td>Spotify URL</td><td><a href="${data.external_urls?.spotify || '#'}" target="_blank">${data.external_urls?.spotify ? 'Open link' : 'N/A'}</a></td></tr>
    `;
    contentContainer.querySelector('.top-section').appendChild(table);

    const albumResponse = await fetch(`/api/get/artist/albums/${data.id}`);
    if (!albumResponse.ok) {
        throw new Error('Failed to fetch artists discography, albums & singles');
    }

    const albumData = await albumResponse.json();

    createDiscographyTab(albumData);
    createArtistAlbumsTab(albumData);
    createArtistSinglesTab(albumData);
    createMediaTab(data);
    createEmbedTab(data, 'artist');

    switchTab('discography');
}

async function createDiscographyTab(albumData) {
    const discoTab = document.createElement('div');
    discoTab.id = 'discography';
    discoTab.classList.add('tab-content');
    discoTab.innerHTML = '<h3>Discography</h3>';

    if (albumData.items?.length) {
        albumData.items.forEach(album => {
            const item = document.createElement('div');
            item.classList.add('track-item');
            item.classList.add('artist-item');

            const albumImg = document.createElement('img');
            albumImg.classList.add('album-img');
            albumImg.src = album.images.length > 0 ? album.images[0].url : 'default-image.jpg';
            albumImg.alt = `${album.name} Cover`;

            const albumName = document.createElement('div');
            albumName.classList.add('track-name');
            albumName.textContent = album.name;

            const rd = document.createElement('div');
            rd.classList.add('artist-name');
            rd.textContent = album.release_date;

            item.appendChild(albumImg);
            item.appendChild(albumName);
            item.appendChild(rd);

            item.addEventListener('click', () => {
                window.location.href = `/r/${album.id}`;
            });

            discoTab.appendChild(item);
        });
    } else {
        releasesContainer.innerHTML += '<p>No albums available.</p>';
    }

    tabsContainer.appendChild(discoTab);
}

async function createArtistAlbumsTab(albumData) {
    const albumsTab = document.createElement('div');
    albumsTab.id = 'albums';
    albumsTab.classList.add('tab-content');
    albumsTab.innerHTML = '<h3>Albums</h3>';

    const albumItems = albumData.items?.filter(album => album.album_type === 'album');

    if (albumItems?.length) {
        albumItems.forEach(album => {
            const item = document.createElement('div');
            item.classList.add('track-item', 'artist-item');

            const albumImg = document.createElement('img');
            albumImg.classList.add('album-img');
            albumImg.src = album.images.length > 0 ? album.images[0].url : 'default-image.jpg';
            albumImg.alt = `${album.name} Cover`;

            const albumName = document.createElement('div');
            albumName.classList.add('track-name');
            albumName.textContent = album.name;

            const rd = document.createElement('div');
            rd.classList.add('artist-name');
            rd.textContent = album.release_date;

            item.appendChild(albumImg);
            item.appendChild(albumName);
            item.appendChild(rd);

            item.addEventListener('click', () => {
                window.location.href = `/r/${album.id}`;
            });

            albumsTab.appendChild(item);
        });
    } else {
        albumsTab.innerHTML += '<p>No albums available.</p>';
    }

    tabsContainer.appendChild(albumsTab);
}

async function createArtistSinglesTab(albumData) {
    const albumsTab = document.createElement('div');
    albumsTab.id = 'singles';
    albumsTab.classList.add('tab-content');
    albumsTab.innerHTML = '<h3>Singles & Extended Plays</h3>';

    const albumItems = albumData.items?.filter(album => album.album_type === 'single');

    if (albumItems?.length) {
        albumItems.forEach(album => {
            const item = document.createElement('div');
            item.classList.add('track-item', 'artist-item');

            const albumImg = document.createElement('img');
            albumImg.classList.add('album-img');
            albumImg.src = album.images.length > 0 ? album.images[0].url : 'default-image.jpg';
            albumImg.alt = `${album.name} Cover`;

            const albumName = document.createElement('div');
            albumName.classList.add('track-name');
            albumName.textContent = album.name;

            const rd = document.createElement('div');
            rd.classList.add('artist-name');
            rd.textContent = album.release_date;

            item.appendChild(albumImg);
            item.appendChild(albumName);
            item.appendChild(rd);

            item.addEventListener('click', () => {
                window.location.href = `/r/${album.id}`;
            });

            albumsTab.appendChild(item);
        });
    } else {
        albumsTab.innerHTML += '<p>No albums available.</p>';
    }

    tabsContainer.appendChild(albumsTab);
}

////////////////////////////////////////////////////////////////////// TRACK //////////////////////////////////////////////////////////////////////

async function populateTrackPage(data) {
    pagename = `${data.name} | SpotDB`;
    document.title = pagename;

    const albumContainer = document.createElement('div');

    const buttonRow = document.createElement('div');
    buttonRow.classList.add('button-row');

    const visitArtistButton = document.createElement('button');
    visitArtistButton.id = 'visit-artist';
    visitArtistButton.classList.add('button');
    visitArtistButton.innerHTML = '<i style="margin-right: 5px" class="fas fa-user"></i> Visit artist page';

    const visitSpotifyButton = document.createElement('button');
    visitSpotifyButton.id = 'visit-spotify';
    visitSpotifyButton.classList.add('button');
    visitSpotifyButton.innerHTML = '<i style="margin-right: 5px" class="fas fa-external-link-alt"></i> Open Spotify URL';

    const openSpotifyButton = document.createElement('button');
    openSpotifyButton.id = 'open-spotify';
    openSpotifyButton.classList.add('button');
    openSpotifyButton.classList.add('openinspotify');
    openSpotifyButton.innerHTML = '<i style="margin-right: 5px" class="fab fa-spotify"></i> Open in Spotify app';

    buttonRow.appendChild(visitArtistButton);
    buttonRow.appendChild(visitSpotifyButton);
    buttonRow.appendChild(openSpotifyButton);

    const topSection = document.createElement('div');

    topSection.appendChild(buttonRow);

    visitArtistButton.addEventListener('click', function() {
        window.location.href = `/r/${data.artists?.[0].id}`;
    });

    visitSpotifyButton.addEventListener('click', function() {
        window.open(data.external_urls.spotify, '_blank');
    });

    openSpotifyButton.addEventListener('click', function() {
        window.location.href = data.uri;
    });

    topSection.classList.add('top-section');

    const ts = document.createElement('div');
    ts.classList.add('ts');

    albumContainer.classList.add('album-row');
    albumContainer.innerHTML = `
        <img src="${data.album.images?.[0]?.url || '/default-album-cover.png'}" class="img" alt="Album Cover">
        <div class="album-details">
            <h3>${data.name}</h3>
            <p>${data.album.release_date || 'N/A'}</p>
        </div>
    `;

    const albumImage = albumContainer.querySelector('img');
    albumImage.addEventListener('click', () => handleImageClick(albumImage.src));

    const artistContainer = document.createElement('div');
    const artist = await fetchArtistDetails(data.artists?.[0].id);
    artistContainer.classList.add('album-row');
    artistContainer.innerHTML = `
        <img src="${artist.image}" class="img" alt="Artist Cover">
        <div class="album-details">
            <h3><a href="/r/${data.artists?.[0].id}">${data.artists?.[0].name}</a></h3>
            ${data.artists.length > 1 ? `<a href='#artists' onclick="switchTab('artists')">View all artists</a>` : ''}
        </div>
    `;
    const artistImage = artistContainer.querySelector('img');
    artistImage.addEventListener('click', () => handleImageClick(artistImage.src));

    ts.appendChild(albumContainer);
    ts.appendChild(artistContainer);
    topSection.appendChild(ts);
    contentContainer.prepend(topSection);

    let rating = 'Unknown';

    if (data.explicit) {
        rating = 'Explicit';
    } else {
        rating = 'Clean';
    }

    const table = document.createElement('table');
    table.classList.add('info-table');
    table.innerHTML = `
        <tr><td>Type</td><td>${data.type}</td></tr>
        <tr><td>Duration</td><td>${formatDuration(data.duration_ms)}</td></tr>
        <tr><td>ID</td><td>${id}</td></tr>
        <tr><td>Popularity</td><td>${data.popularity}</td></tr>
        <tr><td>Rating</td><td>${rating}</td></tr>
        <tr><td>Release Date</td><td>${data.album.release_date || 'N/A'}</td></tr>
        <tr><td>Spotify URL</td><td><a href="${data.external_urls?.spotify || '#'}" target="_blank">${data.external_urls?.spotify ? 'Open link' : 'N/A'}</a></td></tr>
    `;
    contentContainer.querySelector('.top-section').appendChild(table);

    await createArtistsTab(data);
    await createAlbumsTab(data);
    createRegionTab(data);
    createIDsTab(data);
    createTrackMediaTab(data);
    createEmbedTab(data, 'track');
    createMoreTab(data);
    createLyricsTab(data);

    if (data.artists.length > 1) {
        switchTab('artists');
    } else {
        switchTab('lyrics');
    }

    await createCreditsTab(data);
}

async function createCreditsTab(data) {
    const creditsTab = document.createElement('div');
    creditsTab.id = 'credits';
    creditsTab.classList.add('tab-content');
    creditsTab.innerHTML = `<h3>Credits</h3><p>Searching for credits...</p>`;
  
    tabsContainer.appendChild(creditsTab);
  
    try {
      const credits = await fetchCredits(data.name, data.artists?.[0].name);
  
      if (!credits) {
        creditsTab.innerHTML = `<h3>Credits</h3><p>No credits found</p>`;
      } else {
        creditsTab.innerHTML = `<h3>Credits</h3>
          <p>
            <b>Producers:</b> ${credits.producers.join(", ")}<br>
            <b>Songwriters:</b> ${credits.songwriters.join(", ")}
            <br><br>
            <b>Source:</b> Genius
          </p>`;
      }
    } catch (error) {
      creditsTab.innerHTML = `<h3>Credits</h3><p>No credits found</p>`;
    }
  }

async function createTrackMediaTab(data) {
    const mediatab = document.createElement('div');
    mediatab.id = 'media';
    mediatab.classList.add('tab-content');
    mediatab.innerHTML = `<h3>Track images</h3>`;

    if (data.album.images && Array.isArray(data.album.images)) {
        data.album.images.forEach(image => {
            const imageContainer = document.createElement('div');
            imageContainer.classList.add('image-item');

            const img = document.createElement('img');
            img.src = image.url;
            img.alt = image.name || 'Track Image';
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

    tabsContainer.appendChild(mediatab);
}

async function createAlbumsTab(data) {
    const albumsTab = document.createElement('div');
    albumsTab.id = 'album';
    albumsTab.classList.add('tab-content');
    albumsTab.innerHTML = `<h3>Track's release</h3>`;

    const item = document.createElement('div');
    item.classList.add('track-item');
    item.classList.add('artist-item');

    item.addEventListener("click", () => window.location.href = `/r/${data.album.id}`);

    const trackName = document.createElement('div');
    trackName.classList.add('track-name');
    trackName.style.fontSize = '1.7em';
    trackName.textContent = data.album.name;

    const artists = data.album.artists?.map(a => a.name).join(', ') || 'Unknown';
    const artistname = document.createElement('div');
    artistname.classList.add('artist-name');
    artistname.style.fontSize = '1em';
    artistname.textContent = artists;

    const artistimg = document.createElement('img');
    artistimg.classList.add('album-img');
    artistimg.src = data.album.images?.[0].url;
    artistimg.alt = `${data.album.name} Image`;

    item.appendChild(artistimg);
    item.appendChild(trackName);
    item.appendChild(artistname);

    const item2 = document.createElement('div');
    item2.classList.add('track-item');
    item2.classList.add('artist-item');
    item2.innerHTML = `<h3>Track number</h3><p>${data.track_number}</p>`;

    albumsTab.appendChild(item);
    albumsTab.appendChild(item2);
    tabsContainer.appendChild(albumsTab);
}

////////////////////////////////////////////////////////////////////// PLAYLIST //////////////////////////////////////////////////////////////////////

async function populatePlaylistPage(data) {
    pagename = `${data.name} | SpotDB`;
    document.title = pagename;

    const albumContainer = document.createElement('div');

    const buttonRow = document.createElement('div');
    buttonRow.classList.add('button-row');

    const visitArtistButton = document.createElement('button');
    visitArtistButton.id = 'visit-artist';
    visitArtistButton.classList.add('button');
    visitArtistButton.innerHTML = '<i style="margin-right: 5px" class="fas fa-user"></i> Visit creators page';

    const visitSpotifyButton = document.createElement('button');
    visitSpotifyButton.id = 'visit-spotify';
    visitSpotifyButton.classList.add('button');
    visitSpotifyButton.innerHTML = '<i style="margin-right: 5px" class="fas fa-external-link-alt"></i> Open Spotify URL';

    const openSpotifyButton = document.createElement('button');
    openSpotifyButton.id = 'open-spotify';
    openSpotifyButton.classList.add('button');
    openSpotifyButton.classList.add('openinspotify');
    openSpotifyButton.innerHTML = '<i style="margin-right: 5px" class="fab fa-spotify"></i> Open in Spotify app';

    buttonRow.appendChild(visitArtistButton);
    buttonRow.appendChild(visitSpotifyButton);
    buttonRow.appendChild(openSpotifyButton);

    const topSection = document.createElement('div');

    topSection.appendChild(buttonRow);

    visitArtistButton.addEventListener('click', function() {
        window.location.href = `/r/${data.owner.id}`;
    });

    visitSpotifyButton.addEventListener('click', function() {
        window.open(data.external_urls.spotify, '_blank');
    });

    openSpotifyButton.addEventListener('click', function() {
        window.location.href = data.uri;
    });

    topSection.classList.add('top-section');

    const ts = document.createElement('div');
    ts.classList.add('ts');

    albumContainer.classList.add('album-row');
    albumContainer.innerHTML = `
        <img src="${data.images?.[0]?.url || '/default-album-cover.png'}" class="img" alt="Album Cover">
        <div class="album-details">
            <h3>${data.name}</h3>
        </div>
    `;

    const albumImage = albumContainer.querySelector('img');
    albumImage.addEventListener('click', () => handleImageClick(albumImage.src));

    const artistContainer = document.createElement('div');
    const artist = await fetchUserDetails(data.owner.id);
    artistContainer.classList.add('album-row');
    artistContainer.innerHTML = `
        <img src="${artist.image}" class="img" alt="Artist Cover">
        <div class="album-details">
            <h3><a href="/r/${data.owner.id}">${artist.name}</a></h3>
        </div>
    `;
    const artistImage = artistContainer.querySelector('img');
    artistImage.addEventListener('click', () => handleImageClick(artistImage.src));

    ts.appendChild(albumContainer);
    ts.appendChild(artistContainer);
    topSection.appendChild(ts);
    contentContainer.prepend(topSection);

    const table = document.createElement('table');
    table.classList.add('info-table');
    table.innerHTML = `
        <tr><td>Type</td><td>${data.type}</td></tr>
        <tr><td>ID</td><td>${id}</td></tr>
        <tr><td>Followers</td><td>${data.followers.total || 'None'}</td></tr>
        <tr><td>Primary color</td><td>${data.primary_color || 'Not defined'}</td></tr>
        <tr><td>Public?</td><td>${data.public || 'Not defined'}</td></tr>
        <tr><td>Collaborative?</td><td>${data.collaborative || 'Not defined'}</td></tr>
        <tr><td>Spotify URL</td><td><a href="${data.external_urls?.spotify || '#'}" target="_blank">${data.external_urls?.spotify ? 'Open link' : 'N/A'}</a></td></tr>
    `;
    contentContainer.querySelector('.top-section').appendChild(table);

    await createCreatorsTab(data, artist);
    await createPlaylistTracklistTab(data);
    createMediaTab(data);
    createEmbedTab(data, 'playlist');

    switchTab('tracklist');
}

async function createPlaylistTracklistTab(data) {
    const tracklistTab = document.createElement('div');
    tracklistTab.id = 'tracklist';
    tracklistTab.classList.add('tab-content');
    tracklistTab.innerHTML = '<h3>Playlist tracklist</h3>';

    if (data.tracks.items.length) {
        data.tracks.items.forEach(trc => {
            if (trc.track === null) return;

            const trackItem = document.createElement('div');
            trackItem.classList.add('track-item');

            const trackName = document.createElement('div');
            trackName.classList.add('track-name');
            trackName.textContent = trc.track.name;

            const artistimg = document.createElement('img');
            artistimg.classList.add('album-img');
            artistimg.src = trc.track.album.images?.[0].url;
            artistimg.alt = `${trc.track.name} Image`;

            const artists = trc.track.artists?.map(a => a.name).join(', ') || 'Unknown';
            const artistName = document.createElement('div');
            artistName.classList.add('artist-name');
            artistName.textContent = artists;

            const albumn = document.createElement('div');
            albumn.classList.add('track-duration');
            albumn.innerHTML = `<b>Album name: </b>${trc.track.album.name || 'Not defined'}`;

            const trackDuration = document.createElement('div');
            trackDuration.classList.add('track-duration');
            trackDuration.innerHTML = `<b>Duration: </b>${formatDuration(trc.track.duration_ms)}`;

            const popl = document.createElement('div');
            popl.classList.add('track-duration');
            popl.innerHTML = `<b>Track popularity: </b>${trc.track.popularity || 'Not defined'}`;

            const rating = document.createElement('div');
            rating.classList.add('track-duration');
            rating.innerHTML = `<b>Track rating: </b>${trc.explicit === true ? 'Explicit' : 'Clean'}`;

            const addedat = document.createElement('div');
            addedat.classList.add('track-duration');
            addedat.innerHTML = `<b>Added at: </b>${convertToLocalTime(trc.added_at)}`;

            const primarycolor = document.createElement('div');
            primarycolor.classList.add('track-duration');
            primarycolor.innerHTML = `<b>Primary color: </b>${trc.primary_color || 'Not defined'}`;

            trackItem.appendChild(artistimg);
            trackItem.appendChild(trackName);
            trackItem.appendChild(artistName);
            trackItem.appendChild(albumn);
            trackItem.appendChild(trackDuration);
            trackItem.appendChild(popl);
            trackItem.appendChild(rating);
            trackItem.appendChild(addedat);
            trackItem.appendChild(primarycolor);

            trackItem.addEventListener('click', () => {
                window.location.href = `/r/${trc.id}`;
            });

            tracklistTab.appendChild(trackItem);
        });
    } else {
        tracklistTab.innerHTML += '<p>No tracklist available.</p>';
    }

    tabsContainer.appendChild(tracklistTab);
}

async function createCreatorsTab(data, artistdata) {
    const artistTab = document.createElement('div');
    artistTab.id = 'creators';
    artistTab.classList.add('tab-content');
    artistTab.innerHTML = '<h3>Playlist creator</h3>';

    const item = document.createElement('div');
    item.classList.add('track-item');
    item.classList.add('artist-item');

    const artistname = document.createElement('div');
    artistname.classList.add('track-name');
    artistname.textContent = data.owner.display_name;

    const artistimg = document.createElement('img');
    artistimg.classList.add('artist-img');
    artistimg.src = artistdata.image;
    artistimg.alt = `${data.owner.name} Image`;

    item.appendChild(artistimg);
    item.appendChild(artistname);

    item.addEventListener('click', () => {
        window.location.href = `/r/${data.owner.id}`;
    });

    artistTab.appendChild(item);

    tabsContainer.appendChild(artistTab);
}

////////////////////////////////////////////////////////////////////// USER //////////////////////////////////////////////////////////////////////

async function populateUserPage(data) {
    pagename = `${data.display_name} | SpotDB`;
    document.title = pagename;

    const albumContainer = document.createElement('div');

    const buttonRow = document.createElement('div');
    buttonRow.classList.add('button-row');

    const visitSpotifyButton = document.createElement('button');
    visitSpotifyButton.id = 'visit-spotify';
    visitSpotifyButton.classList.add('button');
    visitSpotifyButton.innerHTML = '<i style="margin-right: 5px" class="fas fa-external-link-alt"></i> Open Spotify URL';

    const openSpotifyButton = document.createElement('button');
    openSpotifyButton.id = 'open-spotify';
    openSpotifyButton.classList.add('button');
    openSpotifyButton.classList.add('openinspotify');
    openSpotifyButton.innerHTML = '<i style="margin-right: 5px" class="fab fa-spotify"></i> Open in Spotify app';

    buttonRow.appendChild(visitSpotifyButton);
    buttonRow.appendChild(openSpotifyButton);

    const topSection = document.createElement('div');

    topSection.appendChild(buttonRow);

    visitSpotifyButton.addEventListener('click', function() {
        window.open(data.external_urls.spotify, '_blank');
    });

    openSpotifyButton.addEventListener('click', function() {
        window.location.href = data.uri;
    });

    topSection.classList.add('top-section');

    const ts = document.createElement('div');
    ts.classList.add('ts');

    const artistContainer = document.createElement('div');
    artistContainer.classList.add('album-row');
    artistContainer.innerHTML = `
        ${data.images?.[0]?.url ? `<img src="${data.images[0].url}" class="img" alt="Artist Cover">` : ""}
        <div class="album-details">
            <h3><a href="/r/${data.id}">${data.display_name}</a></h3>
        </div>
    `;
    const artistImage = artistContainer.querySelector('img');
    if (artistImage) {
        artistImage.addEventListener('click', () => handleImageClick(artistImage.src));
    }

    ts.appendChild(albumContainer);
    ts.appendChild(artistContainer);
    topSection.appendChild(ts);
    contentContainer.prepend(topSection);

    const table = document.createElement('table');
    table.classList.add('info-table');
    table.innerHTML = `
        <tr><td>Type</td><td>${data.type}</td></tr>
        <tr><td>ID</td><td>${id}</td></tr>
        <tr><td>Followers</td><td>${data.followers.total || 'None'}</td></tr>
        <tr><td>Spotify URL</td><td><a href="${data.external_urls?.spotify || '#'}" target="_blank">${data.external_urls?.spotify ? 'Open link' : 'N/A'}</a></td></tr>
    `;
    contentContainer.querySelector('.top-section').appendChild(table);

    await createUserPlaylistsTab(data);
    createMediaTab(data);
    createUserEmbedTab();

    switchTab('playlists');
}

function createUserEmbedTab() {
    const embedTab = document.createElement('div');
    embedTab.id = 'embed';
    embedTab.classList.add('tab-content');

    embedTab.innerHTML = `<h3>Embed</h3><p>Sorry, Spotify's iFrame Embeds do not support embedding user profiles. Spotify does, however, let you embed tracks, albums, playlists, podcasts and more.`;

    tabsContainer.appendChild(embedTab);
}

async function createUserPlaylistsTab(user) {
    const tracklistTab = document.createElement('div');
    tracklistTab.id = 'playlists';
    tracklistTab.classList.add('tab-content');
    tracklistTab.innerHTML = `<h3>Playlists created by ${user.display_name}</h3>`;

    const data = await fetchUserPlaylists(user.id); 

    if (data.items.length) {
        data.items.forEach(pl => {
            const trackItem = document.createElement('div');
            trackItem.classList.add('track-item');

            const trackName = document.createElement('div');
            trackName.classList.add('track-name');
            trackName.textContent = pl.name;

            const artistimg = document.createElement('img');
            artistimg.classList.add('album-img');
            artistimg.src = pl.images?.[0].url;
            artistimg.alt = `${pl.name} Image`;

            const description = document.createElement('div');
            description.classList.add('track-duration');
            description.innerHTML = `<b>Description: </b>${pl.description || 'Not defined'}`;

            const albumn = document.createElement('div');
            albumn.classList.add('track-duration');
            albumn.innerHTML = `<b>Collaborative? </b>${pl.collaborative || 'No'}`;

            const trackDuration = document.createElement('div');
            trackDuration.classList.add('track-duration');
            trackDuration.innerHTML = `<b>ID: </b>${pl.id}`;

            const popl = document.createElement('div');
            popl.classList.add('track-duration');
            popl.innerHTML = `<b>Public? </b>${pl.public || 'No'}`;

            const primarycolor = document.createElement('div');
            primarycolor.classList.add('track-duration');
            primarycolor.innerHTML = `<b>Primary color: </b>${pl.primary_color || 'Not defined'}`;

            trackItem.appendChild(artistimg);
            trackItem.appendChild(trackName);
            trackItem.appendChild(description);
            trackItem.appendChild(albumn);
            trackItem.appendChild(trackDuration);
            trackItem.appendChild(popl);
            trackItem.appendChild(primarycolor);

            trackItem.addEventListener('click', () => {
                window.location.href = `/r/${pl.id}`;
            });

            tracklistTab.appendChild(trackItem);
        });
    } else {
        tracklistTab.innerHTML += '<p>No tracklist available.</p>';
    }

    tabsContainer.appendChild(tracklistTab);
}

////////////////////////////////////////////////////////////////////// EPISODES //////////////////////////////////////////////////////////////////////

async function populateEpisodesPage(data) {
    pagename = `${data.name} | SpotDB`;
    document.title = pagename;

    const albumContainer = document.createElement('div');

    const buttonRow = document.createElement('div');
    buttonRow.classList.add('button-row');

    const visitArtistButton = document.createElement('button');
    visitArtistButton.id = 'visit-artist';
    visitArtistButton.classList.add('button');
    visitArtistButton.innerHTML = '<i style="margin-right: 5px" class="fas fa-user"></i> Visit show page';

    const visitSpotifyButton = document.createElement('button');
    visitSpotifyButton.id = 'visit-spotify';
    visitSpotifyButton.classList.add('button');
    visitSpotifyButton.innerHTML = '<i style="margin-right: 5px" class="fas fa-external-link-alt"></i> Open Spotify URL';

    const openSpotifyButton = document.createElement('button');
    openSpotifyButton.id = 'open-spotify';
    openSpotifyButton.classList.add('button');
    openSpotifyButton.classList.add('openinspotify');
    openSpotifyButton.innerHTML = '<i style="margin-right: 5px" class="fab fa-spotify"></i> Open in Spotify app';

    buttonRow.appendChild(visitArtistButton);
    buttonRow.appendChild(visitSpotifyButton);
    buttonRow.appendChild(openSpotifyButton);

    const topSection = document.createElement('div');

    topSection.appendChild(buttonRow);

    visitArtistButton.addEventListener('click', function() {
        window.location.href = `/r/${data.show.id}`;
    });

    visitSpotifyButton.addEventListener('click', function() {
        window.open(data.external_urls.spotify, '_blank');
    });

    openSpotifyButton.addEventListener('click', function() {
        window.location.href = data.uri;
    });

    topSection.classList.add('top-section');

    const ts = document.createElement('div');
    ts.classList.add('ts');

    albumContainer.classList.add('album-row');
    albumContainer.innerHTML = `
        <img src="${data.images?.[0]?.url || '/default-album-cover.png'}" class="img" alt="Album Cover">
        <div class="album-details">
            <h3>${data.name}</h3>
            <p>${data.release_date || 'N/A'}</p>
        </div>
    `;

    const albumImage = albumContainer.querySelector('img');
    albumImage.addEventListener('click', () => handleImageClick(albumImage.src));

    ts.appendChild(albumContainer);
    topSection.appendChild(ts);
    contentContainer.prepend(topSection);

    let rating = 'Not defined';
    if (data.explicit) {
        rating = 'Explicit';
    } else {
        rating = 'Clean';
    }

    let exh = 'Not defined';
    if (data.is_externally_hosted) {
        exh = 'True';
    } else {
        exh = 'False';
    }

    let pl = 'Not defined';
    if (data.is_playable) {
        pl = 'True';
    } else {
        pl = 'False';
    }

    const table = document.createElement('table');
    table.classList.add('info-table');
    table.innerHTML = `
        <tr><td>Type</td><td>${data.type}</td></tr>
        <tr><td>ID</td><td>${id}</td></tr>
        <tr><td>Language</td><td>${data.language || 'Not defined'}</td></tr>
        <tr><td>Rating</td><td>${rating || 'Not defined'}</td></tr>
        <tr><td>Duration</td><td>${formatDuration(data.duration_ms) || 'Not defined'}</td></tr>
        <tr><td>Is externally hosted?</td><td>${exh || 'Not defined'}</td></tr>
        <tr><td>Is playable?</td><td>${pl || 'Not defined'}</td></tr>
        <tr><td>Spotify URL</td><td><a href="${data.external_urls?.spotify || '#'}" target="_blank">${data.external_urls?.spotify ? 'Open link' : 'N/A'}</a></td></tr>
    `;
    contentContainer.querySelector('.top-section').appendChild(table);

    createShowTab(data);
    createDescriptionTab(data);
    createMediaTab(data);
    createEmbedTab(data, 'episode');

    switchTab('description');
}

async function createShowTab(data) {
    const albumsTab = document.createElement('div');
    albumsTab.id = 'show';
    albumsTab.classList.add('tab-content');
    albumsTab.innerHTML = `<h3>Episode's show</h3>`;

    const item = document.createElement('div');
    item.classList.add('track-item');
    item.classList.add('artist-item');

    item.addEventListener("click", () => window.location.href = `/r/${data.show.id}`);

    const trackName = document.createElement('div');
    trackName.classList.add('track-name');
    trackName.style.fontSize = '1.7em';
    trackName.textContent = data.show.name;

    const artistname = document.createElement('div');
    artistname.classList.add('artist-name');
    artistname.style.fontSize = '1em';
    artistname.textContent = data.show.publisher;

    const artistimg = document.createElement('img');
    artistimg.classList.add('album-img');
    artistimg.src = data.show.images?.[0].url;
    artistimg.alt = `${data.show.name} Image`;

    item.appendChild(artistimg);
    item.appendChild(trackName);
    item.appendChild(artistname);

    albumsTab.appendChild(item);
    tabsContainer.appendChild(albumsTab);
}

async function createDescriptionTab(data) {
    const artistTab = document.createElement('div');
    artistTab.id = 'description';
    artistTab.classList.add('tab-content');
    artistTab.innerHTML = `<h3>Episode description</h3> <p>${data.description}</p>
    <h3>Episode html_description</h3>${data.html_description}`;

    tabsContainer.appendChild(artistTab);
}

////////////////////////////////////////////////////////////////////// SHOWS //////////////////////////////////////////////////////////////////////

async function populateShowPage(data) {
    pagename = `${data.name} | SpotDB`;
    document.title = pagename;

    const albumContainer = document.createElement('div');

    const buttonRow = document.createElement('div');
    buttonRow.classList.add('button-row');

    const visitSpotifyButton = document.createElement('button');
    visitSpotifyButton.id = 'visit-spotify';
    visitSpotifyButton.classList.add('button');
    visitSpotifyButton.innerHTML = '<i style="margin-right: 5px" class="fas fa-external-link-alt"></i> Open Spotify URL';

    const openSpotifyButton = document.createElement('button');
    openSpotifyButton.id = 'open-spotify';
    openSpotifyButton.classList.add('button');
    openSpotifyButton.classList.add('openinspotify');
    openSpotifyButton.innerHTML = '<i style="margin-right: 5px" class="fab fa-spotify"></i> Open in Spotify app';

    buttonRow.appendChild(visitSpotifyButton);
    buttonRow.appendChild(openSpotifyButton);

    const topSection = document.createElement('div');

    topSection.appendChild(buttonRow);

    visitSpotifyButton.addEventListener('click', function() {
        window.open(data.external_urls.spotify, '_blank');
    });

    openSpotifyButton.addEventListener('click', function() {
        window.location.href = data.uri;
    });

    topSection.classList.add('top-section');

    const ts = document.createElement('div');
    ts.classList.add('ts');

    albumContainer.classList.add('album-row');
    albumContainer.innerHTML = `
        <img src="${data.images?.[0]?.url || '/default-album-cover.png'}" class="img" alt="Album Cover">
        <div class="album-details">
            <h3>${data.name}</h3>
            <p><b>Publisher:</b> ${data.publisher}</p>
        </div>
    `;

    const albumImage = albumContainer.querySelector('img');
    albumImage.addEventListener('click', () => handleImageClick(albumImage.src));

    ts.appendChild(albumContainer);
    topSection.appendChild(ts);
    contentContainer.prepend(topSection);

    let rating = 'Not defined';
    if (data.explicit) {
        rating = 'Explicit';
    } else {
        rating = 'Clean';
    }

    let exh = 'Not defined';
    if (data.is_externally_hosted) {
        exh = 'True';
    } else {
        exh = 'False';
    }

    let pl = 'Not defined';
    if (data.is_playable) {
        pl = 'True';
    } else {
        pl = 'False';
    }

    const table = document.createElement('table');
    table.classList.add('info-table');
    table.innerHTML = `
        <tr><td>Type</td><td>${data.type}</td></tr>
        <tr><td>ID</td><td>${id}</td></tr>
        <tr><td>Languages</td><td>${data.languages || 'Not defined'}</td></tr>
        <tr><td>Total episodes</td><td>${data.total_episodes || 'Not defined'}</td></tr>
        <tr><td>Rating</td><td>${rating || 'Not defined'}</td></tr>
        <tr><td>Publisher</td><td>${data.publisher || 'Not defined'}</td></tr>
        <tr><td>Is externally hosted?</td><td>${exh || 'Not defined'}</td></tr>
        <tr><td>Is playable?</td><td>${pl || 'Not defined'}</td></tr>
        <tr><td>Spotify URL</td><td><a href="${data.external_urls?.spotify || '#'}" target="_blank">${data.external_urls?.spotify ? 'Open link' : 'N/A'}</a></td></tr>
    `;
    contentContainer.querySelector('.top-section').appendChild(table);

    createEpisodesTab(data);
    createDescriptionTab(data);
    createRegionTab(data);
    createMediaTab(data);
    createEmbedTab(data, 'show');

    switchTab('episodes');
}

function createEpisodesTab(data) {
    const tracklistTab = document.createElement('div');
    tracklistTab.id = 'episodes';
    tracklistTab.classList.add('tab-content');
    tracklistTab.innerHTML = '<h3>Show episodes</h3>';

    const trackItem = document.createElement('div');
    trackItem.classList.add('track-item');

    trackItem.innerHTML = `<h3>Warning</h3>Spotify has a max of <b>50</b> items being fetched, so only the first 50 episodes are being displayed! Thanks for understanding :)`;
    tracklistTab.appendChild(trackItem);


    if (data.episodes.items.length) {
        data.episodes.items.forEach(ep => {
            const trackItem = document.createElement('div');
            trackItem.classList.add('track-item');

            const trackName = document.createElement('div');
            trackName.classList.add('track-name');
            trackName.textContent = ep.name;

            const trackDuration = document.createElement('div');
            trackDuration.classList.add('track-duration');
            trackDuration.textContent = ep.description;

            trackItem.appendChild(trackName);
            trackItem.appendChild(trackDuration);

            trackItem.addEventListener('click', () => {
                window.location.href = `/r/${ep.id}`;
            });

            tracklistTab.appendChild(trackItem);
        });
    } else {
        tracklistTab.innerHTML += '<p>No tracklist available.</p>';
    }

    tabsContainer.appendChild(tracklistTab);
}

////////////////////////////////////////////////////////////////////// ELSE //////////////////////////////////////////////////////////////////////

async function fetchCredits(trackName, artistName) {
    try {
        const response = await fetch(`/api/get/credits?track=${encodeURIComponent(trackName)}&artist=${encodeURIComponent(artistName)}`);
        const data = await response.json();
  
        if (data.error) {
            console.log('Failed to fetch credits');
            return null;
        }

        return {
            producers: data.producers || [],
            songwriters: data.songwriters || []
        };

    } catch (error) {
        console.error("Error fetching credits:", error);
        return null;
    }
}

async function fetchLyrics(trackName, artistName) {
    try {
        const response = await fetch(`/api/get/lyrics?trackName=${encodeURIComponent(trackName)}&artistName=${encodeURIComponent(artistName)}`);

        if (!response.ok) {
            throw new Error('Failed to fetch lyrics');
        }

        const data = await response.json();
        if (data.lyrics) {
            return {
                lyrics: data.lyrics.replace(/[\r\n]+/g, '<br>')
            };
        } else {
            throw new Error('No lyrics found');
        }
    } catch (error) {
        console.error('Error fetching lyrics:', error);
        return {
            success: false,
            message: 'No lyrics available'
        };
    }
}

async function fetchGeniusLyrics(track, artist) {
    try {
        const response = await fetch(`/api/genius/lyrics?track=${encodeURIComponent(track)}&artist=${encodeURIComponent(artist)}`);
        const data = await response.text();

        if (data.error) {
            return null;
        }

        return data;
    } catch (error) {
        console.error("Error fetching lyrics:", error);
        return null;
    }
}

function addSection(title, content) {
    const section = document.createElement('div');
    section.classList.add('section');
    section.innerHTML = `<h3>${title}</h3><p>${content}</p>`;
    contentContainer.appendChild(section);
}

async function fetchArtistDetails(artistId) {
    try {
        const response = await fetch(`/api/get/artist/${artistId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch artist details');
        }

        const artistData = await response.json();
        return artistData;
    } catch (error) {
        console.error('Error fetching artist details:', error);
        return {
            name: 'Unknown Artist',
            image: '/default-artist-icon.png'
        };
    }
}

async function fetchUserPlaylists(userId) {
    try {
        const response = await fetch(`/api/get/user-playlists/${userId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch user playlists');
        }

        const userData = await response.json();
        return userData;
    } catch (error) {
        console.error('Error fetching user playlists:', error);
        return;
    }
}

async function fetchUserDetails(userId) {
    try {
        const response = await fetch(`/api/get/user/${userId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch user details');
        }

        const userData = await response.json();
        return userData;
    } catch (error) {
        console.error('Error fetching user details:', error);
        return {
            name: 'Unknown user',
            image: '/default-artist-icon.png'
        };
    }
}

async function fetchTrackDetails(artistId) {
    try {
        const response = await fetch(`/api/get/track/${artistId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch track details');
        }

        const trackData = await response.json();
        return trackData;
    } catch (error) {
        console.error('Error fetching track details:', error);
        return;
    }
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


fetchData();


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const navSearchInput = document.getElementById('nav-search-input');
navSearchInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        window.location.href = `/q?=${encodeURIComponent(navSearchInput.value)}`;
    }
});

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