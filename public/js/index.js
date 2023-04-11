const createNewModal = document.querySelector(".create-new-modal");
const playlistModal = document.querySelector(".playlist-modal");
const confirmModal = document.querySelector(".confirmation");
const playlistForm = document.querySelector(".playlist-form");
const reNamePlaylistForm = document.querySelector(".rename-playlist");
const addSongModal = document.querySelector(".add-song");
const addNew = document.querySelector("#file-control-panel button.new");
const closeNewModal = document.querySelector(".create-new-modal span.close");
const closePlaylistModal = document.querySelector(".playlist-modal span.close");
const allPlaylist = document.querySelectorAll(".playlist");
const allPlaylistHeader = document.querySelectorAll(".playlist header");
const audioplayer = document.querySelector("audio");
const createPlaylistButton = document.querySelector(".playlist-form button");
const fillAll = document.querySelector(".fill_all");
const fillAllLoading = document.querySelector(".fill_all.loading");
const fillAllSuccess = document.querySelector(".fill_all.success");
const fillAllText = fillAll.querySelector(".fill_all p");
const fillAllLoadingText = fillAllLoading.querySelector(".fill_all p");
const fillAllSuccessText = fillAllSuccess.querySelector(".fill_all.success p");
const addNewSongToPlaylistBtn = document.querySelector(
  ".playlist-modal p#new-song"
);
const renameBtn = document.querySelector(".playlist-modal p#rename");
const deleteBtn = document.querySelector(".playlist-modal p#delete");
const renameFormBtn = reNamePlaylistForm.querySelector("button");
const confirmDeleteBtn = document.querySelector("#confirm-delete");
const cancelDeleteBtn = document.querySelector("#cancel");
const selectPlaylist = document.querySelector(".custom-select select");

window.addEventListener("contextmenu", function (e) {
  if (e.target.matches("div.playlist") || e.target.matches(".accordion")) {
    e.preventDefault();
    playlistModal.classList.add("open");
    playlistModal.dataset.id = e.target.dataset.name;
  }
});

window.addEventListener("click", function (e) {
  if (e.target.matches(".accordion")) {
    if (e.target.classList.contains("open")) {
      e.target.innerHTML = `
        <i class="fa-solid fa-angle-right"></i>
        <i class="fa-solid fa-folder"></i>
      `;
    } else {
      e.target.innerHTML = `
      <i class="fa-solid fa-angle-down"></i>
      <i class="fa-solid fa-folder-open"></i>
    `;
    }
    e.target.innerHTML += `
    <p class="playlist-name">${e.target.dataset.name}</p>`;
    e.target.classList.toggle("open");
    e.target.closest(".playlist").classList.toggle("open");

    const text = e.target.nextElementSibling;
    if (text.style.maxHeight) {
      text.style.maxHeight = "";
    } else {
      text.style.maxHeight = text.scrollHeight + "px";
    }
  }
});

window.addEventListener("click", function (e) {
  if (e.target.matches(".file") || e.target.matches(".file > p")) {
    audioplayer.src = e.target.dataset.name;
    audioplayer.play();
  }
});

// allPlaylistHeader.forEach((header) => {
//   console.log(header.dataset);
//   header.addEventListener("click", function (e) {
//     if (e.target.classList.contains("open")) {
//       e.target.innerHTML = `
//         <i class="fa-solid fa-angle-right"></i>
//         <i class="fa-solid fa-folder"></i>
//       `;
//     } else {
//       e.target.innerHTML = `
//       <i class="fa-solid fa-angle-down"></i>
//       <i class="fa-solid fa-folder-open"></i>
//     `;
//     }
//     e.target.innerHTML += `
//     <p class="playlist-name">${e.target.dataset.name}</p>`;
//     e.target.classList.toggle("open");
//     e.target.closest(".playlist").classList.toggle("open");
//   });

//   header.addEventListener("click", function () {
//     const text = this.nextElementSibling;
//     if (text.style.maxHeight) {
//       text.style.maxHeight = "";
//     } else {
//       text.style.maxHeight = text.scrollHeight + "px";
//     }
//   });
// });

// allPlaylist.forEach((el) => {
//   el.addEventListener("contextmenu", function (e) {
//     e.preventDefault();
//     playlistModal.classList.add("open");
//   });
// });

