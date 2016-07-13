'use strict';

const p = Object.freeze({
  // Properties
  synthesis: Symbol('synthesis'),
  supportsSynthesis: Symbol('supportsSynthesis'),
  preferredVoice: Symbol('preferredVoice'),
  initialised: Symbol('initialised'),

  // Methods
  setPreferredVoice: Symbol('setPreferredVoice'),
});

const VOICE_PITCH = 0.8;
const VOICE_RATE = 0.9;

export default class SpeechSynthesis {
  constructor() {
    const synthesis = window.speechSynthesis;

    this[p.initialised] = false;
    this[p.supportsSynthesis] = !!synthesis;
    this[p.preferredVoice] = null;

    if (this[p.supportsSynthesis]) {
      this[p.synthesis] = synthesis;
      this[p.setPreferredVoice]();
      this[p.synthesis].onvoiceschanged = this[p.setPreferredVoice].bind(this);
    } else {
      this[p.synthesis] = null;
    }

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

    if (this[p.preferredVoice]) {
      // Use a preferred voice if available.
      utterance.voice = this[p.preferredVoice];
    }
    utterance.lang = 'en';
    utterance.pitch = VOICE_PITCH;
    utterance.rate = VOICE_RATE;

    this[p.synthesis].speak(utterance);
  }

  /**
   * From all the voices available, set the default language to English with a
   * female voice if available.
   */
  [p.setPreferredVoice]() {
    if (this[p.initialised]) {
      return;
    }

    const voices = this[p.synthesis].getVoices();

    if (!voices.length) {
      return;
    }

    const englishVoices = voices
      .filter((voice) => voice.lang === 'en' || voice.lang.startsWith('en-'));

    const femaleVoices = englishVoices
      .filter((voice) => voice.name.includes('Female'));

    if (femaleVoices.length) {
      this[p.preferredVoice] = femaleVoices[0];
    } else if (englishVoices.length) {
      this[p.preferredVoice] = englishVoices[0];
    }

    this[p.initialised] = true;
    this[p.synthesis].onvoiceschanged = null;
  }
}
