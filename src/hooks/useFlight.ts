import { use } from "react";
import { Flight, type FlightValue } from "../flight/flight";

export function useFlight(): FlightValue {
  const value = use(Flight);
  if (!value) throw new Error("useFlight needs <FlightProvider>");
  return value;
}
