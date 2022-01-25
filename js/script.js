const ul = document.getElementById("song-list");
const slider = document.querySelector(".slider");
const showCurrent = document.getElementById("current-time");
const showDuration = document.getElementById("duration");
const leftTitle = document.getElementById("title-left");
const leftArtist = document.getElementById("artist-left");
const mainCover = document.getElementById("main-cover");
const leftCover = document.getElementById("left-cover");
const playbackControl = document.querySelector(".playback-control");
const btnShowLrc = document.getElementById("show-lrc");
const btnShowLrc2 = document.getElementById("show-lrc2");
const btnAudioControl = document.getElementById("audio-control");
const lyrics = document.getElementById("lyrics");
const songs = api.songs;

const playBtn = document.getElementById("play");
const skipStart = document.getElementById("skip-start");
const skipEnd = document.getElementById("skip-end");
const playBtnSm = document.getElementById("play-small");
const skipEndSm = document.getElementById("skip-end-small");

let photoUrl;
let timerInterval, sliderInterval;
let currentIndex;
let audio = new Audio();
// let lrc = new Lyrics();

songs.forEach((el, index) => {
  ul.innerHTML += `
  <li>
  <span>${index + 1}.</span>
  <span>${el.title}</span>
  <span>${el.duration}</span>
  </li>
`;
});

let lessThanTen = (n) => (n < 10 ? "0" : "") + n;

let play = (path) => {
  audio.src = path;

  // show total duration of song
  audio.onloadedmetadata = () => {
    let duration = audio.duration;
    slider.max = duration;
    let minutes = Math.floor(duration / 60);
    let seconds = Math.floor(duration - minutes * 60);
    minutes = lessThanTen(minutes);
    seconds = lessThanTen(seconds);
    showDuration.innerText = `${minutes}:${seconds}`;
  };

  if (audio.paused) {
    playBtn.firstElementChild.classList.remove("bi-play-circle");
    playBtn.firstElementChild.classList.add("bi-pause-circle");
    playBtnSm.firstElementChild.classList.remove("bi-play-circle");
    playBtnSm.firstElementChild.classList.add("bi-pause-circle");
    audio.play();
    // console.log("Audio is playing");
    timerInterval = setInterval(showCurrentTime, 1000);
    sliderInterval = setInterval(updateSlider, 1000);
  } else {
    audio.pause();
    // console.log("Audio paused");
    clearInterval(timerInterval);
    clearInterval(sliderInterval);
  }
};

let showCurrentTime = () => {
  let time = audio.currentTime;
  let csec, cmin;
  if (time < 60) {
    csec = Math.floor(time);
    cmin = 0;
  } else {
    cmin = Math.floor(time / 60);
    csec = Math.floor(time - cmin * 60);
  }
  csec = lessThanTen(csec);
  cmin = lessThanTen(cmin);
  showCurrent.innerText = `${cmin}:${csec}`;
};

let updateSlider = () => (slider.value = audio.currentTime);

slider.addEventListener("input", () => {
  audio.currentTime = slider.value;
  showCurrentTime;
});

let initPlay = (index) => {
  let element = songs[index];
  if (audio.paused) {
    play(element.url);
    lyrics.innerText = "";
    showLyric(element.lrcUrl);
  } else {
    audio.pause();
    play(element.url);
    lyrics.innerText = "";
    showLyric(element.lrcUrl);
  }
  setTimeout(() => {
    document.getElementById(
      "main"
    ).style.backgroundImage = `url(${element.photoUrl})`;
  }, 100);
  mainCover.src = `${element.photoUrl}`;
  leftCover.src = `${element.photoUrl}`;
  leftTitle.innerText = `${element.title}`;
  leftArtist.innerText = `${element.author}`;
};

document.querySelectorAll("li").forEach((el) => {
  el.addEventListener("click", () => {
    let index = el.innerText.split("\n")[0] - 1;
    currentIndex = index;
    initPlay(index);
    playbackControl.style.maxHeight = "10vh";
  });
});

playBtn.addEventListener("click", () => {
  if (playBtn.firstElementChild.classList.contains("bi-play-circle")) {
    playBtn.firstElementChild.classList.remove("bi-play-circle");
    playBtn.firstElementChild.classList.add("bi-pause-circle");
    audio.play();
  } else {
    playBtn.firstElementChild.classList.remove("bi-pause-circle");
    playBtn.firstElementChild.classList.add("bi-play-circle");
    audio.pause();
  }
});

playBtnSm.addEventListener("click", () => {
  if (playBtnSm.firstElementChild.classList.contains("bi-play-circle")) {
    playBtnSm.firstElementChild.classList.remove("bi-play-circle");
    playBtnSm.firstElementChild.classList.add("bi-pause-circle");
    audio.play();
  } else {
    playBtnSm.firstElementChild.classList.add("bi-play-circle");
    playBtnSm.firstElementChild.classList.remove("bi-pause-circle");
    audio.pause();
  }
});

skipEnd.addEventListener("click", () => {
  if (!audio.paused) {
    audio.pause;
    if (currentIndex < 6) {
      initPlay(currentIndex + 1);
      currentIndex++;
    } else {
      initPlay(0);
      currentIndex = 0;
    }
  } else {
    if (currentIndex < 6) {
      initPlay(currentIndex + 1);
      currentIndex++;
    } else {
      initPlay(0);
      currentIndex = 0;
    }
  }
});

skipEndSm.addEventListener("click", () => {
  if (!audio.paused) {
    audio.pause;
    if (currentIndex < 6) {
      initPlay(currentIndex + 1);
      currentIndex++;
    } else {
      initPlay(0);
      currentIndex = 0;
    }
  } else {
    if (currentIndex < 6) {
      initPlay(currentIndex + 1);
      currentIndex++;
    } else {
      initPlay(0);
      currentIndex = 0;
    }
  }
});

skipStart.addEventListener("click", () => {
  if (!audio.paused) {
    audio.pause;
    if (currentIndex > 0) {
      initPlay(currentIndex - 1);
      currentIndex--;
    } else {
      initPlay(6);
      currentIndex = 6;
    }
  } else {
    if (currentIndex > 0) {
      initPlay(currentIndex - 1);
      currentIndex--;
    } else {
      initPlay(6);
      currentIndex = 6;
    }
  }
});

btnShowLrc.addEventListener("click", () => {
  if (
    playbackControl.style.overflow == "hidden" ||
    playbackControl.style.overflow == ""
  ) {
    playbackControl.style.overflow = "visible";
  } else {
    playbackControl.style.overflow = "hidden";
  }
});

btnShowLrc2.addEventListener("click", () => {
  if (
    playbackControl.style.overflow == "hidden" ||
    playbackControl.style.overflow == ""
  ) {
    playbackControl.style.overflow = "visible";
  } else {
    playbackControl.style.overflow = "hidden";
  }
});

let showLyric = (path) => {
  let lrc = new Lyric({
    onPlay: function (line, text) {
      lyrics.innerHTML = text;
      console.log(text);
    },
  });

  fetch(path)
    .then((response) => response.text())
    .then((data) => {
      // Do something with your data
      // console.log(data);
      lrc.setLyric(data);
      lrc.play(audio.currentTime * 1000);
    });

  slider.addEventListener("input", () => {
    lrc.play(audio.currentTime * 1000);
  });

  audio.onpause = () => lrc.pause();
  audio.onplay = () => lrc.play(audio.currentTime * 1000);
};
