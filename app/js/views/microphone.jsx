import React from 'components/react';

export default class Microphone extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isListeningToSpeech: false,
    };

    this.speechController = props.speechController;
    this.server = props.server;
    this.analytics = props.analytics;

    this.audioCtx = new window.AudioContext();
    this.audioBuffer = null;
    this.bufferSource = null;
    this.timeout = null;

    this.startListeningToSpeech = this.startListeningToSpeech.bind(this);
    this.stopListeningToSpeech = this.stopListeningToSpeech.bind(this);
    this.onClickMic = this.onClickMic.bind(this);
  }

  componentDidMount() {
    this.loadAudio();

    //this.speechController.on('wakeheard', this.startListeningToSpeech);
    this.speechController.on('speechrecognitionstop',
      this.stopListeningToSpeech);
  }

  componentWillUnmount() {
    //this.speechController.off('wakeheard', this.startListeningToSpeech);
    this.speechController.off('speechrecognitionstop',
      this.stopListeningToSpeech);
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

  startListeningToSpeech() {
    this.playBleep();
    this.setState({ isListeningToSpeech: true });
  }

  stopListeningToSpeech() {
    this.stopBleep();
    this.setState({ isListeningToSpeech: false });
  }

  onClickMic() {
    if (!this.state.isListeningToSpeech) {
      this.analytics.event('microphone', 'tap', 'start-listening');

      this.playBleep();
      this.setState({ isListeningToSpeech: true });
      this.timeout = setTimeout(() => {
        // When the sound finished playing
        this.stopBleep();
        this.speechController.startSpeechRecognition();
      }, 1000);
      return;
    }

    this.analytics.event('microphone', 'tap', 'stop-listening');

    clearTimeout(this.timeout);
    this.stopBleep();
    this.setState({ isListeningToSpeech: false });
    this.speechController.stopSpeechRecognition();
  }

  render() {
    if (!this.server.isLoggedIn) {
      return null;
    }

    const className = this.state.isListeningToSpeech ? 'listening' : '';

    return (
      <div className={className} onClick={this.onClickMic}>
        <div className="microphone__background"></div>
        <img className="microphone__icon" src="css/icons/microphone.svg"/>
      </div>
    );
  }
}

Microphone.propTypes = {
  speechController: React.PropTypes.object.isRequired,
  server: React.PropTypes.object.isRequired,
  analytics: React.PropTypes.object.isRequired,
};
