import { createContext, useState } from 'react'
import jsTPS from '../common/jsTPS'
import api from '../api'

import AddSong_Transaction from '../transactions/AddSong_Transaction';
import RemoveSong_Transaction from '../transactions/RemoveSong_Transaction';

export const GlobalStoreContext = createContext({});
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    MARK_SONG_FOR_DELETION: "MARK_SONG_FOR_DELETION"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
export const useGlobalStore = () => {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        idNamePairs: [],
        currentList: null,
        newListCounter: 0,
        listNameActive: false,
        selectedList: null,
        songIndex: null
    });

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.playlist,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    selectedList: store.selectedList,
                    songIndex: null
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    selectedList: store.selectedList,
                    songIndex: null
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.playlist,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: true,
                    selectedList: store.selectedList,
                    songIndex: null
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    selectedList: store.selectedList,
                    songIndex: null
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    selectedList: payload,
                    songIndex: null
                });
            }

            case GlobalStoreActionType.MARK_SONG_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    selectedList: store.selectedList,
                    songIndex: payload
                });
            }

            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    selectedList: store.selectedList
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    selectedList: store.selectedList
                });
            }
            default:
                return store;
        }
    }
    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.name = newName;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        //playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        tps.clearAllTransactions();
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }

    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;

                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                    store.history.push("/playlist/" + playlist._id);
                }
            }
        }
        asyncSetCurrentList(id);
    }
    store.getPlaylistSize = function() {
        return store.currentList.songs.length;
    }
    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setListNameActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    // create new list
    store.createNewList = function() {
        async function asyncCreateNewList() {
            let response = await api.createPlaylist({name: "Untitled " + (store.idNamePairs.length + 1), songs: []});
            if (response.data.success) {
                let newPlaylist = response.data.playlist;
                async function getListPairs() {
                    response = await api.getPlaylistPairs();
                    if (response.data.success) {
                        let pairsArray = response.data.idNamePairs;
                        storeReducer({
                            type: GlobalStoreActionType.CREATE_NEW_LIST,
                            payload: {
                                idNamePairs: pairsArray,
                                playlist: newPlaylist
                            }
                        });
                        store.setCurrentList(newPlaylist._id);
                    }
                }
                getListPairs();
            }
        }
        asyncCreateNewList();
    }

    // show delete list modal
    store.showDeleteListModal = (event) => {
        event.stopPropagation();
        let id = event.target.id.substring("delete-list-".length);
        async function asyncShowDeleteListModal(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                let modal = document.getElementById("delete-list-modal");
                modal.classList.add("is-visible");
                storeReducer({
                    type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                    payload: playlist
                });
            }
        }
        asyncShowDeleteListModal(id);
    }

    // close delete list modal
    store.hideDeleteListModal = (event) => {
        event.stopPropagation();
        let modal = document.getElementById("delete-list-modal");
        modal.classList.remove("is-visible");
    }

    // confirm delete list
    store.deleteList = (event) => {
        event.stopPropagation();
        let id = store.selectedList._id;
        async function asyncDeleteList(id) {
            let response = await api.deletePlaylist(id);
            if (response.data.success) {
                store.hideDeleteListModal(event);
                async function getListPairs() {
                    response = await api.getPlaylistPairs();
                    if (response.data.success) {
                        let pairsArray = response.data.idNamePairs;
                        storeReducer({
                            type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                            payload: pairsArray
                        });
                    }
                }
                getListPairs();
            }
        }
        asyncDeleteList(id);
    }

    store.showRemoveSongModal = (event) => {
        event.stopPropagation();
        let index = event.target.id.substring("remove-song-".length);
        let modal = document.getElementById("remove-song-modal");
        modal.classList.add("is-visible");
        storeReducer({
            type: GlobalStoreActionType.MARK_SONG_FOR_DELETION,
            payload: index
        });
    }

    store.hideRemoveSongModal = () => {
        let modal = document.getElementById("remove-song-modal");
        modal.classList.remove("is-visible");
    }

    store.addNewSong = function() {
        let playlist = store.currentList;
        let song = {
            title: "Untitled",
            artist: "Unknown",
            youTubeId: "dQw4w9WgXcQ",
        };
        playlist.songs.push(song);
        async function updateList(playlist) {
            let response = await api.updatePlaylistById(playlist._id, playlist);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: playlist
                });
            }
        }
        updateList(playlist);
    }

    store.removeNewSong = function() {
        let playlist = store.currentList;
        playlist.songs.pop();
        async function updateList(playlist) {
            let response = await api.updatePlaylistById(playlist._id, playlist);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: playlist
                });
            }
        }
        updateList(playlist);
    }

    store.removeSong = function(index) {
        let playlist = store.currentList;
        playlist.songs.splice(index, 1);
        async function updateList(playlist) {
            let response = await api.updatePlaylistById(playlist._id, playlist);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: playlist
                });
            }
        }
        updateList(playlist);
    }

    store.addSong = function(index, song) {
        let playlist = store.currentList;
        playlist.songs.splice(index, 0, song);
        async function updateList(playlist) {
            let response = await api.updatePlaylistById(playlist._id, playlist);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: playlist
                });
            }
        }
        updateList(playlist);
    }

    store.addAddNewSongTransaction = function() {
        let transaction = new AddSong_Transaction(store);
        tps.addTransaction(transaction);
    }

    store.addRemoveSongTransaction = function() {
        let transaction = new RemoveSong_Transaction(store, store.songIndex, store.currentList.songs[store.songIndex]);
        tps.addTransaction(transaction);
        store.hideRemoveSongModal();
    }

    // THIS GIVES OUR STORE AND ITS REDUCER TO ANY COMPONENT THAT NEEDS IT
    return { store, storeReducer };
}