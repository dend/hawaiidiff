# Data Model: Telescope Search and Direction Filter

**Feature**: 002-i-want-to  
**Date**: 2025-10-14  
**Phase**: 1 - Design & Contracts

## Overview

This feature uses existing data structures from the HawaiiDiff camera system. No new data entities are created. The filter feature operates on the existing `cameras.json` data structure with a transient client-side Filter State.

## Existing Entities (No Changes)

### Telescope Camera

**Source**: `data/cameras.json`  
**Description**: Represents a telescope camera feed with metadata

**Fields**:
- `id` (string, required): Unique identifier for the camera (e.g., "cfht-c4", "gemini-north")
  - **Validation**: Must be unique across all cameras, kebab-case format
  - **Usage**: DOM element ID, URL slug
- `name` (string, required): Human-readable display name (e.g., "CFHT-C4", "Gemini North")
  - **Validation**: Non-empty string, 1-50 characters
  - **Usage**: Displayed in camera cards, used for search matching
- `direction` (string, optional): Compass direction or orientation indicator
  - **Valid Values**: N, S, E, W, NE, NW, SE, SW, ESE, Up, Hilo, or other custom values
  - **Validation**: String if present, can be null/undefined
  - **Usage**: Filter dropdown options, camera card display
- `uri` (string, required): URL to camera image source
  - **Validation**: Valid URL string
  - **Usage**: Camera feed source (not used by filter feature)

**Example**:
```json
{
  "id": "cfht-c4",
  "name": "CFHT-C4",
  "direction": "NW",
  "uri": "https://www.cfht.hawaii.edu/en/gallery/c4/c4.jpg"
}
```

**Relationships**: None - cameras are independent entities

**State Transitions**: None - data is static (read-only for filter feature)

**Notes**:
- Cameras with missing/null `direction` are excluded from direction filtering (FR-014)
- Cameras with missing/null `direction` still appear when no direction filter is active

### Direction

**Type**: Primitive value (string)  
**Description**: Compass direction or orientation indicator associated with a camera

**Characteristics**:
- Not a separate entity - embedded as a field in Telescope Camera
- No standardization required (FR-013) - values displayed as-is from data
- No validation beyond string type
- Used to populate direction filter dropdown options dynamically

**Unique Values** (from current data/cameras.json):
- Cardinal: N, S, E, W
- Intercardinal: NE, NW, SE, SW, ESE
- Non-standard: Up, Hilo

## Transient Client-Side Entities

### Filter State

**Scope**: Client-side only, browser memory  
**Lifetime**: Page session (resets on page refresh per FR-015)  
**Description**: Represents the current active filter criteria

**Fields**:
- `searchTerm` (string): Current text in search input field
  - **Default**: "" (empty string)
  - **Validation**: Any string (no sanitization needed, used only for comparison)
  - **State**: Updated on every `input` event with 100ms debounce
- `selectedDirections` (Set<string>): Currently selected direction values
  - **Default**: Empty Set (no filters active)
  - **Validation**: Values must exist in available directions from camera data
  - **State**: Updated on `change` event from direction dropdown

**State Transitions**:

```
Initial State:
  searchTerm = ""
  selectedDirections = Set()
  → All cameras visible

User types in search:
  searchTerm = "CFHT"
  selectedDirections = Set()
  → Cameras matching "CFHT" visible

User selects direction "N":
  searchTerm = "CFHT"
  selectedDirections = Set("N")
  → Cameras matching "CFHT" AND direction "N" visible

User clears search:
  searchTerm = ""
  selectedDirections = Set("N")
  → Only cameras with direction "N" visible

User clicks "Clear all filters":
  searchTerm = ""
  selectedDirections = Set()
  → All cameras visible (back to initial state)

Page refresh:
  → Reset to initial state (FR-015)
```

**Implementation**:
```javascript
// Pseudo-code - actual implementation in tasks
const filterState = {
  searchTerm: '',
  selectedDirections: new Set()
};

function updateFilterState() {
  filterState.searchTerm = searchInput.value;
  filterState.selectedDirections = new Set(
    Array.from(directionSelect.selectedOptions).map(opt => opt.value)
  );
  applyFilters();
}
```

## Derived Data (Computed at Runtime)

### Visible Cameras

**Type**: Array<Camera>  
**Description**: Subset of all cameras matching current filter state  
**Computation**: Real-time filtering on every filter state change

