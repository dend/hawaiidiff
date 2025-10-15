# Quickstart Guide: Telescope Search and Direction Filter

**Feature**: 002-i-want-to  
**Date**: 2025-10-14  
**Audience**: Developers implementing this feature

## Overview

This guide helps you implement the telescope camera search and direction filter feature for the HawaiiDiff static site. The implementation adds client-side filtering controls above the camera grid on the landing page.

**Estimated Time**: 4-6 hours  
**Difficulty**: Intermediate (JavaScript, CSS, Hugo templates)

---

## Prerequisites

Before starting:

- [ ] Hugo installed and HawaiiDiff site builds successfully
- [ ] Familiarity with vanilla JavaScript (ES6+)
- [ ] Basic understanding of CSS Grid/Flexbox
- [ ] Code editor with syntax highlighting for HTML/CSS/JS
- [ ] Modern browser with DevTools for testing (Chrome/Firefox recommended)

**Verify Setup**:
```powershell
# From repository root
hugo version  # Should show Hugo v0.xx.x or higher
hugo          # Should build site successfully
```

---

## Implementation Steps

### Step 1: Create Filter UI Partial (15 minutes)

**File**: `layouts/partials/filters.html`

**Purpose**: HTML structure for search box and direction dropdown

**Tasks**:
1. Create new partial file
2. Add search input field with appropriate ID and ARIA labels
3. Add direction dropdown (empty `<select multiple>` - options populated by JS)
4. Add no-results message container (hidden by default)
5. Add mobile filter toggle button

**Key Points**:
- Use semantic HTML (`<label>`, `<input>`, `<select>`, `<button>`)
- Include ARIA labels for accessibility (FR-012)
- Add data attributes to camera cards for JavaScript access
- Follow existing HawaiiDiff HTML conventions

**Reference**: See `/contracts/filter-api.md` for required DOM structure

---

### Step 2: Update Landing Page Layout (10 minutes)

**File**: `layouts/index.html`

**Purpose**: Include filter partial above camera grid

**Tasks**:
1. Include `{{ partial "filters.html" . }}` above camera grid
2. Add data attributes to camera cards for filtering:
   - `data-camera-id="{{ .id }}"`
   - `data-camera-name="{{ .name }}"`
   - `data-camera-direction="{{ .direction }}"`
3. Ensure camera grid container has ID or class for JavaScript access

**Key Points**:
- Place filters above grid per clarification Q1
- Don't change existing camera card structure - only add data attributes
- Verify Hugo variables (`.id`, `.name`, `.direction`) are available in template context

---

### Step 3: Add Filter Styles (30-45 minutes)

**File**: `assets/css/main.css`

**Purpose**: Style filter controls for desktop and mobile

**Tasks**:
1. **Desktop Styles** (>768px):
   - Horizontal layout for search + direction dropdown
   - Consistent spacing and alignment
   - Match existing site design patterns
   
2. **Mobile Styles** (≤768px):
   - Collapsible filter panel (clarification Q5)
   - "Show Filters" toggle button
   - Vertical stack layout
   - Use CSS checkbox hack for show/hide (no JavaScript needed)
   
3. **Filter Control Styles**:
   - Search input styling
   - Direction dropdown styling (consider custom checkbox styling for better UX)
   - Clear filters button styling
   
4. **No Results Message**:
   - Centered in grid area
   - Clear visual separation
   - Prominent "Clear all filters" button

**Key Points**:
- Maintain responsive design (320px-1920px per SC-005)
- Follow existing color scheme and typography
- Ensure 4.5:1 contrast ratio for accessibility
- Test keyboard focus states

**Reference**: See `/research.md` for CSS patterns and responsive breakpoint rationale

---

### Step 4: Implement Filter JavaScript (2-3 hours)

**File**: `assets/js/main.js`

**Purpose**: Client-side filtering logic

**Tasks**:

