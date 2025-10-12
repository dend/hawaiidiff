# Feature Specification: Mauna Kea Camera Snapshot Visualizer

**Feature Branch**: `001-mauna-kea-camera`  
**Created**: 2025-10-11  
**Status**: Draft  
**Input**: User description: "I am building a visualizer of camera snapshots for Mauna Kea. The landing page should display all available cameras. There are 34 cameras total. I want them to be presented on the landing page in a uniform way - that is, the camera images themselves might be different sizes, but ultimately all should be shown the same in square cards. Cards for each camera should have a name for it as well as directional aiming (e.g., N, NW, Up, E, etc.). I also want the card to show the date and time of the last snapshot. The overall style of the landing page should be modern and using the dark theme. Color scheme should be accessible. When the user clicks on one of the camera cards, they should be able to navigate to the camera page, that shows camera metadata at the top (same as in cards), with a focused image of latest snapshots, and then the ability to browse 10 previous snapshots (which are also images). There is no video or other non-image data."

## Clarifications

### Session 2025-10-11

- Q: How should the visualizer detect and display new camera snapshots? → A: Content refreshes when the static site is rebuilt
- Q: What should be displayed when a camera snapshot image fails to load? → A: Show placeholder with camera info - Display camera name and direction with "Image unavailable" message
- Q: How should the detail page handle cameras with fewer than 10 historical snapshots? → A: Display only available snapshots - Show 1-9 snapshots if that's all that exists
- Q: What should be displayed for timestamp when it's missing or invalid? → A: Show "Timestamp unavailable" - Display explicit message indicating missing data
- Q: What should be displayed when camera directional information is missing? → A: Show "Direction unavailable" - Display explicit message indicating missing data

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse All Camera Snapshots (Priority: P1)

A user visits the landing page to view current snapshots from all 34 Mauna Kea cameras. They can see at a glance which cameras are active, what direction each camera points, and when the last snapshot was taken. This provides an overview of current conditions across all viewpoints.

**Why this priority**: This is the core value proposition - providing a unified view of all cameras. Without this, the application has no foundational functionality. This story delivers immediate value as a camera monitoring dashboard.

**Independent Test**: Can be fully tested by loading the landing page and verifying all 34 camera cards display with uniform square formatting, camera names, directional information, and timestamp data.

**Acceptance Scenarios**:

1. **Given** a user opens the landing page, **When** the page loads, **Then** exactly 34 camera cards are displayed in a grid layout
2. **Given** the landing page is displayed, **When** viewing any camera card, **Then** each card shows the camera name, directional aiming (e.g., N, NW, Up, E), and timestamp of the last snapshot
3. **Given** camera images have different original dimensions, **When** displayed in cards, **Then** all cards have uniform square dimensions with properly fitted/cropped images
4. **Given** the landing page is displayed, **When** viewing the page, **Then** the interface uses a dark theme with accessible color contrast ratios meeting WCAG AA standards
5. **Given** snapshots have varying timestamps, **When** viewing camera cards, **Then** timestamps are displayed in a consistent, human-readable format

---

### User Story 2 - View Individual Camera Details (Priority: P2)

A user clicks on a specific camera card to view detailed information about that camera, including a larger view of the latest snapshot and access to recent historical snapshots. This allows focused monitoring of a particular viewpoint.

**Why this priority**: Builds on P1 by adding depth to the browsing experience. Users can investigate specific cameras of interest after surveying the overview. Independently valuable as it enables detailed camera inspection.

**Independent Test**: Can be tested by clicking any camera card from the landing page and verifying navigation to a camera detail page showing metadata, large snapshot, and historical images.

**Acceptance Scenarios**:

1. **Given** a user is on the landing page, **When** they click on any camera card, **Then** they navigate to that camera's detail page
2. **Given** a user is on a camera detail page, **When** the page loads, **Then** the camera metadata (name, direction, timestamp) is displayed at the top
3. **Given** a user is on a camera detail page, **When** viewing the main content, **Then** the latest snapshot is displayed in a large, focused view
4. **Given** a user is on a camera detail page, **When** viewing below the main snapshot, **Then** the 10 most recent previous snapshots are displayed as browsable thumbnails or images
5. **Given** a user is viewing historical snapshots, **When** they select a previous snapshot, **Then** they can view it in larger detail
6. **Given** a user is on a camera detail page, **When** they want to return to overview, **Then** navigation back to the landing page is clearly available

---

### User Story 3 - Navigate Between Cameras (Priority: P3)

While viewing a specific camera's detail page, a user can easily navigate to adjacent or other cameras without returning to the landing page. This streamlines the workflow for users monitoring multiple cameras sequentially.

