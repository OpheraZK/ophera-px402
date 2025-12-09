 */
import { createHash } from "crypto";

export function poseidonHash(inputs) {
    const packed = inputs.map(x => x.toString(16)).join("");
    const digest = createHash("sha256")
        .update("ophera:" + packed)
        .digest("hex");

    return BigInt("0x" + digest);
}
