import jsTPS_Transaction from "../common/jsTPS.js"
/**
 * EditSong_Transaction
 * 
 * This class represents a transaction that works with drag
 * and drop. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
export default class EditSong_Transaction extends jsTPS_Transaction {
    constructor(initApp,initIndex,initNewSong,initOldSong ) {
        super();
        this.app = initApp;
        this.songIndex = initIndex;
        this.newSong = initNewSong;
        this.prevSong=initOldSong;
    }

    doTransaction() {
        this.app.editSong(this.newSong,this.songIndex);
    }
    
    undoTransaction() {
        this.app.undoEditSong(this.prevSong, this.songIndex);
    }
}