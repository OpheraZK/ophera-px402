import { toHex, randomNonce } from "../src/utils.js";
import { opheraHash } from "../src/ophera.js";

/**
 * Minimal wallet container for generating private px402 commitments.
 */
export class PX402Wallet {
    constructor(secretKey) {
        this.sk = secretKey;
        this.notes = [];
    }

    createNote(amount) {
        const nonce = randomNonce();
        const commitment = opheraHash([amount, this.sk, nonce]);

        const note = {
            amount,
            nonce,
            commitment,
            created: Date.now()
        };

        this.notes.push(note);
        return note;
    }

    exportCommitments() {
        return this.notes.map(n => toHex(n.commitment));
    }
}
