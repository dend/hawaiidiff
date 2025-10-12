# HawaiiDiff

A static website that displays real-time snapshots from telescope cameras on Mauna Kea, Hawaii. Built with Hugo and automated snapshot collection via GitHub Actions.

## Features

- 🌋 **34 Camera Feeds** - Live snapshots from observatories on Mauna Kea
- 📱 **Responsive Design** - Optimized for desktop, tablet, and mobile
- 🕒 **Automatic Updates** - Snapshots collected every 20 minutes via GitHub Actions
- 📊 **Snapshot History** - View previous snapshots and browse full history on GitHub
- ⚡ **WebP Optimization** - Efficient image format for fast loading

## Prerequisites

- [Hugo](https://gohugo.io/installation/) (v0.100.0 or later)
- Bash shell (for snapshot collection script)
- `jq` (JSON processor)
- `cwebp` (for WebP image conversion)
- `curl` (for downloading images)

## Quick Start

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/dend/hawaiidiff.git
   cd hawaiidiff
   ```

2. Run the development server:
   ```bash
   hugo server -D
   ```

3. Open your browser to `http://localhost:1313`

### Building for Production

Build the static site:

```bash
hugo --minify
```

Output will be in the `public/` directory, ready for deployment to any static hosting service.

## Camera Configuration

Cameras are configured in `data/cameras.json`. Each camera requires:

```json
{
  "id": "camera-slug",
  "name": "Display Name",
  "uri": "https://example.com/snapshot.jpg",
  "direction": "N"
}
```

**Fields:**
- `id`: Unique identifier (used in URLs and file paths)
- `name`: Display name shown in the UI
- `uri`: Source URL for snapshot images
- `direction` (optional): Compass direction (N, NE, E, SE, S, SW, W, NW, or location like "Hilo")

## Snapshot Collection

The `collector/fetch-snapshots.sh` script downloads and converts camera snapshots to WebP format. It:

- Downloads images from camera URIs
- Converts to WebP format (80% quality)
- Saves with timestamp: `YYYY_MM_DD_HH_MM.webp`
- Keeps the 11 most recent snapshots per camera
- Runs automatically via GitHub Actions every 20 minutes

### Manual Execution

```bash
./collector/fetch-snapshots.sh
```

### Install Dependencies (macOS)

```bash
brew install jq webp
```

## Project Structure

```
hawaiidiff/
├── .github/
│   └── workflows/        # GitHub Actions automation
├── assets/
│   ├── css/             # Stylesheets (main.css)
│   └── js/              # JavaScript (timestamp formatting)
├── collector/
│   ├── fetch-snapshots.sh   # Snapshot collection script
│   └── contracts/           # JSON schema for cameras
├── content/
│   ├── about.md         # About page content
│   └── cameras/         # Camera markdown files (generated)
├── data/
│   └── cameras.json     # Camera configuration
├── layouts/
│   ├── index.html       # Homepage template
│   ├── cameras/
│   │   └── single.html  # Camera detail page
│   ├── page/
│   │   └── single.html  # Generic page template
│   └── partials/        # Reusable components
├── static/
│   ├── favicon/         # Site favicons
│   └── images/          # Snapshot storage (organized by camera ID)
├── hugo.toml            # Hugo configuration
└── README.md
```

## How It Works

1. **Snapshot Collection**: GitHub Actions runs `fetch-snapshots.sh` every 20 minutes
2. **Image Processing**: Downloaded images are converted to WebP format
3. **Storage**: Images are saved to `static/images/{camera-id}/` with timestamp filenames
4. **Site Generation**: Hugo generates static pages with camera grids and detail views
5. **JavaScript Enhancement**: Client-side JS parses timestamps and formats display times

## Camera Pages

Each camera has:
- **Latest Snapshot**: Full-size current image
- **Navigation**: Previous/Next camera with position indicator
- **Previous Snapshots**: Grid of recent images (up to 10)
- **Timestamp Display**: Date and time in HST, PT, and ET
- **GitHub Integration**: Links to view full snapshot history

## License

See [LICENSE](LICENSE) file for details.
