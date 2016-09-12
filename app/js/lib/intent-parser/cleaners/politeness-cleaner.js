export default class PolitenessCleaner {
  clean(obj = { cleaned: '' }) {
    let cleaned = obj.cleaned
      .replace(new RegExp('^(?:Can you ' +
          '|Can you please ' +
          '|Please can you ' +
          '|Please ' +
          '|Please do ' +
          ')?remind', 'i'),
        'Remind')
      .replace(new RegExp('^(?:Can you tell me ' +
          '|Can you please tell me ' +
          '|Please tell me ' +
          '|Please do tell me ' +
          '|Tell me ' +
          ')?wh(at|ere)', 'i'),
        'Wh$1');

    if (cleaned !== obj.cleaned) {
      // Remove question mark if it was a question.
      cleaned = cleaned.replace(/\?+$/, '.');
    }

    obj.cleaned = cleaned;

    return Promise.resolve(obj);
  }
}
