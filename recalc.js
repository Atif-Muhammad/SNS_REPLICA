import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {loadMeta} from "./loadMeta.js"
import {saveMeta} from "./saveMeta.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// queue + meta file paths
const QUEUE_FILE = path.join(__dirname, "./queue.jsonl");

export const recalc = () => {
    let meta = loadMeta();

    const raw = fs.readFileSync(QUEUE_FILE, "utf8").trim();

    const lines = raw
        .split("\n")
        .filter(Boolean)
        .map((line) => JSON.parse(line));

    meta.totalMessages = lines.length;
    meta.pendingCount = 0;
    meta.processingCount = 0;
    meta.doneCount = 0;
    meta.failedCount = 0;

    lines.forEach((msg) => {
        if (msg.status === "PENDING") meta.pendingCount++;
        else if (msg.status === "PROCESSING") meta.processingCount++;
        else if (msg.status === "DONE") meta.doneCount++;
        else if (msg.status === "FAILED") meta.failedCount++;
    });

    saveMeta(meta);
};