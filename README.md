![db.sipped.org header](https://raw.githubusercontent.com/sippedaway/SpotDB/refs/heads/main/github/SpotDB.png)

[![HTML](https://img.shields.io/badge/HTML-%23E34F26.svg?logo=html5&logoColor=white)](#)
[![CSS](https://img.shields.io/badge/CSS-1572B6?logo=css3&logoColor=fff)](#)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000)](#)
[![NodeJS](https://img.shields.io/badge/Node.js-6DA55F?logo=node.js&logoColor=white)](#)
[![Express.js](https://img.shields.io/badge/Express.js-%23404d59.svg?logo=express&logoColor=%2361DAFB)](#)
[![GitHub created at](https://img.shields.io/github/created-at/sippedaway/SpotDB)](#)
[![GitHub last commit](https://img.shields.io/github/last-commit/sippedaway/SpotDB)](#)


[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/K3K31AMKAQ)

# [SpotDB](https://db.sipped.org/)
SpotDB is a platform that lets you search for Spotify albums, tracks, artists, playlists ([and more](#As-much-information-as-you-probably-need), and gather detailed information about what you searched for. SpotDB is a completely open-source platform that uses the official Spotify [WebAPI](https://developer.spotify.com/documentation/web-api/), as well as additional [third-party APIs](#API) to gather information like track lyrics, writers and more.

[<kbd> <br> db.sipped.org <br> </kbd>](https://db.sipped.org)

## Search and get what you want
The Search that is quickly available through the Home page gathers <b>tracks, albums, singles, EPs, artists, playlists, episodes and shows</b> (with the exception of users) using the Spotify [Search](https://developer.spotify.com/documentation/web-api/reference/search) WebAPI. Use filters to get exactly what you want.

## Read our documentation + frequently asked questions
[<kbd> <br> Click here for a detailed overview of SpotDB and questions <br> </kbd>](https://db.sipped.org/faq)

## API
SpotDB uses **APIs** to gather information for what you're looking for. Here's all APIs that we (currently) use!
- Official Spotify WebAPI ([here](https://developer.spotify.com/documentation/web-api/)) for all data
- Genius API ([here](https://docs.genius.com)) for track lyrics, songwriting and producer credits

However, Spotify's API is still kinda limited. For instance, **user profiles can't be searched**. SpotDB supports fetching user's **public** profile/data anyway, and we plan to do so, however the search bars will not find you user profiles. To get a user's profile, you'll need to go to db.sipped.org/**r/{a user ID}**. The User ID can be found by going on Spotify, finding the profile and copying the ID from the URL or by clicking Share. The unavailability might soon change, as we're working on a permanent solution.

## As much information as you probably need
The information you find depends on what you look for, so here's a detailed overview, that may change very soon

A. Shared information, found everywhere
- Name, Spotify URL, Spotify Mobile/PC App URI, type, ID
- Media, images in various sizes fetched from Spotify's [API](#API)

B. Artist:
- Genres
- Popularity score
- Followers
- Discography, Albums, Singles & EPs

C. Release:
Includes **albums, singles, EPs...**
- Genres, release date, label, copyrights
- Artists
- Tracklist
- Lyrics (if the release is a Single / lyrics are shared)
- Regions / markets
- External IDs (usually include ISBN / UPC IDs)

D. Track:
- Duration
- Credits
- Popularity score
- Rating (clean/explicit)
- Release date
- Artists
- Album/release the track is found on
- Lyrics
- Regions
- External IDs
- More by artist (artist recent discography)

E. User-made playlist:
- Followers
- Primary color
- Public?
- Collaborative?
- Playlist tracklist
- Creator

F. Show:
- Publisher
- Language(s)
- Total episodes + episodes list
- Rating (clean/explicit)
- Is externally hosted?
- Is playable?
- Description (description + html_description variables)
- Regions

G. Episode:
- Language
- Rating (clean/explicit)
- Release date
- Duration
- Is externally hosted?
- Is playable?
- Show the episode is found on
- Description (description + html_description variables)

And probably more I missed...

## Version
#### 1.1
- **Release date**: 2025-03-12
- **Added:**
- Basic SEO for all pages
- Default dark theme
- Notes, minor UI issues
- **Fixed:**
- FAQ page navbar SpotDB logo not loading
- ~~Lyrics fetching on tracks and singles~~
#### 1.0
- **Release date**: 2025-02-08
- Hosted on Vercel

## Legal
SpotDB is a passion/hobby project made by [me, sipped,](https://github.com/sippedaway) and is **NOT affiliated with Spotify** in any way whatsoever.
Dear Spotify, if you want us to change the name of SpotDB, please contact me @ hello@sipped.org :)

## Contact me
An email for - feedback, found bugs/issues, questions, recommendations, help, and more - hello@sipped.org
Alternatively, leave a GitHub issue. Thanks! :)

## Credits
- [sipped](https://github.com/sippedaway)

Support me and get early access to SpotDB (and all my other projects) updates, changes and early looks __for as low as $3__: https://ko-fi.com/sipped
