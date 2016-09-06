export default class ContractionsCleaner {
  clean(obj = { cleaned: '' }) {
    const cleaned = obj.cleaned
    // Unambiguous cases.
      .replace(/\blet's\b/ig, 'let us')
      .replace(/'s (been|got|gotten)\b/ig, ' has $1')
      .replace(/'s (a|an|the|this|that|not|going)\b/ig, ' is $1')
      .replace(/'d (like|love)\b/ig, ' would $1')

      // Irregular negations.
      .replace(/\bshouldn't've\b/ig, 'should not have')
      .replace(/\bwouldn't've\b/ig, 'would not have')
      .replace(/\bcouldn't've\b/ig, 'could not have')
      .replace(/\bshan't\b/ig, 'shall not')
      .replace(/\bcan't\b/ig, 'cannot')
      .replace(/\bwon't\b/ig, 'will not')

      // Regular contractions.
      .replace(new RegExp('\\b(' +
        'am|are|could|did|do|does|had|has|have|' +
        'is|might|must|should|was|were|would' +
        ')n\'t\\b', 'ig'), '$1 not')
      .replace(/'ll\b/ig, ' will')
      .replace(/'re\b/ig, ' are')
      .replace(/'ve\b/ig, ' have')
      .replace(/'m\b/ig, ' am');

    obj.cleaned = cleaned;

    return Promise.resolve(obj);
  }
}
