// three.js and the flight load only when the cue is pressed or the Listening Room opens; the cue's pointer-down and FlightLayer share this request.
export const loadFlightScene = () => import("./FlightScene");
