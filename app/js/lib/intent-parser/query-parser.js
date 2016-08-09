// Mostly a dummy placeholder for now.
export default class QueryParser {
  constructor(locale = 'en') {
    this.locale = locale;

    Object.seal(this);
  }

  parse() {
    return Promise.resolve(null);
  }
}
