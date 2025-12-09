export function serializeWitness(witness) {
    const buf = [];
    for (const x of witness) {
        buf.push(BigInt(x).toString());
    }
    return JSON.stringify({ witness: buf }, null, 2);
}

export function deserializeWitness(json) {
    const parsed = JSON.parse(json);
    return parsed.witness.map(BigInt);
}
