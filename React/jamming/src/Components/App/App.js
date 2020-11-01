import React from 'react';
import './App.css';
import { SearchBar } from '../SearchBar/SearchBar';
import { SearchResults } from '../SearchResults/SearchResults';
import { PlayList } from '../Playlist/Playlist';
import Spotify from '../../util/Spotify.js';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults:[],
      playListName: 'New Playlist',
      playListTracks: []
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  search(term) {
    console.log(term);
    Spotify.search(term)
      .then(res => this.setState({
      searchResults: res
      }));
  }

  addTrack(track) {
    if (!this.state.playListTracks.includes(track.id)) {
      this.setState({
        playListTracks: [...this.state.playListTracks, track]
      });
    }
  }

  removeTrack(track) {
    this.setState({
      playListTracks: this.state.playListTracks.filter(el => el.id !== track.id)
    });
  }

  updatePlaylistName(name) {
    this.setState({
      playListName: name
    });
  }

  savePlaylist() {
    Spotify.savePlaylist(this.state.playListName, this.state.playListTracks.map(track => track.uri));
    this.setState({
      playListName: 'New Playlist',
      playListTracks: []
    });
  }

  componentDidMount() {
    Spotify.getAccessToken();
  }

  render() {
      return (
        <div>
          <h1>Ja<span className="highlight">mmm</span>ing</h1>
          <div className="App">
            <SearchBar onSearch={this.search}/>
            <div className="App-playlist">
              <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
              <PlayList playListName={ this.state.playListName } 
                        playListTracks={this.state.playListTracks}
                        onRemove={this.removeTrack}
                        onNameChange={this.updatePlaylistName}
                        onSave={this.savePlaylist}
                        />
            </div>
          </div>
        </div>
      )
  }
}

export default App;
