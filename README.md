<div align="center">

# **Ophera ZK**

</div>

<img width="1500" height="500" alt="image" src="https://github.com/user-attachments/assets/efc9de6c-434b-48aa-b180-bd0550f04b2f" />

### The privacy layer powering the next generation of AI agents.  
### Building px402 — the private engine for x402 payments.

Ophera ZK is a production-grade zero-knowledge privacy protocol for Solana, enabling fully private deposits, withdrawals, and AI-agent-driven payments using Groth16 zkSNARKs, BN254 verification, and Poseidon-based Merkle commitments.

This protocol brings confidential financial operations to Solana with cryptographic guarantees — not trust assumptions.

---

# Security Model

### 1. Zero-Knowledge Proof Layer

Groth16 zkSNARK verification on-chain (BN254 curve). Proofs reveal **nothing** about:

- Input amounts  
- Balances  
- Owners  
- Output commitments  
- Transaction graph  

Nullifiers ensure every note is spent exactly once.

---

### 2. Cryptographic Primitives

- **Ophera Hash** — SNARK-optimized Merkle hashing  
- **Sparse Merkle Tree (2^26 depth)** → ~67M leaves  
- **BN254 pairing ops** for zkSNARK verification  
- **Encrypted ciphertext** for note recovery  

---

# Relayer Fee Model

The relayer operator earns compensation for:

- zkSNARK verification  
- Note decryption and transaction build  
- Gas + routing overhead  

**Base Fee:** 0.15% + 0.005 SOL  
**Fee Cap:** 5%  

**Fee Formula:**

```rust
relayer_fee = min((amount * FEE_BPS / 10_000) + GAS_BUFFER, MAX_FEE);
```

---

# On-Chain Security Invariants

### 1. Double-Spend Prevention

```rust
// Nullifier may only be used ONCE
NullifierFlag PDA at [b"null", nullifier]

// Reuse triggers:
ErrorCode::NullifierAlreadyUsed
```

---

### 2. Pool Accounting

```rust
// Critical invariant — pool must settle withdrawals safely
require!(total_deposited >= total_withdrawn, PoolInvariantViolation);

// Ensure pool covers payout
require!(pool.lamports() >= payout, InsufficientPoolFunds);
```

---

### 3. Merkle Root Validity

- Rolling buffer of last 1000 Merkle roots  
- Blocks expired-proof replay attacks  
- Provides flexible proving window  

```rust
require!(merkle_history.contains(proof.root), InvalidMerkleRoot);
```

---

### 4. Amount Conservation

```rust
// Ensures no value is created or destroyed
Σ(inBalances) + extAmountIn == Σ(outAmounts) + publicAmount
```

---

### 5. Range Checks

```rust
// Validate balances as 64-bit unsigned integers
RangeCheckAmount(64);

// Prevent overflow / negative values
```

---

### 6. Nullifier Binding

```rust
// Nullifier derived deterministically from secret + nonce
nullifier = Poseidon(receiverViewPriv, inSpendNonce[i]);

// Cannot forge without knowing the secret
```

---

# Attack Mitigations

| Attack Vector | Mitigation |
|--------------|------------|
| Double-spending | Nullifier flags (permanent markers) |
| Merkle proof forgery | Groth16 verification + root history |
| Amount overflow | Range checks inside circuit |
| Pool drainage | Strict accounting invariants |
| Replay attacks | Two-phase withdraw with nonce PDAs |
| MEV / frontrunning | PreparedTx PDA locks amounts |
| Proof malleability | Public inputs bound to tx context |
| TOCTOU | Pool balance verified before transfers |
| Compressed memo exploits | Strict index ordering |
| Unauthorized relayer | Whitelist enforcement |

---

# Architecture

### Circuit Generation with circom-chan

```bash
git clone https://github.com/Monero-Chan-Foundation/circom-chan.git
cd circom-chan

# Generate Groth16 proving/verifying keys
./groth16_beast.sh
```

**Outputs:**

- `ophera_main.circom`  
- `ophera_main.wasm`  
- `priw_final.zkey`  
- `priw_vk.json`  

---

# Program Structure

```
programs/px402/src/
├── lib.rs              # Entry point
├── vk.rs               # Verifying key loader
├── instructions/
│   ├── init.rs
│   ├── deposit.rs
│   ├── withdraw.rs
│   ├── explosive.rs
│   ├── fetch.rs
│   ├── emergency.rs
│   └── cleanup.rs
├── utils/
│   ├── state.rs        # Account states
│   ├── merkle.rs       # Sparse Merkle operations
│   ├── verification.rs # Groth16 verification
│   ├── crypto.rs       # BN254 scalar arithmetic
│   ├── constants.rs    # Program constants
│   ├── errors.rs       # Error codes
│   └── utils.rs        # Helpers
```

---

# Circuit Structure

```
circom-chan/circuits/
├── ophera_main.circom   # Join-split zk circuit
├── merkle.circom          # Merkle path verification
└── utils.circom           # Packing, range checks
```

### Circuit Parameters

- **nIns = 6** — Max input notes  
- **nOuts = 6** — Max output notes  
- **depth = 26** — Merkle tree depth  

### Public Signals (19 total)

1. `merkleRoot`  
2. `inputNullifier[6]`  
3. `destLimbs[4]`  
4. `outputCommitment[6]`  
5. `publicAmount`  
6. `extAmountIn`  

---

# State Accounts

### GlobalState

```rust
pub struct GlobalState {
    pub admin: Pubkey,           // Authority
    pub merkle_root: [u8; 32],   // Current root
    pub note_count: u64,         // Global commitments counter
    pub total_deposited: u64,
    pub total_withdrawn: u64,
}
```

---
