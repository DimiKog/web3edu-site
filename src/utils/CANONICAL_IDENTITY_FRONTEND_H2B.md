# Web3Edu H2b — Frontend Canonical Identity Hardening

Frontend is **not** the canonical learner resolver. Backend
`GET /web3edu/identity/resolve/<address>` and educational write endpoints
remain authoritative for `progressAddress`, SocialIdentity, and credentials.

H2b only chooses a safe **identity input** to send to those endpoints.

## Educational identity input

`getEducationalIdentityInput` (used by lab start, auto-start, completion,
coding verify) selects:

1. Authenticated SocialIdentity AA, when present
2. Else, if OIDC is authenticated but AA is not yet known: wait, or send a
   social relationship address (owner / linked wallet / connected EOA) —
   **never** a device-local smart account
3. Else wallet-first: device-local minted AA, then connected self-custodial EOA

It does **not** infer relationships, bind credentials, select SBT contracts,
or compute `progressAddress`.

## Signer vs learner identity vs progress

| Concept | Who | Example (social-first) |
|---------|-----|------------------------|
| Signer | Wallet that signs a claim / tx | Linked or connected EOA (MetaMask today; BesuWallet later) |
| Identity input | Address sent as `wallet` | Authoritative SocialIdentity AA |
| Canonical progress | Backend | Same AA (`progressAddress`) |

A linked EOA may sign. It does not become progress identity.

## Social-first

Social login → authoritative Web3Edu AA → optional linked self-custodial wallet.

Device-local `IdentityContext.smartAccount` (localStorage `web3edu-aa-identity`
and/or AA restore) is a **transaction / session surface**. It must not override
the SocialIdentity AA on educational writes.

## Wallet-first

Connected self-custodial EOA (or minted device AA) is a valid identity input.
Social login, AA, and SBT are not required. Backend maps the address.

## Device-local smartAccount

Comes from persisted AA identity (`web3edu-aa-identity`), IdentityContext, and
optional AA restore — not from wagmi `address`. Valid for execution. Not
canonical when an authenticated SocialIdentity AA exists.

## H2 resolve endpoint

Not called on educational writes. Frontend supplies identity input; existing
lab/project/PoE endpoints canonicalize. Calling resolve then extracting
`progressAddress` would make the frontend a resolver again.

## BesuWallet

Later: another self-custodial wallet provider. Identity-input code is not
MetaMask-specific. Provider choice does not define the learner.

## Out of scope

Wallet-first → social linking, onboarding changes, backend identity semantics,
ProfileAnchor, SBT, progress data.
