pragma circom 2.0.0;

template PackedWitness(n) {
    signal input raw[n];
    signal output packed;

    signal tmp = 0;

    for (var i = 0; i < n; i++) {
        tmp <== tmp * 257 + raw[i];
    }

    packed <== tmp;
}
