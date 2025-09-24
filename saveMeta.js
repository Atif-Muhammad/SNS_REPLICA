import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const META_FILE = path.join(__dirname, "./queue.meta.json");

export const saveMeta = (meta) => {
    fs.writeFileSync(META_FILE, JSON.stringify(meta, null, 2));
};