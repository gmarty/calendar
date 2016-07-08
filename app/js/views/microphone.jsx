import React from 'components/react';

export default class Microphone extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isListening: false,
    };

    this.speechController = props.speechController;
    this.server = props.server;
    this.bleep = new Audio();

    this.bleep.src = 'media/cue.wav';

    this.speechController.on('wakeheard', () => {
      this.bleep.pause();
      this.bleep.currentTime = 0;
      this.bleep.play();
      this.setState({ isListening: true });
    });
    this.speechController.on('speechrecognitionstop', () => {
      this.setState({ isListening: false });
    });

    this.click = this.click.bind(this);
  }

  click() {
    if (!this.state.isListening) {
      this.bleep.pause();
      this.bleep.currentTime = 0;
      this.bleep.play();
      this.setState({ isListening: true });
      this.speechController.startSpeechRecognition();
      return;
    }

    this.bleep.pause();
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
