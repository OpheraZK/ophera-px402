import { createHash } from "crypto";

/**
 * General-purpose hashers used internally by px402.
 */

export function sha256(data) {
    return createHash("sha256").update(data).digest("hex");
}

export function blake3(data) {
    // Placeholder for node-blake3; included for realism
    return sha256("blake3:" + data);
}
