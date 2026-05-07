# Account Abstraction on Besu (EduNet) — Full Trace

**Chain:** EduNet · Chain ID `424242`  
**RPC:** `https://rpc.dimikog.org/rpc/` (eRPC proxy → Besu at `http://127.0.0.1:8549/edunet/evm/424242`)  
**Bundler:** `https://faucet.dimikog.org/bundler/` (Alto, port 4337 on Faucet VM)

---

## Deployed Components

| Component | Address |
|-----------|---------|
| Canonical Create2 Factory (Nick's) | `0x4e59b44847b379578588920cA78FBf26c0B4956C` |
| Nick's Factory (custom / Alto deployer) | `0x8baEF87A759CDB7baad70a9f702D5C876a7B2Ba6` |
| EntryPoint v0.7 | `0x19C35D07ba63b5C7727d794BC34A0BE2836Cca0B` |
| SimpleAccountFactory | `0x4b81c4A880545191B84BC4c510Fb358F84B583a0` |
| SimpleAccount — 1st test | `0xda68eedad3d98215a87109461ec23102d144e67b` |
| Alto Bundler wallet (1st) | `0x122517d604B13C46146e82b648FC0B2abB06C97a` |

**2nd effort (7 April 2026):**

| Role | Address |
|------|---------|
| New EOA (owner) | `0xC034625CAd2fc3143C52E33d7A5fdbe864C3FfCb` |
| New SimpleAccount | `0x94133F09bF3e3a7053F67D8c7d93BaDA6AA3A92E` |
| New Bundler wallet | `0x681faFA375816772044CD21c6DdfbE6a99c34251` |

---

## Phase 1 — Infrastructure Prerequisites

Before any AA contract could land on Besu, two lower-level primitives had to be deployed first.

### 1.1 Canonical Create2 Factory (Nick's Deterministic Deployer)

**What it is:** A keyless, pre-EIP-155 contract at `0x4e59b44847b379578588920cA78FBf26c0B4956C` that lets anyone deploy any contract to a deterministic address using `CREATE2`. It is a prerequisite for deterministic EntryPoint deployment.

**How it was deployed:**
1. Fund the factory deployer EOA `0x3fab184622dc19b6109349b94811493bf2a45362` with exactly `0.01 ETH` (= `100000 gas × 100 Gwei`).
2. Broadcast the pre-signed raw factory transaction (no chain-ID field, works on any EVM):
   ```
   0xf8a58085174876e800830186a08080b853...
   ```
3. Verify code exists at `0x4e59b44847b379578588920cA78FBf26c0B4956C`.

This is implemented in `src/Create2Factory.ts → deployFactory()`.

> ⚠️ **Besu gotcha:** Besu rejects pre-EIP-155 transactions by default. You must start Besu with `--revert-reason-enabled --tx-pool-price-bump=0` **and**, critically, configure the genesis block with `"isQuorumCompatibilityMode": false` and set `"contractSizeLimit"` appropriately. If Besu has `--strict-tx-replay-protection-enabled` set, the keyless factory TX will be rejected. Check your genesis/config before assuming it worked.

### 1.2 Custom Deterministic Deployer (Nick's Factory — Alto variant)

**Address:** `0x8baEF87A759CDB7baad70a9f702D5C876a7B2Ba6`

Alto needs its own deterministic deployer address to deploy its internal `EntryPointSimulations` contract. This address is passed via `--deterministic-deployer-address` in `alto.service`. It was deployed (likely via the canonical factory in step 1.1, or via a direct deploy with a specific salt) before Alto was started.

---

## Phase 2 — Smart Contract Deployment

### 2.1 EntryPoint v0.7

**Repo:** `ethereum/account-abstraction` (ERC-4337 reference implementation)  
**Deploy script:** `deploy/1_deploy_entrypoint.ts`

```bash
MNEMONIC_FILE=~/.mnemonic \
yarn hardhat deploy --network <edunet> \
  --tags EntryPoint
```

The script uses `hardhat-deploy` with `deterministicDeployment: process.env.SALT`. The SALT used across the project is:
```
0x90d8084deab30c2a37c45e8d47f49f2f7965183cb6990a98943ef94940681de3
```

This SALT, combined with the EntryPoint bytecode and the canonical Create2 factory, deterministically produces the address `0x19C35D07ba63b5C7727d794BC34A0BE2836Cca0B`.

**Result:** EntryPoint is now live on EduNet. It handles:
- Nonce management for smart accounts
- Signature validation delegation to accounts
- Gas payment settlement
- `handleOps()` — the core bundler entry function

### 2.2 SimpleAccountFactory

**Deploy script:** `deploy/2_deploy_SimpleAccountFactory.ts`

By default this script only deploys on chainId `31337` or `1337` (local Hardhat). To force it on EduNet, you must pass the `--simple-account-factory` flag (checked via `process.argv`):

```bash
MNEMONIC_FILE=~/.mnemonic \
yarn hardhat deploy --network <edunet> \
  --tags SimpleAccountFactory \
  --simple-account-factory
```

The factory takes the EntryPoint address as constructor argument. It uses `CREATE2` internally (via `ERC1967Proxy`) to deploy individual `SimpleAccount` proxies at deterministic addresses, keyed by `(owner, salt)`.

**Result:** Factory at `0x4b81c4A880545191B84BC4c510Fb358F84B583a0`.

### 2.3 SimpleAccount — 1st Test Instance

A SimpleAccount is not deployed by calling the factory directly. It is either:
- **Counterfactually created:** The address is computed off-chain via `factory.createAccount(owner, salt)` using `CREATE2` math, and the account is only actually deployed when the first UserOperation is submitted (via `initCode` in the UserOp).
- **Pre-deployed:** The factory's `createAccount(owner, 0)` is called directly via a normal EOA transaction.

The 1st test account at `0xda68eedad3d98215a87109461ec23102d144e67b` was pre-deployed (no `initCode` is present in `test.mjs` for the 2nd effort account).

---

## Phase 3 — Alto Bundler Setup

Alto is the ERC-4337 bundler. It runs on the Faucet VM as a systemd service.

### 3.1 Installation

```bash
npm install -g @pimlico/alto
# verify:
alto --version
```

### 3.2 Environment File

`/etc/alto.env` contains:
```
BUNDLER_PRIVATE_KEY=0x<private_key_of_bundler_wallet>
```

The bundler wallet (`0x122517d604B13C46146e82b648FC0B2abB06C97a` for 1st effort, `0x681faFA375816772044CD21c6DdfbE6a99c34251` for 2nd) must hold ETH on EduNet to pay for the `handleOps()` transaction it submits on behalf of users.

### 3.3 Systemd Service (`alto.service`)

```ini
[Unit]
Description=Alto ERC-4337 Bundler
After=network.target erpc.service

[Service]
EnvironmentFile=/etc/alto.env
ExecStart=/usr/bin/alto run \
  --rpc-url http://127.0.0.1:8549/edunet/evm/424242 \
  --entrypoints 0x19C35D07ba63b5C7727d794BC34A0BE2836Cca0B \
  --executor-private-keys ${BUNDLER_PRIVATE_KEY} \
  --utility-private-key ${BUNDLER_PRIVATE_KEY} \
  --deterministic-deployer-address 0x8baEF87A759CDB7baad70a9f702D5C876a7B2Ba6 \
  --dangerous-skip-user-operation-validation true \
  --port 4337 \
  --legacy-transactions true \
  --block-time 5000 \
  --safe-mode false \
  --enable-debug-endpoints true \
  --refilling-wallets false \
  --utility-wallet-monitor false \
  --log-level info
Restart=always
RestartSec=5
```

**Key flags and why they matter:**

| Flag | Value | Reason |
|------|-------|--------|
| `--legacy-transactions true` | true | Besu/EduNet may not support EIP-1559 mempool; use legacy gas pricing |
| `--dangerous-skip-user-operation-validation` | true | Bypasses ERC-7562 storage/opcode access rules — **dev/test only, never production** |
| `--safe-mode false` | false | Disables additional safety checks that would reject ops in test scenarios |
| `--block-time 5000` | 5000ms | Tells Alto EduNet produces blocks every ~5 seconds |
| `--deterministic-deployer-address` | `0x8baE...` | Address of the custom factory used to deploy Alto's `EntryPointSimulations` internally |
| `--refilling-wallets false` | false | Alto won't try to auto-top-up the bundler wallet |

### 3.4 Service Activation

```bash
sudo cp alto.service /etc/systemd/system/alto.service
sudo systemctl daemon-reload
sudo systemctl enable alto
sudo systemctl start alto
# verify:
sudo systemctl status alto
sudo journalctl -u alto -n 40 --no-pager
```

Alto is exposed via a reverse proxy (nginx/erpc) at `https://faucet.dimikog.org/bundler/`.

### 3.5 Health Check (`check-alto.sh`)

```bash
bash check-alto.sh
```

This script verifies:
1. Systemd service is running
2. Recent journal logs show no fatal errors
3. `eth_supportedEntryPoints` returns `0x19C35D07ba63b5C7727d794BC34A0BE2836Cca0B`
4. The custom Nick's factory bytecode is present on-chain

---

## Phase 4 — Sending a UserOperation (2nd Effort, `test.mjs`)

This is the end-to-end proof of life. The flow in `test.mjs`:

### 4.1 Setup

```js
const RPC = 'https://rpc.dimikog.org/rpc/'
const BUNDLER = 'https://faucet.dimikog.org/bundler/'
const ENTRYPOINT = '0x19C35D07ba63b5C7727d794BC34A0BE2836Cca0B'
const ACCOUNT = '0x94133F09bF3e3a7053F67D8c7d93BaDA6AA3A92E'  // new SimpleAccount
const CHAIN_ID = 424242n
const owner = privateKeyToAccount(process.env.DEPLOYER_KEY)
// owner = 0xC034625CAd2fc3143C52E33d7A5fdbe864C3FfCb
```

### 4.2 Read Nonce from EntryPoint

```js
const nonce = await client.readContract({
  address: ENTRYPOINT,
  functionName: 'getNonce',
  args: [ACCOUNT, 0n]   // sender, key
})
```

The EntryPoint's nonce namespace is `(sender address, uint192 key)`. Key `0` is the default sequential nonce lane.

### 4.3 Build `callData`

A no-op call: `execute(address(0), 0, "")`. This proves the account can process a UserOp without reverting, without actually doing anything to state.

### 4.4 Compute `userOpHash` (ERC-4337 v0.7 packed format)

v0.7 uses a **packed** format that differs from v0.6. Key difference: `accountGasLimits` packs `verificationGasLimit` (hi 128 bits) and `callGasLimit` (lo 128 bits) into a single `bytes32`. Same for `gasFees` (maxPriority | maxFee).

```
userOpHash = keccak256(
  abi.encode(
    keccak256(innerPacked),
    entryPoint,
    chainId
  )
)
```

### 4.5 Sign

```js
const signature = await owner.signMessage({ message: { raw: userOpHash } })
```

`signMessage` with `{ raw: ... }` applies the Ethereum prefix (`\x19Ethereum Signed Message:\n32`) before signing. SimpleAccount's `_validateSignature` does the same prefix via `MessageHashUtils.toEthSignedMessageHash`, so the signatures match.

### 4.6 Submit to Bundler

```json
{
  "jsonrpc": "2.0",
  "method": "eth_sendUserOperation",
  "params": [
    {
      "sender": "0x94133F09bF3e3a7053F67D8c7d93BaDA6AA3A92E",
      "nonce": "0x0",
      "callData": "0x...",
      "callGasLimit": "0x186a0",
      "verificationGasLimit": "0x186a0",
      "preVerificationGas": "0xc350",
      "maxFeePerGas": "0x3e8",
      "maxPriorityFeePerGas": "0x3e8",
      "signature": "0x..."
    },
    "0x19C35D07ba63b5C7727d794BC34A0BE2836Cca0B"
  ]
}
```

Note: no `initCode` (account already deployed), no `paymaster` (account self-pays from its EntryPoint deposit).

### 4.7 Poll for Receipt (`receipt.mjs`)

```bash
DEPLOYER_KEY=0x... node receipt.mjs <userOpHash>
```

Calls `eth_getUserOperationReceipt` every 3 seconds (up to 20 attempts = 60 seconds). On success, returns the full receipt including the Ethereum transaction hash that bundled the UserOp.

---

## Phase 5 — What Follows (Next Steps)

These are the logical next steps given what you've built, in priority order:

### 5.1 Fund the SmartAccount's EntryPoint Deposit (Critical)

A SimpleAccount without a Paymaster **must** have a deposit in the EntryPoint to pay for gas. Without it, every UserOp fails with `AA21 didn't pay prefund`.

```bash
cast send 0x19C35D07ba63b5C7727d794BC34A0BE2836Cca0B \
  "depositTo(address)" \
  0x94133F09bF3e3a7053F67D8c7d93BaDA6AA3A92E \
  --value 0.01ether \
  --rpc-url https://rpc.dimikog.org/rpc/ \
  --private-key $DEPLOYER_KEY
```

Or fund it directly from the EOA by calling `addDeposit()` on the account itself.

### 5.2 Deploy a Paymaster (Remove Gas Friction for Users)

The current design requires every smart account to pre-fund itself — this defeats the UX goal of AA. A **VerifyingPaymaster** (already compiled at `out/VerifyingPaymaster.sol/`) would let you sponsor gas for users. Deploy it, fund it, and stake it in the EntryPoint.

### 5.3 Remove `--dangerous-skip-user-operation-validation`

This flag bypasses ERC-7562, which is the storage/opcode access rule that prevents DoS attacks against bundlers. In production:
- The simulation must pass ERC-7562 validation
- Alto's `EntryPointSimulations` contract handles this, but it requires the custom deployer to work correctly
- Test that `eth_estimateUserOperationGas` succeeds before sending — it runs full simulation

### 5.4 Replace `--legacy-transactions true` with EIP-1559

Check whether EduNet's Besu instance now supports EIP-1559 (`eth_feeHistory`). Legacy transactions are less efficient for gas estimation and don't support priority tips properly.

### 5.5 Wire Up Your DApp Frontend

Integrate ERC-4337 into your Web3 education dApp. Recommended stack:
- **permissionless.js** or **viem's AA extensions** (you're already using viem in `test.mjs`)
- Connect to your bundler at `https://faucet.dimikog.org/bundler/`
- Use `pimlico_getUserOperationGasPrice` to get correct gas values from Alto

