import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {recalc} from "./recalc.js"
import { loadMeta } from "./loadMeta.js";
import { saveMeta } from "./saveMeta.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// queue + meta file paths
const QUEUE_FILE = path.join(__dirname, "queue.jsonl");

let meta = loadMeta();


export const updateStatus = async (id, status)=>{
    if (!fs.existsSync(QUEUE_FILE)) return null;

    let lines = fs
        .readFileSync(QUEUE_FILE, "utf8")
        .trim()
        .split("\n")
        .filter(Boolean)
        .map((l) => JSON.parse(l));

    lines = lines.map((msg) => {
        if (msg.id === id) {
            msg.status = status;
        }
        return msg;
    });

    fs.writeFileSync(
        QUEUE_FILE,
        lines.map((l) => JSON.stringify(l)).join("\n") + "\n"
    );

    if (status === "DONE") {
        if (meta.writeOffset === meta.readOffset) {
            // clear everythin adn reset counters
            fs.writeFileSync(QUEUE_FILE, "");
            meta.readOffset = 0;
            meta.writeOffset = 0;
            meta.totalMessages = 0;
            meta.pendingCount = 0;
            meta.processingCount = 0;
            meta.doneCount = 0;
            meta.failedCount = 0;
            saveMeta(meta);
            return;
        } else if (meta.writeOffset > meta.readOffset) meta.readOffset++;
    }
    recalc();
}