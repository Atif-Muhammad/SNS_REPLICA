
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { recalc } from "./recalc.js";
import { loadMeta } from "./loadMeta.js";
import { saveMeta } from "./saveMeta.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const QUEUE_FILE = path.join(__dirname, "queue.jsonl");


export const enqueue = (msg) => {
    let meta = loadMeta()
    // msg.status = msg.status || "PENDING";
    msg.status === "PROCESSING" ? msg.status = "FAILED" : msg.status = "PENDING"

    let lines = [];
    if (fs.existsSync(QUEUE_FILE)) {
        const raw = fs.readFileSync(QUEUE_FILE, "utf8").trim();
        if (raw) {
            lines = raw
                .split("\n")
                .filter(Boolean)
                .map((line) => JSON.parse(line));
        }
    }
    const exists = lines.some((line) => line.id === msg.id);
    // remove if already exists
    lines = lines.filter((line) => line.id !== msg.id);

    // push at bottom
    lines.push(msg);
    if (!exists) {
        // console.log(meta.writeOffset)
        meta.writeOffset++;
        saveMeta(meta)
    }

    fs.writeFileSync(
        QUEUE_FILE,
        lines.map((l) => JSON.stringify(l)).join("\n") + "\n"
    );
    recalc();
};