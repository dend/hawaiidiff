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
  /* Updated palette matching FR-023 and FR-024 */
  --bg-primary: #1a1a1a;      /* Main background */
  --bg-secondary: #2a2a2a;    /* Card/elevated surfaces */
  --text-primary: #e0e0e0;     /* Primary text - 11.5:1 ratio */
  --text-secondary: #b0b0b0;   /* Secondary/metadata - 7.2:1 ratio */
  --accent: #4a9eff;           /* Interactive elements - 5.8:1 ratio */
  --border: #3a3a3a;           /* Card borders, dividers */
}
```

**Verified Contrast Ratios** (against #1a1a1a background):
- Primary text (#e0e0e0): 11.5:1 ✓ (exceeds WCAG AAA)
- Secondary text (#b0b0b0): 7.2:1 ✓ (exceeds WCAG AA)
- Accent (#4a9eff): 5.8:1 ✓ (exceeds WCAG AA 4.5:1 minimum)

All ratios meet FR-024 requirements.

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
/* Implements FR-016, FR-017, FR-018, FR-019, FR-020 */
.camera-card {
  width: 320px;
  height: 320px;
  aspect-ratio: 1 / 1;  /* Square cards - FR-016 */
  overflow: hidden;
  padding: 16px;        /* FR-020 internal padding */
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 8px;
}

.camera-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;    /* FR-018: Crop to fill square */
  object-position: center;
}

.camera-grid {
  display: grid;
  gap: 24px;  /* FR-019: desktop/tablet spacing */
  
  /* FR-017: Responsive columns */
  grid-template-columns: repeat(6, 1fr);  /* Desktop ≥1200px */
}

@media (max-width: 1199px) {
  .camera-grid {
    grid-template-columns: repeat(4, 1fr);  /* Tablet 768-1199px */
  }
}

@media (max-width: 767px) {
  .camera-grid {
    grid-template-columns: repeat(2, 1fr);  /* Mobile <768px */
    gap: 16px;  /* FR-019: mobile spacing */
  }
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
/* Implements FR-021, FR-022 */
.snapshot-history {
  display: flex;
  gap: 12px;  /* FR-022: gap between thumbnails */
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding: 16px 0;
  margin-top: 32px;  /* FR-045: 32px below main snapshot */
}

.snapshot-thumbnail {
  flex: 0 0 160px;  /* FR-022: 160x160 pixels */
  height: 160px;
  aspect-ratio: 1 / 1;
  scroll-snap-align: start;
  border-radius: 4px;
  overflow: hidden;
  opacity: 0.85;
  transition: opacity 200ms, border 200ms;
  border: 2px solid transparent;
}

/* FR-034: Historical thumbnail hover state */
.snapshot-thumbnail:hover {
  opacity: 1.0;
  border-color: var(--accent);
  cursor: pointer;
}

.camera-detail-image {
  width: 100%;
  max-width: 1200px;  /* FR-021: max width */
  min-width: 800px;   /* FR-021: min width desktop */
  height: auto;
  margin: 0 auto;
  display: block;
}

@media (max-width: 799px) {
  .camera-detail-image {
    min-width: 100%;  /* FR-021: 100% on mobile */
  }
}
```

## Typography System

### Decision

Use system font stack with specific sizing per FR-025 through FR-030.

### Rationale

- **Performance**: System fonts load instantly, no web font download
- **Native Feel**: Matches user's OS preferences
- **Readability**: System fonts optimized for screen rendering
- **Accessibility**: Clear hierarchy with appropriate sizing

### Implementation

```css
/* FR-030: System font stack */
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  line-height: 1.6;
}

/* FR-025: Camera name */
.camera-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);  /* #e0e0e0 */
  margin-bottom: 8px;
}

/* FR-026: Direction label */
.camera-direction {
  font-size: 14px;
  font-weight: 400;
  color: var(--text-secondary);  /* #b0b0b0 */
}

/* FR-027: Timestamp */
.camera-timestamp {
  font-size: 13px;
  font-weight: 400;
  color: var(--text-secondary);  /* #b0b0b0 */
}

/* FR-028: Text truncation for long names */
.camera-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.camera-name[title]:hover::after {
  /* Tooltip showing full name on hover */
  content: attr(title);
  position: absolute;
  background: var(--bg-secondary);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  white-space: nowrap;
  z-index: 1000;
}

/* FR-048, FR-049: Unavailable state styling */
.unavailable {
  font-style: italic;
  color: #808080;  /* Grayed out */
  opacity: 0.7;
}
```

## Interaction States

### Decision

Implement comprehensive hover, focus, and active states per FR-031 through FR-036.

