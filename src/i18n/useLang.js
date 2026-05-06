import { useLocation } from "react-router-dom";
import { getLangFromPathname } from "../utils/lang.js";

export function useLang() {
  const { pathname } = useLocation();
  return getLangFromPathname(pathname);
}
