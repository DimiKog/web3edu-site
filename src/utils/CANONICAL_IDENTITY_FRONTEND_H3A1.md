# Web3Edu H3A.1 — Return via linked wallet

Frontend wallet-entry / profile selection. Backend canonical identity is
already correct for this case. H3A.1 only **consumes**
`GET /web3edu/identity/resolve/<connectedEOA>`.

H2b educational-write input rules are unchanged except: when the backend
has already persisted `matchedBy = wallet_address`, writes send the
**connected EOA** (backend canonicalizes to the social AA). They never
send `progressAddress` and never let a leftover device AA override that EOA.

## Production acceptance case

Connected EOA: `0x0E66db7d115B8F392eB7DFb8BaCb23675dAEB59E`  
Canonical social AA / progressAddress: `0x3934c22b178B8CE693AB51d4D39e2A9AB9f2D2A5`  
Device AA (must not become the learner): `0x34F726148fe6d8Fab1DE0Aab755D39d4638E927c`

These addresses are fixtures/docs only — not hardcoded production logic.

## Why the device AA used to win

After OIDC logout, `Dashboard` and `ResolvedIdentityProvider` treated
`IdentityContext.smartAccount` (localStorage `web3edu-aa-identity`) as the
viewer identity whenever `isIdentityReady`. The connected wagmi EOA was
shown as “Connected Wallet” only. The backend already mapped that EOA to
the social AA; the frontend never asked.

## Wallet-entry priority (no OIDC)

1. Connected EOA exists → `GET /web3edu/identity/resolve/<EOA>`
2. `mode=social` and `matchedBy=wallet_address` → canonical `progressAddress`
3. `mode=wallet_only` → existing wallet-first (device AA if minted, else EOA)
4. unresolved / error → no inference (do not fall back to device AA)

OIDC authenticated SocialIdentity AA still wins and does **not** resolve
the connected EOA to override the signed-in learner.

## Device AA vs signer EOA vs canonical learner

| Surface | Role after H3A.1 |
|---------|------------------|
| Device / persisted AA | Execution / leftover wallet-only history. Not the learner when the EOA is a verified alias. |
| Connected EOA | Signer. Identity **input** for alias writes. |
| Canonical `progressAddress` | Backend social AA (read via `/web3sbt/resolve`). |

The device AA’s ~500 XP remains a separate wallet-only learner until a
future explicit H3E decision. H3A.1 does not merge, delete, or relink it.

## Authentication vs resolution

Resolving a linked EOA to a social learner is **not** a Keycloak session.
`isOidcAuthenticated` stays false. Link / relink / import / account
settings remain OIDC-gated.

## Privacy

Only privacy-safe H2 fields are used (`progressAddress`, `matchedBy`,
`mode`, `aaAddress`, `linkedWalletAddress`, `ownerAddress`). Email, sub,
and names are ignored. No `localStorage` EOA→AA map.

## Wallet-only fallback

Learners with no `SocialIdentity.wallet_address` stay wallet-only. No SBT,
AA, or social login is required. The 91-style population is not regressed.

## Future H3B

`LearnerWalletBinding` / EIP-712 linking is **not** implemented here. This
phase only reads the existing `wallet_address` relationship.
