import { useId } from "react";

function uid(reactId, name) {
  return `${name}-${reactId.replace(/:/g, "")}`;
}

function SoftShadow({ id, dy = 3, blur = 2.4 }) {
  return (
    <filter id={id} x="-25%" y="-20%" width="150%" height="160%">
      <feDropShadow dx="0" dy={dy} stdDeviation={blur} floodColor="#4C1D95" floodOpacity="0.2" />
    </filter>
  );
}

function MiniCube({ cx, cy, s, top, left, right }) {
  const hx = s * 0.9;
  const hy = s * 0.5;
  return (
    <g>
      <path
        d={`M${cx} ${cy - hy} L${cx + hx} ${cy} L${cx} ${cy + hy} L${cx - hx} ${cy} Z`}
        fill={top}
      />
      <path
        d={`M${cx - hx} ${cy} L${cx} ${cy + hy} L${cx} ${cy + hy + s * 0.7} L${cx - hx} ${cy + s * 0.7} Z`}
        fill={left}
      />
      <path
        d={`M${cx} ${cy + hy} L${cx + hx} ${cy} L${cx + hx} ${cy + s * 0.7} L${cx} ${cy + hy + s * 0.7} Z`}
        fill={right}
      />
    </g>
  );
}

/**
 * Approved production PNG. Contain (never stretch). No inversion/filters.
 */
export function LmApprovedVisual({ src, alt = "", className = "" }) {
  if (!src) return null;
  return (
    <img
      src={src}
      alt={alt}
      draggable={false}
      decoding="async"
      aria-hidden={alt ? undefined : true}
      className={`pointer-events-none select-none object-contain object-center ${className}`}
    />
  );
}

/**
 * Activity visual — approved PNG when the module provides one, SVG fallback otherwise.
 */
export function LmActivityTile({ visualType = "reading", visualSrc = null, className = "" }) {
  const rid = useId();
  if (visualSrc) {
    return (
      <span className={`relative block overflow-hidden ${className}`}>
        <LmApprovedVisual src={visualSrc} className="h-full w-full" />
      </span>
    );
  }
  if (visualType === "demo") return <DemoTile className={className} rid={rid} />;
  if (visualType === "simulator") return <SimulatorTile className={className} rid={rid} />;
  if (visualType === "assessment") return <AssessmentTile className={className} rid={rid} />;
  return <BookTile className={className} rid={rid} />;
}

function TileFrame({ className, rid, bgFrom, bgTo, children }) {
  const bg = uid(rid, "bg");
  const shine = uid(rid, "shine");
  const shadow = uid(rid, "sh");
  return (
    <svg
      className={className}
      viewBox="0 0 88 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={bg} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={bgFrom} />
          <stop offset="100%" stopColor={bgTo} />
        </linearGradient>
        <radialGradient id={shine} cx="30%" cy="22%" r="70%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <SoftShadow id={shadow} dy={4} blur={2.8} />
      </defs>
      <rect x="2" y="2" width="84" height="84" rx="22" fill={`url(#${bg})`} />
      <rect x="2" y="2" width="84" height="84" rx="22" fill={`url(#${shine})`} />
      <rect x="2.75" y="2.75" width="82.5" height="82.5" rx="21.25" stroke="white" strokeOpacity="0.4" />
      <ellipse cx="44" cy="78" rx="26" ry="5" fill="#4C1D95" opacity="0.12" />
      <g filter={`url(#${shadow})`}>{children}</g>
    </svg>
  );
}

function BookTile({ className, rid }) {
  return (
    <TileFrame className={className} rid={rid} bgFrom="#EDE9FE" bgTo="#C4B5FD">
      <path d="M18 58 L28 62 L28 70 L18 66 Z" fill="#6D28D9" />
      <path d="M70 58 L60 62 L60 70 L70 66 Z" fill="#5B21B6" />
      <path
        d="M20 30 C34 22 42 22 44 28 L44 62 C36 56 28 56 20 62 Z"
        fill="#FFFFFF"
      />
      <path
        d="M68 30 C54 22 46 22 44 28 L44 62 C52 56 60 56 68 62 Z"
        fill="#EEF2FF"
      />
      <path d="M20 30 C34 22 42 22 44 28 C46 22 54 22 68 30 L66 32 C54 25 46 26 44 31 C42 26 34 25 22 32 Z" fill="#DDD6FE" />
      <path d="M44 28 L44 62" stroke="#A78BFA" strokeWidth="1.7" />
      <rect x="26" y="38" width="12" height="2.2" rx="1" fill="#8B5CF6" opacity="0.5" />
      <rect x="26" y="44" width="9" height="2.2" rx="1" fill="#8B5CF6" opacity="0.28" />
      <rect x="50" y="38" width="12" height="2.2" rx="1" fill="#06B6D4" opacity="0.5" />
      <rect x="50" y="44" width="9" height="2.2" rx="1" fill="#06B6D4" opacity="0.28" />
      <path d="M58 24 L62 48 L58 46 L54 48 Z" fill="#F472B6" />
      <MiniCube cx={61} cy={54} s={6} top="#A5F3FC" left="#0891B2" right="#0E7490" />
    </TileFrame>
  );
}

