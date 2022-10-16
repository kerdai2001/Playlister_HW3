import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { useHistory } from 'react-router-dom'
/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
    const { store } = useContext(GlobalStoreContext);
    const history = useHistory();

    function handleClose() {
        history.push("/");
        store.closeCurrentList();
    }

    /*
    let editStatus = false;
    if (store.isListNameEditActive) {
        editStatus = true;
    }
    */

    return (
        <span id="edit-toolbar">
            <input
                type="button"
                id='add-song-button'
                disabled={store.modalOpen || !store.currentList}
                value="+"
                className="playlister-button"
                onClick={store.addAddNewSongTransaction}
            />
            <input
                type="button"
                id='undo-button'
                disabled={store.modalOpen || !store.canUndo()}
                value="⟲"
                className="playlister-button"
                onClick={store.undo}
            />
            <input
                type="button"
                id='redo-button'
                disabled={store.modalOpen || !store.canRedo()}
                value="⟳"
                className="playlister-button"
                onClick={store.redo}
            />
            <input
                type="button"
                id='close-button'
                disabled={store.modalOpen || !store.currentList}
                value="&#x2715;"
                className="playlister-button"
                onClick={handleClose}
            />
        </span>);
}

export default EditToolbar;