# Implementation Plan: Mauna Kea Camera Snapshot Visualizer

**Branch**: `001-mauna-kea-camera` | **Date**: 2025-10-11 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-mauna-kea-camera/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a static website using Hugo to visualize camera snapshots from 34 Mauna Kea cameras. The site displays all cameras on a landing page with uniform square cards showing camera name, direction, and latest snapshot timestamp. Users can click any card to view camera details with the latest snapshot and up to 10 historical images. A GitHub Actions workflow runs every 20 minutes to download snapshots from camera URIs defined in cameras.json, convert them to WebP format, and store them in the data/images directory organized by camera ID and timestamp. Hugo builds the static site from this data using custom HTML/CSS/JavaScript templates with no external dependencies.

## Technical Context

**Language/Version**: Hugo static site generator (latest stable), Bash shell scripting, HTML5, CSS3, vanilla JavaScript (ES6+)  
**Primary Dependencies**: Hugo (static site generator only), cwebp (for WebP conversion in bash script)  
**Storage**: Local filesystem - cameras.json in collector/, images in data/images/, Hugo content in standard Hugo directories  
**Testing**: Manual browser testing, Hugo server for local development  
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge) with CSS Grid and Flexbox support  
**Project Type**: Single static website - Hugo-based with custom templates  
**Performance Goals**: Landing page loads in under 3 seconds with all 34 camera cards visible  
**Constraints**: No npm dependencies, no external JavaScript frameworks, build process must run offline, GitHub Actions for automated snapshot collection  
**Scale/Scope**: 34 cameras, 10 historical snapshots per camera, images converted to WebP format, dark theme with WCAG AA accessibility

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Static-First Compliance
- [X] Feature implementable as static website (no server-side processing) - Hugo generates static HTML
- [X] No external service dependencies (APIs, databases, CDNs) - All data stored locally
- [X] All content/data exists as files in repository - cameras.json and images in data/
- [X] Build process runs entirely on local machine - Hugo build is fully offline-capable

### Content and Data Format Compliance
- [X] All content files use Markdown (.md) format - Hugo content uses Markdown
- [X] All structured data uses JSON (.json) format - Camera configuration in cameras.json
- [X] No YAML, XML, or other data formats introduced - Only JSON and Markdown
- [X] No proprietary content formats - Standard Markdown and JSON only

### Dependency Compliance
- [X] New dependencies justified in writing (if any) - Hugo: industry-standard static site generator, aligns with Static-First principle
- [X] Existing standard tools preferred over new libraries - Custom HTML/CSS/JS templates, no npm packages
- [X] Complexity debt documented for non-standard tooling - Hugo is justified below

### Build Compliance
- [X] Build process documented in repository - Hugo build commands standard and documented
- [X] Build completes offline (no network required) - Hugo builds from local data/ and collector/ files
- [X] Build uses standard, widely-available tools - Hugo binary, bash scripts
- [X] Build artifacts are deterministic and reproducible - Static HTML/CSS/JS output

**Constitution Compliance (Pre-Design)**: ✅ PASS - All gates satisfied

**Constitution Compliance (Post-Design Re-Evaluation)**: ✅ PASS - All gates remain satisfied

*Post-Design Validation*:
- data-model.md confirms JSON-only data format (cameras.json validated against JSON Schema)
- contracts/cameras-schema.json provides formal validation without introducing non-JSON formats
- quickstart.md documents offline-capable build process (hugo command only)
- No new dependencies introduced during design phase
- All artifacts are static files (Markdown documentation, JSON schemas)

**Dependency Justification**:
- **Hugo**: Static site generator is permitted under constitution ("Static site generators using only Markdown → HTML transformation"). Hugo is widely-available, well-documented, and generates pure static HTML/CSS/JS with no runtime dependencies. Alternative (hand-coded HTML) would violate DRY principles for 34+ camera pages. Note: Hugo must be pre-installed or distributed as offline binary before build process.
- **cwebp**: Specialized WebP encoder command-line tool. Standard system utility, no npm installation required. Chosen over ImageMagick for superior WebP optimization.

**NOTE**: Any violations must be justified in Complexity Tracking section below.

## Project Structure

### Documentation (this feature)

```
specs/001-mauna-kea-camera/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command) ✅
├── data-model.md        # Phase 1 output (/speckit.plan command) ✅
├── quickstart.md        # Phase 1 output (/speckit.plan command) ✅
└── contracts/           # Phase 1 output (data schemas for cameras.json) ✅
    └── cameras-schema.json  # JSON Schema for cameras.json validation
```

### Source Code (repository root)

