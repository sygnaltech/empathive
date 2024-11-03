
/*
 * Page | Mini-Course
 */

import { IRouteHandler } from "@sygnal/sse";
 
enum Mode {
  Stopped,
  Playing,
  Paused
}

export class MiniCoursePage implements IRouteHandler {

  mode: Mode = Mode.Stopped; 

  constructor() {
  }

  setup() {
        
  }

  exec() {

    const playButton = document.getElementById('playButton') as HTMLButtonElement | null;
    const videoElement = document.getElementById('video') as HTMLVideoElement | null;
    const applyButton = document.getElementById('apply') as HTMLButtonElement | null;

    // Nested function within exec that has access to exec scope
    const updateUI = () => {

      switch(this.mode) {
        case Mode.Paused:
        case Mode.Stopped:
          playButton!.innerText = "Play video";
          break;
        case Mode.Playing:
          playButton!.innerText = "Pause video";
          break;
      }

    }
    
    if (playButton && videoElement && applyButton) {
      console.log("video", videoElement);
    
      updateUI(); 

      // Play button click event listener
      playButton.addEventListener('click', () => {
        console.log('clicked');

        switch(this.mode) {
          case Mode.Stopped:
          case Mode.Paused:
            videoElement.play()
              .then(() => {
                console.log("Video started playing.");
                this.mode = Mode.Playing;
                updateUI(); 
              })
              .catch((error) => {
                console.error("Error trying to play the video:", error);
              });
            break;
          case Mode.Playing:
            videoElement.pause(); 
            this.mode = Mode.Paused;
            updateUI(); 
            break;
        }

      });
    
      // Add an event listener for the timeupdate event
      videoElement.addEventListener('timeupdate', () => {
        const extendedVideoElement = videoElement as HTMLVideoElement & { loggedTenSeconds?: boolean };
    
        if (extendedVideoElement.currentTime >= 10 && !extendedVideoElement.loggedTenSeconds) {
          console.log("Video has passed 10 seconds of playback.");
          extendedVideoElement.loggedTenSeconds = true; // Avoid logging more than once
    
          // Enable the button
          applyButton.classList.remove('disabled');
          applyButton.removeAttribute('disabled');
        }
      });
    } else {
      console.error("One or more elements were not found in the DOM.");
    }

  }

}
