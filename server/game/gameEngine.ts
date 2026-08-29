import type { Game } from "../types/game.js";
import type { Player } from "../types/player.js";
import type { BoardTile } from "../types/board.js";

const board: BoardTile[] = [
  { id: 0, name: "Start", type: "start" },

  {
    id: 1,
    name: "Beach Cafe",
    type: "property",
    price: 200,
    baseRent: 50,
    rent: 50,
  },

  { id: 2, name: "Chaos Event", type: "event" },

  {
    id: 3,
    name: "Shopping Mall",
    type: "property",
    price: 300,
    baseRent: 60,
    rent: 60,
  },

  { id: 4, name: "Chaos Event", type: "event" },

  {
    id: 5,
    name: "Luxury Hotel",
    type: "property",
    price: 500,
    baseRent: 100,
    rent: 100,
  },

  { id: 6, name: "Chaos Event", type: "event" },

  {
    id: 7,
    name: "Tech Park",
    type: "property",
    price: 400,
    baseRent: 80,
    rent: 80,
  },

  { id: 8, name: "Chaos Event", type: "event" },

  {
    id: 9,
    name: "Cinema",
    type: "property",
    price: 250,
    baseRent: 50,
    rent: 50,
  },

  { id: 10, name: "Start Bonus", type: "start" },

  {
    id: 11,
    name: "Restaurant",
    type: "property",
    price: 350,
    baseRent: 70,
    rent: 70,
  },

  { id: 12, name: "Chaos Event", type: "event" },

  {
    id: 13,
    name: "Stadium",
    type: "property",
    price: 600,
    baseRent: 120,
    rent: 120,
  },

  { id: 14, name: "Chaos Event", type: "event" },

  {
    id: 15,
    name: "Airport",
    type: "property",
    price: 700,
    baseRent: 140,
    rent: 140,
  },

  { id: 16, name: "Chaos Event", type: "event" },

  {
    id: 17,
    name: "University",
    type: "property",
    price: 450,
    baseRent: 90,
    rent: 90,
  },

  { id: 18, name: "Chaos Event", type: "event" },

  {
    id: 19,
    name: "Mega Tower",
    type: "property",
    price: 1000,
    baseRent: 200,
    rent: 200,
  },
];

export function createGame(gameId: string): Game {
  return {
    id: gameId,
    players: [],
    board,
    currentPlayerIndex: 0,
    status: "waiting",
    hasRolled: false,
    pendingAction: "none",
  };
}

export function createPlayer(id: string, name: string): Player {
  return {
    id,
    name,
    cash: 1500,
    position: 0,
    properties: [],
    influence: 0,
    reputation: 100,
    chaosTokens: 1,
  };
}

export function addPlayer(game: Game, player: Player): void {
  if (game.status !== "waiting") {
    throw new Error("Game has already started");
  }

  game.players.push(player);
}

export function startGame(game: Game): void {
  if (game.players.length < 2) {
    throw new Error("At least 2 players are required");
  }

  game.status = "playing";
  game.currentPlayerIndex = 0;
}

export function rollDice(): number {
  return Math.floor(Math.random() * 6) + 1;
}

export function movePlayer(
  game: Game,
  playerId: string,
  diceRoll: number,
): boolean {
  const player = game.players.find((player) => player.id === playerId);

  if (!player) {
    throw new Error("Player not found");
  }

  const oldPosition = player.position;

  const newPosition = oldPosition + diceRoll;

  let passedStart = false;

  if (newPosition >= game.board.length) {
    passedStart = true;

    player.cash += 200;
  }

  player.position = newPosition % game.board.length;

  return passedStart;
}

export function getCurrentTile(game: Game, playerId: string): BoardTile {
  const player = game.players.find((player) => player.id === playerId);

  if (!player) {
    throw new Error("Player not found");
  }

  const tile = game.board[player.position];

  if (!tile) {
    throw new Error("Invalid player position");
  }

  return tile;
}

export function buyProperty(game: Game, playerId: string): void {
  const player = game.players.find((player) => player.id === playerId);

  if (!player) {
    throw new Error("Player not found");
  }

  const tile = game.board[player.position];

  if (!tile) {
    throw new Error("Invalid player position");
  }

  if (tile.type !== "property") {
    throw new Error("You are not on a property tile");
  }

  if (tile.ownerId) {
    throw new Error("Property already owned");
  }

  if (!tile.price) {
    throw new Error("Property has no price");
  }

  if (player.cash < tile.price) {
    throw new Error("Not enough cash");
  }

  // Buy property
  player.cash -= tile.price;
  tile.ownerId = player.id;
  player.properties.push(tile.id);
}

export function payRent(game: Game, playerId: string): void {
  const player = game.players.find((player) => player.id === playerId);

  if (!player) {
    throw new Error("Player not found");
  }

  const tile = game.board[player.position];

  if (!tile) {
    throw new Error("Invalid player position");
  }

  if (tile.type !== "property") {
    throw new Error("You are not on a property tile");
  }

  if (!tile.ownerId) {
    throw new Error("Property is not owned");
  }

  if (tile.ownerId === player.id) {
    throw new Error("You own this property");
  }

  if (!tile.rent) {
    throw new Error("Property has no rent");
  }

  const owner = game.players.find((player) => player.id === tile.ownerId);

  if (!owner) {
    throw new Error("Property owner not found");
  }

  if (player.cash < tile.rent) {
    bankruptPlayer(game, player.id);
    return;
  }

  player.cash -= tile.rent;
  owner.cash += tile.rent;
}

