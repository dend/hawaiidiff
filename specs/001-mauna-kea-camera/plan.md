# Implementation Plan: Mauna Kea Camera Snapshot Visualizer

**Branch**: `001-mauna-kea-camera` | **Date**: 2025-10-11 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-mauna-kea-camera/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a static website using Hugo to visualize camera snapshots from 34 Mauna Kea cameras. The site displays all cameras on a landing page with uniform square cards showing camera name, direction, and latest snapshot timestamp. Users can click any card to view camera details with the latest snapshot and up to 10 historical images. A GitHub Actions workflow runs every 20 minutes to download snapshots from camera URIs defined in cameras.json, convert them to WebP format, and store them in the data/images directory organized by camera ID and timestamp. Hugo builds the static site from this data using custom HTML/CSS/JavaScript templates with no external dependencies.

## Technical Context

**Language/Version**: Hugo static site generator (latest stable), Bash shell scripting, HTML5, CSS3, vanilla JavaScript (ES6+)  
**Primary Dependencies**: Hugo (static site generator only), ImageMagick or cwebp (for WebP conversion in bash script)  
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
- **Hugo**: Static site generator is permitted under constitution ("Static site generators using only Markdown → HTML transformation"). Hugo is widely-available, well-documented, and generates pure static HTML/CSS/JS with no runtime dependencies. Alternative (hand-coded HTML) would violate DRY principles for 34+ camera pages.
- **ImageMagick/cwebp**: Command-line tool for WebP conversion in bash script. Standard system utility, no npm installation required.

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

## Complexity Tracking

*No constitution violations - this section is empty.*

All requirements align with the HawaiiDiff Constitution:
- Hugo is a permitted static site generator
- Custom HTML/CSS/JS templates avoid framework dependencies
- cameras.json provides JSON data storage
- Bash script uses standard command-line tools
- GitHub Actions is infrastructure (not a runtime dependency)
- Build process is fully offline-capable after initial Hugo installation
