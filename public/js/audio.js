const addSongForm = document.forms["add-song-form"];
const playlistTitle = addSongForm.querySelector("select");
const audioPlayer = document.querySelector("audio");
let fileInput = document.querySelector(`input#audio`);
let thumbnailInput = document.querySelector(`input#thumbnail`);
let audioFile;
let thumbnail;
let reader = new FileReader();
let formData = new FormData();
let newAudio = document.createElement("audio");
let corrupted = true;

addSongForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  let name = playlistTitle.options[playlistTitle.selectedIndex].value;

  if (!playlistTitle.selectedIndex) {
    return handleFillAll("Choose a playlist");
  }

  if (formData.has("playlistName")) {
    formData.set("playlistName", name);
  } else {
    formData.append("playlistName", name);
  }

  if (!formData.has("audio") || !audioFile) {
    return handleFillAll("Choose an audio file");
  }

  if (!formData.has("thumbnail") || !thumbnail) {
    return handleFillAll("Choose a thumbnail");
  }

  if (corrupted) {
    return handleFillAll("Corruption check not completed!");
  }

  let options = {
    method: "POST",
    body: formData,
  };
  document.querySelector("#submit-add-song-btn .spinner-3").style.display =
    "block";

  let res = await fetch("/media", options);
  let result = await res.json();
  if (result.status === 201) {
    let currentPlaylist = document.querySelector(
      `.playlist[data-name="${result.data.playlistName}"]`
    );
    updateCurrentPlaylist(currentPlaylist, result.data);

    window.playlists = window.playlists.map((playlist) => {
      if (playlist.name === result.data.playlistName) {
        let newSong = {
          name: result.data.name,
          path: result.data.path,
          thumbnail: result.data.thumbnail,
        };
        playlist.audios.push(newSong);
      }
      return playlist;
    });
    // populatePlaylist();
    // currentPlaylist.querySelector("header").click();
    resetForm();
    document.querySelector("#submit-add-song-btn .spinner-3").style.display =
      "none";
    addSongModal.classList.remove("open");
    return handleFillAllSuccess(result.message);
  } else {
    document.querySelector("#submit-add-song-btn .spinner-3").style.display =
      "none";
    return handleFillAll(result.message);
  }
});

fileInput.addEventListener("change", function (e) {
  if (!this.files[0]) {
    formData.delete("audio");
    formData.delete("audioName");
    fileInput.value = "";
    audioFile = null;
    return;
  }

  if (this.files[0].type !== "audio/mpeg") {
    formData.delete("audio");
    formData.delete("audioName");
    fileInput.value = "";
    audioFile = null;
    return handleFillAll("Invalid file type");
  }

  audioFile = this.files[0];
  addListeners(reader);
  reader.readAsDataURL(audioFile);
  if (formData.has("audio") && formData.has("audioName")) {
    formData.set("audio", audioFile);
    formData.set("audioName", audioFile.name);
  } else {
    formData.append("audio", audioFile);
    formData.append("audioName", audioFile.name);
  }

  // console.log("Called");
  // // reader.onload = () => {
  // //   console.log("Called after load");
  // //   newAudio.src = reader.result;
  // //   console.log(newAudio);
  // //   reader.abort();
  // // };
  // reader.onerror = () => {
  //   console.log("Error occured while reading file.");
  // };
});

thumbnailInput.addEventListener("change", function (e) {
  if (!this.files[0]) {
    formData.delete("thumbnail");
    formData.delete("thumbnailName");
    thumbnailInput.value = "";
    thumbnail = null;
    return;
  }

  if (!this.files[0].type.includes("image/")) {
    formData.delete("thumbnail");
    formData.delete("thumbnailName");
    thumbnailInput.value = "";
    thumbnail = null;
    return handleFillAll("Invalid file type");
  }

  if (this.files[0].size > 2097152) {
    formData.delete("thumbnail");
    formData.delete("thumbnailName");
    thumbnailInput.value = "";
    thumbnail = null;
    return handleFillAll("Thumbnail cannot be greater than 2MB");
  }

  thumbnail = this.files[0];
  if (formData.has("thumbnail") && formData.has("thumbnailName")) {
    formData.set("thumbnail", thumbnail);
    formData.set("thumbnailName", thumbnail.name);
  } else {
    formData.append("thumbnail", thumbnail);
    formData.append("thumbnailName", thumbnail.name);
  }
  // reader.readAsDataURL(thumbnail);
  // reader.onload = () => {
  //   // audioPlayer.src = reader.result;
  //   // audioPlayer.play();
  //   reader.abort();
  // };
});

const updateCurrentPlaylist = (currentPlaylist, { name, path, thumbnail }) => {
  let currentPlaylistList = currentPlaylist.querySelector(".list");
  let newFile = createNewFile(path);
  let newFileText = createNewFileText(name.substr(0, 20), path);
  newFile.appendChild(newFileText);
  currentPlaylistList.appendChild(newFile);
  currentPlaylistList.style.maxHeight = currentPlaylistList.scrollHeight + "px";
};

const resetForm = () => {
  formData = new FormData();
  thumbnail = null;
  audioFile = null;
  thumbnailInput.value = "";
  fileInput.value = "";
};

let errorTimeout;

const errorHandler = () => {
  errorTimeout = setTimeout(() => {
    formData.delete("audio");
    formData.delete("audioName");
    fileInput.value = "";
    audioFile = null;
    reader.abort();
    corrupted = true;
    return handleFillAll("An error occured! Please Try again");
  }, 5000);
};
function handleEvent(event) {
  console.log(`${event.type}: ${event.loaded} bytes transferred\n`);
  if (event.type === "loadstart") {
    corrupted = true;
    errorHandler();
    return handleFillLoading("Corruption check...");
  }

  if (event.type === "load") {
    newAudio.src = reader.result;
    corrupted = false;
  }

  if (event.type === "loadend" && !corrupted) {
    setTimeout(() => {
      corrupted = false;
      clearTimeout(errorTimeout);
      reader.abort();
      return handleFillAllSuccess("Valid File...");
    }, 2000);
  }

  // if (event.type === "error") {
  //   return handleFillAll("An error occured! Please Try again");
  // }
}

function addListeners(reader) {
  reader.addEventListener("loadstart", handleEvent);
  reader.addEventListener("load", handleEvent);
  reader.addEventListener("loadend", handleEvent);
  reader.addEventListener("progress", handleEvent);
  reader.addEventListener("error", handleEvent);
  reader.addEventListener("abort", handleEvent);
}
