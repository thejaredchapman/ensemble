import { useEffect, useRef, useState, useCallback } from "react";
import { getDefaultHue } from "../utils/accentColor";

const POINTER_RADIUS = 42; // % of wheel size

export function AccentPicker({ hue, onChange, onReset, darkMode }) {
  const [open, setOpen] = useState(false);
  const wheelRef = useRef(null);
  const popoverRef = useRef(null);
  const buttonRef = useRef(null);

  const effectiveHue = hue ?? getDefaultHue(darkMode ? "dark" : "light");

  const setHueFromPoint = useCallback((clientX, clientY) => {
    const wheel = wheelRef.current;
    if (!wheel) return;
    const rect = wheel.getBoundingClientRect();
    const x = clientX - (rect.left + rect.width / 2);
    const y = clientY - (rect.top + rect.height / 2);
    const angle = (Math.atan2(y, x) * 180) / Math.PI;
    onChange(Math.round((angle + 360) % 360));
  }, [onChange]);

  const handlePointerDown = useCallback((e) => {
    e.preventDefault();
    setHueFromPoint(e.clientX, e.clientY);

    const handleMove = (ev) => setHueFromPoint(ev.clientX, ev.clientY);
    const handleUp = () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  }, [setHueFromPoint]);

  useEffect(() => {
    if (!open) return;

    function handleClick(e) {
      if (popoverRef.current?.contains(e.target) || buttonRef.current?.contains(e.target)) return;
      setOpen(false);
    }
    function handleKeyDown(e) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const angleRad = (effectiveHue * Math.PI) / 180;
  const pointerStyle = {
    "--pointer-x": `${50 + POINTER_RADIUS * Math.cos(angleRad)}%`,
    "--pointer-y": `${50 + POINTER_RADIUS * Math.sin(angleRad)}%`,
  };

  return (
    <div className="accent-picker">
      <button
        ref={buttonRef}
        className="accent-picker__swatch"
        onClick={() => setOpen((o) => !o)}
        aria-label="Choose accent color"
        title="Accent color"
        aria-expanded={open}
        aria-haspopup="dialog"
      />
      {open && (
        <div
          className="accent-picker__popover glass"
          ref={popoverRef}
          role="dialog"
          aria-label="Accent color picker"
        >
          <div
            className="accent-picker__wheel"
            ref={wheelRef}
            onPointerDown={handlePointerDown}
          >
            <div className="accent-picker__pointer" style={pointerStyle} aria-hidden="true" />
          </div>
          <button className="accent-picker__reset" onClick={onReset}>
            Reset to default
          </button>
        </div>
      )}
    </div>
  );
}
