import React from 'react';
import './App.css';

// IMPORT DATA MANAGEMENT AND TRANSACTION STUFF
import DBManager from './db/DBManager';
import jsTPS from './common/jsTPS.js';

// OUR TRANSACTIONS
import MoveSong_Transaction from './transactions/MoveSong_Transaction.js';
import AddSong_Transaction from './transactions/AddSong_Transaction.js';
import EditSong_Transaction from './transactions/EditSong_Transaction.js';
import DeleteSong_Transaction from './transactions/DeleteSong_Transaction.js';


// THESE REACT COMPONENTS ARE MODALS
import DeleteListModal from './components/DeleteListModal.js';
import DeleteSongModal from './components/DeleteSongModal';
import EditSongModal from './components/EditSongModal'; //shreyas added
// THESE REACT COMPONENTS ARE IN OUR UI
import Banner from './components/Banner.js';
import EditToolbar from './components/EditToolbar.js';
import PlaylistCards from './components/PlaylistCards.js';
import SidebarHeading from './components/SidebarHeading.js';
import SidebarList from './components/SidebarList.js';
import Statusbar from './components/Statusbar.js';

class App extends React.Component {
    constructor(props) {
        super(props);

        // THIS IS OUR TRANSACTION PROCESSING SYSTEM
        this.tps = new jsTPS();

        // THIS WILL TALK TO LOCAL STORAGE
        this.db = new DBManager();

        // GET THE SESSION DATA FROM OUR DATA MANAGER
        let loadedSessionData = this.db.queryGetSessionData();

        // SETUP THE INITIAL STATE
        this.state = {
            listKeyPairMarkedForDeletion : null,
            currentList : null,
            sessionData : loadedSessionData
        }
    }
    sortKeyNamePairsByName = (keyNamePairs) => {
        keyNamePairs.sort((keyPair1, keyPair2) => {
            // GET THE LISTS
            return keyPair1.name.localeCompare(keyPair2.name);
        });
    }
    // THIS FUNCTION BEGINS THE PROCESS OF CREATING A NEW LIST
    createNewList = () => {
        // FIRST FIGURE OUT WHAT THE NEW LIST'S KEY AND NAME WILL BE
        let newKey = this.state.sessionData.nextKey;
        let newName = "Untitled" + newKey;

        // MAKE THE NEW LIST
        let newList = {
            key: newKey,
            name: newName,
            songs: []
        };

        // MAKE THE KEY,NAME OBJECT SO WE CAN KEEP IT IN OUR
        // SESSION DATA SO IT WILL BE IN OUR LIST OF LISTS
        let newKeyNamePair = { "key": newKey, "name": newName };
        let updatedPairs = [...this.state.sessionData.keyNamePairs, newKeyNamePair];
        this.sortKeyNamePairsByName(updatedPairs);

        // CHANGE THE APP STATE SO THAT THE CURRENT LIST IS
        // THIS NEW LIST AND UPDATE THE SESSION DATA SO THAT THE
        // NEXT LIST CAN BE MADE AS WELL. NOTE, THIS setState WILL
        // FORCE A CALL TO render, BUT THIS UPDATE IS ASYNCHRONOUS,
        // SO ANY AFTER EFFECTS THAT NEED TO USE THIS UPDATED STATE
        // SHOULD BE DONE VIA ITS CALLBACK
        this.setState(prevState => ({
            listKeyPairMarkedForDeletion : prevState.listKeyPairMarkedForDeletion,
            currentList: newList,
            sessionData: {
                nextKey: prevState.sessionData.nextKey + 1,
                counter: prevState.sessionData.counter + 1,
                keyNamePairs: updatedPairs
            }
        }), () => {
            // PUTTING THIS NEW LIST IN PERMANENT STORAGE
            // IS AN AFTER EFFECT
            this.db.mutationCreateList(newList);

            // SO IS STORING OUR SESSION DATA
            this.db.mutationUpdateSessionData(this.state.sessionData);
        });
    }
    // THIS FUNCTION BEGINS THE PROCESS OF DELETING A LIST.
    deleteList = (key) => {
        // IF IT IS THE CURRENT LIST, CHANGE THAT
        let newCurrentList = null;
        if (this.state.currentList) {
            if (this.state.currentList.key !== key) {
                // THIS JUST MEANS IT'S NOT THE CURRENT LIST BEING
                // DELETED SO WE'LL KEEP THE CURRENT LIST AS IT IS
                newCurrentList = this.state.currentList;
            }
        }

        let keyIndex = this.state.sessionData.keyNamePairs.findIndex((keyNamePair) => {
            return (keyNamePair.key === key);
        });
        let newKeyNamePairs = [...this.state.sessionData.keyNamePairs];
        if (keyIndex >= 0)
            newKeyNamePairs.splice(keyIndex, 1);

        // AND FROM OUR APP STATE
        this.setState(prevState => ({
            listKeyPairMarkedForDeletion : null,
            currentList: newCurrentList,
            sessionData: {
                nextKey: prevState.sessionData.nextKey,
                counter: prevState.sessionData.counter - 1,
                keyNamePairs: newKeyNamePairs
            }
        }), () => {
            // DELETING THE LIST FROM PERMANENT STORAGE
            // IS AN AFTER EFFECT
            this.db.mutationDeleteList(key);

            // SO IS STORING OUR SESSION DATA
            this.db.mutationUpdateSessionData(this.state.sessionData);
        });
    }
    deleteMarkedList = () => {
        this.deleteList(this.state.listKeyPairMarkedForDeletion.key);
        this.hideDeleteListModal(); //origin of hideDeleteList
    }
    showDeleteListModal() {
        this.setState(prevState => ({
            modalOpen: true
        }), () => {
            let modal = document.getElementById("delete-list-modal");
            modal.classList.add("is-visible");
        });
    }
    hideDeleteListModal = () => {
        this.setState(prevState => ({
            modalOpen: false
        }), () => {
            let modal = document.getElementById("delete-list-modal");
            modal.classList.remove("is-visible");
        });
    }

