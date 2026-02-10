import { useState, useEffect, useRef } from "react";

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
  "",
  "* { box-sizing:border-box; margin:0; padding:0; }",
  "body { background:" + K.bg + "; overflow:hidden; }",
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
              fontFamily: ff, fontSize: 10, fontWeight: 600,
              color: K.white, background: K.accent,
              border: "none", borderRadius: 4,
              padding: "3px 8px", cursor: "pointer",
              transition: "opacity 0.15s",
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
        <span style={{
          fontFamily: mono, fontSize: 13, marginTop: 4, display: "inline-block",
          color: entry.pnl24h >= 0 ? K.profit : K.loss,
          background: entry.pnl24h >= 0 ? K.profitBg : K.lossBg,
          padding: "2px 10px", borderRadius: 6,
        }}>
          {(entry.pnl24h >= 0 ? "+" : "") + fmt(entry.pnl24h) + " today"}
        </span>
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
          {["BRETT","DEGEN","HIGHER","TOSHI","AERO"].slice(0, 3 + Math.floor(Math.random() * 2)).map((tok, i) => {
            const val = Math.random() * 8000 + 200;
            const pnlPct = (Math.random() - 0.35) * 100;
            return (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "9px 12px",
                borderBottom: i < 4 ? "1px solid " + K.borderLight : "none",
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8, background: K.accentLight,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: ff, fontSize: 10, fontWeight: 700, color: K.accent,
                }}>{tok.slice(0,2)}</div>
                <div style={{ flex: 1 }}>
                  <div
                    onClick={(ev) => { ev.stopPropagation(); window.open("https://wallet.xyz/token/" + tok.toLowerCase(), "_blank"); }}
                    style={{ fontFamily: ff, fontSize: 13, fontWeight: 600, color: K.accent, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 3 }}
                    onMouseEnter={(ev) => ev.currentTarget.style.textDecoration = "underline"}
                    onMouseLeave={(ev) => ev.currentTarget.style.textDecoration = "none"}
                  >{tok}<span style={{ fontSize: 10, color: K.textMuted }}>{">"}</span></div>
                  <div style={{ fontFamily: mono, fontSize: 11, color: K.textMuted }}>{fmt(val)}</div>
                </div>
                <span style={{
                  fontFamily: mono, fontSize: 12, fontWeight: 600,
                  color: pnlPct >= 0 ? K.profit : K.loss,
                  background: pnlPct >= 0 ? K.profitBg : K.lossBg,
                  padding: "2px 8px", borderRadius: 6,
                }}>{(pnlPct >= 0 ? "+" : "") + pnlPct.toFixed(1) + "%"}</span>
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
          ) : myTrades.map((t, i) => (
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
  const [tab, setTab] = useState("ranks");
  const [selected, setSelected] = useState(null);
  const [leaders, setLeaders] = useState([]);
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const feedRef = useRef(null);
  const firstLoad = useRef(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(API_BASE + "/leaderboard");
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
  }, []);

  useEffect(() => {
    if (feedRef.current) feedRef.current.scrollTop = feedRef.current.scrollHeight;
  }, [trades]);

  return (
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
        <img src={"data:image/png;base64,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"} alt="" style={{
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
                    {["Overall", "24h", "7d", "30d"].map((p, i) => (
                      <button key={p} style={{
                        fontFamily: ff, fontSize: 12, fontWeight: 500,
                        color: i === 0 ? K.text : K.textMuted,
                        background: i === 0 ? K.bg : "transparent",
                        border: "1px solid " + (i === 0 ? K.border : "transparent"),
                        borderRadius: 8, padding: "5px 12px", cursor: "pointer",
                        boxShadow: i === 0 ? cardShadow : "none",
                      }}>{p}</button>
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
                  <HiscoresTable onSelect={setSelected} selected={selected} leaders={leaders} />
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
                      {["\u2265 $100", "\u2265 $500", "\u2265 $1K"].map((f, i) => (
                        <button key={f} style={{
                          fontFamily: ff, fontSize: 11, fontWeight: 500,
                          color: i === 1 ? K.text : K.textMuted,
                          background: i === 1 ? K.bg : "transparent",
                          border: "1px solid " + (i === 1 ? K.border : "transparent"),
                          borderRadius: 6, padding: "3px 10px", cursor: "pointer",
                        }}>{f}</button>
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
                  {trades.map((t, i) => {
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
                {["All", "Buys", "Sells", "Whale"].map((f, i) => (
                  <button key={f} style={{
                    fontFamily: ff, fontSize: 11, fontWeight: 500,
                    color: i === 0 ? K.text : K.textMuted,
                    background: i === 0 ? K.bg : "transparent",
                    border: "1px solid " + (i === 0 ? K.border : "transparent"),
                    borderRadius: 6, padding: "2px 8px", cursor: "pointer",
                  }}>{f}</button>
                ))}
              </div>
            </div>
            <div ref={feedRef} style={{ flex: 1, overflowY: "auto" }}>
              {trades.map((t, i) => <FeedLine key={i} trade={t} />)}
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
