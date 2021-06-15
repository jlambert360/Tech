// ==UserScript==
// @name         Redirect to youtube channel video page
// @version      1.0
// @description  Redirect to youtube channel video page
// @author       Bird
// @match        *://*.youtube.com/*
// @match        *://youtube.com/*
// @require      https://code.jquery.com/jquery-latest.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('mouseover', getLink);

  function getLink(linkElement) {
    var url = linkElement.target.toString();

    if ((url.search(/www.youtube.com/) != -1) && (url.match(/\//g).length < 5)) {
      if ((url.match(/https:\/\/www.youtube.com\/channel\//i) && (/videos/.test(url) == false))) {
        changeLink(linkElement);
      }
      else if ((url.match(/https:\/\/www.youtube.com\/c\//i) && (/videos/.test(url) == false))) {
        changeLink(linkElement);
      }
      else if ((url.match(/https:\/\/www.youtube.com\/user\//i) && (/videos/.test(url) == false))) {
        changeLink(linkElement);
      }
    }
  }

  function changeLink(linkElement) {
    var newUrl = linkElement.target.toString().concat("/videos");
    linkElement.target.href = newUrl;
  }
})();