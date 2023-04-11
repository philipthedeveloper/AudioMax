const {
  getPlaylists,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
} = require("../controllers/playlistControllers");
const router = require("express").Router();

router.route("/").get(getPlaylists).post(createPlaylist);
router.route("/:title").put(updatePlaylist).delete(deletePlaylist);

module.exports = router;
