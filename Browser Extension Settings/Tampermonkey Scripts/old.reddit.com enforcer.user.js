// ==UserScript==
// @name         old.reddit.com enforcer
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Load old.reddit.com instead
// @author       You
// @match        https://reddit.com/*
// @match        https://www.reddit.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
    var aelem = document.createElement('a');
    aelem.href = document.location.href
    aelem.hostname = "old.reddit.com"
    document.location.replace(aelem.href);
})();