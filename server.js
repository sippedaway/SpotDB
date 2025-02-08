const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const fs = require('fs');
const axios = require('axios');
const { JSDOM } = require('jsdom');

const app = express();
const port = process.env.PORT || 3000;

const SPOTIFY_API_URL = 'https://api.spotify.com/v1';
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3000/callback';

const GENIUS_API_URL = "https://api.genius.com";
const GENIUS_ACCESS_TOKEN = process.env.GENIUS_ACCESS_TOKEN;

let accessToken = '';

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home', 'home.html'));
});

app.get('/users', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'users', 'users.html'));
});

app.get('/faq', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'faq', 'faq.html'));
});

app.get('/q', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home', 'home.html'));
});

app.get('/r', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'release', 'index.html'));
});

app.get('/r/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'release', 'index.html'));
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/spotdb', express.static(path.join(__dirname, 'public', 'spotdb));

async function getAccessToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
    });

    const data = await response.json();
    accessToken = data.access_token;
}

app.get("/api/genius/lyrics", async (req, res) => {
    const { track, artist } = req.query;

    if (!track || !artist) {
        return res.status(400).json({ error: "Track and artist are required" });
    }

    try {
        const searchUrl = `${GENIUS_API_URL}/search?q=${encodeURIComponent(track + " " + artist)}`;
        const searchResponse = await axios.get(searchUrl, {
            headers: { Authorization: `Bearer ${GENIUS_ACCESS_TOKEN}` },
        });

        if (!searchResponse.data.response.hits.length) {
            return res.status(404).json({ error: "Lyrics not found" });
        }

        const song = searchResponse.data.response.hits[0].result;
        const lyricsUrl = song.url;

        const lyricsPage = await axios.get(lyricsUrl);
        const dom = new JSDOM(lyricsPage.data);
        const lyricsElements = dom.window.document.querySelectorAll("[data-lyrics-container]");

        if (!lyricsElements.length) {
            return res.status(404).json({ error: "Lyrics not found on the page" });
        }

        const lyrics = Array.from(lyricsElements)
            .map(el => {
                let html = el.innerHTML;
                html = html.replace(/<br\s*\/?>/gi, "\n");
                html = html.replace(/<[^>]+>/g, "");
                return html.trim();
            })
            .join("\n");

        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.send(lyrics);

    } catch (error) {
        console.error("Error fetching lyrics:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get('/api/get/related-artists/:artistid', async (req, res) => {
    try {
        const artistId = req.params.artistid;

        const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/related-artists`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        if (!response.ok) throw new Error('Failed to fetch related artists');

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching related artists:', error);
        res.status(500).json({ error: 'Failed to retrieve related artists' });
    }
});

app.get('/api/get/track/:id', async (req, res) => {
    const artistId = req.params.id;

    try {
        const response = await fetch(`https://api.spotify.com/v1/tracks/${artistId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch track details');
        }

        const trackData = await response.json();

        res.json(trackData);

    } catch (error) {
        console.error('Error fetching track details:', error);
        res.status(500).json({ error: 'Failed to fetch track details' });
    }
});

app.get('/api/get/user-playlists/:id', async (req, res) => {
    const { id } = req.params;

    if (!accessToken) {
        await getAccessToken();
    }

    try {
        const response = await fetch(`${SPOTIFY_API_URL}/users/${id}/playlists`, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });

        if (response.ok) {
            const data = await response.json();
            return res.json(data);
        }

        return res.status(404).json({ error: 'User playlists not found' });
    } catch (error) {
        console.error('Error fetching User playlists from Spotify:', error);
        res.status(500).json({ error: 'Failed to fetch User playlists' });
    }
});

app.get('/api/get/artist/albums/:id', async (req, res) => {
    const { id } = req.params;

    if (!accessToken) {
        await getAccessToken();
    }

    try {
        const response = await fetch(`${SPOTIFY_API_URL}/artists/${id}/albums?include_groups=album,single&limit=50`, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });

        if (response.ok) {
            const data = await response.json();
            return res.json(data);
        }

        return res.status(404).json({ error: 'Artist albums not found' });
    } catch (error) {
        console.error('Error fetching artist albums from Spotify:', error);
        res.status(500).json({ error: 'Failed to fetch artist albums' });
    }
});

app.get('/api/get/artist/:id', async (req, res) => {
    const artistId = req.params.id;

    try {
        const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch artist details');
        }

        const artistData = await response.json();

        res.json({
            name: artistData.name,
            image: artistData.images?.[0]?.url || '/default-artist-icon.png',
            genres: artistData.genres || [],
            followers: artistData.followers?.total || 0,
            popularity: artistData.popularity || 0
        });

    } catch (error) {
        console.error('Error fetching artist details:', error);
        res.status(500).json({ error: 'Failed to fetch artist details' });
    }
});

