import './App.css';
import { React } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Banner, ListSelector, PlaylistCards, Statusbar } from './components'

import DeleteListModal from './components/DeleteListModal';
import RemoveSongModal from './components/RemoveSongModal';
import EditSongModal from './components/EditSongModal';
/*
    This is our application's top-level component.
    
    @author McKilla Gorilla
*/
const App = () => {
    return (
        <Router>
            <Banner />
            <Switch>
                <Route path="/" exact component={ListSelector} />
                <Route path="/playlist/:id" exact component={PlaylistCards} />
            </Switch>
            <Statusbar />
            <DeleteListModal />
            <RemoveSongModal />
            <EditSongModal />
        </Router>
    )
}

export default App