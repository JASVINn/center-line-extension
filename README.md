# Center Lines Overlay

A Chrome extension for overlaying center lines and advanced grid systems on any website. Useful for designers, developers, and anyone who needs to check alignment, spacing, or layout structure.

![center-line-overlay](https://github.com/user-attachments/assets/a35fd4de-908f-4dee-ba8a-62b4f1649db9)

## Features

- Horizontal and vertical center lines
- Multiple grid types: Fractional, Pixel, REM, Viewport, Golden Ratio, and more
- Draggable rulers to restrict grid area
- Floating, repositionable control panel
- Customizable grid colors, opacity, and thickness
- Area selection with draggable handles
- Minimize/restore panel and persistent settings

## Install
1. Go to chrome://extensions and enable Developer mode.
2. Click "Load unpacked" and select this folder.

## Quick start
1. Click the extension icon to toggle the overlay on/off.
2. Use the floating panel to pick a Grid Type and tweak appearance.
3. Optionally enable "Grid Area Selection" to restrict where the grid renders.
4. Drag the blue handles (sides/corners) to set your grid area.
5. Use "Reposition" to move the panel between corners, or minimize it.

## Controls at a glance
- Grid Type: Center Only, Fractional (e.g., 1/2, 1/3, 1/4), Pixel, REM, Viewport
- Divisions (Fractional): Quick presets: ½, ⅓, ¼, Mix (2,3,4)
- Step Size (Pixel/REM/Viewport): Spacing between grid lines
- Colors/Thickness: Separate settings for center vs grid lines
- Opacity: Grid/center line transparency with live percentage
- Grid Area Selection: Toggle draggable rulers/handles
- Reposition: Moves the panel to the next corner
- Minimize: Hides panel; click the circular icon to restore

Tips
- Resize-safe: Grid and handles automatically clamp to the viewport on window resize.
- Toggle: Clicking the extension icon again closes the overlay (acts as a toggle).

## Grid Types

- **Center Only**: Shows only the center lines
- **Fractional**: Divide the area into equal parts (e.g., halves, thirds, quarters)
- **Golden Ratio**: Shows lines at 61.8% and 38.2%
- **Pixel**: Grid lines every N pixels
- **REM**: Grid lines every N rem units
- **Viewport**: Grid lines every N vw/vh units

## Development

- Manifest V3, minimal permissions
- All logic lives in `contentScript.js`
- No Node/CI dependencies required for usage

## Contributing

Pull requests and suggestions are welcome! Please open an issue for bugs or feature requests.

## License

MIT