    // THIS FUNCTION SPECIFICALLY DELETES THE CURRENT LIST
    deleteCurrentList = () => {
        if (this.state.currentList) {
            this.deleteList(this.state.currentList.key);
        }
    }
    renameList = (key, newName) => {
        let newKeyNamePairs = [...this.state.sessionData.keyNamePairs];
        // NOW GO THROUGH THE ARRAY AND FIND THE ONE TO RENAME
        for (let i = 0; i < newKeyNamePairs.length; i++) {
            let pair = newKeyNamePairs[i];
            if (pair.key === key) {
                pair.name = newName;
            }
        }
        this.sortKeyNamePairsByName(newKeyNamePairs);

        // WE MAY HAVE TO RENAME THE currentList
        let currentList = this.state.currentList;
        if (currentList.key === key) {
            currentList.name = newName;
        }

        this.setState(prevState => ({
            listKeyPairMarkedForDeletion : null,
            sessionData: {
                nextKey: prevState.sessionData.nextKey,
                counter: prevState.sessionData.counter,
                keyNamePairs: newKeyNamePairs
            }
        }), () => {
            // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
            // THE TRANSACTION STACK IS CLEARED
            let list = this.db.queryGetList(key);
            list.name = newName;
            this.db.mutationUpdateList(list);
            this.db.mutationUpdateSessionData(this.state.sessionData);
        });
    }
    ///shreyas trying editsong modal

    

    ///--------shreyas trying editsong modal end----

    ///-----shreyas trying delete song modal

    

    ///shreyas trying delete song modal end----

