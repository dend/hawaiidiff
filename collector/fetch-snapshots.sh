#!/bin/bash
#
# fetch-snapshots.sh - Download and convert camera snapshots to WebP
#
# This script reads data/cameras.json, downloads images from each camera's URI,
# converts them to WebP format, and maintains the 11 most recent snapshots
# (1 current + 10 historical) per camera.
#

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
CAMERAS_JSON="$ROOT_DIR/data/cameras.json"
IMAGES_DIR="$ROOT_DIR/static/images"
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

# Create images directory if it doesn't exist
mkdir -p "$IMAGES_DIR"

# Get current timestamp for filename
TIMESTAMP=$(date +"%Y_%m_%d_%H_%M")

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
    
    # Create camera directory
    CAMERA_DIR="$IMAGES_DIR/$CAMERA_ID"
    mkdir -p "$CAMERA_DIR"
    
    # Temporary file for download
    TMP_FILE="$CAMERA_DIR/tmp_download"
    WEBP_FILE="$CAMERA_DIR/${TIMESTAMP}.webp"
    
    # Download image
    echo "  Downloading from $CAMERA_URI"
    if curl -sSL -f --max-time 30 -o "$TMP_FILE" "$CAMERA_URI"; then
        # Convert to WebP
        echo "  Converting to WebP (quality: $WEBP_QUALITY)"
        if cwebp -q $WEBP_QUALITY "$TMP_FILE" -o "$WEBP_FILE" >/dev/null 2>&1; then
            FILE_SIZE=$(du -h "$WEBP_FILE" | cut -f1)
            echo "  ✓ Saved: ${TIMESTAMP}.webp ($FILE_SIZE)"
            
            # Clean up temporary file
            rm -f "$TMP_FILE"
            
            # Maintain only the MAX_SNAPSHOTS most recent files
            SNAPSHOT_COUNT=$(find "$CAMERA_DIR" -name "*.webp" | wc -l)
            if [ $SNAPSHOT_COUNT -gt $MAX_SNAPSHOTS ]; then
                echo "  Cleaning old snapshots (keeping $MAX_SNAPSHOTS most recent)"
                # List files by modification time, oldest first, delete excess
                find "$CAMERA_DIR" -name "*.webp" -type f -printf '%T@ %p\n' | \
                    sort -n | \
                    head -n -$MAX_SNAPSHOTS | \
                    cut -d' ' -f2- | \
                    xargs rm -f
            fi
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