function DemoTile({ className, rid }) {
  return (
    <TileFrame className={className} rid={rid} bgFrom="#E0F2FE" bgTo="#7DD3FC">
      <path d="M18 28 L66 22 L70 54 L22 60 Z" fill="#1E1B4B" />
      <path d="M66 22 L72 26 L76 56 L70 54 Z" fill="#312E81" />
      <path d="M22 32 L64 26.5 L67.2 51 L25.4 56.2 Z" fill="#EEF2FF" />
      <MiniCube cx={34} cy={38} s={6} top="#C4B5FD" left="#7C3AED" right="#5B21B6" />
      <MiniCube cx={46} cy={36} s={6} top="#A5B4FC" left="#4F46E5" right="#3730A3" />
      <MiniCube cx={57} cy={34} s={5.5} top="#A5F3FC" left="#0891B2" right="#0E7490" />
      <path d="M38 44 H43" stroke="#8B5CF6" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M50 42 H54.5" stroke="#06B6D4" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="36" y="60" width="16" height="5" rx="2" fill="#4338CA" />
      <rect x="32" y="65" width="24" height="4" rx="2" fill="#312E81" />
      <circle cx="44" cy="58" r="9" fill="#4F46E5" />
      <circle cx="44" cy="58" r="9" fill="white" fillOpacity="0.12" />
      <path d="M41.4 53.6 50.2 58 41.4 62.4V53.6Z" fill="white" />
    </TileFrame>
  );
}

function SimulatorTile({ className, rid }) {
  return (
    <TileFrame className={className} rid={rid} bgFrom="#CFFAFE" bgTo="#67E8F9">
      <ellipse cx="44" cy="68" rx="28" ry="6" fill="#0E7490" opacity="0.16" />
      <MiniCube cx={22} cy={46} s={10} top="#C4B5FD" left="#7C3AED" right="#5B21B6" />
      <MiniCube cx={44} cy={32} s={11} top="#A5B4FC" left="#4F46E5" right="#3730A3" />
      <MiniCube cx={66} cy={46} s={10} top="#A5F3FC" left="#0891B2" right="#0E7490" />
      <path
        d="M31 48 C36 44 38 40 39 38"
        stroke="#4C1D95"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.45"
      />
      <path
        d="M54 38 C58 42 60 45 57 48"
        stroke="#0E7490"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />
      <circle cx="35" cy="43" r="2.4" fill="#F0ABFC" />
      <circle cx="55" cy="42" r="2.4" fill="#67E8F9" />
    </TileFrame>
  );
}

function AssessmentTile({ className, rid }) {
  return (
    <TileFrame className={className} rid={rid} bgFrom="#F5D0FE" bgTo="#C4B5FD">
      <path d="M28 24 L56 20 L62 58 L34 62 Z" fill="#EDE9FE" />
      <path d="M56 20 L62 24 L68 60 L62 58 Z" fill="#C4B5FD" />
      <rect x="26" y="18" width="32" height="44" rx="6" fill="white" />
      <rect x="26" y="18" width="32" height="44" rx="6" stroke="#C4B5FD" strokeWidth="1.2" />
      <rect x="34" y="14" width="16" height="10" rx="4" fill="#7C3AED" />
      <rect x="37" y="16.5" width="10" height="5" rx="2.5" fill="#A78BFA" />
      <rect x="32" y="32" width="20" height="2.4" rx="1.2" fill="#A78BFA" />
      <rect x="32" y="38" width="15" height="2.4" rx="1.2" fill="#DDD6FE" />
      <rect x="32" y="44" width="18" height="2.4" rx="1.2" fill="#A78BFA" />
      <circle cx="54" cy="58" r="12" fill="#4F46E5" />
      <circle cx="54" cy="58" r="12" fill="white" fillOpacity="0.12" />
      <path
        d="M48.6 58.2 52.2 61.6 60.2 52.8"
        stroke="white"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </TileFrame>
  );
}