    // THIS FUNCTION BEGINS THE PROCESS OF LOADING A LIST FOR EDITING
    loadList = (key) => {
        let newCurrentList = this.db.queryGetList(key);
        this.setState(prevState => ({
            listKeyPairMarkedForDeletion : prevState.listKeyPairMarkedForDeletion,
            currentList: newCurrentList,
            sessionData: this.state.sessionData
        }), () => {
            // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
            // THE TRANSACTION STACK IS CLEARED
            this.tps.clearAllTransactions();
        });
    }
    // THIS FUNCTION BEGINS THE PROCESS OF CLOSING THE CURRENT LIST
    closeCurrentList = () => {
        this.setState(prevState => ({
            listKeyPairMarkedForDeletion : prevState.listKeyPairMarkedForDeletion,
            currentList: null,
            sessionData: this.state.sessionData
        }), () => {
            // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
            // THE TRANSACTION STACK IS CLEARED
            this.tps.clearAllTransactions();
        });
    }
    setStateWithUpdatedList(list) {
        this.setState(prevState => ({
            listKeyPairMarkedForDeletion : prevState.listKeyPairMarkedForDeletion,
            currentList : list,
            sessionData : this.state.sessionData
        }), () => {
            // UPDATING THE LIST IN PERMANENT STORAGE
            // IS AN AFTER EFFECT
            this.db.mutationUpdateList(this.state.currentList);
        });
    }
    getPlaylistSize = () => {
        return this.state.currentList.songs.length;
    }
    // THIS FUNCTION MOVES A SONG IN THE CURRENT LIST FROM
    // start TO end AND ADJUSTS ALL OTHER ITEMS ACCORDINGLY
    moveSong(start, end) {
        let list = this.state.currentList;

        // WE NEED TO UPDATE THE STATE FOR THE APP
        start -= 1;
        end -= 1;
        if (start < end) {
            let temp = list.songs[start];
            for (let i = start; i < end; i++) {
                list.songs[i] = list.songs[i + 1];
            }
            list.songs[end] = temp;
        }
        else if (start > end) {
            let temp = list.songs[start];
            for (let i = start; i > end; i--) {
                list.songs[i] = list.songs[i - 1];
            }
            list.songs[end] = temp;
        }
        this.setStateWithUpdatedList(list);
    }
    // THIS FUNCTION ADDS A MoveSong_Transaction TO THE TRANSACTION STACK
    addMoveSongTransaction = (start, end) => {
        let transaction = new MoveSong_Transaction(this, start, end);
        this.tps.addTransaction(transaction);
    }
    //shreyas
    // THIS FUNCTION ADDS A MoveSong_Transaction TO THE TRANSACTION STACK
    addAddSongTransaction = () => {
        let transaction = new AddSong_Transaction(this, this.state.currentList.songs.length);
        this.tps.addTransaction(transaction);
    }

    // THIS FUNCTION ADDS A MoveSong_Transaction TO THE TRANSACTION STACK
    addEditSongTransaction = () => {
        let oldSong=this.state.currentList.songs[this.state.currentIndex]
        let userArtist=document.getElementById("artist")
        let userTitle=document.getElementById("title")
        let userYoutubeId=document.getElementById("youtubeid")
        console.log("---\ntest youtube id")
        console.log(userYoutubeId.value)
        
        let userNewSong={
            "artist": userArtist.value,
            "title": userTitle.value,
            "youTubeId": userYoutubeId.value
        }
        let transaction = new EditSong_Transaction(this, this.state.currentIndex,userNewSong,oldSong);
        this.tps.addTransaction(transaction);
    }
    // THIS FUNCTION ADDS A MoveSong_Transaction TO THE TRANSACTION STACK
    addDeleteSongTransaction = () => {
        let deletedSong=this.state.currentList.songs[this.state.deleteSongIndex]; //the song the user removes
        let transaction = new DeleteSong_Transaction(this,this.state.deleteSongIndex,deletedSong);
        this.tps.addTransaction(transaction);
    }
    //shreyas
    // THIS FUNCTION BEGINS THE PROCESS OF PERFORMING AN UNDO
    undo = () => {
        if (this.tps.hasTransactionToUndo()) {
            this.tps.undoTransaction();

            // MAKE SURE THE LIST GETS PERMANENTLY UPDATED
            this.db.mutationUpdateList(this.state.currentList);
        }
    }
    // THIS FUNCTION BEGINS THE PROCESS OF PERFORMING A REDO
    redo = () => {
        if (this.tps.hasTransactionToRedo()) {
            this.tps.doTransaction();

            // MAKE SURE THE LIST GETS PERMANENTLY UPDATED
            this.db.mutationUpdateList(this.state.currentList);
        }
    }
    markListForDeletion = (keyPair) => {
        this.setState(prevState => ({
            currentList: prevState.currentList,
            listKeyPairMarkedForDeletion : keyPair,
            sessionData: prevState.sessionData
        }), () => {
            // PROMPT THE USER
            this.showDeleteListModal();
        });
    }
    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO DELETE THE LIST
    
    //shreyas
    markSongforEdit = (songIndex) => {
        console.log("--testing markSongforEdit --");
        this.setState(prevState =>({
            currentIndex:songIndex,
        } ) , ()=>{
            let title =document.getElementById("title");
            title.value = this.state.currentList.songs[songIndex].title;

            let artist = document.getElementById("artist");
            artist.value = this.state.currentList.songs[songIndex].artist;

            let youTubeId = document.getElementById("youtubeid");
            youTubeId.value = this.state.currentList.songs[songIndex].youTubeId;
            //shreyas trying to show edit song modal
            console.log("--testing showing editsongmodal --");
            this.showEditSongModal();
            //shreyas trying to show edit song modal
        } );
    }
    markSongforDeletion = (songIndex,songKeyPair) => {
        console.log("--testing markSongforDeletion --");
        this.setState(prevState =>({
            currentList: prevState.currentList,
            songKeyPairMarkedForDeletion: songKeyPair,
            songKeyNamePairMarkedforDeletion: songIndex,
            
        } ) , ()=>{
            //shreyas trying to show delete song modal
            this.showDeleteSongModal();
            //shreyas trying to show delete song modal
        });
    }

    

