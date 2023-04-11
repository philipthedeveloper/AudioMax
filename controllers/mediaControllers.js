const multer = require("multer");
const fs = require("fs");
const path = require("path");
const playlistsData = require("../playlists.json");
let playlists = playlistsData;

let Storage = multer.diskStorage({
  destination: function (req, file, callback) {
    console.log("Destionation called");
    if (file.mimetype.includes("image")) {
      callback(null, "assets/thumbnails/");
    } else if (file.mimetype.includes("audio")) {
      callback(null, "assets/audios/");
    }
  },
  filename: function (req, file, callback) {
    console.log("File name called.");
    let fileName = file.originalname;
    callback(null, fileName);
  },
});

let upload = multer({
  storage: Storage,
  fileFilter: function (req, file, callback) {
    console.log("Filter called");
    if (file.mimetype.includes("image")) {
      let thumabnailPath = path.join(
        path.parse(__dirname).dir,
        "assets",
        "thumbnails",
        `${file.originalname}`
      );
      if (fs.existsSync(thumabnailPath)) {
        console.log("Thumbnail already exists");
        callback(null, false);
      } else {
        console.log("Done with thumbnail check");
        callback(null, true);
      }
    } else if (file.mimetype.includes("audio")) {
      let audioPath = path.join(
        path.parse(__dirname).dir,
        "assets",
        "audios",
        `${file.originalname}`
      );
      if (fs.existsSync(audioPath)) {
        console.log("Audio file already exists");
        callback(null, false);
      } else {
        console.log("Done with audio check");
        callback(null, true);
      }
    }
  },
});

const getSongs = (req, res) => {};
const createSong = (req, res) => {
  let { playlistName, audioName, thumbnailName } = req.body;
  console.log(playlistName);
  console.log(audioName);
  let audioNameExt = audioName.split(".").pop();
  let audioNameWithoutExt = audioName.replace(`.${audioNameExt}`, "");
  let newSong = {
    name: audioNameWithoutExt,
    path: audioName,
    thumbnail: thumbnailName,
  };
  console.log(newSong);
  playlists = playlists.map((playlist) => {
    if (playlist.name === playlistName) {
      playlist.audios.push(newSong);
      playlist.size++;
      return playlist;
    }
    return playlist;
  });

  fs.writeFile(
    "./playlists.json",
    JSON.stringify(playlists, null, 2),
    (err) => {
      if (err) throw new Error(err.stack);
      return res.status(201).json({
        status: 201,
        message: "Song added successfully",
        data: { playlistName, ...newSong },
      });
    }
  );
};
const updateSong = (req, res) => {};
const deleteSong = (req, res) => {};

const handleSongDuplication = (req, res, next) => {
  console.log("Song duplication check...");
  let { playlistName, audioName, thumbnailName } = req.body;
  if (!playlistName) {
    return res.status(400).json({
      status: 400,
      message: "Playlist name required.",
    });
  }

  if (!audioName || !thumbnailName) {
    return res.status(500).json({
      status: 500,
      message: "An error occured. Please try again!",
    });
  }

  let currentPlaylist = playlists.find(
    (playlist) => playlist.name === playlistName
  );

  let isSongAvailable = currentPlaylist.audios.some(
    (audio) => audio.path === audioName
  );

  console.log(isSongAvailable);
  if (isSongAvailable) {
    return res.status(409).json({
      status: 409,
      message: "Song already exist in this playlist!",
    });
  }

  next();
};

module.exports = {
  getSongs,
  createSong,
  updateSong,
  deleteSong,
  upload,
  handleSongDuplication,
};
