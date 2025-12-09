import crypto from "crypto";

/**
 * zkVM Execution Trace
 * - RISC-style registers (r0–r7)
 * - PC, memory hash, opcode
 * - Each step is committed into a Merkle trace
 */

export class ZkvmTrace {
    constructor() {
        this.steps = [];
    }

    addStep(step) {
        this.steps.push(step);
    }

    toBuffer() {
        return Buffer.concat(
            this.steps.map(s => Buffer.from(JSON.stringify(s)))
        );
    }
}


/**
 * RISC-like instruction set used by zkVM circuits.
 */
export const OPCODES = {
    ADD: 1,
    MUL: 2,
    XOR: 3,
    LOAD: 4,
    STORE: 5,
    JMP: 6,
    CJMP: 7
};


/**
 * Memory is represented by a sparse Merkle tree (key-value store).
 */
export class SparseMemory {
    constructor() {
        this.map = new Map();
    }