    //

    //--shreyas trying delete and add song -------------
    // 
    deleteSong = (songIndex) =>{
        let list1 = this.state.currentList;
        list1.songs.splice(songIndex,1);
        this.hideDeleteSongModal();
        this.setStateWithUpdatedList(list1);


    }

    editSong=(editedSong, index) =>
    {
        console.log("Entering Edit Song")
        let list1 = this.state.currentList;
        list1.songs[index]=editedSong;
        this.hideEditSongModal();

        this.setStateWithUpdatedList(list1);
        
    }

    addSong = (newSong,index) =>{
        let list1 = this.state.currentList;
        
        list1.songs.splice(index,0,newSong);
        this.setStateWithUpdatedList(list1);
    };

    showDeleteSongModal() {
        this.setState(prevState => ({
            modalOpen: true
        }), () => {
            let modal = document.getElementById("delete-song-modal");
            modal.classList.add("is-visible");
        });
    }
    hideDeleteSongModal = () => {
        this.setState(prevState => ({
            modalOpen: false
        }), () => {
            let modal = document.getElementById("delete-song-modal");
            modal.classList.remove("is-visible");
        });
    }

    showEditSongModal(){
        console.log("entering show edit song modal")
        this.setState(prevState => ({
            modalOpen:true
    }),()=>{
        let modal =document.getElementById('edit-song-modal');
        modal.classList.add('is-visible');
        console.log("modal should be visible")
    });   
}
    hideEditSongModal = () =>{
        console.log("entered hide edit song modal")
        this.setState(prevState => ({
            modalOpen:false
    }),()=>{
            let modal =document.getElementById('edit-song-modal');
            modal.classList.remove('is-visible');
        });
    }
    
    handleUndoRedo = (event) => {
         if(event.metaKey || event.ctrlKey  ) {
                event.preventDefault();
                if(event.keyCode === 90) {
                     this.undo();
                     
                    this.forceUpdate();
                }
                if(event.keyCode === 89) {
                    this.redo();
                    this.forceUpdate();
                }
            }
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleUndoRedo);
    }
    //---shreyas------------------


    render() {
        let canAddSong = this.state.currentList !== null && this.state.listOpen;
        //let canAddList = !this.state.listOpen;
        let canUndo = this.tps.hasTransactionToUndo();
        let canRedo = this.tps.hasTransactionToRedo();
        let canClose = this.state.currentList !== null;
        return (
            <div id="root">
                <Banner />
                <SidebarHeading
                    createNewListCallback={this.createNewList}
                />
                <SidebarList
                    currentList={this.state.currentList}
                    keyNamePairs={this.state.sessionData.keyNamePairs}
                    deleteListCallback={this.markListForDeletion}
                    loadListCallback={this.loadList}
                    renameListCallback={this.renameList}
                />
                <EditToolbar
                    canAddSong={canAddSong}
                    canUndo={canUndo}
                    canRedo={canRedo}
                    canClose={canClose} 
                    addSongCallback={this.addAddSongTransaction}
                    
                    undoCallback={this.undo}
                    redoCallback={this.redo}
                    closeCallback={this.closeCurrentList}
                />
                <PlaylistCards
                    currentList={this.state.currentList}
                    moveSongCallback={this.addMoveSongTransaction}
                    //shreyas callback
                    deleteSongCallback={this.markSongforDeletion}
                    editSongCallback={this.markSongforEdit}  
                    //shreyas callback
                    />

                <Statusbar 
                    currentList={this.state.currentList} />
                <DeleteListModal
                    listKeyPair={this.state.listKeyPairMarkedForDeletion}
                    hideDeleteListModalCallback={this.hideDeleteListModal}
                    deleteListCallback={this.deleteMarkedList}
                />
                <EditSongModal
                hideEditSongModalCallback= {this.hideEditSongModal}
                editSongCallback={this.addEditSongTransaction}
                />
                <DeleteSongModal
                songKeyPair={this.state.songKeyPairMarkedForDeletion}
                hideDeleteSongModalCallback= {this.hideDeleteSongModal}
                deleteSongCallback={this.addDeleteSongTransaction}
                />
                

            </div>
        );
    }
}

export default App;
