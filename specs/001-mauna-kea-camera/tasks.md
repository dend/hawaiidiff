# Implementation Tasks: Mauna Kea Camera Snapshot Visualizer

**Feature**: 001-mauna-kea-camera  
**Branch**: `001-mauna-kea-camera`  
**Created**: 2025-10-11  
**Based On**: [spec.md](spec.md), [plan.md](plan.md), [data-model.md](data-model.md)

## Overview

This document breaks down the implementation into executable tasks organized by user story priority. Each phase represents a complete, independently testable increment.

**Total Tasks**: 48  
**User Stories**: 3 (P1, P2, P3)  
**Approach**: Incremental delivery - each user story builds a complete, shippable feature

## Task Organization

- **Phase 1**: Setup & Infrastructure (T001-T006)
- **Phase 2**: Foundational Prerequisites (T007-T010)
- **Phase 3**: User Story 1 - Browse All Camera Snapshots [P1] (T011-T024)
- **Phase 4**: User Story 2 - View Individual Camera Details [P2] (T025-T037)
- **Phase 5**: User Story 3 - Navigate Between Cameras [P3] (T038-T043)
- **Phase 6**: Polish & Cross-Cutting Concerns (T044-T048)

---

## Phase 1: Setup & Infrastructure

**Goal**: Initialize Hugo project and establish repository structure

### T001 - Initialize Hugo site [Setup]
**File**: `config.toml` (new)  
**Description**: Create Hugo site in repository root with basic configuration
- Run: `hugo new site . --force` (in empty directory or existing git repo)
- Configure baseURL, title, theme settings
- Set languageCode to "en-us"
- Configure permalinks structure for camera pages

**Dependencies**: None  
**Verification**: `hugo version` works, `config.toml` exists

---

### T002 - Create project directory structure [Setup] [P]
**Files**: Multiple directories  
**Description**: Create all required directories per plan.md structure
- `mkdir -p collector data/images .github/workflows layouts/cameras layouts/partials assets/css assets/js content/cameras static`
- Verify structure matches plan.md

**Dependencies**: T001  
**Verification**: All directories exist

---

### T003 - Set up Git and branch [Setup] [P]
**File**: `.gitignore`  
**Description**: Configure version control for Hugo project
- Create `.gitignore` with Hugo-specific patterns: `/public/`, `/resources/_gen/`, `.hugo_build.lock`
- Commit initial structure
- Ensure on branch `001-mauna-kea-camera`

**Dependencies**: T001  
**Verification**: Git status clean, correct branch

---

### T004 - Create cameras.json schema file [Setup] [P]
**File**: `collector/cameras.json` (new)  
**Description**: Create camera configuration file with schema structure
- Copy schema from `specs/001-mauna-kea-camera/contracts/cameras-schema.json`
- Create empty cameras array: `{"cameras": []}`
- Add inline comment with schema reference

**Dependencies**: T002  
**Verification**: Valid JSON, validates against schema

---

### T005 - Create README.md with build instructions [Setup] [P]
**File**: `README.md` (new)  
**Description**: Document project setup and build process
- Hugo installation instructions
- Local development: `hugo server -D`
- Build command: `hugo --minify`
- Reference quickstart.md for detailed setup

**Dependencies**: T001  
**Verification**: Instructions are clear and accurate

---

### T006 - Add sample camera data [Setup]
**File**: `collector/cameras.json`  
**Description**: Populate with 3-5 sample cameras for development
- Use realistic camera names (e.g., "Summit North", "Keck East")
- Include mix of directions (N, E, SW, Up)
- Use placeholder image URIs (can be same test image)
- Validate against JSON schema

**Dependencies**: T004  
**Verification**: JSON validates, 3-5 cameras defined

---

## Phase 2: Foundational Prerequisites

**Goal**: Set up core infrastructure needed by all user stories (BLOCKING)

### T007 - Create base HTML structure [Foundation]
**File**: `layouts/partials/head.html` (new)  
**Description**: Create HTML head partial with meta tags and CSS link
- Viewport meta tag for responsive design
- Charset UTF-8
- Title tag with site.Title variable
- Link to main.css: `{{ $css := resources.Get "css/main.css" | minify }}`

**Dependencies**: T001  
**Verification**: Valid HTML5, no errors

---