**4a. Initialization** (30 min):
- Add `initCameraFilter()` function called on `DOMContentLoaded`
- Cache DOM element references (search input, dropdown, camera cards, no-results)
- Extract camera data from DOM data attributes
- Populate direction dropdown with unique values
- Initialize empty filter state
- Attach event listeners

**4b. Filter State Management** (20 min):
- Implement `getFilterState()` and `updateFilterState()`
- Implement `clearAllFilters()` to reset state
- Store state in module closure (not global scope)

**4c. Filtering Logic** (45 min):
- Implement `applyFilters()` - main filtering function
- Implement `matchesSearch()` - case-insensitive partial matching (FR-003, FR-004)
- Implement `matchesDirection()` - Set-based direction matching (FR-007, FR-014)
- Implement `matchesFilters()` - AND logic for combined filters (FR-008)

**4d. UI Updates** (30 min):
- Implement `showCamera()` / `hideCamera()` - DOM manipulation
- Implement `updateNoResultsMessage()` - show/hide based on results count
- Implement `populateDirectionDropdown()` - dynamic option creation
- Implement `getUniqueDirections()` - extract unique values from data

**4e. Event Handlers** (30 min):
- Implement `handleSearchInput()` with 100ms debounce (SC-002)
- Implement `handleDirectionChange()`
- Implement `handleClearFilters()`
- Optional: `handleFilterToggle()` for mobile (if not using CSS-only)

**4f. Utilities** (15 min):
- Implement `debounce()` function for search input
- Implement `getCameraElements()` to extract camera data from DOM
- Add error handling for missing DOM elements

**Key Points**:
- Follow API contract in `/contracts/filter-api.md`
- Use vanilla JavaScript - no frameworks or libraries
- Optimize for performance (<100ms filter updates per SC-002)
- Handle edge cases (missing direction values, no results)
- Add console logging for debugging (can be removed later)

**Reference**: See `/data-model.md` for filter algorithms and data flow

---

### Step 5: Test Implementation (1-1.5 hours)

**Manual Testing Checklist**:

**Functional Testing**:
- [ ] Search by camera name (full and partial matches)
- [ ] Search is case-insensitive (FR-003)
- [ ] Direction filter with single selection
- [ ] Direction filter with multiple selections (FR-007)
- [ ] Combined search + direction filters (FR-008)
- [ ] Clear all filters button resets state
- [ ] No results message appears when appropriate (FR-009)
- [ ] Page refresh resets filters (FR-015)

**Responsive Testing**:
- [ ] Desktop layout (1920px, 1024px)
- [ ] Tablet layout (768px)
- [ ] Mobile layout (375px, 320px)
- [ ] Filter toggle works on mobile (FR-016)

**Performance Testing**:
- [ ] Search updates in <100ms (SC-002) - use DevTools Performance tab
- [ ] Direction filter updates in <2s (SC-003)
- [ ] No page reload on filter (SC-007)

**Accessibility Testing**:
- [ ] Keyboard navigation works (Tab, Enter, Space, Arrows)
- [ ] Screen reader announces filter changes (test with NVDA/JAWS/VoiceOver)
- [ ] Focus indicators visible
- [ ] ARIA labels present and correct

**Edge Case Testing**:
- [ ] Cameras with missing direction values excluded from direction filter (FR-014)
- [ ] Non-standard directions (Up, Hilo, ESE) display correctly (FR-013)
- [ ] Special characters in search (hyphens, numbers)
- [ ] Empty search + empty direction = all cameras visible

**Browser Testing**:
- [ ] Chrome (last 2 versions)
- [ ] Firefox (last 2 versions)
- [ ] Safari (last 2 versions)
- [ ] Edge (last 2 versions)

---

### Step 6: Build and Verify (15 minutes)

```powershell
# From repository root

# Build site
hugo

# Start local server
hugo server

# Open in browser
# Navigate to http://localhost:1313
# Test all filter functionality
```

