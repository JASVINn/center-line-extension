# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2025-09-17

### Added

- Toggle behavior: clicking the extension icon again closes the overlay
- Resize handling: grid and handles clamp to viewport on window resize
- Panel reposition/minimize with synced minimized icon position

### Fixed

- Overlay sizing now uses fixed edges (no 100vw/100vh overflow)
- Handles align exactly with the selected area (no right-edge overhang)
- Layering: panel sits above handles; handles above grid lines

## [0.9.0-beta] - 2025-09-17

### Added

- Golden Ratio grid type
- Draggable start/end rulers for area selection
- 1/3 preset as default for Fractional grid
- Floating, repositionable control panel
- Minimize/restore panel
- Customizable grid colors, opacity, and thickness
- Area selection with draggable handles

### Changed

- Improved UI/UX for grid selection and area handles
- Refactored code for maintainability

### Fixed

- Handles now disappear when panel is closed
- Grid adapts to selected area
