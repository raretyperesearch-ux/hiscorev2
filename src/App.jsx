import { useState, useEffect, useRef, useCallback } from "react";

function useIsMobile(breakpoint = 768) {
  const [mobile, setMobile] = useState(typeof window !== "undefined" ? window.innerWidth < breakpoint : false);
  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);
  return mobile;
}

/* ======================= PIXEL ART AVATARS ======================= */
const AP = {
  rune:{2:"#1a5a6e",3:"#2a8a9e",4:"#3aacbe",5:"#d4a574",6:"#b8895a",7:"#1a1a1a",8:"#8b3a3a",9:"#4ac0d0",A:"#4a3020",B:"#f0f0f0"},
  dragon:{2:"#8b1a1a",3:"#b02a2a",4:"#d04040",5:"#d4a574",6:"#b8895a",7:"#1a1a1a",8:"#8b3a3a",9:"#e8c020",A:"#3a2a1a",B:"#f0f0f0"},
  mithril:{2:"#2a2a6e",3:"#3a3a8e",4:"#5252ae",5:"#d4a574",6:"#b8895a",7:"#1a1a1a",8:"#8b3a3a",9:"#6a6abe",A:"#5a3a1a",B:"#f0f0f0"},
  iron:{2:"#5a5a5a",3:"#7a7a7a",4:"#9a9a9a",5:"#d4a574",6:"#b8895a",7:"#1a1a1a",8:"#8b3a3a",9:"#aaaaaa",A:"#3a2010",B:"#f0f0f0"},
  gilded:{2:"#8b6e1a",3:"#c4a02a",4:"#e8c840",5:"#d4a574",6:"#b8895a",7:"#1a1a1a",8:"#8b3a3a",9:"#f0d860",A:"#4a3020",B:"#f0f0f0"},
  wizard:{2:"#3a1a6e",3:"#5a2a9e",4:"#7a40be",5:"#d4a574",6:"#b8895a",7:"#1a1a1a",8:"#8b3a3a",9:"#c060ff",A:"#808080",B:"#f0f0f0"},
  robin:{2:"#1a5a1a",3:"#2a8a2a",4:"#3aaa3a",5:"#d4a574",6:"#b8895a",7:"#1a1a1a",8:"#8b3a3a",9:"#e8d020",A:"#6a4020",B:"#f0f0f0"},
  ancient:{2:"#4a1a4a",3:"#6e2a6e",4:"#8e3a8e",5:"#c49a6e",6:"#a87e54",7:"#1a1a1a",8:"#7a2a2a",9:"#d04ad0",A:"#202020",B:"#e0e0e0"},
  bandos:{2:"#4a4a2a",3:"#6a6a3a",4:"#8a8a4a",5:"#d4a574",6:"#b8895a",7:"#1a1a1a",8:"#8b3a3a",9:"#aa2020",A:"#3a2010",B:"#f0f0f0"},
  noob:{2:"#6e5a3a",3:"#8b7a52",4:"#a89a6a",5:"#d4a574",6:"#b8895a",7:"#1a1a1a",8:"#8b3a3a",9:"#c0b080",A:"#6a4a1a",B:"#f0f0f0"},
};
const B_ = "B", A_ = "A";
const H_FULL = [[0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],[0,0,0,0,1,4,4,4,4,4,4,1,0,0,0,0],[0,0,0,1,4,4,3,3,3,3,4,4,1,0,0,0],[0,0,1,4,3,3,3,2,2,3,3,3,4,1,0,0],[0,1,4,3,3,2,2,2,2,2,2,3,3,4,1,0],[0,1,3,3,2,2,2,2,2,2,2,2,3,3,1,0],[1,3,3,2,2,2,2,2,2,2,2,2,2,3,3,1],[1,3,2,1,1,1,1,2,2,1,1,1,1,2,3,1],[1,2,1,1,B_,7,1,6,6,1,B_,7,1,1,2,1],[1,2,1,1,1,1,1,5,5,1,1,1,1,1,2,1],[1,2,2,2,5,5,5,5,5,5,5,5,2,2,2,1],[0,1,2,2,6,5,5,5,5,5,5,6,2,2,1,0],[0,0,1,2,6,5,5,8,8,5,5,6,2,1,0,0],[0,0,0,1,1,6,5,5,5,5,6,1,1,0,0,0],[0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],[0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0]];
const H_MED = [[0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],[0,0,0,0,1,4,4,4,4,4,4,1,0,0,0,0],[0,0,0,1,4,3,3,3,3,3,3,4,1,0,0,0],[0,0,1,4,3,3,2,2,2,2,3,3,4,1,0,0],[0,1,4,3,2,2,2,2,2,2,2,2,3,4,1,0],[0,1,3,2,2,2,2,2,2,2,2,2,2,3,1,0],[1,3,3,2,2,2,2,2,2,2,2,2,2,3,3,1],[1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1],[0,0,1,5,B_,7,5,2,2,5,B_,7,5,1,0,0],[0,0,1,5,5,5,5,2,2,5,5,5,5,1,0,0],[0,0,1,5,5,5,5,5,5,5,5,5,5,1,0,0],[0,0,1,6,5,5,5,5,5,5,5,5,6,1,0,0],[0,0,1,6,6,5,5,8,8,5,5,6,6,1,0,0],[0,0,0,1,6,6,5,5,5,5,6,6,1,0,0,0],[0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],[0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0]];
const H_WIZ = [[0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,1,4,1,0,0,0,0,0,0,0],[0,0,0,0,0,1,4,3,4,1,0,0,0,0,0,0],[0,0,0,0,1,3,3,2,3,3,1,0,0,0,0,0],[0,0,0,1,3,2,9,2,2,3,3,1,0,0,0,0],[0,0,1,3,2,2,2,2,2,2,3,3,1,0,0,0],[0,1,3,2,2,2,2,2,2,2,2,3,3,1,0,0],[1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,1,5,5,5,5,5,5,5,5,1,0,0,0],[0,0,0,1,5,B_,7,5,5,B_,7,5,1,0,0,0],[0,0,0,1,5,5,5,5,5,5,5,5,1,0,0,0],[0,0,0,1,6,5,5,5,5,5,5,6,1,0,0,0],[0,0,0,1,6,5,5,8,8,5,5,6,1,0,0,0],[0,0,0,0,1,A_,6,5,5,6,A_,1,0,0,0,0],[0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],[0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0]];
const H_ROB = [[0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0],[0,0,0,0,0,1,4,4,1,0,0,0,0,0,0,0],[0,0,0,0,1,3,3,4,4,1,0,0,0,0,0,0],[0,0,0,1,3,2,3,3,4,9,1,0,0,0,0,0],[0,0,1,3,2,2,2,3,3,3,9,1,0,0,0,0],[0,1,3,2,2,2,2,2,3,3,3,3,1,0,0,0],[1,4,4,4,4,4,4,4,4,4,4,4,4,1,0,0],[1,4,4,4,4,4,4,4,4,4,4,4,4,4,1,0],[0,0,1,A_,5,5,5,5,5,5,5,5,A_,1,0,0],[0,0,1,5,B_,7,5,5,5,B_,7,5,5,1,0,0],[0,0,1,5,5,5,5,5,5,5,5,5,5,1,0,0],[0,0,1,6,5,5,5,5,5,5,5,5,6,1,0,0],[0,0,1,6,6,5,5,8,8,5,5,6,6,1,0,0],[0,0,0,1,A_,6,5,5,5,5,6,A_,1,0,0,0],[0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],[0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0]];
const H_CRN = [[0,0,1,0,0,1,0,0,0,1,0,0,1,0,0,0],[0,0,1,9,0,1,9,0,9,1,0,9,1,0,0,0],[0,0,1,4,1,4,4,1,4,4,1,4,1,0,0,0],[0,0,1,4,4,4,4,4,4,4,4,4,1,0,0,0],[0,0,1,3,3,3,9,3,3,9,3,3,1,0,0,0],[0,0,1,3,2,2,2,2,2,2,2,3,1,0,0,0],[0,0,1,2,2,2,2,2,2,2,2,2,1,0,0,0],[0,0,1,A_,A_,5,5,5,5,5,5,A_,A_,1,0,0],[0,0,1,5,5,5,5,5,5,5,5,5,5,1,0,0],[0,0,1,5,B_,7,5,5,5,B_,7,5,5,1,0,0],[0,0,1,5,5,5,5,5,5,5,5,5,5,1,0,0],[0,0,1,6,5,5,5,5,5,5,5,5,6,1,0,0],[0,0,0,1,6,5,5,8,8,5,5,6,1,0,0,0],[0,0,0,1,A_,6,5,5,5,5,6,A_,1,0,0,0],[0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],[0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0]];
const H_HORN = [[0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0],[0,0,1,4,0,0,0,0,0,0,0,0,4,1,0,0],[0,0,0,1,4,1,1,1,1,1,1,4,1,0,0,0],[0,0,0,1,3,4,4,4,4,4,4,3,1,0,0,0],[0,0,1,3,3,3,3,3,3,3,3,3,3,1,0,0],[0,0,1,2,2,2,2,2,2,2,2,2,2,1,0,0],[0,1,2,2,2,2,2,2,2,2,2,2,2,2,1,0],[0,1,9,9,9,9,9,2,2,9,9,9,9,9,1,0],[0,0,1,5,B_,7,5,5,5,5,B_,7,5,1,0,0],[0,0,1,5,5,5,5,5,5,5,5,5,5,1,0,0],[0,0,1,5,5,5,5,5,5,5,5,5,5,1,0,0],[0,0,1,6,5,5,5,5,5,5,5,5,6,1,0,0],[0,0,0,1,6,5,5,8,8,5,5,6,1,0,0,0],[0,0,0,1,A_,6,5,5,5,5,6,A_,1,0,0,0],[0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],[0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0]];
const H_BAND = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],[0,0,0,0,1,A_,A_,A_,A_,A_,A_,1,0,0,0,0],[0,0,0,1,A_,A_,A_,A_,A_,A_,A_,A_,1,0,0,0],[0,0,1,A_,A_,A_,A_,A_,A_,A_,A_,A_,A_,1,0,0],[0,0,1,2,3,4,3,2,2,3,4,3,2,1,0,0],[0,0,1,2,2,2,2,2,2,2,2,2,2,1,0,0],[0,0,1,A_,5,5,5,5,5,5,5,5,A_,1,0,0],[0,0,1,5,5,5,5,5,5,5,5,5,5,1,0,0],[0,0,1,5,B_,7,5,5,5,B_,7,5,5,1,0,0],[0,0,1,5,5,5,5,5,5,5,5,5,5,1,0,0],[0,0,1,6,5,5,5,5,5,5,5,5,6,1,0,0],[0,0,0,1,6,5,5,8,8,5,5,6,1,0,0,0],[0,0,0,1,A_,6,5,5,5,5,6,A_,1,0,0,0],[0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],[0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0]];

