import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { loadMeta } from "./loadMeta.js";
import { recalc } from "./recalc.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// queue + meta file paths
const QUEUE_FILE = path.join(__dirname, "queue.jsonl");

let meta = loadMeta()


export const dequeue = () => {
    if (!fs.existsSync(QUEUE_FILE)) return null;

    const raw = fs.readFileSync(QUEUE_FILE, "utf8").trim();
    if (!raw) return null;

    let lines = raw
        .split("\n")
        .filter(Boolean)
        .map((line) => JSON.parse(line));

    for (let i = meta.readOffset; i < lines.length; i++) {
        let msg = lines[i];
        if (
            msg.status === "PENDING" ||
            (msg.status === "FAILED" && msg.tries < 10) // max tries 10
        ) {
            msg.status = "PROCESSING";
            msg.tries = (msg.tries || 0) + 1;
            lines[i] = msg;

            fs.writeFileSync(QUEUE_FILE, lines.map((l) => JSON.stringify(l)).join("\n") + "\n");
            recalc();
            return msg;
        }
    }
    return null;
};
 