**Algorithm**:
```javascript
function getVisibleCameras(allCameras, filterState) {
  return allCameras.filter(camera => {
    // Search filter (FR-003, FR-004)
    const matchesSearch = !filterState.searchTerm || 
      camera.name.toLowerCase().includes(filterState.searchTerm.toLowerCase());
    
    // Direction filter (FR-007, FR-014)
    const matchesDirection = filterState.selectedDirections.size === 0 || 
      (camera.direction && filterState.selectedDirections.has(camera.direction));
    
    // AND logic (FR-008)
    return matchesSearch && matchesDirection;
  });
}
```

### Unique Directions

**Type**: Array<string>  
**Description**: List of all unique direction values from camera data  
**Computation**: Computed once on page load, used to populate direction dropdown

**Algorithm**:
```javascript
function getUniqueDirections(cameras) {
  const directions = new Set();
  cameras.forEach(camera => {
    if (camera.direction) { // Exclude null/undefined (FR-014)
      directions.add(camera.direction);
    }
  });
  return Array.from(directions).sort(); // Alphabetical sort
}
```

## Data Flow

```
Page Load:
  1. Hugo generates HTML with camera cards from data/cameras.json
  2. JavaScript reads DOM to build camera array
  3. Extract unique directions → populate dropdown options
  4. Initialize filter state (empty)
  5. Attach event listeners to filter controls

User Interaction:
  1. User types in search OR selects direction
  2. Event handler updates filter state
  3. Compute visible cameras from all cameras + filter state
  4. Update DOM: show/hide camera cards
  5. Update no results message if needed

Page Refresh:
  → Back to Page Load (filter state discarded per FR-015)
```

## Validation Rules

### Search Term Validation
- **No validation required**: Any string is valid
- **No sanitization required**: Used only for string comparison, never rendered as HTML
- **Max length**: Not enforced (browser input default ~524,288 chars is sufficient)

### Direction Selection Validation
- **Valid values**: Only directions that exist in camera data can be selected
- **Enforcement**: Dropdown options are dynamically populated from data, preventing invalid selections
- **Multiple selection**: Allowed per FR-007, no maximum limit

### Camera Data Validation (Build-Time)
- **Schema**: Validated by `collector/contracts/cameras-schema.json` (existing)
- **Filter feature assumption**: Camera data is valid if site builds successfully
- **Runtime validation**: Not needed - trust Hugo build process

## Performance Characteristics

### Data Volume
- **Current**: ~35 cameras
- **Expected growth**: <100 cameras in foreseeable future
- **Filter performance**: O(n) where n = number of cameras
  - Search: Single string comparison per camera
  - Direction: Set.has() lookup (O(1)) per camera
  - Combined: O(n) linear scan

### Memory Footprint
- **Camera data**: ~3-5 KB in memory (35 cameras × ~100 bytes each)
- **Filter state**: <1 KB (search string + Set of direction strings)
- **DOM elements**: ~35 camera card elements (existing, not created by filter)
- **Total additional memory**: <10 KB

### Update Frequency
- **Search input**: Up to 10 events/second during typing (debounced to 100ms)
- **Direction selection**: 1-2 events/second maximum (user clicking checkboxes)
- **Filter computation**: <15ms per update (measured in research phase)

## Edge Cases

### Missing Direction Values
- **Scenario**: Camera has `direction: null` or `direction: undefined`
- **Behavior**: 
  - Camera is shown when no direction filter is active
  - Camera is hidden when any direction filter is selected
  - Camera's direction is not added to dropdown options

### Empty Results
- **Scenario**: Filter combination produces zero matching cameras
- **Behavior**:
  - Show "no results found" message (FR-009)
  - Show "Clear all filters" button (FR-010)
  - Grid layout remains (empty grid container)

### Special Characters in Search
- **Scenario**: User types special characters (e.g., "CFHT-C4")
- **Behavior**: Exact string comparison, matches camera names with hyphens, underscores, etc.
- **No escaping needed**: Not used in regex or HTML rendering

### Non-Standard Directions
- **Scenario**: Camera has unusual direction value (e.g., "Up", "Hilo", "ESE")
- **Behavior**: Displayed as-is in dropdown per FR-013, treated same as cardinal directions

## Summary

This feature requires **no changes to existing data structures**. It operates entirely on the existing `cameras.json` data with transient client-side Filter State. Data flow is unidirectional (data → filter state → visible cameras → DOM updates), with no persistence or mutation of source data. All validation happens at build time via existing JSON schema; runtime validation is minimal as dropdown options are constrained to valid values from the data.
