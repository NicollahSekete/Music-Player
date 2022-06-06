<template>
  <div class="hello pb-4" id="musicPlayerWrapper" v-on:mouseover="mouseover">
    <h1 class="welcome-message" id="welcome-message">
      <i class="fa-solid fa-music"></i>
      {{ msg }}
    </h1>
    <div class="now-playing-container bordered">
      <div class="main">
        <div class="row">
          <div class="col-sm-6 float-left">
            <div class="dropdown">
              <button
                class="btn dropdown-toggle option-icon"
                type="button"
                id="dropdownMenuNowPlayingScreen"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i class="fa-solid fa-ellipsis-vertical"></i>
              </button>
              <ul
                class="dropdown-menu"
                aria-labelledby="dropdownMenuNowPlayingScreen"
              >
                <li>
                  <a class="dropdown-item" href="#" @click="scrollToLibrary">
                    <i class="fa-solid fa-music"></i> Go to playlists
                  </a>
                </li>
                <li>
                  <a
                    class="dropdown-item"
                    href="#"
                    @click="scrollToPlaylistCreate"
                  >
                    <i class="fa-solid fa-plus"></i> Create new playlists
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <li>
          <p class="now-playing">now playing....</p>
          <h4 class="current-song-title">{{ current.songTitle }}</h4>
          <p class="current-song-artist">{{ current.songArtist }}</p>
        </li>

        <div class="controls pt-4">
          <div class="row">
            <div ref="prev" class="col-sm-3 control-icon prev" @click="prev">
              <i class="fa-solid fa-backward-step fa-lg prev"></i>
            </div>
            <div class="col-sm-6 control-icon">
              <i
                ref="play"
                class="fa-solid fa-circle-play fa-2xl play"
                v-bind:id="current.src"
                v-if="!isPlaying"
                @click="play(this.current)"
              ></i>
              <i
                ref="pause"
                class="fa-solid fa-circle-pause fa-2xl pause"
                v-else
                @click="pause"
              ></i>
            </div>
            <div class="col-sm-3 control-icon next" ref="next" @click="next">
              <i class="fa-solid fa-forward-step fa-lg"></i>
            </div>
            <div
              ref="shuffle"
              class="col-sm-6 float-left control-icon shuffle"
              @click="shuffle"
            >
              <i class="fa-solid fa-shuffle"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="search-songs-container bordered">
      <h4>search songs</h4>
      <div class="row">
        <div class="col-sm-1">
          <div class="dropdown">
            <button
              class="btn dropdown-toggle option-icon"
              type="button"
              id="dropdownMenuSearchScreen"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="fa-solid fa-ellipsis-vertical"></i>
            </button>
            <ul
              class="dropdown-menu"
              aria-labelledby="dropdownMenuSearchScreen"
            >
              <li>
                <a class="dropdown-item" href="#" @click="scrollToLibrary">
                  <i class="fa-solid fa-music"></i> Go to playlists
                </a>
              </li>
              <li>
                <button
                  class="dropdown-item"
                  href="#"
                  @click="scrollToPlaylistCreate"
                >
                  <i class="fa-solid fa-plus"></i> Create new playlists
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <input
        v-model="search"
        type="text"
        class="form-control songSearch text-white"
        placeholder="Search"
      />

      <button
        v-for="song in filteredItems"
        :key="song.src"
        @click="play(song)"
        class="btn song-listings"
        :class="song.src == current.src ? 'song playing' : 'song'"
      >
        <em>{{ song.songTitle }}:</em>
        {{ song.songArtist }} - {{ song.songAlbum }}
      </button>
    </div>

    <div
      class="create-playlist-container bordered"
      id="playlistCreateContainer"
      v-if="displayCreatePlaylist"
    >
      <h4>create a playlist</h4>
      <p>Name your playlist</p>

      <input
        type="text"
        class="form-control"
        placeholder="Playlist name"
        aria-label="playlist-name"
        aria-describedby="playlist-name"
        id="playlistName"
        v-model="playlistName"
        required
      />

      <div v-for="(item, index) in songList" :key="item">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">{{ index }}</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <label :for="item.songArtist">{{ item.songTitle }}</label>
                  <p>{{ item.songArtist }}</p>
                </td>
                <td>
                  <input
                    type="checkbox"
                    id="songIDForPlaylist"
                    name="songIDForPlaylist"
                    v-bind:value="item._id"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="row pt-2">
        <div class="col-sm-6">
          <button class="btn" v-on:click="cancelPlaylistCreation">
            Cancel
          </button>
        </div>
        <div class="col-sm-5">
          <button class="btn createPlaylist" v-on:click="createPlaylist">
            Confirm
          </button>
        </div>
      </div>
    </div>

    <div
      class="playlist-library-container bordered"
      id="libraryContainer"
      v-if="displayPlaylists"
    >
      <h4>playlist library</h4>

      <div v-for="item in playlists" :key="item">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <p>{{ item.playlistName }}</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import PlaylistService from "../PlaylistService";

