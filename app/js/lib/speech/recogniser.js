'use strict';

const p = Object.freeze({
  isListening: Symbol('isListening'),
  recognition: Symbol('recognition'),
  supportsRecognition: Symbol('supportsRecognition'),
});

export default class SpeechRecogniser {
  constructor() {
    this[p.isListening] = false;

    const Recognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const supportsRecognition = !!Recognition;

    this[p.supportsRecognition] = supportsRecognition;

    if (supportsRecognition) {
      this[p.recognition] = new Recognition();
    } else {
      this[p.recognition] = null;
    }

    Object.seal(this);
  }

  listenForUtterance() {
    if (!this[p.supportsRecognition]) {
      return Promise.reject(
        new Error('Speech recognition not supported in this browser'));
    }

    return new Promise((resolve, reject) => {
      if (this[p.isListening]) {
        return reject(new Error('Speech recognition is already listening'));
      }

      this[p.isListening] = true;

      // Not using `addEventListener` here to avoid
      // `removeEventListener` everytime it's simpler
      // to just redefine `onresult` to the same effect.
      this[p.recognition].onresult = (event) => {
        this[p.recognition].stop();
        this[p.isListening] = false;

        // Always take first result
        const result = event.results[0][0];

        return resolve({
          confidence: result.confidence,
          utterance: result.transcript,
        });
      };

      this[p.recognition].onerror = (error) => {
        this[p.recognition].stop();
        this[p.isListening] = false;
        return reject(error);
      };

      this[p.recognition].start();
    });
  }
}
