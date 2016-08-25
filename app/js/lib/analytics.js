/* global ga */

export default class Analytics {
  constructor() {
    window.ga = window.ga || function() {
        (ga.q = ga.q || []).push(arguments);
      };
    ga.l = Date.now();
    ga('create', 'UA-83150540-1', 'auto');
    ga('send', 'pageview');
  }
}
