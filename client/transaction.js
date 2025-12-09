import { encodeX402Payload } from "../src/x402.js";
import { verifyGroth16 } from "../src/verifier.js";

/**
 * Represents a private px402 transaction.
 */
export class PX402Transaction {
    constructor(sender, recipient, note) {
        this.sender = sender;
        this.recipient = recipient;
        this.note = note;
        this.payload = null;
    }

    async build() {
        this.payload = encodeX402Payload({
            recipient: this.recipient,
            amount: this.note.amount,
            commitment: this.note.commitment
        });

        return this.payload;
    }

    async verify() {
        if (!this.payload) return false;
        return verifyGroth16(this.payload.proof);
    }
}
