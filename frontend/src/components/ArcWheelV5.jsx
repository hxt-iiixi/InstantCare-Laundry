import { useEffect, useRef, useState } from "react";

/**
 * ArcWheelV5
 * - 4 images on one circle: Top (0), Right (1), Bottom (2), Left (3, BIG).
 * - Click Top => rotate +90° (clockwise). Click Bottom => rotate -90°.
 * - Center never moves (we rotate around a fixed center).
 * - After the spin finishes, we re-map images to new slots and snap rotation back to 0 with NO transition.
 */
export default function ArcWheelV5({
  images = [],

  // layout knobs
  canvasW = 860,
  canvasH = 520,
  arcCenterX = 600,  // push right
  arcCenterY = 260,
  arcRadius  = 200,

  bigSize   = 360,
  sizeTop   = 120,
  sizeRight = 140,
  sizeBottom= 130,

  durationMs = 700,
}) {
  if (images.length !== 4) console.warn("ArcWheelV5 expects exactly 4 images.");

  // offset = which image sits in Top slot (0..3). Slots: 0 Top, 1 Right, 2 Bottom, 3 Left(BIG)
  const [offset, setOffset] = useState(0);
  const [rot, setRot] = useState(0);            // current rotation (deg) during animation
  const [transitionOn, setTransitionOn] = useState(true);
  const animatingRef = useRef(false);

  // slot definitions (fixed angles; sizes per slot)
  const slots = [
    { name: "top",    ang: -90, size: sizeTop },
    { name: "right",  ang:   0, size: sizeRight },
    { name: "bottom", ang:  90, size: sizeBottom },
    { name: "left",   ang: 180, size: bigSize }, // BIG
  ];

  // which image index is in slot s (0..3) given offset
  const imgAtSlot = (s) => images[(offset + s) % 4];

  const spinBy = (deltaSlots) => {
    if (animatingRef.current) return;
    animatingRef.current = true;

    // rotate the whole wheel by N*90 deg
    const deltaDeg = deltaSlots * 90;
    setTransitionOn(true);
    setRot((r) => r + deltaDeg);

    // after the transition completes, remap offset and snap rot back to 0 without transition
    setTimeout(() => {
      // re-map: moving the container +deltaSlots means Top is now (offset - deltaSlots)
      setOffset((o) => (o - deltaSlots + 4) % 4);

      // disable transition, snap rot to 0 (no visual jump), then re-enable transition
      setTransitionOn(false);
      setRot(0);

      // next tick: re-enable transition
      requestAnimationFrame(() => {
        setTransitionOn(true);
        animatingRef.current = false;
      });
    }, durationMs);
  };

  const onTopClick = () => spinBy(+1);   // clockwise
  const onBottomClick = () => spinBy(-1); // counter-clockwise
  const onRightClick = () => spinBy(+2);  // optional (180°)
  const onLeftClick  = () => {};          // no-op

  return (
    <div className="relative" style={{ width: canvasW, height: canvasH, overflow: "visible" }}>
      {/* guides (optional) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 ${canvasW} ${canvasH}`}>
        <line x1="420" y1="120" x2={arcCenterX - arcRadius + 30} y2={arcCenterY - 30} stroke="#cfd5da" strokeWidth="6" strokeLinecap="round" />
        <line x1={arcCenterX} y1={arcCenterY} x2={canvasW} y2={arcCenterY} stroke="#cfd5da" strokeWidth="6" strokeLinecap="round" />
      </svg>

      {/* the rotating wheel, centered at (arcCenterX, arcCenterY) */}
      <div
        className="absolute"
        style={{
          left: arcCenterX,
          top: arcCenterY,
          transform: `translate(-50%, -50%) rotate(${rot}deg)`,
          transformOrigin: "center center",
          transition: transitionOn ? `transform ${durationMs}ms ease-out` : "none",
        }}
      >
        {slots.map(({ name, ang, size }, sIdx) => {
          const img = imgAtSlot(sIdx);
          const onClick =
            name === "top" ? onTopClick :
            name === "bottom" ? onBottomClick :
            name === "right" ? onRightClick : onLeftClick;

          return (
            <button
              key={name}
              type="button"
              onClick={onClick}
              className="absolute rounded-full overflow-hidden bg-white ring-1 ring-black/5 shadow-xl"
              style={{
                left: 0,
                top: 0,
                width: size,
                height: size,
                // rotate arm to angle -> translate out by radius -> keep image upright -> center by -size/2
                transform: `rotate(${ang}deg) translate(${arcRadius}px) rotate(${-ang - rot}deg) translate(${-size/2}px, ${-size/2}px)`,
                transition: transitionOn ? `transform ${durationMs}ms ease-out` : "none",
                zIndex: name === "left" ? 5 : 4,
              }}
              aria-label={`${name} image`}
            >
              {img && <img src={img} alt="" className="w-full h-full object-cover" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
