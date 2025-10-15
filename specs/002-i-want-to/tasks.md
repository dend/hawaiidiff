# Tasks: Telescope Search and Direction Filter

**Input**: Design documents from `/specs/002-i-want-to/`  
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, contracts/ ✓

**Tests**: No test tasks included - manual browser testing specified in plan.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions
- Static site structure at repository root
- Templates: `layouts/`, partials: `layouts/partials/`
- Assets: `assets/css/`, `assets/js/`
- Data: `data/cameras.json` (existing, no modifications)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify Hugo environment and create shared filter UI structure

- [x] T001 Verify Hugo builds successfully and existing site structure intact
- [x] T002 Create filter controls HTML partial in layouts/partials/filters.html
- [x] T003 Add data attributes to camera cards in layouts/index.html (data-camera-id, data-camera-name, data-camera-direction)

**Checkpoint**: Filter UI structure in place, ready for styling and JavaScript implementation

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core filter UI and CSS framework that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Add base filter container styles in assets/css/main.css (layout, spacing, positioning above grid)
- [x] T005 Add no-results message container HTML in layouts/partials/filters.html (hidden by default)
- [x] T006 Add clear filters button HTML in no-results message
- [x] T007 Initialize JavaScript filter module in assets/js/main.js (DOMContentLoaded handler, cache DOM references)
- [x] T008 Implement getCameraElements() utility function in assets/js/main.js to extract camera data from DOM
- [x] T009 Implement getUniqueDirections() utility function in assets/js/main.js to extract direction values
- [x] T010 Implement createDirectionToggleButtons() function in assets/js/main.js to dynamically generate toggle buttons with click handlers
- [x] T011 Implement debounce() utility function in assets/js/main.js (100ms delay for search input)

**Checkpoint**: Foundation ready - filter UI visible, JavaScript initialized, utility functions available

---

## Phase 3: User Story 1 - Search Telescopes by Name (Priority: P1) 🎯 MVP

**Goal**: Enable users to search telescope cameras by typing part of the camera name, with real-time case-insensitive filtering

**Independent Test**: Type "CFHT" in search box → only CFHT cameras visible. Type "gemini" (lowercase) → all Gemini cameras visible. Clear search → all cameras visible.

### Implementation for User Story 1

- [x] T012 [P] [US1] Add search input field HTML in layouts/partials/filters.html with id, placeholder, aria-label
- [x] T013 [P] [US1] Add search input styles in assets/css/main.css (desktop horizontal layout)
- [x] T014 [US1] Implement filter state management in assets/js/main.js (getFilterState, updateFilterState functions)
- [x] T015 [US1] Implement matchesSearch() function in assets/js/main.js (case-insensitive partial name matching per FR-003, FR-004)
- [x] T016 [US1] Implement showCamera() and hideCamera() functions in assets/js/main.js (DOM visibility manipulation)
- [x] T017 [US1] Implement applyFilters() function in assets/js/main.js (iterate cameras, apply search filter, show/hide)
- [x] T018 [US1] Implement handleSearchInput() event handler in assets/js/main.js (debounced, calls updateFilterState)
- [x] T019 [US1] Attach search input event listener in initCameraFilter() function in assets/js/main.js
- [x] T020 [US1] Implement updateNoResultsMessage() function in assets/js/main.js (show/hide based on visible camera count per FR-009)
- [x] T021 [US1] Add no-results message styles in assets/css/main.css (centered in grid area per clarification Q3)
- [ ] T022 [US1] Test search with full camera names ("CFHT-C4", "Gemini North") - MANUAL TESTING REQUIRED
- [ ] T023 [US1] Test search with partial names ("CFHT", "gem", "ukirt") - MANUAL TESTING REQUIRED
- [ ] T024 [US1] Test case-insensitive search (lowercase, uppercase, mixed case) - MANUAL TESTING REQUIRED
- [ ] T025 [US1] Test clearing search input returns all cameras - MANUAL TESTING REQUIRED
- [ ] T026 [US1] Test no results scenario (search term "xyz123") shows message - MANUAL TESTING REQUIRED
- [ ] T027 [US1] Verify search updates in <100ms using browser DevTools Performance tab (SC-002) - MANUAL TESTING REQUIRED

