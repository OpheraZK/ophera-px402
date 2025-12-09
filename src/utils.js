/**
 * Utility helpers used across the PX402 stack.
 */

export function toBigInt(value) {
    if (typeof value === "bigint") return value;
    if (typeof value === "number") return BigInt(value);
    if (typeof value === "string") return BigInt(value);
    throw new TypeError("Cannot convert to bigint");
}

export function hexlify(value) {
    return "0x" + value.toString(16);
}
