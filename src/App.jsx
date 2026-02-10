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

const LOGO_SVG = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#e5432e"/><path d="M8 8h4v6h8V8h4v16h-4v-6H12v6H8V8z" fill="#fff"/></svg>');

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
  "",
  "* { box-sizing:border-box; margin:0; padding:0; }",
  "body { background:" + K.bg + "; overflow:hidden; -webkit-tap-highlight-color: transparent; }",
  "::-webkit-scrollbar { width:6px; }",
  "::-webkit-scrollbar-track { background:transparent; }",
  "::-webkit-scrollbar-thumb { background:#d4d4d8; border-radius:3px; }",
  "::-webkit-scrollbar-thumb:hover { background:#a1a1aa; }",
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
            <button onClick={(ev) => { ev.stopPropagation(); window.open("https://wallet.xyz/copy/" + e.wallet.addr, "_blank"); }} style={{
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
function SideProfile({ entry, trades }) {
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
          <button onClick={() => window.open("https://wallet.xyz/copy/" + w.addr, "_blank")} style={{
            fontFamily: ff, fontSize: 12, fontWeight: 600,
            color: K.white, background: K.accent,
            border: "none", borderRadius: 8,
            padding: "9px 0", cursor: "pointer",
            flex: 1, transition: "opacity 0.15s ease",
          }}
          onMouseEnter={(ev) => ev.currentTarget.style.opacity = "0.85"}
          onMouseLeave={(ev) => ev.currentTarget.style.opacity = "1"}
          >{"\u2197 Copy Trader"}</button>
          <button onClick={() => window.open("https://wallet.xyz/address/" + w.addr, "_blank")} style={{
            fontFamily: ff, fontSize: 12, fontWeight: 500,
            color: K.textSec, background: K.white,
            border: "1px solid " + K.border, borderRadius: 8,
            padding: "9px 0", cursor: "pointer",
            flex: 1, transition: "all 0.15s ease",
          }}
          onMouseEnter={(ev) => { ev.currentTarget.style.borderColor = K.accent; ev.currentTarget.style.color = K.accent; }}
          onMouseLeave={(ev) => { ev.currentTarget.style.borderColor = K.border; ev.currentTarget.style.color = K.textSec; }}
          >Profile</button>
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
                <div style={{
                  width: 28, height: 28, borderRadius: 8, background: K.accentLight,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: ff, fontSize: 10, fontWeight: 700, color: K.accent,
                }}>{(h.token_symbol || "??").slice(0,2)}</div>
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
          <div key={i} onClick={() => onSelect(e)} style={{
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
function MobileProfileSheet({ entry, trades, onClose }) {
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
                    <div style={{
                      width: 26, height: 26, borderRadius: 7, background: K.accentLight,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: ff, fontSize: 9, fontWeight: 700, color: K.accent,
                    }}>{(h.token_symbol || "??").slice(0,2)}</div>
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
            <button onClick={() => window.open("https://wallet.xyz/copy/" + w.addr, "_blank")} style={{
              fontFamily: ff, fontSize: 13, fontWeight: 600,
              color: K.white, background: K.accent,
              border: "none", borderRadius: 10,
              padding: "12px 0", cursor: "pointer", flex: 1,
            }}>{"\u2197 Copy Trader"}</button>
            <button onClick={() => window.open("https://basescan.org/address/" + w.addr, "_blank")} style={{
              fontFamily: ff, fontSize: 13, fontWeight: 500,
              color: K.textSec, background: K.white,
              border: "1px solid " + K.border, borderRadius: 10,
              padding: "12px 0", cursor: "pointer", flex: 1,
            }}>Basescan</button>
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
            display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", marginBottom: 8,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, background: K.bg,
              border: "1px solid " + K.border,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <img src={AVATARS[w.avi || 0]} alt="" style={{ width: 26, height: 26, imageRendering: "pixelated" }} />
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontFamily: ff, fontSize: 14, fontWeight: 600, color: K.text }}>{w.label}</span>
              <span style={{ fontFamily: mono, fontSize: 11, color: K.cyan, marginLeft: 8 }}>{shortAddr(w.addr)}</span>
            </div>
            <span style={{
              fontFamily: mono, fontSize: 13, fontWeight: 600,
              color: ld.pnl >= 0 ? K.profit : K.loss,
              background: ld.pnl >= 0 ? K.profitBg : K.lossBg,
              padding: "2px 8px", borderRadius: 6,
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
  const [tab, setTab] = useState("ranks");
  const [selected, setSelected] = useState(null);
  const [mobileProfile, setMobileProfile] = useState(null);
  const [leaders, setLeaders] = useState([]);
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("all");
  const [liveMin, setLiveMin] = useState(0);
  const [feedFilter, setFeedFilter] = useState("all");
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
        borderBottom: "1px solid " + K.borderLight,
        background: K.white, height: 48,
      }}>
        <img src={LOGO_SVG} alt="" style={{ width: 22, height: 22, borderRadius: 5 }} />
        <span style={{ fontFamily: ff, fontSize: 16, fontWeight: 700, letterSpacing: "0.06em", marginLeft: 8 }}>HISCORE</span>
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
              <div style={{ padding: 40, textAlign: "center", fontFamily: ff, color: K.textMuted }}>
                <div style={{ animation: "pulse 1.5s infinite", fontSize: 14 }}>Loading...</div>
              </div>
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
      </nav>

      {/* Mobile Profile Sheet */}
      {mobileProfile && (
        <MobileProfileSheet
          entry={mobileProfile}
          trades={trades}
          onClose={() => setMobileProfile(null)}
        />
      )}
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
        borderBottom: "1px solid " + K.borderLight,
        background: K.white,
        height: 44,
      }}>
        <img src={LOGO_SVG} alt="" style={{
          width: 24, height: 24, borderRadius: 5,
        }} />

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
                  <div style={{ padding: 40, textAlign: "center", fontFamily: ff, color: K.textMuted }}>
                    <div style={{ animation: "pulse 1.5s infinite", fontSize: 14 }}>Loading leaderboard...</div>
                  </div>
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
                          <div style={{
                            width: 28, height: 28, borderRadius: 8,
                            background: K.accentLight,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontFamily: ff, fontSize: 9, fontWeight: 700, color: K.accent,
                          }}>{t.token_symbol.slice(0, 2)}</div>
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
          <SideProfile entry={selected} trades={trades} />
          <div style={{ marginTop: "auto", padding: "12px 20px", borderTop: "1px solid " + K.borderLight, textAlign: "center" }}>
            <span onClick={() => window.open("https://wallet.xyz", "_blank")} style={{
              fontFamily: ff, fontSize: 11, color: K.textMuted, cursor: "pointer",
              transition: "color 0.15s",
            }} onMouseEnter={(ev) => ev.currentTarget.style.color = K.accent} onMouseLeave={(ev) => ev.currentTarget.style.color = K.textMuted}>{"Powered by wallet.xyz \u2197"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
