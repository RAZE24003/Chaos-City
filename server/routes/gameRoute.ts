import { Router } from "express";
import {
  createGame,
  createPlayer,
  addPlayer,
  startGame,
  rollDice,
  movePlayer,
  getCurrentTile,
  buyProperty,
  payRent,
  triggerChaosEvent,
  upgradeProperty,
  sellProperty, 
  tradeProperty,
} from "../game/gameEngine.js";
import type { Game } from "../types/game.js";

const router = Router();

// Temporary in-memory storage
const games = new Map<string, Game>();

// Create a game
router.post("/", (req, res) => {
  const gameId = crypto.randomUUID();

  const game = createGame(gameId);

  games.set(gameId, game);

  res.json(game);
});

// Join a game
router.post("/:gameId/join", (req, res) => {
  const game = games.get(req.params.gameId);

  if (!game) {
    return res.status(404).json({
      error: "Game not found",
    });
  }

  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      error: "Player name is required",
    });
  }

  const player = createPlayer(crypto.randomUUID(), name);

  addPlayer(game, player);

  res.json(game);
});

// Get game state
router.get("/:gameId", (req, res) => {
  const game = games.get(req.params.gameId);

  if (!game) {
    return res.status(404).json({
      error: "Game not found",
    });
  }

  res.json(game);
});

router.post("/:gameId/start", (req, res) => {
  const game = games.get(req.params.gameId);

  if (!game) {
    return res.status(404).json({
      error: "Game not found",
    });
  }

  try {
    startGame(game);
    res.json(game);
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Could not start game",
    });
  }
});

router.post("/:gameId/roll", (req, res) => {
  const game = games.get(req.params.gameId);

  if (!game) {
    return res.status(404).json({
      error: "Game not found",
    });
  }

  if (game.status === "waiting") {
    return res.status(400).json({
      error: "Game has not started",
    });
  }

  if (game.status === "finished") {
    return res.status(400).json({
      error: "Game has already finished",
      winnerId: game.winnerId,
    });
  }

  if (game.hasRolled) {
    return res.status(400).json({
      error: "You have already rolled this turn",
    });
  }

  const currentPlayer = game.players[game.currentPlayerIndex];

  if (!currentPlayer) {
    return res.status(400).json({
      error: "No current player found",
    });
  }

  const diceRoll = rollDice();

  const passedStart = movePlayer(game, currentPlayer.id, diceRoll);

  const landedTile = getCurrentTile(game, currentPlayer.id);

  let rentPaid = 0;
  let bankrupt = false;

  // Owned property → pay rent
  if (
    landedTile.type === "property" &&
    landedTile.ownerId &&
    landedTile.ownerId !== currentPlayer.id
  ) {
    rentPaid = landedTile.rent ?? 0;

    payRent(game, currentPlayer.id);

    // Check whether the player was removed due to bankruptcy
    const playerStillInGame = game.players.some(
      (player) => player.id === currentPlayer.id,
    );

    if (!playerStillInGame) {
      bankrupt = true;
      rentPaid = 0;
    }
  }

  // Chaos event
  let chaosEvent: string | null = null;

  if (landedTile.type === "event") {
    chaosEvent = triggerChaosEvent(game, currentPlayer.id);
  }

  // Unowned property → player must Buy or Skip
  if (!bankrupt && landedTile.type === "property" && !landedTile.ownerId) {
    game.pendingAction = "buy";
  }

  // Mark roll as completed
  game.hasRolled = true;

  res.json({
    diceRoll,
    player: currentPlayer,
    landedTile,
    rentPaid,
    chaosEvent,
    pendingAction: game.pendingAction,
    passedStart,
    bankrupt,
    gameFinished: game.winnerId !== undefined,
    game,
  });
});