**Checkpoint**: User Story 1 implementation complete - search functionality ready for testing

---

## Phase 4: User Story 2 - Filter Telescopes by Direction (Priority: P2)

**Goal**: Enable users to filter cameras by selecting one or more directions using toggle buttons (pills/chips)

**Independent Test**: Click "North" toggle button → only N cameras visible, button shows active state. Click "South" toggle → N and S cameras visible, both buttons active. Click "North" again to deactivate → only S cameras visible, North button inactive.

### Implementation for User Story 2

- [x] T028 [P] [US2] Add direction filter toggle button container HTML in layouts/partials/filters.html (container div with id, aria-label)
- [x] T029 [P] [US2] Add direction toggle button styles in assets/css/main.css (pill/chip design with active/inactive states, desktop horizontal alignment with search)
- [x] T030 [US2] Call createDirectionToggleButtons() in initCameraFilter() to generate buttons from camera data
- [x] T031 [US2] Implement matchesDirection() function in assets/js/main.js (Set-based multi-select logic per FR-007, FR-014)
- [x] T032 [US2] Update applyFilters() function in assets/js/main.js to include direction filtering logic
- [x] T033 [US2] Implement handleDirectionToggle() event handler in assets/js/main.js (toggles direction in selectedDirections Set, updates button state)
- [x] T034 [US2] Implement updateToggleButtonState() function in assets/js/main.js to add/remove active class on buttons
- [ ] T035 [US2] Test single direction selection ("N", "S", "E", "W") and verify button shows active state - MANUAL TESTING REQUIRED
- [ ] T036 [US2] Test multiple direction selection (click "N" and "S" buttons, both show active state) - MANUAL TESTING REQUIRED
- [ ] T037 [US2] Test deselecting all directions returns all cameras and all buttons show inactive state - MANUAL TESTING REQUIRED
- [ ] T038 [US2] Test non-standard direction values display correctly as toggle buttons ("Up", "Hilo", "ESE", "NW" per FR-013) - MANUAL TESTING REQUIRED
- [ ] T039 [US2] Test cameras with missing direction values excluded from direction filtering but visible when no filter active (FR-014) - MANUAL TESTING REQUIRED
- [ ] T040 [US2] Test no results scenario (select direction with no matching cameras) shows message - MANUAL TESTING REQUIRED
- [ ] T041 [US2] Verify direction filter updates in <2 seconds (SC-003) - MANUAL TESTING REQUIRED

**Checkpoint**: User Story 2 implementation complete - direction filtering ready for testing

---

## Phase 5: User Story 3 - Combine Search and Direction Filters (Priority: P3)

**Goal**: Enable users to use search and direction filters together with AND logic for precise results

**Independent Test**: Type "CFHT" in search AND click "North" toggle button → only CFHT cameras facing North visible, button active. Clear search → only North-facing cameras visible, button still active. Click "North" button to deactivate → only CFHT cameras visible.

### Implementation for User Story 3