const HELM_MAP = [{t:H_FULL,p:"rune"},{t:H_HORN,p:"dragon"},{t:H_FULL,p:"mithril"},{t:H_BAND,p:"iron"},{t:H_MED,p:"gilded"},{t:H_WIZ,p:"wizard"},{t:H_ROB,p:"robin"},{t:H_CRN,p:"gilded"},{t:H_WIZ,p:"ancient"},{t:H_BAND,p:"noob"}];

function buildAvatarSVG(idx) {
  const { t, p } = HELM_MAP[idx % HELM_MAP.length]; const pal = AP[p]; let r = "";
  for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
    const c = t[y][x]; if (c === 0) continue;
    let f; if (c === 1) f = "#0a0a0a"; else if (c === "B") f = pal.B; else if (c === "A") f = pal.A; else if (pal[c]) f = pal[c]; else f = "#000";
    r += '<rect x="' + x + '" y="' + y + '" width="1" height="1" fill="' + f + '"/>';
  }
  return "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges">' + r + '</svg>');
}
const AVATARS = Array.from({ length: 10 }, (_, i) => buildAvatarSVG(i));

/* ======================= API CONFIG ======================= */
const API_BASE = "https://ppqbosrweabdqayawhbw.supabase.co/functions/v1";

const LOGO_SVG = "data:image/png;base64,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";

function shortAddr(addr) {
  if (!addr) return "";
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

function mapLeaderboard(apiData) {
  if (!apiData?.leaderboard) return { leaders: [], trades: [] };
  const leaders = apiData.leaderboard.map((e, i) => ({
    wallet: {
      id: e.wallet.address,
      label: e.wallet.label || shortAddr(e.wallet.address),
      addr: e.wallet.address,
      avi: i % 10,
    },
    pnl: e.stats.total_pnl || 0,
    wr: e.stats.win_rate || 0,
    streak: e.stats.current_streak || 0,
    best: e.stats.best_streak || 0,
    trades: e.stats.total_trades || 0,
    vol: e.stats.total_volume || 0,
    pct: Math.min(99, Math.max(5, (e.stats.win_rate || 0) * 1.5)),
    badges: [],
    pnl24h: 0,
    xp: Math.abs(e.stats.total_pnl || 0) * 10,
    copiers: 0,
    holdings: e.holdings || [],
    updated_at: e.updated_at,
  }));
  const trades = (apiData.live_trades || []).map((t, i) => ({
    id: t.id,
    wallet: {
      id: t.wallet?.address || "",
      label: t.wallet?.label || shortAddr(t.wallet?.address),
      addr: t.wallet?.address || "",
      avi: leaders.findIndex(l => l.wallet.id === t.wallet?.address) % 10,
    },
    direction: t.direction,
    token_symbol: t.token_symbol,
    token_address: t.token_address || "",
    usd_amount: t.usd_amount || 0,
    traded_at: t.traded_at,
    dex: t.dex || "Base DEX",
  }));
  return { leaders, trades };
}


const QUESTS = {
  whale_hunter:{name:"Whale Hunter",desc:"Trade over $5,000",diff:"Master"},
  on_fire:{name:"On Fire",desc:"10 trade winning streak",diff:"Hard"},
  diamond_hands:{name:"Diamond Hands",desc:"Hold 24h and profit",diff:"Medium"},
  hundredx:{name:"The 100x",desc:"100x return on a trade",diff:"Grandmaster"},
  full_send:{name:"Full Send",desc:"50 trades in 24 hours",diff:"Hard"},
  first_blood:{name:"First Blood",desc:"Buy within 60s of deploy",diff:"Elite"},
  shark:{name:"Apex Predator",desc:"Over $10K total profit",diff:"Hard"},
  speed_demon:{name:"Speed Demon",desc:"Flip in under 30s",diff:"Medium"},
};


/* ======================= HELPERS ======================= */
const fmt = (n) => { const a = Math.abs(n), s = n < 0 ? "-" : ""; if (a >= 1e6) return s + "$" + (a / 1e6).toFixed(1) + "M"; if (a >= 1e3) return s + "$" + (a / 1e3).toFixed(1) + "K"; return s + "$" + a.toFixed(0); };
const ago = (d) => { const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000); if (s < 60) return s + "s ago"; if (s < 3600) return Math.floor(s / 60) + "m ago"; if (s < 86400) return Math.floor(s / 3600) + "h ago"; return Math.floor(s / 86400) + "d ago"; };
const tier = (u) => u >= 2e3 ? "legendary" : u >= 500 ? "epic" : u >= 100 ? "rare" : "common";
const DC = { Grandmaster: "#9333ea", Master: "#f97316", Elite: "#0ea5e9", Hard: "#ef4444", Medium: "#22c55e" };

/*
  ============================================
    FIRECRAWL / LIQUID METAL DESIGN
  ============================================
  Clean white. Soft rounded tiles. Subtle
  metallic sheen. Orange accent. Premium SaaS.
  Think: polished chrome on white marble.
*/

const K = {
  bg: "#fafafa",
  white: "#ffffff",
  card: "#ffffff",
  cardHover: "#fefefe",
  border: "#e8e8ec",
  borderLight: "#f0f0f4",
  borderFocus: "#e5432e",

  text: "#18181b",
  textSec: "#71717a",
  textMuted: "#a1a1aa",
  textFaint: "#d4d4d8",

  accent: "#e5432e",
  accentLight: "#fef2f0",
  accentSoft: "#fecaca",
  cyan: "#00c8d6",

  profit: "#16a34a",
  profitBg: "#f0fdf4",
  loss: "#dc2626",
  lossBg: "#fef2f2",

  gold: "#d97706",
  silver: "#71717a",
  bronze: "#c2410c",
};

/* Soft card shadow — the "liquid metal" sheen */
const cardShadow = "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)";
const cardShadowHover = "0 4px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)";
const tileShadow = "0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.02), inset 0 1px 0 rgba(255,255,255,0.8)";

const STYLES = [
  "@import url('https://cdn.jsdelivr.net/npm/geist@1.2.0/dist/fonts/geist-sans/style.min.css');",
  "@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap');",
  "",
  "@keyframes fadeUp { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }",
  "@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }",
  "@keyframes slideUp { from{transform:translateY(100%)} to{transform:translateY(0)} }",
  "@keyframes fadeIn { from{opacity:0} to{opacity:1} }",
  "@keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }",
  "@keyframes livePulse { 0%,100%{box-shadow:0 0 0 0 rgba(22,163,74,0.4)} 50%{box-shadow:0 0 0 4px rgba(22,163,74,0)} }",
  "@keyframes gradientShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }",
  "",
  "* { box-sizing:border-box; margin:0; padding:0; }",
  "body { background:" + K.bg + "; overflow:hidden; -webkit-tap-highlight-color: transparent; }",
  "::-webkit-scrollbar { width:6px; }",
  "::-webkit-scrollbar-track { background:transparent; }",
  "::-webkit-scrollbar-thumb { background:#d4d4d8; border-radius:3px; }",
  "::-webkit-scrollbar-thumb:hover { background:#a1a1aa; }",
  ".tap-scale { transition: transform 0.1s ease; }",
  ".tap-scale:active { transform: scale(0.97); }",
].join("\n");

const ff = "'Geist Sans', 'Geist', -apple-system, sans-serif";
const mono = "'JetBrains Mono', monospace";

/* ======================= COMPONENTS ======================= */

function Tile({ children, style: sx, onClick, hover }) {
  const [h, setH] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => hover !== false && setH(true)}
      onMouseLeave={() => hover !== false && setH(false)}
      className={onClick ? "tap-scale" : ""}
      style={{
        background: K.card,
        border: "1px solid " + (h ? K.border : K.borderLight),
        borderRadius: 14,
        boxShadow: h ? cardShadowHover : tileShadow,
        transition: "all 0.2s ease",
        cursor: onClick ? "pointer" : "default",
        ...sx,
      }}
    >
      {children}
    </div>
  );
}

/* ======================= SKELETON LOADERS ======================= */
function Shimmer({ width, height, borderRadius, style }) {
  return (
    <div style={{
      width: width || "100%", height: height || 14, borderRadius: borderRadius || 6,
      background: "linear-gradient(90deg, #f0f0f4 25%, #e8e8ec 37%, #f0f0f4 63%)",
      backgroundSize: "400px 100%",
      animation: "shimmer 1.4s ease infinite",
      ...style,
    }} />
  );
}

function SkeletonRow({ i }) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "30px 1fr 80px",
      alignItems: "center", padding: "14px 16px", gap: 8,
      borderBottom: "1px solid " + K.borderLight,
      animation: "fadeUp 0.3s ease " + (i * 0.05) + "s both",
    }}>
      <Shimmer width={22} height={22} borderRadius={6} />
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Shimmer width={36} height={36} borderRadius={10} />
        <div>
          <Shimmer width={90} height={12} style={{ marginBottom: 6 }} />
          <Shimmer width={60} height={10} />
        </div>
      </div>
      <Shimmer width={60} height={16} borderRadius={6} style={{ marginLeft: "auto" }} />
    </div>
  );
}

