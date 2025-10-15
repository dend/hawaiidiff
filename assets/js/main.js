/**
 * Format timestamp from WebP filename (YYYY_MM_DD_HH_MM.webp)
 * Returns formatted HTML with date and times on separate lines
 */
function formatTimestamp(filename) {
  if (!filename) {
    return 'Timestamp unavailable';
  }

  // Extract timestamp from filename: YYYY_MM_DD_HH_MM.webp
  const match = filename.match(/(\d{4})_(\d{2})_(\d{2})_(\d{2})_(\d{2})/);
  
  if (!match) {
    return 'Timestamp unavailable';
  }

  const [, year, month, day, hour, minute] = match;
  
  try {
    // Create date object in UTC (assuming the timestamp is in Hawaii time)
    const date = new Date(
      parseInt(year),
      parseInt(month) - 1, // JavaScript months are 0-indexed
      parseInt(day),
      parseInt(hour),
      parseInt(minute)
    );

    // Validate date
    if (isNaN(date.getTime())) {
      return 'Timestamp unavailable';
    }

    // Format date only
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'Pacific/Honolulu'
    });

    // Format for Hawaii Time (time only)
    const hawaiiFormatter = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Pacific/Honolulu'
    });

    // Format for Pacific Time
    const pacificFormatter = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'America/Los_Angeles'
    });

    // Format for Eastern Time
    const easternFormatter = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'America/New_York'
    });

    const dateStr = dateFormatter.format(date);
    const hawaiiTime = hawaiiFormatter.format(date);
    const pacificTime = pacificFormatter.format(date);
    const easternTime = easternFormatter.format(date);

    return `<span class="timestamp-date">${dateStr}</span><br>${hawaiiTime} HST<br>${pacificTime} PT<br>${easternTime} ET`;
  } catch (error) {
    return 'Timestamp unavailable';
  }
}

/**
 * Format timestamp for header (inline, single line)
 */
function formatTimestampInline(filename) {
  if (!filename) {
    return 'Timestamp unavailable';
  }

  // Extract timestamp from filename: YYYY_MM_DD_HH_MM.webp
  const match = filename.match(/(\d{4})_(\d{2})_(\d{2})_(\d{2})_(\d{2})/);
  
  if (!match) {
    return 'Timestamp unavailable';
  }

  const [, year, month, day, hour, minute] = match;
  
  try {
    // Create date object
    const date = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hour),
      parseInt(minute)
    );

    // Validate date
    if (isNaN(date.getTime())) {
      return 'Timestamp unavailable';
    }

    // Format date only
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'Pacific/Honolulu'
    });

    // Format for Hawaii Time
    const hawaiiFormatter = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Pacific/Honolulu'
    });

    // Format for Pacific Time
    const pacificFormatter = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'America/Los_Angeles'
    });

    // Format for Eastern Time
    const easternFormatter = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'America/New_York'
    });

    const dateStr = dateFormatter.format(date);
    const hawaiiTime = hawaiiFormatter.format(date);
    const pacificTime = pacificFormatter.format(date);
    const easternTime = easternFormatter.format(date);

    return `${dateStr} • ${hawaiiTime} HST • ${pacificTime} PT • ${easternTime} ET`;
  } catch (error) {
    return 'Timestamp unavailable';
  }
}

/**
 * Format timestamp for cards (compact, date and HST only)
 */
function formatTimestampCard(filename) {
  if (!filename) {
    return 'Timestamp unavailable';
  }

  // Extract timestamp from filename: YYYY_MM_DD_HH_MM.webp
  const match = filename.match(/(\d{4})_(\d{2})_(\d{2})_(\d{2})_(\d{2})/);
  
  if (!match) {
    return 'Timestamp unavailable';
  }

  const [, year, month, day, hour, minute] = match;
  
  try {
    // Create date object
    const date = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hour),
      parseInt(minute)
    );

    // Validate date
    if (isNaN(date.getTime())) {
      return 'Timestamp unavailable';
    }

    // Format date with short month
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'Pacific/Honolulu'
    });

    // Format for Hawaii Time
    const hawaiiFormatter = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Pacific/Honolulu'
    });

    const dateStr = dateFormatter.format(date);
    const hawaiiTime = hawaiiFormatter.format(date);

    return `${dateStr} • ${hawaiiTime} HST`;
  } catch (error) {
    return 'Timestamp unavailable';
  }
}

/**
 * Initialize timestamp formatting on page load
 */
