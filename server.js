const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const fs = require('fs');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';

const SPOTIFY_API_URL = 'https://api.spotify.com/v1';
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3000/auth/callback';

let accessToken = '';
let you_accesstoken = '';

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

app.get('/you', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'you', 'you.html'));
});

app.get('/r', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'release', 'index.html'));
});

app.get('/r/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'release', 'index.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

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

app.get('/auth/login', (req, res) => {
    const scope = 'user-read-private user-read-email user-top-read user-follow-read user-follow-modify playlist-modify-public playlist-modify-private';
    res.redirect(SPOTIFY_AUTH_URL + 
        '?response_type=code' +
        '&client_id=' + CLIENT_ID +
        '&scope=' + encodeURIComponent(scope) +
        '&redirect_uri=' + encodeURIComponent(REDIRECT_URI));
});

app.get('/auth/callback', async (req, res) => {
    const code = req.query.code || null;

    try {
        const response = await fetch(SPOTIFY_TOKEN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')
            },
            body: new URLSearchParams({
                code: code,
                redirect_uri: REDIRECT_URI,
                grant_type: 'authorization_code'
            })
        });

        const data = await response.json();
        
        you_accesstoken = data.access_token;

        res.redirect('/you');
    } catch (error) {
        res.redirect('/lmfao');
    }
});

app.get('/api/me', async (req, res) => {
    const token = you_accesstoken;
    
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const response = await fetch('https://api.spotify.com/v1/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(401).json({ error: 'Failed to fetch user data' });
    }
});

app.get('/api/me/followed', async (req, res) => {
    const token = you_accesstoken;
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);
    
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const response = await fetch(`https://api.spotify.com/v1/me/following?type=artist&limit=${limit}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(401).json({ error: 'Failed to fetch user followed artists' });
    }
});

app.get('/api/me/top-artists', async (req, res) => {
    const token = you_accesstoken;
    const timeRange = req.query.time_range || 'medium_term';
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);
    
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const response = await fetch(`https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}&limit=${limit}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(401).json({ error: 'Failed to fetch user top artists' });
    }
});

app.get('/api/me/top-tracks', async (req, res) => {
    const token = you_accesstoken;
    const timeRange = req.query.time_range || 'medium_term';
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);
    
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const response = await fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=${limit}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(401).json({ error: 'Failed to fetch user top tracks' });
    }
});

app.get('/api/me/following', async (req, res) => {
    const token = you_accesstoken;
    
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const response = await fetch('https://api.spotify.com/v1/me/following?type=artist&limit=50', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(401).json({ error: 'Failed to fetch followed artists' });
    }
});

app.put('/api/follow/:type/:id', async (req, res) => {
    const token = you_accesstoken;
    const { type, id } = req.params;
    
    if (!token) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        const endpoint = `https://api.spotify.com/v1/me/following?type=${type === 'artist' ? 'artist' : 'user'}&ids=${id}`;
        const response = await fetch(endpoint, {
            method: 'PUT',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) throw new Error('Failed to follow');
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ error: 'Failed to follow' });
    }
});

app.delete('/api/follow/:type/:id', async (req, res) => {
    const token = you_accesstoken;
    const { type, id } = req.params;
    
    if (!token) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        const endpoint = `https://api.spotify.com/v1/me/following?type=${type === 'artist' ? 'artist' : 'user'}&ids=${id}`;
        const response = await fetch(endpoint, {
            method: 'DELETE',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) throw new Error('Failed to unfollow');
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ error: 'Failed to unfollow' });
    }
});

app.get('/api/me/following/:type/:id', async (req, res) => {
    const token = you_accesstoken;
    const { type, id } = req.params;
    
    if (!token) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        const endpoint = `https://api.spotify.com/v1/me/following/contains?type=${type === 'artist' ? 'artist' : 'user'}&ids=${id}`;
        const response = await fetch(endpoint, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: 'Failed to check following status' });
    }
});

app.put('/api/follow/playlist/:id', async (req, res) => {
    const token = you_accesstoken;
    const { id } = req.params;
    
    if (!token) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        const endpoint = `https://api.spotify.com/v1/playlists/${id}/followers`;
        const response = await fetch(endpoint, {
            method: 'PUT',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) throw new Error('Failed to follow playlist');
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ error: 'Failed to follow playlist' });
    }
});

app.delete('/api/follow/playlist/:id', async (req, res) => {
    const token = you_accesstoken;
    const { id } = req.params;
    
    if (!token) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        const endpoint = `https://api.spotify.com/v1/playlists/${id}/followers`;
        const response = await fetch(endpoint, {
            method: 'DELETE',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) throw new Error('Failed to unfollow playlist');
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ error: 'Failed to unfollow playlist' });
    }
});

app.get('/api/follow/playlist/:id/status', async (req, res) => {
    const token = you_accesstoken;
    const { id } = req.params;
    
    if (!token) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        const endpoint = `https://api.spotify.com/v1/playlists/${id}/followers/contains`;
        const response = await fetch(endpoint, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await response.json();

        res.json(data);
    } catch (error) {
        res.status(400).json({ error: 'Failed to check playlist following status' });
    }
});

app.get('/api/browse/new-releases', async (req, res) => {
    if (!accessToken) {
        await getAccessToken();
    }
    try {
        const response = await fetch('https://api.spotify.com/v1/browse/new-releases?limit=6', {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch new releases' });
    }
});

app.post('/api/signout', (req, res) => {
    you_accesstoken = '';
    res.json({ success: true });
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
