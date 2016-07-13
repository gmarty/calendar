'use strict';

const p = Object.freeze({
  // Properties
  synthesis: Symbol('synthesis'),
  supportsSynthesis: Symbol('supportsSynthesis'),
  voice: Symbol('voice'),

  // Methods
  populateVoice: Symbol('populateVoice'),
});

export default class SpeechSynthesis {
  constructor() {
    const synthesis = window.speechSynthesis;

    this[p.supportsSynthesis] = !!synthesis;

    if (this[p.supportsSynthesis]) {
      this[p.synthesis] = synthesis;
      this[p.synthesis].onvoiceschanged = this[p.populateVoice].bind(this);
    } else {
      this[p.synthesis] = null;
    }

    this[p.voice] = null;

    Object.seal(this);
  }

  /**
   * Speak a text aloud.
   *
   * @param {string} text
   */
  speak(text = '') {
    if (!text) {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = this[p.voice];
    utterance.pitch = 0.8;
    utterance.rate = 0.9;

    this[p.synthesis].speak(utterance);
  }

  /**
   * From all the voices available, set the default language to English with a
   * female voice if available.
   */
  [p.populateVoice]() {
    const voices = this[p.synthesis].getVoices();

    if (!voices.length) {
      return;
    }

    const englishVoices = voices
      .filter((voice) => voice.lang === 'en' || voice.lang.startsWith('en-'));

    const femaleVoices = englishVoices
      .filter((voice) => voice.name.includes('Female'));

    if (femaleVoices.length) {
      this[p.voice] = femaleVoices[0];
    } else if (englishVoices.length) {
      this[p.voice] = englishVoices[0];
    }

    this[p.synthesis].onvoiceschanged = null;
  }
}
