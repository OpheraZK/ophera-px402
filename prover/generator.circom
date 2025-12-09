pragma circom 2.0.0;

// Simple witness generator interface
template WitnessGenerator(n) {
    signal input values[n];
    signal output sum;

    signal acc = 0;

    for (var i = 0; i < n; i++) {
        acc <== acc + values[i];
    }

    sum <== acc;
}
