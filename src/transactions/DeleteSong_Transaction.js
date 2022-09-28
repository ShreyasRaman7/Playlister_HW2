import jsTPS_Transaction from "../common/jsTPS.js"
/**
 * DeleteSong_Transaction
 * 
 * This class represents a transaction that works with drag
 * and drop. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
export default class DeleteSong_Transaction extends jsTPS_Transaction {
    constructor(initApp,songIndex, songObject) {
        super();
        this.app = initApp;
        this.songIndex = songIndex;
        this.songObject = songObject;
    }

    doTransaction() {
        this.app.deleteSong(this.songIndex);
    }
    
    undoTransaction() {
        this.app.undoDeleteSong(this.this.songIndex, this.songObject);
    }
}