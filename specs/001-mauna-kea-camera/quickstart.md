# Quickstart Guide: Mauna Kea Camera Visualizer

**Feature**: 001-mauna-kea-camera  
**Last Updated**: 2025-10-11

## Overview

This guide helps developers get the camera snapshot visualizer running locally within 5 minutes. The system consists of:
- Hugo static site generator for HTML pages
- Bash script for fetching camera snapshots
- JSON configuration file with 34 camera definitions
- GitHub Actions for automated 20-minute snapshot collection

## Prerequisites

Before starting, ensure you have:

- **macOS, Linux, or WSL** (bash environment required)
- **Hugo** (extended version, latest stable)
- **ImageMagick** or **cwebp** (for WebP conversion)
- **jq** (JSON parser for bash scripts)
- **Git** (for version control)
- **Internet connection** (for fetching camera images)

### Quick Prerequisite Check

```bash
# Check all required tools
hugo version          # Should show v0.100.0 or newer
convert -version      # ImageMagick OR
cwebp -version        # cwebp tool
jq --version          # jq 1.5 or newer
git --version         # Any recent version
```

### Install Missing Tools

**macOS** (using Homebrew):
```bash
brew install hugo imagemagick jq
```

**Ubuntu/Debian**:
```bash
sudo apt-get update
sudo apt-get install hugo imagemagick jq
```

**Other Linux** (using snap):
```bash
sudo snap install hugo
sudo apt-get install imagemagick jq
```

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/your-org/hawaiidiff.git
cd hawaiidiff
```

### 2. Verify Project Structure

```bash
# Expected structure after implementation:
# collector/
#   ├── cameras.json           # Camera configuration
#   └── fetch-snapshots.sh     # Snapshot collector script
# data/
#   └── images/                # Snapshot storage (auto-created)
# layouts/
#   ├── index.html             # Landing page template
#   └── cameras/
#       └── single.html        # Camera detail page template
# assets/
#   └── css/
#       └── main.css           # Styles (dark theme)
# static/
#   └── js/
#       └── timestamps.js      # Timestamp formatting
```

### 3. Review Camera Configuration

```bash
# View configured cameras
cat collector/cameras.json | jq '.cameras[] | {id, name, direction}'

# Expected output: 34 cameras with id, name, direction fields
```

### 4. Fetch Initial Snapshots

```bash
# Run snapshot collector manually
cd collector
./fetch-snapshots.sh

# This will:
# - Read cameras.json
# - Fetch images from all 34 camera URIs
# - Convert to WebP format
# - Save to data/images/CAMERA_ID/YYYY_MM_DD_HH_MM.webp
```

**Expected Output**:
```
Fetching snapshots for 34 cameras...
camera-001: ✓ Fetched and converted to WebP
camera-002: ✓ Fetched and converted to WebP
...
camera-034: ✓ Fetched and converted to WebP
Complete: 34 snapshots collected in data/images/
```

### 5. Build Hugo Site

```bash
# Return to project root
cd ..

# Build the static site
hugo

# Output: Site built to public/ directory
```

### 6. Start Development Server

```bash
# Start Hugo server with live reload
hugo server -D

# Output:
# Web Server is available at http://localhost:1313/
# Press Ctrl+C to stop
```

### 7. View in Browser

Open browser to:
- **Landing page**: http://localhost:1313/
- **Example camera page**: http://localhost:1313/cameras/camera-001/

Expected landing page:
- 34 uniform square camera cards in grid layout
- Each card shows latest snapshot + camera name + direction
- Dark theme with accessible contrast
- Clicking a card navigates to camera detail page

Expected camera detail page:
- Large display of latest snapshot
- Camera name + direction + optional description
- Up to 10 historical snapshot thumbnails
- Human-readable timestamps (e.g., "Oct 11, 2025, 2:20 PM")

## Development Workflow

### Manual Snapshot Collection

```bash
# Fetch new snapshots anytime
cd collector
./fetch-snapshots.sh

# Hugo will auto-rebuild if server is running
```

### Test with Mock Data

```bash
# Create test snapshot for camera-001
mkdir -p data/images/camera-001
cp test-images/sample.jpg data/images/camera-001/2025_10_11_14_00.jpg

# Convert to WebP manually
convert data/images/camera-001/2025_10_11_14_00.jpg \
        -quality 80 \
        data/images/camera-001/2025_10_11_14_00.webp

# Remove original
rm data/images/camera-001/2025_10_11_14_00.jpg
```

### Validate JSON Configuration

```bash
# Check cameras.json against schema
jq empty collector/cameras.json  # Validates JSON syntax

# Count cameras (should be exactly 34)
jq '.cameras | length' collector/cameras.json

# Validate against JSON Schema (requires ajv-cli)
npm install -g ajv-cli  # One-time install
ajv validate -s specs/001-mauna-kea-camera/contracts/cameras-schema.json \
             -d collector/cameras.json
