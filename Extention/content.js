(() => {
  // =========================
  // Config
  // =========================
  const EXT_NAMESPACE = "factify";
  const MAX_TEXT = 600; // keep selected text short for demo
  const ICON_SIZE = 34;

  // =========================
  // Utilities
  // =========================
  const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

  function getSelectionText() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return "";
    const text = sel.toString().trim();
    if (!text) return "";
    return text.slice(0, MAX_TEXT);
  }

  function getSelectionRangeRect() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;
    const range = sel.getRangeAt(0);

    // Sometimes range.getBoundingClientRect() returns 0,0 if selection is weird.
    // We'll also try getClientRects.
    let rect = range.getBoundingClientRect();
    if (rect && rect.width === 0 && rect.height === 0) {
      const rects = range.getClientRects();
      rect = rects && rects.length ? rects[0] : rect;
    }
    if (!rect) return null;
    return rect;
  }

  // =========================
  // Shadow Root UI (isolated)
  // =========================
  const host = document.createElement("div");
  host.id = `${EXT_NAMESPACE}-root-host`;
  host.style.all = "initial";
  host.style.position = "fixed";
  host.style.left = "0";
  host.style.top = "0";
  host.style.zIndex = "2147483647"; // max-ish
  document.documentElement.appendChild(host);

  const shadow = host.attachShadow({ mode: "open" });

  shadow.innerHTML = `
    <style>
      :host { all: initial; }

      .wrap {
        position: fixed;
        left: 0; top: 0;
        z-index: 2147483647;
        pointer-events: none;
        font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
      }

      /* Floating icon button */
      .fab {
        width: ${ICON_SIZE}px;
        height: ${ICON_SIZE}px;
        border-radius: 999px;
        display: grid;
        place-items: center;
        box-shadow:
          0 10px 25px rgba(0,0,0,.18),
          0 2px 8px rgba(0,0,0,.15);
        background: #111827; /* slate-900 */
        color: white;
        border: 1px solid rgba(255,255,255,.16);
        pointer-events: auto;
        cursor: pointer;
        user-select: none;
        transition: transform .12s ease, box-shadow .12s ease, background .12s ease;
      }
      .fab:hover {
        transform: translateY(-1px);
        background: #0f172a;
        box-shadow:
          0 14px 30px rgba(0,0,0,.20),
          0 4px 10px rgba(0,0,0,.16);
      }
      .fab:active {
        transform: translateY(0px) scale(.98);
      }

      .logo {
        width: 18px; height: 18px;
        display: block;
      }

      /* Popover container */
      .popover {
        width: 360px;
        max-width: min(360px, calc(100vw - 24px));
        border-radius: 14px;
        background: rgba(17, 24, 39, 0.98); /* slate-900 */
        color: #e5e7eb; /* gray-200 */
        border: 1px solid rgba(255,255,255,.10);
        box-shadow:
          0 18px 45px rgba(0,0,0,.28),
          0 4px 14px rgba(0,0,0,.18);
        overflow: hidden;
        pointer-events: auto;
        transform-origin: top left;
        animation: pop .10s ease-out;
      }
      @keyframes pop { from { transform: scale(.98); opacity: .6; } to { transform: scale(1); opacity: 1; } }

      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 12px 10px;
        border-bottom: 1px solid rgba(255,255,255,.08);
      }

      .brand {
        display: flex;
        gap: 10px;
        align-items: center;
      }

      .badge {
        font-size: 12px;
        padding: 3px 8px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,.12);
        background: rgba(255,255,255,.06);
        color: #f3f4f6;
      }

      .title {
        font-size: 13px;
        font-weight: 700;
        letter-spacing: .2px;
        color: #f9fafb;
        line-height: 1.2;
      }

      .close {
        width: 30px;
        height: 30px;
        border-radius: 10px;
        display: grid;
        place-items: center;
        cursor: pointer;
        border: 1px solid rgba(255,255,255,.10);
        background: rgba(255,255,255,.06);
        color: #e5e7eb;
        transition: background .12s ease;
      }
      .close:hover { background: rgba(255,255,255,.10); }

      .body {
        padding: 12px;
        display: grid;
        gap: 10px;
      }

      .snippet {
        font-size: 12px;
        line-height: 1.45;
        color: rgba(229,231,235,.92);
        background: rgba(255,255,255,.05);
        border: 1px solid rgba(255,255,255,.07);
        padding: 10px;
        border-radius: 12px;
        max-height: 90px;
        overflow: auto;
        white-space: pre-wrap;
        word-break: break-word;
      }

      .row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }

      .status {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .status .label {
        font-size: 11px;
        color: rgba(229,231,235,.75);
      }
      .status .value {
        font-size: 14px;
        font-weight: 800;
        color: #f9fafb;
      }

      .pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 8px 10px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,.10);
        background: rgba(255,255,255,.06);
        font-size: 12px;
        color: #f9fafb;
      }

      .meter {
        height: 10px;
        border-radius: 999px;
        background: rgba(255,255,255,.08);
        overflow: hidden;
        border: 1px solid rgba(255,255,255,.08);
      }
      .bar {
        height: 100%;
        width: 0%;
        background: linear-gradient(90deg, #22c55e, #f59e0b, #ef4444);
        border-radius: 999px;
        transition: width .25s ease;
      }

      .actions {
        display: flex;
        gap: 8px;
        margin-top: 2px;
      }

      .btn {
        flex: 1;
        padding: 10px 10px;
        border-radius: 12px;
        cursor: pointer;
        border: 1px solid rgba(255,255,255,.12);
        background: rgba(255,255,255,.06);
        color: #f9fafb;
        font-size: 12px;
        font-weight: 700;
        transition: transform .08s ease, background .12s ease;
        user-select: none;
      }
      .btn:hover { background: rgba(255,255,255,.10); }
      .btn:active { transform: scale(.99); }

      .btn.primary {
        background: rgba(59,130,246,.18);
        border-color: rgba(59,130,246,.35);
      }
      .btn.primary:hover { background: rgba(59,130,246,.25); }

      .footer {
        padding: 10px 12px 12px;
        border-top: 1px solid rgba(255,255,255,.08);
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        color: rgba(229,231,235,.7);
        font-size: 11px;
      }

      .link {
        color: rgba(229,231,235,.85);
        text-decoration: none;
        border-bottom: 1px dashed rgba(229,231,235,.35);
      }
      .link:hover { color: #fff; }

      /* Layout nodes we show/hide */
      .node { position: fixed; left: 0; top: 0; display: none; }
      .node.show { display: block; }

      /* small arrow */
      .arrow {
        width: 12px; height: 12px;
        position: absolute;
        background: rgba(17, 24, 39, 0.98);
        border-left: 1px solid rgba(255,255,255,.10);
        border-top: 1px solid rgba(255,255,255,.10);
        transform: rotate(45deg);
        top: -6px;
        left: 18px;
      }
    </style>

    <div class="wrap">
      <div id="fabNode" class="node">
        <div id="fab" class="fab" title="Check with Factify">
          <!-- simple F icon (SVG) -->
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <!-- Shield outline representing trust and verification -->
  <path d="M50 10 L20 25 L20 45 Q20 70 50 90 Q80 70 80 45 L80 25 Z" 
        fill="none" 
        stroke="#2563eb" 
        stroke-width="3"/>
  
  <!-- Checkmark inside shield -->
  <path d="M35 48 L44 57 L65 36" 
        fill="none" 
        stroke="#2563eb" 
        stroke-width="4" 
        stroke-linecap="round" 
        stroke-linejoin="round"/>
  
  <!-- Accent dot for 'i' in Factify -->
  <circle cx="70" cy="28" r="3" fill="#10b981"/>
</svg>
        </div>
      </div>

      <div id="popoverNode" class="node">
        <div class="popover" role="dialog" aria-label="Factify Result">
          <div class="arrow"></div>
          <div class="header">
            <div class="brand">
              <div>
                <div class="title">Factify</div>
                <div style="font-size:11px;color:rgba(229,231,235,.7);margin-top:2px;">Fake-news quick check</div>
              </div>
              <span id="modeBadge" class="badge">Selection</span>
            </div>
            <div id="closeBtn" class="close" title="Close">✕</div>
          </div>

          <div class="body">
            <div id="snippet" class="snippet"></div>

            <div class="row">
              <div class="status">
                <div class="label">Prediction</div>
                <div id="prediction" class="value">—</div>
              </div>
              <div class="pill">
                <span style="opacity:.75;">Confidence</span>
                <strong id="confidenceText" style="font-size:12px;">—</strong>
              </div>
            </div>

            <div class="meter" aria-label="confidence meter">
              <div id="bar" class="bar"></div>
            </div>

            <div class="actions">
              <div id="highlightBtn" class="btn">Highlight</div>
              <div id="analyzeBtn" class="btn primary">Analyze</div>
            </div>
          </div>

          <div class="footer">
            <span>Tip: Select headline or claim (1–2 sentences)</span>
            <a class="link" href="https://example.com" target="_blank" rel="noreferrer">Learn</a>
          </div>
        </div>
      </div>
    </div>
  `;

  const fabNode = shadow.getElementById("fabNode");
  const popoverNode = shadow.getElementById("popoverNode");
  const fab = shadow.getElementById("fab");
  const closeBtn = shadow.getElementById("closeBtn");

  const snippetEl = shadow.getElementById("snippet");
  const predictionEl = shadow.getElementById("prediction");
  const confidenceTextEl = shadow.getElementById("confidenceText");
  const barEl = shadow.getElementById("bar");
  const highlightBtn = shadow.getElementById("highlightBtn");
  const analyzeBtn = shadow.getElementById("analyzeBtn");

  let lastSelectionText = "";
  let lastSelectionRange = null;

  let hoveringFab = false;
  let hoveringPopover = false;

  function showNode(node, x, y) {
    node.classList.add("show");
    node.style.left = `${x}px`;
    node.style.top = `${y}px`;
  }
  function hideNode(node) {
    node.classList.remove("show");
  }

  function hideAll() {
    hideNode(fabNode);
    hideNode(popoverNode);
  }

  function positionFabNearSelection() {
    const rect = getSelectionRangeRect();
    if (!rect) return;

    // place fab near end of selection
    const x = clamp(rect.right + 8, 8, window.innerWidth - ICON_SIZE - 8);
    const y = clamp(rect.top - 6, 8, window.innerHeight - ICON_SIZE - 8);

    showNode(fabNode, x, y);
  }

  function positionPopoverNearFab() {
    const fabRect = fabNode.getBoundingClientRect();
    if (!fabRect) return;

    // popover below the fab, left aligned with fab
    const popWidth = 360;
    const margin = 8;

    let x = fabRect.left - 10;
    let y = fabRect.bottom + 10;

    // keep on screen
    x = clamp(
      x,
      margin,
      window.innerWidth - Math.min(popWidth, window.innerWidth - 24) - margin,
    );
    y = clamp(y, margin, window.innerHeight - 220 - margin);

    showNode(popoverNode, x, y);

    // move arrow so it points to fab roughly
    const arrow = shadow.querySelector(".arrow");
    if (arrow) {
      const arrowLeft = clamp(fabRect.left - x + 12, 12, 320);
      arrow.style.left = `${arrowLeft}px`;
    }
  }

  // =========================
  // Fake analysis (replace with API)
  // =========================
