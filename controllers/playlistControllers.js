const playlistsDAta = require("../playlists.json");
const fs = require("fs");
let playlists = playlistsDAta;

/**
 * @METHOD GET
 * @param {Null} req
 * @param {playlists} res
 */
const getPlaylists = (req, res) => {
  res.statusCode = 200;
  res.json({ status: 200, length: playlists.length, data: playlists });
};

/**
 * @param {playlistTitle} req
 * @param {newPlaylist*} res
 * @returns
 */
const createPlaylist = (req, res) => {
  const { playlistTitle } = req.body;
  if (!playlistTitle) {
    res.statusCode = 400;
    return res.json({ status: 400, message: "Playlist title required!" });
  }
  let playlist = playlists.some((playlist) => playlist.name === playlistTitle);
  if (playlist) {
    return res
      .status(400)
      .json({ status: 400, message: "Playlist already exist!" });
  }
  let newPlaylist = { name: playlistTitle, size: 0, audios: [] };
  playlists.push(newPlaylist);
  fs.writeFile(
    "./playlists.json",
    JSON.stringify(playlists, null, 2),
    (err) => {
      if (err) throw new Error(err.stack);
      return res.status(201).json({
        status: 201,
        message: "Playlist created Successfully",
        data: newPlaylist,
      });
    }
  );
};

const updatePlaylist = (req, res) => {
  const title = req.params.title;
  const { playlistTitle } = req.body;
  if (!playlistTitle) {
    res.statusCode = 400;
    return res.json({ status: 400, message: "Playlist title required!" });
  }

  let playlistExist = playlists.find((playlist) => playlist.name === title);
  if (!playlistExist) {
    res.statusCode = 404;
    return res.json({ status: 404, message: "Playlist title required!" });
  }

  playlists = playlists.map((playlist) => {
    if (playlist.name === title) {
      playlist.name = playlistTitle;
    }
    return playlist;
  });
  fs.writeFile(
    "./playlists.json",
    JSON.stringify(playlists, null, 2),
    (err) => {
      if (err) throw new Error(err.stack);
      return res.status(200).json({
        status: 200,
        message: "Playlist updated Successfully",
        data: playlists,
      });
    }
  );
};

const deletePlaylist = (req, res) => {
  const title = req.params.title;
  if (!title) {
    res.statusCode = 400;
    return res.json({ status: 400, message: "Playlist title required!" });
  }

  let playlistExist = playlists.find((playlist) => playlist.name === title);
  if (!playlistExist) {
    res.statusCode = 404;
    return res.json({ status: 404, message: "Playlist not found!" });
  }
  playlists = playlists.filter((playlist) => playlist.name !== title);
  fs.writeFile(
    "./playlists.json",
    JSON.stringify(playlists, null, 2),
    (err) => {
      if (err) throw new Error(err.stack);
      return res.status(200).json({
        status: 200,
        message: "Playlist deleted Successfully",
        data: playlists,
      });
    }
  );
};

module.exports = {
  getPlaylists,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
};
