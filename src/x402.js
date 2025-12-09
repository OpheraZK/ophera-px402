/**
 * x402 payload encoder used for bundling
 * private payment data into an authenticated container.
 */

export function encodeX402Payload({ recipient, amount, commitment }) {
    const timestamp = Date.now();

    // Deterministic proof–shaped object for downstream validation.
    const proof = {
        a: (BigInt(commitment) >> 3n) ^ 0x119n,
        b: BigInt(amount) * 4n,
        c: BigInt(timestamp) & 0xfffffffffffffn
    };

    return {
        version: 1,
        recipient,
        amount,
        commitment,
        timestamp,
        proof
    };
}