document.addEventListener('DOMContentLoaded', function() {
  // Format header timestamp (inline)
  const headerTimestamp = document.querySelector('.camera-timestamp-header[data-timestamp]');
  if (headerTimestamp) {
    const filename = headerTimestamp.getAttribute('data-timestamp');
    headerTimestamp.innerHTML = formatTimestampInline(filename);
  }
  
  // Format snapshot timestamps (multi-line)
  const snapshotTimestamps = document.querySelectorAll('.snapshot-timestamp[data-timestamp]');
  snapshotTimestamps.forEach(element => {
    const filename = element.getAttribute('data-timestamp');
    element.innerHTML = formatTimestamp(filename);
  });
  
  // Format card timestamps (compact - date and HST only)
  const cardTimestamps = document.querySelectorAll('.camera-timestamp[data-timestamp]');
  cardTimestamps.forEach(element => {
    const filename = element.getAttribute('data-timestamp');
    element.innerHTML = formatTimestampCard(filename);
  });
  
  // Initialize keyboard navigation for camera detail pages
  initKeyboardNavigation();
  
  // Initialize compact header on scroll
  initCompactHeader();
});

/**
 * Compact header on scroll for camera detail pages
 */
function initCompactHeader() {
  const detailHeader = document.querySelector('.camera-detail-header');
  if (!detailHeader) {
    return;
  }
  
  const siteHeader = document.querySelector('.site-header');
  if (!siteHeader) {
    return;
  }
  
  const siteHeaderHeight = siteHeader.offsetHeight;
  let isCompact = false;
  let ticking = false;
  
  // Set the sticky position to be below the site header
  detailHeader.style.top = `${siteHeaderHeight}px`;
  
  // Threshold: need to scroll this much past the header to trigger compact
  const threshold = 100;
  
  function updateHeader() {
    const currentScrollY = window.scrollY;
    
    // If scrolled past the threshold, make compact
    if (currentScrollY > (siteHeaderHeight + threshold) && !isCompact) {
      detailHeader.classList.add('compact');
      isCompact = true;
    } 
    // If scrolled back above the threshold, expand
    else if (currentScrollY <= siteHeaderHeight && isCompact) {
      detailHeader.classList.remove('compact');
      isCompact = false;
    }
    
    ticking = false;
  }
  
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  });
}

/**
 * Keyboard navigation for camera detail pages
 */
function initKeyboardNavigation() {
  // Only initialize on camera detail pages
  if (!document.querySelector('.camera-navigation')) {
    return;
  }
  
  document.addEventListener('keydown', function(event) {
    // Don't trigger if user is typing in an input field
    if (event.target.tagName === 'INPUT' || 
        event.target.tagName === 'TEXTAREA' || 
        event.target.isContentEditable) {
      return;
    }
    
    const prevButton = document.querySelector('.nav-prev');
    const nextButton = document.querySelector('.nav-next');
    
    // Left arrow or 'p' for previous
    if (event.key === 'ArrowLeft' || event.key === 'p') {
      event.preventDefault();
      if (prevButton) {
        prevButton.click();
      }
    }
    
    // Right arrow or 'n' for next
    if (event.key === 'ArrowRight' || event.key === 'n') {
      event.preventDefault();
      if (nextButton) {
        nextButton.click();
      }
    }
    
    // Home key to go to first camera
    if (event.key === 'Home') {
      event.preventDefault();
      window.location.href = '/';
    }
  });
}

/**
 * ============================================
 * CAMERA FILTER MODULE
 * ============================================
 * Client-side search and direction filtering for telescope cameras
 */

// Filter state management
const filterState = {
  searchTerm: '',
  selectedDirections: new Set()
};

// Cached DOM references
let cameraElements = [];
let searchInput = null;
let directionContainer = null;
let noResultsElement = null;
let clearFiltersButton = null;
let filterToggle = null;
let cameraGrid = null;

/**
 * Initialize the camera filter system
 * Called on DOMContentLoaded
 */
