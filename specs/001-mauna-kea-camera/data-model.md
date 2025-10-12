# Data Model: Mauna Kea Camera Snapshot Visualizer

**Feature**: 001-mauna-kea-camera  
**Date**: 2025-10-11  
**Status**: Complete

## Overview

This document defines the data structures and relationships for the camera snapshot visualizer. All data is stored in JSON format (cameras.json) and file system structure (images organized by camera ID and timestamp).

## Entities

### Camera

Represents a physical camera on Mauna Kea with configuration and metadata.

**Storage**: `collector/cameras.json` (array of camera objects)

**Attributes**:

| Field | Type | Required | Description | Validation Rules |
|-------|------|----------|-------------|------------------|
| id | string | Yes | Unique identifier for the camera | Alphanumeric + hyphens, max 50 chars, used in URLs and directory names |
| name | string | Yes | Display name for the camera | Max 100 chars, displayed in cards and detail pages |
| direction | string | No | Compass direction or orientation | One of: N, NE, E, SE, S, SW, W, NW, Up, Down, or custom string (max 20 chars) |
| uri | string | Yes | Source URL for snapshot image | Valid HTTP/HTTPS URL, used by fetch-snapshots.sh |
| description | string | No | Optional text description | Max 500 chars, displayed on camera detail page |

**Example**:
```json
{
  "id": "camera-001",
  "name": "Summit North",
  "direction": "N",
  "uri": "https://example.com/cameras/summit-north/snapshot.jpg",
  "description": "North-facing view from the summit of Mauna Kea"
}
```

**Uniqueness**: `id` field must be unique across all cameras

**State Transitions**: None - cameras are statically configured

### CameraCollection

The complete set of all cameras in the system.

**Storage**: `collector/cameras.json`

**Structure**:
```json
{
  "cameras": [
    { ...camera object },
    { ...camera object }
  ]
}
```

**Validation Rules**:
- Must contain exactly 34 camera objects (per FR-001)
- All camera IDs must be unique
- Must be valid JSON per RFC 8259

### Snapshot

Represents a single captured image from a camera at a specific point in time.

**Storage**: File system at `data/images/{camera-id}/{timestamp}.webp`

**Attributes** (derived from filename and file metadata):

| Field | Type | Source | Description |
|-------|------|--------|-------------|
| camera_id | string | Directory name | Links snapshot to parent camera |
| timestamp | datetime | Filename | Capture time in format YYYY_MM_DD_HH_MM |
| file_path | string | File system | Relative path to image file |
| file_size | integer | File metadata | Size in bytes (for optimization monitoring) |

**Filename Convention**: `YYYY_MM_DD_HH_MM.webp`

**Example**: 
- File: `data/images/camera-001/2025_10_11_14_20.webp`
- Parsed timestamp: October 11, 2025, 14:20
- Camera ID: camera-001

**Retention**: Maximum 10 snapshots per camera (oldest deleted automatically by fetch script)

**Relationships**:
- Each Snapshot belongs to exactly one Camera (via camera_id)
- Each Camera has 0-10 Snapshots (historical snapshots)

## Data Relationships

```
CameraCollection
    │
    └─▷ contains 34 Camera objects
            │
            └─▷ has 0-10 Snapshot files
```

**Cardinality**:
- CameraCollection : Camera = 1 : 34 (fixed)
- Camera : Snapshot = 1 : 0..10 (variable, up to 10)

## Data Flow

### Collection Phase (GitHub Actions every 20 minutes)

1. Read `collector/cameras.json`
2. For each camera:
   - Fetch image from camera.uri
   - Convert to WebP format
   - Save as `data/images/{camera.id}/{timestamp}.webp`
   - Delete oldest snapshots if count > 10

### Build Phase (Hugo site generation)

1. Hugo reads `collector/cameras.json` as data file
2. For each camera, Hugo:
   - Creates landing page card with latest snapshot
   - Generates camera detail page at `/cameras/{camera-id}/`
   - Lists all snapshots from `data/images/{camera-id}/`
   - Sorts snapshots by filename (chronological order)

### Render Phase (Browser)

