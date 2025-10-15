# Filter API Contract

**Feature**: 002-i-want-to - Telescope Search and Direction Filter  
**Type**: Client-Side JavaScript API  
**Version**: 1.0  
**Date**: 2025-10-14

## Overview

This document defines the client-side JavaScript API for the telescope camera filtering system. This is **not** a REST API - it's a contract for the JavaScript module interface that will be added to `assets/js/main.js`.

## Module Interface

### CameraFilter

**Purpose**: Manages search and direction filtering for telescope cameras

**Initialization**:
```javascript
/**
 * Initialize the camera filter system
 * Called on DOMContentLoaded
 * 
 * @throws {Error} If required DOM elements not found
 * @returns {void}
 */
function initCameraFilter()
```

**Requirements**:
- Must be called after DOM is fully loaded
- Must find and cache references to: search input, direction toggle button container, camera cards, no-results message
- Must generate direction toggle buttons dynamically with unique values from camera data
- Must attach event listeners to filter controls (search input, toggle buttons)
- Must initialize filter state to empty (all cameras visible)

---

### Filter State Management

```javascript
/**
 * Get current filter state
 * 
 * @returns {FilterState} Current search term and selected directions
 */
function getFilterState()

/**
 * Update filter state and re-apply filters
 * Called by event handlers on search input and direction toggle buttons
 * 
 * @param {Partial<FilterState>} updates - Properties to update
 * @returns {void}
 */
function updateFilterState(updates)

/**
 * Clear all active filters
 * Sets searchTerm to empty, clears all direction selections, resets toggle button states
 * Called by "Clear all filters" button
 * 
 * @returns {void}
 */
function clearAllFilters()
```

**FilterState Type**:
```typescript
interface FilterState {
  searchTerm: string;           // Current search input value
  selectedDirections: Set<string>; // Selected direction values
}
```

---

### Filtering Functions

```javascript
/**
 * Apply current filter state to all cameras
 * Shows/hides camera cards based on search and direction filters
 * Updates no-results message visibility
 * 
 * @returns {void}
 */
function applyFilters()

/**
 * Check if a camera matches current filter state
 * 
 * @param {Camera} camera - Camera object with id, name, direction
 * @param {FilterState} filterState - Current filter criteria
 * @returns {boolean} True if camera matches all active filters
 */
function matchesFilters(camera, filterState)

/**
 * Check if a camera matches search term
 * Case-insensitive partial name matching
 * 
 * @param {Camera} camera - Camera object
 * @param {string} searchTerm - Search input value
 * @returns {boolean} True if camera name contains search term
 */
function matchesSearch(camera, searchTerm)

/**
 * Check if a camera matches direction filters
 * Returns true if no directions selected OR camera direction in selection
 * 
 * @param {Camera} camera - Camera object
 * @param {Set<string>} selectedDirections - Selected direction values
 * @returns {boolean} True if camera matches direction filter
 */
function matchesDirection(camera, selectedDirections)
```

**Camera Type**:
```typescript
interface Camera {
  id: string;          // Unique identifier (e.g., "cfht-c4")
  name: string;        // Display name (e.g., "CFHT-C4")
  direction?: string;  // Optional direction (e.g., "N", "SW", "Up")
  element: HTMLElement; // DOM element reference
}
```

---

### UI Update Functions

```javascript
/**
 * Update visibility of no-results message
 * Shows message if no cameras match filters, hides otherwise
 * 
 * @param {number} visibleCount - Number of visible cameras
 * @returns {void}
 */
function updateNoResultsMessage(visibleCount)

/**
 * Show a camera card
 * 
 * @param {HTMLElement} cameraElement - Camera card DOM element
 * @returns {void}
 */
function showCamera(cameraElement)

/**
 * Hide a camera card
 * 
 * @param {HTMLElement} cameraElement - Camera card DOM element
 * @returns {void}
 */
function hideCamera(cameraElement)

/**
 * Create and populate direction toggle buttons with unique direction values
 * Extracts unique directions from camera data
 * Creates button elements with click handlers
 * 
 * @param {Camera[]} cameras - Array of all cameras
 * @returns {void}
 */
function createDirectionToggleButtons(cameras)

/**
 * Update visual state of direction toggle buttons
 * Adds/removes active class based on current filter state
 * 
 * @param {Set<string>} selectedDirections - Currently selected directions
 * @returns {void}
 */
function updateToggleButtonState(selectedDirections)
```

---

### Utility Functions

```javascript
/**
 * Extract unique direction values from cameras
 * Excludes null/undefined directions
 * Returns sorted array
 * 
 * @param {Camera[]} cameras - Array of all cameras
 * @returns {string[]} Unique direction values, sorted alphabetically
 */
function getUniqueDirections(cameras)

/**
 * Get all camera elements from DOM
 * Caches camera data (id, name, direction) from data attributes
 * 
 * @returns {Camera[]} Array of camera objects with DOM element references
 */
function getCameraElements()

/**
 * Debounce function for search input
 * Delays execution until user stops typing
 * 
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds (100ms)
 * @returns {Function} Debounced function
 */
function debounce(func, delay)
```

---

## Event Handlers

