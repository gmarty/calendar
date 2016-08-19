import React from 'components/react';

export default class FullScreen extends React.Component {
  constructor(props) {
    super(props);

    this.fullScreenEnabled =
      (document.fullscreenEnabled ||
      document.mozFullscreenEnabled || document.mozFullScreenEnabled ||
      document.webkitFullscreenEnabled || document.msFullscreenEnabled);

    this.onFullScreen = this.onFullScreen.bind(this);
  }

  get isFullScreen() {
    return !!document.fullscreenElement ||
      document.mozFullScreenElement || document.webkitFullscreenElement ||
      document.msFullscreenElement;
  }

  onFullScreen() {
    if (this.isFullScreen) {
      return;
    }

    const target = document.body;

    if (target.requestFullscreen) {
      target.requestFullscreen();
    } else if (target.msRequestFullscreen) {
      target.msRequestFullscreen();
    } else if (target.mozRequestFullScreen) {
      target.mozRequestFullScreen();
    } else if (target.mozRequestFullscreen) {
      target.mozRequestFullscreen();
    } else if (target.webkitRequestFullscreen) {
      target.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }

    [
      'fullscreenchange',
      'mozfullscreenchange',
      'webkitfullscreenchange',
      'MSFullscreenChange',
    ].forEach((type) => {
      document.addEventListener(type, () => {
        if (!this.isFullScreen) {
          return;
        }

        // If we're in fullscreen mode, let's try to lock the orientation.
        if (screen && 'orientation' in screen && 'lock' in screen.orientation) {
          screen.orientation.lock('landscape')
            .catch(() => {
              // Don't panic. We're probably just on desktop.
            });
        }
      });
    });
  }

  render() {
    if (!this.fullScreenEnabled || this.isFullScreen) {
      return null;
    }

    return (
      <button className="full-screen__button"
              onClick={this.onFullScreen}>
        Full screen
      </button>
    );
  }
}
