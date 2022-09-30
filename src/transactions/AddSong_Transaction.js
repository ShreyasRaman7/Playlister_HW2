import jsTPS_Transaction from "../common/jsTPS.js"

/**
 * CreateSong_Transaction
 * 
 * This class represents a transaction that creates a song
 * in the playlist. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
export default class CreateSong_Transaction extends jsTPS_Transaction {
    constructor(initApp, initIndex, initSong) {
        super();
        this.app = initApp;
        this.index = initIndex;
        this.newSong = initSong;
    }

    doTransaction() {
        this.app.addSong(this.newSong, this.index);
    }
    
    undoTransaction() {
        this.app.deleteSong(this.index);
        //set state with updated list
    }
}