//   async function getFakeNewsResult(selectedText) {
//     // Replace this with:
//     const res = await fetch("YOUR_API", {method:"POST", body: JSON.stringify({text:selectedText})...})
//     return await res.json();

//     // demo: simple heuristic + random confidence
//     const lower = selectedText.toLowerCase();
//     const suspicious =
//       /shocking|breaking|exposed|miracle|secret|cure|100%|guarantee/.test(
//         lower,
//       );
//     const confidence = Math.round((suspicious ? 75 : 62) + Math.random() * 18); // 62–93
//     return {
//       label: suspicious ? "Likely Fake" : "Likely Real",
//       confidence: clamp(confidence, 1, 99),
//     };
//   }
async function getFakeNewsResult(selectedText) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const res = await fetch("http://localhost:8000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text: selectedText }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const data = await res.json();

    return {
      label: data.label,
      confidence: Math.round(data.confidence * 100),
      probs: data.probs || {}
    };

  } catch (error) {
    console.error("Factify API error:", error);
    return {
      label: "Connection Error",
      confidence: 0,
      probs: {}
    };
  }
}
  function renderResult(result) {
    predictionEl.textContent = result.label;
    confidenceTextEl.textContent = `${result.confidence}%`;
    barEl.style.width = `${result.confidence}%`;

    // Small UI touch: change label color based on result
    if (result.label.includes("Fake")) {
      predictionEl.style.color = "#fca5a5"; // red-ish
    } else {
      predictionEl.style.color = "#86efac"; // green-ish
    }
  }

  function openPopover() {
    // show popover and fill content
    snippetEl.textContent = lastSelectionText || "—";
    predictionEl.textContent = "Checking…";
    confidenceTextEl.textContent = "—";
    barEl.style.width = "0%";

    positionPopoverNearFab();
  }

  async function analyzeSelection() {
    if (!lastSelectionText) return;
    predictionEl.textContent = "Analyzing…";
    const result = await getFakeNewsResult(lastSelectionText);
    renderResult(result);
  }

  // =========================
  // Highlight (simple)
  // =========================
  function highlightSelection() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    const range = sel.getRangeAt(0);
    if (range.collapsed) return;

    // Important: This is a basic approach and may fail on complex pages.
    // For production, use a robust highlighter library or carefully handle DOM splits.
    const span = document.createElement("span");
    span.className = "factify__highlight";
    try {
      range.surroundContents(span);
      sel.removeAllRanges();
    } catch (e) {
      // If surroundContents fails (partial node selection), fallback:
      // just do nothing instead of breaking the page.
      console.warn("Highlight failed (complex selection).", e);
    }
  }

  // =========================
  // Event handling
  // =========================
  function onSelectionChange() {
    const text = getSelectionText();

    // If user cleared selection, hide UI (unless hovered)
    if (!text) {
      lastSelectionText = "";
      lastSelectionRange = null;

      if (!hoveringFab && !hoveringPopover) hideAll();
      return;
    }

    // Save selection info
    lastSelectionText = text;
    lastSelectionRange = window.getSelection().getRangeAt(0);

    // Show fab near selection; hide popover until user hovers/clicks
    positionFabNearSelection();
    hideNode(popoverNode);
  }

  // Hide when clicking elsewhere
  function onDocPointerDown(e) {
    // If click happened inside our UI, ignore
    const path = e.composedPath ? e.composedPath() : [];
    if (path.includes(host)) return;

    // If selection is still there, keep fab visible. Otherwise hide.
    const text = getSelectionText();
    if (!text) hideAll();
  }

  // Update positions on resize/scroll
  function onViewportChange() {
    if (fabNode.classList.contains("show")) positionFabNearSelection();
    if (popoverNode.classList.contains("show")) positionPopoverNearFab();
  }

  // FAB interactions
  fab.addEventListener("mouseenter", () => {
    hoveringFab = true;
    openPopover();
    analyzeSelection(); // auto-run on hover like Sladict
  });
  fab.addEventListener("mouseleave", () => {
    hoveringFab = false;
    // Delay hide so user can move mouse to popover
    setTimeout(() => {
      if (!hoveringFab && !hoveringPopover) hideNode(popoverNode);
    }, 120);
  });
  fab.addEventListener("click", () => {
    openPopover();
    analyzeSelection();
  });

  // Popover interactions
  popoverNode.addEventListener("mouseenter", () => {
    hoveringPopover = true;
  });
  popoverNode.addEventListener("mouseleave", () => {
    hoveringPopover = false;
    setTimeout(() => {
      if (!hoveringFab && !hoveringPopover) hideNode(popoverNode);
    }, 120);
  });

  closeBtn.addEventListener("click", () => {
    hideAll();
  });

  highlightBtn.addEventListener("click", () => {
    highlightSelection();
  });

  analyzeBtn.addEventListener("click", () => {
    analyzeSelection();
  });

  // Global listeners
  document.addEventListener("selectionchange", () => {
    // throttle a bit because selectionchange fires a lot
    clearTimeout(onSelectionChange._t);
    onSelectionChange._t = setTimeout(onSelectionChange, 80);
  });

  document.addEventListener("pointerdown", onDocPointerDown, true);
  window.addEventListener("scroll", onViewportChange, true);
  window.addEventListener("resize", onViewportChange);

  // Safety: if page navigates in SPA, clear UI
  window.addEventListener("blur", () => hideAll());

  // Done
})();
