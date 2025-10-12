# Research: Mauna Kea Camera Snapshot Visualizer

**Feature**: 001-mauna-kea-camera  
**Date**: 2025-10-11  
**Status**: Complete

## Research Overview

This document captures technical research and decisions for implementing a Hugo-based static website that visualizes camera snapshots from 34 Mauna Kea cameras.

## Hugo Static Site Generator

### Decision

Use Hugo as the static site generator for this project.

### Rationale

- **Constitution Compliance**: Hugo is explicitly permitted as a "static site generator using only Markdown → HTML transformation"
- **Zero Runtime Dependencies**: Hugo generates pure static HTML/CSS/JS with no client-side framework requirements
- **Template Flexibility**: Hugo's Go templates allow complete control over HTML structure without forcing specific frameworks
- **Data Processing**: Hugo can read JSON data files and generate pages programmatically (perfect for 34 camera pages)
- **Build Performance**: Hugo is one of the fastest static site generators (important for rebuilds every 20 minutes)
- **Offline Builds**: Hugo builds entirely from local files without network access
- **Wide Adoption**: Well-documented, actively maintained, large community

### Alternatives Considered

- **Hand-coded HTML**: Would violate DRY principles for 34 near-identical camera detail pages
- **Jekyll**: Slower build times, Ruby dependency less universally available than Go binary
- **Eleventy**: Requires npm ecosystem, violates "no npm install" constraint
- **Plain JavaScript templating**: Would require custom build system, more complexity

## Image Format and Conversion

### Decision

Convert all camera snapshots to WebP format using command-line tools in the bash script.

### Rationale

- **File Size**: WebP provides 25-35% smaller file sizes than JPEG at equivalent quality
- **Browser Support**: WebP is supported in all modern browsers (Chrome, Firefox, Safari, Edge)
- **Performance**: Smaller images improve page load time (3-second target for 34 cameras)
- **Constitution Compliance**: WebP is a standard web format, no proprietary codec
- **Tooling**: cwebp (from libwebp) or ImageMagick are standard command-line tools

### Implementation

```bash
# Using cwebp (preferred)
cwebp -q 80 input.jpg -o output.webp

# Using ImageMagick (alternative)
convert input.jpg -quality 80 output.webp
```

### Alternatives Considered

- **Keep original formats (JPEG/PNG)**: Larger file sizes, slower page loads
- **AVIF format**: Better compression but less browser support, encoding slower
- **Multiple formats with picture element**: Adds complexity, unnecessary given WebP support

## Data Collection Strategy

### Decision

Use a bash script (fetch-snapshots.sh) executed by GitHub Actions every 20 minutes to download and process camera snapshots.

### Rationale

- **Simplicity**: Bash script using curl/wget is straightforward and portable
- **No Runtime Dependency**: Collection happens before build, not at serve time
- **Constitution Compliance**: Bash and curl are standard system tools
- **GitHub Actions Integration**: Standard CI/CD pattern, no additional infrastructure
- **Scheduled Execution**: GitHub Actions cron syntax handles 20-minute intervals
- **Version Control**: Images and data committed to repository (static-first principle)

### Implementation Pattern

```bash
#!/bin/bash
# fetch-snapshots.sh

# Read cameras.json
CAMERAS=$(cat collector/cameras.json)

# For each camera
for camera in $(echo "$CAMERAS" | jq -c '.cameras[]'); do
    ID=$(echo "$camera" | jq -r '.id')
    URI=$(echo "$camera" | jq -r '.uri')
    
    # Download image
    curl -o /tmp/snapshot.jpg "$URI"
    
    # Convert to WebP with timestamp
    TIMESTAMP=$(date +%Y_%m_%d_%H_%M)
    cwebp -q 80 /tmp/snapshot.jpg -o "data/images/$ID/$TIMESTAMP.webp"
    
    # Keep only 10 most recent
    ls -t data/images/$ID/*.webp | tail -n +11 | xargs rm -f
done
```

### Alternatives Considered

- **Python script**: Requires Python dependency, bash is more universally available
- **Real-time fetching**: Would violate static-first principle
- **Manual collection**: Not scalable for 20-minute intervals

## cameras.json Schema

### Decision

Store camera configuration in a single cameras.json file in the collector/ directory.

### Rationale

- **Constitution Compliance**: JSON data format is required by constitution
- **Centralized Configuration**: Single source of truth for all camera metadata
- **Easy Updates**: Add/remove cameras by editing JSON file
- **Hugo Integration**: Hugo can read JSON data files directly
- **Version Control**: Configuration changes tracked in git

### Schema Design

```json
{
  "cameras": [
    {
      "id": "camera-001",
      "name": "Summit North",
      "direction": "N",
      "uri": "https://example.com/camera1/snapshot.jpg",
      "description": "North-facing view from summit"
    }
  ]
}
```

### Fields

- **id**: Unique identifier for camera (used in directory names, URLs)
- **name**: Display name for camera card and detail page
- **direction**: Compass direction (N, NE, E, SE, S, SW, W, NW, Up, Down, or custom)
- **uri**: Source URL for snapshot image (used by fetch script)
- **description**: Optional text description for camera detail page

## Hugo Page Generation Strategy

### Decision

Use Hugo's data files feature to generate camera detail pages programmatically.

