import React, { useContext } from 'react';
import { GlobalStoreContext } from '../store'

const EditSongModal = () => {
    const { store } = useContext(GlobalStoreContext);
    return (
        <div 
            className="modal" 
            id="edit-song-modal" 
            data-animation="slideInOutLeft">
                <div className="modal-dialog" id='verify-edit-song-root'>
                    <div className="modal-header">
                        Edit Song
                    </div>
                    <div className="modal-center">
                        <div className="modal-center-content">
                            <b>
                            <div style={{fontSize:"24pt"}}>Title:<input style={{float: "right", fontSize:"16pt", width: "60%"}} type="text" id="song-title" /></div>
                            <div style={{fontSize:"24pt"}}>Artist:<input style={{float: "right", fontSize:"16pt", width:"60%"}} type="text" id="song-artist" /></div>
                            <div style={{fontSize:"24pt"}}>You Tube Id:<input style={{float: "right", fontSize:"16pt", width:"60%"}} type="text" id="song-id" /></div>
                            </b>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <input type="button" 
                            id="edit-song-confirm-button" 
                            className="modal-button" 
                            onClick={store.addEditSongTransaction}
                            value='Confirm' />
                        <input type="button" 
                            id="edit-song-cancel-button" 
                            className="modal-button" 
                            onClick={store.hideEditSongModal}
                            value='Cancel' />
                    </div>
                </div>
        </div>
    );
}

export default EditSongModal;