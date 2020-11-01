
const url = 'https://accounts.spotify.com/authorize';
const client_id = '7eafe233aa2d44a78304a55b375dab52';
const redirect_uri = 'http://localhost:3000/';
const request = `${url}?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=playlist-modify-public&response_type=code`;

const Spotify = {

  code: '',
  token: '',
  expires: 0,
  refreshToken: '',
  tracks: [],
  client_id: '7eafe233aa2d44a78304a55b375dab52',
  client_secret:'d174e9cd77ca4deb8686639aca65b5b9',

  async getAccessToken() {
    if (this.token.length > 0) {
      return this.token;
    }
    if (this.code.length > 0 && this.token.length === 0) {
      console.log('Refresh GO', new Date().toLocaleTimeString());
      const refresh = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            'Authorization': 'Basic ' + btoa(this.client_id+':'+this.client_secret),
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: 'grant_type=refresh_token&refresh_token=' + this.refreshToken
        });
      const res = await refresh.json();
      this.token = res.access_token;
      this.expires = res.expires_in;
      console.log(res);
      window.setTimeout(() => {
        this.token = '';
        console.log('Expired');
      }, this.expires);
      return this.token;
    }
    const codeMatch = window.location.href.match(/code=([^&]*)/);
    if (codeMatch && this.code.length === 0) {
      console.log('Get token GO', new Date().toLocaleTimeString());
      this.code = codeMatch[1];
      const access = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(this.client_id+':'+this.client_secret),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=authorization_code&code=' + this.code + '&redirect_uri=' + redirect_uri,
      });
      const response = await access.json();
      console.log(response);
      this.token = response.access_token;
      this.expires = response.expires_in;
      this.refreshToken = response.refresh_token;
      window.setTimeout(() => {
        this.token = '';
        console.log('Expired');
      }, this.expires);
      window.history.pushState({}, null, '/');
      return this.token; 
    } else {
      console.log('Acces GO', new Date().toLocaleTimeString());
      window.location.href = request;
    };
  },

  async search(term) {
    const token = await this.getAccessToken();
    try {

      const request = await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
        headers: {
          'Authorization': 'Bearer ' + token,      
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
      const token = await this.getAccessToken();
      const headers = {
        'Authorization': 'Bearer ' + token
      };
      const userName = await fetch('https://api.spotify.com/v1/me', {headers: headers});
      const user = await userName.json();
      userID = user.id;
      const newPlaylist = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({'name': `${playlistName}`})
      });
      const result = await newPlaylist.json();
      const playlistID = result.id;
      console.log(uris);
      await fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
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
