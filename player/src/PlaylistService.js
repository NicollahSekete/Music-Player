import axios from 'axios';
const url = 'http://localhost:5000/api/playlist'
class PlaylistService {
 

    //playlist create
    static insertPlaylist(playlistName, playlistSongIDs) {
        return axios.post(url, {
            playlistName: playlistName,
            playlistSongIDs: playlistSongIDs,
        })
    }
}

export default PlaylistService