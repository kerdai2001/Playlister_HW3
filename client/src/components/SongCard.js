import React, { useContext } from 'react'
import { GlobalStoreContext } from '../store'

function SongCard(props) {

    const { store } = useContext(GlobalStoreContext);

    const { song, index } = props;

    let cardClass = "list-card unselected-list-card";

    let handleDragStart = (event) => {
        if(!event.target.classList.contains("list-card"))
            event.target = event.target.parentNode;

        let moveStartIndex = event.target.id.substring("song-".length, event.target.id.length - "-card".length);
        event.dataTransfer.setData("song", moveStartIndex);
        event.target.className += " is-dragging";
    }

    let handleIgnore = (event) => {
        event.preventDefault();
    }

    let handleDragEnd = (event) => {
        if(!event.target.classList.contains("list-card"))
            event.target = event.target.parentNode;

        event.target.className = "list-card unselected-list-card";
    }

    let handleDrop = (event) => {
        if(!event.target.classList.contains("list-card"))
            event.target = event.target.parentNode;

        let moveStartIndex = event.dataTransfer.getData("song");
        let moveEndIndex = event.target.id.substring("song-".length, event.target.id.length - "-card".length);
        if(moveStartIndex !== moveEndIndex)
            store.addMoveSongTransaction(moveStartIndex, moveEndIndex);
    }

    return (
        <div
            key={index}
            id={'song-' + index + '-card'}
            className={cardClass}
            onDoubleClick={store.showEditSongModal}
            onDragStart={handleDragStart}
            onDragOver={handleIgnore}
            onDragEnter={handleIgnore}
            onDragLeave={handleIgnore}
            onDragEnd={handleDragEnd}
            onDrop={handleDrop}
            draggable="true"
        >
            {index + 1}.{" "}
            <a
                id={'song-' + index + '-link'}
                className="song-link"
                rel="noreferrer"
                target="_blank"
                href={"https://www.youtube.com/watch?v=" + song.youTubeId}>
                {song.title} by {song.artist}
            </a>
            <input
                type="button"
                id={"remove-song-" + index}
                className="list-card-button"
                value={"\u2715"}
                onClick={store.showRemoveSongModal}
            />
        </div>
    );
}

export default SongCard;