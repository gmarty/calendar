define(function(){"use strict";require.config({map:{"*":{react:"components/react"}}});var e=[];"URLSearchParams"in self||e.push("polyfills/url-search-params"),"fetch"in self||e.push("polyfills/fetch"),e.push("polyfills/webrtc-adapter");var r=e.length?require(e):Promise.resolve();r.then(function(){return require(["js/app.js"])})});
//# sourceMappingURL=bootstrap.js.map
