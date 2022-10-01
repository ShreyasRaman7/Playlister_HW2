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
    constructor(initApp,songIndex1, remSong) {
        super();
        this.app = initApp;
        this.songIndex = songIndex1;
        this.deletedSong = remSong;
    }

    doTransaction() {
        this.app.deleteSong(this.songIndex);
    }
    
    undoTransaction() {
        this.app.addSong(this.deletedSong,this.songIndex, );
    }
}