# File-Based Task Queue System

A lightweight **file-based task queue** implemented in Node.js using JSON Lines (`.jsonl`) for persistence.  
This system supports enqueueing, dequeueing, updating task status, and maintaining metadata for tracking queue state.

---

## Features

- **Enqueue tasks** with unique IDs and metadata.  
- **Dequeue tasks** in order with retry handling.  
- **Update task status** (`PENDING`, `PROCESSING`, `DONE`, `FAILED`).  
- **Retry mechanism** with configurable max attempts (default: 10).  
- **Persistent storage** using `queue.jsonl` for tasks and `queue.meta.json` for metadata.  
- **Automatic recalculation** of queue stats (pending, processing, done, failed).  

---

## Project Structure
```text
.
├── enqueue.js # Add new tasks
├── dequeue.js # Retrieve and process tasks
├── updateStatus.js # Update status of tasks
├── loadMeta.js # Load metadata
├── saveMeta.js # Save metadata
├── recalc.js # Recalculate queue statistics
├── queue.jsonl # Persistent task store (JSON Lines format)
├── queue.meta.json # Metadata (offsets, counts)
└── README.md
```

---

## Installation

1. Clone this repository:
```bash
git clone https://github.com/Atif-Muhammad/SNS_REPLICA.git
cd <your-repo>
```

2. Install dependencies:
```bash
npm install
```

3. Run the example usage:
```bash
node index.js
```

---

## Usage

### Enqueue a Task
```bash
import { enqueue } from "./enqueue.js";

enqueue({
    id: "unique-task-id",
    title: "Example Task",
    description: "This is a task",
    status: "PENDING",
    tries: 0
});
```

---

### Dequeue a Task

```bash
import { dequeue } from "./dequeue.js";

let task = dequeue();
console.log("Dequeued:", task);
```

---

### Update Task Status
```bash
import { updateStatus } from "./updateStatus.js";

// Mark task as DONE
updateStatus("unique-task-id", "DONE");
```

---

## Task Status Flow

- **PENDING** → default state when enqueued.  
- **PROCESSING** → when dequeued for execution.  
- **DONE** → completed successfully.  
- **FAILED** → failed execution; retried up to 10 times.  

---

## Data Files

- **queue.jsonl** → stores tasks in JSON Lines format:  
```bash
    {"id":"task-1","title":"Task 1","description":"Description","status":"DONE","tries":1}
    {"id":"task-2","title":"Task 2","description":"Description","status":"PENDING","tries":0}
```

- **queue.meta.json** → tracks metadata:  
```bash
{
    "readOffset": 0,
    "writeOffset": 41,
    "totalMessages": 41,
    "pendingCount": 0,
    "processingCount": 0,
    "doneCount": 41,
    "failedCount": 0
}
```

---

## Example End-to-End Flow
```bash
import { enqueue } from "./enqueue.js";
import { dequeue } from "./dequeue.js";
import { updateStatus } from "./updateStatus.js";

// Create tasks
enqueue({ id: "task-1", title: "Task 1", description: "Desc", status: "PENDING", tries: 0 });
enqueue({ id: "task-2", title: "Task 2", description: "Desc", status: "PENDING", tries: 0 });

// Dequeue next task
let task = dequeue();
console.log("Dequeued:", task);

// Update status after processing
updateStatus(task?.id, "DONE");
```

---

## Notes
- `queue.jsonl` stores tasks line by line. Each operation rewrites the file with updated task states, ensuring persistence across runs.
- If a task fails, it is retried up to **10 times** before being marked permanently **FAILED**.  
- Metadata is recalculated automatically after every operation.  

---

## License

MIT License. Free to use and modify.