// Import grid rendering functions

(() => {
  const overlayId = "center-lines-overlay";
  const panelId = "center-lines-panel";
  const minimizedIconId = "center-lines-minimized";
  const panelCorners = [
    { top: "20px", left: "20px", bottom: "", right: "" }, // top-left
    { top: "20px", left: "", bottom: "", right: "20px" }, // top-right
    { top: "", left: "20px", bottom: "20px", right: "" }, // bottom-left
    { top: "", left: "", bottom: "20px", right: "20px" }, // bottom-right
  ];
  let panelCorner = 2; // start top-right
  let isMinimized = false;

  // Default settings
  const settings = {
    gridType: "fractional",
    fractions: "2,3,4",
    unitStep: 100,
    centerLineColor: "#dc2626",
    gridLineColor: "#f59e0b",
    opacity: 0.8,
    thickness: 2,
    gridThickness: 1,
    showCenterLines: true,
    showGrid: true,
  };

  // Remove overlays if present
  document
    .querySelectorAll(`#${overlayId}, #${panelId}`)
    .forEach((el) => el.remove());

  // Create overlay
  const overlay = document.createElement("div");
  overlay.id = overlayId;
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 9999;
  `;
  document.body.appendChild(overlay);

  function createMinimizedIcon() {
    const icon = document.createElement("div");
    icon.id = minimizedIconId;
    icon.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 10001;
      box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
      transition: all 0.2s ease;
      font-size: 20px;
      color: white;
      user-select: none;
    `;
    icon.innerHTML = "⊞";

    // Hover effects
    icon.addEventListener("mouseenter", () => {
      icon.style.transform = "scale(1.1)";
      icon.style.boxShadow = "0 6px 16px rgba(220, 38, 38, 0.4)";
    });
    icon.addEventListener("mouseleave", () => {
      icon.style.transform = "scale(1)";
      icon.style.boxShadow = "0 4px 12px rgba(220, 38, 38, 0.3)";
    });

    // Click to restore panel
    icon.onclick = () => {
      isMinimized = false;
      panel.style.display = "block";
      icon.remove();
    };

    return icon;
  }

  // Create settings panel with modern styling
  const panel = document.createElement("div");
  panel.id = panelId;
  panel.style.cssText = `
    position: fixed;
    background: linear-gradient(135deg, #ffffff 0%, #fef2f2 100%);
    color: #374151;
    padding: 0;
    border-radius: 12px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    user-select: none;
    z-index: 10000;
    pointer-events: auto;
    width: 340px;
    max-width: calc(100vw - 40px);
    max-height: calc(100vh - 40px);
    overflow-y: auto;
    border: 1px solid #e5e7eb;
    backdrop-filter: blur(10px);
  `;
  setPanelCorner(panel, panelCorner);

  // Panel content with modern design and better overflow handling
  panel.innerHTML = `
    <div style="padding: 20px; border-bottom: 1px solid #e5e7eb;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 8px; height: 8px; background: #dc2626; border-radius: 50%;"></div>
          <h3 style="margin: 0; font-weight: 700; font-size: 16px; color: #111827;">Grid Overlay</h3>
        </div>
        <button id="minimizeBtn" style="
          background: none;
          border: none;
          color: #6b7280;
          font-size: 18px;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s ease;
        " title="Minimize">−</button>
      </div>
      
      <div style="display: grid; gap: 16px;">
        <!-- Grid Type and Fractions/Step Size in one row -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div>
            <label style="display: block; font-weight: 600; margin-bottom: 8px; color: #374151; font-size: 13px;">
              Grid Type
            </label>
            <select id="gridType" style="
              width: 100%;
              padding: 8px 10px;
              border: 2px solid #e5e7eb;
              border-radius: 6px;
              background: white;
              color: #374151;
              font-size: 13px;
              transition: all 0.2s ease;
              cursor: pointer;
              box-sizing: border-box;
            ">
              <option value="center-only">Center Only</option>
              <option value="fractional">Fractional</option>
              <option value="px">Pixel</option>
              <option value="vw">Viewport</option>
              <option value="rem">REM</option>
            </select>
          </div>

          <!-- Fractional/Unit Input -->
          <div>
            <div id="fractionalLabel" style="display: none;">
              <label style="display: block; font-weight: 600; margin-bottom: 8px; color: #374151; font-size: 13px;">
                Divisions
              </label>
              <!-- Added preset buttons for common fractions -->
              <div style="display: flex; gap: 4px; margin-bottom: 8px;">
                <button class="fraction-preset" data-fractions="2" style="
                  padding: 4px 8px;
                  border: 1px solid #e5e7eb;
                  border-radius: 4px;
                  background: white;
                  color: #374151;
                  font-size: 11px;
                  cursor: pointer;
                  transition: all 0.2s ease;
                ">½</button>
                <button class="fraction-preset" data-fractions="3" style="
                  padding: 4px 8px;
                  border: 1px solid #e5e7eb;
                  border-radius: 4px;
                  background: white;
                  color: #374151;
                  font-size: 11px;
                  cursor: pointer;
                  transition: all 0.2s ease;
                ">⅓</button>
                <button class="fraction-preset" data-fractions="4" style="
                  padding: 4px 8px;
                  border: 1px solid #e5e7eb;
                  border-radius: 4px;
                  background: white;
                  color: #374151;
                  font-size: 11px;
                  cursor: pointer;
                  transition: all 0.2s ease;
                ">¼</button>
                <button class="fraction-preset" data-fractions="2,3,4" style="
                  padding: 4px 6px;
                  border: 1px solid #e5e7eb;
                  border-radius: 4px;
                  background: white;
                  color: #374151;
                  font-size: 11px;
                  cursor: pointer;
                  transition: all 0.2s ease;
                ">Mix</button>
              </div>
              <input id="fractions" type="text" value="2,3,4" placeholder="e.g. 2,3,4" style="
                width: 100%;
                padding: 8px 10px;
                border: 2px solid #e5e7eb;
                border-radius: 6px;
                background: white;
                color: #374151;
                font-size: 13px;
                transition: all 0.2s ease;
                box-sizing: border-box;
              ">
              <!-- Added helpful description -->
              <div style="font-size: 11px; color: #6b7280; margin-top: 4px;">
                Enter numbers to divide the screen (e.g. "2,3" creates halves and thirds)
              </div>
            </div>

            <div id="unitLabel" style="display: none;">
              <label style="display: block; font-weight: 600; margin-bottom: 8px; color: #374151; font-size: 13px;">
                Step Size
              </label>
              <input id="unitStep" type="number" value="100" min="1" style="
                width: 100%;
                padding: 8px 10px;
                border: 2px solid #e5e7eb;
                border-radius: 6px;
                background: white;
                color: #374151;
                font-size: 13px;
                transition: all 0.2s ease;
                box-sizing: border-box;
              ">
            </div>
          </div>
        </div>

        <!-- Center Lines Color and Thickness -->
        <div>
          <label style="display: block; font-weight: 600; margin-bottom: 8px; color: #374151; font-size: 13px;">
            Center Lines
          </label>
          <div style="display: flex; align-items: center; gap: 10px;">
            <input id="centerLineColor" type="color" value="#dc2626" style="
              width: 36px;
              height: 36px;
              border: none;
              border-radius: 6px;
              cursor: pointer;
              background: none;
            ">
            <input id="centerThickness" type="range" min="1" max="5" value="2" style="
              flex: 1;
              accent-color: #6b7280;
            ">
          </div>
        </div>

        <!-- Grid Lines Color and Thickness -->
        <div>
          <label style="display: block; font-weight: 600; margin-bottom: 8px; color: #374151; font-size: 13px;">
            Grid Lines
          </label>
          <div style="display: flex; align-items: center; gap: 10px;">
            <input id="gridLineColor" type="color" value="#f59e0b" style="
              width: 36px;
              height: 36px;
              border: none;
              border-radius: 6px;
              cursor: pointer;
              background: none;
            ">
            <input id="gridThickness" type="range" min="1" max="5" value="2" style="
              flex: 1;
              accent-color: #6b7280;
            ">
          </div>
        </div>

        <!-- Opacity Control -->
        <div>
          <label style="display: block; font-weight: 600; margin-bottom: 8px; color: #464b53ff; font-size: 13px;">
            Opacity
          </label>
          <div style="display: flex; align-items: center; gap: 10px;">
            <input id="opacity" type="range" min="0.1" max="1" step="0.1" value="0.8" style="
              flex: 1;
              accent-color: #6e737eff;
            ">
            <span id="opacityValue" style="
              font-weight: 600;
              color: #6b7280;
              min-width: 35px;
              text-align: center;
              font-size: 12px;
            ">80%</span>
          </div>
        </div>

        <!-- Toggle Controls -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
            <input id="showCenterLines" type="checkbox" checked style="
              width: 16px;
              height: 16px;
              accent-color: #dc2626;
              cursor: pointer;
            ">
            <span style="font-weight: 500; color: #374151; font-size: 12px;">Center Lines</span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
            <input id="showGrid" type="checkbox" checked style="
              width: 16px;
              height: 16px;
              accent-color: #f59e0b;
              cursor: pointer;
            ">
            <span style="font-weight: 500; color: #374151; font-size: 12px;">Grid Lines</span>
          </label>
        </div>
        <!-- Grid Area Selection Toggle -->
        <div style="margin-top: 10px;">
          <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
            <input id="enableGridArea" type="checkbox" style="width: 16px; height: 16px; accent-color: #6366f1; background: #6366f1; cursor: pointer;">
            <span style="font-weight: 500; color: #374151; font-size: 12px;">Enable Grid Area Selection</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div style="padding: 16px 20px; display: flex; gap: 10px;">
      <button id="movePanelBtn" style="
        flex: 1;
        padding: 10px 16px;
        background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        font-size: 13px;
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: 0 2px 4px rgba(245, 158, 11, 0.2);
      " title="Click to move panel to next corner">⤴ Reposition</button>
      <button id="closePanelBtn" style="
        flex: 1;
        padding: 10px 16px;
        background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        font-size: 13px;
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: 0 2px 4px rgba(220, 38, 38, 0.2);
      ">✕ Close</button>
    </div>
  `;
  document.body.appendChild(panel);

  // Add hover effects to buttons
  const buttons = panel.querySelectorAll("button");
  buttons.forEach((button) => {
    button.addEventListener("mouseenter", () => {
      button.style.transform = "translateY(-1px)";
      button.style.boxShadow =
        button.id === "movePanelBtn"
          ? "0 4px 8px rgba(245, 158, 11, 0.3)"
          : "0 4px 8px rgba(220, 38, 38, 0.3)";
    });
    button.addEventListener("mouseleave", () => {
      button.style.transform = "translateY(0)";
      button.style.boxShadow =
        button.id === "movePanelBtn"
          ? "0 2px 4px rgba(245, 158, 11, 0.2)"
          : "0 2px 4px rgba(220, 38, 38, 0.2)";
    });
  });

  // Add focus effects to inputs
  const inputs = panel.querySelectorAll("input, select");
  inputs.forEach((input) => {
    input.addEventListener("focus", () => {
      if (
        input.type !== "color" &&
        input.type !== "range" &&
        input.type !== "checkbox"
      ) {
        input.style.borderColor = "#dc2626";
        input.style.boxShadow = "0 0 0 3px rgba(220, 38, 38, 0.1)";
      }
    });
    input.addEventListener("blur", () => {
      if (
        input.type !== "color" &&
        input.type !== "range" &&
        input.type !== "checkbox"
      ) {
        input.style.borderColor = "#e5e7eb";
        input.style.boxShadow = "none";
      }
    });
  });

  // Area selection state
  let areaSelection = {
    enabled: false,
    x1: 0,
    y1: 0,
    x2: window.innerWidth,
    y2: window.innerHeight,
  };

  // Ensure handles are above content but below panel
  function getPanelZIndex() {
    return parseInt(panel.style.zIndex || 10000, 10);
  }

  // Create draggable rulers/handles
  function createRulerHandles() {
    // Remove old handles
    document.querySelectorAll(".grid-area-handle").forEach((e) => e.remove());
    if (!areaSelection.enabled) return;
    // Create 8 handles: 4 sides, 4 corners
    const handles = [
      // Sides
      {
        axis: "x",
        prop: "x1",
        style: {
          left: "0",
          top: "0",
          bottom: "0",
          width: "8px",
          cursor: "ew-resize",
        },
      },
      {
        axis: "x",
        prop: "x2",
        style: {
          right: "0",
          top: "0",
          bottom: "0",
          width: "8px",
          cursor: "ew-resize",
        },
      },
      {
        axis: "y",
        prop: "y1",
        style: {
          top: "0",
          left: "0",
          right: "0",
          height: "8px",
          cursor: "ns-resize",
        },
      },
      {
        axis: "y",
        prop: "y2",
        style: {
          bottom: "0",
          left: "0",
          right: "0",
          height: "8px",
          cursor: "ns-resize",
        },
      },
      // Corners
      {
        corner: "tl",
        style: {
          left: "0",
          top: "0",
          width: "14px",
          height: "14px",
          cursor: "nwse-resize",
        },
      },
      {
        corner: "tr",
        style: {
          right: "0",
          top: "0",
          width: "14px",
          height: "14px",
          cursor: "nesw-resize",
        },
      },
      {
        corner: "bl",
        style: {
          left: "0",
          bottom: "0",
          width: "14px",
          height: "14px",
          cursor: "nesw-resize",
        },
      },
      {
        corner: "br",
        style: {
          right: "0",
          bottom: "0",
          width: "14px",
          height: "14px",
          cursor: "nwse-resize",
        },
      },
    ];
    const handleZ = getPanelZIndex() - 1;
    handles.forEach((h) => {
      const handle = document.createElement("div");
      handle.className = "grid-area-handle";
      handle.style.position = "fixed";
      handle.style.zIndex = handleZ;
      handle.style.background = "#6366f1cc";
      handle.style.borderRadius = "4px";
      handle.style.opacity = "0.7";
      Object.assign(handle.style, h.style);
      // Position handle
      if (h.axis === "x") {
        handle.style.left = h.prop === "x1" ? areaSelection.x1 + "px" : "";
        handle.style.right =
          h.prop === "x2" ? window.innerWidth - areaSelection.x2 + "px" : "";
        handle.style.top = areaSelection.y1 + "px";
        handle.style.height = areaSelection.y2 - areaSelection.y1 + "px";
      } else if (h.axis === "y") {
        handle.style.top = h.prop === "y1" ? areaSelection.y1 + "px" : "";
        handle.style.bottom =
          h.prop === "y2" ? window.innerHeight - areaSelection.y2 + "px" : "";
        handle.style.left = areaSelection.x1 + "px";
        handle.style.width = areaSelection.x2 - areaSelection.x1 + "px";
      } else if (h.corner) {
        // Corners: set both axes
        if (h.corner === "tl") {
          handle.style.left = areaSelection.x1 + "px";
          handle.style.top = areaSelection.y1 + "px";
        } else if (h.corner === "tr") {
          handle.style.right = window.innerWidth - areaSelection.x2 + "px";
          handle.style.top = areaSelection.y1 + "px";
        } else if (h.corner === "bl") {
          handle.style.left = areaSelection.x1 + "px";
          handle.style.bottom = window.innerHeight - areaSelection.y2 + "px";
        } else if (h.corner === "br") {
          handle.style.right = window.innerWidth - areaSelection.x2 + "px";
          handle.style.bottom = window.innerHeight - areaSelection.y2 + "px";
        }
      }
      // Drag logic
      let dragging = false;
      let dragStart = null;
      handle.addEventListener("mousedown", (e) => {
        dragging = true;
        dragStart = { x: e.clientX, y: e.clientY, ...areaSelection };
        document.body.style.userSelect = "none";
        e.preventDefault();
      });
      window.addEventListener("mousemove", (e) => {
        if (!dragging) return;
        if (h.axis === "x") {
          let val = Math.max(0, Math.min(window.innerWidth, e.clientX));
          areaSelection[h.prop] = val;
        } else if (h.axis === "y") {
          let val = Math.max(0, Math.min(window.innerHeight, e.clientY));
          areaSelection[h.prop] = val;
        } else if (h.corner) {
          // Diagonal drag: update both axes
          let dx = e.clientX - dragStart.x;
          let dy = e.clientY - dragStart.y;
          if (h.corner === "tl") {
            areaSelection.x1 = Math.max(
              0,
              Math.min(window.innerWidth, dragStart.x1 + dx)
            );
            areaSelection.y1 = Math.max(
              0,
              Math.min(window.innerHeight, dragStart.y1 + dy)
            );
          } else if (h.corner === "tr") {
            areaSelection.x2 = Math.max(
              0,
              Math.min(window.innerWidth, dragStart.x2 + dx)
            );
            areaSelection.y1 = Math.max(
              0,
              Math.min(window.innerHeight, dragStart.y1 + dy)
            );
          } else if (h.corner === "bl") {
            areaSelection.x1 = Math.max(
              0,
              Math.min(window.innerWidth, dragStart.x1 + dx)
            );
            areaSelection.y2 = Math.max(
              0,
              Math.min(window.innerHeight, dragStart.y2 + dy)
            );
          } else if (h.corner === "br") {
            areaSelection.x2 = Math.max(
              0,
              Math.min(window.innerWidth, dragStart.x2 + dx)
            );
            areaSelection.y2 = Math.max(
              0,
              Math.min(window.innerHeight, dragStart.y2 + dy)
            );
          }
        }
        // Prevent inverted area
        if (areaSelection.x2 < areaSelection.x1)
          [areaSelection.x1, areaSelection.x2] = [
            areaSelection.x2,
            areaSelection.x1,
          ];
        if (areaSelection.y2 < areaSelection.y1)
          [areaSelection.y1, areaSelection.y2] = [
            areaSelection.y2,
            areaSelection.y1,
          ];
        createRulerHandles();
        renderGrid();
      });
      window.addEventListener("mouseup", () => {
        dragging = false;
        document.body.style.userSelect = "";
      });
      document.body.appendChild(handle);
    });
  }

  // Listen for toggle
  panel.addEventListener("change", (e) => {
    if (e.target && e.target.id === "enableGridArea") {
      areaSelection.enabled = e.target.checked;
      if (!areaSelection.enabled) {
        areaSelection.x1 = 0;
        areaSelection.y1 = 0;
        areaSelection.x2 = window.innerWidth;
        areaSelection.y2 = window.innerHeight;
      }
      createRulerHandles();
      renderGrid();
    }
  });
  function setPanelCorner(panel, cornerIdx) {
    const c = panelCorners[cornerIdx];
    panel.style.top = c.top;
    panel.style.left = c.left;
    panel.style.bottom = c.bottom;
    panel.style.right = c.right;
  }

  // Grid rendering logic
  function renderGrid() {
    overlay.innerHTML = "";

    // Update settings from UI
    settings.gridType = document.getElementById("gridType").value;
    settings.fractions = document.getElementById("fractions").value;
    // Set reasonable defaults for REM and Viewport
    let unitStepInput = document.getElementById("unitStep");
    let gridType = document.getElementById("gridType").value;
    if (
      gridType === "rem" &&
      (!unitStepInput.value || unitStepInput.value === "100")
    ) {
      unitStepInput.value = 2; // 2rem default
    }
    if (
      gridType === "vw" &&
      (!unitStepInput.value || unitStepInput.value === "100")
    ) {
      unitStepInput.value = 10; // 10vw default
    }
    settings.unitStep = Number.parseInt(unitStepInput.value, 10) || 100;
    settings.centerLineColor = document.getElementById("centerLineColor").value;
    settings.gridLineColor = document.getElementById("gridLineColor").value;
    settings.opacity = Number.parseFloat(
      document.getElementById("opacity").value
    );
    settings.thickness = Number.parseInt(
      document.getElementById("centerThickness").value
    );
    settings.gridThickness = Number.parseInt(
      document.getElementById("gridThickness").value
    );
    settings.showCenterLines =
      document.getElementById("showCenterLines").checked;
    settings.showGrid = document.getElementById("showGrid").checked;

    // Update opacity display
    document.getElementById("opacityValue").textContent =
      Math.round(settings.opacity * 100) + "%";

    // Restrict grid to area selection if enabled
    let gridArea = {
      left: 0,
      top: 0,
      right: window.innerWidth,
      bottom: window.innerHeight,
    };
    if (areaSelection.enabled) {
      gridArea.left = Math.min(areaSelection.x1, areaSelection.x2);
      gridArea.top = Math.min(areaSelection.y1, areaSelection.y2);
      gridArea.right = Math.max(areaSelection.x1, areaSelection.x2);
      gridArea.bottom = Math.max(areaSelection.y1, areaSelection.y2);
      overlay.style.clipPath = `inset(${gridArea.top}px ${window.innerWidth - gridArea.right}px ${window.innerHeight - gridArea.bottom}px ${gridArea.left}px)`;
    } else {
      overlay.style.clipPath = "";
    }

    if (settings.gridType === "center-only") {
      addCenterLinesOnly(overlay, gridArea);
    } else if (settings.gridType === "fractional") {
      const fractions = settings.fractions
        .split(",")
        .map((n) => Number.parseInt(n.trim(), 10))
        .filter((n) => n > 1);
      addFractionalGrid(
        overlay,
        fractions.length ? fractions : [2, 3, 4],
        gridArea
      );
    } else {
      addUnitGrid(overlay, settings.gridType, settings.unitStep, gridArea);
    }
  }
  // Grid functions with enhanced styling
  function createLine(
    orientation,
    position,
    color = "red",
    thickness = 2,
    opacity = 1,
    gridArea = {
      left: 0,
      top: 0,
      right: window.innerWidth,
      bottom: window.innerHeight,
    }
  ) {
    const line = document.createElement("div");
    line.style.position = "absolute";
    line.style.backgroundColor = color;
    line.style.opacity = opacity;
    line.style.transition = "opacity 0.2s ease";
    if (orientation === "vertical") {
      line.style.top = gridArea.top + "px";
      line.style.height = gridArea.bottom - gridArea.top + "px";
      if (typeof position === "number") {
        line.style.left = gridArea.left + position + "px";
      } else if (typeof position === "string" && position.endsWith("%")) {
        // percent of area width
        const percent = parseFloat(position) / 100;
        line.style.left =
          gridArea.left + percent * (gridArea.right - gridArea.left) + "px";
      } else if (typeof position === "string" && position.endsWith("px")) {
        line.style.left = gridArea.left + parseFloat(position) + "px";
      } else {
        line.style.left = position;
      }
      line.style.width = thickness + "px";
    } else {
      line.style.left = gridArea.left + "px";
      line.style.width = gridArea.right - gridArea.left + "px";
      if (typeof position === "number") {
        line.style.top = gridArea.top + position + "px";
      } else if (typeof position === "string" && position.endsWith("%")) {
        const percent = parseFloat(position) / 100;
        line.style.top =
          gridArea.top + percent * (gridArea.bottom - gridArea.top) + "px";
      } else if (typeof position === "string" && position.endsWith("px")) {
        line.style.top = gridArea.top + parseFloat(position) + "px";
      } else {
        line.style.top = position;
      }
      line.style.height = thickness + "px";
    }
    return line;
  }

  function addFractionalGrid(overlay, fractions = [2, 3, 4], gridArea) {
    // Add grid lines
    if (settings.showGrid) {
      fractions.forEach((fraction) => {
        const stepPercent = 100 / fraction;
        for (let i = 1; i < fraction; i++) {
          const percent = i * stepPercent + "%";
          overlay.appendChild(
            createLine(
              "vertical",
              percent,
              settings.gridLineColor,
              settings.gridThickness,
              settings.opacity,
              gridArea
            )
          );
        }
        for (let i = 1; i < fraction; i++) {
          const percent = i * stepPercent + "%";
          overlay.appendChild(
            createLine(
              "horizontal",
              percent,
              settings.gridLineColor,
              settings.gridThickness,
              settings.opacity,
              gridArea
            )
          );
        }
      });
    }
    // Add center lines
    if (settings.showCenterLines) {
      overlay.appendChild(
        createLine(
          "vertical",
          "50%",
          settings.centerLineColor,
          settings.thickness,
          settings.opacity,
          gridArea
        )
      );
      overlay.appendChild(
        createLine(
          "horizontal",
          "50%",
          settings.centerLineColor,
          settings.thickness,
          settings.opacity,
          gridArea
        )
      );
    }
  }

  function addUnitGrid(overlay, unit = "px", step = 100, gridArea) {
    const width = gridArea.right - gridArea.left;
    const height = gridArea.bottom - gridArea.top;

    // Add center lines
    if (settings.showCenterLines) {
      overlay.appendChild(
        createLine(
          "vertical",
          "50%",
          settings.centerLineColor,
          settings.thickness,
          settings.opacity,
          gridArea
        )
      );
      overlay.appendChild(
        createLine(
          "horizontal",
          "50%",
          settings.centerLineColor,
          settings.thickness,
          settings.opacity,
          gridArea
        )
      );
    }

    if (!settings.showGrid) return;

    if (unit === "px") {
      for (let x = step; x < width + step; x += step) {
        overlay.appendChild(
          createLine(
            "vertical",
            x,
            settings.gridLineColor,
            settings.gridThickness,
            settings.opacity,
            gridArea
          )
        );
      }
      for (let y = step; y < height + step; y += step) {
        overlay.appendChild(
          createLine(
            "horizontal",
            y,
            settings.gridLineColor,
            settings.gridThickness,
            settings.opacity,
            gridArea
          )
        );
      }
    } else if (unit === "vw") {
      for (let i = step; i < 100; i += step) {
        const x = (i / 100) * width;
        overlay.appendChild(
          createLine(
            "vertical",
            x,
            settings.gridLineColor,
            settings.gridThickness,
            settings.opacity,
            gridArea
          )
        );
      }
      for (let i = step; i < 100; i += step) {
        const y = (i / 100) * height;
        overlay.appendChild(
          createLine(
            "horizontal",
            y,
            settings.gridLineColor,
            settings.gridThickness,
            settings.opacity,
            gridArea
          )
        );
      }
    } else if (unit === "rem") {
      const rem = Number.parseFloat(
        getComputedStyle(document.documentElement).fontSize
      );
      const stepPx = step * rem;
      for (let x = stepPx; x < width + stepPx; x += stepPx) {
        overlay.appendChild(
          createLine(
            "vertical",
            x,
            settings.gridLineColor,
            settings.gridThickness,
            settings.opacity,
            gridArea
          )
        );
      }
      for (let y = stepPx; y < height + stepPx; y += stepPx) {
        overlay.appendChild(
          createLine(
            "horizontal",
            y,
            settings.gridLineColor,
            settings.gridThickness,
            settings.opacity,
            gridArea
          )
        );
      }
    }
  }

  function addCenterLinesOnly(overlay, gridArea) {
    overlay.appendChild(
      createLine(
        "vertical",
        "50%",
        settings.centerLineColor,
        settings.thickness,
        settings.opacity,
        gridArea
      )
    );
    overlay.appendChild(
      createLine(
        "horizontal",
        "50%",
        settings.centerLineColor,
        settings.thickness,
        settings.opacity,
        gridArea
      )
    );
  }

  // Panel event listeners
  panel.querySelector("#movePanelBtn").onclick = () => {
    const button = panel.querySelector("#movePanelBtn");

    // Show visual feedback
    button.style.transform = "scale(0.95)";
    button.innerHTML = "Moving...";

    setTimeout(() => {
      panelCorner = (panelCorner + 1) % 4;
      setPanelCorner(panel, panelCorner);

      // If minimized, move the minimized icon as well
      if (isMinimized) {
        const icon = document.getElementById(minimizedIconId);
        if (icon) {
          const c = panelCorners[panelCorner];
          icon.style.top = c.top;
          icon.style.left = c.left;
          icon.style.bottom = c.bottom;
          icon.style.right = c.right;
        }
      }

      // Update button text based on next position
      const positions = [
        "↖ Top-Left",
        "↗ Top-Right",
        "↙ Bottom-Left",
        "↘ Bottom-Right",
      ];
      const nextPosition = positions[panelCorner];

      button.innerHTML = "⤴ Reposition";
      button.style.transform = "scale(1)";

      // Show brief tooltip of current position
      const tooltip = document.createElement("div");
      tooltip.style.cssText = `
        position: fixed;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 12px;
        z-index: 10002;
        pointer-events: none;
        transition: opacity 0.3s ease;
      `;
      tooltip.textContent = `Moved to ${nextPosition.split(" ")[1]}`;

      // Position tooltip near the button
      const rect = button.getBoundingClientRect();
      tooltip.style.left = rect.left + "px";
      tooltip.style.top = rect.top - 40 + "px";

      document.body.appendChild(tooltip);

      // Fade out tooltip
      setTimeout(() => {
        tooltip.style.opacity = "0";
        setTimeout(() => tooltip.remove(), 300);
      }, 1500);
    }, 150);
  };

  panel.querySelector("#closePanelBtn").onclick = () => {
    overlay.remove();
    panel.remove();
    // Remove area selection handles if present
    document.querySelectorAll(".grid-area-handle").forEach((e) => e.remove());
  };

  panel.querySelector("#gridType").onchange = function () {
    if (this.value === "fractional") {
      panel.querySelector("#fractionalLabel").style.display = "block";
      panel.querySelector("#unitLabel").style.display = "none";
      // Set 1/3 as default when selecting fractional
      const fractionsInput = document.getElementById("fractions");
      if (fractionsInput) {
        fractionsInput.value = "3";
      }
      // Optionally update preset button styles
      const fractionPresets = panel.querySelectorAll(".fraction-preset");
      fractionPresets.forEach((btn) => {
        btn.style.background = "white";
        btn.style.borderColor = "#e5e7eb";
        btn.style.color = "#374151";
        if (btn.dataset.fractions === "3") {
          btn.style.background = "#dc2626";
          btn.style.borderColor = "#dc2626";
          btn.style.color = "white";
        }
      });
    } else if (this.value === "center-only") {
      panel.querySelector("#fractionalLabel").style.display = "none";
      panel.querySelector("#unitLabel").style.display = "none";
    } else {
      panel.querySelector("#fractionalLabel").style.display = "none";
      panel.querySelector("#unitLabel").style.display = "block";
    }
    renderGrid();
  };

  // Add hover effect to minimize button (no shadow)
  const minimizeBtn = panel.querySelector("#minimizeBtn");
  minimizeBtn.addEventListener("mouseenter", () => {
    minimizeBtn.style.background = "#f3f4f6";
    minimizeBtn.style.color = "#374151";
    minimizeBtn.style.boxShadow = "none";
  });
  minimizeBtn.addEventListener("mouseleave", () => {
    minimizeBtn.style.background = "none";
    minimizeBtn.style.color = "#6b7280";
    minimizeBtn.style.boxShadow = "none";
  });

  // Minimize panel and show icon at same corner
  minimizeBtn.addEventListener("click", () => {
    isMinimized = true;
    panel.style.display = "none";
    // Remove any existing minimized icon
    const oldIcon = document.getElementById(minimizedIconId);
    if (oldIcon) oldIcon.remove();
    // Create and position minimized icon at current panel corner
    const icon = createMinimizedIcon();
    // Set icon position to match panel corner
    const c = panelCorners[panelCorner];
    icon.style.top = c.top;
    icon.style.left = c.left;
    icon.style.bottom = c.bottom;
    icon.style.right = c.right;
    document.body.appendChild(icon);
  });

  // Add event listeners for all controls
  [
    "fractions",
    "unitStep",
    "centerLineColor",
    "gridLineColor",
    "opacity",
    "centerThickness",
    "gridThickness",
    "showCenterLines",
    "showGrid",
    "enableGridArea",
  ].forEach((id) => {
    const element = panel.querySelector(`#${id}`);
    if (element) {
      element.addEventListener(
        element.type === "checkbox" ? "change" : "input",
        renderGrid
      );
    }
  });

  // Initial area handles
  createRulerHandles();

  const fractionPresets = panel.querySelectorAll(".fraction-preset");
  fractionPresets.forEach((button) => {
    button.addEventListener("click", () => {
      const fractions = button.dataset.fractions;
      document.getElementById("fractions").value = fractions;

      // Update button styles to show active state
      fractionPresets.forEach((btn) => {
        btn.style.background = "white";
        btn.style.borderColor = "#e5e7eb";
        btn.style.color = "#374151";
      });
      button.style.background = "#dc2626";
      button.style.borderColor = "#dc2626";
      button.style.color = "white";

      renderGrid();
    });

    // Add hover effects
    button.addEventListener("mouseenter", () => {
      if (button.style.background !== "rgb(220, 38, 38)") {
        button.style.background = "#f3f4f6";
        button.style.borderColor = "#d1d5db";
      }
    });
    button.addEventListener("mouseleave", () => {
      if (button.style.background !== "rgb(220, 38, 38)") {
        button.style.background = "white";
        button.style.borderColor = "#e5e7eb";
      }
    });
  });

  // Initial render
  renderGrid();
})();