### T008 - Create CSS custom properties and base styles [Foundation]
**File**: `assets/css/main.css` (new)  
**Description**: Implement dark theme color palette and reset styles
- Define CSS variables from plan.md Implementation Specifications (FR-023)
- Box-sizing, margin/padding reset
- Body background and text color
- System font stack (FR-030)

**Dependencies**: T002  
**Verification**: CSS validates, colors match spec

---

### T009 - Create timestamp formatting utility [Foundation] [P]
**File**: `assets/js/main.js` (new)  
**Description**: JavaScript function to parse and format snapshot timestamps
- Function: `formatTimestamp(filename)` - parses YYYY_MM_DD_HH_MM.webp
- Uses `Intl.DateTimeFormat` per plan.md (FR-029)
- Returns "MMM DD, YYYY, h:mm A" format
- Fallback: "Timestamp unavailable" for invalid formats

**Dependencies**: T002  
**Verification**: Test with sample filenames, correct output

---

### T010 - Create Hugo data access helper [Foundation] [P]
**File**: `layouts/partials/camera-data.html` (new)  
**Description**: Partial to load and iterate cameras.json
- Access: `$.Site.Data.cameras.cameras`
- Handle missing data gracefully
- Sort cameras by ID for consistent ordering

**Dependencies**: T007  
**Verification**: Can access camera data in templates

---

## Phase 3: User Story 1 - Browse All Camera Snapshots [P1]

**Goal**: Users can view all 34 cameras on landing page with uniform cards

**Independent Test Criteria**:
- Landing page displays exactly 34 camera cards (or number in cameras.json)
- All cards are uniform square dimensions
- Each card shows: camera name, direction, timestamp, image
- Dark theme with WCAG AA contrast
- Grid adapts to viewport (6/4/2 columns)

### T011 - Create landing page template structure [US1]
**File**: `layouts/index.html` (new)  
**Description**: Create main landing page HTML structure
- Include head partial
- Create main container with grid class
- Range loop over camera data: `{{ range $.Site.Data.cameras.cameras }}`
- Empty card structure (will fill in next tasks)

**Dependencies**: T007, T010  
**Verification**: Page renders, loops through cameras

---

### T012 - Implement camera card grid layout [US1]
**File**: `assets/css/main.css`  
**Description**: Add CSS Grid layout for camera cards (FR-017, FR-019)
- `.camera-grid` with responsive columns per plan.md specs
- Desktop (≥1200px): 6 columns
- Tablet (768-1199px): 4 columns
- Mobile (<768px): 2 columns
- Gap: 24px desktop/tablet, 16px mobile

**Dependencies**: T008  
**Verification**: Grid responds correctly at breakpoints

---

### T013 - Style camera card container [US1]
**File**: `assets/css/main.css`  
**Description**: Implement card dimensions and base styling (FR-016, FR-020)
- `.camera-card`: 320x320px, aspect-ratio 1/1
- Padding: 16px
- Background: var(--bg-secondary)
- Border: 1px solid var(--border)
- Border-radius: 8px

**Dependencies**: T012  
**Verification**: Cards are perfect squares with correct spacing

---

### T014 - Implement card image display with cropping [US1]
**File**: `assets/css/main.css`  
**Description**: Style camera images to fill square cards (FR-018)
- `.camera-card img`: width 100%, height 100%
- `object-fit: cover`, `object-position: center`
- Handle missing images with background color

**Dependencies**: T013  
**Verification**: Non-square images crop to fill card

---

### T015 - Add camera card metadata HTML [US1]
**File**: `layouts/index.html`  
**Description**: Add camera name, direction, timestamp to card template (FR-003)
- Camera name in `.camera-name` div
- Direction in `.camera-direction` span
- Timestamp placeholder (will add JS formatting later)
- Wrap in metadata container div

**Dependencies**: T011  
**Verification**: All metadata displays on cards

---

### T016 - Style card typography [US1]
**File**: `assets/css/main.css`  
**Description**: Implement text hierarchy for card metadata (FR-025, FR-026, FR-027, FR-028)
- `.camera-name`: 18px, weight 600, color var(--text-primary)
- `.camera-direction`: 14px, weight 400, color var(--text-secondary)
- `.camera-timestamp`: 13px, weight 400, color var(--text-secondary)
- Text truncation for long names with ellipsis
- Add `title` attribute to `.camera-name` for names exceeding 40 characters

