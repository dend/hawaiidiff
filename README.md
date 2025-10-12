# Mauna Kea Camera Snapshot Visualizer

A static website displaying real-time snapshots from 34 cameras on Mauna Kea, built with Hugo.

## Prerequisites

- [Hugo](https://gohugo.io/installation/) (v0.100.0 or later)
- Bash shell (for snapshot collection script)
- `cwebp` command-line tool (for WebP image conversion)

## Quick Start

### Local Development

1. Clone the repository:
   ```bash
   git clone <repository-url>
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

Cameras are configured in `collector/cameras.json`. Each camera requires:
- `id`: Unique identifier (used in URLs)
- `name`: Display name
- `uri`: Source URL for snapshot images
- `direction` (optional): Compass direction (N, NE, E, etc.)
- `description` (optional): Text description

## Snapshot Collection

The `collector/fetch-snapshots.sh` script downloads and converts camera snapshots to WebP format. It runs automatically via GitHub Actions every 20 minutes.

Manual execution:
```bash
./collector/fetch-snapshots.sh
```

## Project Structure

- `collector/` - Camera configuration and fetch script
- `data/images/` - Snapshot images organized by camera ID
- `layouts/` - Hugo HTML templates
- `assets/` - CSS and JavaScript source files
- `content/` - Markdown content (if any)
- `static/` - Static assets copied to output

## For More Details

See `specs/001-mauna-kea-camera/quickstart.md` for comprehensive setup instructions.

## License

See LICENSE file for details.
