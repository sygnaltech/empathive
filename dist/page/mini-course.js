"use strict";
(() => {
  // src/page/mini-course.ts
  var MiniCoursePage = class {
    constructor() {
      this.mode = 0 /* Stopped */;
    }
    setup() {
    }
    exec() {
      const playButton = document.getElementById("playButton");
      const videoElement = document.getElementById("video");
      const applyButton = document.getElementById("apply");
      const updateUI = () => {
        switch (this.mode) {
          case 2 /* Paused */:
          case 0 /* Stopped */:
            playButton.innerText = "Play video";
            break;
          case 1 /* Playing */:
            playButton.innerText = "Pause video";
            break;
        }
      };
      if (playButton && videoElement && applyButton) {
        console.log("video", videoElement);
        updateUI();
        playButton.addEventListener("click", () => {
          console.log("clicked");
          switch (this.mode) {
            case 0 /* Stopped */:
            case 2 /* Paused */:
              videoElement.play().then(() => {
                console.log("Video started playing.");
                this.mode = 1 /* Playing */;
                updateUI();
              }).catch((error) => {
                console.error("Error trying to play the video:", error);
              });
              break;
            case 1 /* Playing */:
              videoElement.pause();
              this.mode = 2 /* Paused */;
              updateUI();
              break;
          }
        });
        videoElement.addEventListener("timeupdate", () => {
          const extendedVideoElement = videoElement;
          if (extendedVideoElement.currentTime >= 10 && !extendedVideoElement.loggedTenSeconds) {
            console.log("Video has passed 10 seconds of playback.");
            extendedVideoElement.loggedTenSeconds = true;
            applyButton.classList.remove("disabled");
            applyButton.removeAttribute("disabled");
          }
        });
      } else {
        console.error("One or more elements were not found in the DOM.");
      }
    }
  };
})();
//# sourceMappingURL=mini-course.js.map
