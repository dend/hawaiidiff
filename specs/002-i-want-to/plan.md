# Implementation Plan: Telescope Search and Direction Filter

**Branch**: `002-i-want-to` | **Date**: 2025-10-14 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-i-want-to/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Add client-side search and filtering capabilities to the main landing page, allowing users to search telescope cameras by name and filter by direction. Implementation uses vanilla JavaScript for real-time filtering of the existing Hugo-generated camera grid, with toggle buttons for direction filters and responsive design that adapts filter controls for mobile screens. No new dependencies required - extends existing static site architecture.

## Technical Context

**Language/Version**: Vanilla JavaScript (ES6+), HTML5, CSS3  
**Primary Dependencies**: Hugo (static site generator) - already in use, no new dependencies  
**Storage**: N/A - data exists in `data/cameras.json`, filtering happens client-side  
**Testing**: Manual browser testing across device sizes (320px-1920px), keyboard navigation testing  
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge - last 2 versions)  
**Project Type**: Static website with client-side interactivity  
**Performance Goals**: <100ms search/filter response time, instant UI updates  
**Constraints**: No server-side processing, no external dependencies, works offline after initial page load  
**Scale/Scope**: ~35 cameras currently, filter interface with 2 controls (search box + direction dropdown)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Static-First Compliance
- [x] Feature implementable as static website (no server-side processing) - All filtering happens client-side in browser
- [x] No external service dependencies (APIs, databases, CDNs) - Uses existing camera data from JSON file
- [x] All content/data exists as files in repository - Cameras data in data/cameras.json
- [x] Build process runs entirely on local machine - Hugo builds static HTML/CSS/JS

### Content and Data Format Compliance
- [x] All content files use Markdown (.md) format - No new content files, existing structure maintained
- [x] All structured data uses JSON (.json) format - Uses existing data/cameras.json
- [x] No YAML, XML, or other data formats introduced - No new data formats
- [x] No proprietary content formats - HTML/CSS/JS only

### Dependency Compliance
- [x] New dependencies justified in writing (if any) - No new dependencies added
- [x] Existing standard tools preferred over new libraries - Uses vanilla JavaScript, no frameworks
- [x] Complexity debt documented for non-standard tooling - No non-standard tooling

### Build Compliance
- [x] Build process documented in repository - Existing Hugo build process unchanged
- [x] Build completes offline (no network required) - Hugo builds locally with existing files
- [x] Build uses standard, widely-available tools - Hugo (already in use)
- [x] Build artifacts are deterministic and reproducible - Hugo static site generation

**Constitution Status**: ✅ FULL COMPLIANCE - No violations. Feature extends existing static site with client-side JavaScript filtering.

## Project Structure

### Documentation (this feature)

```
specs/002-i-want-to/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── filter-api.md    # Client-side filter API contract
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```
assets/
├── css/
│   └── main.css         # Add filter UI styles, toggle button styles, responsive mobile styles
└── js/
    └── main.js          # Add filter logic (search, direction toggle handling, mobile toggle)

layouts/
├── index.html           # Add filter UI controls above camera grid
└── partials/
    └── filters.html     # New: Filter controls partial (search box, direction toggle buttons)

data/
└── cameras.json         # Existing: Camera data (no changes needed)
```

**Structure Decision**: Extends existing Hugo static site structure. No new directories needed. Filter UI added to layouts, JavaScript filtering logic added to existing main.js, CSS for filter controls (including toggle button styles) added to existing main.css. Follows established pattern of client-side enhancements to static Hugo-generated content.

## Complexity Tracking

*No Constitution violations - this section intentionally left empty.*