```

### Modify Hugo Templates

```bash
# Edit landing page template
vim layouts/index.html

# Hugo server auto-reloads on save
# Refresh browser to see changes
```

### Debug Image Issues

```bash
# List all snapshots for a camera
ls -lh data/images/camera-001/

# Check image file sizes (should be <500KB)
du -h data/images/camera-001/*.webp

# View latest snapshot timestamp
ls -t data/images/camera-001/*.webp | head -1
```

## Production Build

### Build Optimized Site

```bash
# Clean previous build
rm -rf public/

# Build with production settings
hugo --minify

# Output: Optimized static files in public/
```

### Deploy to GitHub Pages

```bash
# Build site
hugo --minify

# Deploy (example using gh-pages branch)
git add public/
git commit -m "Deploy site"
git subtree push --prefix public origin gh-pages
```

### Test Production Build Locally

```bash
# Serve production build
cd public/
python3 -m http.server 8000

# View at http://localhost:8000/
```

## Automated Collection (GitHub Actions)

The repository includes `.github/workflows/fetch-snapshots.yml` that runs every 20 minutes.

### Manual Workflow Trigger

```bash
# Trigger GitHub Action from command line (requires gh CLI)
gh workflow run fetch-snapshots.yml

# View workflow status
gh run list --workflow=fetch-snapshots.yml
```

### Monitor Automated Runs

1. Go to repository on GitHub
2. Click "Actions" tab
3. View "Fetch Camera Snapshots" workflow
4. Check recent runs (should execute every 20 minutes)

### Disable Automated Collection

```bash
# Temporarily disable workflow
# Edit .github/workflows/fetch-snapshots.yml
# Comment out the schedule trigger:

# schedule:
#   - cron: '*/20 * * * *'  # Every 20 minutes
```

## Troubleshooting

### Hugo Server Won't Start

**Error**: `command not found: hugo`

**Solution**:
```bash
# Install Hugo
brew install hugo  # macOS
sudo snap install hugo  # Linux
```

### Images Not Converting to WebP

**Error**: `cwebp: command not found`

**Solution**:
```bash
# Install ImageMagick (includes convert)
brew install imagemagick  # macOS
sudo apt-get install imagemagick  # Ubuntu

# OR install cwebp directly
brew install webp  # macOS
sudo apt-get install webp  # Ubuntu
```

### Fetch Script Fails

**Error**: `parse error: Invalid numeric literal`

**Solution**:
```bash
# Install jq
brew install jq  # macOS
sudo apt-get install jq  # Ubuntu
```

### No Snapshots Displayed

**Issue**: Cards show "Image unavailable"

**Debug**:
```bash
# Check if images exist
ls -R data/images/

# Verify cameras.json is valid
jq . collector/cameras.json

# Run fetch script manually with debug output
bash -x collector/fetch-snapshots.sh
```

### Dark Theme Not Applied

**Issue**: Site shows default styles

**Debug**:
```bash
# Verify CSS file exists
cat assets/css/main.css | head -20

# Check Hugo build output
hugo --verbose

# Clear browser cache and reload
```

## Next Steps

After quickstart is working:

1. **Customize Cameras**: Edit `collector/cameras.json` to add/modify cameras
2. **Adjust Styling**: Modify `assets/css/main.css` for visual tweaks
3. **Enhance Templates**: Edit Hugo templates in `layouts/` for structure changes
4. **Set Up CI/CD**: Configure GitHub Actions for automated deployments
5. **Monitor Performance**: Use browser DevTools to verify <3s load time

## Support Resources

- **Hugo Documentation**: https://gohugo.io/documentation/
- **ImageMagick Manual**: https://imagemagick.org/script/command-line-options.php
- **JSON Schema Validator**: https://www.jsonschemavalidator.net/
- **Feature Specification**: `specs/001-mauna-kea-camera/spec.md`
- **Data Model**: `specs/001-mauna-kea-camera/data-model.md`
- **Technical Research**: `specs/001-mauna-kea-camera/research.md`

## Constitution Compliance

This quickstart adheres to all constitutional requirements:

- ✅ **Static-First**: Hugo generates static HTML (no server runtime)
- ✅ **Minimal Dependencies**: Only Hugo, bash, ImageMagick/cwebp, jq (all standard tools)
- ✅ **No npm**: Zero Node.js dependencies required
- ✅ **JSON Data**: cameras.json uses JSON format exclusively
- ✅ **Build Simplicity**: Single `hugo` command builds entire site

## Estimated Time

- **Prerequisites check**: 2 minutes
- **Initial snapshot fetch**: 3 minutes (depends on network)
- **Hugo site build**: 5 seconds
- **Total**: ~5 minutes from clone to running site

Ready to build! 🚀