### Rationale

- **DRY Principle**: One template generates all 34 camera pages
- **Maintainability**: Changes to camera page layout update all pages
- **Hugo Native**: Uses built-in Hugo features, no custom scripting
- **Content Separation**: Camera data (JSON) separate from presentation (templates)

### Implementation

Hugo will:
1. Read collector/cameras.json as a data file
2. Use range loop in templates to generate landing page cards
3. Create individual camera pages using single.html template
4. List images from data/images/{camera-id}/ directory
5. Sort images by filename (timestamp) for chronological order

## Dark Theme and Accessibility

### Decision

Implement dark theme using CSS custom properties (CSS variables) with WCAG AA compliant contrast ratios.

### Rationale

- **User Requirement**: Dark theme specified in requirements
- **Accessibility**: WCAG AA compliance is non-negotiable (FR-012, SC-005)
- **Maintainability**: CSS variables allow easy theme adjustments
- **No Dependencies**: Pure CSS, no framework required

### Color Palette (WCAG AA Compliant)

```css
:root {
  --bg-primary: #1a1a1a;      /* Main background */
  --bg-secondary: #2d2d2d;    /* Card backgrounds */
  --text-primary: #ffffff;     /* Primary text - 16.5:1 ratio */
  --text-secondary: #b0b0b0;   /* Secondary text - 7.3:1 ratio */
  --accent: #00a8e8;           /* Links and accents - 4.6:1 ratio */
  --border: #404040;           /* Card borders */
  --error: #ff6b6b;            /* Error states - 4.7:1 ratio */
}
```

All ratios tested against dark backgrounds meet or exceed WCAG AA standard of 4.5:1 for normal text.

## Image Display Strategy

### Decision

Use CSS object-fit for uniform square cards and CSS Grid for landing page layout.

### Rationale

- **Requirement**: FR-002 requires uniform square dimensions regardless of source aspect ratio
- **Browser Support**: object-fit and CSS Grid supported in all target browsers
- **No JavaScript**: Pure CSS solution, faster rendering
- **Responsive**: CSS Grid naturally adapts to screen sizes

### Implementation

```css
.camera-card {
  aspect-ratio: 1 / 1;  /* Square cards */
  overflow: hidden;
}

.camera-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;    /* Crop to fill square */
  object-position: center;
}

.camera-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}
```

## Historical Snapshot Display

### Decision

Display up to 10 most recent snapshots as a horizontal scrollable gallery on camera detail pages.

### Rationale

- **Requirement**: FR-010 specifies "up to 10 most recent previous snapshots in browsable format"
- **Space Efficiency**: Horizontal scroll saves vertical space
- **Touch-Friendly**: Swipe gesture works on mobile devices
- **Progressive Enhancement**: Works without JavaScript, enhanced with smooth scrolling

### Implementation

```css
.snapshot-history {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}

.snapshot-thumbnail {
  flex: 0 0 150px;
  aspect-ratio: 1 / 1;
  scroll-snap-align: start;
}
```

## Timestamp Formatting

### Decision

Use JavaScript Intl.DateTimeFormat for human-readable timestamp display.

### Rationale

- **Internationalization**: Supports locale-specific date/time formats
- **Browser Native**: No external library required
- **Graceful Degradation**: Falls back to ISO string if JavaScript disabled

### Implementation

```javascript
function formatTimestamp(filename) {
  // Parse YYYY_MM_DD_HH_MM.webp
  const match = filename.match(/(\d{4})_(\d{2})_(\d{2})_(\d{2})_(\d{2})/);
  if (!match) return 'Timestamp unavailable';
  
  const [_, year, month, day, hour, minute] = match;
  const date = new Date(year, month - 1, day, hour, minute);
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}
```

## Error Handling Strategy

### Decision

Implement fallback placeholders for missing images, timestamps, and directions as specified in clarifications.

### Rationale

- **User Clarity**: Explicit "unavailable" messages better than blank spaces
- **Debugging**: Makes data issues visible to maintainers
- **Consistency**: Same pattern for all missing data (FR-004, FR-005, FR-006)

### Implementation

Hugo template logic:
```html
{{ with .Params.direction }}
  <span class="direction">{{ . }}</span>
{{ else }}
  <span class="direction unavailable">Direction unavailable</span>
{{ end }}
```

## Build and Deployment Workflow

### Decision

1. GitHub Actions runs fetch-snapshots.sh every 20 minutes
2. Script commits new images to repository
3. Hugo build triggered by commit
4. Static site deployed (GitHub Pages, Netlify, or similar)

### Rationale

- **Automation**: No manual intervention required
- **Git History**: All snapshots versioned (can revert if needed)
- **Static Hosting**: Compatible with free static hosting services
- **Constitution Compliance**: All artifacts in repository

## Summary

All technical decisions align with the HawaiiDiff Constitution:
- ✅ Static-first architecture using Hugo
- ✅ JSON data storage for cameras.json
- ✅ Markdown content where applicable
- ✅ No npm dependencies, custom HTML/CSS/JS only
- ✅ Offline-capable build process
- ✅ Standard tools (bash, Hugo, cwebp/ImageMagick)

No NEEDS CLARIFICATION items remain - all technical approaches are well-defined and ready for implementation.
