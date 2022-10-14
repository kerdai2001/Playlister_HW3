import React, { useContext } from 'react';
import { GlobalStoreContext } from '../store'

const DeleteListModal = () => {
    const { store } = useContext(GlobalStoreContext);
    let name = "";

    if (store.selectedList) {
        name = store.selectedList.name;
    }
    return (
        <div 
            className="modal" 
            id="delete-list-modal" 
            data-animation="slideInOutLeft">
                <div className="modal-dialog" id='verify-delete-list-root'>
                    <div className="modal-header">
                        Delete playlist?
                    </div>
                    <div className="modal-center">
                        <div className="modal-center-content">
                            Are you sure you wish to permanently delete the <b>{name}</b> playlist?
                        </div>
                    </div>
                    <div className="modal-footer">
                        <input type="button" 
                            id="delete-list-confirm-button" 
                            className="modal-button" 
                            onClick={store.deleteList}
                            value='Confirm' />
                        <input type="button" 
                            id="delete-list-cancel-button" 
                            className="modal-button" 
                            onClick={store.hideDeleteListModal}
                            value='Cancel' />
                    </div>
                </div>
        </div>
    );
}

export default DeleteListModal;