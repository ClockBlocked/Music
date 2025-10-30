export const deepLinkRouter = {
  basePath: '/Music', // Base path for the application

  // Helper to encode names (spaces to periods)
  encodeName: function(name) {
    if (typeof name !== 'string') return '';
    return name.trim().replace(/\s+/g, '.');
  },

  // Helper to decode names (periods to spaces)
  decodeName: function(segment) {
    if (typeof segment !== 'string') return '';
    return segment.replace(/\./g, ' ');
  },
  
  /**
   * Generates a URL for a given route and parameters.
   * @param {string} routeName - The name of the route (e.g., 'artist', 'home').
   * @param {object} [params={}] - An object of parameters for the route.
   * @returns {string} The constructed URL.
   */
  generateLink: function(routeName, params = {}) {
    let path = this.basePath;

    switch (routeName) {
      case 'home':
        path += '/';
        break;
      case 'artists':
        path += '/artists';
        break;
      case 'artist':
        if (params.artist) {
          path += `/artist/${this.encodeName(params.artist)}`;
        } else {
          console.warn('generateLink: "artist" route missing artist param');
          path += '/artists'; // Fallback
        }
        break;
      case 'album':
        if (params.artist && params.album) {
          path += `/album/${this.encodeName(params.artist)}/${this.encodeName(params.album)}`;
        } else {
          console.warn('generateLink: "album" route missing params');
          path += '/'; // Fallback to home
        }
        break;
      case 'playlist':
        if (params.id) {
          path += `/playlist/${params.id}`;
        } else {
          console.warn('generateLink: "playlist" route missing id param');
          path += '/'; // Fallback to home
        }
        break;
      case 'favorites':
        path += `/favorites/${params.type || 'songs'}`;
        break;
      case 'search':
        if (params.query) {
          path += `/search/${this.encodeName(params.query)}`;
        } else {
          console.warn('generateLink: "search" route missing query param');
          path += '/'; // Fallback to home
        }
        break;
      default:
        console.warn(`generateLink: Unknown routeName "${routeName}"`);
        path += '/'; // Fallback to home
    }
    return path.replace(/\/+/g, '/'); // Clean up double slashes
  },

  parseCurrentPath: function() {
    const path = window.location.pathname;
    
    // Make path relative to the basePath
    const relativePath = path.startsWith(this.basePath) 
      ? path.substring(this.basePath.length) 
      : path;

    const segments = relativePath.split('/').filter(Boolean);

    // Decode segments that might have been encoded with periods
    const decodedSegments = segments.map(seg => this.decodeName(seg));

    return {
      fullPath: path,
      segments: decodedSegments,
      route: decodedSegments[0] || 'home',
      params: decodedSegments.slice(1),
    };
  },

  resolveRoute: function(pathInfo) {
    const { route, params } = pathInfo;

    if (!window.appState?.router) {
      console.warn('Router not initialized yet');
      return;
    }

    const routeHandlers = {
      '': () => this.navigateToHome(),
      'home': () => this.navigateToHome(),
      'artist': () => this.navigateToArtist(params[0]),
      'artists': () => this.navigateToAllArtists(),
      'album': () => this.navigateToAlbum(params[0], params[1]),
      'playlist': () => this.navigateToPlaylist(params[0]),
      'favorites': () => this.navigateToFavorites(params[0]),
      'search': () => this.navigateToSearch(params[0]),
    };

    // Use navigateToNotFound as the fallback
    const handler = routeHandlers[route] || (() => this.navigateToNotFound({
      title: 'Page Not Found',
      message: `The URL path "${pathInfo.fullPath}" does not correspond to any content.`,
    }));
    
    return handler();
  },

  navigateToHome: function() {
    if (window.appState?.router) {
      window.appState.router.navigateTo(window.ROUTES?.HOME || 'home'); // Use 'home' routeName
    }
  },
  
  navigateToNotFound: function(error = {}) {
    if (window.navigation?.pages?.loadNotFoundPage) {
      window.navigation.pages.loadNotFoundPage(error);
    } else {
      // Fallback if navigation module isn't ready
      this.navigateToHome();
    }
  },

  navigateToArtist: function(artistName) {
    if (!artistName) {
      this.navigateToHome();
      return;
    }
    
    // Check if artist exists before navigating
    const artistData = window.music?.find(a => a.artist === artistName);
    if (!artistData) {
      this.navigateToNotFound({
        title: 'Artist Not Found',
        message: `We couldn't find an artist named "${artistName}".`,
      });
      return;
    }

    if (window.appState?.router) {
      window.appState.router.navigateTo(
        window.ROUTES?.ARTIST || 'artist',
        { artist: artistName }
      );
    }
  },

  navigateToAllArtists: function() {
    if (window.appState?.router) {
      window.appState.router.navigateTo(window.ROUTES?.ALL_ARTISTS || 'artists');
    }
  },

  navigateToAlbum: function(artistName, albumName) {
    if (!artistName || !albumName) {
      this.navigateToNotFound({
        title: 'Invalid URL',
        message: 'An artist and album name are required for this page.',
      });
      return;
    }

    const decodedArtist = artistName;
    const decodedAlbum = albumName;

    if (window.appState?.router && window.music) {
      const artistData = window.music.find(a => a.artist === decodedArtist);
      
      if (artistData) {
        // Use encodeName to match encoded names in URLs
        const albumData = artistData.albums.find(a => this.encodeName(a.album) === this.encodeName(decodedAlbum));
        
        if (albumData && window.navigation?.pages?.loadArtistPage) {
          // Store the album to load, as loadArtistPage will be called by the internal router
          sessionStorage.setItem('pendingAlbumLoad', albumData.album);
          
          window.appState.router.navigateTo(
            window.ROUTES?.ARTIST || 'artist',
            { artist: decodedArtist }
          );
        } else {
          this.navigateToNotFound({
            title: 'Album Not Found',
            message: `We couldn't find the album "${decodedAlbum}" by ${decodedArtist}.`,
          });
        }
      } else {
        this.navigateToNotFound({
          title: 'Artist Not Found',
          message: `We couldn't find an artist named "${decodedArtist}".`,
        });
      }
    }
  },

  navigateToPlaylist: function(playlistId) {
    if (!playlistId) {
      this.navigateToHome();
      return;
    }

    if (window.playlists) {
      window.playlists.show(playlistId);
    }
  },

  navigateToFavorites: function(type) {
    const favoriteType = type || 'songs';

    if (window.views) {
      const handlers = {
        'songs': () => window.views.showFavoriteSongs(),
        'artists': () => window.views.showFavoriteArtists(),
        'albums': () => window.views.showFavoriteAlbums?.(),
      };

      const handler = handlers[favoriteType];
      if (handler) handler();
    }
  },

  navigateToSearch: function(query) {
    if (window.appState?.router && query) {
      const decodedQuery = query;
      window.appState.router.openSearchDialog?.(decodedQuery);
    }
  },

  // --- MODIFICATION START ---
  // This function is now responsible for handling ALL page loads,
  // not just deep links.
  initialize: function() {
    if (window.deepLinkHandled) return;
    window.deepLinkHandled = true;

    const pathInfo = this.parseCurrentPath();
    
    // This console log will now fire on ALL page loads
    console.log('Router initializing with path:', pathInfo);

    const checkInitialized = setInterval(() => {
      // Wait for all critical modules to be ready
      if (window.appState?.router && window.music && window.navigation) {
        clearInterval(checkInitialized);

        // We have all dependencies, resolve the current route,
        // whether it's 'home' or a deep link.
        setTimeout(() => {
          this.resolveRoute(pathInfo);
        }, 100); // Small delay to ensure all modules are fully ready
      }
    }, 100);

    setTimeout(() => {
      clearInterval(checkInitialized);
      if (!window.appState?.router) {
        console.error('App not initialized after 5 seconds, redirecting to home');
        window.location.href = this.basePath || '/';
      }
    }, 5000);
  },
  // --- MODIFICATION END ---

  bindPopState: function() {
    window.addEventListener('popstate', (event) => {
      const pathInfo = this.parseCurrentPath();
      this.resolveRoute(pathInfo);
    });
  },
};

