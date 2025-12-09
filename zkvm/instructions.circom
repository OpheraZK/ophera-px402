pragma circom 2.0.0;

include "../circomlib/circuits/bitify.circom";

// ADD — field addition
template InstrAdd() {
    signal input a;
    signal input b;
    signal output out;
    out <== a + b;
}

// MUL — field multiplication
template InstrMul() {
    signal input a;
    signal input b;
    signal output out;
    out <== a * b;
}

// XOR — bitwise XOR (requires binary decomposition)
template InstrXor(nBits) {
    signal input a;
    signal input b;
    signal output out;

    component aBits = Num2Bits(nBits);
    component bBits = Num2Bits(nBits);

    aBits.in <== a;
    bBits.in <== b;

    signal r[nBits];

    for (var i = 0; i < nBits; i++) {
        // XOR truth table: a + b - 2ab
        r[i] <== aBits.out[i] + bBits.out[i] - 2 * aBits.out[i] * bBits.out[i];
    }

    // Pack result back into field
    var base = 1;
    signal acc = 0;

    for (var i = 0; i < nBits; i++) {
        acc <== acc + r[i] * base;
        base = base * 2;
    }

    out <== acc;
}

// SHL — shift-left by k bits = multiply by 2^k
template InstrShl(k) {
    signal input a;
    signal output out;

    out <== a * (1 << k);
}

// SHR — shift-right by k bits = floor(a / 2^k)
template InstrShr(k) {
    signal input a;
    signal output out;

    // Not pure division — ZK-friendly via decomposition
    component bits = Num2Bits(64);
    bits.in <== a;

    signal acc = 0;
    var base = 1;

    for (var i = k; i < 64; i++) {
        acc <== acc + bits.out[i] * base;
        base = base * 2;
    }

    out <== acc;
}

// CMP — equality check
template InstrCmp() {
    signal input a;
    signal input b;
    signal output out;

    // 1 if equal, else 0
    out <== 1 - (a - b) * (a - b);
}
