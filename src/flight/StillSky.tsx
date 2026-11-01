import StarField from "./StarField";

// Without WebGL 2 (or if the flight's scene fails) the Listening Room still opens onto a deep, still sky.
export default function StillSky() {
  return (
    <div className="absolute inset-0 bg-night-950">
      <div className="listen-clouds absolute inset-0" />
      <StarField seed="still-sky" count={900} />
    </div>
  );
}