export function triggerChaosEvent(game: Game, playerId: string): string {
  const player = game.players.find((player) => player.id === playerId);

  if (!player) {
    throw new Error("Player not found");
  }

  const events = [
    {
      message: "You found hidden money! +200 cash",
      action: () => {
        player.cash += 200;
      },
    },
    {
      message: "Unexpected expenses! -150 cash",
      action: () => {
        player.cash -= 150;
      },
    },
    {
      message: "Your popularity increased! +10 influence",
      action: () => {
        player.influence += 10;
      },
    },
    {
      message: "Bad publicity! -10 reputation",
      action: () => {
        player.reputation -= 10;
      },
    },
  ];

  const randomIndex = Math.floor(Math.random() * events.length);

  const selectedEvent = events[randomIndex];

  if (!selectedEvent) {
    throw new Error("Could not select event");
  }

  selectedEvent.action();

  if (player.cash < 0) {
    bankruptPlayer(game, player.id);
  }

  return selectedEvent.message;
}

export function bankruptPlayer(game: Game, playerId: string): void {
  const playerIndex = game.players.findIndex(
    (player) => player.id === playerId,
  );

  if (playerIndex === -1) {
    throw new Error("Player not found");
  }

  // Release all properties owned by the bankrupt player
  for (const tile of game.board) {
    if (tile.ownerId === playerId) {
      delete tile.ownerId;
    }
  }

  // Remove the player
  game.players.splice(playerIndex, 1);

  // Check if only one player remains
  if (game.players.length === 1) {
    game.status = "finished";

    const winner = game.players[0];

    if (winner) {
      game.winnerId = winner.id;
    }

    return;
  }

  // Fix current player index after removal
  if (playerIndex < game.currentPlayerIndex) {
    game.currentPlayerIndex--;
  }

  if (game.currentPlayerIndex >= game.players.length) {
    game.currentPlayerIndex = 0;
  }

  // The next player should get a fresh turn
  game.hasRolled = false;
  game.pendingAction = "none";
}


export function upgradeProperty(
  game: Game,
  playerId: string
): void {
  const player = game.players.find(
    (player) => player.id === playerId
  );

  if (!player) {
    throw new Error("Player not found");
  }

  const tile = getCurrentTile(game, playerId);

  if (tile.type !== "property") {
    throw new Error("You are not on a property tile");
  }

  if (tile.ownerId !== playerId) {
    throw new Error("You do not own this property");
  }

  const currentLevel = tile.level ?? 1;
  const maxLevel = 5;

  if (currentLevel >= maxLevel) {
    throw new Error("Property is already at maximum level");
  }

  const upgradeCost = currentLevel * 100;

  if (player.cash < upgradeCost) {
    throw new Error("Not enough cash to upgrade");
  }

  player.cash -= upgradeCost;

  tile.level = currentLevel + 1;

  tile.rent = Math.floor((tile.rent ?? 50) * 1.5);
}


export function sellProperty(
  game: Game,
  playerId: string
): void {
  const player = game.players.find(
    (player) => player.id === playerId
  );

  if (!player) {
    throw new Error("Player not found");
  }

  const tile = getCurrentTile(game, playerId);

  if (tile.type !== "property") {
    throw new Error("You are not on a property tile");
  }

  if (tile.ownerId !== playerId) {
    throw new Error("You do not own this property");
  }

  if (!tile.price) {
    throw new Error("Property has no price");
  }

  const sellPrice = Math.floor(tile.price * 0.5);

  player.cash += sellPrice;

  delete tile.ownerId;
  delete tile.level;

  if (tile.baseRent !== undefined) {
  tile.rent = tile.baseRent;
}

  const propertyIndex = player.properties.indexOf(tile.id);

  if (propertyIndex !== -1) {
    player.properties.splice(propertyIndex, 1);
  }
}


export function tradeProperty(
  game: Game,
  sellerId: string,
  buyerId: string,
  propertyId: number,
  price: number
): void {
  const seller = game.players.find(
    (player) => player.id === sellerId
  );

  const buyer = game.players.find(
    (player) => player.id === buyerId
  );

  if (!seller || !buyer) {
    throw new Error("Player not found");
  }

  if (sellerId === buyerId) {
    throw new Error("You cannot trade with yourself");
  }

  if (price <= 0) {
    throw new Error("Trade price must be greater than 0");
  }

  const tile = game.board.find(
    (tile) => tile.id === propertyId
  );

  if (!tile || tile.type !== "property") {
    throw new Error("Property not found");
  }

  if (tile.ownerId !== sellerId) {
    throw new Error("Seller does not own this property");
  }

  if (buyer.cash < price) {
    throw new Error("Buyer does not have enough cash");
  }

  // Transfer money
  buyer.cash -= price;
  seller.cash += price;

  // Transfer ownership
  tile.ownerId = buyerId;

  // Remove from seller
  const propertyIndex = seller.properties.indexOf(propertyId);

  if (propertyIndex !== -1) {
    seller.properties.splice(propertyIndex, 1);
  }

  // Add to buyer
  buyer.properties.push(propertyId);
}