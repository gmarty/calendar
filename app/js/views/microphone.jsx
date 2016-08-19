import React from 'components/react';

export default class Microphone extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isListening: false,
    };

    this.speechController = props.speechController;
    this.server = props.server;
    this.audioCtx = new window.AudioContext();
    this.audioBuffer = null;
    this.bufferSource = null;

    this.loadAudio();

    this.speechController.on('wakeheard', () => {
      this.playBleep();
      this.setState({ isListening: true });
    });
    this.speechController.on('speechrecognitionstop', () => {
      this.setState({ isListening: false });
    });

    this.click = this.click.bind(this);
  }

  loadAudio() {
    fetch('media/cue.wav')
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.status);
        }

        return res.arrayBuffer();
      })
      .then((arrayBuffer) => {
        this.audioCtx.decodeAudioData(arrayBuffer, (buffer) => {
          this.audioBuffer = buffer;
        }, (err) => {
          console.error('The audio buffer could not be decoded.', err);
        });
      });
  }

  playBleep() {
    if (!this.audioBuffer) {
      return;
    }

    this.bufferSource = this.audioCtx.createBufferSource();
    this.bufferSource.buffer = this.audioBuffer;
    this.bufferSource.connect(this.audioCtx.destination);
    this.bufferSource.start(0);
  }

  stopBleep() {
    if (!this.bufferSource) {
      return;
    }

    this.bufferSource.stop(0);
    this.bufferSource = null;
  }

  click() {
    if (!this.state.isListening) {
      this.playBleep();
      this.setState({ isListening: true });
      this.speechController.startSpeechRecognition();
      return;
    }

    this.stopBleep();
    this.setState({ isListening: false });
    this.speechController.stopSpeechRecognition();
  }

  render() {
    if (!this.server.isLoggedIn) {
      return null;
    }

    const className = this.state.isListening ? 'listening' : '';

    return (
      <div className={className} onClick={this.click}>
        <div className="microphone__background"></div>
        <img className="microphone__icon" src="css/icons/microphone.svg"/>
      </div>
    );
  }
}

Microphone.propTypes = {
  speechController: React.PropTypes.object.isRequired,
  server: React.PropTypes.object.isRequired,
};
