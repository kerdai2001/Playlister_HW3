import jsTPS_Transaction from "../common/jsTPS.js"

export default class MoveSong_Transaction extends jsTPS_Transaction {
    constructor(store, start, end) {
        super();
        this.store = store;
        this.start = start;
        this.end = end;
    }

    doTransaction() {
        this.store.moveSong(this.start, this.end);
    }
    
    undoTransaction() {
        this.store.moveSong(this.end, this.start);
    }
}