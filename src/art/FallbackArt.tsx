import type { CSSProperties } from "react";
import { useIsTall } from "../hooks/useIsTall";
import type { Anchors } from "./anchors";
import { heroY, MOON_START, poseFor, type Pose, type PoseName } from "./poses";

type OrbitProps = {
  orbit: number;
  squash: number;
  roll: number;
  moon: number;
  moonAngle: number;
  drift: number;
  // The timeline's orbit stops at the moon resting in its ring: only the half behind it is drawn.
  endsAtMoon: boolean;
  half?: boolean;
};

// SVG units: 1 = the outer orbit's radius. y points down, so the near half of a tilted orbit is y > 0.
function OrbitLines({
  orbit,
  squash,
  roll,
  moon,
  moonAngle,
  drift,
  endsAtMoon,
  half = false,
}: OrbitProps) {
  const moonX = Math.cos(moonAngle) * orbit * drift;
  const moonY = -Math.sin(moonAngle) * orbit * squash * drift;
  const at = (angle: number) =>
    `${Math.cos(angle) * orbit} ${-Math.sin(angle) * orbit * squash}`;
  const arc = `A ${orbit} ${orbit * squash} 0 0 1`;
  const stroke = {
    fill: "none",
    className: "stroke-mauve-200",
    strokeOpacity: 0.7,
    strokeWidth: 1.4,
    strokeDasharray: "0.1 5",
    strokeLinecap: "round",
    vectorEffect: "non-scaling-stroke",
  } as const;
  return (
    <svg
      viewBox="-1 -1 2 2"
      className="fallback-orbits absolute overflow-visible"
      aria-hidden="true"
    >
      {half && (
        <clipPath id="fallback-near-half">
          <rect x="-2" y="0" width="4" height="2" />
        </clipPath>
      )}
      <g
        transform={`rotate(${roll})`}
        clipPath={half ? "url(#fallback-near-half)" : undefined}
      >
        {endsAtMoon ? (
          <path
            d={`M ${at(moonAngle)} ${arc} ${at(moonAngle - Math.PI / 2)} ${arc} ${at(moonAngle - Math.PI)}`}
            {...stroke}
          />
        ) : (
          <ellipse rx={orbit} ry={orbit * squash} {...stroke} />
        )}
        {!half && !endsAtMoon && (
          <ellipse
            rx={1}
            ry={squash}
            transform="rotate(-6)"
            fill="none"
            className="stroke-starlight-300"
            strokeOpacity={0.35}
            strokeWidth={2}
            strokeDasharray="0.1 16"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        )}
        <circle cx={moonX} cy={moonY} r={moon} className="fill-rose-300" />
      </g>
    </svg>
  );
}

// The still's orbit runs through the timeline's ring as well: undo the SVG's roll and the tilt's squash.
function throughRing(
  pose: Pose,
  anchors: Anchors,
): { orbit: number; angle: number } | null {
  const { ring, width, height } = anchors;
  if (!ring) return null;
  const dx = ring.x - pose.x * width;
  const dy = ring.y - pose.y * height;
  const cos = Math.cos(pose.roll);
  const sin = Math.sin(pose.roll);
  const x = dx * cos - dy * sin;
  const y = (dx * sin + dy * cos) / Math.cos(pose.tilt);
  return {
    orbit: Math.hypot(x, y) / (pose.radius * Math.min(width, height)),
    angle: Math.atan2(-y, x),
  };
}

type Props = {
  pose: PoseName;
  anchors: Anchors;
  // Ease between poses only once the visitor has stepped; on load the copy is still being measured.
  glide: boolean;
};

// The planet at rest (the specimen's panel D) in the scene's pose: before the scene loads, without WebGL, or on an error.
export default function FallbackArt({ pose: name, anchors, glide }: Props) {
  const tall = useIsTall();
  let pose = poseFor(name, tall);
  let moonAngle = MOON_START;
  if (name === "hero" && !tall)
    pose = { ...pose, y: heroY(pose.y, pose.radius, anchors) };
  const ring = name === "timeline" ? throughRing(pose, anchors) : null;
  if (ring) {
    pose = {
      ...pose,
      orbit: ring.orbit,
      outer: (ring.orbit * pose.outer) / pose.orbit,
    };
    moonAngle = ring.angle;
  }

  const squash = Math.cos(pose.tilt);
  const roll = (-pose.roll * 180) / Math.PI;
  const vars = {
    "--x": pose.x,
    "--y": pose.y,
    "--r": pose.radius,
    "--outer": pose.outer,
    "--light": pose.light,
  } as CSSProperties;
  const lines = {
    orbit: pose.orbit / pose.outer,
    squash,
    roll,
    moon: pose.moon / pose.outer,
    moonAngle,
    drift: pose.drift,
    endsAtMoon: ring !== null,
  };

  return (
    <div
      className="fallback-art absolute inset-0 bg-night-950"
      data-glide={glide || undefined}
      style={vars}
    >
      <div className="fallback-stars absolute inset-0" />
      <div className="fallback-halftone absolute inset-0" />
      <OrbitLines {...lines} />
      <div className="fallback-planet" />
      <div className="fallback-planet fallback-backlit" />
      <OrbitLines {...lines} half />
    </div>
  );
}
