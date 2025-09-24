import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const META_FILE = path.join(__dirname, "queue.meta.json");


export const loadMeta = () => {
    if (!fs.existsSync(META_FILE)) {
        saveMeta(defaultMeta);
        return { ...defaultMeta };
    }
    return JSON.parse(fs.readFileSync(META_FILE, "utf8"));
};