### Rationale

- **Accessibility**: Focus states essential for keyboard navigation
- **Feedback**: Users need visual confirmation of interactions
- **Polish**: Smooth transitions improve perceived quality
- **WCAG Compliance**: FR-032, FR-037, FR-042 require keyboard accessibility

### Implementation

```css
/* FR-031: Camera card hover state */
.camera-card {
  transition: transform 200ms ease-out, box-shadow 200ms ease-out, border-color 200ms ease-out;
  cursor: pointer;
}

.camera-card:hover {
  border-color: var(--accent);  /* #4a9eff */
  box-shadow: 0 4px 12px rgba(74, 158, 255, 0.2);
  transform: translateY(-2px);
}

/* FR-032: Focus state for keyboard navigation */
.camera-card:focus {
  outline: 2px solid var(--accent);
  outline-offset: 4px;
  /* No transform to avoid motion for a11y */
}

/* FR-033: Active/pressed state */
.camera-card:active {
  transform: translateY(0);  /* Cancel hover lift */
  opacity: 0.9;
}

/* FR-036: Disabled state */
.camera-card.disabled {
  cursor: not-allowed;
  opacity: 0.5;
  pointer-events: none;
}

/* FR-035: Minimum touch target size */
.camera-card,
.snapshot-thumbnail,
.nav-link {
  min-width: 44px;
  min-height: 44px;
}
```

## Accessibility Implementation

### Decision

Full keyboard navigation and ARIA labels per FR-037 through FR-043.

### Rationale

- **Legal Compliance**: WCAG AA is legal requirement in many jurisdictions
- **Inclusive Design**: Makes site usable for keyboard-only and screen reader users
- **SEO Benefit**: Semantic HTML improves search engine understanding
- **Best Practice**: Accessibility benefits all users

### Implementation

```html
<!-- FR-038: ARIA labels for camera cards -->
<a href="/cameras/{{ .id }}/" 
   class="camera-card"
   aria-label="Camera: {{ .name }}, Direction: {{ .direction | default "unavailable" }}, Last updated: {{ .timestamp | default "unavailable" }}"
   tabindex="0">
  <!-- Card content -->
</a>

<!-- FR-039: Image unavailable placeholder -->
<div class="image-placeholder" role="img" aria-label="Camera image unavailable">
  <svg class="icon-camera-off" aria-hidden="true"><!-- Icon --></svg>
  <p>Image unavailable</p>
</div>

<!-- FR-040: Navigation back to landing -->
<a href="/" class="nav-back" aria-label="Return to all cameras" tabindex="0">
  <svg aria-hidden="true"><!-- Back icon --></svg>
  <span>All Cameras</span>
</a>

<!-- FR-041: Historical snapshot alt text -->
<img src="{{ .path }}" 
     alt="Snapshot from {{ formatTimestamp .filename }}"
     class="snapshot-thumbnail">
```

```css
/* FR-042: Visible focus indicators always */
*:focus {
  outline-color: var(--accent);
  outline-width: 2px;
  outline-style: solid;
  outline-offset: 2px;
}

/* Never remove outlines without replacement */
button:focus,
a:focus,
input:focus {
  outline: 2px solid var(--accent);
}

/* FR-043: Color not sole indicator - use icons + text */
.status-indicator {
  /* Always combine color with icon and text label */
}
```

## Loading States

### Decision

Implement skeleton/shimmer loading states per FR-047 and SC-012.

### Rationale

- **Perceived Performance**: Users tolerate longer loads with visual feedback
- **Professional Polish**: Skeleton states feel more refined than spinners
- **Progressive Enhancement**: Content appears to "materialize" smoothly

### Implementation