**Verification**:
- [ ] Site builds without errors
- [ ] Filter UI appears above camera grid
- [ ] All filter interactions work as expected
- [ ] No JavaScript console errors
- [ ] No CSS layout issues at different screen sizes

---

## Development Tips

### Debugging

**Console Logging**:
```javascript
// Add debug logging during development
function applyFilters() {
  const start = performance.now();
  // ... filtering logic ...
  const end = performance.now();
  console.log(`Filter applied in ${end - start}ms`);
  console.log(`Visible cameras: ${visibleCount}`);
}
```

**DevTools Breakpoints**:
- Set breakpoints in event handlers to inspect filter state
- Use Performance tab to measure filter execution time
- Use Network tab to verify no external requests made

**Test Data Attributes**:
```javascript
// Verify camera data extraction
console.table(getCameraElements());
```

### Common Issues

**Issue**: Direction dropdown not populating  
**Fix**: Verify `data-camera-direction` attributes exist on camera cards in Hugo template

**Issue**: Filters not responding  
**Fix**: Check event listeners attached after DOM loaded, verify element IDs match

**Issue**: Search too slow  
**Fix**: Ensure debounce function is working, check for unnecessary DOM queries in loop

**Issue**: Mobile toggle not working  
**Fix**: Verify CSS checkbox hack syntax, check media query breakpoint

### Performance Optimization

- Cache DOM element references (don't query on every filter)
- Use `style.display` instead of removing/adding elements
- Debounce search input to reduce filtering calls
- Avoid reading layout properties (offsetHeight, etc.) inside loops

---

## Reference Documentation

- **Specification**: `/specs/002-i-want-to/spec.md`
- **Research**: `/specs/002-i-want-to/research.md`
- **Data Model**: `/specs/002-i-want-to/data-model.md`
- **API Contract**: `/specs/002-i-want-to/contracts/filter-api.md`
- **Tasks**: `/specs/002-i-want-to/tasks.md` (generated by `/speckit.tasks`)

---

## Success Criteria Checklist

Before marking feature complete, verify all Success Criteria from spec:

- [ ] **SC-001**: Users can find camera by name in <5 seconds
- [ ] **SC-002**: Search updates in <100 milliseconds
- [ ] **SC-003**: Direction filter updates in <2 seconds
- [ ] **SC-004**: All controls keyboard operable
- [ ] **SC-005**: Works on 320px-1920px screens
- [ ] **SC-006**: 95% users can use without instructions (usability test if possible)
- [ ] **SC-007**: No page reload or loading states

---

## Next Steps

After completing implementation:

1. Run `/speckit.tasks` to generate detailed task breakdown
2. Create pull request with:
   - Modified files: `layouts/index.html`, `layouts/partials/filters.html`, `assets/css/main.css`, `assets/js/main.js`
   - Test results from checklist above
   - Screenshots of desktop and mobile layouts
3. Request code review focusing on:
   - Accessibility compliance
   - Performance measurements
   - Cross-browser compatibility
4. Merge to main branch after approval
5. Deploy to production
6. Monitor for user feedback or issues

---

## Estimated Timeline

| Task | Time | Cumulative |
|------|------|------------|
| Create filter UI partial | 15 min | 15 min |
| Update landing page layout | 10 min | 25 min |
| Add filter styles | 45 min | 1h 10min |
| Implement JavaScript | 3h | 4h 10min |
| Test implementation | 1h 30min | 5h 40min |
| Build and verify | 15 min | 5h 55min |

**Total**: ~6 hours for experienced developer, up to 8 hours if new to Hugo/vanilla JS

---

## Support

**Questions or Issues?**
- Review `/specs/002-i-want-to/` documentation
- Check existing `assets/js/main.js` for code patterns
- Test with browser DevTools console for debugging
- Verify Hugo template syntax in Hugo documentation

**Constitution Compliance**:
- No new dependencies added ✓
- All content in Markdown (N/A for this feature) ✓
- All data in JSON (uses existing cameras.json) ✓
- Static-first architecture maintained ✓