function SkeletonDesktopRow({ i }) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "40px 2fr 110px 100px 70px 52px",
      alignItems: "center", padding: "12px 20px", gap: 4,
      borderBottom: "1px solid " + K.borderLight,
      animation: "fadeUp 0.3s ease " + (i * 0.05) + "s both",
    }}>
      <Shimmer width={22} height={22} borderRadius={6} />
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Shimmer width={36} height={36} borderRadius={10} />
        <div>
          <Shimmer width={100} height={13} style={{ marginBottom: 5 }} />
          <Shimmer width={70} height={10} />
        </div>
      </div>
      <Shimmer width={70} height={16} borderRadius={6} style={{ marginLeft: "auto" }} />
      <Shimmer width={55} height={12} style={{ marginLeft: "auto" }} />
      <Shimmer width={40} height={12} style={{ marginLeft: "auto" }} />
      <Shimmer width={44} height={22} borderRadius={5} />
    </div>
  );
}

function SkeletonProfile() {
  return (
    <div style={{ padding: 16 }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <Shimmer width={72} height={72} borderRadius={18} style={{ margin: "0 auto 12px" }} />
        <Shimmer width={120} height={16} style={{ margin: "0 auto 8px" }} />
        <Shimmer width={90} height={12} style={{ margin: "0 auto" }} />
      </div>
      <Shimmer height={80} borderRadius={14} style={{ marginBottom: 10 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
        <Shimmer height={60} borderRadius={14} />
        <Shimmer height={60} borderRadius={14} />
        <Shimmer height={60} borderRadius={14} />
      </div>
      <Shimmer height={120} borderRadius={14} style={{ marginBottom: 10 }} />
      <Shimmer height={100} borderRadius={14} />
    </div>
  );
}

/* ======================= SHARE CARD ======================= */
function ShareCard({ entry, onClose }) {
  const canvasRef = useRef(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!entry || !canvasRef.current) return;
    const c = canvasRef.current;
    const ctx = c.getContext("2d");
    const W = 600, H = 340;
    c.width = W; c.height = H;

    // Background
    ctx.fillStyle = "#18181b";
    ctx.beginPath();
    ctx.roundRect(0, 0, W, H, 16);
    ctx.fill();

    // Accent bar top
    const grad = ctx.createLinearGradient(0, 0, W, 0);
    grad.addColorStop(0, "#e5432e");
    grad.addColorStop(1, "#f87171");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, 4);

    // Brand
    ctx.fillStyle = "#e5432e";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText("HISCORE", 28, 36);
    ctx.fillStyle = "#71717a";
    ctx.font = "12px sans-serif";
    ctx.fillText("hiscore.me", W - 100, 36);

    // Player name
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 28px sans-serif";
    ctx.fillText(entry.wallet.label, 28, 85);

    // Address
    ctx.fillStyle = "#00c8d6";
    ctx.font = "13px monospace";
    ctx.fillText(shortAddr(entry.wallet.addr), 28, 108);

    // PnL
    const pnlPos = entry.pnl >= 0;
    ctx.fillStyle = pnlPos ? "#16a34a" : "#dc2626";
    ctx.font = "bold 48px monospace";
    ctx.fillText((pnlPos ? "+" : "") + fmt(entry.pnl), 28, 175);

    ctx.fillStyle = "#71717a";
    ctx.font = "11px sans-serif";
    ctx.fillText("TOTAL PROFIT", 28, 195);

    // Stats row
    const stats = [
      { l: "WIN RATE", v: entry.wr.toFixed(1) + "%" },
      { l: "TRADES", v: String(entry.trades) },
      { l: "VOLUME", v: fmt(entry.vol) },
    ];
    stats.forEach((s, i) => {
      const x = 28 + i * 180;
      ctx.fillStyle = "#a1a1aa";
      ctx.font = "10px sans-serif";
      ctx.fillText(s.l, x, 240);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 22px monospace";
      ctx.fillText(s.v, x, 268);
    });

    // Footer
    ctx.fillStyle = "#27272a";
    ctx.fillRect(0, H - 44, W, 44);
    ctx.fillStyle = "#71717a";
    ctx.font = "11px sans-serif";
    ctx.fillText("Base Chain \u2022 Powered by wallet.xyz", 28, H - 18);
    ctx.fillStyle = "#e5432e";
    ctx.fillText("Share on X \u2197", W - 100, H - 18);
  }, [entry]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.download = entry.wallet.label + "-hiscore.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  const handleCopyImage = async () => {
    try {
      const blob = await new Promise(r => canvasRef.current.toBlob(r, "image/png"));
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { handleDownload(); }
  };

  if (!entry) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 2000 }} onClick={onClose}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", animation: "fadeIn 0.2s ease" }} />
      <div onClick={e => e.stopPropagation()} style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        animation: "fadeUp 0.3s ease",
      }}>
        <canvas ref={canvasRef} style={{ borderRadius: 16, width: 360, height: 204, display: "block" }} />
        <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "center" }}>
          <button onClick={handleCopyImage} style={{
            fontFamily: ff, fontSize: 13, fontWeight: 600,
            color: "#fff", background: K.accent, border: "none", borderRadius: 10,
            padding: "10px 24px", cursor: "pointer",
          }}>{copied ? "\u2713 Copied!" : "\u2398 Copy Image"}</button>
          <button onClick={handleDownload} style={{
            fontFamily: ff, fontSize: 13, fontWeight: 500,
            color: "#fff", background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 10, padding: "10px 24px", cursor: "pointer",
          }}>{"\u2193 Download"}</button>
          <button onClick={() => {
            const text = `${entry.wallet.label} on @HiScoreBase\n${entry.pnl >= 0 ? "+" : ""}${fmt(entry.pnl)} PnL | ${entry.wr.toFixed(1)}% WR | ${entry.trades} trades\n\nhiscore.me`;
            window.open("https://x.com/intent/tweet?text=" + encodeURIComponent(text), "_blank");
          }} style={{
            fontFamily: ff, fontSize: 13, fontWeight: 500,
            color: "#fff", background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 10, padding: "10px 24px", cursor: "pointer",
          }}>Post on X</button>
        </div>
      </div>
    </div>
  );
}

/* ======================= SUBMIT WALLET MODAL ======================= */
const SUPABASE_URL = "https://ppqbosrweabdqayawhbw.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwcWJvc3J3ZWFiZHFheWF3aGJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0MzY3ODQsImV4cCI6MjA4NjAxMjc4NH0.DBP_rFg3fZZUcYrVVHU3riZuuiF5AWcW1Ickxlud7EQ";

function SubmitWalletModal({ onClose }) {
  const [addr, setAddr] = useState("");
  const [label, setLabel] = useState("");
  const [twitter, setTwitter] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null); // "success" | "duplicate" | "error"

  const isValidAddr = /^0x[a-fA-F0-9]{40}$/.test(addr.trim());

  const handleSubmit = async () => {
    if (!isValidAddr) return;
    setSubmitting(true);
    try {
      const res = await fetch(SUPABASE_URL + "/rest/v1/wallet_submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_ANON,
          "Authorization": "Bearer " + SUPABASE_ANON,
          "Prefer": "return=minimal",
        },
        body: JSON.stringify({
          wallet_address: addr.trim().toLowerCase(),
          wallet_label: label.trim() || null,
          twitter_handle: twitter.trim().replace(/^@/, "") || null,
        }),
      });
      if (res.ok || res.status === 201) setResult("success");
      else if (res.status === 409) setResult("duplicate");
      else setResult("error");
    } catch { setResult("error"); }
    setSubmitting(false);
  };

  const inputStyle = {
    width: "100%", padding: "12px 14px", background: K.bg,
    border: "1px solid " + K.border, borderRadius: 10,
    fontFamily: ff, fontSize: 14, color: K.text, outline: "none",
    transition: "border-color 0.15s",
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 2000 }} onClick={onClose}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", animation: "fadeIn 0.2s ease" }} />
      <div onClick={e => e.stopPropagation()} style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        background: K.white, borderRadius: 20, padding: 28, width: "min(400px, 90vw)",
        boxShadow: "0 24px 80px rgba(0,0,0,0.15)", animation: "fadeUp 0.3s ease",
      }}>
        {result === "success" ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>{"\u2705"}</div>
            <div style={{ fontFamily: ff, fontSize: 20, fontWeight: 700, color: K.text, marginBottom: 8 }}>Wallet Submitted!</div>
            <div style={{ fontFamily: ff, fontSize: 14, color: K.textSec, lineHeight: 1.6 }}>
              We'll review and add it to the leaderboard soon. Follow <span style={{ color: K.accent, fontWeight: 600 }}>@HiScoreBase</span> for updates.
            </div>
            <button onClick={onClose} style={{
              fontFamily: ff, fontSize: 14, fontWeight: 600, marginTop: 20,
              color: K.white, background: K.accent, border: "none", borderRadius: 10,
              padding: "12px 32px", cursor: "pointer",
            }}>Done</button>
          </div>
        ) : result === "duplicate" ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>{"\u26a0\ufe0f"}</div>
            <div style={{ fontFamily: ff, fontSize: 18, fontWeight: 700, color: K.text, marginBottom: 8 }}>Already Submitted</div>
            <div style={{ fontFamily: ff, fontSize: 14, color: K.textSec }}>This wallet is already pending review.</div>
            <button onClick={onClose} style={{
              fontFamily: ff, fontSize: 14, fontWeight: 600, marginTop: 20,
              color: K.white, background: K.accent, border: "none", borderRadius: 10,
              padding: "12px 32px", cursor: "pointer",
            }}>OK</button>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <div style={{ fontFamily: ff, fontSize: 20, fontWeight: 700, color: K.text }}>Submit a Wallet</div>
                <div style={{ fontFamily: ff, fontSize: 13, color: K.textSec, marginTop: 2 }}>Add a trader to the HiScore leaderboard</div>
              </div>
              <button onClick={onClose} style={{
                width: 32, height: 32, borderRadius: 8, border: "1px solid " + K.border,
                background: K.white, cursor: "pointer", fontFamily: ff, fontSize: 16, color: K.textMuted,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>{"\u2715"}</button>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontFamily: ff, fontSize: 12, fontWeight: 600, color: K.textSec, display: "block", marginBottom: 6 }}>WALLET ADDRESS *</label>
              <input
                value={addr} onChange={e => setAddr(e.target.value)}
                placeholder="0x..."
                style={{
                  ...inputStyle,
                  fontFamily: mono, fontSize: 13,
                  borderColor: addr && !isValidAddr ? K.loss : K.border,
                }}
                onFocus={e => e.target.style.borderColor = K.accent}
                onBlur={e => e.target.style.borderColor = addr && !isValidAddr ? K.loss : K.border}
              />
              {addr && !isValidAddr && (
                <div style={{ fontFamily: ff, fontSize: 11, color: K.loss, marginTop: 4 }}>Enter a valid Base address (0x...)</div>
              )}
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontFamily: ff, fontSize: 12, fontWeight: 600, color: K.textSec, display: "block", marginBottom: 6 }}>LABEL / NAME</label>
              <input
                value={label} onChange={e => setLabel(e.target.value)}
                placeholder="e.g. DegenerateApe"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = K.accent}
                onBlur={e => e.target.style.borderColor = K.border}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontFamily: ff, fontSize: 12, fontWeight: 600, color: K.textSec, display: "block", marginBottom: 6 }}>TWITTER / X</label>
              <input
                value={twitter} onChange={e => setTwitter(e.target.value)}
                placeholder="@handle"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = K.accent}
                onBlur={e => e.target.style.borderColor = K.border}
              />
            </div>

            {result === "error" && (
              <div style={{ fontFamily: ff, fontSize: 13, color: K.loss, marginBottom: 14, textAlign: "center" }}>Something went wrong. Try again.</div>
            )}

            <button
              onClick={handleSubmit}
              disabled={!isValidAddr || submitting}
              style={{
                width: "100%", padding: "14px 0",
                fontFamily: ff, fontSize: 15, fontWeight: 700,
                color: K.white,
                background: isValidAddr ? K.accent : K.textFaint,
                border: "none", borderRadius: 12, cursor: isValidAddr ? "pointer" : "not-allowed",
                opacity: submitting ? 0.7 : 1,
                transition: "all 0.15s ease",
              }}
            >{submitting ? "Submitting..." : "Submit Wallet"}</button>

            <div style={{ fontFamily: ff, fontSize: 11, color: K.textMuted, textAlign: "center", marginTop: 12, lineHeight: 1.5 }}>
              Base chain only. Submissions are reviewed before appearing on the leaderboard.
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ======================= TOKEN ICON ======================= */
function TokenIcon({ address, symbol, size = 28 }) {
  const [failed, setFailed] = useState(false);
  const logoUrl = address ? `https://assets.smold.app/api/token/8453/${address}/logo-128.png` : null;
  const fallbackUrl = address ? `https://token-icons.s3.amazonaws.com/8453/${address.toLowerCase()}.png` : null;
  const [src, setSrc] = useState(logoUrl);

  if (!address || failed) {
    return (
      <div style={{
        width: size, height: size, borderRadius: size * 0.28, background: K.accentLight,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: ff, fontSize: size * 0.36, fontWeight: 700, color: K.accent, flexShrink: 0,
      }}>{(symbol || "??").slice(0, 2)}</div>
    );
  }

  return (
    <img
      src={src}
      alt={symbol || ""}
      style={{ width: size, height: size, borderRadius: size * 0.28, flexShrink: 0, objectFit: "cover" }}
      onError={() => {
        if (src === logoUrl && fallbackUrl) setSrc(fallbackUrl);
        else setFailed(true);
      }}
    />
  );
}

