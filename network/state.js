/**
 * Tracks latest commitments and processed px402 transactions.
 */

export class PX402State {
    constructor() {
        this.commitments = new Set();
        this.history = [];
    }

    registerCommitment(commitment) {
        this.commitments.add(commitment.toString());
    }

    finalize(txPayload) {
        this.history.push({
            timestamp: Date.now(),
            amount: txPayload.amount,
            recipient: txPayload.recipient,
            commitment: txPayload.commitment
        });
    }

    getCommitments() {
        return Array.from(this.commitments);
    }
}