```javascript
/**
 * Handle search input event
 * Debounced to 100ms to meet performance requirement
 * Updates filter state with new search term
 * 
 * @param {Event} event - Input event from search field
 * @returns {void}
 */
function handleSearchInput(event)

/**
 * Handle direction toggle button click event
 * Toggles direction in/out of selectedDirections Set
 * Updates toggle button visual state
 * Updates filter state and re-applies filters
 * 
 * @param {Event} event - Click event from toggle button
 * @param {string} direction - Direction value for this button
 * @returns {void}
 */
function handleDirectionToggle(event, direction)

/**
 * Handle clear filters button click
 * Resets all filters to initial state
 * 
 * @param {Event} event - Click event from clear button
 * @returns {void}
 */
function handleClearFilters(event)

/**
 * Handle mobile filter toggle (optional, for mobile UI)
 * Shows/hides filter panel on mobile devices
 * 
 * @param {Event} event - Click event from toggle button
 * @returns {void}
 */
function handleFilterToggle(event)
```

---

## DOM Structure Requirements

The JavaScript API expects the following DOM structure:

```html
<!-- Search input -->
<input 
  type="text" 
  id="camera-search" 
  placeholder="Search cameras..."
  aria-label="Search telescope cameras"
/>

<!-- Direction toggle button container -->
<div 
  id="direction-filter" 
  class="direction-filter-container"
  role="group"
  aria-label="Filter by direction"
>
  <!-- Toggle buttons generated dynamically by createDirectionToggleButtons() -->
  <!-- Example button structure: -->
  <!-- <button class="direction-toggle" data-direction="N">N</button> -->
  <!-- <button class="direction-toggle active" data-direction="S">S</button> -->
</div>

<!-- Camera cards (generated by Hugo) -->
<div class="camera-grid">
  <article class="camera-card" data-camera-id="cfht-c4" data-camera-name="CFHT-C4" data-camera-direction="NW">
    <!-- Camera card content -->
  </article>
  <!-- More camera cards... -->
</div>

<!-- No results message -->
<div id="no-results" class="no-results" style="display: none;">
  <p>No cameras match your filters.</p>
  <button id="clear-filters" class="btn-clear-filters">Clear all filters</button>
</div>

<!-- Mobile filter toggle (optional) -->
<button id="filter-toggle" class="filter-toggle" aria-expanded="false">
  Show Filters
</button>
```

**Data Attributes**:
- `data-camera-id`: Camera unique identifier
- `data-camera-name`: Camera display name (for search matching)
- `data-camera-direction`: Camera direction (optional, for direction filtering)

---

## Performance Requirements

Based on Success Criteria from spec:

- **SC-002**: Search results update within 100ms
  - Implementation: Debounce search input to 100ms
  - Measured: `performance.now()` before/after `applyFilters()`
  
- **SC-007**: No page reload or visible loading states
  - Implementation: All filtering happens client-side via DOM manipulation
  - No network requests, no page reloads

---

## Accessibility Requirements

Based on FR-012 from spec:

- All filter controls must be keyboard navigable
  - Search input: Standard `<input>` with focus/blur
  - Direction toggles: Standard `<button>` elements with Enter/Space activation
  - Clear button: Standard `<button>` with Enter/Space
  
- ARIA labels required:
  - `aria-label` on search input
  - `role="group"` and `aria-label` on direction toggle button container
  - Individual toggle buttons have implicit button role
  - `aria-expanded` on mobile filter toggle
  - `aria-live="polite"` on no-results message for screen reader announcements

---

## Error Handling

```javascript
/**
 * Handle initialization errors
 * Logs error and disables filter functionality gracefully
 * 
 * @param {Error} error - Initialization error
 * @returns {void}
 */
function handleInitError(error)
```

**Error Scenarios**:
- Required DOM elements not found → Log error, disable filtering
- Invalid camera data attributes → Skip camera, continue with others
- Event listener attachment fails → Log error, continue with other listeners

**Error Recovery**:
- Filter system fails gracefully - all cameras remain visible if filtering fails
- No user-facing error messages - fails silently with console logging
- Page remains functional even if filter initialization fails

---

## Mobile Responsive Behavior

Based on FR-016 and clarification Q5:

```javascript
/**
 * Initialize mobile filter toggle
 * Sets up show/hide behavior for filter panel on small screens
 * Uses CSS for actual show/hide (JavaScript only manages aria-expanded)
 * 
 * @returns {void}
 */
function initMobileFilterToggle()
```

**Responsive Breakpoint**: 768px (handled primarily in CSS)

**JavaScript Responsibilities**:
- Update `aria-expanded` attribute on toggle button
- Maintain focus management when showing/hiding filters
- CSS handles actual visibility via media query

---

## Testing Interface

For manual testing and debugging:

```javascript
/**
 * Get current number of visible cameras
 * Useful for testing and debugging
 * 
 * @returns {number} Count of visible camera cards
 */
function getVisibleCameraCount()

/**
 * Reset filter system to initial state
 * Useful for testing
 * 
 * @returns {void}
 */
function resetFilters()

/**
 * Get current filter statistics
 * Useful for debugging
 * 
 * @returns {FilterStats} Current filter state and result counts
 */
function getFilterStats()
```

**FilterStats Type**:
```typescript
interface FilterStats {
  totalCameras: number;
  visibleCameras: number;
  searchTerm: string;
  selectedDirectionCount: number;
  uniqueDirections: string[];
}
```

---

## Example Usage

```javascript
// Initialization (called on page load)
document.addEventListener('DOMContentLoaded', () => {
  try {
    initCameraFilter();
  } catch (error) {
    handleInitError(error);
  }
});

// Manual filter clearing (programmatic)
clearAllFilters();

// Get current filter state (debugging)
const state = getFilterState();
console.log(`Search: ${state.searchTerm}, Directions: ${Array.from(state.selectedDirections)}`);

// Check filter statistics
const stats = getFilterStats();
console.log(`Showing ${stats.visibleCameras} of ${stats.totalCameras} cameras`);
```

---

## Version History

- **1.0** (2025-10-14): Initial API contract for telescope camera filtering feature
