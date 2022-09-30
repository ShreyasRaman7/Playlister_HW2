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
    constructor(initApp,songIndex1, songObject) {
        super();
        this.app = initApp;
        this.songIndex = songIndex1;
        this.deletedSong = songObject;
    }

    doTransaction() {
        this.app.deleteSong(this.songIndex);
    }
    
    undoTransaction() {
        this.app.addSong(this.songIndex, this.songObject);
    }
}