function initCameraFilter() {
  try {
    // Cache DOM element references
    searchInput = document.getElementById('camera-search');
    directionContainer = document.getElementById('direction-filter');
    noResultsElement = document.getElementById('no-results');
    clearFiltersButton = document.getElementById('clear-filters');
    filterToggle = document.getElementById('filter-toggle');
    cameraGrid = document.getElementById('camera-grid');

    // Check if we're on a page with filters (main landing page)
    if (!searchInput || !directionContainer || !cameraGrid) {
      return; // Not on the landing page, skip filter initialization
    }

    // Extract camera data from DOM
    cameraElements = getCameraElements();

    if (cameraElements.length === 0) {
      console.warn('No camera elements found');
      return;
    }

    // Generate direction toggle buttons
    createDirectionToggleButtons(cameraElements);

    // Attach event listeners
    searchInput.addEventListener('input', debounce(handleSearchInput, 100));
    
    if (clearFiltersButton) {
      clearFiltersButton.addEventListener('click', handleClearFilters);
    }

    // Mobile filter toggle
    if (filterToggle) {
      filterToggle.addEventListener('click', handleFilterToggle);
    }

    // Initialize filter state (all cameras visible)
    filterState.searchTerm = '';
    filterState.selectedDirections = new Set();
  } catch (error) {
    console.error('Error initializing camera filter:', error);
    // Fail gracefully - all cameras remain visible
  }
}

/**
 * Get all camera elements from DOM with cached data
 * @returns {Array} Array of camera objects with DOM element references
 */
function getCameraElements() {
  const cards = document.querySelectorAll('.camera-card[data-camera-id]');
  return Array.from(cards).map(card => ({
    id: card.getAttribute('data-camera-id'),
    name: card.getAttribute('data-camera-name') || '',
    direction: card.getAttribute('data-camera-direction') || null,
    element: card.closest('.camera-card-link') || card // Get the link wrapper for hiding
  }));
}

/**
 * Extract unique direction values from cameras
 * Excludes null/undefined directions, returns sorted array
 * @param {Array} cameras - Array of camera objects
 * @returns {Array} Unique direction values, sorted alphabetically
 */
function getUniqueDirections(cameras) {
  const directions = new Set();
  cameras.forEach(camera => {
    if (camera.direction && camera.direction.trim() !== '') {
      directions.add(camera.direction);
    }
  });
  return Array.from(directions).sort();
}

/**
 * Create and populate direction toggle buttons dynamically
 * @param {Array} cameras - Array of camera objects
 */
function createDirectionToggleButtons(cameras) {
  if (!directionContainer) return;

  const uniqueDirections = getUniqueDirections(cameras);
  
  // Clear existing buttons
  directionContainer.innerHTML = '';

  // Create toggle button for each direction
  uniqueDirections.forEach(direction => {
    const button = document.createElement('button');
    button.className = 'direction-toggle';
    button.setAttribute('data-direction', direction);
    button.setAttribute('aria-pressed', 'false');
    button.textContent = direction;
    
    // Attach click handler
    button.addEventListener('click', (event) => handleDirectionToggle(event, direction));
    
    directionContainer.appendChild(button);
  });
}

/**
 * Debounce function for search input
 * Delays execution until user stops typing
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * Get current filter state
 * @returns {Object} Current search term and selected directions
 */
function getFilterState() {
  return {
    searchTerm: filterState.searchTerm,
    selectedDirections: new Set(filterState.selectedDirections)
  };
}

/**
 * Update filter state and re-apply filters
 * @param {Object} updates - Properties to update
 */
function updateFilterState(updates) {
  if (updates.searchTerm !== undefined) {
    filterState.searchTerm = updates.searchTerm;
  }
  if (updates.selectedDirections !== undefined) {
    filterState.selectedDirections = updates.selectedDirections;
  }
  applyFilters();
}

/**
 * Clear all active filters
 * Resets search term, direction selections, and toggle button states
 */
function clearAllFilters() {
  // Reset search input
  if (searchInput) {
    searchInput.value = '';
  }

  // Reset filter state
  filterState.searchTerm = '';
  filterState.selectedDirections = new Set();

  // Update toggle button states
  updateToggleButtonState(filterState.selectedDirections);

  // Re-apply filters (shows all cameras)
  applyFilters();
}

/**
 * Check if a camera matches current filter state
 * @param {Object} camera - Camera object
 * @param {Object} state - Filter state
 * @returns {boolean} True if camera matches all active filters
 */
function matchesFilters(camera, state) {
  const searchMatch = matchesSearch(camera, state.searchTerm);
  const directionMatch = matchesDirection(camera, state.selectedDirections);
  return searchMatch && directionMatch;
}

/**
 * Check if a camera matches search term
 * Case-insensitive partial name matching
 * @param {Object} camera - Camera object
 * @param {string} searchTerm - Search input value
 * @returns {boolean} True if camera name contains search term
 */
function matchesSearch(camera, searchTerm) {
  if (!searchTerm || searchTerm.trim() === '') {
    return true; // No search filter active
  }
  return camera.name.toLowerCase().includes(searchTerm.toLowerCase());
}

