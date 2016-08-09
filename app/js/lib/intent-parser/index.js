import ReminderParser from './reminder-parser';
import QueryParser from './query-parser';

const p = Object.freeze({
  // Properties
  parsers: Symbol('parsers'),
});

export default class IntentParser {
  constructor() {
    this[p.parsers] = [
      new ReminderParser(),
      new QueryParser(),
    ];

    window.intentParser = this;
  }

  parse(phrase = '') {
    const promises = this[p.parsers]
      .map((parser) => parser.parse(phrase));

    // Return the first non null parsed result.
    return Promise.all(promises)
      .then((results) => results.find((result) => !!result))
      .then((result) => result || null);
  }
}
