pragma circom 2.0.0;

include "./hasher.circom";
include "./merkle.circom";
include "./nullifier.circom";

// Core px402 SNARK circuit validating a private withdrawal
template PrivateSpend(depth) {
    // Public
    signal input merkleRoot;
    signal input expectedNullifier;

    // Private
    signal input secret;
    signal input leaf;
    signal input index;
    signal input pathElements[depth];
    signal input pathIndex[depth];

    signal output isValid;

    // 1. Verify nullifier correctness
    component nf = Nullifier();
    nf.secret <== secret;
    nf.index  <== index;

    nf.nullifier === expectedNullifier;

    // 2. Verify Merkle proof
    component mp = MerklePath(depth);
    mp.leaf <== leaf;

    for (var i = 0; i < depth; i++) {
        mp.pathElements[i] <== pathElements[i];
        mp.pathIndex[i] <== pathIndex[i];
    }

    mp.root === merkleRoot;

    // 3. If constraints hold, spend is valid
    isValid <== 1;
}