app.get('/api/get/user/:id', async (req, res) => {
    const artistId = req.params.id;

    try {
        const response = await fetch(`https://api.spotify.com/v1/users/${artistId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user details');
        }

        const artistData = await response.json();

        res.json({
            name: artistData.display_name,
            image: artistData.images?.[0]?.url || '/default-artist-icon.png',
            followers: artistData.followers?.total || 0,
            id: artistData.id || 0,
            type: artistData.type
        });

    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ error: 'Failed to fetch user details' });
    }
});

app.get("/api/get/credits", async (req, res) => {
    const { track, artist } = req.query;
  
    if (!track || !artist) {
      return res.status(400).json({ error: "Track and artist are required" });
    }
  
    try {
      const searchUrl = `${GENIUS_API_URL}/search?q=${encodeURIComponent(track + " " + artist)}`;
      const searchResponse = await axios.get(searchUrl, {
        headers: { Authorization: `Bearer ${GENIUS_ACCESS_TOKEN}` },
      });
  
      if (!searchResponse.data.response.hits.length) {
        return res.status(404).json({ error: "Credits not found" });
      }
  
      const song = searchResponse.data.response.hits[0].result;
      const songId = song.id;
  
      const songUrl = `${GENIUS_API_URL}/songs/${songId}`;
      const songResponse = await axios.get(songUrl, {
        headers: { Authorization: `Bearer ${GENIUS_ACCESS_TOKEN}` },
      });
  
      const songDetails = songResponse.data.response.song;
  
      const credits = {
        songwriters: songDetails.writer_artists?.map(artist => artist.name) || [],
        producers: songDetails.producer_artists?.map(artist => artist.name) || [],
      };
  
      res.json(credits);
    } catch (error) {
      console.error("Error fetching credits:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

app.get('/api/get/:id', async (req, res) => {
    const { id } = req.params;

    if (!accessToken) {
        await getAccessToken();
    }

    try {
        const endpoints = ['tracks', 'albums', 'artists', 'playlists', 'users', 'episodes', 'shows'];

        for (const type of endpoints) {
            const response = await fetch(`${SPOTIFY_API_URL}/${type}/${id}`, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });

            if (response.status === 429) {
                const retryAfter = response.headers.get('Retry-After');
                return res.status(429).json({ error: 'Rate limited', retryAfter });
            }

            if (response.ok) {
                const data = await response.json();
                return res.json(data);
            }
        }

        return res.status(404).json({ error: 'ID not found or invalid' });
    } catch (error) {
        console.error('Error fetching detailed info from Spotify:', error);
        res.status(500).json({ error: 'Failed to fetch detailed data' });
    }
});

//////////////////////////////////////////////// ADVANCED SEARCH ////////////////////////////////////////////////

app.get('/api/search/advanced', async (req, res) => { 
    const query = req.query.q;
    const market = req.query.market || 'US'; 
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);

    if (!query) {
        return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    if (!accessToken) {
        await getAccessToken();
    }

    try {
        const response = await fetch(`${SPOTIFY_API_URL}/search?q=${encodeURIComponent(query)}&type=track,album,artist,playlist,episode,show&limit=${limit}&market=${market}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const data = await response.json();

        if (data.error) {
            return res.status(data.error.status).json({ error: data.error.message });
        }

        const albums = data.albums ? data.albums.items.map(item => ({
            id: item.id,
            name: item.name,
            cover: item.images[0]?.url || '/default-cover.png',
            artists: item.artists.map(artist => artist.name),
            type: 'album'
        })) : [];

        const artists = data.artists ? data.artists.items.map(item => ({
            id: item.id,
            name: item.name,
            icon: item.images[0]?.url || '/default-icon.png',
            type: 'artist'
        })) : [];

        const tracks = data.tracks ? data.tracks.items.map(item => ({
            id: item.id,
            name: item.name,
            explicit: item.explicit,
            cover: item.album.images[0]?.url || '/default-cover.png',
            artists: item.artists.map(artist => artist.name),
            type: 'track'
        })) : [];

        const playlists = data.playlists ? data.playlists.items
            .filter(item => item !== null)
            .map(item => ({
                id: item.id,
                name: item.name,
                cover: item.images?.[0].url || '/default-cover.png',
                type: 'playlist'
        })) : [];

        const episodes = data.episodes ? data.episodes.items
            .filter(item => item !== null)
            .map(item => ({
                id: item.id,
                name: item.name,
                cover: item.images?.[0].url || '/default-cover.png',
                type: 'episode'
        })) : [];

        const shows = data.shows ? data.shows.items
            .filter(item => item !== null)
            .map(item => ({
                id: item.id,
                name: item.name,
                cover: item.images?.[0].url || '/default-cover.png',
                type: 'show'
        })) : [];

        res.json({ albums, artists, tracks, playlists, episodes, shows });
    } catch (error) {
        console.error('Error during Spotify search request:', error);
        res.status(500).json({ error: 'Failed to fetch search results' });
    }
});


module.exports = app;

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
