'use strict';

/*
Examples of phrases to detect and parse:
[Remind] me [to] pick Sasha from Santa Clara University [at] 5PM today.
[Remind] me [that] it is picnic day [on] July 4th.
[Remind] us [to] go to the opera [at] 7:15pm on 2nd February.
[Remind] us [to] go at my mum's [at] 11:30am on 31st July.
[Remind] everybody [to] pack their stuff [by] next Friday 5pm.
*/

const pattern = {
  regexp: new RegExp('^Remind\\b([^to]+)\\bto\\b(.+)\\bat\\b(.+)$', 'iu'),
  placeholders: {
    user: 0,
    action: 1,
    time: 2,
  },
  // @see http://www.unicode.org/cldr/charts/29/summary/en.html#4
  punctuation: new RegExp(
    `[-‐–—,;:!?.…'‘’"“”()\\[\\]§@*/&#†‡′″]+$`, 'u'),
};

export default class IntentParser {
  parse(string = '') {
    string = this.normalise(string);

    if (!string) {
      return Promise.reject('Empty string.');
    }

    if (!pattern.regexp.test(string)) {
      return Promise.reject('Unsupported intent format.');
    }

    const segments = pattern.regexp.exec(string);
    segments.shift();

    const user = this.extractRecipient(segments[pattern.placeholders.user]);
    const action = this.extractAction(segments[pattern.placeholders.action]);
    const time = this.extractDatetime(segments[pattern.placeholders.time]);

    return Promise.resolve({ user, action, time });
  }

  extractRecipient(string = '') {
    return [string.trim()];
  }

  extractAction(string = '') {
    return string.trim();
  }

  extractDatetime(string = '') {
    return string.trim();
  }

  normalise(string = '') {
    string = string.replace(/\s+/g, ' '); // Normalise whitespaces to space.
    string = string.trim();
    string = string.replace(pattern.punctuation, ''); // Strip punctuations.

    return string;
  }
}