[
  createNewModal,
  playlistModal,
  confirmModal,
  addSongModal,
  playlistForm,
  reNamePlaylistForm,
  createNewModal,
].forEach((modal) => {
  modal.addEventListener("click", function (e) {
    e.target.classList.remove("open");
  });
});

// createNewModal.addEventListener("click", function (e) {
//   e.target.classList.remove("open");
// });

// playlistModal.addEventListener("click", function (e) {
//   e.target.classList.remove("open");
// });

// confirmModal.addEventListener("click", function (e) {
//   e.target.classList.remove("open");
// });

// addSongModal.addEventListener("click", function (e) {
//   e.target.classList.remove("open");
// });

// playlistForm.addEventListener("click", function (e) {
//   e.target.classList.remove("open");
// });

// reNamePlaylistForm.addEventListener("click", function (e) {
//   e.target.classList.remove("open");
// });

closeNewModal.addEventListener("click", function () {
  createNewModal.classList.remove("open");
});

closePlaylistModal.addEventListener("click", function (e) {
  playlistModal.classList.remove("open");
});

addNew.addEventListener("click", function (e) {
  createNewModal.classList.add("open");
});

addNewSongToPlaylistBtn.addEventListener("click", function (e) {
  playlistModal.classList.remove("open");
  let id = e.target.closest(".playlist-modal").dataset.id;
  showAddSongForm(id);
});

renameBtn.addEventListener("click", function (e) {
  let id = e.target.closest(".playlist-modal").dataset.id;
  reNamePlaylistForm.dataset.id = id;
  playlistModal.classList.remove("open");
  reNamePlaylistForm.classList.add("open");
  reNamePlaylistForm.querySelector("h2").innerHTML = `Rename ${id}`;
});

deleteBtn.addEventListener("click", function (e) {
  let id = e.target.closest(".playlist-modal").dataset.id;
  deletePlaylist(id);
});

confirmDeleteBtn.addEventListener("click", function (e) {
  let id = e.target.dataset.id;
  document.querySelector("#confirm-delete .spinner-3").style.display = "block";
  handleDelete(id);
  confirmModal.classList.remove("open");
});

cancelDeleteBtn.addEventListener("click", function (e) {
  confirmModal.classList.remove("open");
});

renameFormBtn.addEventListener("click", function (e) {
  e.preventDefault();
  let titleInput = document.querySelector(".rename-playlist #playlist_title");

  const playlistTitle = titleInput.value;
  titleInput.value = "";

  if (playlistTitle.trim().length === 0) {
    return handleFillAll("Enter valid title!");
  }

  if (playlistTitle.trim().length < 3) {
    return handleFillAll("Playlist title should be at least 3 charaacter.");
  }
  let id = reNamePlaylistForm.dataset.id;
  renamePlaylist(playlistTitle, id);
});

function showPlaylistForm() {
  playlistForm.classList.add("open");
  createNewModal.classList.remove("open");
}

createPlaylistButton.addEventListener("click", function (e) {
  e.preventDefault();
  let titleInput = document.querySelector(".playlist-form #playlist_title");

  const playlistTitle = titleInput.value;
  // titleInput.value = "";

  if (playlistTitle.trim().length === 0) {
    return handleFillAll("Enter valid title!");
  }

  if (playlistTitle.trim().length < 3) {
    return handleFillAll("Playlist title should be at least 3 charaacter.");
  }

  createPlaylist(playlistTitle, titleInput);
});

function handleFillAll(data) {
  fillAllLoading.classList.remove("show");
  fillAllText.textContent = data;
  fillAll.classList.add("show");
  let timeOut = setTimeout(() => {
    fillAll.classList.remove("show");
    clearTimeout(timeOut);
  }, 1500);
}

function handleFillLoading(data) {
  fillAllLoading.classList.remove("show");
  fillAllLoadingText.textContent = data;
  fillAllLoading.classList.add("show");
  let timeOut = setTimeout(() => {
    fillAllLoading.classList.remove("show");
    clearTimeout(timeOut);
  }, 10000);
}