```
hawaiidiff/
├── collector/
│   ├── cameras.json           # Camera configuration (ID, name, direction, source URI)
│   └── fetch-snapshots.sh     # Bash script to download and convert images
├── data/
│   └── images/
│       ├── camera-001/
│       │   ├── 2025_10_11_14_20.webp
│       │   ├── 2025_10_11_14_40.webp
│       │   └── ...           # Up to 10 most recent snapshots per camera
│       ├── camera-002/
│       └── ...               # 34 camera directories
├── .github/
│   └── workflows/
│       └── fetch-snapshots.yml  # GitHub Actions: runs every 20 minutes
├── layouts/
│   ├── index.html            # Landing page template (camera grid)
│   ├── cameras/
│   │   └── single.html       # Camera detail page template
│   └── partials/
│       ├── head.html
│       ├── header.html
│       └── footer.html
├── assets/
│   ├── css/
│   │   └── main.css          # Dark theme styles, accessibility-compliant
│   └── js/
│       └── main.js           # Vanilla JavaScript for interactions
├── content/
│   └── cameras/              # Hugo generates pages from data
├── static/
│   └── (built images copied here during build)
├── config.toml              # Hugo configuration
└── README.md                # Build and deployment instructions
```

**Structure Decision**: Single Hugo project with custom templates. The collector/ folder contains the data collection infrastructure (cameras.json config and bash script). GitHub Actions automates snapshot collection every 20 minutes. Hugo builds the static site from the data/ folder, using layouts/ for custom HTML templates and assets/ for CSS/JS. No npm dependencies - all templates are custom HTML/CSS/vanilla JS.

## Implementation Specifications

*This section translates "what" requirements from spec.md into "how" technical specifications.*

### Visual Design Implementation (maps to FR-016 through FR-024)

**Card Dimensions** (FR-016):
- Exact size: 320x320 pixels
- CSS: `width: 320px; height: 320px; aspect-ratio: 1 / 1;`

**Grid Layout** (FR-017):
- Desktop (≥1200px): `grid-template-columns: repeat(6, 1fr);`
- Tablet (768-1199px): `grid-template-columns: repeat(4, 1fr);`
- Mobile (<768px): `grid-template-columns: repeat(2, 1fr);`

**Image Fitting** (FR-018):
- CSS: `object-fit: cover; object-position: center;`

**Grid Spacing** (FR-019):
- Desktop/tablet: `gap: 24px;`
- Mobile: `gap: 16px;`

**Card Padding** (FR-020):
- CSS: `padding: 16px;`

**Detail Image Sizing** (FR-021):
- Desktop: `min-width: 800px; max-width: 1200px;`
- Mobile: `width: 100%;`

**Thumbnail Dimensions** (FR-022):
- Size: 160x160 pixels
- Layout: `display: flex; gap: 12px; overflow-x: auto;`

**Color Palette** (FR-023):
```css
:root {
  --bg-primary: #1a1a1a;
  --bg-secondary: #2a2a2a;
  --text-primary: #e0e0e0;
  --text-secondary: #b0b0b0;
  --accent: #4a9eff;
  --border: #3a3a3a;
}
```

**Contrast Ratios** (FR-024):
- Primary text on primary bg: 11.5:1
- Secondary text on card bg: 7.2:1
- Accent on primary bg: 5.8:1

### Typography Implementation (maps to FR-025 through FR-030)

**Camera Name** (FR-025):
```css
.camera-name {
  font-size: 18px;
  font-weight: 600;
  color: #e0e0e0;
}
```

**Direction Label** (FR-026):
```css
.camera-direction {
  font-size: 14px;
  font-weight: 400;
  color: #b0b0b0;
}
```

**Timestamp** (FR-027):
```css
.camera-timestamp {
  font-size: 13px;
  font-weight: 400;
  color: #b0b0b0;
}
```

**Text Truncation** (FR-028):
```css
.camera-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```
```html
<!-- Apply title attribute for names >40 characters -->
<div class="camera-name" title="{{ if gt (len .name) 40 }}{{ .name }}{{ end }}">
  {{ .name }}
</div>
```

**Timestamp Format** (FR-029):
- Format string: "MMM DD, YYYY, h:mm A"
- Example: "Oct 11, 2025, 2:30 PM"
- Implementation: `Intl.DateTimeFormat('en-US', {month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true})`

