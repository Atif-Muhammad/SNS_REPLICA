import {enqueue} from "./enqueue.js"
import {dequeue} from "./dequeue.js"
import {updateStatus} from "./updateStatus.js"

// status => PENDING | PROCESSING | DONE | FAILED
// id => uniquely identify the msg
// title => string message's title
// description => string message
// tries => number of attempts made for the task



// Example usage
const messages = [
    {
        id: crypto.randomUUID(),
        title: "Task 1",
        description: "task 1 description",
        status: "PENDING",
        tries: 0,
    },
    {
        id: crypto.randomUUID(),
        title: "Task 2",
        description: "task 2 description",
        status: "PENDING",
        tries: 0,
    },
    {
        id: crypto.randomUUID(),
        title: "Task 3",
        description: "task 3 description",
        status: "PENDING",
        tries: 0,
    },
    {
        id: crypto.randomUUID(),
        title: "Task 4",
        description: "task 4 description",
        status: "PENDING",
        tries: 0,
    },
];

// for (const element of messages) {
//   enqueue(element);
// }
// enqueue({"id":"9cf30cdd-a6ae-4b05-9ca5-263cd5f9698c","title":"Task 1","description":"task 1 description","status":"PENDING","tries":0});

let task = dequeue();
console.log("Dequeued:", task);

updateStatus(task?.id, "DONE");
