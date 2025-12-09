import { sha256 } from "./hashers.js";

/**
 * Minimal Merkle tree offering membership proofs for commitment defences.
 */
export class MerkleTree {
    constructor() {
        this.leaves = [];
    }

    append(value) {
        this.leaves.push(value.toString());
    }

    root() {
        if (this.leaves.length === 0) return null;

        let current = this.leaves.map(x => sha256(x));

        while (current.length > 1) {
            const next = [];
            for (let i = 0; i < current.length; i += 2) {
                const left = current[i];
                const right = current[i + 1] || current[i];
                next.push(sha256(left + right));
            }
            current = next;
        }

        return current[0];
    }
}