**Why this priority**: Enhances user experience for power users who regularly check multiple cameras. Not essential for basic functionality but improves efficiency. Can be added after core viewing capabilities are established.

**Independent Test**: Can be tested by navigating to any camera detail page and verifying the presence of navigation controls (next/previous or camera selector) that allow direct navigation to other cameras.

**Acceptance Scenarios**:

1. **Given** a user is on a camera detail page, **When** they use navigation controls, **Then** they can move to the next or previous camera in sequence
2. **Given** a user is on a camera detail page, **When** viewing navigation options, **Then** they can see which camera they're currently viewing (e.g., camera 5 of 34)
3. **Given** a user is on a camera detail page, **When** they want to jump to a specific camera, **Then** a camera selector or list allows direct navigation without returning to the landing page

---

### Edge Cases

- When a camera snapshot image fails to load or is unavailable, the card displays camera metadata (name, direction) with an "Image unavailable" message
- When cameras have missing or invalid timestamp data, display "Timestamp unavailable" in place of the timestamp
- When a camera has fewer than 10 historical snapshots available (excluding the currently displayed latest), display only the available snapshots (1-9 images)
- When camera names exceed 40 characters, truncate with ellipsis and provide full name via title attribute
- When camera directional information is missing, display "Direction unavailable" in place of the direction
- How does the layout adapt to different screen sizes (mobile, tablet, desktop)?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display exactly 34 camera cards on the landing page
- **FR-002**: System MUST present each camera card as a uniform square regardless of original image dimensions
- **FR-003**: System MUST display the following metadata for each camera card: camera name, directional aiming, and last snapshot timestamp
- **FR-004**: System MUST display a placeholder with camera metadata and "Image unavailable" message when snapshot images fail to load, with centered layout matching card dimensions and grayed italic styling
- **FR-005**: System MUST display "Timestamp unavailable" in grayed italic style when timestamp data is missing or invalid
- **FR-006**: System MUST display "Direction unavailable" in grayed italic style when directional information is missing
- **FR-007**: System MUST allow users to click on any camera card to navigate to that camera's detail page
- **FR-008**: Camera detail page MUST display camera metadata (name, direction, timestamp) at the top of the page
- **FR-009**: Camera detail page MUST show the latest snapshot in a large, prominent view
- **FR-010**: Camera detail page MUST display up to 10 most recent previous snapshots (excluding the currently displayed latest snapshot) in browsable format (or all available if fewer than 10 exist)
- **FR-011**: System MUST use a dark theme for all pages
- **FR-012**: System MUST use color schemes that meet WCAG AA accessibility standards for contrast ratios
- **FR-013**: System MUST provide navigation from camera detail pages back to the landing page
- **FR-014**: All camera data (names, directions, timestamps, image paths) MUST be stored in JSON format
- **FR-015**: All text content MUST be stored in Markdown format where applicable

### Visual Design Requirements

- **FR-016**: Camera cards MUST display as uniform squares with identical dimensions regardless of source image aspect ratios
- **FR-017**: Landing page grid MUST adapt to viewport size with different column counts for desktop, tablet, and mobile devices
- **FR-018**: Camera card images MUST crop non-square source images to fill the square card area while preserving aspect ratio
- **FR-019**: Camera cards MUST be visually separated with consistent spacing that adapts based on viewport size
- **FR-020**: Camera cards MUST have sufficient internal spacing to prevent metadata text from touching card edges
- **FR-021**: Camera detail page latest snapshot MUST display large enough to be prominently visible on desktop while scaling to full width on mobile devices
- **FR-022**: Historical snapshot thumbnails MUST display as uniform squares in a horizontally browsable format with consistent spacing
- **FR-023**: System MUST use a dark color scheme with distinct visual hierarchy between primary background, elevated surfaces, primary text, secondary text, interactive elements, and borders
- **FR-024**: All text MUST be readable against dark backgrounds with contrast ratios exceeding WCAG AA minimum standards (4.5:1 for normal text)

### Typography Requirements

- **FR-025**: Camera name MUST be the most prominent text element in each card with highest visual weight
- **FR-026**: Direction label MUST be visually secondary to camera name but clearly readable
- **FR-027**: Timestamp MUST be smallest metadata text element, visually subordinate to name and direction
- **FR-028**: Long camera names exceeding 40 characters MUST be truncated with ellipsis to fit card width, with full name available via HTML title attribute on hover
- **FR-029**: Timestamps MUST display in human-readable format showing month, day, year, and time in 12-hour format
- **FR-030**: System MUST use standard system fonts that render natively on user's operating system