router.post("/:gameId/buy", (req, res) => {
  const game = games.get(req.params.gameId);

  if (!game) {
    return res.status(404).json({
      error: "Game not found",
    });
  }

  const currentPlayer = game.players[game.currentPlayerIndex];

  if (!currentPlayer) {
    return res.status(400).json({
      error: "No current player found",
    });
  }

  try {
    buyProperty(game, currentPlayer.id);

    game.pendingAction = "none";

    res.json({
      message: "Property purchased!",
      player: currentPlayer,
      game,
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Could not buy property",
    });
  }
});

router.post("/:gameId/end-turn", (req, res) => {
  const game = games.get(req.params.gameId);

  if (!game) {
    return res.status(404).json({
      error: "Game not found",
    });
  }

  if (game.status !== "playing") {
    return res.status(400).json({
      error: "Game has not started",
    });
  }

  if (!game.hasRolled) {
    return res.status(400).json({
      error: "You must roll before ending your turn",
    });
  }

  if (game.pendingAction !== "none") {
    return res.status(400).json({
      error: "You must buy or skip first",
    });
  }

  game.currentPlayerIndex = (game.currentPlayerIndex + 1) % game.players.length;
  game.hasRolled = false;

  res.json({
    message: "Turn ended",
    currentPlayer: game.players[game.currentPlayerIndex],
    game,
  });
});

router.post("/:gameId/skip", (req, res) => {
  const game = games.get(req.params.gameId);

  if (!game) {
    return res.status(404).json({
      error: "Game not found",
    });
  }

  if (game.status !== "playing") {
    return res.status(400).json({
      error: "Game has not started",
    });
  }

  if (game.pendingAction !== "buy") {
    return res.status(400).json({
      error: "There is no property to skip",
    });
  }

  game.pendingAction = "none";

  res.json({
    message: "Property purchase skipped",
    game,
  });
});

router.post("/:gameId/upgrade", (req, res) => {
  const game = games.get(req.params.gameId);

  if (!game) {
    return res.status(404).json({
      error: "Game not found",
    });
  }

  if (game.status !== "playing") {
    return res.status(400).json({
      error: "Game is not currently playing",
    });
  }

  const currentPlayer =
    game.players[game.currentPlayerIndex];

  if (!currentPlayer) {
    return res.status(400).json({
      error: "No current player found",
    });
  }

  try {
    upgradeProperty(game, currentPlayer.id);

    res.json({
      message: "Property upgraded!",
      player: currentPlayer,
      game,
    });
  } catch (error) {
    res.status(400).json({
      error:
        error instanceof Error
          ? error.message
          : "Could not upgrade property",
    });
  }
});

router.post("/:gameId/sell", (req, res) => {
  const game = games.get(req.params.gameId);

  if (!game) {
    return res.status(404).json({
      error: "Game not found",
    });
  }

  if (game.status !== "playing") {
    return res.status(400).json({
      error: "Game is not currently playing",
    });
  }

  const currentPlayer =
    game.players[game.currentPlayerIndex];

  if (!currentPlayer) {
    return res.status(400).json({
      error: "No current player found",
    });
  }

  try {
    sellProperty(game, currentPlayer.id);

    res.json({
      message: "Property sold!",
      player: currentPlayer,
      game,
    });
  } catch (error) {
    res.status(400).json({
      error:
        error instanceof Error
          ? error.message
          : "Could not sell property",
    });
  }
});


router.post("/:gameId/trade", (req, res) => {
  const game = games.get(req.params.gameId);

  if (!game) {
    return res.status(404).json({
      error: "Game not found",
    });
  }

  if (game.status !== "playing") {
    return res.status(400).json({
      error: "Game is not currently playing",
    });
  }

  const { sellerId, buyerId, propertyId, price } = req.body;

  if (!sellerId || !buyerId || propertyId === undefined || price === undefined) {
    return res.status(400).json({
      error: "sellerId, buyerId, propertyId and price are required",
    });
  }

  try {
    tradeProperty(
      game,
      sellerId,
      buyerId,
      propertyId,
      price
    );

    res.json({
      message: "Property traded successfully!",
      game,
    });
  } catch (error) {
    res.status(400).json({
      error:
        error instanceof Error
          ? error.message
          : "Could not trade property",
    });
  }
});

export default router;
