// ==UserScript==
// @name         Original PogChamp
// @version      1.0
// @description  Use old PogChamp emote
// @author       Bird
// @match        *://twitch.tv/*
// @match        *://*.twitch.tv/*
// @grant        none
// ==/UserScript==

(function() {
    function getImagesByAlt(alt) {
        var allImages = document.getElementsByTagName("img");
        var images = [];
        for (var i = 0, len = allImages.length; i < len; ++i) {
            if (allImages[i].alt === alt) {
                images.push(allImages[i]);
            }
        }
        return images;
    }

    setInterval(function(){
        var PogChamps = getImagesByAlt('PogChamp');
        PogChamps.forEach(function(champ){
            if(champ.classList.contains('emote-picker__image') || champ.classList.contains('emote-picker__emote-image')){
                champ.src = "https://cdn.discordapp.com/attachments/604830051430825994/844055980639256627/1x.png";
                champ.srcset = "https://cdn.discordapp.com/attachments/604830051430825994/844055980639256627/1x.png 1.0x";

            }if(champ.classList.contains('chat-line__message--emote')){
                champ.src = "https://cdn.discordapp.com/attachments/604830051430825994/844055980639256627/1x.png";
                champ.srcset = "https://cdn.discordapp.com/attachments/604830051430825994/844055980639256627/1x.png 1x";
            }
        })
    },100)
})();