function FeedLine({ trade }) {
  const t = tier(trade.usd_amount);
  const buy = trade.direction === "buy";
  const big = t === "legendary" || t === "epic";

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      padding: "7px 16px", fontSize: 13, fontFamily: ff,
      borderBottom: "1px solid " + K.borderLight,
      background: big ? K.accentLight : "transparent",
    }}>
      <span style={{ color: K.cyan, fontFamily: mono, fontSize: 11, width: 40, flexShrink: 0, opacity: 0.6 }}>{ago(trade.traded_at).replace(" ago","")}</span>
      <span style={{ color: buy ? K.profit : K.loss, fontWeight: 600, minWidth: 54 }}>{trade.wallet.label}</span>
      <span style={{ color: K.textMuted, fontSize: 12 }}>{buy ? "bought" : "sold"}</span>
      <span style={{ color: big ? K.accent : K.text, fontFamily: mono, fontWeight: 600 }}>{fmt(trade.usd_amount)}</span>
      <span style={{ color: K.textMuted, fontSize: 12 }}>of</span>
      <span style={{ color: K.accent, fontWeight: 600 }}>{trade.token_symbol}</span>
      <span style={{ marginLeft: "auto", color: K.cyan, fontSize: 11, opacity: 0.7 }}>{trade.dex}</span>
    </div>
  );
}

/* ======================= HISCORES TABLE ======================= */
function HiscoresTable({ onSelect, selected, leaders }) {
  const cols = "40px 2fr 110px 100px 70px 52px";
  const headers = ["#", "Player", "Profit", "Volume", "Win %", ""];

  return (
    <div>
      <div style={{
        display: "grid", gridTemplateColumns: cols, padding: "10px 20px", gap: 4,
        borderBottom: "1px solid " + K.borderLight,
      }}>
        {headers.map((h, i) => (
          <span key={h} style={{
            fontFamily: ff, fontSize: 12, fontWeight: 500,
            color: K.textMuted, textAlign: i > 1 ? "right" : "left",
          }}>{h}</span>
        ))}
      </div>

      {leaders.map((e, i) => {
        const active = selected && selected.wallet && selected.wallet.id === e.wallet.id;
        const isTop3 = i < 3;
        const medals = [K.gold, K.silver, K.bronze];
        const medalBgs = ["#fffbeb", "#fafafa", "#fff7ed"];
        const lastTrade = e.updated_at || new Date().toISOString();

        return (
          <div key={i} onClick={() => onSelect(e)} style={{
            display: "grid", gridTemplateColumns: cols, alignItems: "center",
            padding: "12px 20px", gap: 4, cursor: "pointer",
            transition: "all 0.15s ease",
            borderBottom: "1px solid " + K.borderLight,
            borderLeft: active ? "3px solid " + K.accent : "3px solid transparent",
            background: active ? K.accentLight : isTop3 ? medalBgs[i] : "transparent",
            animation: "fadeUp 0.3s ease " + (i * 0.03) + "s both",
          }}>
            {/* Rank */}
            <div style={{
              width: 22, height: 22, borderRadius: 6, display: "flex",
              alignItems: "center", justifyContent: "center",
              background: isTop3 ? medals[i] : K.bg,
              border: isTop3 ? "none" : "1px solid " + K.border,
            }}>
              <span style={{
                fontFamily: mono, fontSize: 10, fontWeight: 700,
                color: isTop3 ? "#fff" : K.textMuted,
              }}>{i + 1}</span>
            </div>

            {/* Player */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, overflow: "hidden" }}>
              <div style={{
                width: 36, height: 36, flexShrink: 0, borderRadius: 10,
                border: "1px solid " + K.border,
                background: K.bg,
                display: "flex", alignItems: "center", justifyContent: "center",
                overflow: "hidden",
              }}>
                <img src={AVATARS[e.wallet.avi || 0]} alt="" style={{ width: 28, height: 28, imageRendering: "pixelated" }} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{
                    fontFamily: ff, fontSize: 14, fontWeight: 600,
                    color: K.text,
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>{e.wallet.label}</span>
                  <span style={{
                    fontFamily: mono, fontSize: 10, color: K.cyan, opacity: 0.6,
                  }}>{ago(lastTrade)}</span>
                </div>
                <span onClick={(ev) => { ev.stopPropagation(); window.open("https://basescan.org/address/" + e.wallet.addr, "_blank"); }} style={{ fontFamily: mono, fontSize: 11, color: K.cyan, cursor: "pointer" }} onMouseEnter={(ev) => ev.currentTarget.style.textDecoration = "underline"} onMouseLeave={(ev) => ev.currentTarget.style.textDecoration = "none"}>{shortAddr(e.wallet.addr)}</span>
              </div>
            </div>

            {/* Profit */}
            <div style={{ textAlign: "right" }}>
              <span style={{
                fontFamily: mono, fontSize: 13, fontWeight: 600,
                color: e.pnl >= 0 ? K.profit : K.loss,
                background: e.pnl >= 0 ? K.profitBg : K.lossBg,
                padding: "2px 8px", borderRadius: 6,
              }}>{(e.pnl >= 0 ? "+" : "") + fmt(e.pnl)}</span>
            </div>

            {/* Volume */}
            <span style={{ fontFamily: mono, fontSize: 12, color: K.textMuted, textAlign: "right" }}>{fmt(e.vol)}</span>

            {/* Win% */}
            <span style={{
              fontFamily: mono, fontSize: 12, textAlign: "right", fontWeight: 500,
              color: e.wr >= 55 ? K.profit : K.textSec,
            }}>{e.wr.toFixed(1) + "%"}</span>

            {/* Copy */}
            <button onClick={(ev) => { ev.stopPropagation(); window.open("https://wallet.xyz/@HISCORE", "_blank"); }} style={{
              fontFamily: mono, fontSize: 9, fontWeight: 700,
              color: K.white, background: K.accent,
              border: "none", borderRadius: 5,
              padding: "4px 6px", cursor: "pointer",
              transition: "opacity 0.15s", lineHeight: 1,
            }} onMouseEnter={(ev) => ev.currentTarget.style.opacity = "0.8"} onMouseLeave={(ev) => ev.currentTarget.style.opacity = "1"}>+Copy</button>
          </div>
        );
      })}
    </div>
  );
}

