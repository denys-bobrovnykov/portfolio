
const url = 'https://accounts.spotify.com/authorize';
const client_id = '7eafe233aa2d44a78304a55b375dab52';
const redirect_uri = 'http://localhost:3000/';
const request = `${url}?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=playlist-modify-public&response_type=token`;

const Spotify = {
  token: '',
  expires: 0,
  tracks: [],
  client_id: '7eafe233aa2d44a78304a55b375dab52',
  client_secret:'d174e9cd77ca4deb8686639aca65b5b9',
  getAccessToken() {

    let tokenMatch = window.location.href.match(/access_token=([^&]*)/);
    let expiresMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (this.token !== ''){
      return this.token;
    } 
    console.log('FIRE TOKEN RETRIEVAL');
    if (tokenMatch && expiresMatch && this.token === '') {
      this.token = tokenMatch[1];
      this.expires = expiresMatch[1];
      window.setTimeout(() => {
        this.token = '';
      }, this.expires * 1000);    
      window.history.pushState('Access Token', null, '/');
      return this.token;
    }
    if (!tokenMatch && !expiresMatch && this.token === '') {
      alert('Token expired, getting new');
      window.location.href = `${request}`;
    }
  },
  async search(term) {
    try {
      const request = await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
        headers: {
          'Authorization': 'Bearer ' + this.getAccessToken(),      
        }
      });
      const response = await request.json();
      const tracks = await response.tracks.items.map(track => track = {
        'id': track.id,
        'name': track.name,
        'artist': track.artists[0].name,
        'album': track.album.name,
        'uri': track.uri
      });
      return tracks;
    } catch(err) {
      console.log(err);
      return [];
    }
  },
  async savePlaylist(playlistName, uris) {
    if (!playlistName || !uris) {
      return;
    }
    try {
      let userID;
      const token = this.getAccessToken();
      const headers = {
        'Authorization': 'Bearer ' + token
      };
      const userName = await fetch('https://api.spotify.com/v1/me', {headers: headers});
      const user = await userName.json();
      userID = user.id;
      const newPlaylist = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + this.getAccessToken(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({'name': `${playlistName}`})
      });
      const result = await newPlaylist.json();
      const playlistID = result.id;
      console.log(uris);
      const addTracks = await fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + this.getAccessToken(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({'uris': uris})
      }) 
    } catch(err) {
      console.log(err);
    }
  }
}




export default Spotify;