/**
 * Check if a camera matches direction filters
 * Returns true if no directions selected OR camera direction in selection
 * @param {Object} camera - Camera object
 * @param {Set} selectedDirections - Selected direction values
 * @returns {boolean} True if camera matches direction filter
 */
function matchesDirection(camera, selectedDirections) {
  if (selectedDirections.size === 0) {
    return true; // No direction filter active
  }
  // Cameras with missing direction are excluded when direction filter is active
  return camera.direction && selectedDirections.has(camera.direction);
}

/**
 * Apply current filter state to all cameras
 * Shows/hides camera cards based on search and direction filters
 */
function applyFilters() {
  let visibleCount = 0;

  cameraElements.forEach(camera => {
    if (matchesFilters(camera, filterState)) {
      showCamera(camera.element);
      visibleCount++;
    } else {
      hideCamera(camera.element);
    }
  });

  // Update no results message
  updateNoResultsMessage(visibleCount);

  // Left-align grid when any filters are active
  const anyFiltersActive = (filterState.searchTerm && filterState.searchTerm.trim().length > 0)
    || (filterState.selectedDirections && filterState.selectedDirections.size > 0);
  if (cameraGrid) {
    cameraGrid.classList.toggle('is-filtered', anyFiltersActive);
  }
}

/**
 * Show a camera card
 * @param {HTMLElement} cameraElement - Camera card DOM element
 */
function showCamera(cameraElement) {
  if (cameraElement) {
    cameraElement.style.display = '';
  }
}

/**
 * Hide a camera card
 * @param {HTMLElement} cameraElement - Camera card DOM element
 */
function hideCamera(cameraElement) {
  if (cameraElement) {
    cameraElement.style.display = 'none';
  }
}

/**
 * Update visibility of no-results message
 * Shows message if no cameras match filters, hides otherwise
 * @param {number} visibleCount - Number of visible cameras
 */
function updateNoResultsMessage(visibleCount) {
  if (!noResultsElement) return;

  if (visibleCount === 0) {
    noResultsElement.style.display = 'block';
  } else {
    noResultsElement.style.display = 'none';
  }
}

/**
 * Update visual state of direction toggle buttons
 * Adds/removes active class based on current filter state
 * @param {Set} selectedDirections - Currently selected directions
 */
function updateToggleButtonState(selectedDirections) {
  if (!directionContainer) return;

  const buttons = directionContainer.querySelectorAll('.direction-toggle');
  buttons.forEach(button => {
    const direction = button.getAttribute('data-direction');
    if (selectedDirections.has(direction)) {
      button.classList.add('active');
      button.setAttribute('aria-pressed', 'true');
    } else {
      button.classList.remove('active');
      button.setAttribute('aria-pressed', 'false');
    }
  });
}

/**
 * Handle search input event
 * Debounced to 100ms for performance
 * @param {Event} event - Input event from search field
 */
function handleSearchInput(event) {
  updateFilterState({ searchTerm: event.target.value });
}

/**
 * Handle direction toggle button click event
 * Toggles direction in/out of selectedDirections Set
 * @param {Event} event - Click event from toggle button
 * @param {string} direction - Direction value for this button
 */
function handleDirectionToggle(event, direction) {
  const newSelectedDirections = new Set(filterState.selectedDirections);
  
  if (newSelectedDirections.has(direction)) {
    // Deactivate - remove from set
    newSelectedDirections.delete(direction);
  } else {
    // Activate - add to set
    newSelectedDirections.add(direction);
  }

  updateFilterState({ selectedDirections: newSelectedDirections });
  updateToggleButtonState(newSelectedDirections);
}

/**
 * Handle clear filters button click
 * Resets all filters to initial state
 * @param {Event} event - Click event from clear button
 */
function handleClearFilters(event) {
  if (event) {
    event.preventDefault();
  }
  clearAllFilters();
}

/**
 * Handle mobile filter toggle
 * Shows/hides filter panel on mobile devices
 * @param {Event} event - Click event from toggle button
 */
function handleFilterToggle(event) {
  if (!filterToggle) return;

  const isExpanded = filterToggle.getAttribute('aria-expanded') === 'true';
  filterToggle.setAttribute('aria-expanded', !isExpanded);
  
  // Update aria-label for accessibility
  filterToggle.setAttribute('aria-label', !isExpanded ? 'Hide filters' : 'Show filters');
}

// Initialize camera filter on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCameraFilter);
} else {
  initCameraFilter();
}