/* ======================= SIDE PROFILE ======================= */
function SideProfile({ entry, trades, onShare }) {
  if (!entry) return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center", height: "100%",
      fontFamily: ff, fontSize: 14, color: K.textMuted, padding: 40, textAlign: "center", lineHeight: 1.8,
    }}>
      Select a player to view<br />their stats and history.
    </div>
  );

  const w = entry.wallet;
  const pnlPos = entry.pnl >= 0;
  const myTrades = (trades || []).filter(t => t.wallet.id === w.id);

  return (
    <div style={{ overflowY: "auto", height: "100%", padding: 16 }}>
      {/* Avatar + Name */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{
          width: 72, height: 72, margin: "0 auto 12px", borderRadius: 18,
          background: "linear-gradient(135deg, " + K.accent + ", #f87171)",
          padding: 3,
          boxShadow: "0 4px 20px rgba(229,67,46,0.2)",
        }}>
          <div style={{
            width: "100%", height: "100%", borderRadius: 15, background: K.white,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <img src={AVATARS[w.avi || 0]} alt="" style={{ width: 48, height: 48, imageRendering: "pixelated" }} />
          </div>
        </div>
        <div style={{ fontFamily: ff, fontSize: 18, fontWeight: 700, color: K.text }}>{w.label}</div>
        <div onClick={() => window.open("https://basescan.org/address/" + w.addr, "_blank")} style={{ fontFamily: mono, fontSize: 12, color: K.cyan, marginTop: 2, cursor: "pointer" }} onMouseEnter={(ev) => ev.currentTarget.style.textDecoration = "underline"} onMouseLeave={(ev) => ev.currentTarget.style.textDecoration = "none"}>{shortAddr(w.addr)}</div>
        <div style={{ display: "flex", gap: 8, marginTop: 12, width: "100%" }}>
          <button onClick={() => window.open("https://wallet.xyz/@HISCORE", "_blank")} style={{
            fontFamily: ff, fontSize: 12, fontWeight: 600,
            color: K.white, background: K.accent,
            border: "none", borderRadius: 8,
            padding: "9px 0", cursor: "pointer",
            flex: 1, transition: "opacity 0.15s ease",
          }}
          onMouseEnter={(ev) => ev.currentTarget.style.opacity = "0.85"}
          onMouseLeave={(ev) => ev.currentTarget.style.opacity = "1"}
          >{"\u2197 Copy Trader"}</button>
          <button onClick={() => { if (typeof onShare === "function") onShare(entry); }} style={{
            fontFamily: ff, fontSize: 12, fontWeight: 500,
            color: K.textSec, background: K.white,
            border: "1px solid " + K.border, borderRadius: 8,
            padding: "9px 0", cursor: "pointer",
            flex: 1, transition: "all 0.15s ease",
          }}
          onMouseEnter={(ev) => { ev.currentTarget.style.borderColor = K.accent; ev.currentTarget.style.color = K.accent; }}
          onMouseLeave={(ev) => { ev.currentTarget.style.borderColor = K.border; ev.currentTarget.style.color = K.textSec; }}
          >{"\u2b06 Share"}</button>
        </div>
      </div>

      {/* PnL */}
      <Tile style={{ padding: 20, textAlign: "center", marginBottom: 10, position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 3, borderRadius: "14px 14px 0 0",
          background: pnlPos ? K.profit : K.loss, opacity: 0.8,
        }} />
        <div style={{ fontFamily: ff, fontSize: 11, color: K.textMuted, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Profit</div>
        <div style={{
          fontFamily: mono, fontSize: 36, fontWeight: 700, marginTop: 6,
          color: pnlPos ? K.profit : K.loss,
        }}>
          {(pnlPos ? "+" : "") + fmt(entry.pnl)}
        </div>
      </Tile>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
        {[
          { l: "Win Rate", v: entry.wr + "%", c: entry.wr >= 55 ? K.profit : K.text },
          { l: "Trades", v: entry.trades, c: K.text },
          { l: "Volume", v: fmt(entry.vol), c: K.accent },
        ].map((s, i) => (
          <Tile key={i} hover={false} style={{ padding: "12px 8px", textAlign: "center" }}>
            <div style={{ fontFamily: ff, fontSize: 10, color: K.textMuted, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>{s.l}</div>
            <div style={{ fontFamily: mono, fontSize: 18, color: s.c, fontWeight: 700, marginTop: 3 }}>{s.v}</div>
          </Tile>
        ))}
      </div>

      {/* Holdings */}
      <Tile hover={false} style={{ marginBottom: 10, overflow: "hidden" }}>
        <div style={{ padding: "12px 16px", borderBottom: "1px solid " + K.borderLight }}>
          <span style={{ fontFamily: ff, fontSize: 14, fontWeight: 600, color: K.text }}>Current Holdings</span>
        </div>
        <div style={{ padding: 4 }}>
          {(!entry.holdings || entry.holdings.length === 0) ? (
            <div style={{ padding: 16, textAlign: "center", fontFamily: ff, fontSize: 13, color: K.textMuted }}>No open positions</div>
          ) : entry.holdings.map((h, i) => {
            const pnl = h.realized_pnl_usd || 0;
            return (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "9px 12px",
                borderBottom: i < entry.holdings.length - 1 ? "1px solid " + K.borderLight : "none",
              }}>
                <TokenIcon address={h.token_address} symbol={h.token_symbol} size={28} />
                <div style={{ flex: 1 }}>
                  <div
                    onClick={(ev) => { ev.stopPropagation(); window.open("https://basescan.org/token/" + h.token_address, "_blank"); }}
                    style={{ fontFamily: ff, fontSize: 13, fontWeight: 600, color: K.accent, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 3 }}
                    onMouseEnter={(ev) => ev.currentTarget.style.textDecoration = "underline"}
                    onMouseLeave={(ev) => ev.currentTarget.style.textDecoration = "none"}
                  >{h.token_symbol || "UNKNOWN"}<span style={{ fontSize: 10, color: K.textMuted }}>{">"}</span></div>
                  <div style={{ fontFamily: mono, fontSize: 11, color: K.textMuted }}>{fmt(h.est_value_usd)} cost basis</div>
                </div>
                <span style={{
                  fontFamily: mono, fontSize: 12, fontWeight: 600,
                  color: pnl >= 0 ? K.profit : K.loss,
                  background: pnl >= 0 ? K.profitBg : K.lossBg,
                  padding: "2px 8px", borderRadius: 6,
                }}>{(pnl >= 0 ? "+" : "") + fmt(pnl)}</span>
              </div>
            );
          })}
        </div>
      </Tile>

      {/* Socials */}
      <Tile hover={false} style={{ marginBottom: 10, overflow: "hidden" }}>
        <div style={{ padding: "12px 16px", borderBottom: "1px solid " + K.borderLight }}>
          <span style={{ fontFamily: ff, fontSize: 14, fontWeight: 600, color: K.text }}>Socials</span>
        </div>
        <div style={{ padding: 4 }}>
          {[
            { name: "Twitter / X", handle: "@" + w.label.toLowerCase(), icon: "X", url: "https://x.com/" + w.label.toLowerCase() },
            { name: "Telegram", handle: "@" + w.label.toLowerCase(), icon: "TG", url: "https://t.me/" + w.label.toLowerCase() },
            { name: "Farcaster", handle: w.label.toLowerCase() + ".eth", icon: "FC", url: "https://warpcast.com/" + w.label.toLowerCase() },
          ].map((s, i) => (
            <div key={i}
              onClick={() => window.open(s.url, "_blank")}
              onMouseEnter={(ev) => ev.currentTarget.style.background = K.bg}
              onMouseLeave={(ev) => ev.currentTarget.style.background = "transparent"}
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                borderBottom: i < 2 ? "1px solid " + K.borderLight : "none",
                cursor: "pointer", transition: "background 0.15s ease",
              }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8, background: K.bg,
                border: "1px solid " + K.border,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: mono, fontSize: 10, fontWeight: 700, color: K.textSec,
              }}>{s.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: ff, fontSize: 13, fontWeight: 500, color: K.text }}>{s.name}</div>
                <div style={{ fontFamily: mono, fontSize: 11, color: K.cyan }}>{s.handle}</div>
              </div>
              <span style={{ color: K.textFaint, fontSize: 14 }}>{">"}</span>
            </div>
          ))}
        </div>
      </Tile>


      {/* Recent trades */}
      <Tile hover={false} style={{ overflow: "hidden" }}>
        <div style={{ padding: "12px 16px", borderBottom: "1px solid " + K.borderLight }}>
          <span style={{ fontFamily: ff, fontSize: 14, fontWeight: 600, color: K.text }}>Recent Trades</span>
        </div>
        <div style={{ maxHeight: 320, overflowY: "auto" }}>
          {myTrades.length === 0 ? (
            <div style={{ padding: 20, textAlign: "center", fontFamily: ff, fontSize: 13, color: K.textMuted }}>No trades yet.</div>
          ) : myTrades.slice(0, 5).map((t, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 8, padding: "7px 16px",
              borderBottom: "1px solid " + K.borderLight, fontSize: 12, fontFamily: ff,
            }}>
              <span style={{ color: K.cyan, fontFamily: mono, fontSize: 10, width: 30, opacity: 0.7 }}>{ago(t.traded_at).replace(" ago","")}</span>
              <span style={{
                fontFamily: ff, fontSize: 11, fontWeight: 600,
                color: t.direction === "buy" ? K.profit : K.loss,
                background: t.direction === "buy" ? K.profitBg : K.lossBg,
                padding: "1px 6px", borderRadius: 4,
              }}>{t.direction === "buy" ? "Buy" : "Sell"}</span>
              <span style={{ color: K.text, fontFamily: mono, fontWeight: 500 }}>{fmt(t.usd_amount)}</span>
              <span style={{ color: K.accent, fontWeight: 600, marginLeft: "auto" }}>{t.token_symbol}</span>
            </div>
          ))}
        </div>
      </Tile>
    </div>
  );
}

