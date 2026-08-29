import type { Player } from "./player.js";
import type { BoardTile } from "./board.js";

export interface Game {
  id: string;
  players: Player[];
  board: BoardTile[];
  currentPlayerIndex: number;
  status: "waiting" | "playing" | "finished";
  hasRolled: boolean;
  pendingAction: "none" | "buy";
  winnerId?: string;
}