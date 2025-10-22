#!/bin/bash
#
# fetch-snapshots.sh - Download and convert camera snapshots to WebP
#
# This script reads data/cameras.json, downloads images from each camera's URI,
# and converts them to WebP format. All snapshots are preserved indefinitely.
#

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
CAMERAS_JSON="$ROOT_DIR/data/cameras.json"
ARCHIVE_DIR="$ROOT_DIR/archive"              # Source of truth - all images
STATIC_IMAGES_DIR="$ROOT_DIR/static/images"  # Hugo build - only last 11 images
WEBP_QUALITY=80
MAX_SNAPSHOTS=11

# Check dependencies
command -v jq >/dev/null 2>&1 || { echo "Error: jq is required but not installed." >&2; exit 1; }
command -v cwebp >/dev/null 2>&1 || { echo "Error: cwebp is required but not installed." >&2; exit 1; }
command -v curl >/dev/null 2>&1 || { echo "Error: curl is required but not installed." >&2; exit 1; }

# Validate cameras.json exists
if [ ! -f "$CAMERAS_JSON" ]; then
    echo "Error: cameras.json not found at $CAMERAS_JSON" >&2
    exit 1
fi

# Create directories if they don't exist
mkdir -p "$ARCHIVE_DIR"
mkdir -p "$STATIC_IMAGES_DIR"

# Get current timestamp for filename (always in Pacific Time)
TIMESTAMP=$(TZ="America/Los_Angeles" date +"%Y_%m_%d_%H_%M")

echo "Starting snapshot collection at $(date)"
echo "Timestamp: $TIMESTAMP"

# Read cameras from JSON and process each one
jq -c '.cameras[]' "$CAMERAS_JSON" | while read -r camera; do
    CAMERA_ID=$(echo "$camera" | jq -r '.id')
    CAMERA_NAME=$(echo "$camera" | jq -r '.name')
    CAMERA_URI=$(echo "$camera" | jq -r '.uri')
    
    # Skip if URI is empty
    if [ -z "$CAMERA_URI" ] || [ "$CAMERA_URI" = "null" ] || [ "$CAMERA_URI" = "" ]; then
        echo "  Skipping $CAMERA_ID: No URI configured"
        continue
    fi
    
    echo "Processing: $CAMERA_NAME ($CAMERA_ID)"
    
    # Create camera directories in both locations
    ARCHIVE_CAMERA_DIR="$ARCHIVE_DIR/$CAMERA_ID"
    STATIC_CAMERA_DIR="$STATIC_IMAGES_DIR/$CAMERA_ID"
    mkdir -p "$ARCHIVE_CAMERA_DIR"
    mkdir -p "$STATIC_CAMERA_DIR"
    
    # Temporary file for download
    TMP_FILE="$ARCHIVE_CAMERA_DIR/tmp_download"
    WEBP_FILE="$ARCHIVE_CAMERA_DIR/${TIMESTAMP}.webp"
    
    # Download image
    echo "  Downloading from $CAMERA_URI"
    if curl -sSL -f --max-time 30 -o "$TMP_FILE" "$CAMERA_URI"; then
        # Convert to WebP
        echo "  Converting to WebP (quality: $WEBP_QUALITY)"
        if cwebp -q $WEBP_QUALITY "$TMP_FILE" -o "$WEBP_FILE" >/dev/null 2>&1; then
            FILE_SIZE=$(du -h "$WEBP_FILE" | cut -f1)
            echo "  ✓ Saved to archive: ${TIMESTAMP}.webp ($FILE_SIZE)"
            
            # Clean up temporary file
            rm -f "$TMP_FILE"
            
            # Sync last 11 images to static/images for Hugo build
            echo "  Syncing last $MAX_SNAPSHOTS images to static/images..."
            
            # Clear static/images directory for this camera
            rm -f "$STATIC_CAMERA_DIR"/*.webp 2>/dev/null || true
            
            # Copy exactly the last 11 images from archive (sorted by filename/date, newest first)
            ls -1 "$ARCHIVE_CAMERA_DIR"/*.webp 2>/dev/null | sort -r | head -n $MAX_SNAPSHOTS | while read -r img; do
                cp "$img" "$STATIC_CAMERA_DIR/"
            done
            
            echo "  ✓ Updated static/images with last $MAX_SNAPSHOTS snapshots"
        else
            echo "  ✗ Error: WebP conversion failed"
            rm -f "$TMP_FILE"
        fi
    else
        echo "  ✗ Error: Download failed"
        rm -f "$TMP_FILE"
    fi
    
    echo ""
done

echo "Snapshot collection completed at $(date)"
