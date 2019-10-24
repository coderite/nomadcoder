"use strict";

/*
    LIFO stack data structure
 */
class Stack {
    constructor(...items) {
        this.stack = [...items];
    }

    push(...items) {
        return this.stack.push(...items);
    }

    pop() {
        if(this.isEmpty()) {
            return null;
        } else {
            return this.stack.pop();
        }
    }

    peek() {
        return this.stack[this.stack.length - 1];
    }

    reverse() {
        let reversed = [];
        while(this.stack.length > 0) {
            reversed.push(this.stack.pop());
        }
        this.stack = reversed;
    }

    size() {
        return this.stack.length;
    }

    has(item) {
        for(const element of this.stack) {
            if(element === item) {
                return true;
            }
        }
    }

    isEmpty() {
        return (this.stack.length < 1);
    }

    printStack() {
        return `${this.stack.join(', ')}`;
    }
}


/*
    FIFO - first in first out
 */
class Queue {
    constructor(...items) {
        this.queue = [...items];
    }

    enqueue(...items) {
        return this.queue.unshift(...items);
    }

    dequeue() {
        return this.queue.pop();
    }
}

/*
let q = new Queue('lucas', 'saskia', 'filly');
console.log(q);
q.enqueue('john');
console.log(q);
q.dequeue();
console.log(q);
*/

let st = new Stack('lucas', 'saskia', 'vas', 'audrey');

console.log(st.peek());
console.log(st.printStack());
