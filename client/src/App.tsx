import "./App.css";

type TileType =
  | "start"
  | "property"
  | "chaos"
  | "tax"
  | "chance"
  | "detention"
  | "government"
  | "chaos-hq"
  | "transport"
  | "power";

type Tile = {
  id: number;
  name: string;
  icon: string;
  type: TileType;
  price?: number;
};

const tiles: Tile[] = [
  // TOP — 1 → 11
  { id: 1, name: "START", icon: "◈", type: "start" },
  { id: 2, name: "Beach Cafe", icon: "⌂", type: "property", price: 200 },
  { id: 3, name: "Chaos Event", icon: "✦", type: "chaos" },
  { id: 4, name: "Shopping Mall", icon: "◇", type: "property", price: 300 },
  { id: 5, name: "City Tax", icon: "¤", type: "tax" },
  { id: 6, name: "Luxury Hotel", icon: "▣", type: "property", price: 500 },
  { id: 7, name: "Chaos Card", icon: "◆", type: "chance" },
  { id: 8, name: "Tech Park", icon: "▤", type: "property", price: 400 },
  { id: 9, name: "Power Grid", icon: "ϟ", type: "power" },
  { id: 10, name: "Cinema", icon: "▰", type: "property", price: 250 },
  { id: 11, name: "CITY DETENTION", icon: "▣", type: "detention" },

  // RIGHT — 12 → 21
  { id: 12, name: "Restaurant", icon: "◇", type: "property", price: 350 },
  { id: 13, name: "Chaos Event", icon: "✦", type: "chaos" },
  { id: 14, name: "Stadium", icon: "▥", type: "property", price: 600 },
  { id: 15, name: "City Tax", icon: "¤", type: "tax" },
  { id: 16, name: "Airport", icon: "△", type: "transport", price: 700 },
  { id: 17, name: "Chaos Card", icon: "◆", type: "chance" },
  { id: 18, name: "University", icon: "▤", type: "property", price: 450 },
  { id: 19, name: "Chaos Event", icon: "✦", type: "chaos" },
  { id: 20, name: "Financial District", icon: "◇", type: "property", price: 750 },
  { id: 21, name: "CHAOS HQ", icon: "✧", type: "chaos-hq" },

  // BOTTOM — 31 → 21 visually
  { id: 22, name: "Mega Tower", icon: "▥", type: "property", price: 1000 },
  { id: 23, name: "Chaos Event", icon: "✦", type: "chaos" },
  { id: 24, name: "Harbor", icon: "△", type: "transport", price: 550 },
  { id: 25, name: "City Tax", icon: "¤", type: "tax" },
  { id: 26, name: "Entertainment Hub", icon: "◇", type: "property", price: 650 },
  { id: 27, name: "Chaos Card", icon: "◆", type: "chance" },
  { id: 28, name: "Industrial Zone", icon: "▥", type: "property", price: 450 },
  { id: 29, name: "Chaos Event", icon: "✦", type: "chaos" },
  { id: 30, name: "Power Station", icon: "ϟ", type: "power" },
  { id: 31, name: "CITY HALL", icon: "⌂", type: "government" },

  // LEFT — 40 → 32 visually
  { id: 32, name: "Financial Plaza", icon: "◇", type: "property", price: 800 },
  { id: 33, name: "Chaos Event", icon: "✦", type: "chaos" },
  { id: 34, name: "Luxury District", icon: "◇", type: "property", price: 900 },
  { id: 35, name: "City Tax", icon: "¤", type: "tax" },
  { id: 36, name: "Metro Station", icon: "△", type: "transport" },
  { id: 37, name: "Chaos Card", icon: "◆", type: "chance" },
  { id: 38, name: "Innovation Lab", icon: "◇", type: "property", price: 700 },
  { id: 39, name: "Chaos Event", icon: "✦", type: "chaos" },
  { id: 40, name: "Market Square", icon: "⌂", type: "property", price: 350 },
];

function renderTile(tile: Tile) {
  return (
    <div className={`tile tile-${tile.type}`} key={tile.id}>
      <span className="tile-number">
        {String(tile.id).padStart(2, "0")}
      </span>

      <span className="tile-icon">{tile.icon}</span>

      <span className="tile-name">{tile.name}</span>

      {tile.price !== undefined && (
        <span className="tile-price">${tile.price}</span>
      )}
    </div>
  );
}

