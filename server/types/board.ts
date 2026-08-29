export interface BoardTile {
  id: number;
  name: string;
  type: "property" | "event" | "start";
  price?: number;
  baseRent?: number;
  rent?: number;
  ownerId?: string;
  level?: number;
}