- [x] T042 [US3] Update matchesFilters() function in assets/js/main.js to combine matchesSearch() and matchesDirection() with AND logic (FR-008)
- [x] T043 [US3] Update applyFilters() to use combined matchesFilters() function
- [x] T044 [US3] Implement clearAllFilters() function in assets/js/main.js (resets search text, direction selection, and toggle button states)
- [x] T045 [US3] Implement handleClearFilters() event handler in assets/js/main.js (calls clearAllFilters, triggers applyFilters)
- [x] T046 [US3] Attach clear filters button click event listener in initCameraFilter() function in assets/js/main.js
- [x] T047 [US3] Add clear filters button styles in assets/css/main.css (prominent button in no-results message)
- [ ] T048 [US3] Test combined search + single direction filter ("CFHT" + "N" button active) - MANUAL TESTING REQUIRED
- [ ] T049 [US3] Test combined search + multiple direction filters ("gemini" + "N" + "S" buttons both active) - MANUAL TESTING REQUIRED
- [ ] T050 [US3] Test clearing search while direction filter active (only direction filter remains, button still active) - MANUAL TESTING REQUIRED
- [ ] T051 [US3] Test clearing direction while search active (click active button to deactivate, only search filter remains) - MANUAL TESTING REQUIRED
- [ ] T052 [US3] Test clear all filters button resets both search and direction (all toggle buttons return to inactive state) - MANUAL TESTING REQUIRED
- [ ] T053 [US3] Test combined filters producing zero results shows no-results message with clear button - MANUAL TESTING REQUIRED
- [ ] T054 [US3] Verify filter state resets on page refresh (FR-015) - MANUAL TESTING REQUIRED

**Checkpoint**: User Story 3 implementation complete - combined filtering ready for testing

---

## Phase 6: Mobile Responsive & Polish

**Purpose**: Mobile responsiveness, accessibility, and cross-cutting improvements

- [x] T055 [P] Add mobile filter toggle button HTML in layouts/partials/filters.html (aria-expanded attribute)
- [x] T056 [P] Add mobile responsive styles in assets/css/main.css (media query @768px, collapsible panel per clarification Q5, FR-016)
- [x] T057 [P] Add mobile toggle button styles in assets/css/main.css ("Show Filters" button styling)
- [x] T058 [P] Add mobile panel vertical stack layout in assets/css/main.css (search and direction toggle buttons full-width)
- [x] T059 Implement CSS checkbox hack for filter panel show/hide in assets/css/main.css (no JavaScript needed for toggle)
- [x] T060 Optional: Implement handleFilterToggle() in assets/js/main.js if JavaScript toggle preferred over CSS-only
- [x] T061 Add ARIA labels to all filter controls in layouts/partials/filters.html (aria-label on search, toggle button container per FR-012)
- [x] T062 Add aria-live="polite" to no-results message in layouts/partials/filters.html for screen reader announcements
- [ ] T063 Test mobile layout at 320px width (smallest size per SC-005) - MANUAL TESTING REQUIRED
- [ ] T064 Test mobile layout at 375px width (common phone size) - MANUAL TESTING REQUIRED
- [ ] T065 Test tablet layout at 768px width (breakpoint) - MANUAL TESTING REQUIRED
- [ ] T066 Test desktop layout at 1024px width - MANUAL TESTING REQUIRED
- [ ] T067 Test desktop layout at 1920px width (largest size per SC-005) - MANUAL TESTING REQUIRED
- [ ] T068 Test keyboard navigation (Tab through controls, Enter/Space on toggle buttons per FR-012, SC-004) - MANUAL TESTING REQUIRED
- [ ] T069 Test screen reader with NVDA/JAWS on Windows or VoiceOver on Mac - MANUAL TESTING REQUIRED
- [ ] T070 Test focus indicators visible on all interactive elements - MANUAL TESTING REQUIRED
- [ ] T071 Verify color contrast ratios meet WCAG AA standards (4.5:1 minimum) - MANUAL TESTING REQUIRED
- [ ] T072 Test on Chrome (last 2 versions) - MANUAL TESTING REQUIRED
- [ ] T073 Test on Firefox (last 2 versions) - MANUAL TESTING REQUIRED
- [ ] T074 Test on Safari (last 2 versions) - MANUAL TESTING REQUIRED
- [ ] T075 Test on Edge (last 2 versions) - MANUAL TESTING REQUIRED
- [ ] T076 Measure filter performance with browser DevTools Performance tab (verify <100ms per SC-002) - MANUAL TESTING REQUIRED
- [ ] T077 Verify no page reload on any filter operation (SC-007) - MANUAL TESTING REQUIRED
- [x] T078 Add console error handling for missing DOM elements in assets/js/main.js
- [x] T079 Test graceful degradation if JavaScript initialization fails (all cameras remain visible)
- [x] T080 [P] Run Hugo build and verify no errors
- [ ] T081 [P] Start Hugo server and test all functionality in browser - SERVER RUNNING ON PORT 1313
- [ ] T082 [P] Run quickstart.md validation checklist - MANUAL TESTING REQUIRED
- [x] T083 Code cleanup: remove debug console.log statements from assets/js/main.js
- [x] T084 Code cleanup: optimize CSS selectors and remove unused styles in assets/css/main.css
- [x] T085 Add inline code comments for complex filter logic in assets/js/main.js

