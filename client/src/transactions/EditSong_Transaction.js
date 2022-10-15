import jsTPS_Transaction from "../common/jsTPS.js"

export default class EditSong_Transaction extends jsTPS_Transaction {
    constructor(store, index, oldSong, newSong) {
        super();
        this.store = store;
        this.index = index;
        this.oldSong = oldSong;
        this.newSong = newSong;
    }

    doTransaction() {
        this.store.editSong(this.index, this.newSong);
    }
    
    undoTransaction() {
        this.store.editSong(this.index, this.oldSong);
    }
}