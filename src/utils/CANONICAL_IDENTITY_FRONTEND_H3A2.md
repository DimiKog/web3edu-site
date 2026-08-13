# Web3Edu H3A.2 — Wallet-only educational write identity

H3A.1 fixed **read/view** resolution for return-via-linked-wallet.
H3A.2 fixes **educational writes** so a connected EOA is the identity
input whenever OIDC is absent.

## Why connected EOA wins for wallet-only writes

`getEducationalIdentityInput` (H2b / H3A.1) preferred device-local
`smartAccount` over the connected EOA in wallet-only sessions.

Observed production bug:

- Connected EOA `0xe63761BFE4599AAb4a7D4CFbb2229103199b3631` already had
  Lab 01–06 and DAO completions.
- Device AA `0x48312994109cd45f98b9b57cd96857e42f49d480` existed in
  `IdentityContext` / localStorage.
- Opening Lab 02 wrote `labs_started.lab02` to the **device AA** JSON.

The backend resolver is correct: that EOA is `wallet_only` with
`progressAddress =` the EOA. The frontend was sending the wrong input.

## Educational write priority (H3A.2)

1. OIDC + SocialIdentity AA → social AA (H2b unchanged)
2. OIDC pending / wallet-entry pending → defer (no device-AA flicker write)
3. No OIDC + connected EOA → **connected EOA**
4. No OIDC + no EOA + device AA → device AA (existing device-based fallback)

Backend `CanonicalLearnerResolver` then maps:

- linked `wallet_address` → social AA progress
- genuine wallet-only EOA → that EOA

The frontend does **not** post `progressAddress`.

## Device AA remains execution-only

Device / persisted AA stays available for transaction execution and AA
wallet UX. It is not deleted, migrated, or merged. It must not receive
new lab/project progress writes merely because it exists locally.

## Linked-wallet return

Connected linked EOA (e.g. `0x0E66…B59E`) is sent as educational input.
Backend canonicalizes to the social AA (`0x3934…D2A5`). The frontend
does not send the social AA while OIDC is absent.

## Signer vs progress identity

| Surface | Wallet-only + connected EOA |
|---------|-----------------------------|
| Signer | connected EOA |
| Educational identity input | connected EOA |
| Canonical `progressAddress` | backend (same EOA, or social AA if linked) |
| Device AA | execution artifact, not the learner |

`SIGNER ≠ CANONICAL LEARNER` and `DEVICE AA ≠ CANONICAL LEARNER`.

## Production data

Do not delete or merge the accidental device-AA `labs_started.lab02`
record. Cleanup is a separate decision after this code ships.
