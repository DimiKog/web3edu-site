import { useContext } from "react";
import { ResolvedIdentityContext } from "../context/resolvedIdentityContext.js";

export function useResolvedIdentityContext() {
  const ctx = useContext(ResolvedIdentityContext);
  if (!ctx) {
    throw new Error(
      "useResolvedIdentityContext must be used within ResolvedIdentityProvider"
    );
  }
  return ctx;
}