**Checkpoint**: Feature complete, responsive, accessible, tested across browsers and devices

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2) - MVP functionality
- **User Story 2 (Phase 4)**: Depends on Foundational (Phase 2) - Independent of US1
- **User Story 3 (Phase 5)**: Depends on US1 and US2 being complete (integrates both)
- **Mobile & Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Independent - can start immediately after Foundational phase
- **User Story 2 (P2)**: Independent - can start immediately after Foundational phase (parallel with US1 if staffed)
- **User Story 3 (P3)**: Depends on US1 and US2 - integrates search + direction filtering

### Within Each User Story

**User Story 1 (Search)**:
- HTML/CSS tasks (T012, T013) can run in parallel
- JavaScript state management (T014) before filtering logic (T015-T020)
- Core filtering (T015-T017) before event handling (T018-T019)
- No-results handling (T020-T021) after core filtering works
- Testing (T022-T027) after implementation complete

**User Story 2 (Direction)**:
- HTML/CSS tasks (T028, T029) can run in parallel
- Toggle button generation (T030) before filtering logic (T031-T034)
- Testing (T035-T041) after implementation complete

**User Story 3 (Combined)**:
- Combine logic (T042-T043) first
- Clear filters feature (T044-T047) after combine logic
- Testing (T048-T054) after implementation complete

### Parallel Opportunities

**Setup Phase**:
- T002 and T003 can run in parallel (different files)

**Foundational Phase**:
- T004, T005, T006 can run in parallel (CSS and HTML in different files)
- T008, T009, T010, T011 can run in parallel (independent utility functions)

**User Story 1**:
- T012 (HTML) and T013 (CSS) can run in parallel
- After US1 complete AND Foundational complete: US2 can start in parallel (if team capacity allows)

**User Story 2**:
- T028 (HTML) and T029 (CSS) can run in parallel

**Mobile & Polish Phase**:
- T055, T056, T057, T058 can run in parallel (independent CSS/HTML)
- T080, T081, T082 can run in parallel (different validation activities)
- T083, T084, T085 can run in parallel (cleanup in different files)

---

## Parallel Example: User Story 1 (Search)

```bash
# After Foundational phase complete, start US1:

# Step 1: HTML and CSS in parallel
Task T012: "Add search input field HTML in layouts/partials/filters.html"
Task T013: "Add search input styles in assets/css/main.css"

# Step 2: JavaScript core (sequential - dependencies)
Task T014: "Implement filter state management in assets/js/main.js"
Task T015: "Implement matchesSearch() function in assets/js/main.js"
Task T016: "Implement showCamera() and hideCamera() functions in assets/js/main.js"
Task T017: "Implement applyFilters() function in assets/js/main.js"

# Step 3: Event handling (sequential - depends on core)
Task T018: "Implement handleSearchInput() event handler in assets/js/main.js"
Task T019: "Attach search input event listener in initCameraFilter()"

# Step 4: No-results handling (depends on filtering working)
Task T020: "Implement updateNoResultsMessage() function in assets/js/main.js"
Task T021: "Add no-results message styles in assets/css/main.css"

# Step 5: All testing tasks (can run together after implementation)
Task T022-T027: Execute all US1 test scenarios
```

