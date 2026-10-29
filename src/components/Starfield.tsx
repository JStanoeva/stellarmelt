import type { CSSProperties } from "react";
import { stars } from "../lib/constellation";

export default function Starfield() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-20" aria-hidden="true">
      {stars.map((s, i) => {
        const style: CSSProperties = {
          position: "absolute",
          top: `${s.top}%`,
          left: `${s.left}%`,
          width: `${s.size}px`,
          height: `${s.size}px`,
          borderRadius: "9999px",
          background: "white",
          opacity: s.opacity,
          animationDelay: `${s.delay}s`,
          animationDuration: `${s.duration}s`,
        };
        return <span key={i} className="twinkle" style={style} />;
      })}
    </div>
  );
}