export default function App() {
  return (
    <div className="app">
      {/* ================= HEADER ================= */}

      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">ϟ</div>

          <div>
            <h1>CHAOS CITY</h1>
            <span>POWER • WEALTH • CHAOS</span>
          </div>
        </div>

        <div className="round-info">
          <span>ROUND</span>
          <strong>04</strong>
          <span>/ 20</span>
        </div>

        <div className="turn-indicator">
          <span className="status-dot" />

          <div>
            <small>YOUR TURN</small>
            <strong>PLAYER 1</strong>
          </div>
        </div>
      </header>

      {/* ================= MAIN ================= */}

      <main className="game">

        {/* ================= PLAYER PANEL ================= */}

        <aside className="panel player-panel">
          <div className="panel-heading">
            <div className="heading-icon">♛</div>

            <div>
              <small>YOUR EMPIRE</small>
              <h2>PLAYER 1</h2>
            </div>
          </div>

          <div className="power-card">
            <div className="power-icon">♛</div>

            <div>
              <small>POWER LEVEL</small>
              <strong>07</strong>
              <span>THE RULER</span>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat">
              <span>¤</span>
              <small>CASH</small>
              <strong>$1,500</strong>
            </div>

            <div className="stat">
              <span>✦</span>
              <small>INFLUENCE</small>
              <strong>12</strong>
            </div>

            <div className="stat">
              <span>♟</span>
              <small>REPUTATION</small>
              <strong>87</strong>
            </div>

            <div className="stat">
              <span>ϟ</span>
              <small>CHAOS</small>
              <strong>2</strong>
            </div>
          </div>

          <div className="property-section">
            <div className="section-title">
              <span>YOUR PROPERTIES</span>
              <small>2 OWNED</small>
            </div>

            <div className="property-list">
              <div className="owned-property">
                <span>⌂</span>

                <div>
                  <strong>Beach Cafe</strong>
                  <small>LVL 2 • RENT $75</small>
                </div>
              </div>

              <div className="owned-property">
                <span>▣</span>

                <div>
                  <strong>Luxury Hotel</strong>
                  <small>LVL 1 • RENT $100</small>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* ================= BOARD ================= */}

        <section className="board-area">
          <div className="board">

            {/* TOP: 1 → 11 */}
            <div className="board-row top-row">
              {tiles.slice(0, 11).map(renderTile)}
            </div>

            {/* RIGHT: 12 → 21 */}
            <div className="board-row right-row">
              {tiles.slice(11, 21).map(renderTile)}
            </div>

            {/* BOTTOM: 31 → 22 */}
            <div className="board-row bottom-row">
              {[...tiles.slice(21, 31)]
                .reverse()
                .map(renderTile)}
            </div>

            {/* LEFT: 40 → 32 */}
            <div className="board-row left-row">
              {[...tiles.slice(31, 40)]
                .reverse()
                .map(renderTile)}
            </div>

            {/* CENTER */}
            <div className="board-center">
              <div className="city-grid" />
              <div className="city-road city-road-a" />
              <div className="city-road city-road-b" />
              <div className="city-node city-node-a" />
              <div className="city-node city-node-b" />
              <div className="city-node city-node-c" />

              <div className="center-content">
                <div className="center-status">
                  <span className="status-dot" /> CITY NETWORK ONLINE
                </div>

                <div className="city-symbol">
                  <span>◈</span>
                </div>

                <span className="welcome">WELCOME TO</span>
                <h2>CHAOS CITY</h2>
                <p>CONTROL THE CITY · CONTROL THE POWER</p>

                <div className="center-stats">
                  <div><small>CITY POWER</small><strong>72%</strong></div>
                  <div><small>CHAOS LEVEL</small><strong>18</strong></div>
                  <div><small>PLAYERS</small><strong>4</strong></div>
                </div>

                <div className="center-bottom">
                  <span><small>YOUR POSITION</small><b>STARTING CITY</b></span>
                  <span><small>LAST ROLL</small><b>—</b></span>
                </div>
              </div>
            </div>
          </div>

          <div className="turn-message">
            <span className="turn-mark">ϟ</span>
            <strong>Your turn</strong>
            <span>Roll the dice to make your move</span>
          </div>
        </section>

        {/* ================= CONTROLS ================= */}

        <aside className="panel controls-panel">

          <div className="panel-heading">
            <div className="heading-icon">◇</div>

            <div>
              <small>GAME CONTROL</small>
              <h2>YOUR MOVE</h2>
            </div>
          </div>

          <div className="current-player">
            <span className="status-dot" />

            <div>
              <small>CURRENT PLAYER</small>
              <strong>♛ PLAYER 1</strong>
            </div>
          </div>

          <div className="action-list">

            <button className="action primary">
              <span>◆</span>

              <div>
                <strong>ROLL DICE</strong>
                <small>Make your move</small>
              </div>

              <b>→</b>
            </button>

            <button className="action">
              <span>⌂</span>

              <div>
                <strong>BUY PROPERTY</strong>
                <small>Acquire this location</small>
              </div>
            </button>

            <button className="action">
              <span>↑</span>

              <div>
                <strong>UPGRADE</strong>
                <small>Increase property rent</small>
              </div>
            </button>

            <button className="action">
              <span>¤</span>

              <div>
                <strong>SELL PROPERTY</strong>
                <small>Sell your property</small>
              </div>
            </button>

            <button className="action">
              <span>⇄</span>

              <div>
                <strong>TRADE</strong>
                <small>Make a deal</small>
              </div>
            </button>

            <button className="action">
              <span>Ⅱ</span>

              <div>
                <strong>END TURN</strong>
                <small>Finish your turn</small>
              </div>
            </button>

          </div>

          <div className="feed">

            <div className="section-title">
              <span>LIVE FEED</span>
              <small>● LIVE</small>
            </div>

            <div className="feed-item">
              <span>◇</span>

              <div>
                <strong>Game started</strong>
                <small>Just now</small>
              </div>
            </div>

            <div className="feed-item">
              <span>♛</span>

              <div>
                <strong>Player 1's turn</strong>
                <small>12 seconds ago</small>
              </div>
            </div>

            <div className="feed-item">
              <span>✦</span>

              <div>
                <strong>Chaos is building...</strong>
                <small>23 seconds ago</small>
              </div>
            </div>

          </div>
        </aside>
      </main>
    </div>
  );
}