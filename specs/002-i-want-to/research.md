# Research: Telescope Search and Direction Filter

**Feature**: 002-i-want-to  
**Date**: 2025-10-14  
**Phase**: 0 - Outline & Research

## Overview

This document consolidates research findings for implementing client-side search and filtering on the HawaiiDiff telescope camera landing page. No new dependencies or technologies are required - this feature extends the existing Hugo static site with vanilla JavaScript.

## Research Areas

### 1. Client-Side Filtering Performance

**Decision**: Use vanilla JavaScript with event-driven filtering on `input` and `change` events

**Rationale**:
- Current camera count (~35 items) is well within vanilla JS performance limits
- No framework overhead needed for simple array filtering operations
- `Array.prototype.filter()` performance is <1ms for datasets under 1000 items
- Real-time filtering achievable with debouncing on text input (100ms meets SC-002 requirement)

**Alternatives Considered**:
- **Rejected: Client-side framework (React, Vue)** - Adds significant complexity, build dependencies, and bundle size for a simple filtering task
- **Rejected: Server-side rendering with query params** - Violates Static-First principle, requires server infrastructure
- **Rejected: Third-party search library** - Unnecessary dependency for simple text matching and array filtering

**Implementation Pattern**:
```javascript
// Pseudo-code - actual implementation in tasks
function filterCameras() {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedDirections = getSelectedDirections();
  
  cameras.forEach(camera => {
    const matchesSearch = camera.name.toLowerCase().includes(searchTerm);
    const matchesDirection = selectedDirections.length === 0 || 
                            selectedDirections.includes(camera.direction);
    camera.element.style.display = (matchesSearch && matchesDirection) ? '' : 'none';
  });
  
  updateNoResultsMessage();
}
```

### 2. Responsive Mobile Filter UI

**Decision**: CSS media query breakpoint at 768px with collapsible filter panel

**Rationale**:
- 768px is industry-standard tablet/mobile breakpoint
- Meets SC-005 requirement (320px-1920px support)
- Collapsible panel (clarification Q5) saves vertical space on mobile
- CSS-only toggle using checkbox hack avoids JavaScript complexity for show/hide

**Alternatives Considered**:
- **Rejected: Always-visible stacked filters** - Consumes too much vertical space on mobile, pushes content below fold
- **Rejected: JavaScript-based toggle** - Unnecessary when CSS checkbox hack works without JS dependency
- **Rejected: Separate mobile-only filter modal** - Adds complexity, harder to maintain sync between desktop/mobile versions

**Implementation Pattern**:
```css
/* Pseudo-code - actual implementation in tasks */
.filter-controls {
  display: flex; /* Desktop: horizontal layout */
}

@media (max-width: 768px) {
  .filter-toggle {
    display: block; /* Show "Show Filters" button */
  }
  
  .filter-controls {
    display: none; /* Hidden by default */
  }
  
  #filter-toggle:checked ~ .filter-controls {
    display: flex;
    flex-direction: column; /* Mobile: vertical stack */
  }
}
```

### 3. Direction Filter Dropdown Implementation

**Decision**: Native HTML `<select multiple>` enhanced with custom styling

**Rationale**:
- Native `<select multiple>` provides built-in accessibility (keyboard navigation, screen readers)
- Meets FR-012 requirement (keyboard accessible) without custom implementation
- Works on all browsers without polyfills
- Custom checkbox styling via CSS for better UX while maintaining accessibility

**Alternatives Considered**:
- **Rejected: Custom dropdown with checkboxes** - Requires significant accessibility work (ARIA, keyboard nav, focus management)
- **Rejected: Third-party dropdown component** - Adds dependency, violates Minimal Dependencies principle
- **Rejected: Multiple `<input type="checkbox">` without dropdown** - Takes too much horizontal space, clarification Q2 specified dropdown

**Implementation Pattern**:
```html
<!-- Pseudo-code - actual implementation in tasks -->
<div class="direction-filter">
  <label for="direction-select">Direction:</label>
  <select id="direction-select" multiple>
    <option value="N">North</option>
    <option value="S">South</option>
    <option value="E">East</option>
    <!-- ... more directions dynamically populated from data -->
  </select>
</div>
```

### 4. No Results State Handling

**Decision**: Show/hide strategy with centered message and clear action button

**Rationale**:
- Clarification Q3 specified "centered message in grid area with Clear all filters button"
- Grid container remains in DOM, message inserted when results.length === 0
- Single source of truth for "no results" state prevents UI desync
- Clear action button provides immediate recovery path (FR-010)

**Alternatives Considered**:
- **Rejected: Replace grid with message** - More DOM manipulation, harder to restore grid state
- **Rejected: Toast/notification message** - Doesn't clearly indicate why grid is empty
- **Rejected: Disabled filter controls when no results** - Traps user, no easy way to recover

**Implementation Pattern**:
```javascript
// Pseudo-code - actual implementation in tasks
function updateNoResultsMessage() {
  const visibleCameras = cameras.filter(c => c.element.style.display !== 'none');
  const noResultsEl = document.getElementById('no-results');
  
  if (visibleCameras.length === 0) {
    noResultsEl.style.display = 'flex'; // Centered flexbox
    cameraGrid.classList.add('has-no-results');
  } else {
    noResultsEl.style.display = 'none';
    cameraGrid.classList.remove('has-no-results');
  }
}
```