### 5.6 Test Counterfactual Deployment

The 2nd effort's `NEW_SMART_ACCOUNT = 0x94133F09bF3e3a7053F67D8c7d93BaDA6AA3A92E` — confirm whether it was pre-deployed or counterfactual. If it was pre-deployed, the next test should prove the full AA flow including first-deploy via `initCode`. Add `initCode = factory.address + factory.createAccount.selector + abi.encode(owner, salt)` to the UserOp when the account doesn't yet exist.

---

## Critical Issues to Address

**1. `--dangerous-skip-user-operation-validation` is a DoS vector.**  
Anyone can submit a malformed or reverted UserOp and waste your bundler's gas. Never use this on a network with real value or where the bundler wallet is exposed.

**2. Gas values in `test.mjs` are very low.**  
`maxFeePerGas = 1000 wei` works only because EduNet's baseFee is 7 wei. On any mainnet fork or more active chain, these would fail. Implement `eth_estimateUserOperationGas` calls before submitting.

**3. The bundler private key is in `/etc/alto.env`.**  
Ensure this file has `chmod 600` and is owned by the service user. Key rotation if the key is ever exposed is critical because the bundler wallet holds ETH.

**4. Hardhat config has no EduNet network entry.**  
The `hardhat.config.ts` only defines `dev`, `localgeth`, `goerli`, `sepolia`, `proxy`. The EduNet deploy was either done via a temporary `--network` override, or the config was modified locally and not committed. Document the actual network config used.

---

## ERC-4337 UserOperation Lifecycle (Reference)

```
EOA (owner)
  │
  ├── signs UserOpHash
  │
  └──▶ Bundler (Alto)
          │
          ├── validates UserOp off-chain (simulation via EntryPointSimulations)
          │
          └──▶ EntryPoint.handleOps([userOp], beneficiary)
                  │
                  ├── SenderCreator.createSender() if initCode present
                  │     └── SimpleAccountFactory.createAccount(owner, salt)
                  │           └── CREATE2 → deploys SimpleAccount proxy
                  │
                  ├── account.validateUserOp(userOp, hash, missingFunds)
                  │     └── ECDSA.recover(hash, signature) == owner ✓
                  │
                  ├── pays prefund from account deposit
                  │
                  ├── account.execute(to, value, data)   ← actual action
                  │
                  └── emits UserOperationEvent(userOpHash, sender, ...)
                        └── receipt.mjs polls for this
```
