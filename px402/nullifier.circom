pragma circom 2.0.0;

include "../circomlib/circuits/poseidon.circom";

// Generic Poseidon hash wrapper for commitments and Merkle operations
template Hash2() {
    signal input left;
    signal input right;
    signal output out;

    component h = Poseidon(2);

    h.inputs[0] <== left;
    h.inputs[1] <== right;

    out <== h.out;
}

// Commitment = Poseidon(secret || amount)
template Commitment() {
    signal input secret;
    signal input amount;
    signal output commitment;

    component h = Poseidon(2);
    h.inputs[0] <== secret;
    h.inputs[1] <== amount;

    commitment <== h.out;
}
