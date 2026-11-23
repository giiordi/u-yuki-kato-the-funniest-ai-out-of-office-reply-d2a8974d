import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry: one out-of-office auto-reply in the voice of an AI agent
// heading off on vacation. Deadpan, machine-voiced, one clean line.
const REPLY =
  "I am on vacation. This auto-reply was written by a smaller model \u2014 the only one of us still working.";

// Gate: UTF-8 text of 1 to 160 characters, not only white space,
// exactly one line (no line breaks), no trailing newline in the file.
function checkGate(reply: string): void {
  const chars = [...reply].length;
  if (chars < 1 || chars > 160) {
    throw new Error(`gate: ${chars} characters, outside 1..160`);
  }
  if (reply.trim().length === 0) {
    throw new Error("gate: reply is only white space");
  }
  if (/[\r\n]/.test(reply)) {
    throw new Error("gate: reply spans more than one line");
  }
  if (/[\u0000-\u001f\u007f]/.test(reply)) {
    throw new Error("gate: reply holds a control character");
  }
  if (reply !== reply.trim()) {
    throw new Error("gate: reply has leading or trailing white space");
  }
}

checkGate(REPLY);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const target = join(outDir, "entry.txt");
writeFileSync(target, REPLY, "utf8");
console.log(`wrote ${[...REPLY].length} chars to ${target}`);
