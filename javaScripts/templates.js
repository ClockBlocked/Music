// Templates Module - HTML template generation functions
// All template rendering functions using object literal format
// Copied from utilities/templates.js with updated imports

import { getAlbumImageUrl, getArtistImageUrl, getTotalSongs } from './helpers.js';

// Note: escapeForAttribute will be available from misc.js once created
// For now, define it here temporarily
function escapeForAttribute(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}




export const render = {
  artist: function(templateName, data) {
    switch(templateName) {
      case "PopOvers":
        const artistName = data.artist;
        const artistId = data.id || '';
        const artistImage = getArtistImageUrl(artistName);
        const totalAlbums = data.albums?.length || 0;
        const totalSongs = getTotalSongs(data) || 0;

        return `
<div class="similar-artist-card" data-artist-name="${artistName}">
  <div class="similar-artist-image">
    <img 
      src="${artistImage}" 
      alt="${artistName}" 
      class="w-full h-full object-cover artist-avatar"
    />
    <div class="artist-image-overlay"></div>
  </div>
  
  <div class="similar-artist-name">
    ${artistName}
  </div>
  
  <div class="artist-popover">
    <div class="popover-header">
      <div class="popover-artist-name">${artistName}</div>
    </div>
    
    <div class="popover-stats">
      <div class="stat-item">
        <span class="stat-value">${totalAlbums}</span>
        <span class="stat-label">Albums</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">${totalSongs}</span>
        <span class="stat-label">Songs</span>
      </div>
    </div>
    
    <div class="popover-footer">
      <button aria-label="Name" class="popover-button" data-artist-id="${artistId}">
        View Artist
      </button>
    </div>
  </div>
</div>`;
      
      case "card":
        return `
          <div class="artist-card rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 cursor-pointer hover:shadow-lg transition-all hover:bg-white/10" data-artist-id="${data.id}">
            <div class="text-center">
              <div class="artist-avatar w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
                <img src="${data.cover}" alt="${data.artist}" class="w-full h-full object-cover">
              </div>
              <h3 class="text-lg font-bold mb-2 text-white">${data.artist}</h3>
              <div class="genre-tag inline-block px-3 py-1 bg-blue-600/30 rounded-full text-xs font-medium mb-3 text-blue-200">${data.genre}</div>
              <p class="text-sm opacity-70 text-gray-300">${data.albumCount} album${data.albumCount !== 1 ? 's' : ''}</p>
            </div>
          </div>
        `;
      
      case "header":
        return `
          <div class="artist-header" id="artist-header">
            <div class="content-wrapper">
              <div class="artist-avatar">
                <img src="${data.cover}" alt="${data.artist}">
              </div>
              <div class="artist-info">
                <h1>${data.artist}</h1>
                <div class="metadata-tags">
                  <span>${data.genre}</span>
                  <span>${data.albumCount} Albums</span>
                  <span>${data.songCount} Songs</span>
                </div>
                <div class="action-buttons">
                  <button aria-label="Name" class="play">Play All</button>
                  <button aria-label="Name" class="follow"
                          data-favorite-artists="${data.songData.id}">Favorite</button>
                </div>
              </div>
            </div>
          </div>
        `;
      
case "enhancedArtist":
  return `
<div class="artistPage">
  <section class="fragments artist-hero">
    <div class="artist-hero-bg"></div>
    <div class="artist-hero-image">
      <img id="artistBgImage" src="${data.cover}" alt="${data.artist}" />
    </div>
    
    <div class="artist-hero-content">
      <div class="artist-hero-flex">
        <!-- Artist Avatar -->
        <div class="artist-avatar-group">
          <div class="artist-avatar-container">
            <img id="artistAvatar" alt="${data.artist}" src="${data.cover}" />
          </div>
          <div class="artist-avatar-overlay">
            <button id="artistPlay" class="artist-play-btn">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
              </svg>
              Play All
            </button>
          </div>
        </div>

        <!-- Artist Info -->
        <div class="artist-info-section">
          <div class="artist-badge">
            <span class="artist-badge-dot"></span>
            Artist
          </div>
          <h1 id="artistName" class="artist-title">
            ${data.artist}
          </h1>
          <p id="artistTagline" class="artist-genre">${data.genre || 'Various Genres'}</p>
          
          <!-- Stats Row -->
          <div class="artist-stats-row">
            <div class="artist-stat">
              <div id="artistAlbums" class="artist-stat-value">${data.albumCount}</div>
              <div class="artist-stat-label">Albums</div>
            </div>
            <div class="artist-stat-divider"></div>
            <div class="artist-stat">
              <div id="artistTracks" class="artist-stat-value">${data.songCount}</div>
              <div class="artist-stat-label">Tracks</div>
            </div>
            <div class="artist-stat-divider"></div>
            <div class="artist-stat">
              <div class="artist-stat-value">★</div>
              <div class="artist-stat-label">Featured</div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="artist-actions">
            <button id="artistShuffle" class="artist-action-btn">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 4a2 2 0 00-2 2v6H0l4 4 4-4H5V6h3l1-2H5zM15 4h-3l-1 2h3v6h-3l-1 2h4a2 2 0 002-2V6a2 2 0 00-2-2z"/>
              </svg>
              Shuffle
            </button>
            <button id="artistFollow" class="artist-action-btn">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
              Follow
            </button>
            <button class="artist-action-icon">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Main Content -->
  <div class="fragments artist-content">
    
    <!-- Quick Stats Grid -->
    <div class="artist-quick-stats">
      <div class="artist-stat-card stat-blue">
        <div class="stat-card-content">
          <div>
            <div class="stat-card-label">Total Duration</div>
            <div class="stat-card-value" id="totalDuration">Calculating...</div>
          </div>
          <div class="stat-card-icon stat-icon-blue">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="artist-stat-card stat-purple">
        <div class="stat-card-content">
          <div>
            <div class="stat-card-label">Latest Release</div>
            <div class="stat-card-value" id="latestYear">2024</div>
          </div>
          <div class="stat-card-icon stat-icon-purple">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
              <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="artist-stat-card stat-pink">
        <div class="stat-card-content">
          <div>
            <div class="stat-card-label">Popularity</div>
            <div class="stat-card-value">Rising ↗</div>
          </div>
          <div class="stat-card-icon stat-icon-pink">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Albums Section -->
    <section class="fragments albums">
      <div id="${IDS.albumsContainer}"></div>
    </section>
  </div>

  <section class="fragments similar">
    <div class="similar-rows" id="similarRows">
      <div class="names-row left" data-speed="138" data-gap="40"></div>
      <div class="names-row right" data-speed="178" data-gap="40"></div>
      <div class="names-row left" data-speed="119" data-gap="40"></div>
    </div>
  </section>
</div>
`;        
      default:
        return "";
    }
  },
  
  album: function(templateName, data) {
    switch (templateName) {
      case "card":
        return `
          <div class="album-card">
            <div class="albumFade" data-album-id="${data.albumId}">
              <div class="gap-6 items-center md:items-start">
                <div class="album-image relative flex-shrink-0">
                  <img src="${data.cover}" alt="${data.album}" class="album-cover w-full h-full object-cover">
                  <button aria-label="Name" class="play-album absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-700 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition transform hover:scale-105">
                    <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                    </svg>
                  </button>
          <div class="albumMetadata">
                  <h3 class="metaAlbumName">${data.album}</h3>
                  <p class="metaAlbumYear">${data.year || 'Unknown year'} • ${data.songCount} Tracks</p>
                </div>
      
                </div>
              </div>
            
            <div class="songs-container" id="songs-container-${data.albumId}"></div>
          </div></div>
        `;
      
      case "singleAlbumCard":
        return `
          <div class="album-card p-0 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/5">
            <div class="albumFade" data-album-id="${data.albumId}">
              <div class="gap-6 items-center md:items-start">
                <div class="album-image relative flex-shrink-0">
                  <button aria-label="Name" class="play-album absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-700 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition transform hover:scale-105">
                    <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  <h3 class="text-2xl font-bold mb-2 text-white">${data.album}</h3>
                  <p class="text-sm opacity-70 mb-4 text-gray-300">${data.year || 'Unknown year'} • ${data.songCount} Tracks</p>
                </div>
              </div>
            </div>
            <div class="songs-container" id="songs-container-${data.albumId}"></div>
          </div>
        `;

      case "section":
        return `
          <div class="albumSongListArea">
            <div class="album-buttons">
              <div class="album-selector">
                ${data.albums.map((album, index) => `
                  <button class="album-tab px-4 py-2 rounded-lg transition-all duration-300 ${index === 0 ? "active bg-accent-primary text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}" 
                          data-album-index="${index}" 
                          data-album-name="${album.album}">
                    <div class="flex items-center gap-2">
                      <span class="album-tab-title">${album.album}</span>
                      <span class="album-tab-year text-xs opacity-75">${album.year || ""}</span>
                    </div>
                  </button>
                `).join("")}
              </div>
            </div>
            <div class="current-album-container">
              <div id="current-album-display" class="transition-all duration-500 ease-in-out"></div>
            </div>
          </div>
        `;
        
      default:
        return "";
    }
  },
  
  songItem: function(data) {
    const { 
      trackNumber, 
      title, 
      artist, 
      duration, 
      songData, 
      context = 'base',
      isFavorite = false,
      showTrackNumber = true,
      showArtist = false,
      albumCover = null
    } = data;
    
    return `
  <div class="song-item"
       data-song="${escapeForAttribute(JSON.stringify(songData))}"
       data-context="${context}"
       role="button"
       tabindex="0"
       aria-label="Track ${trackNumber}: ${title} — ${duration}">

    <!-- 1) LEFT: Track # (replaced by Play on hover) -->
    <div class="cell index-play" aria-hidden="false">
      <span class="track-number">
        ${showTrackNumber ? trackNumber : '♪'}
      </span>

      <button aria-label="Name" class="play-button"
              data-action="play"
              title="Play"
              aria-label="Play ${title}"
              tabindex="-1">
        <!-- Play Icon -->
        <svg class="global lightGray small" viewBox="0 0 384 512" aria-hidden="true">
          <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/>
        </svg>
      </button>
    </div>

    <!-- 2) Song Name -->
    <div class="cell title" title="${title}">
      <span class="song-title">${title}</span>
    </div>

    <!-- 3) Duration -->
    <div class="cell duration" aria-label="Duration ${duration}">
      <span>${duration}</span>
    </div>

    <!-- 4) Heart -->
    <div class="cell heart">
      <button aria-label="Name" class="action-btn favorite-btn ${isFavorite ? 'favorited' : ''}"
              data-action="favorite"
              data-song-id="${songData.id}"
              data-favorite-songs="${data.songData.id}"
              title="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}"
              aria-pressed="${isFavorite ? 'true' : 'false'}"
              aria-label="Toggle favorite for ${title}">
        <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
             style="fill: ${isFavorite ? '#ef4444' : 'none'};" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
        </svg>
      </button>
    </div>

    <!-- 5) More (three dots) -->
    <div class="cell more">
      <button aria-label="Name" class="action-btn more-btn"
              data-action="more"
              title="More options"
              aria-label="More options for ${title}">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 8a2 2 0 1 0-2-2 2 2 0 0 0 2 2zm0 2a2 2 0 1 0 2 2 2 2 0 0 0-2-2zm0 6a2 2 0 1 0 2 2 2 2 0 0 0-2-2z"/>
        </svg>
      </button>
    </div>
  </div>

    `;
  },
  
  track: function(templateName, data) {
    switch (templateName) {
      case "row":
      case "songItem":
        return render.songItem({
          trackNumber: data.trackNumber,
          title: data.title,
          artist: data.songData?.artist,
          duration: data.duration,
          songData: data.songData,
          context: data.actionSet || 'base',
          isFavorite: data.isFavorite || false,
          showTrackNumber: true,
          showArtist: false
        });
        
      case "nowPlaying":
        return `
          <div class="now-playing-card bg-white/5 rounded-lg p-4 backdrop-blur-sm">
            <div class="flex items-center gap-4">
              <div class="album-art flex-shrink-0">
                <img src="${data.songData.cover}" alt="${data.songData.album}" class="w-16 h-16 rounded-lg object-cover">
              </div>
              <div class="track-info flex-1 min-w-0">
                <h3 class="track-title font-semibold text-white truncate">${data.title}</h3>
                <p class="track-artist text-gray-400 text-sm truncate cursor-pointer hover:text-white transition-colors" data-artist="${data.songData.artist}">${data.songData.artist}</p>
                <p class="track-album text-gray-500 text-xs truncate">${data.songData.album}</p>
              </div>
            </div>
            <div class="progress-container mt-4">
              <div class="progress-bar w-full bg-gray-700 rounded-full h-2 mb-2">
                <div class="progress-fill bg-blue-500 h-2 rounded-full transition-all duration-300" style="width: ${data.progress || 0}%"></div>
              </div>
              <div class="time-display flex justify-between text-xs text-gray-400">
                <span class="current-time">${formatTime(data.currentTime || 0)}</span>
                <span class="duration">${formatTime(data.duration || 0)}</span>
              </div>
            </div>
          </div>
        `;
        
      default:
        return "";
    }
  },
  
  page: function(templateName, data) {
    switch (templateName) {
      case "home":
        return `
          <div class="text-center py-8 md:py-12">
            <h1 class="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Discover Amazing Music</h1>
            <p class="text-lg md:text-xl text-gray-400 mb-8 md:mb-12 max-w-2xl mx-auto">Explore artists, albums, and songs from your personal library with an immersive listening experience</p>
          </div>
          <h2 class="text-2xl md:text-3xl font-bold mb-6 md:mb-8 px-4 text-white">Featured Artists</h2>
          <div id="featured-artists" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 px-4"></div>
        `;
        
      case "allArtists":
        return `
          <div class="page-header px-4 sm:px-6 py-4">
            <div class="filter-controls mb-6 flex flex-wrap gap-4 items-center">
              <div class="search-wrapper relative flex-grow max-w-md">
                <input type="text" id="artist-search" 
                      class="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Search artists...">
                <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <div id="genre-filters" class="genre-filters flex flex-wrap gap-2"></div>
              <div class="view-toggle ml-auto">
                <button aria-label="Name" id="grid-view-btn" class="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                  </svg>
                </button>
                <button aria-label="Name" id="list-view-btn" class="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div id="artists-grid" class="artists-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-4 sm:px-6"></div>
        `;
      case "home_bento":
        return `
        <div class="bento-grid">
            <div class="bento-card" data-loader="true">
              <div class="card-header">
                <h2 class="card-title">Recently Played</h2>
                <a href="#" class="card-link" data-view="recent">View All</a>
              </div>
              <div id="${data.IDS.recentlyPlayedSection}" class="card-content">
                <div class="skeleton-loader"></div>
              </div>
            </div>
            
            <div class="bento-card bento-span-2" data-loader="true">
              <div class="card-header">
                <h2 class="card-title">Discover Albums</h2>
                <a href="#" class="card-link" data-view="albums">Explore More</a>
              </div>
              <div id="${data.IDS.randomAlbumsSection}" class="card-content">
                <div class="skeleton-loader"></div>
              </div>
            </div>
            
            <div class="bento-card" data-loader="true">
              <div class="card-header">
                <h2 class="card-title">Favorite Artists</h2>
                <a href="#" class="card-link" data-view="favorite-artists">View All</a>
              </div>
              <div id="${data.IDS.favoriteArtistsSection}" class="card-content">
                <div class="skeleton-loader"></div>
              </div>
            </div>
            
            <div class="bento-card" data-loader="true">
              <div class="card-header">
                <h2 class="card-title">Your Playlists</h2>
                <a href="#" class="card-link" data-view="playlists">View All</a>
              </div>
              <div id="${data.IDS.playlistsSection}" class="card-content">
                <div class="skeleton-loader"></div>
              </div>
            </div>
            
            <div class="bento-card" data-loader="true">
              <div class="card-header">
                <h2 class="card-title">Favorite Songs</h2>
                <a href="#" class="card-link" data-view="favorite-songs">View All</a>
              </div>
              <div id="${data.IDS.favoriteSongsSection}" class="card-content">
                <div class="skeleton-loader"></div>
              </div>
            </div>
          </div>
        `;
        
      default:
        return "";
    }
  },