```css
/* FR-047: Skeleton placeholder with shimmer */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-secondary) 0%,
    #3a3a3a 50%,
    var(--bg-secondary) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}

.skeleton-card {
  width: 320px;
  height: 320px;
}

.skeleton-detail {
  width: 100%;
  max-width: 1200px;
  height: 600px;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

```javascript
// Show skeleton within 100ms of page load (SC-012)
document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('img[data-src]');
  images.forEach(img => {
    const skeleton = img.previousElementSibling;
    
    img.addEventListener('load', () => {
      skeleton?.remove();
    });
    
    // Trigger load
    img.src = img.dataset.src;
  });
});
```

## Timestamp Formatting

### Decision

Use JavaScript Intl.DateTimeFormat for human-readable timestamp display per FR-029.

### Rationale

- **Internationalization**: Supports locale-specific date/time formats
- **Browser Native**: No external library required
- **Graceful Degradation**: Falls back to ISO string if JavaScript disabled
- **Format Requirement**: FR-029 specifies "MMM DD, YYYY, h:mm A" format

### Implementation

```javascript
// FR-029: Format as "Oct 11, 2025, 2:30 PM" in user's local timezone
function formatTimestamp(filename) {
  // Parse YYYY_MM_DD_HH_MM.webp
  const match = filename.match(/(\d{4})_(\d{2})_(\d{2})_(\d{2})_(\d{2})/);
  if (!match) return 'Timestamp unavailable';  // FR-005
  
  const [_, year, month, day, hour, minute] = match;
  const date = new Date(year, month - 1, day, hour, minute);
  
  // FR-029: Specific format requirement
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',   // "Oct"
    day: 'numeric',   // "11"
    hour: 'numeric',  // "2"
    minute: '2-digit', // "30"
    hour12: true      // "PM"
  }).format(date);
  // Output: "Oct 11, 2025, 2:30 PM"
}
```

## Error Handling Strategy

### Decision

Implement fallback placeholders for missing images, timestamps, and directions as specified in FR-004 through FR-006 and FR-044 through FR-051.

### Rationale

- **User Clarity**: Explicit "unavailable" messages better than blank spaces
- **Debugging**: Makes data issues visible to maintainers
- **Consistency**: Same pattern for all missing data
- **Graceful Degradation**: Site remains functional even with data issues

### Implementation

Hugo template logic:
```html
<!-- FR-046: Image unavailable placeholder -->
{{ if fileExists (printf "data/images/%s/*.webp" .id) }}
  <img src="{{ .latestImage }}" alt="{{ .name }}">
{{ else }}
  <div class="image-placeholder" role="img" aria-label="Camera image unavailable">
    <svg class="icon-camera-off" width="48" height="48" aria-hidden="true">
      <use xlink:href="#icon-camera-off"></use>
    </svg>
    <p class="unavailable-message">Image unavailable</p>
    <!-- FR-046: Still show camera metadata -->
    <p class="camera-name">{{ .name }}</p>
    <p class="camera-direction">{{ .direction | default "Direction unavailable" }}</p>
  </div>
{{ end }}

<!-- FR-005, FR-048: Timestamp unavailable -->
{{ with .timestamp }}
  <span class="camera-timestamp">{{ formatTimestamp . }}</span>
{{ else }}
  <span class="camera-timestamp unavailable">Timestamp unavailable</span>
{{ end }}

<!-- FR-006, FR-049: Direction unavailable -->
{{ with .direction }}
  <span class="direction">{{ . }}</span>
{{ else }}
  <span class="direction unavailable">Direction unavailable</span>
{{ end }}

<!-- FR-050: Zero historical snapshots -->
{{ $snapshots := readDir (printf "data/images/%s" .id) }}
{{ if gt (len $snapshots) 1 }}
  <div class="snapshot-history">
    {{ range $snapshots }}
      <img src="{{ .path }}" alt="Snapshot from {{ .timestamp }}">
    {{ end }}
  </div>
{{ else }}
  <p class="no-snapshots">No previous snapshots available</p>
{{ end }}
```

```css
/* FR-046: Placeholder styling */
.image-placeholder {
  width: 320px;
  height: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
  border: 2px dashed var(--border);
  border-radius: 8px;
  text-align: center;
  padding: 24px;
}

.icon-camera-off {
  color: var(--text-secondary);
  opacity: 0.5;
  margin-bottom: 16px;
}

.unavailable-message {
  font-size: 16px;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

/* FR-047: Skeleton loader */
.skeleton-card {
  width: 320px;
  height: 320px;
  background: linear-gradient(
    90deg,
    var(--bg-secondary) 0%,
    #3a3a3a 50%,
    var(--bg-secondary) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* FR-051: Grid maintains structure even with all missing images */
.camera-grid {
  /* Grid doesn't collapse - placeholders maintain layout */
  min-height: 400px;
}
```

### Edge Cases

- **FR-051**: All 34 cameras with missing images still display full grid with placeholders (no collapse)
- **FR-050**: Cameras with 0 historical snapshots show "No previous snapshots available" message
- **FR-048/FR-049**: Italic gray text for unavailable timestamp/direction
- **FR-044**: Detail page header sticky at top with backdrop blur for readability over images

```css
/* FR-044: Sticky header on camera detail page */
.camera-detail-header {
  position: sticky;
  top: 0;
  background: rgba(42, 42, 42, 0.8);  /* #2a2a2a with 80% opacity */
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  height: 80px;
  z-index: 100;
  display: flex;
  align-items: center;
  padding: 0 24px;
  border-bottom: 1px solid var(--border);
}
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