1. User loads landing page
2. Browser displays 34 camera cards with images from `static/images/`
3. User clicks card → navigate to `/cameras/{camera-id}/`
4. Browser displays latest snapshot + up to 10 historical thumbnails
5. JavaScript parses filenames to display formatted timestamps

## Data Validation

### cameras.json Schema Validation

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["cameras"],
  "properties": {
    "cameras": {
      "type": "array",
      "minItems": 34,
      "maxItems": 34,
      "items": {
        "type": "object",
        "required": ["id", "name", "uri"],
        "properties": {
          "id": {
            "type": "string",
            "pattern": "^[a-z0-9-]+$",
            "maxLength": 50
          },
          "name": {
            "type": "string",
            "minLength": 1,
            "maxLength": 100
          },
          "direction": {
            "type": "string",
            "maxLength": 20
          },
          "uri": {
            "type": "string",
            "format": "uri",
            "pattern": "^https?://"
          },
          "description": {
            "type": "string",
            "maxLength": 500
          }
        }
      }
    }
  }
}
```

### Snapshot Filename Validation

**Pattern**: `^(\d{4})_(\d{2})_(\d{2})_(\d{2})_(\d{2})\.webp$`

**Rules**:
- Year: 2000-2099
- Month: 01-12
- Day: 01-31 (calendar-aware validation)
- Hour: 00-23
- Minute: 00-59
- Extension: .webp (lowercase)

## Error Handling

### Missing Camera Data

| Field Missing | Display Behavior (per clarifications) |
|---------------|---------------------------------------|
| direction | Show "Direction unavailable" |
| name | ERROR - required field, build should fail |
| uri | ERROR - required field, fetch script fails |

### Missing Snapshot Data

| Condition | Display Behavior (per clarifications) |
|-----------|---------------------------------------|
| No snapshots for camera | Show camera card with "Image unavailable" placeholder |
| Fewer than 10 snapshots | Display only available snapshots (1-9) |
| Invalid timestamp filename | Show "Timestamp unavailable" |
| Corrupted image file | Show "Image unavailable" placeholder |

## Data Constraints

### Storage Limits

- Maximum cameras: 34
- Maximum snapshots per camera: 10
- Maximum total snapshots: 340
- Image size target: <500KB per WebP image
- Total data directory size: ~170MB (340 images × 500KB average)

### Performance Requirements

- Landing page must load all 34 camera thumbnails within 3 seconds (SC-001)
- Image optimization: WebP format, quality 80, target <500KB per image
- Lazy loading for historical snapshots on detail pages

## Data Governance

### JSON File Ownership

- `collector/cameras.json`: Manually maintained, version controlled
- Updates trigger site rebuild via GitHub Actions

### Image File Ownership

- `data/images/**/*.webp`: Auto-generated by fetch-snapshots.sh
- Committed to repository (static-first principle)
- Retention policy: 10 most recent per camera (automatic cleanup)

### Backup and Recovery

- All data in git repository (inherent backup)
- Can rebuild site from any commit
- Lost snapshots repopulated on next fetch cycle (20 minutes max)

## Hugo Data Integration

### Data File Access

Hugo can access cameras.json via:
```go-template
{{ range $.Site.Data.cameras.cameras }}
  {{ .id }}
  {{ .name }}
  {{ .direction }}
{{ end }}
```

### Image File Access

Hugo can list snapshot files via:
```go-template
{{ $cameraID := .Params.id }}
{{ $images := readDir (printf "data/images/%s" $cameraID) }}
{{ range $images }}
  {{ .Name }}  <!-- Filename with timestamp -->
{{ end }}
```

### Page Generation

Hugo generates pages using:
1. Landing page: `layouts/index.html` iterates over all cameras
2. Camera pages: `layouts/cameras/single.html` template for each camera
3. URL structure: `/cameras/{camera-id}/`

## Conclusion

All data entities align with constitutional requirements:
- ✅ Cameras stored in JSON format (cameras.json)
- ✅ Snapshots stored as static files (no database)
- ✅ All data version-controlled in repository
- ✅ No external data dependencies
- ✅ Offline-accessible after initial fetch

Data model supports all functional requirements (FR-001 through FR-015) and success criteria (SC-001 through SC-006).
