// Helpers Module - Utility functions for formatting, URLs, and image handling
// All utilities extracted from parsers.js and global.js
// Using object literal format only

export const helpers = {
  // Time formatting
  formatTime: function(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  },

  // Image URL generation
  getAlbumImageUrl: function(albumName) {
    if (!albumName) return helpers.getDefaultAlbumImage();
    const cleanName = albumName
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[^\w.-]/g, ""); // Allow periods and hyphens
    return `https://raw.githubusercontent.com/ClockBlocked/ClockBlocked.github.io/refs/heads/Finalfinal/global/content/images/albumCovers/${cleanName}.png`;
  },

  getArtistImageUrl: function(artistName) {
    if (!artistName) return helpers.getDefaultArtistImage();
    const normalizedName = helpers.normalizeNameForUrl(artistName);
     // Use the existing normalization function
    return `https://raw.githubusercontent.com/ClockBlocked/ClockBlocked.github.io/refs/heads/Finalfinal/global/content/images/artistPortraits/${normalizedName}.png`;
  },

  getDefaultArtistImage: function() {
    return 'https://raw.githubusercontent.com/ClockBlocked/ClockBlocked.github.io/refs/heads/Finalfinal/global/content/images/artistPortraits/default-artist.png';
  },

  getDefaultAlbumImage: function() {
    return 'https://raw.githubusercontent.com/ClockBlocked/ClockBlocked.github.io/refs/heads/Finalfinal/global/content/images/albumCovers/default-album.png';
  },

  // URL normalization
  normalizeNameForUrl: function(name) {
    if (typeof name !== 'string') return '';
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s]/g, '') // Remove non-word characters (except space)
      .replace(/\s+/g, '') // Remove spaces
      .replace(/[^a-z0-9]/g, ''); // Final cleanup for any lingering non-alphanumeric
  },

  normalizeForUrl: function(text) {
    if (typeof text !== 'string') return '';
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '');
  },

  // Image loading with fallback
  loadImageWithFallback: function(imgElement, primaryUrl, fallbackUrl, type = 'image') {
    if (!imgElement) return;

    const testImage = new Image();
    
    testImage.onload = function() {
      imgElement.src = primaryUrl;
      imgElement.classList.remove('image-loading', 'image-error');
      imgElement.classList.add('image-loaded');
    };
    
    testImage.onerror = function() {
      const fallbackImage = new Image();
      
      fallbackImage.onload = function() {
        imgElement.src = fallbackUrl;
        imgElement.classList.remove('image-loading');
        imgElement.classList.add('image-loaded', 'image-fallback');
      };
      
      fallbackImage.onerror = function() {
        imgElement.classList.remove('image-loading');
        imgElement.classList.add('image-error');
        imgElement.src = helpers.generatePlaceholderImage(type);
      };
      
      fallbackImage.src = fallbackUrl;
    };
    
    imgElement.classList.add('image-loading');
    imgElement.classList.remove('image-loaded', 'image-error', 'image-fallback');
    testImage.src = primaryUrl;
  },

  // Generate placeholder image
  generatePlaceholderImage: function(type) {
    const isArtist = type === 'artist';
    const bgColor = isArtist ? '#4F46E5' : '#059669';
    const icon = isArtist ? 
      '<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>' :
      '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>';
    
    const svg = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="${bgColor}"/>
      <svg x="75" y="75" width="50" height="50" viewBox="0 0 24 24" fill="white">
        ${icon}
      </svg>
    </svg>`;
    
    return 'data:image/svg+xml;base64,' + btoa(svg);
  },

  // Music data helpers
  getTotalSongs: function(artist) {
    if (!artist || !artist.albums) return 0;
    return artist.albums.reduce((total, album) => total + (album.songs ? album.songs.length : 0), 0);
  },

  // --- NEW FUNCTION START ---
  /**
   * Finds artists with the same genre.
   * @param {string} currentArtistName - The name of the artist to compare against.
   * @param {object} [options={ limit: 24 }] - Options, including the max number of artists to return.
   * @returns {string[]} An array of similar artist names.
   */
  getSimilarArtists: function(currentArtistName, options = { limit: 24 }) {
    const { limit } = options;
    if (!window.music || !currentArtistName) return [];

    const currentArtist = window.music.find(a => a.artist === currentArtistName);
    if (!currentArtist || !currentArtist.genre) return [];

    const currentGenre = currentArtist.genre.toLowerCase();
    
    const similar = window.music.filter(artist => 
      artist.artist !== currentArtistName &&
      artist.genre &&
      artist.genre.toLowerCase() === currentGenre
    );

    // Shuffle and slice the results
    return similar
      .map(artist => artist.artist)
      .sort(() => 0.5 - Math.random()) // Shuffle the array
      .slice(0, limit); // Get the specified limit
  },
  // --- NEW FUNCTION END ---

  parseDuration: function(durationStr) {
    if (typeof durationStr !== "string") return 0;
    const parts = durationStr.split(":").map(Number);
    return parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1]) ? parts[0] * 60 + parts[1] : 0;
  },

  // DOM helpers
  createElementFromHTML: function(htmlString) {
    const div = document.createElement("div");
    div.innerHTML = htmlString.trim();
    return div.firstChild;
  },

  // URI encoding (custom implementation from parsers.js)
  encodeURIComponent: function(str) {
    const string = String(str);
    let result = '';
    
    for (let i = 0; i < string.length; i++) {
      const char = string[i];
      const charCode = char.charCodeAt(0);
      
      // Keep alphanumeric characters and these specific characters: - _ . ! ~ * ' ( )
      if (
        (charCode >= 65 && charCode <= 90) || // A-Z
        (charCode >= 97 && charCode <= 122) || // a-z
        (charCode >= 48 && charCode <= 57) || // 0-9
        char === '-' ||
        char === '_' ||
        char === '.' ||
        char === '!' ||
        char === '~' ||
        char === '*' ||
        char === "'" ||
        char === '(' ||
        char === ')'
      ) {
        result += char;
      } else {
        // Convert to UTF-8 percent encoding
        if (charCode < 128) {
          // Single byte character
          result += '%' + charCode.toString(16).toUpperCase().padStart(2, '0');
        } else {
          // Multi-byte UTF-8 character
          const bytes = [];
          let code = charCode;
          
          if (code < 0x800) {
            bytes.push(0xC0 | (code >> 6));
            bytes.push(0x80 | (code & 0x3F));
          } else if (code < 0x10000) {
            bytes.push(0xE0 | (code >> 12));
            bytes.push(0x80 | ((code >> 6) & 0x3F));
            bytes.push(0x80 | (code & 0x3F));
          } else if (code < 0x110000) {
            bytes.push(0xF0 | (code >> 18));
            bytes.push(0x80 | ((code >> 12) & 0x3F));
            bytes.push(0x80 | ((code >> 6) & 0x3F));
            bytes.push(0x80 | (code & 0x3F));
          }
          
          // Convert each byte to percent encoding
          for (const byte of bytes) {
            result += '%' + byte.toString(16).toUpperCase().padStart(2, '0');
          }
        }
      }
    }
    
    return result;
  },

  encodeURIComponentSimple: function(str) {
    const string = String(str);
    let result = '';
    
    for (let i = 0; i < string.length; i++) {
      const char = string[i];
      const charCode = char.charCodeAt(0);
      
      if (
        (charCode >= 65 && charCode <= 90) ||
        (charCode >= 97 && charCode <= 122) ||
        (charCode >= 48 && charCode <= 57) ||
        char === '-' ||
        char === '_' ||
        char === '.' ||
        char === '!' ||
        char === '~' ||
        char === '*' ||
        char === "'" ||
        char === '(' ||
        char === ')'
      ) {
        result += char;
      } else {
        result += '%' + charCode.toString(16).toUpperCase().padStart(2, '0');
      }
    }
    
    return result;
  },

  // Added scrollToTop as it was in my previous (incorrect) version but not your file
  scrollToTop: function (smooth = true) {
    try {
      window.scrollTo({
        top: 0,
        behavior: smooth ? "smooth" : "auto",
      });
    } catch (e) {
      console.warn("Smooth scroll failed, falling back to instant.", e);
      window.scrollTo(0, 0);
    }
  },
};

// Export individual functions for backward compatibility with existing code
// (This part seems to be from your file, so I've kept it)
export const formatTime = helpers.formatTime;
export const getAlbumImageUrl = helpers.getAlbumImageUrl;
export const getArtistImageUrl = helpers.getArtistImageUrl;
export const getDefaultArtistImage = helpers.getDefaultArtistImage;
export const getDefaultAlbumImage = helpers.getDefaultAlbumImage;
export const normalizeNameForUrl = helpers.normalizeNameForUrl;
export const normalizeForUrl = helpers.normalizeForUrl;
export const loadImageWithFallback = helpers.loadImageWithFallback;
export const generatePlaceholderImage = helpers.generatePlaceholderImage;
export const getTotalSongs = helpers.getTotalSongs;
export const parseDuration = helpers.parseDuration;
export const createElementFromHTML = helpers.createElementFromHTML;
export const encodeURIComponent = helpers.encodeURIComponent;
export const encodeURIComponentSimple = helpers.encodeURIComponentSimple;
export const getSimilarArtists = helpers.getSimilarArtists; // Exporting the new function
export const scrollToTop = helpers.scrollToTop; // Exporting the added function