### Interaction State Requirements

- **FR-031**: Camera cards MUST provide clear visual feedback on hover with border highlight, shadow, and subtle lift effect with smooth animation
- **FR-032**: Camera cards MUST display distinct keyboard focus indicator that is visible and does not cause motion (accessibility consideration)
- **FR-033**: Camera cards MUST show pressed/active state visual feedback when clicked
- **FR-034**: Historical snapshot thumbnails MUST indicate interactivity on hover with visual highlighting
- **FR-035**: All interactive elements MUST meet WCAG 2.5.5 minimum touch target size for accessibility
- **FR-036**: Non-interactive cards (when data unavailable) MUST appear visually disabled with no interaction feedback

### Accessibility Requirements

- **FR-037**: All camera cards MUST be keyboard navigable in logical visual reading order
- **FR-038**: Camera cards MUST provide screen readers with complete context including camera name, direction, and last update time
- **FR-039**: "Image unavailable" placeholders MUST communicate the missing state to screen reader users
- **FR-040**: Navigation back to landing page MUST be keyboard accessible and labeled for screen readers
- **FR-041**: Historical snapshot thumbnails MUST provide screen readers with timestamp context for each image
- **FR-042**: Keyboard focus MUST be clearly visible at all times for all interactive elements
- **FR-043**: Information MUST NOT be conveyed through color alone (must combine with text, icons, or other visual indicators)

### Layout & Positioning Requirements

- **FR-044**: Camera detail page metadata MUST remain visible while scrolling (sticky header) with semi-transparent background to maintain readability over images
- **FR-045**: Historical snapshots section MUST have clear visual separation from the main snapshot image
- **FR-046**: Loading states MUST display placeholder content with shimmer animation indicating content is being loaded

### Error & Edge Case Visual Requirements

- **FR-047**: Cameras with no historical snapshots MUST display explanatory message instead of empty thumbnail area
- **FR-048**: Grid layout MUST maintain structure even when all cameras have missing images (no layout collapse)

### Key Entities

- **Camera**: Represents a physical camera on Mauna Kea with attributes including unique identifier, display name, directional aiming (compass direction or orientation), and metadata about snapshot availability
- **Snapshot**: Represents a single camera image capture with attributes including image file path, capture timestamp, associated camera identifier, and display order/sequence number
- **Camera Collection**: The complete set of 34 cameras with their configuration and current snapshot references

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can view all 34 camera snapshots on a single landing page within 3 seconds of page load
- **SC-002**: All camera cards display with visually uniform dimensions regardless of source image aspect ratios
- **SC-003**: Users can navigate from landing page to any camera detail page with a single click
- **SC-004**: Camera detail pages display the latest snapshot plus 10 historical snapshots for each camera
- **SC-005**: All text maintains a minimum contrast ratio of 4.5:1 against dark backgrounds (WCAG AA compliance)
- **SC-006**: Users can successfully navigate between all cameras and back to the landing page without encountering broken links or navigation errors
- **SC-007**: All camera cards maintain identical dimensions and aspect ratio across all viewport sizes (verifiable via visual inspection and measurement tools)
- **SC-008**: Grid layout adapts column count appropriately for desktop, tablet, and mobile viewports (verifiable via responsive testing)
- **SC-009**: Interactive feedback animations complete smoothly within 200ms transition time (verifiable via browser DevTools performance monitoring)
- **SC-010**: All interactive elements meet accessibility standards for touch target size (verifiable via accessibility audit tools)
- **SC-011**: All camera cards and navigation links are reachable via keyboard in logical order (verifiable via keyboard-only testing)
- **SC-012**: Loading indicators appear promptly when content is not immediately available (verifiable via network throttling tests)

## Assumptions

- Camera snapshot images are available as static image files (JPEG, PNG, or similar web-compatible format)
- Camera metadata (names, directions, timestamps) can be maintained in a JSON configuration file
- Snapshot images will be updated externally to this visualizer (not responsible for image capture or upload)
- All 34 cameras consistently produce snapshots with some regularity
- Timestamps are provided in a parseable format (ISO 8601 or Unix timestamp recommended)
- Historical snapshots are retained and accessible for at least the 10 most recent captures per camera
- Browser support targets modern browsers (Chrome, Firefox, Safari, Edge) with CSS Grid and Flexbox support
- Users access the site primarily via desktop or tablet devices (mobile responsive is desired but not primary use case)
- Snapshot data is updated through static site rebuilds (no real-time updates or polling)
- Site rebuild process occurs external to this visualizer (triggered by snapshot availability or schedule)
