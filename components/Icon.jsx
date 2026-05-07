// Tiny inline icon set — no external deps. Stroke-based for crisp scaling.
const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function IconCart(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6" />
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
    </svg>
  );
}
export function IconSearch(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
export function IconClose(props) {
  return (
    <svg {...base} {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
export function IconMenu(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}
export function IconStar(props) {
  return (
    <svg {...base} {...props} fill="currentColor" stroke="none">
      <path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.3l-5.8 3.1 1.1-6.5L2.6 9.3l6.5-.9L12 2.5z" />
    </svg>
  );
}
export function IconLeaf(props) {
  return (
    <svg {...base} {...props}>
      <path d="M20 4c-9 0-15 5-15 13a5 5 0 0 0 5 5c8 0 13-6 13-15 0-1-.4-3-3-3z" />
      <path d="M5 22c4-7 9-11 15-13" />
    </svg>
  );
}
export function IconShield(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
export function IconTruck(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 7h11v9H3zM14 11h4l3 3v2h-7" />
      <circle cx="7" cy="18" r="1.5" />
      <circle cx="17" cy="18" r="1.5" />
    </svg>
  );
}
export function IconScissors(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="6" cy="7" r="2.5" />
      <circle cx="6" cy="17" r="2.5" />
      <path d="M8 9l12 9M8 15l12-9" />
    </svg>
  );
}
export function IconSnowflake(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 2v20M2 12h20M5 5l14 14M19 5 5 19" />
    </svg>
  );
}
export function IconChevronRight(props) {
  return (
    <svg {...base} {...props}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}
export function IconMinus(props) {
  return (<svg {...base} {...props}><path d="M5 12h14"/></svg>);
}
export function IconPlus(props) {
  return (<svg {...base} {...props}><path d="M12 5v14M5 12h14"/></svg>);
}
export function IconPin(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 22s7-7.6 7-13a7 7 0 1 0-14 0c0 5.4 7 13 7 13z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}
export function IconUser(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    </svg>
  );
}
export function IconHeart({ filled, ...props }) {
  return (
    <svg {...base} {...props} fill={filled ? "currentColor" : "none"}>
      <path d="M12 21s-7-4.5-9-9.4C1.5 7.7 4 4 7.5 4c2 0 3.5 1 4.5 2.5C13 5 14.5 4 16.5 4 20 4 22.5 7.7 21 11.6 19 16.5 12 21 12 21z" />
    </svg>
  );
}
export function IconRefresh(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 4v4h-4M21 12a9 9 0 0 1-15 6.7L3 16M3 20v-4h4" />
    </svg>
  );
}