**Dependencies**: T015  
**Verification**: Text sizes match spec, hierarchy clear, long names show ellipsis with title tooltip

---

### T017 - Find latest snapshot for each camera [US1]
**File**: `layouts/index.html`  
**Description**: Hugo logic to determine latest snapshot image path
- Use `readDir` to list files in `data/images/{{ .id }}/`
- Sort by filename (reverse chronological)
- Get first file as latest snapshot
- Set image src to latest snapshot path

**Dependencies**: T015  
**Verification**: Latest image displays on each card

---

### T018 - Format timestamps on cards [US1]
**File**: `layouts/index.html`  
**Description**: Add JavaScript to format snapshot timestamps
- Add data attribute with filename to timestamp element
- Call `formatTimestamp()` on page load for all cards
- Update timestamp text with formatted result

**Dependencies**: T009, T017  
**Verification**: Timestamps show "Oct 11, 2025, 2:30 PM" format

---

### T019 - Implement hover state for cards [US1]
**File**: `assets/css/main.css`  
**Description**: Add interactive hover feedback (FR-031)
- `.camera-card:hover`: border-color var(--accent)
- Box-shadow: `0 4px 12px rgba(74, 158, 255, 0.2)`
- Transform: `translateY(-2px)`
- Transition: `all 200ms ease-out`

**Dependencies**: T013  
**Verification**: Smooth hover animation with lift effect

---

### T020 - Implement keyboard focus state [US1]
**File**: `assets/css/main.css`  
**Description**: Add accessible focus indicator (FR-032, FR-042)
- `.camera-card:focus`: outline 2px solid var(--accent)
- `outline-offset: 4px`
- No transform (avoid motion for a11y)
- Ensure visible on all backgrounds

**Dependencies**: T013  
**Verification**: Focus ring visible when tabbing

---

### T021 - Add ARIA labels to cards [US1]
**File**: `layouts/index.html`  
**Description**: Implement screen reader accessibility (FR-038)
- Add `aria-label` to each card link
- Format: "Camera: {{ .name }}, Direction: {{ .direction }}, Last updated: {{ .timestamp }}"
- Handle missing direction/timestamp with "unavailable"

**Dependencies**: T015  
**Verification**: Screen reader announces full context

---

### T022 - Implement "Image unavailable" placeholder [US1]
**File**: `layouts/index.html`, `assets/css/main.css`  
**Description**: Handle missing camera images (FR-004)
- Check if snapshot exists before displaying
- If missing: show `.image-placeholder` div
- Include camera-off icon (SVG inline)
- Text: "Image unavailable" (16px, grayed italic style)
- CSS: centered layout, same 320x320 dimensions, matching card styling

**Dependencies**: T017  
**Verification**: Placeholder shows when no image exists with proper styling

---