/* ======================= MOBILE TABLE ======================= */
function MobileTable({ leaders, onSelect, selected }) {
  return (
    <div>
      <div style={{
        display: "grid", gridTemplateColumns: "30px 1fr 80px",
        padding: "10px 16px", gap: 8,
        borderBottom: "1px solid " + K.borderLight,
      }}>
        {["#", "Trader", "Profit"].map((h, i) => (
          <span key={h} style={{
            fontFamily: ff, fontSize: 11, fontWeight: 500,
            color: K.textMuted, textAlign: i > 1 ? "right" : "left",
          }}>{h}</span>
        ))}
      </div>
      {leaders.map((e, i) => {
        const active = selected?.wallet?.id === e.wallet.id;
        const isTop3 = i < 3;
        const medals = [K.gold, K.silver, K.bronze];
        const medalBgs = ["#fffbeb", "#fafafa", "#fff7ed"];
        return (
          <div key={i} onClick={() => onSelect(e)} className="tap-scale" style={{
            display: "grid", gridTemplateColumns: "30px 1fr 80px",
            alignItems: "center", padding: "14px 16px", gap: 8,
            cursor: "pointer", borderBottom: "1px solid " + K.borderLight,
            borderLeft: active ? "3px solid " + K.accent : "3px solid transparent",
            background: active ? K.accentLight : isTop3 ? medalBgs[i] : "transparent",
            animation: "fadeUp 0.3s ease " + (i * 0.03) + "s both",
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: 6, display: "flex",
              alignItems: "center", justifyContent: "center",
              background: isTop3 ? medals[i] : K.bg,
              border: isTop3 ? "none" : "1px solid " + K.border,
            }}>
              <span style={{ fontFamily: mono, fontSize: 10, fontWeight: 700, color: isTop3 ? "#fff" : K.textMuted }}>{i + 1}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, overflow: "hidden" }}>
              <div style={{
                width: 36, height: 36, flexShrink: 0, borderRadius: 10,
                border: "1px solid " + K.border, background: K.bg,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <img src={AVATARS[e.wallet.avi || 0]} alt="" style={{ width: 26, height: 26, imageRendering: "pixelated" }} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontFamily: ff, fontSize: 14, fontWeight: 600, color: K.text,
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>{e.wallet.label}</div>
                <div style={{ fontFamily: mono, fontSize: 10, color: K.textMuted }}>{e.wr.toFixed(1)}% WR &middot; {e.trades} trades</div>
              </div>
            </div>
            <span style={{
              fontFamily: mono, fontSize: 13, fontWeight: 600, textAlign: "right",
              color: e.pnl >= 0 ? K.profit : K.loss,
            }}>{(e.pnl >= 0 ? "+" : "") + fmt(e.pnl)}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ======================= MOBILE PROFILE SHEET ======================= */
function MobileProfileSheet({ entry, trades, onClose, onShare }) {
  if (!entry) return null;
  const w = entry.wallet;
  const pnlPos = entry.pnl >= 0;
  const myTrades = (trades || []).filter(t => t.wallet.id === w.id).slice(0, 5);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000 }} onClick={onClose}>
      <div style={{
        position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)",
        animation: "fadeIn 0.2s ease",
      }} />
      <div onClick={(e) => e.stopPropagation()} style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        background: K.bg, borderRadius: "20px 20px 0 0",
        maxHeight: "85vh", overflowY: "auto",
        animation: "slideUp 0.3s ease",
        paddingBottom: "env(safe-area-inset-bottom, 20px)",
      }}>
        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: K.border }} />
        </div>

        <div style={{ padding: "8px 20px 20px" }}>
          {/* Avatar + Name */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14,
              background: "linear-gradient(135deg, " + K.accent + ", #f87171)",
              padding: 2, flexShrink: 0,
            }}>
              <div style={{
                width: "100%", height: "100%", borderRadius: 12, background: K.white,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <img src={AVATARS[w.avi || 0]} alt="" style={{ width: 36, height: 36, imageRendering: "pixelated" }} />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: ff, fontSize: 18, fontWeight: 700, color: K.text }}>{w.label}</div>
              <div onClick={() => window.open("https://basescan.org/address/" + w.addr, "_blank")} style={{ fontFamily: mono, fontSize: 12, color: K.cyan, marginTop: 2 }}>{shortAddr(w.addr)}</div>
            </div>
            <button onClick={onClose} style={{
              width: 32, height: 32, borderRadius: 8, border: "1px solid " + K.border,
              background: K.white, cursor: "pointer", fontFamily: ff, fontSize: 16, color: K.textMuted,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>&times;</button>
          </div>

          {/* PnL */}
          <Tile style={{ padding: 16, textAlign: "center", marginBottom: 10, position: "relative", overflow: "hidden" }}>
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 3, borderRadius: "14px 14px 0 0",
              background: pnlPos ? K.profit : K.loss, opacity: 0.8,
            }} />
            <div style={{ fontFamily: ff, fontSize: 11, color: K.textMuted, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Profit</div>
            <div style={{ fontFamily: mono, fontSize: 30, fontWeight: 700, marginTop: 4, color: pnlPos ? K.profit : K.loss }}>
              {(pnlPos ? "+" : "") + fmt(entry.pnl)}
            </div>
          </Tile>

          {/* Stats row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
            {[
              { l: "Win Rate", v: entry.wr + "%", c: entry.wr >= 55 ? K.profit : K.text },
              { l: "Trades", v: entry.trades, c: K.text },
              { l: "Volume", v: fmt(entry.vol), c: K.accent },
            ].map((s, i) => (
              <Tile key={i} hover={false} style={{ padding: "10px 6px", textAlign: "center" }}>
                <div style={{ fontFamily: ff, fontSize: 9, color: K.textMuted, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>{s.l}</div>
                <div style={{ fontFamily: mono, fontSize: 16, color: s.c, fontWeight: 700, marginTop: 2 }}>{s.v}</div>
              </Tile>
            ))}
          </div>

          {/* Holdings */}
          {entry.holdings && entry.holdings.length > 0 && (
            <Tile hover={false} style={{ marginBottom: 10, overflow: "hidden" }}>
              <div style={{ padding: "10px 14px", borderBottom: "1px solid " + K.borderLight }}>
                <span style={{ fontFamily: ff, fontSize: 13, fontWeight: 600, color: K.text }}>Holdings</span>
              </div>
              {entry.holdings.map((h, i) => {
                const pnl = h.realized_pnl_usd || 0;
                return (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "9px 14px",
                    borderBottom: i < entry.holdings.length - 1 ? "1px solid " + K.borderLight : "none",
                  }}>
                    <TokenIcon address={h.token_address} symbol={h.token_symbol} size={26} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: ff, fontSize: 13, fontWeight: 600, color: K.text }}>{h.token_symbol || "UNKNOWN"}</div>
                      <div style={{ fontFamily: mono, fontSize: 10, color: K.textMuted }}>{fmt(h.est_value_usd)} cost</div>
                    </div>
                    <span style={{
                      fontFamily: mono, fontSize: 11, fontWeight: 600,
                      color: pnl >= 0 ? K.profit : K.loss,
                      background: pnl >= 0 ? K.profitBg : K.lossBg,
                      padding: "2px 6px", borderRadius: 5,
                    }}>{(pnl >= 0 ? "+" : "") + fmt(pnl)}</span>
                  </div>
                );
              })}
            </Tile>
          )}

          {/* Recent trades */}
          {myTrades.length > 0 && (
            <Tile hover={false} style={{ marginBottom: 10, overflow: "hidden" }}>
              <div style={{ padding: "10px 14px", borderBottom: "1px solid " + K.borderLight }}>
                <span style={{ fontFamily: ff, fontSize: 13, fontWeight: 600, color: K.text }}>Recent Trades</span>
              </div>
              {myTrades.map((t, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "8px 14px",
                  borderBottom: "1px solid " + K.borderLight, fontSize: 12, fontFamily: ff,
                }}>
                  <span style={{ color: K.cyan, fontFamily: mono, fontSize: 10, width: 28, opacity: 0.7 }}>{ago(t.traded_at).replace(" ago","")}</span>
                  <span style={{
                    fontFamily: ff, fontSize: 11, fontWeight: 600,
                    color: t.direction === "buy" ? K.profit : K.loss,
                    background: t.direction === "buy" ? K.profitBg : K.lossBg,
                    padding: "1px 6px", borderRadius: 4,
                  }}>{t.direction === "buy" ? "Buy" : "Sell"}</span>
                  <span style={{ color: K.text, fontFamily: mono, fontWeight: 500 }}>{fmt(t.usd_amount)}</span>
                  <span style={{ color: K.accent, fontWeight: 600, marginLeft: "auto" }}>{t.token_symbol}</span>
                </div>
              ))}
            </Tile>
          )}

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => window.open("https://wallet.xyz/@HISCORE", "_blank")} style={{
              fontFamily: ff, fontSize: 13, fontWeight: 600,
              color: K.white, background: K.accent,
              border: "none", borderRadius: 10,
              padding: "12px 0", cursor: "pointer", flex: 1,
            }}>{"\u2197 Copy Trader"}</button>
            <button onClick={() => { if (typeof onShare === "function") onShare(entry); }} style={{
              fontFamily: ff, fontSize: 13, fontWeight: 500,
              color: K.textSec, background: K.white,
              border: "1px solid " + K.border, borderRadius: 10,
              padding: "12px 0", cursor: "pointer", flex: 1,
            }}>{"\u2b06 Share"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ======================= MOBILE LIVE FEED ======================= */
function MobileLiveFeed({ trades, liveMin, setLiveMin }) {
  return (
    <div>
      <div style={{
        padding: "12px 16px", display: "flex", alignItems: "center",
        justifyContent: "space-between", borderBottom: "1px solid " + K.borderLight,
      }}>
        <span style={{
          fontFamily: ff, fontSize: 10, fontWeight: 600,
          color: K.profit, background: K.profitBg,
          padding: "2px 8px", borderRadius: 4,
          border: "1px solid rgba(22,163,74,0.15)",
        }}>LIVE</span>
        <div style={{ display: "flex", gap: 3 }}>
          {[{label:"All",val:0},{label:"$100+",val:100},{label:"$500+",val:500},{label:"$1K+",val:1000}].map((f) => (
            <button key={f.val} onClick={() => setLiveMin(f.val)} style={{
              fontFamily: ff, fontSize: 10, fontWeight: 500,
              color: liveMin === f.val ? K.text : K.textMuted,
              background: liveMin === f.val ? K.bg : "transparent",
              border: "1px solid " + (liveMin === f.val ? K.border : "transparent"),
              borderRadius: 6, padding: "3px 8px", cursor: "pointer",
            }}>{f.label}</button>
          ))}
        </div>
      </div>
      {trades.filter(t => (t.usd_amount || 0) >= liveMin).map((t, i) => {
        const buy = t.direction === "buy";
        return (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: "50px 1fr 1fr 70px",
            alignItems: "center", padding: "10px 16px", gap: 8,
            borderBottom: "1px solid " + K.borderLight, fontSize: 12,
          }}>
            <span style={{ fontFamily: mono, fontSize: 10, color: K.cyan }}>{ago(t.traded_at)}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <img src={AVATARS[Math.abs(t.wallet.avi) % 10]} alt="" style={{ width: 24, height: 24, imageRendering: "pixelated", borderRadius: 6 }} />
              <span style={{ fontFamily: ff, fontSize: 12, fontWeight: 500, color: K.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.wallet.label}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{
                fontFamily: ff, fontSize: 9, fontWeight: 600,
                color: buy ? K.profit : K.loss,
                background: buy ? K.profitBg : K.lossBg,
                padding: "1px 4px", borderRadius: 3,
              }}>{buy ? "B" : "S"}</span>
              <span style={{ fontFamily: ff, fontSize: 12, fontWeight: 500, color: K.accent }}>{t.token_symbol}</span>
            </div>
            <span style={{
              fontFamily: mono, fontSize: 12, fontWeight: 600, textAlign: "right",
              color: buy ? K.profit : K.loss,
            }}>{t.usd_amount > 0 ? fmt(t.usd_amount) : (buy ? "BUY" : "SELL")}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ======================= SEARCH ======================= */
function SearchPanel({ onSelect, leaders }) {
  const [q, setQ] = useState("");
  const filtered = leaders.filter(l => 
    l.wallet.label.toLowerCase().includes(q.toLowerCase()) ||
    l.wallet.addr.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div style={{ padding: 20 }}>
      <div style={{
        display: "flex", gap: 8, marginBottom: 16,
        background: K.white, borderRadius: 12, padding: 4,
        border: "1px solid " + K.border,
        boxShadow: cardShadow,
      }}>
        <input
          value={q} onChange={e => setQ(e.target.value)}
          placeholder="Search player..."
          style={{
            flex: 1, padding: "10px 14px", background: "transparent",
            color: K.text, fontFamily: ff, fontSize: 14, border: "none", outline: "none",
          }}
        />
        <button style={{
          fontFamily: ff, fontSize: 13, fontWeight: 600,
          color: "#fff", background: K.accent, border: "none", borderRadius: 10,
          padding: "10px 20px", cursor: "pointer",
          boxShadow: "0 2px 8px rgba(229,67,46,0.3)",
        }}>Search</button>
      </div>

      {filtered.map(ld => {
        const w = ld.wallet;
        return (
          <Tile key={w.id} onClick={() => onSelect(ld)} style={{
            display: "flex", alignItems: "center", gap: 8, padding: "12px 12px", marginBottom: 8, overflow: "hidden",
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, background: K.bg, flexShrink: 0,
              border: "1px solid " + K.border,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <img src={AVATARS[w.avi || 0]} alt="" style={{ width: 22, height: 22, imageRendering: "pixelated" }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: ff, fontSize: 13, fontWeight: 600, color: K.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{w.label}</div>
              <div style={{ fontFamily: mono, fontSize: 10, color: K.cyan }}>{shortAddr(w.addr)}</div>
            </div>
            <span style={{
              fontFamily: mono, fontSize: 11, fontWeight: 600, flexShrink: 0, whiteSpace: "nowrap",
              color: ld.pnl >= 0 ? K.profit : K.loss,
              background: ld.pnl >= 0 ? K.profitBg : K.lossBg,
              padding: "2px 6px", borderRadius: 5,
            }}>{(ld.pnl >= 0 ? "+" : "") + fmt(ld.pnl)}</span>
          </Tile>
        );
      })}
    </div>
  );
}

/* ======================= MAIN ======================= */
export default function HiScore() {
  const isMobile = useIsMobile();
  const getInitialTab = () => {
    const h = window.location.hash.replace("#", "");
    return ["ranks", "live", "search"].includes(h) ? h : "ranks";
  };
  const [tab, setTabRaw] = useState(getInitialTab);
  const setTab = (t) => { window.location.hash = t; setTabRaw(t); };
  const [selected, setSelected] = useState(null);
  const [mobileProfile, setMobileProfile] = useState(null);
  const [leaders, setLeaders] = useState([]);
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("all");
  const [liveMin, setLiveMin] = useState(0);
  const [feedFilter, setFeedFilter] = useState("all");
  const [shareCard, setShareCard] = useState(null);
  const [showSubmit, setShowSubmit] = useState(false);
  const feedRef = useRef(null);
  const firstLoad = useRef(true);

  const handleSelect = useCallback((e) => {
    setSelected(e);
    if (isMobile) setMobileProfile(e);
  }, [isMobile]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(API_BASE + "/leaderboard?period=" + period);
        if (!res.ok) throw new Error("HTTP " + res.status);
        const data = await res.json();
        const { leaders: ld, trades: tr } = mapLeaderboard(data);
        setLeaders(ld);
        setTrades(tr);
        if (ld.length > 0 && firstLoad.current) {
          setSelected(ld[0]);
          firstLoad.current = false;
        }
      } catch (e) {
        console.error("Fetch error:", e);
      }
      setLoading(false);
    }
    fetchData();
    const iv = setInterval(fetchData, 30000);
    return () => clearInterval(iv);
  }, [period]);

  useEffect(() => {
    if (feedRef.current) feedRef.current.scrollTop = feedRef.current.scrollHeight;
  }, [trades]);

  /* ===== MOBILE LAYOUT ===== */
  if (isMobile) return (
    <div style={{
      height: "100vh", display: "flex", flexDirection: "column",
      fontFamily: ff, color: K.text, background: K.bg,
    }}>
      <style>{STYLES}</style>

      {/* Mobile Header */}
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "0 16px", flexShrink: 0,
        borderBottom: "none",
        background: K.white, height: 48,
        position: "relative",
      }}>
        <img src={LOGO_SVG} alt="" style={{ width: 22, height: 22, borderRadius: 5 }} />
        <span style={{ fontFamily: ff, fontSize: 16, fontWeight: 700, letterSpacing: "0.06em", marginLeft: 8 }}>HISCORE</span>
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
          background: "linear-gradient(90deg, " + K.accent + ", #f87171, " + K.accent + ")",
          backgroundSize: "200% 100%",
          animation: "gradientShift 3s ease infinite",
        }} />
      </header>

      {/* Mobile Content */}
      <div style={{ flex: 1, overflowY: "auto", background: K.white }}>
        {tab === "ranks" && (
          <div>
            <div style={{
              padding: "14px 16px", display: "flex", flexDirection: "column",
              alignItems: "center", borderBottom: "1px solid " + K.borderLight,
            }}>
              <p style={{ fontSize: 12, color: K.textMuted, marginBottom: 8 }}>Top traders &bull; Base Chain</p>
              <div style={{ display: "flex", gap: 4 }}>
                {[{id:"all",label:"Overall"},{id:"24h",label:"24h"},{id:"7d",label:"7d"},{id:"30d",label:"30d"}].map((p) => (
                  <button key={p.id} onClick={() => { setPeriod(p.id); setLoading(true); }} style={{
                    fontFamily: ff, fontSize: 12, fontWeight: 500,
                    color: period === p.id ? K.text : K.textMuted,
                    background: period === p.id ? K.bg : "transparent",
                    border: "1px solid " + (period === p.id ? K.border : "transparent"),
                    borderRadius: 8, padding: "5px 14px", cursor: "pointer",
                    boxShadow: period === p.id ? cardShadow : "none",
                  }}>{p.label}</button>
                ))}
              </div>
            </div>
            {loading ? (
              <div>{Array.from({length: 5}, (_, i) => <SkeletonRow key={i} i={i} />)}</div>
            ) : (
              <MobileTable leaders={leaders} onSelect={handleSelect} selected={selected} />
            )}
          </div>
        )}
        {tab === "live" && <MobileLiveFeed trades={trades} liveMin={liveMin} setLiveMin={setLiveMin} />}
        {tab === "search" && (
          <div>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid " + K.borderLight }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: K.text }}>Player Lookup</h2>
            </div>
            <SearchPanel onSelect={e => { handleSelect(e); setTab("ranks"); }} leaders={leaders} />
          </div>
        )}
      </div>

      {/* Mobile Bottom Nav */}
      <nav style={{
        display: "flex", flexShrink: 0,
        borderTop: "1px solid " + K.border,
        background: K.white,
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}>
        {[
          { id: "ranks", label: "Ranks", icon: "\u2606" },
          { id: "live", label: "Live", icon: "\u25CF" },
          { id: "search", label: "Search", icon: "\u2315" },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: "10px 0 8px", gap: 2, border: "none", cursor: "pointer",
            background: "transparent",
            color: tab === t.id ? K.accent : K.textMuted,
            fontFamily: ff,
          }}>
            <span style={{ fontSize: 18, lineHeight: 1 }}>{t.icon}</span>
            <span style={{ fontSize: 10, fontWeight: 600 }}>{t.label}</span>
          </button>
        ))}
        <button onClick={() => setShowSubmit(true)} style={{
          flex: 1, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "10px 0 8px", gap: 2, border: "none", cursor: "pointer",
          background: "transparent", color: K.accent, fontFamily: ff,
        }}>
          <span style={{ fontSize: 18, lineHeight: 1, fontWeight: 700 }}>+</span>
          <span style={{ fontSize: 10, fontWeight: 600 }}>Submit</span>
        </button>
      </nav>

      {/* Mobile Profile Sheet */}
      {mobileProfile && (
        <MobileProfileSheet
          entry={mobileProfile}
          trades={trades}
          onClose={() => setMobileProfile(null)}
          onShare={setShareCard}
        />
      )}
      {shareCard && <ShareCard entry={shareCard} onClose={() => setShareCard(null)} />}
      {showSubmit && <SubmitWalletModal onClose={() => setShowSubmit(false)} />}
    </div>
  );

  /* ===== DESKTOP LAYOUT ===== */  return (
    <div style={{
      height: "100vh", display: "flex", flexDirection: "column",
      fontFamily: ff, color: K.text, background: K.bg,
    }}>
      <style>{STYLES}</style>

      {/* ===== HEADER ===== */}
      <header style={{
        display: "flex", alignItems: "center",
        padding: "0 20px", flexShrink: 0,
        borderBottom: "none",
        background: K.white,
        height: 44,
        position: "relative",
      }}>
        <img src={LOGO_SVG} alt="" style={{
          width: 24, height: 24, borderRadius: 5,
        }} />
        <span style={{ fontFamily: ff, fontSize: 14, fontWeight: 700, letterSpacing: "0.06em", marginLeft: 8, color: K.text }}>HISCORE</span>

        <div style={{ flex: 1 }} />

        <div style={{
          display: "flex", gap: 1, background: K.bg,
          borderRadius: 7, padding: 2, border: "1px solid " + K.borderLight,
        }}>
          {[
            { id: "ranks", label: "HiScore" },
            { id: "live", label: "Live" },
            { id: "search", label: "Lookup" },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              fontFamily: ff, fontSize: 12, fontWeight: 500,
              color: tab === t.id ? K.text : K.textMuted,
              background: tab === t.id ? K.white : "transparent",
              border: tab === t.id ? "1px solid " + K.borderLight : "1px solid transparent",
              boxShadow: tab === t.id ? cardShadow : "none",
              borderRadius: 6, padding: "4px 14px", cursor: "pointer",
              transition: "all 0.15s ease",
            }}>{t.label}</button>
          ))}
        </div>

        <div style={{ flex: 1 }} />
        <button onClick={() => setShowSubmit(true)} style={{
          fontFamily: ff, fontSize: 12, fontWeight: 600,
          color: K.white, background: K.accent, border: "none", borderRadius: 7,
          padding: "5px 14px", cursor: "pointer", transition: "opacity 0.15s",
        }} onMouseEnter={e => e.currentTarget.style.opacity = "0.85"} onMouseLeave={e => e.currentTarget.style.opacity = "1"}>+ Submit Wallet</button>
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
          background: "linear-gradient(90deg, " + K.accent + ", #f87171, " + K.accent + ")",
          backgroundSize: "200% 100%",
          animation: "gradientShift 3s ease infinite",
        }} />
      </header>

      {/* ===== BODY ===== */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* LEFT */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ flex: 1, overflow: "auto", background: K.white }}>
            {tab === "ranks" && (
              <div>
                <div style={{
                  padding: "18px 24px", display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  borderBottom: "1px solid " + K.borderLight,
                }}>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: K.text, letterSpacing: "0.08em", margin: 0 }}>HISCORE</h2>
                  <p style={{ fontSize: 13, color: K.textMuted, marginTop: 4 }}>Top traders ranked by all-time profit &bull; Base Chain</p>
                  <div style={{ display: "flex", gap: 4, marginTop: 12 }}>
                    {[{id:"all",label:"Overall"},{id:"24h",label:"24h"},{id:"7d",label:"7d"},{id:"30d",label:"30d"}].map((p) => (
                      <button key={p.id} onClick={() => { setPeriod(p.id); setLoading(true); }} style={{
                        fontFamily: ff, fontSize: 12, fontWeight: 500,
                        color: period === p.id ? K.text : K.textMuted,
                        background: period === p.id ? K.bg : "transparent",
                        border: "1px solid " + (period === p.id ? K.border : "transparent"),
                        borderRadius: 8, padding: "5px 12px", cursor: "pointer",
                        boxShadow: period === p.id ? cardShadow : "none",
                      }}>{p.label}</button>
                    ))}
                  </div>
                </div>
                {loading ? (
                  <div>{Array.from({length: 5}, (_, i) => <SkeletonDesktopRow key={i} i={i} />)}</div>
                ) : leaders.length === 0 ? (
                  <div style={{ padding: 40, textAlign: "center", fontFamily: ff, color: K.textMuted, fontSize: 14 }}>No data yet. Sync trades first.</div>
                ) : (
                  <HiscoresTable onSelect={handleSelect} selected={selected} leaders={leaders} />
                )}
              </div>
            )}
            {tab === "live" && (
              <div>
                <div style={{
                  padding: "14px 24px", display: "flex", alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid " + K.borderLight,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{
                      fontFamily: ff, fontSize: 10, fontWeight: 600,
                      color: K.profit, background: K.profitBg,
                      padding: "2px 8px", borderRadius: 4,
                      border: "1px solid rgba(22,163,74,0.15)",
                    }}>LIVE</span>
                    <div style={{ display: "flex", gap: 3 }}>
                      {[{label:"\u2265 $100",val:100},{label:"\u2265 $500",val:500},{label:"\u2265 $1K",val:1000}].map((f) => (
                        <button key={f.val} onClick={() => setLiveMin(liveMin === f.val ? 0 : f.val)} style={{
                          fontFamily: ff, fontSize: 11, fontWeight: 500,
                          color: liveMin === f.val ? K.text : K.textMuted,
                          background: liveMin === f.val ? K.bg : "transparent",
                          border: "1px solid " + (liveMin === f.val ? K.border : "transparent"),
                          borderRadius: 6, padding: "3px 10px", cursor: "pointer",
                        }}>{f.label}</button>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Column headers */}
                <div style={{
                  display: "grid", gridTemplateColumns: "80px 2fr 1.5fr 110px",
                  padding: "10px 24px", gap: 8,
                  borderBottom: "1px solid " + K.borderLight,
                }}>
                  {["Time", "Trader", "Token", "USD"].map((h, i) => (
                    <span key={h} style={{
                      fontFamily: ff, fontSize: 12, fontWeight: 500,
                      color: K.textMuted,
                      textAlign: i >= 3 ? "right" : "left",
                    }}>{h}</span>
                  ))}
                </div>
                {/* Trade rows */}
                <div>
                  {trades.filter(t => (t.usd_amount || 0) >= liveMin).map((t, i) => {
                    const buy = t.direction === "buy";
                    return (
                      <div key={i} style={{
                        display: "grid", gridTemplateColumns: "80px 2fr 1.5fr 110px",
                        padding: "11px 24px", gap: 8, alignItems: "center",
                        borderBottom: "1px solid " + K.borderLight,
                        animation: "fadeUp 0.3s ease " + (i * 0.02) + "s both",
                      }}>
                        <span style={{ fontFamily: mono, fontSize: 12, color: K.cyan, opacity: 0.7, fontStyle: "italic" }}>{ago(t.traded_at)}</span>
                        <div onClick={() => { const ld = leaders.find(l => l.wallet.id === t.wallet.id); if (ld) setSelected(ld); }} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                          <div style={{
                            width: 28, height: 28, borderRadius: 8, background: K.bg,
                            border: "1px solid " + K.border,
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            <img src={AVATARS[Math.abs(t.wallet.avi || 0) % 10]} alt="" style={{ width: 20, height: 20, imageRendering: "pixelated" }} />
                          </div>
                          <span className="live-trader-name" style={{ fontFamily: ff, fontSize: 13, fontWeight: 500, color: K.accent }}>{t.wallet.label}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <TokenIcon address={t.token_address} symbol={t.token_symbol} size={28} />
                          <span style={{ fontFamily: ff, fontSize: 13, fontWeight: 500, color: K.cyan }}>{t.token_symbol}</span>
                        </div>
                        <span style={{
                          fontFamily: mono, fontSize: 13, fontWeight: 600, textAlign: "right",
                          color: buy ? K.profit : K.loss,
                        }}>{t.usd_amount > 0 ? fmt(t.usd_amount) : (buy ? "BUY" : "SELL")}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {tab === "search" && (
              <div>
                <div style={{ padding: "18px 24px", borderBottom: "1px solid " + K.borderLight }}>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: K.text, letterSpacing: "-0.02em", margin: 0 }}>Player Lookup</h2>
                </div>
                <SearchPanel onSelect={e => { setSelected(e); setTab("ranks"); }} leaders={leaders} />
              </div>
            )}
          </div>

          {/* LIVE FEED - only show on non-live tabs */}
          {tab !== "live" && <div style={{
            height: 190, flexShrink: 0,
            borderTop: "1px solid " + K.border,
            display: "flex", flexDirection: "column",
            background: K.white,
          }}>
            <div style={{
              padding: "8px 16px", display: "flex", alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid " + K.borderLight,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: ff, fontSize: 14, fontWeight: 600, color: K.text }}>Live Feed</span>
                <span style={{
                  fontFamily: ff, fontSize: 10, fontWeight: 600,
                  color: K.profit, background: K.profitBg,
                  padding: "2px 8px", borderRadius: 4,
                  border: "1px solid rgba(22,163,74,0.15)",
                }}>LIVE</span>
              </div>
              <div style={{ display: "flex", gap: 3 }}>
                {[{id:"all",label:"All"},{id:"buy",label:"Buys"},{id:"sell",label:"Sells"},{id:"whale",label:"Whale"}].map((f) => (
                  <button key={f.id} onClick={() => setFeedFilter(f.id)} style={{
                    fontFamily: ff, fontSize: 11, fontWeight: 500,
                    color: feedFilter === f.id ? K.text : K.textMuted,
                    background: feedFilter === f.id ? K.bg : "transparent",
                    border: "1px solid " + (feedFilter === f.id ? K.border : "transparent"),
                    borderRadius: 6, padding: "2px 8px", cursor: "pointer",
                  }}>{f.label}</button>
                ))}
              </div>
            </div>
            <div ref={feedRef} style={{ flex: 1, overflowY: "auto" }}>
              {trades.filter(t => {
                if (feedFilter === "buy") return t.direction === "buy";
                if (feedFilter === "sell") return t.direction === "sell";
                if (feedFilter === "whale") return (t.usd_amount || 0) >= 1000;
                return true;
              }).map((t, i) => <FeedLine key={i} trade={t} />)}
            </div>
          </div>}
        </div>
        <div style={{
          width: 360, flexShrink: 0,
          borderLeft: "1px solid " + K.border,
          display: "flex", flexDirection: "column",
          background: K.bg,
        }}>
          <SideProfile entry={selected} trades={trades} onShare={setShareCard} />
          <div style={{ marginTop: "auto", padding: "12px 20px", borderTop: "1px solid " + K.borderLight, textAlign: "center" }}>
            <span onClick={() => window.open("https://wallet.xyz/@HISCORE", "_blank")} style={{
              fontFamily: ff, fontSize: 11, color: K.textMuted, cursor: "pointer",
              transition: "color 0.15s",
            }} onMouseEnter={(ev) => ev.currentTarget.style.color = K.accent} onMouseLeave={(ev) => ev.currentTarget.style.color = K.textMuted}>{"Powered by wallet.xyz \u2197"}</span>
          </div>
        </div>
      </div>
      {shareCard && <ShareCard entry={shareCard} onClose={() => setShareCard(null)} />}
      {showSubmit && <SubmitWalletModal onClose={() => setShowSubmit(false)} />}
    </div>
  );
}
