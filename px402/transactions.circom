pragma circom 2.0.0;

include "./hasher.circom";
include "./proof.circom";

// Combined send/receive circuit for px402 payments
template Px402Transaction(depth) {

    // Public inputs
    signal input merkleRoot;
    signal input nullifier;

    // Private inputs
    signal input secret;
    signal input leaf;
    signal input index;
    signal input amount;

    signal input pathElements[depth];
    signal input pathIndex[depth];

    // Output commitment (new balance leaf)
    signal output newCommitment;

    // Validate spend
    component spend = PrivateSpend(depth);
    spend.merkleRoot <== merkleRoot;
    spend.expectedNullifier <== nullifier;
    spend.secret <== secret;
    spend.leaf <== leaf;
    spend.index <== index;

    for (var i = 0; i < depth; i++) {
        spend.pathElements[i] <== pathElements[i];
        spend.pathIndex[i] <== pathIndex[i];
    }

    // Compute new commitment (next balance)
    component c = Commitment();
    c.secret <== secret;
    c.amount <== amount;

    newCommitment <== c.commitment;
}