---

## Parallel Example: User Story 2 (Direction)

```bash
# After Foundational phase complete (can start parallel with US1 if staffed):

# Step 1: HTML and CSS in parallel
Task T028: "Add direction filter toggle button container HTML in layouts/partials/filters.html"
Task T029: "Add direction toggle button styles in assets/css/main.css"

# Step 2: JavaScript core (sequential)
Task T030: "Call createDirectionToggleButtons() in initCameraFilter()"
Task T031: "Implement matchesDirection() function in assets/js/main.js"
Task T032: "Update applyFilters() to include direction filtering"

# Step 3: Event handling
Task T033: "Implement handleDirectionToggle() event handler"
Task T034: "Implement updateToggleButtonState() function"

# Step 4: All testing tasks
Task T035-T041: Execute all US2 test scenarios
```

---

## MVP Recommendation

**Minimum Viable Product**: User Story 1 only (Search by Name - Tasks T001-T027)

**Rationale**:
- Delivers immediate value (SC-001: find camera in <5 seconds)
- Independently testable and deployable
- ~2-3 hours implementation time for experienced developer
- Validates core filtering architecture before adding direction complexity

**Incremental Delivery Path**:
1. **MVP (US1)**: Deploy search functionality → gather user feedback
2. **V1.1 (US1+US2)**: Add direction filtering with toggle buttons → more advanced users can filter by view
3. **V1.2 (US1+US2+US3)**: Polish combined filtering → power users get precise results
4. **V2.0 (All+Mobile)**: Add mobile responsive design → mobile users get optimized experience

---

## Implementation Strategy

### Suggested Workflow

**Week 1: MVP (US1 - Search)**
- Days 1-2: Setup + Foundational phases (T001-T011)
- Days 3-4: User Story 1 implementation (T012-T021)
- Day 5: User Story 1 testing and fixes (T022-T027)
- **Deploy to production** ✓

**Week 2: Enhanced Filtering (US2)**
- Days 1-2: User Story 2 implementation (T028-T034)
- Day 3: User Story 2 testing and fixes (T035-T041)
- **Deploy to production** ✓

**Week 3: Combined & Mobile (US3 + Polish)**
- Days 1-2: User Story 3 implementation (T042-T047)
- Day 3: User Story 3 testing (T048-T054)
- Days 4-5: Mobile & Polish (T055-T085)
- **Deploy to production** ✓

### Quality Gates

**After each user story**:
- [ ] All acceptance scenarios from spec.md passing
- [ ] Success criteria verified (SC-001 through SC-007)
- [ ] No console errors in browser DevTools
- [ ] Hugo builds successfully
- [ ] Manual testing checklist complete

**Before final deployment**:
- [ ] All 85 tasks marked complete
- [ ] Cross-browser testing passed (T072-T075)
- [ ] Accessibility testing passed (T068-T071)
- [ ] Performance targets met (T076, T077)
- [ ] quickstart.md validation complete (T082)

---

## Task Summary

**Total Tasks**: 85

**By Phase**:
- Phase 1 (Setup): 3 tasks
- Phase 2 (Foundational): 8 tasks
- Phase 3 (US1 - Search): 16 tasks
- Phase 4 (US2 - Direction): 14 tasks
- Phase 5 (US3 - Combined): 13 tasks
- Phase 6 (Mobile & Polish): 31 tasks

**By Type**:
- HTML/Template: 8 tasks
- CSS Styling: 10 tasks
- JavaScript Implementation: 24 tasks
- Testing: 28 tasks
- Build/Deploy: 3 tasks
- Documentation/Cleanup: 4 tasks
- Utility/Setup: 8 tasks

**Parallel Opportunities**: 17 tasks marked [P] can run in parallel with other tasks

**Estimated Total Time**: 
- Experienced developer: 8-10 hours
- New to Hugo/vanilla JS: 12-15 hours
- MVP only (US1): 2-3 hours
