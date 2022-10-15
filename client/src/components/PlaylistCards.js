import { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import SongCard from './SongCard.js'
import { GlobalStoreContext } from '../store'
import EditToolbar from './EditToolbar.js'
import ListSelector from './ListSelector.js'
/*
    This React component lets us edit a loaded list, which only
    happens when we are on the proper route.
    
    @author McKilla Gorilla
*/
function PlaylistCards() {
    const { store } = useContext(GlobalStoreContext);
    store.history = useHistory();

    if(store.currentList == null)
    {
        store.history.push("/");
        return null;
    }

    return (
        <div id="playlist-cards">
            <div id="playlist-selector-heading">
                <input
                    type="button"
                    id="add-list-button"
                    onClick={ListSelector.handleCreateNewList}
                    className="playlister-button"
                    value="+"
                    disabled={true} />
                Your Playlists
                <EditToolbar />
            </div>
            <div id="list-selector-list">
                {
                    store.currentList.songs.map((song, index) => (
                        <SongCard
                            id={'playlist-song-' + (index)}
                            key={'playlist-song-' + (index)}
                            index={index}
                            song={song}
                        />
                    ))
                }
            </div>
        </div>
    )
}

export default PlaylistCards;