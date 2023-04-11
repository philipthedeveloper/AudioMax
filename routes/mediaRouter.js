const {
  getSongs,
  createSong,
  updateSong,
  deleteSong,
  upload,
  handleSongDuplication,
} = require("../controllers/mediaControllers.js");
const mediaRouter = require("express").Router();

mediaRouter.route("/").post(upload.any(), handleSongDuplication, createSong);

module.exports = mediaRouter;