const OUTCOME_BG = [
  ["#EDE9FE", "#C4B5FD"],
  ["#DBEAFE", "#93C5FD"],
  ["#CFFAFE", "#67E8F9"],
  ["#F3E8FF", "#D8B4FE"],
];

/**
 * Distinctive outcome mark for the contained What you'll learn row.
 */
export function LmOutcomeMark({ index = 0, className = "" }) {
  const rid = useId();
  const bg = uid(rid, "obg");
  const [from, to] = OUTCOME_BG[index] || OUTCOME_BG[0];
  return (
    <svg
      className={className}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={bg} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="42" height="42" rx="14" fill={`url(#${bg})`} />
      {index === 1 ? (
        <>
          <path
            d="M22 10.5 32 15v8.2c0 6.2-4.1 10.4-10 12.3-5.9-1.9-10-6.1-10-12.3V15l10-4.5Z"
            fill="#4F46E5"
          />
          <path d="M17.5 22.2 20.8 25.4 27.2 18.6" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </>
      ) : index === 2 ? (
        <>
          <circle cx="16.5" cy="22" r="7.5" fill="#7C3AED" />
          <rect x="22" y="16" width="12" height="12" rx="3" fill="#06B6D4" />
          <path d="M20 22h2.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
        </>
      ) : index === 3 ? (
        <>
          <circle cx="22" cy="22" r="10" fill="#6D28D9" />
          <path d="M22 14v16" stroke="white" strokeWidth="1.8" opacity="0.7" />
          <path d="M16 22h12" stroke="white" strokeWidth="1.8" opacity="0.35" />
          <circle cx="22" cy="16.5" r="2.2" fill="#67E8F9" />
          <circle cx="27.2" cy="24.5" r="2.2" fill="#C4B5FD" />
        </>
      ) : (
        <>
          <rect x="10" y="18" width="10" height="10" rx="2.5" fill="#7C3AED" />
          <rect x="22" y="16" width="10" height="10" rx="2.5" fill="#4F46E5" />
          <path d="M20 23h2" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

/**
 * Compact progress-stage glyph: learn / explore / assess / complete.
 * Color comes from currentColor so the rail can keep signed-out idle states muted.
 */
export function LmStageMark({ stage, className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="18" cy="18" r="16" fill="currentColor" />
      <circle cx="18" cy="13" r="10" fill="white" fillOpacity="0.16" />
      {stage === "explore" ? (
        <>
          <circle cx="18" cy="18" r="6.6" stroke="white" strokeWidth="2" />
          <circle cx="18" cy="18" r="2.5" fill="white" />
          <path d="M22.8 22.8 25.4 25.4" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
        </>
      ) : stage === "assess" ? (
        <>
          <rect x="12" y="10" width="12" height="16" rx="2.2" fill="white" />
          <rect x="15" y="8.5" width="6" height="4" rx="1.5" fill="white" opacity="0.85" />
          <rect x="14.5" y="16" width="7" height="1.5" rx="0.75" fill="currentColor" opacity="0.35" />
          <rect x="14.5" y="20" width="5.5" height="1.5" rx="0.75" fill="currentColor" opacity="0.25" />
        </>
      ) : stage === "complete" ? (
        <>
          <path
            d="M18 9.5v4.2M18 9.5c4.2 3.1 7.4 4.6 8.8 5.3-1 6.6-4.6 10-8.8 11.8-4.2-1.8-7.8-5.2-8.8-11.8C10.6 14.1 13.8 12.6 18 9.5Z"
            fill="white"
          />
          <path d="M15.6 18.2 17.8 20.3 21.6 16.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />
        </>
      ) : (
        <>
          <path d="M11 15c4.2-2.6 6.8-2.6 10.4 0v11.2c-3.6-2-6.2-2-10.4 0V15Z" fill="white" />
          <path d="M21.4 15c3.8-2.2 6.2-2 8.6 0v10.4c-2.6-1.6-4.8-1.8-8.6 0V15Z" fill="white" opacity="0.75" />
        </>
      )}
    </svg>
  );
}

/**
 * Explorer / Builder / Architect path markers.
 */
export function LmTierMark({ tier = "explorer", active = false, className = "" }) {
  const rid = useId();
  const bg = uid(rid, "tbg");
  const palettes = {
    explorer: ["#8B5CF6", "#6366F1"],
    builder: ["#2563EB", "#06B6D4"],
    architect: ["#0E7490", "#22D3EE"],
  };
  const [from, to] = palettes[tier] || palettes.explorer;
  return (
    <svg
      className={className}
      viewBox="0 0 52 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={bg} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <circle cx="26" cy="26" r="24" fill={`url(#${bg})`} opacity={active ? 1 : 0.4} />
      <circle cx="26" cy="18" r="14" fill="white" fillOpacity={active ? 0.16 : 0.08} />
      <circle
        cx="26"
        cy="26"
        r="23"
        stroke={`url(#${bg})`}
        strokeWidth="1.6"
        opacity={active ? 0 : 0.9}
      />
      {tier === "builder" ? (
        <>
          <circle cx="26" cy="26" r="8.5" stroke="white" strokeWidth="2.2" />
          <circle cx="26" cy="26" r="3.2" fill="white" />
          {[0, 45, 90, 135].map((deg) => (
            <rect
              key={deg}
              x="24.2"
              y="12.2"
              width="3.6"
              height="6.2"
              rx="1"
              fill="white"
              transform={`rotate(${deg} 26 26)`}
            />
          ))}
        </>
      ) : tier === "architect" ? (
        <>
          <path d="M14 36V25l12-10 12 10v11H14Z" fill="white" opacity="0.96" />
          <path d="M12.5 36h27" stroke="white" strokeWidth="2.1" strokeLinecap="round" />
          <rect x="18" y="28" width="3.2" height="8" rx="0.8" fill={active ? "#0E7490" : "#64748B"} />
          <rect x="24.4" y="27" width="3.2" height="9" rx="0.8" fill={active ? "#0E7490" : "#64748B"} />
          <rect x="30.8" y="28" width="3.2" height="8" rx="0.8" fill={active ? "#0E7490" : "#64748B"} />
        </>
      ) : (
        <>
          <path d="M26 11 28.2 21.2 38 22.2 30.4 28.6 32.8 38 26 32.6 19.2 38 21.6 28.6 14 22.2 23.8 21.2 Z" fill="white" />
          <circle cx="26" cy="26" r="3.2" fill={active ? "#4F46E5" : "#64748B"} />
        </>
      )}
    </svg>
  );
}

/** Small hero metadata marks — time / level / xp. */
export function LmHeroMetaMark({ kind = "time", className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="1" y="1" width="34" height="34" rx="11" fill="currentColor" fillOpacity="0.14" />
      {kind === "level" ? (
        <>
          <rect x="9" y="22" width="5" height="7" rx="1.4" fill="currentColor" opacity="0.45" />
          <rect x="16" y="17" width="5" height="12" rx="1.4" fill="currentColor" opacity="0.7" />
          <rect x="23" y="12" width="5" height="17" rx="1.4" fill="currentColor" />
        </>
      ) : kind === "xp" ? (
        <>
          <path d="M18 8.5 20.4 15.4 28 16.1 22.4 20.8 24.1 28 18 24.2 11.9 28 13.6 20.8 8 16.1 15.6 15.4 Z" fill="currentColor" />
        </>
      ) : (
        <>
          <circle cx="18" cy="19" r="9" stroke="currentColor" strokeWidth="2" />
          <path d="M18 13.5V19l4 2.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

/** Sidebar about-row marks. */
export function LmAboutMetaMark({ kind = "path", className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="1" y="1" width="26" height="26" rx="8" fill="currentColor" fillOpacity="0.14" />
      {kind === "type" ? (
        <rect x="8" y="8" width="12" height="12" rx="3" fill="currentColor" />
      ) : kind === "mix" ? (
        <>
          <rect x="7" y="16" width="5" height="5" rx="1.2" fill="currentColor" />
          <rect x="12" y="11" width="5" height="5" rx="1.2" fill="currentColor" opacity="0.75" />
          <rect x="17" y="8" width="5" height="5" rx="1.2" fill="currentColor" opacity="0.5" />
        </>
      ) : (
        <>
          <circle cx="14" cy="14" r="5.5" stroke="currentColor" strokeWidth="1.7" />
          <circle cx="14" cy="14" r="2" fill="currentColor" />
        </>
      )}
    </svg>
  );
}
