import { use } from "react";
import { Player, type PlayerValue } from "../player/player";

export function usePlayer(): PlayerValue {
  const value = use(Player);
  if (!value) throw new Error("usePlayer needs <PlayerProvider>");
  return value;
}