**Font Stack** (FR-030):
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
```

### Interaction State Implementation (maps to FR-031 through FR-036)

**Hover State** (FR-031):
```css
.camera-card:hover {
  border-color: #4a9eff;
  box-shadow: 0 4px 12px rgba(74, 158, 255, 0.2);
  transform: translateY(-2px);
  transition: all 200ms ease-out;
}
```

**Focus State** (FR-032):
```css
.camera-card:focus {
  outline: 2px solid #4a9eff;
  outline-offset: 4px;
}
```

**Active State** (FR-033):
```css
.camera-card:active {
  transform: translateY(0);
  opacity: 0.9;
}
```

**Thumbnail Hover** (FR-034):
```css
.snapshot-thumbnail {
  opacity: 0.85;
}
.snapshot-thumbnail:hover {
  border: 2px solid #4a9eff;
  opacity: 1.0;
  cursor: pointer;
}
```

**Touch Targets** (FR-035):
- Minimum size: 44x44 pixels
- CSS: `min-width: 44px; min-height: 44px;`

**Disabled State** (FR-036):
```css
.camera-card.disabled {
  cursor: not-allowed;
  opacity: 0.5;
  pointer-events: none;
}
```

### Accessibility Implementation (maps to FR-037 through FR-043)

**Keyboard Navigation** (FR-037):
- Tab order: left-to-right, top-to-bottom
- Implementation: Natural DOM order with `tabindex="0"` on cards

**ARIA Labels** (FR-038):
```html
<a aria-label="Camera: {{ .name }}, Direction: {{ .direction }}, Last updated: {{ .timestamp }}">
```

**Placeholder Alt Text** (FR-039):
```html
<div role="img" aria-label="Camera image unavailable">
  <img alt="" aria-hidden="true">
</div>
```

**Navigation ARIA** (FR-040):
```html
<a href="/" aria-label="Return to all cameras" tabindex="0">
```

**Thumbnail Alt Text** (FR-041):
```html
<img alt="Snapshot from {{ formatTimestamp .filename }}">
```

**Focus Visibility** (FR-042):
```css
*:focus {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
/* Never: outline: none; without replacement */
```

**Non-Color Indicators** (FR-043):
- Always combine color with: text labels, icons, or patterns
- Example: Error states use red color + "X" icon + error text

### Layout Implementation (maps to FR-044 through FR-047)

**Sticky Header** (FR-044):
```css
.camera-detail-header {
  position: sticky;
  top: 0;
  background: rgba(42, 42, 42, 0.8);
  backdrop-filter: blur(10px);
  height: 80px;
  z-index: 100;
}
```

**Snapshot Spacing** (FR-045):
```css
.snapshot-history {
  margin-top: 32px;
}
```

**Skeleton Loader** (FR-046):
```css
.skeleton {
  background: linear-gradient(90deg, #2a2a2a 0%, #3a3a3a 50%, #2a2a2a 100%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
.skeleton-card { width: 320px; height: 320px; }
.skeleton-detail { width: 800px; }
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

### Error State Implementation (maps to FR-004, FR-005, FR-006, FR-047, FR-048)

**Unavailable Text Styling** (FR-005, FR-006):
```css
.unavailable {
  font-style: italic;
  color: #808080;
  opacity: 0.7;
}
```

**Image Placeholder** (FR-004):
```html
<div class="image-placeholder">
  <svg class="icon-camera-off" width="48" height="48"></svg>
  <p style="font-size: 16px; font-style: italic; color: #808080;">Image unavailable</p>
  <div class="camera-metadata"><!-- name, direction --></div>
</div>
```

**No Snapshots Message** (FR-047):
```html
{{ if eq (len $snapshots) 0 }}
  <p class="no-snapshots">No previous snapshots available</p>
{{ end }}
```

**Grid Structure Maintenance** (FR-048):
- Grid uses `display: grid` which maintains structure
- Placeholder divs fill empty slots
- CSS: `min-height: 400px;` prevents collapse

### Performance Implementation (maps to SC-001, SC-009, SC-012)

**Page Load Target** (SC-001):
- Optimize images: WebP format, quality 80
- Minimize CSS: Single concatenated file
- Defer non-critical JS

**Transition Timing** (SC-009):
- Standard: `transition: all 200ms ease-out;`
- Acceptable range: 150-250ms

**Skeleton Timing** (SC-012):
- Display within: 100ms of page load
- Implementation: Skeleton in initial HTML, replaced on image load

## Complexity Tracking

*No constitution violations - this section is empty.*

All requirements align with the HawaiiDiff Constitution:
- Hugo is a permitted static site generator
- Custom HTML/CSS/JS templates avoid framework dependencies
- cameras.json provides JSON data storage
- Bash script uses standard command-line tools
- GitHub Actions is infrastructure (not a runtime dependency)
- Build process is fully offline-capable after initial Hugo installation
