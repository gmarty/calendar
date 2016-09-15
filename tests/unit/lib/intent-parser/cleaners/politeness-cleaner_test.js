import ContractionsCleaner from
  'js/lib/intent-parser/cleaners/contractions-cleaner';

describe('ContractionsCleaner', () => {
  describe('Removes English contradictions when not ambiguous.', () => {
    const fixtures = [
      [
        'Let\'s go the party.',
        'Let us go the party.',
      ],
      [
        'He\'s been there.',
        'He has been there.',
      ],
      [
        'Everything\'s going well.',
        'Everything is going well.',
      ],
      [
        'Children\'s reading activities',
        'Children\'s reading activities', // Must remain unchanged.
      ],
      [
        'Because we can\'t not ♫',
        'Because we cannot not ♫',
      ],
      [
        'I\'ll survive!',
        'I will survive!',
      ],
      [
        'Thunderbirds\'re go!',
        'Thunderbirds are go!',
      ],
      [
        'You\'ve got mail.',
        'You have got mail.',
      ],
      [
        'I\'m what I\'m!',
        'I am what I am!',
      ],
    ];

    fixtures.forEach(([input, output]) => {
      it(output, () => {
        const contractionsCleaner = new ContractionsCleaner();
        return contractionsCleaner.clean({ cleaned: input }).then((result) => {
          assert.equal(result.cleaned, output);
        });
      });
    });
  });
});