export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  data() {
    return {
      hover: false,
      error: "",
      success: "",
      current: {},
      index: 0,
      songList: [],
      player: new Audio(),
      isPlaying: false,
      addedToPlaylist: [],
      value: null,
      playlistName: "",
      displayCreatePlaylist: false,
      displayPlaylists: false,

      playlists: [],
      search: "",
      songArtist: "",
      songTitle: "",
      songAlbum: "",
      items: [],
      songPlaying: "",
      itemed: [],
    };
  },

  async created() {},

  beforeMount() {
    this.getAllSongsWithFiles();
    this.getAllPlaylists();
  },

  methods: {
    async getAllPlaylists() {
      try {
        const res = await axios.get(`http://localhost:5000/api/playlist`);
        this.playlists = res.data;
      } catch (e) {
        console.error(e);
      }
    },

    async getAllSongsWithFiles() {
      try {
        const res = await axios.get(`http://localhost:5000/api/uploads/files`);
        this.items = res.data;
        this.songList = res.data;
        this.current = this.songList[this.index];
        this.player.src = `http://localhost:5000/api/uploads/audio/${this.current.filename}`;
      } catch (e) {
        console.error(e);
      }
    },

    scrollToPlaylistCreate() {
      this.displayCreatePlaylist = true;
    },

    scrollToLibrary() {
      this.displayPlaylists = true;
    },

    mouseover: function () {
      var timer;
      clearTimeout(timer);
      document.getElementById("musicPlayerWrapper").style.opacity = "1";
      console.log("now active!");
      timer = setTimeout(function () {
        console.log("now idle");
        document.getElementById("musicPlayerWrapper").style.opacity = "0.2";
      }, 30000); //30 seconds
    },

    //cancel button will clear away
    cancelPlaylistCreation() {
      this.playlistName = "";
      var items = document.getElementsByName("songIDForPlaylist");
      for (var a = 0; a < items.length; a++) {
        if (items[a].type == "checkbox") items[a].checked = false;
      }
      alert("playlist canceled");
    },

    async createPlaylist() {
      var selectedSongsarray = [];
      var checkboxes = document.querySelectorAll(
        "input[type=checkbox]:checked"
      );
      for (var i = 0; i < checkboxes.length; i++) {
        selectedSongsarray.push(checkboxes[i].value);
      }

      await PlaylistService.insertPlaylist(
        this.playlistName,
        selectedSongsarray
      );

      var items = document.getElementsByName("songIDForPlaylist");
      for (var a = 0; a < items.length; a++) {
        if (items[a].type == "checkbox") items[a].checked = false;
      }
      const res = await axios.get(`http://localhost:5000/api/playlist`);
      this.playlists = res.data;
      alert("playlist created");
    },

    play(song) {
      if (song.filename != "undefined") {
        this.current = song;
        this.player.src = `http://localhost:5000/api/uploads/audio/${this.current.filename}`;
      }
      this.player.play();
      this.isPlaying = true;
    },

    pause() {
      this.player.pause();
      this.isPlaying = false;
    },
    next() {
      this.index++;
      if (this.index > this.songList.length - 1) {
        this.index = 0;
      }
      this.current = this.songList[this.index];
      this.play(this.current);
    },
    prev() {
      this.index--;
      if (this.index < 0) {
        this.index = this.songList.length - 1;
      }
      this.current = this.songList[this.index];
      this.play(this.current);
    },

    shuffle() {
      var randomSong =
        this.songList[Math.floor(Math.random() * this.songList.length)];
      this.current = randomSong;
      this.play(randomSong);
    },
  },

  computed: {
    filteredItems() {
      return this.songList.filter((item) => {
        return (
          item.songAlbum.toLowerCase().indexOf(this.search.toLowerCase()) > -1
        );
      });
    },
  },
};
</script>

<style scoped>
:root {
  --pink: #ff74a4;
  --violet: #9f6ea3;
  --lightblack: #515c6f;
  --white: #ffffff;
  --darkwhite: #cecaca;
  --pinkshadow: #ffcbdd;
  --lightbshadow: rgba(0, 0, 0, 0.15);
  --lightblue: #add8e6;
  --lavender: #e6e6fa;
  --lightseagreen: #20b2aa;
}

.has-search .form-control {
  padding-left: 2.375rem;
}

.songSearch {
  background-color: #1d1f3e;
  border: 1px solid #ff7a8a;
  border-radius: 10px;
}

.songSearch:focus {
  background-color: #1d1f3e;
  border: 1px solid #ff7a8a;
  border-radius: 10px;
}

.hello {
  height: 100%;
  width: 350px;
  padding: 25px 30px;
  overflow: auto;
  position: relative;
  border-radius: 15px;
  background: var(--white);
  box-shadow: 0px 6px 15px var(--lightbshadow);
  background: #9c89b8;
}

h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}

.now-playing {
  color: white;
}

.welcome-message {
  color: white;
}

.dropdown-toggle::after {
  display: none;
}

.option-icon {
  color: white;
}

.option-icon:hover,
.search-icon:hover,
.control-icon:hover {
  color: #ff7a8a;
}

td {
  vertical-align: middle;
  color: white;
}

table {
  border: none;
  color: transparent;
}

.dropdown-menu {
  background: #9c89b8;
  border: 1px solid #ff7a8a;
}

.dropdown-item {
  color: white;
}

.dropdown-item:focus {
  color: white;
  background: #9c89b8;
}

.dropdown-item:hover {
  color: rgb(46, 38, 38);
  background: #9c89b8;
}

.bordered {
  border: 1px solid white;
  border-radius: 25px;
  padding-bottom: 8px;
  margin-bottom: 20px;
  padding-right: 3px;
  padding-left: 3px;
}

.song-listings {
  color: white;
}
.song-listings:hover {
  color: #ff7a8a;
}
</style>
