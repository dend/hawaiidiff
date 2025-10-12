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
- When a camera has fewer than 10 historical snapshots available, display only the available snapshots (1-9 images)
- How are cameras with very long names displayed in the card layout without breaking the design?
- When camera directional information is missing, display "Direction unavailable" in place of the direction
- How does the layout adapt to different screen sizes (mobile, tablet, desktop)?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display exactly 34 camera cards on the landing page
- **FR-002**: System MUST present each camera card as a uniform square regardless of original image dimensions
- **FR-003**: System MUST display the following metadata for each camera card: camera name, directional aiming, and last snapshot timestamp
- **FR-004**: System MUST display a placeholder with camera metadata and "Image unavailable" message when snapshot images fail to load
- **FR-005**: System MUST display "Timestamp unavailable" when timestamp data is missing or invalid
- **FR-006**: System MUST display "Direction unavailable" when directional information is missing
- **FR-007**: System MUST allow users to click on any camera card to navigate to that camera's detail page
- **FR-008**: Camera detail page MUST display camera metadata (name, direction, timestamp) at the top of the page
- **FR-009**: Camera detail page MUST show the latest snapshot in a large, prominent view
- **FR-010**: Camera detail page MUST display up to 10 most recent previous snapshots in browsable format (or all available if fewer than 10 exist)
- **FR-011**: System MUST use a dark theme for all pages
- **FR-012**: System MUST use color schemes that meet WCAG AA accessibility standards for contrast ratios
- **FR-013**: System MUST provide navigation from camera detail pages back to the landing page
- **FR-014**: All camera data (names, directions, timestamps, image paths) MUST be stored in JSON format
- **FR-015**: All text content MUST be stored in Markdown format where applicable

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
