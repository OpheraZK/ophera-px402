/**
 * Off-chain relay layer simulating private submission
 * of px402 transactions to a coordinator.
 */

export class PX402Relay {
    constructor() {
        this.queue = [];
    }

    submit(payload) {
        const entry = {
            id: crypto.randomUUID(),
            received: Date.now(),
            payload
        };

        this.queue.push(entry);
        return entry.id;
    }

    list() {
        return this.queue.map(q => ({
            id: q.id,
            received: q.received,
            amount: q.payload.amount
        }));
    }
}
