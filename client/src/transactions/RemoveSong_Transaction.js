import jsTPS_Transaction from "../common/jsTPS.js"

export default class RemoveSong_Transaction extends jsTPS_Transaction {
    constructor(store, index, song) {
        super();
        this.store = store;
        this.index = index;
        this.song = song;
    }

    doTransaction() {
        this.store.removeSong(this.index);
    }
    
    undoTransaction() {
        this.store.addSong(this.index, this.song);
    }
}