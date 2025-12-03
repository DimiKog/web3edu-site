// src/components/identity-ui.js

/*********************************************
 *  TIER ICONS (shared by Dashboard + SBT View)
 *********************************************/
export const ExplorerIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#7F3DF1">
        <circle cx="12" cy="12" r="10" opacity="0.4" />
        <path d="M12 6l3 6-3 6-3-6 3-6z" />
    </svg>
);

export const BuilderIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#33D6FF">
        <rect x="4" y="4" width="16" height="16" rx="4" />
    </svg>
);

export const ArchitectIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#FFD700">
        <polygon points="12,3 20,21 4,21" />
    </svg>
);

/*********************************************
 *  SHORT WALLET FORMATTER
 *********************************************/
export function shortAddress(addr) {
    if (!addr) return "";
    return addr.slice(0, 6) + "..." + addr.slice(-4);
}

/*********************************************
 *  IDENTICON (generates symmetric 5×5 avatar)
 *********************************************/
export function AddressIdenticon({ address }) {
    if (!address) return null;

    const hex = address.toLowerCase().replace("0x", "");
    const seed = parseInt(hex.slice(0, 8), 16);
    const hue = seed % 360;
    const color = `hsl(${hue}, 80%, 65%)`;

    const cells = [];
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 3; col++) {
            const idx = (row * 3 + col) * 2;
            const pair = hex.slice(idx, idx + 2);
            if (!pair) continue;

            const value = parseInt(pair, 16);
            const on = value % 2 === 0;

            if (on) {
                cells.push({ row, col });
                cells.push({ row, col: 4 - col }); // mirror for symmetry
            }
        }
    }

    return (
        <svg className="w-10 h-10" viewBox="0 0 5 5">
            {cells.map((cell, i) => (
                <rect
                    key={i}
                    x={cell.col}
                    y={cell.row}
                    width="1"
                    height="1"
                    fill={color}
                    opacity="0.95"
                    rx="0.3"
                />
            ))}
        </svg>
    );
}

/*********************************************
 *  AVATAR BACKGROUND STYLE
 *  (tier border + conic gradient)
 *********************************************/
export function generateAvatarStyle(addr, tier) {
    if (!addr) return {};

    const seed = parseInt(addr.slice(2, 10), 16);
    const angle = seed % 360;

    const c1 = `hsl(${seed % 360}, 80%, 60%)`;
    const c2 = `hsl(${(seed * 1.3) % 360}, 80%, 55%)`;
    const c3 = `hsl(${(seed * 0.7) % 360}, 80%, 65%)`;

    let borderColor = "#ffffff33";
    if (tier === "Explorer") borderColor = "#7F3DF1";
    if (tier === "Builder") borderColor = "#33D6FF";
    if (tier === "Architect") borderColor = "#FFD700";

    return {
        background: `conic-gradient(from ${angle}deg, ${c1}, ${c2}, ${c3})`,
        border: `3px solid ${borderColor}`,
        boxShadow: "0 0 24px rgba(0,0,0,0.45)",
    };
}

/*********************************************
 *  TIER → ICON MAPPING
 *********************************************/
export function TierIcon({ tier }) {
    if (tier === "Explorer") return <ExplorerIcon />;
    if (tier === "Builder") return <BuilderIcon />;
    if (tier === "Architect") return <ArchitectIcon />;
    return null;
}