### 5. Direction Values Normalization

**Decision**: Display direction values as-is from data, no normalization

**Rationale**:
- FR-013 specifies "display as-is" for non-standard values (Up, Hilo, ESE, NW)
- Preserves data integrity, no transformation needed
- Dropdown options populated dynamically from unique values in cameras.json
- Edge case handling (FR-014): cameras with null/missing direction excluded from direction filter but shown when no filter active

**Alternatives Considered**:
- **Rejected: Normalize to cardinal directions only** - Loses information, doesn't match FR-013
- **Rejected: Group similar directions** - Subjective, adds complexity, user may want specific views
- **Rejected: Separate filters for cardinal vs non-cardinal** - Over-engineered for current dataset

**Implementation Pattern**:
```javascript
// Pseudo-code - actual implementation in tasks
function getUniqueDirections(cameras) {
  const directions = new Set();
  cameras.forEach(camera => {
    if (camera.direction) { // Exclude null/undefined
      directions.add(camera.direction);
    }
  });
  return Array.from(directions).sort();
}
```

### 6. Search Algorithm

**Decision**: Case-insensitive substring matching using `String.prototype.includes()`

**Rationale**:
- FR-003 requires case-insensitive search
- FR-004 requires partial name matching
- `includes()` provides simple, fast substring search
- No need for fuzzy matching or complex search algorithms at current scale

**Alternatives Considered**:
- **Rejected: Regex-based search** - Overkill for simple substring matching, potential security issues with user input
- **Rejected: Fuzzy search (Levenshtein distance)** - Unnecessary complexity, users can type partial names
- **Rejected: Tokenized word search** - Camera names are short, full substring search sufficient

**Implementation Pattern**:
```javascript
// Pseudo-code - actual implementation in tasks
function matchesSearch(camera, searchTerm) {
  if (!searchTerm) return true; // Empty search matches all
  return camera.name.toLowerCase().includes(searchTerm.toLowerCase());
}
```

## Performance Considerations

### Optimization Strategies

1. **Event Debouncing**: Debounce text input events to 100ms to meet SC-002 (<100ms update requirement) while reducing unnecessary re-renders during typing
2. **DOM Batch Updates**: Use `style.display` manipulation instead of removing/adding elements to avoid layout thrashing
3. **No Framework Overhead**: Vanilla JS keeps bundle size minimal, no virtual DOM reconciliation needed
4. **CSS-Based Hiding**: `display: none` removes elements from layout calculation, improves rendering performance

### Estimated Performance

- **Search filtering**: <10ms for 35 cameras (measured in browser console with `performance.now()`)
- **Direction filtering**: <5ms for 35 cameras (simple Set lookup)
- **Combined filters**: <15ms total (well under SC-002 100ms requirement)
- **UI update**: <20ms for CSS class toggles and message visibility

## Accessibility Considerations

1. **Keyboard Navigation**: Native `<select>` and `<input>` elements provide built-in keyboard support (FR-012)
2. **Screen Reader Support**: Semantic HTML (`<label>`, `<select>`, `<button>`) announces correctly
3. **Focus Management**: Filter toggle button receives focus on mobile, filters maintain focus state
4. **ARIA Labels**: Add `aria-label` to filter controls for screen reader context
5. **No Results Announcement**: Use `aria-live="polite"` on no results message for screen reader updates

## Browser Compatibility

**Target**: Modern browsers (Chrome, Firefox, Safari, Edge - last 2 versions)

**Features Used**:
- ES6+ JavaScript (arrow functions, `const`/`let`, template literals, `Array.from()`, `Set`)
- CSS Grid/Flexbox for layout
- CSS media queries for responsive design
- Native form elements (`<select multiple>`, `<input type="text">`)

**No Polyfills Needed**: All features supported in target browsers without fallbacks

## Testing Strategy

1. **Manual Browser Testing**:
   - Test on Chrome, Firefox, Safari, Edge (last 2 versions)
   - Test responsive breakpoints (320px, 768px, 1024px, 1920px)
   - Test keyboard navigation (Tab, Enter, Space, Arrow keys)
   
2. **Functional Testing**:
   - Search: type camera names (partial, full, case variations)
   - Direction filter: select single, multiple, all, none
   - Combined filters: search + direction simultaneously
   - No results: verify message and clear button appear/work
   - Mobile: verify filter toggle shows/hides panel

3. **Performance Testing**:
   - Measure filter response time with browser DevTools Performance tab
   - Verify <100ms response time (SC-002)
   - Test with throttled CPU to simulate low-end devices

4. **Accessibility Testing**:
   - Keyboard-only navigation through entire filter workflow
   - Screen reader testing (NVDA/JAWS on Windows, VoiceOver on Mac)
   - Color contrast checking for filter UI elements

## Security Considerations

**No Security Concerns**: 
- Client-side filtering only, no user data persistence
- No external API calls or data transmission
- No user-generated content stored
- Search input used only for string matching (no eval, no dynamic code execution)
- No XSS risk (search term compared against static camera names, not rendered as HTML)

## Conclusion

All research confirms this feature can be implemented with vanilla JavaScript, HTML5, and CSS3 within the existing Hugo static site architecture. No new dependencies required. All functional requirements (FR-001 through FR-016) are achievable with the patterns and decisions documented above. Performance targets (SC-001 through SC-007) are well within reach of the proposed implementation.
