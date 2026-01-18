import { useEffect, useState } from "react";

export default function Cursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        width: 18,
        height: 18,
        borderRadius: "50%",
        background: "rgba(255,255,255,0.35)",
        mixBlendMode: "difference",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        transition: "transform 0.08s linear",
        zIndex: 9999
      }}
    />
  );
}
