// /src/components/ArcWheelV5.jsx
import { useEffect, useState } from "react";

/**
 * ArcWheelV5
 * - 4 images on a true circular arc to the right of the big one.
 * - Slots (by design): [0]=Top, [1]=Left (BIG), [2]=Right, [3]=Bottom.
 * - Click Top => rotate +1 (clockwise) so Top becomes Left(BIG).
 * - Click Bottom => rotate -1 (counter-clockwise) so Bottom becomes Left(BIG).
 * - Click Right => rotate +2 (half-turn) so Right becomes Left(BIG).
 * - Click Left(BIG) => no-op.
 *
 * NEW: onLeftChange?(absIndex: 0..3)
 * - Fired whenever the LEFT(BIG) image changes (including on mount).
 * - Lets the parent (About.jsx) fade in/out the matching left-column text.
 */
export default function ArcWheelV5({
  images = [],

  // ---- TUNING KNOBS (adjust to taste) ----
  canvasW = 860,             // canvas width (big enough area for all slots)
  canvasH = 520,             // canvas height
  bigSize = 360,             // diameter of Left (BIG) slot
  thumbTop = 120,
  thumbRight = 140,
  thumbBottom = 130,

  // position the circle of thumbs
  arcCenterX = 580,          // arc center X (to the right of the big circle)
  arcCenterY = 260,          // arc center Y (vertical center)
  arcRadius  = 200,          // arc radius

  // animation
  durationMs = 600,          // overall smoothness
  easing = "cubic-bezier(.22,.9,.22,1)",

  // 🔔 NEW
  onLeftChange,              // (absIndex:number) => void
}) {
  if (images.length !== 4) {
    console.warn("ArcWheelV5 expects exactly 4 images.");
  }

  // offset controls which image is in which slot.
  // For image index i, its present slot index is: (i - offset + 4) % 4
  // We want slot order = [Top, Left(BIG), Right, Bottom] = indices [0,1,2,3]
  const [offset, setOffset] = useState(0);

  // Angles for the 4 slots (deg) on *one* circle
  // 0° is along +X; we use: Top=-90°, Left=180°, Right=0°, Bottom=90°.
  const ANG = [-90, 180, 0, 90];
  const SIZES = [thumbTop, bigSize, thumbRight, thumbBottom];

  // Helpers
  const toRad = (deg) => (deg * Math.PI) / 180;

  // Compute absolute slot position (top-left) from slot index 0..3
  const slotPos = (slotIdx) => {
    const size = SIZES[slotIdx];
    const angle = ANG[slotIdx];
    const cx = arcCenterX + arcRadius * Math.cos(toRad(angle));
    const cy = arcCenterY + arcRadius * Math.sin(toRad(angle));
    return {
      x: cx - size / 2,
      y: cy - size / 2,
      size,
    };
  };

  // 🔔 Notify parent which abs image is at LEFT (slot 1)
  const leftAbsIndex = (offset + 1) % 4;
  useEffect(() => {
    if (typeof onLeftChange === "function") onLeftChange(leftAbsIndex);
    // we intentionally only depend on offset so it's called each rotation step
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset]);

  // Click logic with direction tied to where you clicked:
  // Top(0) => +1 (clockwise), Right(2) => +2 (half turn), Bottom(3) => -1 (counter-clockwise), Left(1) => no-op.
  const handleClick = (imageIndex) => {
    const currentSlot = (imageIndex - offset + 4) % 4; // 0=Top, 1=Left(big), 2=Right, 3=Bottom
    if (currentSlot === 1) return; // already the big left circle

    let delta;
    if (currentSlot === 0) delta = +1;      // Top -> clockwise quarter turn
    else if (currentSlot === 2) delta = +2; // Right -> half turn (clockwise)
    else if (currentSlot === 3) delta = -1; // Bottom -> counter-clockwise quarter turn
    else delta = 0;

    // Apply spin (keeps your existing animation behavior)
    setOffset((prev) => (prev + delta + 4) % 4);
  };

  return (
    <div
      className="relative"
      style={{ width: canvasW, height: canvasH, overflow: "visible" }}
    >
      {/* guide lines (optional) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 ${canvasW} ${canvasH}`}>
        {/* top-left to arc */}
        <line x1="420" y1="120" x2={arcCenterX - arcRadius + 30} y2={arcCenterY - 30} stroke="#cfd5da" strokeWidth="6" strokeLinecap="round" />
        {/* center to right edge */}
        <line x1={arcCenterX} y1={arcCenterY} x2={canvasW} y2={arcCenterY} stroke="#cfd5da" strokeWidth="6" strokeLinecap="round" />
      </svg>

      {images.map((src, i) => {
        const slotIdx = (i - offset + 4) % 4; // which slot this image occupies now
        const { x, y, size } = slotPos(slotIdx);
        const isBig = slotIdx === 1;

        return (
          <button
            key={i}
            type="button"
            onClick={() => handleClick(i)}
            className="absolute rounded-full overflow-hidden bg-white ring-1 ring-black/5 shadow-xl transition-all hover:scale-[1.03]"
            style={{
              left: x,
              top: y,
              width: size,
              height: size,
              zIndex: isBig ? 5 : 4,
              transitionDuration: `${durationMs}ms`,
              transitionTimingFunction: easing,
            }}
            aria-label={`wheel image ${i + 1}`}
          >
            {src && <img src={src} alt="" className="w-full h-full object-cover" draggable="false" />}
          </button>
        );
      })}
    </div>
  );
}
