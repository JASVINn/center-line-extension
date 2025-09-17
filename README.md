# Center Lines Overlay

A Chrome extension for overlaying center lines and advanced grid systems on any website. Useful for designers, developers, and anyone who needs to check alignment, spacing, or layout structure.

## Features
- Horizontal and vertical center lines
- Multiple grid types: Fractional, Pixel, REM, Viewport, Golden Ratio, and more
- Draggable rulers to restrict grid area
- Floating, repositionable control panel
- Customizable grid colors, opacity, and thickness
- Area selection with draggable handles
- Minimize/restore panel and persistent settings

## Usage
1. Install the extension in Chrome (load as unpacked extension in developer mode).
2. Click the extension icon to activate the overlay on any page.
3. Use the floating control panel to select grid type, customize appearance, and enable area selection.
4. Drag the handles to restrict the grid overlay to a specific area if desired.
5. Minimize or reposition the panel as needed.

## Grid Types
- **Center Only**: Shows only the center lines
- **Fractional**: Divide the area into equal parts (e.g., halves, thirds, quarters)
- **Golden Ratio**: Shows lines at 61.8% and 38.2%
- **Pixel**: Grid lines every N pixels
- **REM**: Grid lines every N rem units
- **Viewport**: Grid lines every N vw/vh units

## Development
- All logic is in `contentScript.js` (modularization planned)
- Manifest V3, minimal permissions
- No external dependencies

## Contributing
Pull requests and suggestions are welcome! Please open an issue for bugs or feature requests.

## License
MIT