function handleFillAllSuccess(data) {
  fillAllLoading.classList.remove("show");
  fillAllSuccessText.textContent = data;
  fillAllSuccess.classList.add("show");
  let timeOut = setTimeout(() => {
    fillAllSuccess.classList.remove("show");
    clearTimeout(timeOut);
  }, 1500);
}

async function createPlaylist(title, titleInput) {
  document.querySelector(".spinner-3").style.display = "block";
  let options = {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ playlistTitle: title }),
  };

  let resJson = await fetch("/playlist", options);
  let res = await resJson.json();
  if (res.status === 400) {
    document.querySelector(".spinner-3").style.display = "none";
    return handleFillAll(res.message);
  } else {
    window.playlists.push(res.data);
  }
  playlistForm.classList.remove("open");
  document.querySelector(".spinner-3").style.display = "none";
  addSinglePlaylist(res.data);
  titleInput.value = "";
  loadSelectOptions(window.playlists);
  return;
}

async function renamePlaylist(title, id) {
  document.querySelector(".rename-playlist .spinner-3").style.display = "block";
  let options = {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ playlistTitle: title }),
  };

  let resJson = await fetch(`/playlist/${id}`, options);
  let res = await resJson.json();
  if (res.status === 400 || res.status === 404) {
    document.querySelector(".rename-playlist .spinner-3").style.display =
      "none";
    return handleFillAll(res.message);
  } else {
    window.playlists = res.data;
  }
  reNamePlaylistForm.classList.remove("open");
  document.querySelector(".rename-playlist .spinner-3").style.display = "none";
  populatePlaylist();
  loadSelectOptions(window.playlists);
  return;
}

const addSinglePlaylist = (playlist) => {
  let newPlaylist = createNewPlayistElement(playlist.name);
  let newPlaylistHeader = createNewHeaderElement(playlist.name);
  let newPlaylistList = createNewPlayistListElement();
  newPlaylist.appendChild(newPlaylistHeader);
  playlistContainer.appendChild(newPlaylist);

  playlist.audios.forEach((audio) => {
    let newFile = createNewFile(audio.path);
    let newFileText = createNewFileText(audio.name, audio.path);
    newFile.appendChild(newFileText);
    newPlaylistList.appendChild(newFile);
  });
  newPlaylist.appendChild(newPlaylistList);
};

const deletePlaylist = async (id) => {
  playlistModal.classList.remove("open");
  confirmModal.classList.add("open");
  confirmModal.querySelector(
    "h2"
  ).innerHTML = `Are you sure you want to delete this playlist ${id}?`;
  confirmModal.querySelector("#confirm-delete").dataset.id = id;
};

const handleDelete = async (id) => {
  let options = {
    method: "DELETE",
  };
  try {
    let resJson = await fetch(`/playlist/${id}`, options);
    let res = await resJson.json();
    if (res.status === 400 || res.status === 404) {
      return handleFillAll(res.message);
    } else {
      window.playlists = res.data;
    }
    document.querySelector("#confirm-delete .spinner-3").style.display = "none";
    handleFillAllSuccess("Playlist Deleted Successfully");
    populatePlaylist();
    loadSelectOptions(window.playlists);
    return;
  } catch (error) {
    return handleFillAll(error.message);
  }
};

function showAddSongForm(id) {
  selectPlaylist.selectedIndex = 0;
  let selectedDiv = Array.from(
    document.querySelector(".select-items").querySelectorAll("div")
  )[0];
  if (id) {
    let selItems = Array.from(
      document.querySelector(".select-items").querySelectorAll("div")
    );
    selectedDiv = selItems.find((item) => item.innerHTML === id);
    selectedDiv.click();
  } else {
    selectedDiv.click();
  }
  createNewModal.classList.remove("open");
  addSongModal.classList.add("open");
  // loadSelectOptions(window.playlists);
}

function clickFile(target) {
  target.nextElementSibling.click();
}

function loadSelectOptions(playlists) {
  selectPlaylist.innerHTML = ` 
    <option value="null">Select Playlist</option>
  `;
  playlists.forEach((playlist) => {
    let opt = document.createElement("option");
    opt.value = `${playlist.name}`;
    opt.innerHTML = playlist.name;
    selectPlaylist.appendChild(opt);
  });
  customSelect();
}
