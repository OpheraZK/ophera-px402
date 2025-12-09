# zkVM Opcodes

| Opcode | Mnemonic | Description                                   |
|--------|----------|-----------------------------------------------|
|   0    | ADD      | Adds two field elements                       |
|   1    | MUL      | Multiplies two field elements                  |
|   2    | XOR      | Bitwise XOR (ZK-friendly via binary expansion) |
|   3    | SHL      | Shift-left (multiply by 2^n)                  |
|   4    | SHR      | Shift-right (integer division by 2^n)         |
|   5    | CMP      | Returns 1 if A == B else 0                    |
|   6    | MOV      | Memory move                                   |

Opcodes are intentionally small to reduce SNARK constraints, but expressive
enough for private payment scripts and conditional routing.