### T023 - Handle missing metadata gracefully [US1]
**File**: `layouts/index.html`, `assets/css/main.css`  
**Description**: Display unavailable messages for missing data (FR-005, FR-006)
- Direction: "Direction unavailable" if empty
- Timestamp: "Timestamp unavailable" if can't parse
- Style: `.unavailable` class with italic font, grayed color (#808080), opacity 0.7

**Dependencies**: T016  
**Verification**: Missing data shows appropriate message with grayed italic styling

---

### T024 - Verify WCAG AA contrast compliance [US1]
**File**: `assets/css/main.css`  
**Description**: Validate color contrast ratios (FR-012, FR-024, SC-005)
- Test primary text (#e0e0e0) on primary bg (#1a1a1a): ≥11.5:1
- Test secondary text (#b0b0b0) on card bg (#2a2a2a): ≥7.2:1
- Test accent (#4a9eff) on primary bg: ≥5.8:1
- Use WebAIM contrast checker or browser DevTools

**Dependencies**: T008  
**Verification**: All ratios meet or exceed WCAG AA (4.5:1)

---

**🎯 Checkpoint: User Story 1 Complete**
- Landing page displays all cameras in uniform grid
- Dark theme with accessible contrast
- Responsive layout (6/4/2 columns)
- Keyboard navigable with focus indicators
- Missing data handled gracefully
- **Independent Test**: Load landing page, verify all acceptance scenarios for US1

---

## Phase 4: User Story 2 - View Individual Camera Details [P2]

**Goal**: Users can click camera cards to view detail page with large snapshot and history

**Independent Test Criteria**:
- Clicking any card navigates to detail page
- Detail page shows camera metadata at top (sticky header)
- Latest snapshot displayed large (800-1200px)
- Up to 10 historical snapshots in horizontal scrollable row
- Back navigation to landing page

### T025 - Make camera cards clickable links [US2]
**File**: `layouts/index.html`  
**Description**: Convert cards to links for navigation (FR-007)
- Wrap card content in `<a href="/cameras/{{ .id }}/">`
- Add `tabindex="0"` for keyboard accessibility
- Ensure entire card is clickable area

**Dependencies**: T011  
**Verification**: Clicking card navigates (will 404 until detail page exists)

---

### T026 - Create camera detail page template [US2]
**File**: `layouts/cameras/single.html` (new)  
**Description**: Create template for individual camera pages (FR-008, FR-009)
- Include head partial
- Create sticky header for metadata
- Main content area for large snapshot
- Historical snapshots section below
- Use Hugo page context to access camera ID

**Dependencies**: T007  
**Verification**: Detail page renders (may be empty initially)

---

### T027 - Configure Hugo to generate camera pages [US2]
**File**: `config.toml`  
**Description**: Set up Hugo to create pages from cameras.json data
- May need to create stub markdown files in `content/cameras/`
- Or use data file to generate pages dynamically
- Configure permalink structure: `/cameras/{id}/`

**Dependencies**: T026  
**Verification**: Hugo generates 34 camera pages

---

### T028 - Implement sticky header on detail page [US2]
**File**: `layouts/cameras/single.html`, `assets/css/main.css`  
**Description**: Create sticky metadata header (FR-044)
- HTML: `.camera-detail-header` with name, direction, timestamp
- CSS: `position: sticky; top: 0; z-index: 100;`
- Background: `rgba(42, 42, 42, 0.8)` with `backdrop-filter: blur(10px)`
- Height: 80px

**Dependencies**: T026  
**Verification**: Header stays visible while scrolling

---

### T029 - Display large latest snapshot on detail page [US2]
**File**: `layouts/cameras/single.html`, `assets/css/main.css`  
**Description**: Show prominent latest image (FR-021)
- Find latest snapshot (same logic as T017)
- Image in `.camera-detail-image` class
- CSS: `min-width: 800px; max-width: 1200px;`
- Mobile: `width: 100%;`
- Center in viewport

**Dependencies**: T028  
**Verification**: Large image displays prominently

---

### T030 - List historical snapshots [US2]
**File**: `layouts/cameras/single.html`  
**Description**: Find up to 10 previous snapshots for camera (FR-010)
- Use `readDir` on `data/images/{{ .id }}/`
- Sort by filename (reverse chronological)
- Skip the latest snapshot (already displayed in main view)
- Take next 10 most recent (or all available if fewer than 10)
- Note: This means 11 total images exist (1 current + 10 historical)

**Dependencies**: T026  
**Verification**: Correct snapshots identified, latest excluded from historical row

---

### T031 - Create horizontal scrollable thumbnail row [US2]
**File**: `layouts/cameras/single.html`, `assets/css/main.css`  
**Description**: Display historical snapshots as thumbnails (FR-022)
- HTML: `.snapshot-history` container with flexbox
- Each thumbnail in `.snapshot-thumbnail` class
- CSS: `display: flex; gap: 12px; overflow-x: auto;`
- Thumbnails: 160x160px
- Positioned 32px below main image (FR-045)

**Dependencies**: T030  
**Verification**: Thumbnails scroll horizontally

---

### T032 - Style historical snapshot thumbnails [US2]
**File**: `assets/css/main.css`  
**Description**: Implement thumbnail appearance and hover
- `.snapshot-thumbnail`: 160x160px, aspect-ratio 1/1
- Default opacity: 0.85
- Hover (FR-034): border 2px solid var(--accent), opacity 1.0
- Cursor: pointer
- Border-radius: 4px

**Dependencies**: T031  
**Verification**: Thumbnails have consistent size and hover effect

---

### T033 - Add timestamps to historical snapshots [US2]
**File**: `layouts/cameras/single.html`  
**Description**: Display formatted timestamps for thumbnails (FR-041)
- Add data attribute with filename to each thumbnail
- Call `formatTimestamp()` on page load
- Display below or on hover over thumbnail
- Alt text: "Snapshot from {{ formatTimestamp .filename }}"

**Dependencies**: T032, T009  
**Verification**: Timestamps formatted correctly

---

### T034 - Implement "No previous snapshots" message [US2]
**File**: `layouts/cameras/single.html`, `assets/css/main.css`  
**Description**: Handle cameras with zero historical snapshots (FR-047)
- Check if historical snapshot count is 0 (after excluding latest)
- Display: "No previous snapshots available"
- Style: `.no-snapshots` with secondary text color
- Show instead of empty thumbnail row

**Dependencies**: T030  
**Verification**: Message appears when no history exists

---

### T035 - Add back navigation link [US2]
**File**: `layouts/cameras/single.html`, `assets/css/main.css`  
**Description**: Create link to return to landing page (FR-013, FR-040)
- Add link: `<a href="/" aria-label="Return to all cameras">`
- Include back icon (SVG) + "All Cameras" text
- Style: Accent color, keyboard accessible
- Position: Top of page or in header

**Dependencies**: T028  
**Verification**: Link navigates back to landing page

---

### T036 - Handle missing images on detail page [US2]
**File**: `layouts/cameras/single.html`  
**Description**: Show placeholder if no snapshots exist
- Check if latest snapshot exists
- If missing: show same placeholder as landing page
- Message: "Image unavailable"
- Camera metadata still displayed

**Dependencies**: T029, T022  
**Verification**: Placeholder shows gracefully

---

### T037 - Add active/pressed state to thumbnails [US2]
**File**: `assets/css/main.css`  
**Description**: Visual feedback when clicking thumbnails (FR-033)
- `.snapshot-thumbnail:active`: slight opacity reduction
- Optional: Open larger view modal (future enhancement)

**Dependencies**: T032  
**Verification**: Visual feedback on click

---

**🎯 Checkpoint: User Story 2 Complete**
- Camera cards navigate to detail pages
- Detail pages show large latest snapshot
- Historical snapshots display in scrollable row
- Back navigation works
- Missing images handled
- **Independent Test**: Click any card, verify all acceptance scenarios for US2

---

## Phase 5: User Story 3 - Navigate Between Cameras [P3]

**Goal**: Users can navigate between camera detail pages without returning to landing

**Independent Test Criteria**:
- Next/Previous buttons on detail pages
- Camera position indicator (e.g., "5 of 34")
- Optional: Camera selector dropdown
- Keyboard accessible navigation

### T038 - Create camera navigation partial [US3]
**File**: `layouts/partials/camera-nav.html` (new)  
**Description**: Reusable navigation component for detail pages
- Determine current camera position in list
- Identify next and previous cameras
- Handle edge cases (first/last camera)

**Dependencies**: T026  
**Verification**: Can identify adjacent cameras

---

### T039 - Add previous/next navigation buttons [US3]
**File**: `layouts/partials/camera-nav.html`, `assets/css/main.css`  
**Description**: Create arrow buttons for sequential navigation
- Previous button: `<a href="/cameras/{{ .prev.id }}/">← Previous</a>`
- Next button: `<a href="/cameras/{{ .next.id }}/">Next →</a>`
- Disable if at start/end of list
- Style: Accent color, 44x44 touch target

**Dependencies**: T038  
**Verification**: Buttons navigate to correct cameras

---

### T040 - Display camera position indicator [US3]
**File**: `layouts/partials/camera-nav.html`  
**Description**: Show "Camera X of 34" text
- Calculate current position (index + 1)
- Total count: `len $.Site.Data.cameras.cameras`
- Display in navigation area

**Dependencies**: T038  
**Verification**: Shows correct position

---

### T041 - Include navigation in detail page [US3]
**File**: `layouts/cameras/single.html`  
**Description**: Add camera navigation partial to detail template
- Include partial: `{{ partial "camera-nav.html" . }}`
- Position near top (in sticky header or below)
- Or at bottom after snapshots

**Dependencies**: T038  
**Verification**: Navigation displays on all detail pages

---

### T042 - Add keyboard shortcuts for navigation [US3]
**File**: `assets/js/main.js`  
**Description**: Optional: Arrow key navigation between cameras
- Listen for ArrowLeft/ArrowRight keypress
- Navigate to previous/next camera
- Only when not in input field

**Dependencies**: T039  
**Verification**: Arrow keys navigate between cameras

---

### T043 - Optional: Add camera selector dropdown [US3]
**File**: `layouts/partials/camera-nav.html`, `assets/css/main.css`  
**Description**: Dropdown to jump to any camera directly
- `<select>` with all camera names
- onChange: navigate to selected camera
- Current camera pre-selected

**Dependencies**: T038  
**Verification**: Dropdown navigates to any camera

---

**🎯 Checkpoint: User Story 3 Complete**
- Next/Previous navigation works
- Position indicator displays
- Can navigate entire set without landing page
- **Independent Test**: Navigate through cameras sequentially, verify all acceptance scenarios for US3

---

## Phase 6: Polish & Cross-Cutting Concerns

**Goal**: Final optimizations, error handling, and production readiness

### T044 - Add loading skeleton states [Polish]
**File**: `assets/css/main.css`, `assets/js/main.js`  
**Description**: Implement loading placeholders (FR-046, SC-012)
- CSS: `.skeleton` with shimmer animation
- Show skeleton cards on initial page load
- Replace with real images once loaded
- Shimmer animation keyframes (1.5s duration)

**Dependencies**: T008  
**Verification**: Skeletons appear within 100ms of load

---

### T045 - Optimize images for WebP [Polish]
**File**: `collector/fetch-snapshots.sh` (new)  
**Description**: Create bash script to convert snapshots to WebP using cwebp
- Read cameras.json with jq
- For each camera: fetch image from URI
- Convert to WebP: `cwebp -q 80 input.jpg -o output.webp`
- Save as `data/images/{id}/{timestamp}.webp`
- Keep only 11 most recent per camera (1 current + 10 historical)

**Dependencies**: T004  
**Verification**: Script downloads and converts images to WebP format

---

### T046 - Create GitHub Actions workflow [Polish]
**File**: `.github/workflows/fetch-snapshots.yml` (new)  
**Description**: Automate snapshot collection every 20 minutes
- Trigger: `schedule: cron '*/20 * * * *'`
- Steps: Checkout, run fetch script, commit images, push
- Only run if images changed

**Dependencies**: T045  
**Verification**: Workflow runs successfully on schedule

---

### T047 - Populate full cameras.json [Polish]
**File**: `collector/cameras.json`  
**Description**: Add all 34 cameras with real data
- Replace sample data from T006
- Include real camera names, directions, URIs
- Validate against JSON schema
- Ensure all required fields present

**Dependencies**: T006  
**Verification**: 34 cameras defined, schema validates

---

### T048 - Build and test production site [Polish]
**File**: N/A  
**Description**: Final production build and validation
- Run: `hugo --minify`
- Verify: All 34 cameras in landing page
- Test: Detail pages for all cameras
- Check: Performance (SC-001 - load within 3 seconds)
- Validate: Accessibility with axe DevTools
- Test: Responsive breakpoints
- **Constitution compliance**: Verify all content is .md format, all data is .json format (FR-014, FR-015)

**Dependencies**: All previous tasks  
**Verification**: Site ready for deployment, constitution compliance confirmed

---

## Dependencies Graph

```
Setup & Infrastructure (T001-T006)
    ↓
Foundational Prerequisites (T007-T010) [BLOCKING - must complete before user stories]
    ↓
    ├─→ User Story 1: Landing Page (T011-T024) [P1] ✓ MVP
    │       ↓
    ├─→ User Story 2: Detail Pages (T025-T037) [P2]
    │       ↓
    └─→ User Story 3: Navigation (T038-T043) [P3]
            ↓
Polish & Production (T044-T048)
```

**User Story Dependencies**:
- US1 is fully independent (MVP candidate)
- US2 depends on US1 (needs landing page cards to click)
- US3 depends on US2 (needs detail pages to navigate between)

---

## Parallel Execution Opportunities

### Phase 1 (Setup) - Parallelizable:
- T002, T003, T005 can run in parallel after T001
- T004, T006 sequential (T006 needs T004)

### Phase 2 (Foundation) - Parallelizable:
- T008, T009, T010 can all run in parallel after T007

### Phase 3 (US1) - Some Parallel:
- T012-T014 (CSS) can run parallel
- T016, T019-T020 (additional CSS) can run parallel
- T009, T018 sequential (T018 needs T009)
- T021-T024 can run near-parallel (different files)

### Phase 4 (US2) - Some Parallel:
- T026, T027, T028 can overlap (different files)
- T031-T033 (CSS + HTML) can partially overlap
- T034-T037 can run near-parallel

### Phase 5 (US3) - Mostly Sequential:
- T038 must complete first (core logic)
- T039-T043 depend on T038

### Phase 6 (Polish) - Parallelizable:
- T044, T045, T047 can run in parallel
- T046 depends on T045
- T048 must be last

---

## Implementation Strategy

### MVP Scope (User Story 1 Only)
**Tasks**: T001-T024 (24 tasks)  
**Deliverable**: Landing page with all 34 cameras, clickable cards (even if detail pages 404)  
**Value**: Complete camera overview dashboard  
**Timeline**: ~1-2 days

### Increment 2 (Add User Story 2)
**Tasks**: T025-T037 (13 tasks)  
**Deliverable**: Full camera detail pages with history  
**Value**: Deep-dive into individual cameras  
**Timeline**: +1 day

### Increment 3 (Add User Story 3)
**Tasks**: T038-T043 (6 tasks)  
**Deliverable**: Inter-camera navigation  
**Value**: Power user workflow efficiency  
**Timeline**: +0.5 day

### Production Polish
**Tasks**: T044-T048 (5 tasks)  
**Deliverable**: Automated collection, production build  
**Value**: Fully autonomous system  
**Timeline**: +0.5 day

**Total Estimated Timeline**: 3-4 days for complete implementation

---

## Testing Strategy

**Note**: Tests are not included as spec.md did not request TDD approach. Manual testing criteria provided for each user story checkpoint.

### Manual Test Plan

**After Phase 3 (US1)**:
1. Load landing page in browser
2. Verify 34 camera cards display (or number in cameras.json)
3. Check all cards are uniform squares (320x320px)
4. Verify each card shows name, direction, timestamp, image
5. Test responsive breakpoints (resize browser)
6. Tab through cards to verify keyboard navigation
7. Check hover effects on each card
8. Verify dark theme colors
9. Test with missing data (remove direction from one camera)
10. Validate WCAG AA contrast with axe DevTools

**After Phase 4 (US2)**:
1. Click each camera card
2. Verify navigation to detail page
3. Check sticky header stays visible when scrolling
4. Verify large snapshot displays
5. Check historical snapshot thumbnails (scroll horizontally)
6. Click thumbnails to verify interaction
7. Click back button to return to landing
8. Test camera with <10 snapshots
9. Test camera with 0 snapshots (verify message)
10. Test camera with missing images (verify placeholder)

**After Phase 5 (US3)**:
1. Navigate to any camera detail page
2. Click "Next" button, verify navigation
3. Click "Previous" button, verify navigation
4. Check position indicator shows correct "X of 34"
5. Navigate through entire camera set sequentially
6. Test edge cases (first camera, last camera)
7. If dropdown implemented: Test jumping to random cameras

**After Phase 6 (Polish)**:
1. Run `hugo --minify` and build site
2. Load site and check performance (network tab <3s)
3. Test all functionality from phases 3-5
4. Run accessibility audit (axe DevTools)
5. Test on mobile device or responsive mode
6. Verify GitHub Actions workflow runs (if scheduled)
7. Check that WebP images are correctly formatted

---

## Success Criteria Validation

- **SC-001**: Load landing page, check network tab shows <3 seconds total load time
- **SC-002**: Measure cards with DevTools, verify all are 320x320px
- **SC-003**: Click any card, verify single-click navigation works
- **SC-004**: Count thumbnails on detail pages, verify ≤10 shown
- **SC-005**: Run axe DevTools, verify all contrast ratios pass WCAG AA
- **SC-006**: Navigate through all pages, verify no broken links
- **SC-007**: Inspect cards, verify identical dimensions at all breakpoints
- **SC-008**: Resize browser, verify column counts change at breakpoints
- **SC-009**: Observe hover animations, verify smooth transitions
- **SC-010**: Inspect interactive elements, verify 44x44px minimum
- **SC-011**: Tab through entire site, verify all cards/links reachable
- **SC-012**: Throttle network, verify skeleton states appear promptly

---

## Notes

- No npm dependencies required - all vanilla HTML/CSS/JS
- Hugo installation is only external dependency
- All tasks assume working knowledge of Hugo templating
- CSS custom properties used throughout for maintainability
- Tasks are ordered for incremental delivery and testing
- Each phase checkpoint produces testable, shippable increment
