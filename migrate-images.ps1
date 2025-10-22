#!/usr/bin/env pwsh
#
# migrate-images.ps1 - Migrate images from static/images to data/images
# and keep only the last 11 in static/images
#

$ErrorActionPreference = "Stop"

# Configuration
$StaticImagesDir = "static\images"
$DataImagesDir = "data\images"
$MaxSnapshots = 11

Write-Host "Starting image migration..." -ForegroundColor Green
Write-Host "This will:"
Write-Host "  1. Copy ALL images from static/images to data/images (source of truth)"
Write-Host "  2. Keep only the last $MaxSnapshots images in static/images (for Hugo builds)"
Write-Host ""

# Create data/images directory if it doesn't exist
if (-not (Test-Path $DataImagesDir)) {
    New-Item -ItemType Directory -Path $DataImagesDir -Force | Out-Null
    Write-Host "✓ Created $DataImagesDir directory" -ForegroundColor Green
}

# Get all camera directories
$cameraDirectories = Get-ChildItem -Path $StaticImagesDir -Directory

Write-Host "Found $($cameraDirectories.Count) camera directories" -ForegroundColor Cyan
Write-Host ""

$totalImagesCopied = 0
$totalImagesRemoved = 0

foreach ($cameraDir in $cameraDirectories) {
    $cameraId = $cameraDir.Name
    $staticCameraPath = $cameraDir.FullName
    $dataCameraPath = Join-Path $DataImagesDir $cameraId
    
    Write-Host "Processing: $cameraId" -ForegroundColor Yellow
    
    # Create camera directory in data/images
    if (-not (Test-Path $dataCameraPath)) {
        New-Item -ItemType Directory -Path $dataCameraPath -Force | Out-Null
    }
    
    # Get all WebP images in this camera's static directory
    $images = Get-ChildItem -Path $staticCameraPath -Filter "*.webp" | Sort-Object LastWriteTime -Descending
    
    Write-Host "  Found $($images.Count) images"
    
    # Copy ALL images to data/images
    foreach ($image in $images) {
        $destPath = Join-Path $dataCameraPath $image.Name
        if (-not (Test-Path $destPath)) {
            Copy-Item -Path $image.FullName -Destination $destPath -Force
            $totalImagesCopied++
        }
    }
    
    Write-Host "  ✓ Copied all images to data/images" -ForegroundColor Green
    
    # Keep only last 11 in static/images
    $imagesToRemove = $images | Select-Object -Skip $MaxSnapshots
    
    if ($imagesToRemove.Count -gt 0) {
        Write-Host "  Removing $($imagesToRemove.Count) old images from static/images..."
        foreach ($image in $imagesToRemove) {
            Remove-Item -Path $image.FullName -Force
            $totalImagesRemoved++
        }
        Write-Host "  ✓ Kept last $MaxSnapshots images in static/images" -ForegroundColor Green
    } else {
        Write-Host "  ✓ Already has $MaxSnapshots or fewer images in static/images" -ForegroundColor Green
    }
    
    Write-Host ""
}

Write-Host "Migration Complete!" -ForegroundColor Green
Write-Host "==================" -ForegroundColor Green
Write-Host "Images copied to data/images: $totalImagesCopied" -ForegroundColor Cyan
Write-Host "Images removed from static/images: $totalImagesRemoved" -ForegroundColor Cyan
Write-Host ""

# Show final counts
$dataImageCount = (Get-ChildItem -Path $DataImagesDir -Filter "*.webp" -Recurse).Count
$staticImageCount = (Get-ChildItem -Path $StaticImagesDir -Filter "*.webp" -Recurse).Count

Write-Host "Final image counts:" -ForegroundColor Green
Write-Host "  data/images: $dataImageCount images (source of truth)" -ForegroundColor Cyan
Write-Host "  static/images: $staticImageCount images (Hugo build)" -ForegroundColor Cyan
Write-Host ""

if ($staticImageCount -le ($cameraDirectories.Count * $MaxSnapshots)) {
    Write-Host "✓ static/images is within Cloudflare build limits!" -ForegroundColor Green
} else {
    Write-Host "⚠ static/images may still be too large. Expected: $($cameraDirectories.Count * $MaxSnapshots) or fewer" -ForegroundColor Yellow
}
