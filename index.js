const express = require("express");
const multer = require("multer");
const reqDetails = require("./middlewares/reqData");
// const playlist = require("./playlists.json");
const playlistRouter = require("./routes/playlistRouter");
const mediaRouter = require("./routes/mediaRouter");
const cors = require("cors");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(reqDetails);
app.use(cors());
app.use("/", express.static("public"));
app.use("/assets", express.static("assets"));
app.use("/playlist", playlistRouter);
app.use("/media", mediaRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// app.get("/playlist/:name", (req, res) => {
//   if (req.body.name) {
//     return playlist.find((playlist) => playlist.name === req.body.name);
//   }
//   return res.json(playlist);
// });

// app.get("/playlist", (req, res) => {
//   return res.json(playlist);
// });

app.listen(5000, () => {
  console.log(`Server listening on PORT:3000`);
});
