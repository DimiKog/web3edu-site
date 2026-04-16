export const LANG_EN = "en";
export const LANG_GR = "gr";

export function getLangFromPathname(pathname) {
  const path = typeof pathname === "string" ? pathname : "";
  if (path === "/gr" || path.includes("-gr")) return LANG_GR;
  return LANG_EN;
}

export function isGreekPathname(pathname) {
  return getLangFromPathname(pathname) === LANG_GR;
}

