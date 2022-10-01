import React, { Component } from 'react';

export default class EditSongModal extends Component {
    render() {
        const {  editSongCallback, hideEditSongModalCallback } = this.props;
        
        return (
            <div 
                class="modal" 
                width = '50%'
                id="edit-song-modal" 
                data-animation="slideInOutLeft">
                    <div class="modal-root" id='verify-edit-song-root' >
                    
                        <div class="modal-north" >
                            Edit Song?
                        </div>
                        <div class="modal-center">
                            <div class="modal-center-content">
                                
                                Title:   <input type="text" id="title" name ="title" />
                                Artist:   <input type="text" id="artist" name ="artist" />
                                Youtube Id:   <input type="text" id="youtubeid" name ="youtubeid" />
                            </div>
                        </div>
                        <div class="modal-south" >
                            <input type="button" 
                                id="edit-song-confirm-button" 
                                class="modal-button" 
                                onClick={editSongCallback}
                                value='Confirm' />
                            <input type="button" 
                                id="edit-song-cancel-button" 
                                class="modal-button" 
                                onClick={hideEditSongModalCallback}
                                value='Cancel' />
                        </div>
                    </div>
            </div>
        );
    }
}