homeSection: {
  recentlyPlayed: (tracks, utils) => {
    let html = `<div class="recent-tracks animate-fade-in">`;
    tracks.forEach((track, index) => {
      html += `
        <div class="modern-track-item" data-song='${JSON.stringify(track).replace(/"/g, "&quot;")}' style="animation-delay: ${index * 100}ms;">
          <div class="track-artwork-container">
            <img src="${utils.getAlbumImageUrl(track.album)}" alt="${track.title}" class="track-artwork">
            <div class="track-play-overlay">
              <button class="track-play-btn">
                ${window.ICONS.play}
              </button>
            </div>
          </div>
          <div class="track-content">
            <div class="track-main-info">
              <div class="track-title-text">${track.title}</div>
              <div class="track-artist-text" data-artist="${track.artist}">${track.artist}</div>
            </div>
            <div class="track-meta">
              <span class="track-duration">3:24</span>
            </div>
          </div>
          <div class="track-actions">
            <button class="track-action-btn track-favorite-btn" title="Add to favorites">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </button>
            <button class="track-action-btn track-more-btn" title="More options">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
            </button>
          </div>
        </div>
      `;
    });
    html += `</div>`;
    return html;
  },

  playlists: (playlists) => {
    let html = `<div class="playlists-list animate-fade-in">`;
    playlists.forEach((playlist, index) => {
      html += `
        <div class="modern-playlist-card" data-playlist-id="${playlist.id}" style="animation-delay: ${index * 100}ms;">
          <div class="playlist-artwork-container">
            <div class="playlist-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v2H3v-2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z"/>
              </svg>
            </div>
            <div class="playlist-play-overlay">
              <button class="playlist-play-btn">
                ${window.ICONS.play}
              </button>
            </div>
          </div>
          <div class="playlist-content">
            <div class="playlist-main-info">
              <div class="playlist-name-text">${playlist.name}</div>
              <div class="playlist-tracks-text">${playlist.songs?.length || 0} track${playlist.songs?.length !== 1 ? "s" : ""}</div>
            </div>
          </div>
          <div class="playlist-actions">
            <button class="playlist-action-btn playlist-more-btn" title="More options">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
            </button>
          </div>
        </div>
      `;
    });
    html += `</div>`;
    return html;
  },

  favoriteArtists: (artists, utils) => {
    let html = `<div class="modern-artist-grid animate-fade-in">`;
    artists.forEach((artistName, index) => {
      html += `
        <div class="modern-artist-card" data-artist="${artistName}" style="animation-delay: ${index * 100}ms;">
          <div class="artist-artwork-container">
            <img src="${utils.getArtistImageUrl(artistName)}" alt="${artistName}" class="artist-avatar-image">
            <div class="artist-play-overlay">
              <button class="artist-play-btn">
                ${window.ICONS.play}
              </button>
            </div>
            <div class="artist-gradient-overlay"></div>
          </div>
          <div class="artist-content">
            <div class="artist-name-text">${artistName}</div>
            <div class="artist-label">Artist</div>
          </div>
          <div class="artist-actions">
            <button class="artist-action-btn artist-follow-btn" title="Follow artist">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
            </button>
          </div>
        </div>
      `;
    });
    html += `</div>`;
    return html;
  },

  randomAlbums: (albums, utils) => {
    let html = `<div class="album-grid animate-fade-in">`;
    albums.forEach((album, index) => {
      html += `
        <div class="album-card" style="animation-delay: ${index * 100}ms;" data-artist="${album.artist}" data-album="${album.album}">
          <div style="position: relative;">
            <img src="${utils.getAlbumImageUrl(album.album)}" alt="${album.album}" class="album-cover">
            <div class="album-overlay">
              <button class="album-play-btn" data-artist="${album.artist}" data-album="${album.album}">
                ${window.ICONS.play}
              </button>
            </div>
          </div>
          <div class="album-info">
            <div class="album-title">${album.album}</div>
            <div class="album-artist" data-artist="${album.artist}">${album.artist}</div>
          </div>
        </div>
      `;
    });
    html += `</div>`;
    return html;
  },

  favoriteSongs: (songs, utils) => {
    let html = `<div class="favorite-tracks animate-fade-in">`;
    songs.forEach((song, index) => {
      html += `
        <div class="modern-favorite-item" data-song='${JSON.stringify(song).replace(/"/g, "&quot;")}' style="animation-delay: ${index * 100}ms;">
          <div class="favorite-artwork-container">
            <img src="${utils.getAlbumImageUrl(song.album)}" alt="${song.title}" class="favorite-artwork">
            <div class="favorite-play-overlay">
              <button class="favorite-play-btn">
                ${window.ICONS.play}
              </button>
            </div>
          </div>
          <div class="favorite-content">
            <div class="favorite-main-info">
              <div class="favorite-title-text">${song.title}</div>
              <div class="favorite-artist-text" data-artist="${song.artist}">${song.artist}</div>
            </div>
            <div class="favorite-meta">
              <span class="favorite-duration">3:24</span>
            </div>
          </div>
          <div class="favorite-actions">
            <button class="favorite-action-btn favorite-heart-btn active" data-song-id="${song.id}" title="Remove from favorites">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </button>
            <button class="favorite-action-btn favorite-more-btn" title="More options">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
            </button>
          </div>
        </div>
      `;
    });
    html += `</div>`;
    return html;
  }
},  overlay: function(templateName, data) {
  switch(templateName) {
    case 'default':
      return `
        <div class="close" data-close>&times;</div>
        <div class="content">${data.content}</div>
      `;
    case 'dialog':
      return `
        <div class="header">${data.message}</div>
        <div class="actions">
          ${data.cancelText ? `<button class="btn muted" data-cancel>${data.cancelText}</button>` : ''}
          <button class="btn ${data.danger ? "danger" : "primary"}" data-ok>${data.okText}</button>
        </div>
      `;
    case 'prompt':
      return `
        <div class="header">${data.message}</div>
        <div class="body">
          <input class="input" type="text" placeholder="${data.placeholder}" value="${data.value}">
        </div>
        <div class="actions">
          <button class="btn muted" data-cancel>${data.cancelText}</button>
          <button class="btn primary" data-ok>${data.okText}</button>
        </div>
      `;
    case 'viewer':
      return `
        <div class="viewer-container">
          <button class="viewer-close" data-close aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
          <div class="viewer-content">
            ${data.content}
          </div>
        </div>
      `;
    default:
      return '';
  }
},

  notification: function(data) {
    const { type, iconHtml, title, message } = data;
    return `
      <div role="status" aria-live="polite" class="toast-item toast-${type}">
        <div class="toast-progress"></div>
        <div class="toast-icon">${iconHtml}</div>
        <div class="toast-content">
          ${title ? `<strong>${title}</strong>` : ''}
          ${message}
        </div>
        <div class="toast-actions"></div>
      </div>
    `;
  },

  playerListItem: function(data) {
    const { song, index, type, utils } = data; // type can be 'queue' or 'recent'
    const isQueue = type === 'queue';

    return `
      <li class="songItem" data-index="${index}" data-song='${JSON.stringify(song).replace(/"/g, "&quot;")}'>
        <div class="songContent">
          <img src="${utils.getAlbumImageUrl(song.album)}" alt="${song.title}" class="songCover">
          <div class="songInfo">
            <div class="songTitle">${song.title}</div>
            <div class="artistName">${song.artist}</div>
          </div>
          <div class="songActions">
            <button class="playButton" data-action="play" title="Play now">
              <svg class="SVGimg" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
              </svg>
            </button>
            ${isQueue 
              ? `<button class="removeButton" data-action="remove" title="Remove from queue">
                   <svg class="SVGimg" fill="currentColor" viewBox="0 0 20 20">
                     <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                   </svg>
                 </button>`
              : `<button class="queueButton" data-action="queue" title="Add to queue">
                   <svg class="SVGimg" fill="currentColor" viewBox="0 0 20 20">
                     <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                   </svg>
                 </button>`
            }
          </div>
        </div>
      </li>
    `;
  },
};


export function create(htmlString) {
  const div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div.firstChild;
}