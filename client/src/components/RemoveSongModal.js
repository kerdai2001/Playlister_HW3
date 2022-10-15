import React, { useContext } from 'react';
import { GlobalStoreContext } from '../store'

const RemoveSongModal = () => {
    const { store } = useContext(GlobalStoreContext);
    let name = "";

    if (store.songIndex) {
        name = store.currentList.songs[store.songIndex].title;
    }

    return (
        <div 
            className="modal" 
            id="remove-song-modal" 
            data-animation="slideInOutLeft">
                <div className="modal-dialog" id='verify-remove-song-root'>
                    <div className="modal-header">
                        Remove song?
                    </div>
                    <div className="modal-center">
                        <div className="modal-center-content">
                            Are you sure you wish to permanently remove <b>{name}</b> from the playlist?
                        </div>
                    </div>
                    <div className="modal-footer">
                        <input type="button" 
                            id="remove-song-confirm-button" 
                            className="modal-button" 
                            onClick={store.addRemoveSongTransaction}
                            value='Confirm' />
                        <input type="button" 
                            id="remove-song-cancel-button" 
                            className="modal-button" 
                            onClick={store.hideRemoveSongModal}
                            value='Cancel' />
                    </div>
                </div>
        </div>
    );
}

export default RemoveSongModal;