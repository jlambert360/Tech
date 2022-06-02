// ==UserScript==
// @namespace       https://github.com/raingart/Nova-YouTube-extension/
// @name            Nova YouTube
// @version         0.27.0.3
// @description     YouTube Enhancer

// @author          raingart <raingart+scriptaddons@protonmail.com>
// @license         Apache-2.0
// @icon            https://raw.github.com/raingart/Nova-YouTube-extension/master/icons/48.png

// @homepageURL     https://github.com/raingart/Nova-YouTube-extension
// @supportURL      https://github.com/raingart/Nova-YouTube-extension/issues
// @contributionURL https://www.patreon.com/raingart

// @include         http*://*.youtube.com/*
// @include         http*://*.youtube-nocookie.com/*
// @include         http*://raingart.github.io/options.html*

// @exclude         http*://*.youtube.com/*.xml*
// @exclude         http*://*.youtube.com/error*
// @exclude         http*://music.youtube.com/*
// @exclude         http*://accounts.youtube.com/*

// @grant           GM_addStyle
// @grant           GM_getResourceText
// @grant           GM_getResourceURL
// @grant           GM_addValueChangeListener
// @grant           GM_removeValueChangeListener
// @grant           GM_listValues
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_deleteValue
// @grant           GM_registerMenuCommand
// @grant           GM_unregisterMenuCommand
// @grant           GM_notification
// @grant           GM_openInTab

// @run-at          document-start

// @compatible      chrome >=80 Violentmonkey,Tampermonkey
// @compatible      firefox >=74 Tampermonkey
// ==/UserScript==
/*jshint esversion: 6 */
try {
   // throw 'test';
   document?.body;
} catch (error) {
   return alert(GM_info.script.name + ' Error!\nYour browser does not support chaining operator.');
}
if (GM_info?.scriptHandler == 'Greasemonkey') alert(GM_info.script.name + ' Error!\nGreasemonkey is not supported.');
window.nova_plugins = [];
window.nova_plugins.push({
   id: 'comments-visibility',
   title: 'Hide comments section',
   'title:zh': '隐藏评论',
   'title:ja': 'コメントを隠す',
   'title:ko': '댓글 섹션 숨기기',
   'title:es': 'Ocultar la sección de comentarios',
   'title:pt': 'Ocultar seção de comentários',
   'title:fr': 'Masquer la section des commentaires',
   // 'title:tr': 'Yorumlar bölümünü gizle',
   'title:de': 'Kommentarbereich ausblenden',
   run_on_pages: 'watch, -mobile',
   restart_on_transition: true,
   section: 'comments',
   // desc: '',
   _runtime: user_settings => {

      NOVA.preventVisibilityElement({
         selector: '#comments',
         title: 'comments',
         remove: user_settings.comments_visibility_mode == 'disable' ? true : false,
      });

   },
   options: {
      comments_visibility_mode: {
         _tagName: 'select',
         label: 'Mode',
         'label:zh': '模式',
         'label:ja': 'モード',
         'label:ko': '방법',
         'label:es': 'Modo',
         'label:pt': 'Modo',
         // 'label:fr': 'Mode',
         // 'label:tr': 'Mod',
         'label:de': 'Modus',
         options: [
            { label: 'collapse', value: 'hide', selected: true },
            { label: 'remove', value: 'disable' },
         ],
      },
   }
});
window.nova_plugins.push({
   id: 'comments-popup',
   title: 'Comments section in popup',
   'title:zh': '弹出窗口中的评论部分',
   'title:ja': 'ポップアップのコメントセクション',
   'title:ko': '팝업의 댓글 섹션',
   'title:es': 'Sección de comentarios en ventana emergente',
   'title:pt': 'Seção de comentários no pop-up',
   'title:fr': 'Section des commentaires dans la fenêtre contextuelle',
   // 'title:tr': 'Açılır pencerede yorumlar bölümü',
   'title:de': 'Kommentarbereich im Popup',
   run_on_pages: 'watch, -mobile',
   section: 'comments',
   // desc: '',
   _runtime: user_settings => {

      // contents is empty
      // #comments:not([hidden]) > #sections > #contents:not(:empty)

      // bug if DESCRIPTION_SELECTOR is empty. Using CSS is impossible to fix. And through JS extra
      // test example: https://www.youtube.com/watch?v=CV_BR1tfdCo

      const COMMENTS_SELECTOR = 'html:not(:fullscreen) #comments:not([hidden])';

      NOVA.waitElement('#masthead-container')
         .then(masthead => {

            NOVA.css.push(
               `${COMMENTS_SELECTOR},
               ${COMMENTS_SELECTOR}:before {
                  position: fixed;
                  top: ${masthead.offsetHeight || 56}px;
                  right: 0;
                  z-index: ${Math.max(
                  getComputedStyle(masthead)['z-index'],
                  getComputedStyle(movie_player)['z-index'],
                  601) + 1};
               }

               /* button */
               ${COMMENTS_SELECTOR}:not(:hover):before {
                  content: "comments ▼";
                  cursor: pointer;
                  visibility: visible;
                  /*transform: rotate(-90deg) translateX(-100%);*/
                  right: 4em;
                  padding: 0 8px 3px;
                  line-height: normal;
                  font-family: Roboto, Arial, sans-serif;
                  font-size: 11px;
                  color: #eee;
                  background: rgba(0,0,0,0.3);
               }

               /* comments section */
               ${COMMENTS_SELECTOR} {
                  margin: 0 1%;
                  padding: 0 15px;
                  background-color: #222;
                  border: 1px solid #333;
                  max-width: 90%;
               }

               ${COMMENTS_SELECTOR}:not(:hover) {
                  visibility: collapse;
               }

               /* comments section hover */
               ${COMMENTS_SELECTOR}:hover {
                  visibility: visible !important;
               }

               /* add scroll option in comments */
               ${COMMENTS_SELECTOR} > #sections > #contents {
                  overflow-y: auto;
                  max-height: 88vh;
                  border-top: 1px solid #333;
                  padding-top: 1em;
               }

               /* hide add comment textarea */
               ${COMMENTS_SELECTOR} #header #simple-box {
                  display: none;
               }

               /* fixs */
               ytd-comments-header-renderer {
                  height: 0;
                  margin-top: 10px;
               }
               /* size section */
               ${COMMENTS_SELECTOR} #sections {
                  max-width: fit-content;
                  min-width: 500px;
               }

               /* custom scroll */
               ${COMMENTS_SELECTOR} #contents::-webkit-scrollbar {
                  height: 8px;
                  width: 10px;
               }

               ${COMMENTS_SELECTOR} #contents::-webkit-scrollbar-button {
                  height: 0;
                  width: 0;
               }

               ${COMMENTS_SELECTOR} #contents::-webkit-scrollbar-corner {
                  background: transparent;
               }

               ${COMMENTS_SELECTOR} #contents::-webkit-scrollbar-thumb {
                  background: #e1e1e1;
                  border: 0;
                  border-radius: 0;
               }

               ${COMMENTS_SELECTOR} #contents::-webkit-scrollbar-track {
                  background: #666;
                  border: 0;
                  border-radius: 0;
               }

               ${COMMENTS_SELECTOR} #contents::-webkit-scrollbar-track:hover {
                  background: #666;
               }`);
         });

   },
});
window.nova_plugins.push({
   id: 'comments-expand',
   title: 'Expand comments',
   'title:zh': '展开评论',
   'title:ja': 'コメントを展開',
   'title:ko': '댓글 펼치기',
   'title:es': 'Expandir comentarios',
   'title:pt': 'Expandir comentários',
   'title:fr': 'Développer les commentaires',
   // 'title:tr': 'Yorumları genişlet',
   'title:de': 'Kommentare erweitern',
   run_on_pages: 'watch, -mobile',
   section: 'comments',
   // desc: '',
   _runtime: user_settings => {

      // Doesn't work. I don't know how to implement it better. By updating "removeEventListener/addEventListener" or reloading the entire comment block
      // dirty fix bug with not updating comments addEventListener: reset comments block
      // document.addEventListener('yt-page-data-updated', () => location.reload());

      // comment
      NOVA.watchElements({
         selectors: ['#contents #expander[collapsed]'],
         attr_mark: 'comment-expanded',
         callback: el => {
            const moreExpand = () => el.querySelector('#more')?.click();
            // on hover auto expand
            el.addEventListener('mouseenter', moreExpand, { capture: true, once: true });
            // if (user_settings.comments_expand_mode === 'always') moreExpand();
            if (user_settings.comments_expand_mode != 'onhover') moreExpand();
         },
      });

      // comment replies
      NOVA.watchElements({
         selectors: ['#more-replies'],
         attr_mark: 'replies-expanded',
         callback: el => {
            const moreExpand = () => el.querySelector('#button')?.click();
            // on hover auto expand
            el.addEventListener('mouseenter', moreExpand, { capture: true, once: true });
            if (user_settings.comments_view_reply == 'always') moreExpand();
         },
      });

      // old method. No hover
      // NOVA.watchElements({
      //    selector: '#contents #expander[collapsed] #more',
      //    attr_mark: 'comment-expanded',
      //    callback: btn => btn.click(),
      // });

      // if (user_settings.comments_view_reply) {
      //    NOVA.watchElements({
      //       selector: '#comment #expander #more-replies',
      //       attr_mark: 'replies-expanded',
      //       callback: btn => btn.click(),

      //    });
      // }

   },
   options: {
      comments_expand_mode: {
         _tagName: 'select',
         label: 'Expand comment',
         'label:zh': '展开评论',
         'label:ja': 'コメントを展開',
         'label:ko': '댓글 펼치기',
         'label:es': 'Expandir comentarios',
         'label:pt': 'Expandir comentário',
         'label:fr': 'Développer les commentaires',
         // 'label:tr': 'Yorumu genişlet',
         'label:de': 'Kommentar erweitern',
         // title: '',
         options: [
            { label: 'always', value: 'always', selected: true, 'label:zh': '每次', 'label:ja': 'いつも', 'label:ko': '언제나', 'label:es': 'siempre', 'label:pt': 'sempre', 'label:fr': 'toujours', 'label:tr': 'her zaman', 'label:de': 'stets' },
            { label: 'on hover', value: 'onhover', 'label:zh': '悬停时', 'label:ja': 'ホバー時に', 'label:ko': '호버에', 'label:es': 'en vuelo estacionario', 'label:pt': 'pairando', 'label:fr': 'en vol stationnaire', 'label:tr': 'üzerinde gezinme', 'label:de': 'auf schweben' },
         ],
      },
      comments_view_reply: {
         _tagName: 'select',
         label: 'Expand reply',
         'label:zh': '展开回复',
         'label:ja': '返信を展開',
         'label:ko': '답장 펼치기',
         'label:es': 'Expandir respuesta',
         'label:pt': 'Expandir a resposta',
         'label:fr': 'Développer la réponse',
         // 'label:tr': 'Cevabı genişlet',
         'label:de': 'Antwort erweitern',
         // title: '',
         options: [
            { label: 'always', value: 'always', 'label:zh': '每次', 'label:ja': 'いつも', 'label:ko': '언제나', 'label:es': 'siempre', 'label:pt': 'sempre', 'label:fr': 'toujours', 'label:tr': 'her zaman', 'label:de': 'stets' },
            { label: 'on hover', value: 'onhover', selected: true, 'label:zh': '悬停时', 'label:ja': 'ホバー時に', 'label:ko': '호버에', 'label:es': 'en vuelo estacionario', 'label:pt': 'pairando', 'label:fr': 'en vol stationnaire', 'label:tr': 'üzerinde gezinme', 'label:de': 'auf schweben' },
         ],
      },
   }
});
window.nova_plugins.push({
   id: 'square-avatars',
   title: 'Square avatars',
   'title:zh': '方形头像',
   'title:ja': '正方形のアバター',
   'title:ko': '정사각형 아바타',
   'title:es': 'Avatares cuadrados',
   'title:pt': 'Avatares quadrados',
   'title:fr': 'Avatars carrés',
   // 'title:tr': 'Kare avatarlar',
   'title:de': 'Quadratische Avatare',
   run_on_pages: 'all',
   section: 'comments',
   desc: 'Make user images squared',
   'desc:zh': '方形用户形象',
   'desc:ja': 'ユーザー画像を二乗する',
   'desc:ko': '사용자 이미지를 정사각형으로 만들기',
   // 'desc:es': 'Haz que las imágenes de los usuarios sean cuadradas',
   'desc:pt': 'Torne as imagens do usuário quadradas',
   // 'desc:fr': 'Rendre les images utilisateur au carré',
   'desc:tr': 'Kullanıcı resimlerini kare haline getirin',
   'desc:de': 'Machen Sie Benutzerbilder quadriert',
   _runtime: user_settings => {

      NOVA.css.push(
         `yt-img-shadow,
         .ytp-title-channel-logo,
         #player .ytp-title-channel,
         ytm-profile-icon {
            border-radius: 0 !important;
         }`);

   },
});
const NOVA = {
   // DEBUG: true,

   // find once.
   // more optimized compared to MutationObserver
   // waitElement(selector = required()) {
   //    this.log('waitElement:', selector);
   //    if (typeof selector !== 'string') return console.error('wait > selector:', typeof selector);

   //    return new Promise((resolve, reject) => {
   //       // try {
   //       let nodeInterval
   //       const checkIfExists = () => {
   //          if (el = document.body.querySelector(selector)) {
   //             if (typeof nodeInterval === 'number') clearInterval(nodeInterval);
   //             resolve(el);

   //          } else return;
   //       }
   //       checkIfExists();
   //       nodeInterval = setInterval(checkIfExists, 50); // ms
   //       // } catch (err) { // does not output the reason/line to the stack
   //       //    reject(new Error('Error waitElement', err));
   //       // }
   //    });
   // },

   waitElement(selector = required(), container) {
      if (typeof selector !== 'string') return console.error('wait > selector:', typeof selector);
      if (container && !(container instanceof HTMLElement)) return console.error('wait > container not HTMLElement:', container);
      // console.debug('waitElement:', selector);

      // https://stackoverflow.com/a/68262400
      // best https://codepad.co/snippet/wait-for-an-element-to-exist-via-mutation-observer
      // alt:
      // https://git.io/waitForKeyElements.js
      // https://github.com/fuzetsu/userscripts/tree/master/wait-for-elements
      // https://github.com/CoeJoder/waitForKeyElements.js/blob/master/waitForKeyElements.js
      // https://gist.githubusercontent.com/sidneys/ee7a6b80315148ad1fb6847e72a22313/raw/

      // There is a more correct method - transitionend.
      // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/transitionend_event
      // But this requires a change in the logic of the current implementation. It will also complicate the restoration of the expansion if in the future, if YouTube replaces logic.

      return new Promise(resolve => {
         if (element = (container || document?.body || document).querySelector(selector)) {
            // console.debug('[1]', selector);
            return resolve(element);
         }

         new MutationObserver((mutations, observer) => {
            for (let mutation of mutations) {
               for (const node of mutation.addedNodes) {
                  if (![1, 3, 8].includes(node.nodeType)) continue; // speedup hack

                  if (node.matches && node.matches(selector)) { // this node
                     // console.debug('[2]', mutation.type, node.nodeType, selector);
                     observer.disconnect();
                     return resolve(node);

                  } else if ( // inside node
                     (parentEl = node.parentElement || node)
                     && (parentEl instanceof HTMLElement)
                     && (element = parentEl.querySelector(selector))
                  ) {
                     // console.debug('[3]', mutation.type, node.nodeType, selector);
                     observer.disconnect();
                     return resolve(element);
                  }
               }
            }
            // after loop
            if (document?.readyState != 'loading' // fix slowdown page
               && (element = (container || document?.body || document).querySelector(selector))
            ) { // in global
               // console.debug('[4]', selector);
               observer.disconnect();
               return resolve(element);
            }
         })
            .observe(container || document?.body || document.documentElement, {
               childList: true, // observe direct children
               subtree: true, // and lower descendants too
            });
      });
   },

   /** wait for every DOM change until a condition becomes true */
   // await NOVA.waitUntil(?, 500) // 50ms
   async waitUntil(condition, timeout = 100) {
      return new Promise((resolve) => {
         const result = (typeof condition === 'function') ? condition() : condition;
         if (result) {
            // console.debug('waitUntil');
            resolve(result);

         } else {
            const interval = setInterval(() => {
               if (result) {
                  // console.debug('waitUntil 2');
                  clearInterval(interval);
                  resolve(result);
               }
            }, timeout);
         }
      });
   },

   watchElements_list: {}, // can to stop watch setInterval
   // complete doesn't work
   // clear_watchElements(name = required()) {
   //    return this.watchElements_list.hasOwnProperty(name)
   //       && clearInterval(this.watchElements_list[name])
   //       && delete this.watchElements_list[name];
   // },

   watchElements({ selectors = required(), attr_mark, callback = required() }) {
      // console.debug('watch', selector);
      if (!Array.isArray(selectors) && typeof selectors !== 'string') return console.error('watch > selector:', typeof selectors);
      if (typeof callback !== 'function') return console.error('watch > callback:', typeof callback);

      // async wait el. Removes the delay for init
      this.waitElement(typeof selectors === 'string' ? selectors : selectors.join(','))
         .then(video => {
            // selectors - str to array
            !Array.isArray(selectors) && (selectors = selectors.split(',').map(s => s.trim()));

            process(); // launch without waiting
            // if (attr_mark) {
            this.watchElements_list[attr_mark] = setInterval(() =>
               document.visibilityState == 'visible' && process(), 1000 * 1.5); // 1.5 sec
            // }

            function process() {
               // console.debug('watch.process', { selector, callback });
               selectors
                  .forEach(selectorItem => {
                     if (attr_mark) selectorItem += `:not([${attr_mark}])`;
                     if ((slEnd = ':not([hidden])') && !selectorItem.endsWith(slEnd)) {
                        selectorItem += slEnd;
                     }
                     // console.debug('selectorItem', selectorItem);

                     document.body.querySelectorAll(selectorItem)
                        .forEach(el => {
                           // if (el.offsetWidth > 0 || el.offsetHeight > 0) { // el.is(":visible")
                           // console.debug('watch.process.viewed', selectorItem);
                           if (attr_mark) el.setAttribute(attr_mark, true);
                           callback(el);
                           // }
                        });
                  });
            }
         });

   },

   css: {
      push(css = required(), selector, important) {
         // console.debug('css\n', ...arguments);
         if (typeof css === 'object') {
            if (!selector) return console.error('injectStyle > empty json-selector:', ...arguments);

            // if (important) {
            injectCss(selector + json2css(css));
            // } else {
            //    Object.assign(document.body.querySelector(selector).style, css);
            // }

            function json2css(obj) {
               let css = '';
               Object.entries(obj)
                  .forEach(([key, value]) => {
                     css += key + ':' + value + (important ? ' !important' : '') + ';';
                  });
               return `{ ${css} }`;
            }

         } else if (css && typeof css === 'string') {
            if (document.head) {
               injectCss(css);

            } else {
               addEventListener('load', () => injectCss(css), { capture: true, once: true });
            }

         } else {
            console.error('addStyle > css:', typeof css);
         }

         function injectCss(source = required()) {
            let sheet;

            if (source.endsWith('.css')) {
               sheet = document.createElement('link');
               sheet.rel = 'sheet';
               sheet.href = source;

            } else {
               const sheetName = 'NOVA_style';
               sheet = document.getElementById(sheetName) || (function () {
                  const style = document.createElement('style');
                  style.type = 'text/css';
                  style.id = sheetName;
                  return document.head.appendChild(style);
               })();
            }

            sheet.textContent += '/**/\n' + source
               .replace(/\n+\s{2,}/g, ' ') // singleline format
               // multiline format
               // .replace(/\n+\s{2,}/g, '\n\t')
               // .replace(/\t\}/mg, '}')
               + '\n';
            // sheet.insertRule(css, sheet.cssRules.length);
            // (document.head || document.documentElement).append(sheet);
            // document.adoptedStyleSheets.push(newSheet); // v99+

            // sheet.onload = () => NOVA.log('style loaded:', sheet.src || sheet || sheet.textContent.substr(0, 100));
         }
      },

      // https://developer.mozilla.org/ru/docs/Web/API/CSSStyleDeclaration
      // HTMLElement.prototype.getIntValue = () {}
      // const { position, right, bottom, zIndex, boxShadow } = window.getComputedStyle(container); // multiple
      getValue(selector = required(), propName = required()) {
         const el = document.body.querySelector(selector);
         return el && getComputedStyle(el).getPropertyValue(propName);
         // return el && getComputedStyle(el)[property];
      },
   },

   cookie: {
      get(name = required()) {
         return Object.fromEntries(
            document.cookie
               .split(/; */)
               .map(c => {
                  const [key, ...v] = c.split('=');
                  return [key, decodeURIComponent(v.join('='))];
               })
         )[name];
      },

      set(name = required(), value, days = 90) { // 90 days
         let date = new Date();
         date.setTime(date.getTime() + 3600000 * 24 * days); // m*h*d

         document.cookie = Object.entries({
            // [encodeURIComponent(name)]: encodeURIComponent(value),
            [encodeURIComponent(name)]: value,
            // domain: '.' + location.hostname.split('.').slice(-2).join('.'), // .youtube.com
            domain: '.youtube.com',
            // expires: date.toUTCString(),
            path: '/', // what matters at the end
         })
            .map(([key, value]) => `${key}=${value}`).join('; '); // if no "value" = undefined

         console.assert(this.get(name) == value, 'cookie set err:', ...arguments, document.cookie);
      },

      getParamLikeObj(name = required()) {
         return Object.fromEntries(
            this.get(name)
               ?.split(/&/)
               .map(c => {
                  const [key, ...v] = c.split('=');
                  return [key, decodeURIComponent(v.join('='))];
               }) || []
         );
      },

      updateParam({ key = required(), param = required(), value = required() }) {
         let paramsObj = this.getParamLikeObj(key) || {};

         if (paramsObj[param] != value) {
            paramsObj[param] = value;
            this.set(key, NOVA.queryURL.set(paramsObj).split('?').pop());
            location.reload();
         }
      },
   },

   /* NOVA.preventVisibilityElement({
         selector: '#secondary #related',
         title: 'related',// auto uppercase
         remove: true,
         remove: user_settings.NAME_visibility_mode == 'remove' ? true : false,
   }); */
   preventVisibilityElement({ selector = required(), title = required(), remove }) {
      // console.debug('preventVisibilityElement', ...arguments);
      const selector_id = `${title.match(/[a-z]+/gi).join('')}-prevent-load-btn`;

      this.waitElement(selector.toString())
         .then(el => {
            if (remove) el.remove();
            else {
               if (document.getElementById(selector_id)) return;
               // el.style.visibility = 'hidden'; // left scroll space
               el.style.display = 'none';
               // create button
               const btn = document.createElement('a');
               btn.textContent = `Load ${title}`;
               btn.id = selector_id;
               btn.className = 'more-button style-scope ytd-video-secondary-info-renderer';
               // btn.className = 'ytd-vertical-list-renderer';
               Object.assign(btn.style, {
                  cursor: 'pointer',
                  'text-align': 'center',
                  'text-transform': 'uppercase',
                  display: 'block',
                  color: 'var(--yt-spec-text-secondary)',
               });
               btn.addEventListener('click', () => {
                  btn.remove();
                  // el.style.visibility = 'visible'; // left scroll space
                  el.style.display = 'unset';
                  dispatchEvent(new Event('scroll')); // need to "comments-visibility" (https://stackoverflow.com/a/68202306)
               });
               el.before(btn);
            }
         });
   },

   calculateAspectRatioFit({
      srcWidth = 0, srcHeight = 0,
      maxWidth = innerWidth,
      maxHeight = innerHeight
   }) {
      // console.debug('aspectRatioFit:', ...arguments);
      const aspectRatio = Math.min(+maxWidth / +srcWidth, +maxHeight / +srcHeight);
      return {
         width: +srcWidth * aspectRatio,
         height: +srcHeight * aspectRatio,
      };
   },

   bezelTrigger(text) {
      // console.debug('bezelTrigger', ...arguments);
      if (!text) return;
      if (typeof fateBezel === 'number') clearTimeout(fateBezel);
      const bezelEl = document.body.querySelector('.ytp-bezel-text');
      if (!bezelEl) return console.warn(`bezelTrigger ${text}=>${bezelEl}`);

      const
         bezelConteiner = bezelEl.parentElement.parentElement,
         CLASS_VALUE_TOGGLE = 'ytp-text-root';

      if (!this.bezel_css_inited) {
         this.bezel_css_inited = true;
         this.css.push(
            `.${CLASS_VALUE_TOGGLE} { display: block !important; }
            .${CLASS_VALUE_TOGGLE} .ytp-bezel-text-wrapper {
               pointer-events: none;
               z-index: 40 !important;
            }
            .${CLASS_VALUE_TOGGLE} .ytp-bezel-text { display: inline-block !important; }
            .${CLASS_VALUE_TOGGLE} .ytp-bezel { display: none !important; }`);
      }

      bezelEl.textContent = text;
      bezelConteiner.classList.add(CLASS_VALUE_TOGGLE);

      fateBezel = setTimeout(() => {
         bezelConteiner.classList.remove(CLASS_VALUE_TOGGLE);
         bezelEl.textContent = ''; // fix not showing bug when frequent calls
      }, 600); // 600ms
   },

   getChapterList(video_duration = required()) {
      let timestampsCollect = [];
      let prevSec = -1;

      // description and first(pinned) comment
      document.body.querySelectorAll('#primary-inner #description, #comments ytd-comment-thread-renderer:first-child #content')
         .forEach(el => {
            (el.textContent || ytplayer?.config?.args.raw_player_response.videoDetails.shortDescription)
               // || document.body.querySelector('ytd-player')?.player_.getCurrentVideoConfig()?.args.raw_player_response.videoDetails.shortDescription
               ?.split('\n')
               .forEach(line => {
                  if (line.length > 5 && line.length < 200 && (timestamp = /((\d?\d:){1,2}\d{2})/g.exec(line))) {
                     timestamp = timestamp[0];
                     const sec = this.timeFormatTo.hmsToSec(timestamp);
                     if (sec > prevSec && sec < +video_duration) {
                        // const prev = arr[i-1] || -1; // needs to be called "hmsToSecondsOnly" again. What's not optimized
                        prevSec = sec;
                        timestampsCollect.push({
                           'sec': sec,
                           'time': timestamp,
                           'title': line
                              .replace(timestamp, '')
                              .trim().replace(/^[:\-–—|]|(\[\])?|[:\-–—.;|]$/g, '') // clear of quotes and list characters
                              //.trim().replace(/^([:\-–—|]|(\d+[\.)]))|(\[\])?|[:\-–—.;|]$/g, '') // clear numeric list prefix
                              // ^[\"(]|[\")]$ && .trim().replace(/^[\"(].*[\")]$/g, '') // quote stripping example - "text"
                              .trim()
                        });
                     }
                  }
               });
         });

      if (timestampsCollect.length) {
         // console.debug('timestampsCollect', timestampsCollect);
         return timestampsCollect;
      }
   },

   // there are problems with the video https://www.youtube.com/watch?v=SgQ_Jk49FRQ. Too lazy to continue testing because it is unclear which method is more optimal.
   // getChapterList(video_duration = required()) {
   //    const selectorLinkTimestamp = 'a[href*="&t="]';
   //    let timestampList = [];
   //    let prevSec = -1;

   //    document.body.querySelectorAll(`#primary-inner #description ${selectorLinkTimestamp}, #contents ytd-comment-thread-renderer:first-child #content ${selectorLinkTimestamp}`)
   //       .forEach((link, i, arr) => {
   //          // const prev = arr[i-1] || -1; // needs to be called "hmsToSecondsOnly" again. What's not optimized
   //          const sec = parseInt(this.queryURL.get('t', link.href));
   //          if (sec > prevSec && sec < +video_duration) {
   //             prevSec = sec;
   //             // will be skip - time: '0:00'
   //             timestampList.push({
   //                // num: ++i,
   //                sec: sec,
   //                time: link.textContent,
   //                title: link.parentElement.textContent
   //                   .split('\n')
   //                   .find(line => line.includes(link.textContent))
   //                   .replaceAll(link.textContent, '')
   //                   .trim()
   //                   .replace(/(^[:\-–—]|[:\-–—.;]$)/g, '')
   //                   .trim()
   //             });
   //          }
   //       });
   //    console.debug('timestampList', timestampList);

   //    if (timestampList?.length > 1) { // clear from "lying timestamp"
   //       return timestampList.filter(i => i.title.length < 80);
   //    }
   // },

   // findTimestamps(text) {
   //    const result = []
   //    const timestampPattern = /((\d?\d:){1,2}\d{2})/g
   //    let match
   //    while ((match = timestampPattern.exec(text))) {
   //       result.push({
   //          from: match.index,
   //          to: timestampPattern.lastIndex
   //       })
   //    }
   //    return result
   // },

   timeFormatTo: {
      hmsToSec(str) { // format out "h:mm:ss" > "sec"
         return ((arr = str?.split(':').filter(Number)) && arr.length)
            && arr?.reduce((acc, time) => (60 * acc) + ~~time);
      },

      HMS: {
         // 65.77 % slower
         // digit(ts = required()) { // format out "h:mm:ss"
         //    const
         //       ms = Math.abs(+ts),
         //       days = ~~(ms / 86400);

         //    let t = new Date(ms).toISOString();
         //    if (ms < 3600000) t = t.substr(14, 5); // add hours
         //    else t = t.substr(11, 8); // only minutes

         //    return (days ? `${days}d ` : '') + t;
         // },
         digit(ts = required()) { // format out "h:mm:ss"
            const
               ms = Math.abs(+ts),
               d = ~~(ms / 86400),
               h = ~~((ms % 86400) / 3600),
               m = ~~((ms % 3600) / 60),
               s = ~~(ms % 60);

            return (d ? `${d}d ` : '')
               + (h ? (d ? h.toString().padStart(2, '0') : h) + ':' : '')
               + (h ? m.toString().padStart(2, '0') : m) + ':'
               + s.toString().padStart(2, '0');

            // 84% slower
            // return (days && !isNaN(days) ? `${days}d ` : '')
            //    + [hours, minutes, seconds]
            //       .filter(i => +i && !isNaN(i))
            //       .map((item, idx) => idx ? item.toString().padStart(2, '0') : item) // "1:2:3" => "1:02:03"
            //       .join(':'); // format "h:m:s"
         },

         abbr(ts = required()) { // format out "999h00m00s"
            const
               ms = Math.abs(+ts),
               d = ~~(ms / 86400),
               h = ~~((ms % 86400) / 3600),
               m = ~~((ms % 3600) / 60),
               s = ~~(ms % 60);

            return (d ? `${d}d ` : '')
               + (h ? (d ? h.toString().padStart(2, '0') : h) + 'h' : '')
               + (m ? (h ? m.toString().padStart(2, '0') : m) + 'm' : '')
               + (s ? (m ? s.toString().padStart(2, '0') : s) + 's' : '');
            // 78.48% slower
            // return (days ? `${days}d ` : '')
            //    + [seconds, minutes, hours]
            //       .filter(i => +i && !isNaN(i))
            //       .map((item, idx, arr) => (arr.length - 1 !== idx ? item.toString().padStart(2, '0') : item) + ['s', 'm', 'h'][idx])
            //       .reverse()
            //       .join(''); // format "999h00m00s"
         },
      },
   },

   queryURL: {
      // get: (query, url) => new URLSearchParams((url ? new URL(url) : location.href || document.URL).search).get(query),
      // has: (query = required(), url_string) => new URLSearchParams((url_string ? new URL(url_string) : location.href)).has(query), // Doesn't work

      has: (query = required(), url_string) => new URL(url_string || location).searchParams.has(query.toString()),

      get: (query = required(), url_string) => new URL(url_string || location).searchParams.get(query.toString()),

      set(query_obj = {}, url_string) {
         // console.log('queryURL.set:', ...arguments);
         if (!Object.keys(query_obj).length) return console.error('query_obj:', query_obj)
         const url = new URL(url_string || location);
         Object.entries(query_obj).forEach(([key, value]) => url.searchParams.set(key, value));
         return url.toString();
      },

      remove(query = required(), url_string) {
         const url = new URL(url_string || location);
         url.searchParams.delete(query.toString());
         return url.toString();
      },
   },

   request: {

      API_STORE_NAME: 'YOUTUBE_API_KEYS',

      async API({ request, params, api_key }) {
         // NOVA.log('request.API:', ...arguments); // err
         // console.debug('API:', ...arguments);
         // get API key
         const YOUTUBE_API_KEYS = localStorage.hasOwnProperty(this.API_STORE_NAME) ? JSON.parse(localStorage.getItem(this.API_STORE_NAME)) : await this.keys();

         if (!api_key && (!Array.isArray(YOUTUBE_API_KEYS) || !YOUTUBE_API_KEYS?.length)) {
            localStorage.hasOwnProperty(this.API_STORE_NAME) && localStorage.removeItem(this.API_STORE_NAME);
            // alert('I cannot access the API key.'
            //    + '\nThe plugins that depend on it have been terminated.'
            //    + "\n - Check your network's access to Github"
            //    + '\n - Generate a new private key'
            //    + '\n - Deactivate plugins that need it'
            // );
            // throw new Error('YOUTUBE_API_KEYS is empty:', YOUTUBE_API_KEYS);
            return console.error('YOUTUBE_API_KEYS empty:', YOUTUBE_API_KEYS);
         }

         const referRandKey = arr => api_key || 'AIzaSy' + arr[Math.floor(Math.random() * arr.length)];
         // combine GET
         const query = (request == 'videos' ? 'videos' : 'channels') + '?'
            + Object.keys(params)
               .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
               .join('&');

         const URL = `https://www.googleapis.com/youtube/v3/${query}&key=` + referRandKey(YOUTUBE_API_KEYS);
         // console.debug('URL', URL);
         // request
         return await fetch(URL)
            .then(response => response.json())
            .then(json => {
               if (!json?.error && Object.keys(json).length) return json;
               console.warn('used key:', NOVA.queryURL.get('key', URL));
               throw new Error(JSON.stringify(json?.error));
            })
            .catch(error => {
               localStorage.removeItem(this.API_STORE_NAME);
               console.error(`Request API failed:${URL}\n${error}`);
               // alert('Problems with the YouTube API:'
               //    + '\n' + error?.message
               //    + '\n\nIf this error is repeated:'
               //    + '\n - Disconnect the plugins that need it'
               //    + '\n - Update your YouTube API KEY');
            });
      },

      async keys() {
         NOVA.log('request.API: fetch to youtube_api_keys.json');
         // see https://gist.github.com/raingart/ff6711fafbc46e5646d4d251a79d1118/
         return await fetch('https://gist.githubusercontent.com/raingart/ff6711fafbc46e5646d4d251a79d1118/raw/youtube_api_keys.json')
            .then(res => res.text())
            .then(keys => { // save
               NOVA.log(`get and save keys in localStorage`, keys);
               localStorage.setItem(this.API_STORE_NAME, keys);
               return JSON.parse(keys);
            })
            .catch(error => { // clear
               localStorage.removeItem(this.API_STORE_NAME);
               throw error;
               // throw new Error(error);
            })
            .catch(reason => console.error('Error get keys:', reason)); // warn
      },
   },

   getPlayerState(state) {
      // movie_player.getPlayerState() === 2 // 2: PAUSED
      // NOVA.getPlayerState() == 'PLAYING'
      // movie_player.addEventListener('onStateChange', state => 'PLAYING' == NOVA.getPlayerState(state));
      return {
         '-1': 'UNSTARTED',
         0: 'ENDED',
         1: 'PLAYING',
         2: 'PAUSED',
         3: 'BUFFERING',
         5: 'CUED'
      }[state || movie_player.getPlayerState()];
   },

   // captureActiveVideoElement
   videoElement: (() => {
      // init
      document.addEventListener('canplay', ({ target }) => {
         target.matches('#movie_player video') && (NOVA.videoElement = target);
      }, { capture: true, once: true });
      // update
      document.addEventListener('play', ({ target }) => NOVA.videoElement = target, true);
   })(),

   getChannelId() {
      const isChannelId = id => id && /UC([a-z0-9-_]{22})$/i.test(id);
      return [
         // channel page
         (document.body.querySelector('ytd-app')?.__data?.data.response
            || document.body.querySelector('ytd-app')?.data?.response
            || ytInitialData
         )
            ?.metadata?.channelMetadataRenderer?.externalId,
         document.head.querySelector('meta[itemprop="channelId"][content]')?.content,
         document.head.querySelector('link[itemprop="url"][href]')?.href.split('/')[4],
         location.pathname.split('/')[2],
         // playlist page
         document.body.querySelector('#video-owner a[href]')?.href.split('/')[4],
      ]
         .find(i => isChannelId(i))
   },

   log() {
      if (this.DEBUG && arguments.length) {
         console.groupCollapsed(...arguments);
         console.trace();
         console.groupEnd();
      }
   }
}
window.nova_plugins.push({
   id: 'redirect-disable',
   title: 'Clear links from redirect',
   'title:zh': '清除重定向中的链接',
   'title:ja': 'リダイレクトからリンクをクリアする',
   'title:ko': '리디렉션에서 링크 지우기',
   'title:es': 'Borrar enlaces de redireccionamientos',
   'title:pt': 'Limpar links de redirecionamentos',
   'title:fr': 'Effacer les liens des redirections',
   // 'title:tr': 'Yönlendirmeden bağlantıları temizle',
   'title:de': 'Links aus Weiterleitungen löschen',
   run_on_pages: 'watch, channel',
   section: 'details',
   desc: 'Direct external links',
   'desc:zh': '直接链接到外部站点',
   'desc:ja': '外部サイトへの直接リンク',
   'desc:ko': '직접 외부 링크',
   'desc:es': 'Enlaces externos directos',
   'desc:pt': 'Links externos diretos',
   // 'desc:fr': 'Liens externes directs',
   'desc:tr': 'Doğrudan harici bağlantılar',
   'desc:de': 'Direkte externe Links',
   _runtime: user_settings => {

      // document.addEventListener('mouseover', ({ target }) => { // increased load but the hint will be the right link
      document.addEventListener('click', ({ target }) => {
         if (!target.matches('a[href*="/redirect?"]')) return;

         if (q = NOVA.queryURL.get('q', target.href)) {
            // console.debug('redirect clear:', decodeURIComponent(q), target);
            target.href = decodeURIComponent(q);
         }
      }, { capture: true });

   }
});
window.nova_plugins.push({
   id: 'channel-videos-count',
   title: 'Show channel videos count',
   'title:zh': '显示频道上的视频数量',
   'title:ja': 'チャンネルの動画数を表示する',
   'title:ko': '채널 동영상 수 표시',
   'title:es': 'Mostrar recuento de videos del canal',
   'title:pt': 'Mostrar contagem de vídeos do canal',
   'title:fr': 'Afficher le nombre de vidéos de la chaîne',
   // 'title:tr': 'Kanal video sayısını göster',
   'title:de': 'Anzahl der Kanalvideos anzeigen',
   run_on_pages: 'watch, channel',
   restart_on_transition: true,
   section: 'details',
   opt_api_key_warn: true,
   desc: 'Display uploaded videos on channel',
   'desc:zh': '在频道上显示上传的视频',
   'desc:ja': 'アップロードした動画をチャンネルに表示',
   'desc:ko': '채널에 업로드된 동영상 표시',
   'desc:es': 'Mostrar videos subidos en el canal',
   'desc:pt': 'Exibir vídeos enviados no canal',
   // 'desc:fr': 'Afficher les vidéos mises en ligne sur la chaîne',
   'desc:tr': 'Yüklenen videoları kanalda göster',
   'desc:de': 'Hochgeladene Videos auf dem Kanal anzeigen',
   _runtime: user_settings => {

      const
         CACHE_PREFIX = 'nova-channel-videos-count:',
         SELECTOR_ID = 'nova-video-count';

      switch (NOVA.currentPage) {
         case 'watch':
            NOVA.waitElement('#upload-info #channel-name a[href], ytm-slim-owner-renderer a[href]')
               .then(link => {
                  // console.debug('watch page');
                  NOVA.waitElement('#upload-info #owner-sub-count, ytm-slim-owner-renderer .subhead') // possible positional problems
                     // NOVA.waitElement('#owner-sub-count:not([hidden]):not(:empty)') // does not display when the number of subscribers is hidden
                     .then(el => {
                        if (el.hasAttribute('hidden')) el.removeAttribute('hidden'); // remove hidden attribute
                        setVideoCount({
                           'container': el,
                           'channel_id': new URL(link.href).pathname.split('/')[2],
                           // ALL BELOW - not updated after page transition!
                           // || window.ytplayer?.config?.args.ucid
                           // || window.ytplayer?.config?.args.raw_player_response.videoDetails.channelId
                           // || document.body.querySelector('ytd-player')?.player_.getCurrentVideoConfig()?.args.raw_player_response.videoDetails.channelId
                        });
                     });
               });
            break;

         case 'channel':
            NOVA.waitElement('#channel-header #subscriber-count, .c4-tabbed-header-subscriber-count') // possible positional problems
               // NOVA.waitElement('#channel-header #subscriber-count:not(:empty)') // does not display when the number of subscribers is hidden
               .then(el => {
                  // console.debug('channel page');
                  if (channelId = NOVA.getChannelId()) {
                     setVideoCount({ 'container': el, 'channel_id': channelId });
                  }
               });
            break;
      }

      function setVideoCount({ container = required(), channel_id }) {
         // console.debug('setVideoCount:', ...arguments);
         // cached
         if (storage = sessionStorage.getItem(CACHE_PREFIX + channel_id)) {
            insertToHTML({ 'text': storage, 'container': container });

         } else {
            NOVA.request.API({
               request: 'channels',
               params: { 'id': channel_id, 'part': 'statistics' },
               api_key: user_settings['custom-api-key'],
            })
               .then(res => {
                  res?.items?.forEach(item => {
                     if (videoCount = +item.statistics.videoCount) {
                        insertToHTML({ 'text': videoCount, 'container': container });
                        // save cache in tabs
                        sessionStorage.setItem(CACHE_PREFIX + channel_id, videoCount);
                     }
                  });
               });
         }

         function insertToHTML({ text = '', container = required() }) {
            // console.debug('insertToHTML', ...arguments);
            if (!(container instanceof HTMLElement)) return console.error('container not HTMLElement:', container);

            (document.getElementById(SELECTOR_ID) || (function () {
               container.insertAdjacentHTML('beforeend',
                  `<span class="date style-scope ytd-video-secondary-info-renderer" style="margin-right:5px;"> • <span id="${SELECTOR_ID}">${text}</span> videos</span>`);
               return document.getElementById(SELECTOR_ID);
            })())
               .textContent = text;

            container.title = `${text} videos`;
         }

      }

   }
});
// for test:
// https://www.youtube.com/watch?v=FSjr2H0RDsY - empty desc

window.nova_plugins.push({
   id: 'description-popup',
   title: 'Description section in popup',
   'title:zh': '弹出窗口中的描述部分',
   'title:ja': 'ポップアップの説明セクション',
   'title:ko': '팝업의 설명 섹션',
   'title:es': 'Sección de descripción en ventana emergente',
   'title:pt': 'Seção de descrição no pop-up',
   'title:fr': 'Section de description dans la fenêtre contextuelle',
   // 'title:tr': 'Açılır pencerede açıklama bölümü',
   'title:de': 'Beschreibungsabschnitt im Popup',
   run_on_pages: 'watch, -mobile',
   section: 'details',
   // desc: '',
   _runtime: user_settings => {

      // bug if DESCRIPTION_SELECTOR is empty. Using CSS is impossible to fix. And through JS extra

      const DESCRIPTION_SELECTOR = 'html:not(:fullscreen) #primary-inner #description:not([hidden]):not(:empty)';

      NOVA.waitElement('#masthead-container')
         .then(masthead => {

            NOVA.css.push(
               `${DESCRIPTION_SELECTOR},
               ${DESCRIPTION_SELECTOR}:before {
                  position: fixed;
                  top: ${masthead.offsetHeight || 56}px;
                  right: 0;
                  z-index: ${Math.max(
                  getComputedStyle(masthead)['z-index'],
                  getComputedStyle(movie_player)['z-index'],
                  601) + 1};
               }

               /* button */
               ${DESCRIPTION_SELECTOR}:not(:hover):before {
                  content: "info ▼";
                  cursor: pointer;
                  visibility: visible;
                  /*transform: rotate(-90deg) translateX(-100%);*/
                  right: 12em;
                  padding: 0 8px 3px;
                  line-height: normal;
                  font-family: Roboto, Arial, sans-serif;
                  font-size: 11px;
                  color: #eee;
                  background: rgba(0,0,0,0.3);
               }

               /* description section */
               ${DESCRIPTION_SELECTOR} {
                  margin: 0 1%;
                  overflow-y: auto;
                  max-height: 88vh;
                  padding: 10px 15px;
                  background-color: #222;
                  border: 1px solid #333;
               }

               ${DESCRIPTION_SELECTOR}:not(:hover) {
                  visibility: collapse;
                  overflow: hidden;
               }

               /* description section hover */
               ${DESCRIPTION_SELECTOR}:hover {
                  visibility: visible !important;
               }

               /* custom scroll */
               ${DESCRIPTION_SELECTOR}::-webkit-scrollbar {
                  height: 8px;
                  width: 10px;
               }

               ${DESCRIPTION_SELECTOR}::-webkit-scrollbar-button {
                  height: 0;
                  width: 0;
               }

               ${DESCRIPTION_SELECTOR}::-webkit-scrollbar-corner {
                  background: transparent;
               }

               ${DESCRIPTION_SELECTOR}::-webkit-scrollbar-thumb {
                  background: #e1e1e1;
                  border: 0;
                  border-radius: 0;
               }

               ${DESCRIPTION_SELECTOR}::-webkit-scrollbar-track {
                  background: #666;
                  border: 0;
                  border-radius: 0;
               }

               ${DESCRIPTION_SELECTOR}::-webkit-scrollbar-track:hover {
                  background: #666;
               }`);
         });

      // expand
      // document.addEventListener('yt-navigate-finish', () => {
      NOVA.waitElement(DESCRIPTION_SELECTOR)
         .then(descriptionEl => {
            descriptionEl.addEventListener('mouseenter', evt => {
               document.querySelector('#meta [collapsed] #more, [description-collapsed] #description-and-actions #description #expand')?.click()
            }, false);
            // }, { capture: true, once: true });
         });
      // });
   },
});
// for test:
// https://www.youtube.com/watch?v=IvZOmE36PLc - many extra characters. Manual chapter numbering
// https://www.youtube.com/watch?v=IR0TBQV147I = lots 3-digit timestamp

window.nova_plugins.push({
   id: 'description-timestamps-scroll',
   title: 'No scroll to player on timestamps',
   'title:zh': '没有在时间戳上滚动到播放器',
   'title:ja': 'タイムスタンプでプレーヤーにスクロールしない',
   'title:ko': '타임스탬프에서 플레이어로 스크롤하지 않음',
   'title:es': 'Sin desplazamiento al jugador en marcas de tiempo',
   'title:pt': 'Sem rolar para o jogador em timestamps',
   'title:fr': 'Pas de défilement vers le joueur sur les horodatages',
   // 'title:tr': 'Zaman damgalarında oynatıcıya kaydırma yok',
   'title:de': 'Kein Scrollen zum Player bei Zeitstempeln',
   run_on_pages: 'watch, -mobile',
   section: 'details',
   desc: 'Disable scrolling to player when clicking on timestamps',
   _runtime: user_settings => {

      // alt - https://greasyfork.org/en/scripts/438943-youtube-no-scroll-to-top-on-timestamps
      document.addEventListener('click', evt => {
         // <a href="/playlist?list=XX"> - erroneous filtering "t=XX" without the character "&"
         if (!evt.target.matches('a[href*="&t="]')) return;

         if (sec = NOVA.timeFormatTo.hmsToSec(evt.target.textContent)) {
            evt.preventDefault();
            evt.stopPropagation();
            evt.stopImmediatePropagation();

            // NOVA.videoElement?.currentTime = sec;
            movie_player.seekTo(sec);
         }
      }, { capture: true });

   },
});
window.nova_plugins.push({
   id: 'video-description-expand',
   title: 'Expand description',
   'title:zh': '展开说明',
   'title:ja': '説明を展開',
   'title:ko': '설명 펼치기',
   'title:es': 'Ampliar descripción',
   'title:pt': 'Expandir descrição',
   'title:fr': 'Développer la description',
   // 'title:tr': 'Açıklamayı genişlet',
   'title:de': 'Beschreibung erweitern',
   run_on_pages: 'watch, -mobile',
   // restart_on_transition: true,
   section: 'details',
   // desc: '',
   _runtime: user_settings => {

      // Doesn't work after page transition
      // NOVA.waitElement('#meta [collapsed] #more, [description-collapsed] #description-and-actions #description #expand')
      //    .then(btn => {
      //       if (user_settings.description_expand_mode == 'onhover') {
      //          btn.addEventListener('mouseenter', ({ target }) => target.click(), { capture: true, once: true });
      //       }
      //       // else if (user_settings.description_expand_mode == 'always') {
      //       else {
      //          btn.click();
      //       }
      //    });

      // const ATTR_MARK = 'nove-description-expand';

      NOVA.watchElements({
         selectors: [
            '#meta [collapsed] #more',
            '[description-collapsed] #description-and-actions #description #expand',
         ],
         // attr_mark: ATTR_MARK,
         callback: btn => {
            if (user_settings.description_expand_mode == 'onhover') {
               btn.addEventListener('mouseenter', ({ target }) => target.click(), { capture: true, once: true });
            }
            // else if (user_settings.description_expand_mode == 'always') {
            else {
               btn.click();
            }
            // NOVA.clear_watchElements(ATTR_MARK);
         }

      });

   },
   options: {
      description_expand_mode: {
         _tagName: 'select',
         label: 'Mode',
         'label:zh': '模式',
         'label:ja': 'モード',
         'label:ko': '방법',
         'label:es': 'Modo',
         'label:pt': 'Modo',
         // 'label:fr': 'Mode',
         // 'label:tr': 'Mod',
         'label:de': 'Modus',
         // title: '',
         options: [
            { label: 'always', value: 'always', selected: true, 'label:zh': '每次', 'label:ja': 'いつも', 'label:ko': '언제나', 'label:es': 'siempre', 'label:pt': 'sempre', 'label:fr': 'toujours', 'label:tr': 'her zaman', 'label:de': 'stets' },
            { label: 'on hover', value: 'onhover', 'label:zh': '悬停时', 'label:ja': 'ホバー時に', 'label:ko': '호버에', 'label:es': 'en vuelo estacionario', 'label:pt': 'pairando', 'label:fr': 'En vol stationnaire', 'label:tr': 'üzerinde gezinme', 'label:de': 'auf schweben' },
         ],
      },
   }
});
window.nova_plugins.push({
   id: 'header-unfixed',
   title: 'Header unfixed',
   'title:zh': '标题未固定',
   'title:ja': 'ヘッダーは固定されていません',
   'title:ko': '헤더가 고정되지 않음',
   'title:es': 'Encabezado sin arreglar',
   'title:pt': 'Cabeçalho não corrigido',
   'title:fr': 'En-tête non corrigé',
   // 'title:tr': 'Başlık sabitlenmemiş',
   'title:de': 'Kopfleiste nicht fixiert',
   // run_on_pages: 'watch, channel',
   run_on_pages: 'all, -embed, -mobile',
   // restart_on_transition: true,
   section: 'header',
   desc: 'Prevent header from sticking',
   'desc:zh': '防止头部粘连',
   'desc:ja': 'ヘッダーがくっつくのを防ぎます',
   'desc:ko': '헤더가 달라붙는 것을 방지',
   'desc:es': 'Evita que el cabezal se pegue',
   'desc:pt': 'Impede que o cabeçalho grude',
   // 'desc:fr': "Empêcher l'en-tête de coller",
   'desc:tr': 'Başlığın yapışmasını önleyin',
   'desc:de': 'Verhindert das Ankleben des Headers',
   _runtime: user_settings => {

      NOVA.css.push(
         `#masthead-container, ytd-mini-guide-renderer, #guide {
            position: absolute !important;
         }
         #chips-wrapper {
            position: sticky !important;
         }`);

      if (user_settings.header_unfixed_scroll) {
         scrollAfter(); // init

         document.addEventListener('yt-navigate-finish', () => {
            scrollAfter(); // no sense. Youtube auto-scroll up when page is transition

            if (NOVA.currentPage != 'watch') {
               NOVA.waitElement('video')
                  .then(video => {
                     video.addEventListener('loadeddata', scrollAfter, { capture: true, once: true });
                  });
            }
         });

         createArrowButton();

         function scrollAfter() {
            if (topOffset = document.getElementById('masthead')?.offsetHeight) {
               window.scrollTo({ top: topOffset });
            }
         }

         // create arrow button
         function createArrowButton() {
            const scrollDownButton = document.createElement('button');
            scrollDownButton.textContent = '▼';
            scrollDownButton.title = 'Scroll down';
            Object.assign(scrollDownButton.style, {
               cursor: 'pointer',
               background: 'transparent',
               color: 'deepskyblue',
               border: 'none',
            });
            scrollDownButton.onclick = scrollAfter;

            if (endnode = document.getElementById('end')) {
               endnode.parentElement.insertBefore(scrollDownButton, endnode);
            }
         }
      }

   },
   options: {
      header_unfixed_scroll: {
         _tagName: 'input',
         label: 'Scroll after header',
         'label:zh': '在标题后滚动',
         'label:ja': 'ヘッダーの後にスクロール',
         'label:ko': '헤더 뒤 스크롤',
         'label:es': 'Desplazarse después del encabezado',
         'label:pt': 'Role após o cabeçalho',
         'label:fr': "Faire défiler après l'en-tête",
         // 'label:tr': 'Başlıktan sonra kaydır',
         'label:de': 'Nach der Kopfzeile scrollen',
         title: 'Makes sense on a small screen',
         'title:zh': '在小屏幕上有意义',
         'title:ja': '小さな画面で意味があります',
         'title:ko': '작은 화면에서 이해하기',
         'title:es': 'Tiene sentido en una pantalla pequeña',
         'title:pt': 'Faz sentido em uma tela pequena',
         'title:fr': 'A du sens sur un petit écran',
         // 'title:tr': 'Küçük ekranda mantıklı',
         'title:de': 'Macht auf einem kleinen Bildschirm Sinn',
         type: 'checkbox',
      },
   }
});
window.nova_plugins.push({
   id: 'header-short',
   title: 'Header compact',
   'title:zh': '标题紧凑',
   'title:ja': 'ヘッダーコンパクト',
   'title:ko': '헤더 컴팩트',
   'title:es': 'Encabezado compacto',
   'title:pt': 'Cabeçalho compacto',
   'title:fr': 'En-tête compact',
   // 'title:tr': 'Başlık kompakt',
   'title:de': 'Header kompakt',
   run_on_pages: 'all, -embed, -mobile',
   section: 'header',
   // desc: '',
   _runtime: user_settings => {

      const height = '36px';

      NOVA.css.push(
         `#masthead #container.ytd-masthead {
            height: ${height} !important;
         }

         #search-form, #search-icon-legacy {
            height: ${height} !important;
         }

         body {
            --ytd-masthead-height: ${height};
         }

         #chips-wrapper.ytd-feed-filter-chip-bar-renderer {
            --ytd-rich-grid-chips-bar-top: ${height};
         }`);

   },
});
window.nova_plugins.push({
   id: 'thumbnails-watched',
   title: 'Mark watched thumbnails',
   'title:zh': '标记您观看的缩略图',
   'title:ja': '視聴したサムネイルにマークを付ける',
   'title:ko': '본 썸네일 표시',
   'title:es': 'Mark vio miniaturas',
   'title:pt': 'Mark assistiu às miniaturas',
   'title:fr': 'Marquer les vignettes visionnées',
   // 'title:tr': 'İzlenen küçük resimleri işaretle',
   'title:de': 'Angesehene Miniaturansichten markieren',
   run_on_pages: 'home, results, feed, channel, watch, -mobile',
   // run_on_pages: 'all, -embed',
   section: 'other',
   // desc: 'Need to Turn on [YouTube History]',
   _runtime: user_settings => {

      // Only the outline/border works. Other selection methods do not work in chrome!

      NOVA.css.push(
         `a#thumbnail,
         a[class*="thumbnail"] {
            outline: 1px solid var(--yt-spec-general-background-a);
         }

         /*a.ytp-videowall-still:visited, <-- Doesn't work in embed*/
         a#thumbnail:visited,
         a[class*="thumbnail"]:visited {
            outline: 1px solid ${user_settings.thumbnails_watched_frame_color || 'red'} !important;
         }`);

      if (user_settings.thumbnails_watched_title) {
         NOVA.css.push(
            `a#video-title:visited:not(:hover),
            #primary-inner #description a:visited {
               color: ${user_settings.thumbnails_watched_title_color} !important;
            }`);
      }

      // add blur
      // NOVA.css.push(
      //    `a.ytp-videowall-still.ytp-suggestion-set:visited, #thumbnail:visited {
      //       transition: all 200ms ease-in-out;
      //       opacity: .4 !important;
      //       mix-blend-mode: luminosity;
      //       filter: blur(2.2px);
      //    }

      //    .watched #thumbnail:hover, #thumbnail:visited:hover {
      //       transition: ease-out;
      //       opacity: 1 !important;
      //       mix-blend-mode: normal;
      //       filter: blur(0px);
      //    }`);

   },
   options: {
      thumbnails_watched_frame_color: {
         _tagName: 'input',
         label: 'Frame color',
         'label:zh': '框架颜色',
         'label:ja': 'フレームカラー',
         'label:ko': '프레임 색상',
         'label:es': 'Color del marco',
         'label:pt': 'Cor da moldura',
         'label:fr': 'Couleur du cadre',
         // 'label:tr': 'Çerçeve rengi',
         'label:de': 'Rahmenfarbe',
         type: 'color',
         value: '#FF0000',
      },
      thumbnails_watched_title: {
         _tagName: 'input',
         label: 'Set title color',
         'label:zh': '您要更改标题颜色吗？',
         'label:ja': 'タイトルの色を変更しますか？',
         'label:ko': '제목 색상 설정',
         'label:es': 'Establecer el color del título',
         'label:pt': 'Definir a cor do título',
         'label:fr': 'Définir la couleur du titre',
         // 'label:tr': 'Başlık rengini ayarla',
         'label:de': 'Titelfarbe festlegen',
         type: 'checkbox',
         // title: 'Link',
      },
      thumbnails_watched_title_color: {
         _tagName: 'input',
         label: 'Choose title color',
         'label:zh': '选择标题颜色',
         'label:ja': 'タイトルの色を選択',
         'label:ko': '제목 색상 선택',
         'label:es': 'Elija el color del título',
         'label:pt': 'Escolha a cor do título',
         'label:fr': 'Choisissez la couleur du titre',
         // 'label:tr': 'Başlık rengini seçin',
         'label:de': 'Titelfarbe auswählen',
         type: 'color',
         value: '#ff4500',
         'data-dependent': '{"thumbnails_watched_title":"true"}',
      },
   }
});
window.nova_plugins.push({
   id: 'scroll-to-top',
   title: 'Scroll to top button',
   'title:zh': '滚动到顶部按钮',
   'title:ja': 'トップボタンまでスクロール',
   'title:ko': '맨 위로 스크롤 버튼',
   'title:es': 'Desplazarse al botón superior',
   'title:pt': 'Role para o botão superior',
   'title:fr': 'Faites défiler vers le haut',
   // 'title:tr': 'Üst düğmeye kaydır',
   'title:de': 'Nach oben scrollen',
   run_on_pages: 'all, -embed, -mobile',
   section: 'other',
   desc: 'Displayed on long pages',
   'desc:zh': '出现在长页面上',
   'desc:ja': '長いページに表示されます',
   'desc:ko': '긴 페이지에 표시됨',
   'desc:es': 'Mostrado en páginas largas',
   'desc:pt': 'Exibido em páginas longas',
   // 'desc:fr': 'Affiché sur de longues pages',
   'desc:tr': 'Uzun sayfalarda görüntüleniyor',
   'desc:de': 'Wird auf langen Seiten angezeigt',
   _runtime: user_settings => {

      document.addEventListener('scroll', createBtn, { capture: true, once: true });

      function createBtn() {
         const SELECTOR_ID = 'nova-scrollTop-btn';

         const btn = document.createElement('button');
         btn.id = SELECTOR_ID;
         Object.assign(btn.style, {
            position: 'fixed',
            cursor: 'pointer',
            bottom: 0,
            left: '20%',
            // display: 'none',
            visibility: 'hidden',
            opacity: .5,
            width: '40%',
            height: '40px',
            border: 'none',
            // transition: 'opacity 200ms ease-in',
            outline: 'none',
            'z-index': 1,
            'border-radius': '100% 100% 0 0',
            'font-size': '16px',
            'background-color': 'rgba(0,0,0,.3)',
            'box-shadow': '0 16px 24px 2px rgba(0, 0, 0, .14), 0 6px 30px 5px rgba(0, 0, 0, .12), 0 8px 10px -5px rgba(0, 0, 0, .4)',
         });
         btn.addEventListener('click', () => {
            window.scrollTo({
               top: 0,
               // left: window.pageXOffset,
               behavior: user_settings.scroll_to_top_smooth ? 'smooth' : 'instant',
            });
            if (user_settings.scroll_to_top_autoplay && NOVA.currentPage == 'watch'
               // && NOVA.videoElement?.paused // restart ENDED
               && ['UNSTARTED', 'PAUSED'].includes(NOVA.getPlayerState())
            ) {
               movie_player.playVideo();
               // NOVA.videoElement?.play();
            }
         });

         // create arrow
         const arrow = document.createElement('span');
         Object.assign(arrow.style, {
            border: 'solid white',
            'border-width': '0 3px 3px 0',
            display: 'inline-block',
            padding: '4px',
            'vertical-align': 'middle',
            transform: 'rotate(-135deg)',
         });
         btn.append(arrow);
         document.body.append(btn);

         // btn hover style
         NOVA.css.push(
            `#${SELECTOR_ID}:hover {
               opacity: 1 !important;
               background-color: rgba(0,0,0,.6) !important;
            }`);

         // scroll event
         const scrollTop_btn = document.getElementById(SELECTOR_ID);
         let sOld;
         window.addEventListener('scroll', () => {
            const sCurr = document.documentElement.scrollTop > (window.innerHeight / 2);
            if (sCurr == sOld) return;
            sOld = sCurr;
            scrollTop_btn.style.visibility = sCurr ? 'visible' : 'hidden';
            // console.debug('visibility:', scrollTop_btn.style.visibility);
         });
      }

   },
   options: {
      scroll_to_top_smooth: {
         _tagName: 'input',
         label: 'Smooth',
         'label:zh': '光滑的',
         'label:ja': 'スムーズ',
         'label:ko': '매끄러운',
         'label:es': 'Suave',
         'label:pt': 'Suave',
         'label:fr': 'Lisse',
         // 'label:tr': 'Düz',
         'label:de': 'Glatt',
         type: 'checkbox',
      },
      scroll_to_top_autoplay: {
         _tagName: 'input',
         label: 'Video unPause',
         'label:zh': '视频取消暂停',
         'label:ja': 'ビデオの一時停止解除',
         'label:ko': '비디오 일시 중지 해제',
         'label:es': 'Reanudar video',
         'label:pt': 'Retomar vídeo',
         'label:fr': 'Annuler la pause de la vidéo',
         // 'label:tr': 'Videoyu Duraklat',
         'label:de': 'Video wieder anhalten',
         type: 'checkbox',
      },
   }
});
// for test:
// https://www.youtube.com/channel/UCl7OsED7y9eavZJbTGnK0xg/playlists - select Albums & Singles
// https://www.youtube.com/c/cafemusicbgmchannel/videos - live

window.nova_plugins.push({
   id: 'thumbnails-clear',
   title: 'Clear thumbnails',
   'title:zh': '清除缩略图',
   'title:ja': 'サムネイルをクリアする',
   'title:ko': '썸네일 지우기',
   'title:es': 'Miniaturas claras',
   'title:pt': 'Limpar miniaturas',
   'title:fr': 'Effacer les vignettes',
   // 'title:tr': 'Küçük resimleri temizle',
   'title:de': 'Miniaturansichten löschen',
   run_on_pages: 'home, results, feed, channel, watch',
   // run_on_pages: 'all, -embed',
   section: 'other',
   desc: 'Replaces the predefined thumbnail',
   'desc:zh': '替换预定义的缩略图',
   'desc:ja': '事前定義されたサムネイルを置き換えます',
   'desc:ko': '미리 정의된 축소판을 대체합니다',
   'desc:es': 'Reemplaza la miniatura predefinida',
   'desc:pt': 'Substitui a miniatura predefinida',
   // 'desc:fr': 'Remplace la vignette prédéfinie',
   'desc:tr': 'Önceden tanımlanmış küçük resmi değiştirir',
   'desc:de': 'Ersetzt das vordefinierte Thumbnail',
   _runtime: user_settings => {

      const ATTR_MARK = 'nova-thumb-preview-cleared';

      // dirty fix bug with not updating thumbnails
      document.addEventListener('yt-navigate-finish', () =>
         document.querySelectorAll(`[${ATTR_MARK}]`).forEach(e => e.removeAttribute(ATTR_MARK)));

      NOVA.watchElements({
         // selectors: 'a#thumbnail:not([hidden]):not(.ytd-playlist-thumbnail) #img[src]',
         selectors: 'a[class*="thumbnail"]:not([hidden]):not(.ytd-playlist-thumbnail) img[src]', // fix broken playlist
         attr_mark: ATTR_MARK,
         callback: img => {
            // skip "premiere", "live now"
            if (parent = img.closest('ytd-video-renderer, ytd-grid-video-renderer')) {
               if (!parent.querySelector('#overlays [overlay-style="DEFAULT"], #overlays [overlay-style="SHORTS"]')
                  || img.src.includes('hqdefault_live.jpg') || parent.querySelector('#video-badges [class*="live-now"], ytd-thumbnail-overlay-time-status-renderer [overlay-style="UPCOMING"], [aria-label="PREMIERE"]')
               ) {
                  // console.debug('skiped thumbnails-preview-cleared', parent);
                  return;
               }
            }
            // hq1,hq2,hq3,hq720,default,sddefault,mqdefault,hqdefault,maxresdefault(excluding for thumbs)
            // /(hq(1|2|3|720)|(sd|mq|hq|maxres)?default)/i - unnecessarily exact
            if ((re = /(\w{1}qdefault|hq\d+).jpg/i) && re.test(img.src)) {
               img.src = img.src.replace(re, (user_settings.thumbnails_clear_preview_timestamp || 'hq2') + '.jpg');
            }
         },
      });

      if (user_settings.thumbnails_clear_overlay) {
         NOVA.css.push(
            `#hover-overlays {
               visibility: hidden !important;
            }`);
      }

   },
   options: {
      thumbnails_clear_preview_timestamp: {
         _tagName: 'select',
         label: 'Thumbnail timestamps',
         'label:zh': '缩略图时间戳',
         'label:ja': 'サムネイルのタイムスタンプ',
         'label:ko': '썸네일 타임스탬프',
         'label:es': 'Marcas de tiempo en miniatura',
         'label:pt': 'Carimbos de data e hora em miniatura',
         'label:fr': 'Horodatages des vignettes',
         // 'label:tr': 'Küçük resim zaman damgaları',
         'label:de': 'Thumbnail-Zeitstempel',
         title: 'Show thumbnail from video time position',
         'title:zh': '从视频时间位置显示缩略图',
         'title:ja': 'ビデオの時間位置からサムネイルを表示',
         // 'title:es': 'Mostrar miniatura de la posición de tiempo del video',
         'title:pt': 'Mostrar miniatura da posição no tempo do vídeo',
         // 'title:tr': 'Video zaman konumundan küçük resmi göster',
         'title:de': 'Miniaturansicht von der Videozeitposition anzeigen',
         options: [
            { label: 'start', value: 'hq1', 'label:zh': '开始', 'label:ja': '始まり', 'label:ko': '시작', 'label:es': 'comienzo', 'label:pt': 'começar', 'label:fr': 'le début', 'label:tr': 'başlat', 'label:de': 'anfang' }, // often shows intro
            { label: 'middle', value: 'hq2', selected: true, 'label:zh': '中间', 'label:ja': '真ん中', 'label:ko': '~ 아니다', 'label:es': 'medio', 'label:pt': 'meio', 'label:fr': 'ne pas', 'label:tr': 'orta', 'label:de': 'mitte' },
            { label: 'end', value: 'hq3', 'label:zh': '结尾', 'label:ja': '終わり', 'label:ko': '끝', 'label:es': 'fin', 'label:pt': 'fim', 'label:fr': 'finir', 'label:tr': 'son', 'label:de': 'ende' }
         ],
      },
      thumbnails_clear_overlay: {
         _tagName: 'input',
         label: 'Hide overlay buttons on a thumbnail',
         'label:zh': '隐藏覆盖在缩略图上的按钮',
         'label:ja': 'サムネイルにオーバーレイされたボタンを非表示にする',
         'label:ko': '축소판에서 오버레이 버튼 숨기기',
         'label:es': 'Ocultar botones superpuestos en una miniatura',
         'label:pt': 'Ocultar botões de sobreposição em uma miniatura',
         'label:fr': 'Masquer les boutons de superposition sur une vignette',
         // 'label:tr': 'Küçük resimdeki bindirme düğmelerini gizle',
         'label:de': 'Überlagerungsschaltflächen auf einer Miniaturansicht ausblenden',
         type: 'checkbox',
         title: 'Hide [ADD TO QUEUE] [WATCH LATER]',
      },
   }
});
window.nova_plugins.push({
   id: 'channel-default-tab',
   title: 'Default tab on channel page',
   'title:zh': '频道页默认选项卡',
   'title:ja': 'チャンネルページのデフォルトタブ',
   'title:ko': '채널 페이지의 기본 탭',
   'title:es': 'La pestaña predeterminada en la página del canal',
   'title:pt': 'A guia padrão na página do canal',
   'title:fr': 'Onglet par défaut sur la page de la chaîne',
   // 'title:tr': 'Kanal sayfasındaki varsayılan sekme',
   'title:de': 'Die Standardregisterkarte auf der Kanalseite',
   run_on_pages: 'channel, -mobile',
   restart_on_transition: true,
   section: 'channel',
   // desc: '',
   _runtime: user_settings => {

      // if not - home page channel/user
      if (location.pathname.split('/').filter(i => i).length !== 2) return;

      if (user_settings.channel_default_tab_mode == 'redirect') {
         location.href += '/' + user_settings.channel_default_tab;

      } else {
         // tab select
         NOVA.waitElement('#tabsContent>[role="tab"]:nth-child(2)[aria-selected=true]')
            .then(() => {
               let tab_nth;
               switch (user_settings.channel_default_tab) {
                  case 'playlists': tab_nth = 6; break;
                  case 'about': tab_nth = 12; break;
                  // case 'videos':
                  default: tab_nth = 4;
               }
               // select tab
               document.body.querySelector(`#tabsContent>[role="tab"]:nth-child(${tab_nth})[aria-selected="false"`)
                  ?.click();
            });
      }

   },
   options: {
      channel_default_tab: {
         _tagName: 'select',
         label: 'Default tab',
         'label:zh': '默认标签页',
         'label:ja': 'デフォルトのタブ',
         'label:ko': '기본 탭',
         'label:es': 'Ficha predeterminada',
         'label:pt': 'Aba padrão',
         'label:fr': 'Onglet par défaut',
         // 'label:tr': 'Varsayılan sekme',
         'label:de': 'Standard-Tab',
         options: [
            { label: 'videos', value: 'videos', selected: true },
            { label: 'playlists', value: 'playlists' },
            { label: 'about', value: 'about' },
         ],
      },
      channel_default_tab_mode: {
         _tagName: 'select',
         label: 'Mode',
         'label:zh': '模式',
         'label:ja': 'モード',
         'label:ko': '방법',
         'label:es': 'Modo',
         'label:pt': 'Modo',
         // 'label:fr': 'Mode',
         // 'label:tr': 'Mod',
         'label:de': 'Modus',
         title: 'Redirect is safer but slower',
         'title:zh': '重定向是安全的，但速度很慢',
         'title:ja': 'リダイレクトは安全ですが遅くなります',
         'title:ko': '리디렉션이 더 안전하지만 느립니다',
         'title:es': 'La redirección es más segura pero más lenta',
         'label:pt': 'O redirecionamento é mais seguro, mas mais lento',
         'label:fr': 'La redirection est plus sûre mais plus lente',
         // 'label:tr': 'Yönlendirme daha güvenlidir ancak daha yavaştır',
         'label:de': 'Redirect ist sicherer, aber langsamer',
         options: [
            { label: 'redirect', value: 'redirect' },
            { label: 'click', /*value: '',*/ selected: true },
         ],
      },
   }
});
window.nova_plugins.push({
   id: 'thumbnails-title-normalize',
   title: 'Decapitalize thumbnails title',
   'title:zh': '从大写中删除缩略图标题',
   'title:ja': 'サムネイルのタイトルを大文字から外す',
   'title:ko': '썸네일 제목을 대문자로',
   'title:es': 'Descapitalizar el título de las miniaturas',
   'title:pt': 'Decapitalize o título das miniaturas',
   'title:fr': 'Démajuscule le titre des vignettes',
   // 'title:tr': 'Küçük resim başlığının büyük harflerini kaldır',
   'title:de': 'Thumbnails-Titel entfernen',
   run_on_pages: 'home, feed, channel, watch, -results',
   // run_on_pages: 'home, results, feed, channel, watch',
   // run_on_pages: 'all, -embed, -results',
   section: 'other',
   // desc: '',
   _runtime: user_settings => {

      const
         VIDEO_TITLE_SELECTOR = '#video-title:not(:empty):not([hidden]), a > h3.large-media-item-headline:not(:empty):not([hidden])', // '.title';
         MAX_TITLE_WORDS = +user_settings.thumbnails_title_normalize_smart_max_words || 2,
         ATTR_MARK = 'nova-thumb-title-normalized';

      // dirty fix bug with not updating thumbnails
      document.addEventListener('yt-navigate-finish', () =>
         document.querySelectorAll(`[${ATTR_MARK}]`).forEach(e => e.removeAttribute(ATTR_MARK)));

      if (user_settings.thumbnails_title_normalize_show_full) {
         NOVA.css.push(
            VIDEO_TITLE_SELECTOR + `{
               display: block !important;
               max-height: unset !important;
            }`);
      }

      if (user_settings.thumbnails_title_normalize_smart) {
         // Letters (Lu): Upper case letter unicode - https://apps.timwhitlock.info/js/regex
         const UpperCaseLetterRegex = new RegExp("([A-ZÀ-ÖØ-ÞĀĂĄĆĈĊČĎĐĒĔĖĘĚĜĞĠĢĤĦĨĪĬĮİĲĴĶĹĻĽĿŁŃŅŇŊŌŎŐŒŔŖŘŚŜŞŠŢŤŦŨŪŬŮŰŲŴŶŸ-ŹŻŽƁ-ƂƄƆ-ƇƉ-ƋƎ-ƑƓ-ƔƖ-ƘƜ-ƝƟ-ƠƢƤƦ-ƧƩƬƮ-ƯƱ-ƳƵƷ-ƸƼǄǇǊǍǏǑǓǕǗǙǛǞǠǢǤǦǨǪǬǮǱǴǶ-ǸǺǼǾȀȂȄȆȈȊȌȎȐȒȔȖȘȚȜȞȠȢȤȦȨȪȬȮȰȲȺ-ȻȽ-ȾɁɃ-ɆɈɊɌɎͰͲͶΆΈ-ΊΌΎ-ΏΑ-ΡΣ-ΫϏϒ-ϔϘϚϜϞϠϢϤϦϨϪϬϮϴϷϹ-ϺϽ-ЯѠѢѤѦѨѪѬѮѰѲѴѶѸѺѼѾҀҊҌҎҐҒҔҖҘҚҜҞҠҢҤҦҨҪҬҮҰҲҴҶҸҺҼҾӀ-ӁӃӅӇӉӋӍӐӒӔӖӘӚӜӞӠӢӤӦӨӪӬӮӰӲӴӶӸӺӼӾԀԂԄԆԈԊԌԎԐԒԔԖԘԚԜԞԠԢԱ-ՖႠ-ჅḀḂḄḆḈḊḌḎḐḒḔḖḘḚḜḞḠḢḤḦḨḪḬḮḰḲḴḶḸḺḼḾṀṂṄṆṈṊṌṎṐṒṔṖṘṚṜṞṠṢṤṦṨṪṬṮṰṲṴṶṸṺṼṾẀẂẄẆẈẊẌẎẐẒẔẞẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼẾỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲỴỶỸỺỼỾἈ-ἏἘ-ἝἨ-ἯἸ-ἿὈ-ὍὙὛὝὟὨ-ὯᾸ-ΆῈ-ΉῘ-ΊῨ-ῬῸ-Ώℂℇℋ-ℍℐ-ℒℕℙ-ℝℤΩℨK-ℭℰ-ℳℾ-ℿⅅↃⰀ-ⰮⱠⱢ-ⱤⱧⱩⱫⱭ-ⱯⱲⱵⲀⲂⲄⲆⲈⲊⲌⲎⲐⲒⲔⲖⲘⲚⲜⲞⲠⲢⲤⲦⲨⲪⲬⲮⲰⲲⲴⲶⲸⲺⲼⲾⳀⳂⳄⳆⳈⳊⳌⳎⳐⳒⳔⳖⳘⳚⳜⳞⳠⳢꙀꙂꙄꙆꙈꙊꙌꙎꙐꙒꙔꙖꙘꙚꙜꙞꙢꙤꙦꙨꙪꙬꚀꚂꚄꚆꚈꚊꚌꚎꚐꚒꚔꚖꜢꜤꜦꜨꜪꜬꜮꜲꜴꜶꜸꜺꜼꜾꝀꝂꝄꝆꝈꝊꝌꝎꝐꝒꝔꝖꝘꝚꝜꝞꝠꝢꝤꝦꝨꝪꝬꝮꝹꝻꝽ-ꝾꞀꞂꞄꞆꞋＡ-Ｚ]|\ud801[\udc00-\udc27]|\ud835[\udc00-\udc19\udc34-\udc4d\udc68-\udc81\udc9c\udc9e-\udc9f\udca2\udca5-\udca6\udca9-\udcac\udcae-\udcb5\udcd0-\udce9\udd04-\udd05\udd07-\udd0a\udd0d-\udd14\udd16-\udd1c\udd38-\udd39\udd3b-\udd3e\udd40-\udd44\udd46\udd4a-\udd50\udd6c-\udd85\udda0-\uddb9\uddd4-\udded\ude08-\ude21\ude3c-\ude55\ude70-\ude89\udea8-\udec0\udee2-\udefa\udf1c-\udf34\udf56-\udf6e\udf90-\udfa8\udfca]){2,}", 'g');

         // first letter uppercase
         NOVA.css.push({
            'text-transform': 'uppercase',
            // color: '#8A2BE2', // indicator
         }, `[${ATTR_MARK}]:first-letter`, 'important');

         NOVA.watchElements({
            selectors: VIDEO_TITLE_SELECTOR,
            attr_mark: ATTR_MARK,
            callback: title => {
               let counterUpperCase = 0;
               const normalizedText = title.textContent.replace(UpperCaseLetterRegex, match => {
                  // console.debug('match', match);
                  counterUpperCase++;
                  return match.toLowerCase();
               });

               // Upper case
               if (counterUpperCase > MAX_TITLE_WORDS) {
                  title.textContent = normalizedText.trim();
                  // console.debug('normalize:', counterUpperCase, '\n' + title.title, '\n' + title.textContent);
               }
            }
         });

      } else {
         NOVA.css.push(
            VIDEO_TITLE_SELECTOR + ` {
               text-transform: lowercase !important;
            }

            ${VIDEO_TITLE_SELECTOR}:first-letter {
               text-transform: uppercase !important;
            }`);
      }

   },
   options: {
      thumbnails_title_normalize_show_full: {
         _tagName: 'input',
         label: 'Show full title',
         'label:zh': '显示完整标题',
         'label:ja': '完全なタイトルを表示',
         'label:ko': '전체 제목 표시',
         'label:es': 'Mostrar título completo',
         'label:pt': 'Mostrar título completo',
         'label:fr': 'Afficher le titre complet',
         // 'label:tr': 'Tam başlığı göster',
         'label:de': 'Vollständigen Titel anzeigen',
         type: 'checkbox'
      },
      thumbnails_title_normalize_smart: {
         _tagName: 'input',
         label: 'Smart mode',
         'label:zh': '智能模式',
         'label:ja': 'Smart モード',
         'label:ko': '스마트 모드',
         'label:es': 'Modo inteligente',
         'label:pt': 'Modo inteligente',
         'label:fr': 'Mode intelligent',
         // 'label:tr': 'Akıllı mod',
         'label:de': 'Smart-Modus',
         type: 'checkbox',
         title: 'Filter words by regex pattern',
         'title:ja': '正規表現パターンで単語をフィルタリングする',
         'title:zh': '按正则表达式过滤单词',
         'title:ko': '정규식 패턴으로 단어 필터링',
         'title:es': 'Filtrar palabras por patrón de expresiones regulares',
         'title:pt': 'Filtrar palavras por padrão regex',
         'title:fr': 'Filtrer les mots par modèle regex',
         // 'title:tr': 'Kelimeleri normal ifade kalıbına göre filtrele',
         'title:de': 'Wörter nach Regex-Muster filtern',
      },
      thumbnails_title_normalize_smart_max_words: {
         _tagName: 'input',
         label: 'Max words in uppercase',
         'label:zh': '大写字数上限',
         'label:ja': '大文字の最大単語数',
         'label:ko': '대문자의 최대 단어 수',
         'label:es': 'Máximo de palabras en mayúsculas',
         'label:pt': 'Máximo de palavras em maiúsculas',
         'label:fr': 'Mots maximum en majuscules',
         // 'label:tr': 'Büyük harfli maksimum kelime',
         'label:de': 'Maximale Wörter in Großbuchstaben',
         type: 'number',
         // title: '',
         placeholder: '1-10',
         min: 1,
         max: 10,
         value: 2,
         'data-dependent': '{"thumbnails_title_normalize_smart":"true"}',
      },
   }
});
window.nova_plugins.push({
   id: 'dark-theme',
   title: 'Dark theme by default',
   'title:zh': '默认为深色主题',
   'title:ja': 'デフォルトではダークテーマ',
   'title:ko': '기본적으로 어두운 테마',
   'title:es': 'Tema oscuro por defecto',
   'title:pt': 'Tema escuro por padrão',
   'title:fr': 'Thème sombre par défaut',
   // 'title:tr': 'Varsayılan olarak koyu tema',
   'title:de': 'Standardmäßig dunkles Design',
   run_on_pages: 'all, -embed',
   section: 'other',
   desc: 'Warn! Do not use unnecessarily',
   'desc:zh': '警告！ 不要不必要地使用',
   'desc:ja': '暖かい！ 不必要に使用しないでください',
   'desc:ko': '경고하다! 불필요하게 사용하지 마십시오',
   'desc:es': '¡Advertir! no lo use innecesariamente',
   'desc:pt': 'Avisar! não use desnecessariamente',
   // 'desc:fr': 'Prévenir! Ne pas utiliser inutilement',
   'desc:tr': 'Uyarmak! gereksiz yere kullanmayınız',
   'desc:de': 'Warnen! nicht unnötig verwenden',
   _runtime: user_settings => {

      // NOVA.cookie.set('PREF', 'f6=400'); // Other parameters will be overwritten
      NOVA.cookie.updateParam({ key: 'PREF', param: 'f6', value: 40000400 });

   },
});
// test - https://www.youtube.com/results?search_query=Blackmill+ft.+Veela+-+Let+It+Be

window.nova_plugins.push({
   id: 'thumbnails-mix-hide',
   title: "Hide 'Mix' thumbnails",
   'title:zh': '隐藏[混合]缩略图',
   'title:ja': '「Mix」サムネイルを非表示',
   'title:ko': '"믹스" 썸네일 숨기기',
   'title:es': "Ocultar miniaturas de 'Mix'",
   'title:pt': "Ocultar miniaturas de 'Mix'",
   'title:fr': 'Masquer les vignettes "Mix"',
   // 'title:tr': "'Karıştır' küçük resimlerini gizle",
   'title:de': '„Mix“-Thumbnails ausblenden',
   run_on_pages: 'home, results, watch',
   section: 'sidebar',
   desc: '[Mix] offers to rewatch what has already saw',
   'desc:zh': '[混合]提供重新观看已经看过的内容',
   'desc:ja': '「Mix」は、すでに見たものを再視聴することを提案します',
   'desc:ko': '[Mix]는 이미 본 것을 다시 볼 것을 제안합니다',
   'desc:es': '[Mix] ofrece volver a ver lo que ya vio',
   'desc:pt': '[Mix] se oferece para rever o que já viu',
   // 'desc:tr': '[Mix], daha önce görmüş olanı yeniden izlemeyi teklif ediyor',
   'desc:de': '[Mix] bietet an, bereits Gesehenes noch einmal anzuschauen',
   _runtime: user_settings => {

      const cssSelectors = [
         'ytd-radio-renderer',
         'ytd-compact-radio-renderer',
         '.use-ellipsis',
         // 'a.ytp-videowall-still.ytp-suggestion-set[data-is-mix=true]',
         'a.ytp-videowall-still[data-is-mix=true]',
         'ytm-radio-renderer',
      ]
         .join(':not([hidden]),');

      NOVA.css.push(cssSelectors + ' { display: none !important; }');

      // for home page
      document.addEventListener('yt-action', evt => {
         if (evt.detail?.actionName == 'ytd-rich-item-index-update-action' && NOVA.currentPage == 'home') {

            document.body.querySelectorAll('a[href*="list="][href*="start_radio="]:not([hidden]), a[title^="Mix -"]:not([hidden])')
               .forEach(el => el.closest('ytd-rich-item-renderer')?.remove());
            // for test
            // .forEach(el => {
            //    if (thumb = el.closest('ytd-rich-item-renderer')) {
            //       // thumb.style.display = 'none';
            //       console.debug('has Mix:', thumb);
            //       thumb.style.border = '2px solid red'; // mark for test
            //    }
            // });
         }
      });
   },
});
window.nova_plugins.push({
   id: 'page-title-time',
   title: 'Show time in tab title',
   'title:zh': '在标签标题中显示时间',
   'title:ja': 'タブタイトルに時間を表示する',
   'title:ko': '탭 제목에 시간 표시',
   'title:es': 'Mostrar la hora en el título de la pestaña',
   'title:pt': 'Mostrar tempo no título da guia',
   'title:fr': "Afficher l'heure dans le titre de l'onglet",
   // 'title:tr': 'Sekme başlığında zamanı göster',
   'title:de': 'Zeit im Tab-Titel anzeigen',
   run_on_pages: 'watch',
   section: 'other',
   // desc: 'Show the current time of the video on the title',
   _runtime: user_settings => {

      // if isLive dont update - video.duration!

      // let backupTitle = document.title; // create bug. on ini, the value must be null
      let backupTitle;

      document.addEventListener('yt-navigate-start', () => backupTitle = null); // remove saved title

      NOVA.waitElement('video')
         .then(video => {
            // update title
            video.addEventListener('timeupdate', updateTitle.bind(video));
            // save title
            video.addEventListener('loadeddata', () => {
               if (backupTitle
                  || movie_player.classList.contains('ad-showing')
                  || /^((\d?\d:){1,2}\d{2})(\s\|\s)/g.exec(document.title)) return;
               backupTitle = document.title;
            });
            // restore the original title
            ['pause', 'ended'].forEach(evt => { // need add event "suspend" ?
               video.addEventListener(evt, () => {
                  if (!backupTitle) return;
                  let newTitleArr;
                  if (movie_player.getVideoData().isLive) newTitleArr = video.currentTime;
                  setTitle([newTitleArr, backupTitle]);
               });
            });
         });

      function updateTitle() {
         if (!backupTitle) return;

         let newTitleArr = [];

         switch (movie_player.getVideoData().isLive ? 'current' : user_settings.page_title_time_mode) {
            case 'current':
               newTitleArr = [this.currentTime];
               break;

            case 'current-duration':
               if (!isNaN(this.duration)) {
                  newTitleArr = [this.currentTime, ' / ', this.duration]; // string
               }
               break;

            // case 'left':
            default:
               if (!isNaN(this.duration)) {
                  newTitleArr = [this.duration - this.currentTime];
               }
         }

         // add playbackRate if it is not default
         // if (this.playbackRate !== 1) newTitleArr.push(` (${this.playbackRate}x)`);

         newTitleArr = newTitleArr
            .map(t => typeof t === 'string' ? t : NOVA.timeFormatTo.HMS.digit(t / this.playbackRate))
            .join('');

         setTitle([newTitleArr, backupTitle]);
      }

      function setTitle(arr) {
         document.title = arr
            .filter(n => n)
            .join(' | '); // add to regex
         // .join(' • '); // add to regex
      }

      // function getVideoTitle() {
      //    return movie_player.getVideoData().title || document.body.querySelector('#info h1.title')?.content;
      // }

   },
   options: {
      page_title_time_mode: {
         _tagName: 'select',
         label: 'Mode',
         'label:zh': '模式',
         'label:ja': 'モード',
         'label:ko': '방법',
         'label:es': 'Modo',
         'label:pt': 'Modo',
         // 'label:fr': 'Mode',
         // 'label:tr': 'Mod',
         'label:de': 'Modus',
         options: [
            // { label: 'current', value: 'current', 'label:zh': '现在', 'label:ja': '現在', 'label:ko': '현재의', 'label:es': 'actual', 'label:pt': 'atual', 'label:fr': 'courant', 'label:tr': 'akım', 'label:de': 'strom' },
            { label: 'left', value: 'left', selected: true, 'label:zh': '剩下', 'label:ja': '左', 'label:ko': '왼쪽', 'label:es': 'izquierda', 'label:pt': 'deixou', 'label:fr': 'à gauche', 'label:tr': 'o ayrıldı', 'label:de': 'links' },
            { label: 'current/duration', value: 'current-duration', 'label:zh': '现在/期间', 'label:ja': '現在/期間', 'label:ko': '현재/기간', 'label:es': 'actual/duración', 'label:pt': 'atual/duração', 'label:fr': 'courant/durée', 'label:tr': 'akım/süre', 'label:de': 'strom/dauer' },
         ],
      },
   }
});
window.nova_plugins.push({
   id: 'search-filter',
   title: 'Search channel filter',
   'title:zh': '搜索频道过滤器',
   'title:ja': 'チャンネルフィルターを検索',
   'title:ko': '채널 필터 검색',
   'title:es': 'Filtro de canales de búsqueda',
   'title:pt': 'Filtro de canais de pesquisa',
   'title:fr': 'Rechercher un filtre de canal',
   // 'title:tr': 'Kanal filtresi ara',
   'title:de': 'Kanalfilter suchen',
   run_on_pages: 'results',
   section: 'other',
   desc: 'Hide channels on the search page',
   'desc:zh': '在搜索页面上隐藏频道',
   'desc:ja': '検索ページでチャンネルを非表示にする',
   'desc:ko': '검색 페이지에서 채널 숨기기',
   'desc:es': 'Ocultar canales en la página de búsqueda',
   'desc:pt': 'Ocultar canais na página de pesquisa',
   // 'desc:fr': 'Masquer les chaînes sur la page de recherche',
   'desc:tr': 'Arama sayfasında kanalları gizle',
   'desc:de': 'Kanäle auf der Suchseite ausblenden',
   _runtime: user_settings => {

      const keywords = user_settings.search_filter_channel_blocklist
         ?.split(/[\n,;]/)
         .map(e => e.toString().trim().toLowerCase())
         .filter(e => e.length);

      NOVA.watchElements({
         selectors: [
            'ytd-video-renderer',
            'ytd-playlist-renderer',
            'ytm-compact-video-renderer'
         ],
         attr_mark: 'thumb-search-filtered',
         callback: thumb => {
            keywords.forEach(keyword => {
               if (thumb.querySelector('ytd-channel-name:not(:empty), .compact-media-item-byline:not(:empty)')
                  ?.textContent.toLowerCase().includes(keyword)
               ) {
                  thumb.remove();
                  // thumb.style.border = '2px solid red'; // mark for test
                  // console.log('filter removed', keyword, thumb);
               }
            });
         }
      });

   },
   options: {
      search_filter_channel_blocklist: {
         _tagName: 'textarea',
         label: 'Channels list',
         'label:zh': '频道列表',
         'label:ja': 'チャンネルリスト',
         'label:ko': '채널 목록',
         'label:es': 'Lista de canales',
         'label:pt': 'Lista de canais',
         'label:fr': 'Liste des chaînes',
         // 'label:tr': 'Kanal listesi',
         'label:de': 'Liste der Kanäle',
         title: 'separator: "," or ";" or "new line"',
         'title:zh': '分隔器： "," 或 ";" 或 "新队"',
         'title:ja': 'セパレータ： "," または ";" または "改行"',
         'title:ko': '구분 기호: "," 또는 ";" 또는 "새 줄"',
         'title:es': 'separador: "," o ";" o "new line"',
         'title:pt': 'separador: "," ou ";" ou "new line"',
         'title:fr': 'séparateur : "," ou ";" ou "nouvelle ligne"',
         // 'title:tr': 'ayırıcı: "," veya ";" veya "new line"',
         'title:de': 'separator: "," oder ";" oder "new line"',
         placeholder: 'channel1, channel2',
         required: true,
      },
   }
});
// for test
// https://www.youtube.com/shorts/5ndfxasp2r0

window.nova_plugins.push({
   id: 'shorts-redirect',
   title: 'Redirect Shorts to regular URLs (watch)',
   // 'label:zh': '',
   // 'label:ja': '',
   // 'label:ko': '',
   // 'label:es': '',
   // 'label:pt': '',
   // 'label:fr': '',
   // 'label:tr': '',
   // 'label:de': '',
   run_on_pages: 'results, feed, channel, shorts',
   // restart_on_transition: true,
   section: 'other',
   desc: 'Redirect Shorts video to normal player',
   'desc:zh': '将 Shorts 视频重定向到普通播放器',
   'desc:ja': 'ショートパンツのビデオを通常のプレーヤーにリダイレクトする',
   'desc:ko': 'Shorts 비디오를 일반 플레이어로 리디렉션',
   'desc:es': 'Redirigir el video de Shorts al reproductor normal',
   'desc:pt': 'Redirecionar o vídeo do Shorts para o player normal',
   'desc:fr': 'Rediriger la vidéo Short vers un lecteur normal',
   'desc:tr': 'Shorts videosunu normal oynatıcıya yönlendir',
   'desc:de': 'Shorts-Video auf normalen Player umleiten',
   _runtime: user_settings => {

      if ('shorts' == NOVA.currentPage) {
         // alt - https://greasyfork.org/en/scripts/444710-byts-better-youtube-shorts-greasyfork-edition
         return location.href = location.href.replace('shorts/', 'watch?v=');
         // location.replace(location.href.replace('/shorts/', '/watch?v='));
      }

      if (user_settings['shorts-disable']) return; // conflict with plugin. Attention! After shorts redirect

      const ATTR_MARK = 'nova-thumb-shorts-pathed';

      // clear before restart_on_transition
      // document.addEventListener('yt-navigate-start', () =>
      //    NOVA.clear_watchElements(ATTR_MARK), { capture: true, once: true });

      // fix clear thumb on page update (change sort etc.)
      // document.addEventListener('yt-page-data-updated', () =>
      document.addEventListener('yt-navigate-finish', () =>
         document.querySelectorAll(`[${ATTR_MARK}]`).forEach(e => e.removeAttribute(ATTR_MARK))
         , { capture: true, once: true });

      const thumbsSelectors = [
         // 'ytd-rich-item-renderer', // home
         'ytd-video-renderer', // results
         'ytd-grid-video-renderer', // feed, channel
         // 'ytd-compact-video-renderer', // sidepanel in watch
         'ytm-compact-video-renderer', // mobile
      ];

      NOVA.watchElements({
         selectors: thumbsSelectors.map(e => e + ':not([hidden]) a[href*="shorts/"]'),
         attr_mark: ATTR_MARK,
         callback: link => {
            link.href += '&list=RDSH'; // fix href redirect to watch
            // link.href = link.href.replace('shorts/', 'watch?v=');

            // console.debug('has #shorts:', link);
            // link.style.border = '2px solid green'; // mark for test

            // add time to overlay
            if (user_settings.shorts_thumbnails_time && link.matches('a#thumbnail')) {
               NOVA.waitElement('ytd-thumbnail-overlay-time-status-renderer', link)
                  .then(overlay => {
                     if ((thumb = link.closest(thumbsSelectors.join(',\n')))
                        && (time = getThumbTime(thumb.data))
                     ) {
                        // console.debug('time', time);
                        overlay.setAttribute('overlay-style', 'DEFAULT');
                        overlay.querySelector('#text').textContent = time;
                     }
                  });
            }
         },
      });

      function getThumbTime(videoData = required()) {
         // document.body.querySelectorAll("ytd-video-renderer, ytd-grid-video-renderer")
         //    .forEach(videoRenderer => {
         const
            // videoData = videoRenderer.data,
            title = videoData.title.accessibility.accessibilityData.label,
            publishedTimeText = videoData.publishedTimeText.simpleText,
            viewCountText = videoData.viewCountText.simpleText;

         let
            [minutes, seconds] = title.split(publishedTimeText)[1].split(viewCountText)[0] // "12 minutes, 17 seconds "
               .split(/\D/, 2).filter(Number).map(s => (+s === 1 ? 60 : +s) - 1); // fix minutes and offest

         if (!seconds) { // fix mixed up in places
            seconds = minutes;
            minutes = null;
         }
         // console.debug('>', [minutes, seconds]);
         return [minutes || '0', seconds].join(':');
         // });
      }

   },
   options: {
      shorts_thumbnails_time: {
         _tagName: 'input',
         label: 'Add time to overlay',
         // 'label:zh': '',
         // 'label:ja': '',
         // 'label:ko': '',
         // 'label:es': '',
         // 'label:pt': '',
         // 'label:fr': '',
         // 'label:tr': '',
         // 'label:de': '',
         type: 'checkbox',
         // title: '',
      },
   }
});
window.nova_plugins.push({
   id: 'premiere-disable',
   title: 'Hide Premieres',
   // 'title:zh': '',
   // 'title:ja': '',
   // 'title:ko': '',
   // 'title:es': '',
   // 'title:pt': '',
   // 'title:fr': '',
   // 'title:tr': '',
   // 'title:de': '',
   run_on_pages: 'feed, channel',
   section: 'other',
   // desc: '',
   _runtime: user_settings => {

      // Strategy 1
      // init
      // hideThumb(); // does work
      // page scroll update. init
      document.addEventListener('yt-action', evt => {
         if (['ytd-update-grid-state-action', 'yt-append-continuation-items-action'].includes(evt.detail?.actionName)) {
            hideThumb();
         }
      });

      function hideThumb() {
         const conteinerSelector = 'ytd-grid-video-renderer:not([hidden])';

         document.body.querySelectorAll(
            `${conteinerSelector} ytd-thumbnail-overlay-time-status-renderer[overlay-style="UPCOMING"],
            ${conteinerSelector} #overlays [aria-label="PREMIERE"]`
            // #metadata-line:has_text("Premieres")
         )
            .forEach(el => el.closest(conteinerSelector)?.remove());
         // for test
         // .forEach(el => {
         //    if (thumb = el.closest(conteinerSelector)) {
         //       thumb.remove();
         //       // thumb.style.display = 'none';

         //       console.debug('has Premieres:', thumb);
         //       thumb.style.border = '2px solid red'; // mark for test
         //    }
         // });
      }

      // Strategy 2
      // const conteinerSelector = 'ytd-grid-video-renderer:not([hidden])';

      // NOVA.watchElements({
      //    selectors: [
      //       `${conteinerSelector} ytd-thumbnail-overlay-time-status-renderer[overlay-style="UPCOMING"]`,
      //       `${conteinerSelector} #overlays [aria-label="PREMIERE"]`
      //       // #metadata-line:has_text("Premieres")
      //    ],
      //    attr_mark: 'thumb-filtered',
      //    callback: thumb => {
      //       thumb.closest(conteinerSelector)?.remove();
      //       console.debug('has Premieres:', thumb);
      //       thumb.style.border = '2px solid red'; // mark for test

      //       // thumb.textContent.toLowerCase().includes('Premieres')
      //    }
      // });

   },
});
window.nova_plugins.push({
   id: 'stream-disable',
   title: 'Hide Stream (live)',
   // 'title:zh': '',
   // 'title:ja': '',
   // 'title:ko': '',
   // 'title:es': '',
   // 'title:pt': '',
   // 'title:fr': '',
   // 'title:tr': '',
   // 'title:de': '',
   run_on_pages: 'home, results, feed, channel, watch',
   // restart_on_transition: true,
   section: 'other',
   // desc: '',
   _runtime: user_settings => {

      const ATTR_MARK = 'nova-thumb-live-cleared';

      // clear before restart_on_transition
      // document.addEventListener('yt-navigate-start', () => NOVA.clear_watchElements(ATTR_MARK));

      NOVA.watchElements({
         selectors: [
            'ytd-rich-item-renderer', // home
            'ytd-video-renderer', // results
            'ytd-grid-video-renderer', // feed, channel
            'ytd-compact-video-renderer', // sidepanel in watch
            'ytm-compact-video-renderer', // mobile
            // #video-badges span:has_text("LIVE NOW")
         ],
         attr_mark: ATTR_MARK,
         callback: thumb => {
            // live now
            if (thumb.querySelector('#video-badges [class*="live-now"], img[src*="qdefault_live.jpg"]')) {
               thumb.remove();
               // thumb.style.display = 'none';

               // console.debug('has live now:', thumb);
               // thumb.style.border = '2px solid red'; // mark for test
            }
            // Streamed
            if (user_settings.streamed_disable) {
               if (thumb.querySelector('#metadata-line')?.textContent?.includes('Streamed')
                  || thumb.querySelector('#video-title')?.getAttribute('aria-label')?.includes('Streamed')
               ) {
                  thumb.remove();
                  // // thumb.style.display = 'none';

                  // console.debug('has Streamed:', thumb);
                  // thumb.style.border = '2px solid green'; // mark for test
               }
            }
         },
      });

   },
   options: {
      streamed_disable: {
         _tagName: 'input',
         label: 'Also streamed',
         // 'label:zh': '',
         // 'label:ja': '',
         // 'label:ko': '',
         // 'label:es': '',
         // 'label:pt': '',
         // 'label:fr': '',
         // 'label:tr': '',
         // 'label:de': '',
         type: 'checkbox',
         title: 'That have been completed',
         'title:zh': '已经完成的',
         'title:ja': '完了しました',
         'title:ko': '완료한 것',
         'title:es': 'Que han sido completados',
         'title:pt': 'Que foram concluídos',
         'title:fr': 'Qui ont été complétés',
         // 'title:tr': 'Tamamlanmış olanlar',
         'title:de': 'Die sind abgeschlossen',
      },
   }
});
window.nova_plugins.push({
   id: 'shorts-disable',
   title: 'Hide Shorts',
   'title:zh': '隐藏短裤',
   'title:ja': 'ショーツを隠す',
   'title:ko': '반바지 숨기기',
   'title:es': 'Ocultar pantalones cortos',
   'title:pt': 'Ocultar shorts',
   'title:fr': 'Masquer les shorts',
   // 'title:tr': 'Şort Gizle',
   'title:de': 'Shorts verstecken',
   run_on_pages: 'results, feed, channel',
   // restart_on_transition: true,
   section: 'other',
   // desc: '',
   _runtime: user_settings => {

      const ATTR_MARK = 'nova-thumb-shorts-cleared';

      // clear before restart_on_transition
      // document.addEventListener('yt-navigate-start', () =>
      //    NOVA.clear_watchElements(ATTR_MARK), { capture: true, once: true });

      // fix clear thumb on page update (change sort etc.)
      // document.addEventListener('yt-page-data-updated', () =>
      document.addEventListener('yt-navigate-finish', () =>
         document.querySelectorAll(`[${ATTR_MARK}]`).forEach(e => e.removeAttribute(ATTR_MARK))
         , { capture: true, once: true });

      NOVA.watchElements({
         selectors: [
            // 'ytd-rich-item-renderer', // home
            'ytd-video-renderer', // results
            'ytd-grid-video-renderer', // feed, channel
            // 'ytd-compact-video-renderer', // sidepanel in watch
            'ytm-compact-video-renderer', // mobile
            // #video-badges span:has_text("LIVE NOW")
         ],
         attr_mark: ATTR_MARK,
         callback: thumb => {
            // if (thumb.querySelector('a[href*="shorts/"], ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"], #overlays [aria-label="Shorts"]')
            if (thumb.querySelector('a[href*="shorts/"]')
               // user_settings.shorts_disable_min_duration
               || NOVA.timeFormatTo.hmsToSec(thumb.querySelector('#overlays #text:not(:empty)')?.textContent.trim()) < (+user_settings.shorts_disable_min_duration || 60)
            ) {
               thumb.remove();
               // // thumb.style.display = 'none';

               // console.debug('has #shorts:', link);
               // thumb.style.border = '2px solid blue'; // mark for test
            }
         },
      });

   },
   options: {
      shorts_disable_min_duration: {
         _tagName: 'input',
         label: 'Less duration in sec',
         'label:zh': '最短持续时间（以秒为单位）',
         'label:ja': '秒単位の最小期間',
         'label:ko': '최소 지속 시간(초)',
         'label:es': 'Duración mínima en segundos',
         'label:pt': 'Duração mínima em segundos',
         'label:fr': 'Durée minimale en secondes',
         // 'label:tr': 'Saniye cinsinden minimum süre',
         'label:de': 'Mindestdauer in Sekunden',
         type: 'number',
         // title: '60 - default',
         // title: 'Minimum duration in seconds',
         placeholder: '60-300',
         step: 1,
         min: 3,
         max: 3600,
         value: 60,
      },
   }
});
window.nova_plugins.push({
   id: 'rss-link',
   title: 'Add RSS Feed link',
   'title:zh': '添加 RSS 提要链接',
   'title:ja': 'RSSフィードリンクを追加',
   'title:ko': 'RSS 피드 링크 추가',
   'title:es': 'Agregar enlace de fuente RSS',
   'title:pt': 'Adicionar link de feed RSS',
   'title:fr': 'Ajouter un lien de flux RSS',
   // 'title:tr': 'RSS Beslemesi bağlantısı ekle',
   'title:de': 'RSS-Feed-Link hinzufügen',
   run_on_pages: 'channel, playlist, -mobile',
   restart_on_transition: true,
   section: 'channel',
   // desc: '',
   _runtime: user_settings => {

      const
         SELECTOR_ID = 'nova-rss-link',
         rssLinkPrefix = 'https://www.youtube.com/feeds/videos.xml',
         playlistURL = rssLinkPrefix + '?playlist_id=' + NOVA.queryURL.get('list'),
         genChannelURL = channelId => rssLinkPrefix + '?channel_id=' + channelId;


      switch (NOVA.currentPage) {
         case 'channel':
            NOVA.waitElement('#channel-header #channel-name')
               .then(container => {
                  if (channelId = NOVA.getChannelId()) {
                     insertToHTML({ 'url': genChannelURL(channelId), 'container': container });
                     addMetaLink();
                  }
                  // console.debug('channelId:', channelId);
               });
            break;

         case 'playlist':
            NOVA.waitElement('#owner-container')
               .then(container => {
                  // playlist page
                  insertToHTML({ 'url': playlistURL, 'container': container });
                  addMetaLink();
               });
            break;
      }

      function insertToHTML({ url = required(), container = required() }) {
         // console.debug('insertToHTML', ...arguments);
         if (!(container instanceof HTMLElement)) return console.error('container not HTMLElement:', container);

         // (document.getElementById(SELECTOR_ID) || (function () {
         (container.querySelector('#' + SELECTOR_ID) || (function () {
            const link = document.createElement('a');
            link.id = SELECTOR_ID;
            // link.href = url;
            link.target = '_blank';
            // btn.className = `ytp-button ${SELECTOR_BTN_CLASS_NAME}`;
            link.innerHTML =
               `<svg viewBox="-28.364 -29.444 42.324 42.822" height="100%" width="100%">
                  <g fill="currentColor">
                     <path fill="#F60" d="M-17.392 7.875c0 3.025-2.46 5.485-5.486 5.485s-5.486-2.46-5.486-5.485c0-3.026 2.46-5.486 5.486-5.486s5.486 2.461 5.486 5.486zm31.351 5.486C14.042.744 8.208-11.757-1.567-19.736c-7.447-6.217-17.089-9.741-26.797-9.708v9.792C-16.877-19.785-5.556-13.535.344-3.66a32.782 32.782 0 0 1 4.788 17.004h8.827v.017zm-14.96 0C-.952 5.249-4.808-2.73-11.108-7.817c-4.821-3.956-11.021-6.184-17.255-6.15v8.245c6.782-.083 13.432 3.807 16.673 9.774a19.296 19.296 0 0 1 2.411 9.326h8.278v-.017z"/>
                  </g>
               </svg>`;
            Object.assign(link.style, {
               height: '20px',
               display: 'inline-block',
               padding: '5px',
            });
            container.prepend(link);
            return document.getElementById(SELECTOR_ID);
            // return container.appendChild(link);
         })())
            .href = url;
      }

      function addMetaLink() {
         if (channelId = NOVA.getChannelId()) {
            document.head.insertAdjacentHTML('beforeend',
               `<link rel="alternate" type="application/rss+xml" title="RSS" href="${genChannelURL(channelId)}">`);
         }
      }

   },
});
// for test
// https://www.youtube.com/watch?v=jx9LC2kyfcQ - ad rent block

window.nova_plugins.push({
   id: 'ad-skip-button',
   title: 'Ad intro Skip',
   'title:zh': '广告视频跳过',
   'title:ja': '広告スキップ',
   'title:ko': '광고 건너뛰기',
   'title:es': 'Saltar anuncios',
   'title:pt': 'Pular anúncios',
   'title:fr': 'Ignorer les annonces',
   // 'title:tr': 'Reklam Atlama',
   'title:de': 'Anzeigen überspringen',
   run_on_pages: 'watch',
   section: 'player',
   desc: 'Auto click on [Skip Ad] button',
   'desc:zh': '自动点击“Skip Ad”按钮',
   'desc:ja': '「Skip Ad」ボタンの自動クリック',
   'desc:ko': '【광고 건너뛰기】버튼 자동 클릭',
   // 'desc:es': 'Haga clic automáticamente en el botón [Omitir anuncio]',
   // 'desc:pt': 'Clique automaticamente no botão [Ignorar anúncio]',
   // 'desc:fr': "Clic automatique sur le bouton [Ignorer l'annonce]",
   'desc:tr': "Clic automatique sur le bouton [Ignorer l'annonce]",
   // 'desc:de': 'Klicken Sie automatisch auf die Schaltfläche [Anzeige überspringen]',
   _runtime: user_settings => {

      // NOVA.css.push( // hides the appearance when playing on the next video
      //    `#movie_player.ad-showing video {
      //       visibility: hidden !important;
      //    }`);

      NOVA.waitElement('#movie_player.ad-showing video')
         .then(video => {
            adSkip();

            video.addEventListener('loadeddata', adSkip.bind(video));
            video.addEventListener('canplay', adSkip.bind(video));
            // video.addEventListener('durationupdate', adSkip.bind(video)); // stream
         });

      function adSkip() {
         if (!movie_player.classList.contains('ad-showing')) return;

         this.currentTime = this.duration; // set end ad video

         NOVA.waitElement('div.ytp-ad-text.ytp-ad-skip-button-text:not([hidden]), button.ytp-ad-skip-button:not([hidden])')
            .then(btn => btn.click()); // click skip-ad
      }
   },
});
// for test
// https://www.youtube.com/watch?v=ig2b_obsCQ8 - has chapters

window.nova_plugins.push({
   id: 'player-loop',
   title: 'Add loop playback button',
   'title:zh': '添加循环播放按钮',
   'title:ja': 'ループ再生ボタンを追加',
   'title:ko': '루프 재생 버튼 추가',
   'title:es': 'Agregar botón de reproducción en bucle',
   'title:pt': 'Adicionar botão de reprodução em loop',
   'title:fr': 'Ajouter un bouton de lecture en boucle',
   // 'title:tr': 'Döngü oynatma düğmesi ekle',
   'title:de': 'Loop-Wiedergabe-Schaltfläche hinzufügen',
   run_on_pages: 'watch',
   section: 'player',
   // desc: 'Loop video playback',
   // 'desc:zh': '循环播放视频',
   // 'desc:ja': 'ビデオ再生をループする',
   // 'desc:ko': '루프 비디오 재생',
   // 'desc:es': 'Reproducción de video en bucle',
   // 'desc:pt': 'Reprodução de vídeo em loop',
   // 'desc:fr': 'Lecture vidéo en boucle',
   // 'desc:tr': 'Döngü video oynatma',
   'desc:de': 'Loop-Videowiedergabe',
   _runtime: user_settings => {

      // createPlayerButton
      NOVA.waitElement('.ytp-left-controls .ytp-play-button')
         .then(container => {
            const
               SELECTOR_BTN_CLASS_NAME = 'nova-right-custom-button', // same class in "player-buttons-custom" plugin
               btn = document.createElement('button');

            // "ye-repeat-button"
            btn.className = `ytp-button ${SELECTOR_BTN_CLASS_NAME}`;
            btn.style.opacity = .5;
            btn.style.minWidth = getComputedStyle(container).width || '48px'; // fix if has chapters
            btn.title = 'Repeat';
            // btnPopup.setAttribute('aria-label','');
            btn.innerHTML =
               `<svg viewBox="-6 -6 36 36" height="100%" width="100%">
                  <g fill="currentColor">
                     <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4zm-4-2V9h-1l-2 1v1h1.5v4H13z"/>
                  </g>
               </svg>`;
            btn.addEventListener('click', () => {
               if (!NOVA.videoElement) return console.error('btn > videoElement empty:', NOVA.videoElement);

               NOVA.videoElement.loop = !NOVA.videoElement.loop && true;
               // fix ad
               if (movie_player.classList.contains('ad-showing')) NOVA.videoElement.removeAttribute('loop');

               btn.style.opacity = NOVA.videoElement.hasAttribute('loop') ? 1 : .5;
            });

            container.after(btn);
         });

      // NOVA.waitElement('video')
      //    .then(video => {
      //       video.loop = true;
      //       video.addEventListener('loadeddata', ({ target }) => target.loop = true);
      //    });

      // Doesn't work
      // NOVA.waitElement('#movie_player')
      //    .then(() => movie_player.setLoop());

   },
});
// for test
// the adjustment area depends on the video size. Problems are visible at non-standard proportions
// https://www.youtube.com/watch?v=embed%2FJVi_e - err - TypeError: Cannot read property 'playerMicroformatRenderer' of undefined

// fot "isMusic" fn test
// https://www.youtube.com/watch?v=kCHiSHxTXgg - svg icon "🎵"
// https://www.youtube.com/results?search_query=Highly+Suspect+-+Upperdrugs+-+2019 // test transition. Open firt thumb "Highly Suspect 🎵"

window.nova_plugins.push({
   id: 'rate-wheel',
   title: 'Playback speed control',
   'title:zh': '播放速度控制',
   'title:ja': '再生速度制御',
   'title:ko': '재생 속도 제어',
   'title:es': 'Controle de velocidade de reprodução',
   'title:pt': 'Controle de velocidade de reprodução',
   'title:fr': 'Contrôle de la vitesse de lecture',
   // 'title:tr': 'Oynatma hızı kontrolü',
   'title:de': 'Steuerung der Wiedergabegeschwindigkeit',
   run_on_pages: 'watch, embed',
   section: 'player',
   // desc: 'Use mouse wheel to change playback speed',
   desc: 'with mouse wheel',
   'desc:zh': '带鼠标滚轮',
   'desc:ja': 'マウスホイール付き',
   'desc:ko': '마우스 휠로',
   'desc:es': 'con rueda de ratón',
   'desc:pt': 'com roda do mouse',
   // 'desc:fr': 'avec molette de la souris',
   'desc:tr': 'fare tekerleği ile',
   'desc:de': 'mit mausrad',
   _runtime: user_settings => {

      const musicIconSvgSelector = '#upload-info #channel-name svg path[d*="M12,4v9.38C11.27,12.54,10.2,12,9,12c-2.21,0-4,1.79-4,4c0,2.21,1.79,4,4,4s4-1.79,4-4V8h6V4H12z"]';

      // NOVA.waitElement('#movie_player')
      //    .then(() => {
      //       // trigger default indicator
      //       // Strategy 1. Default indicator doesn't work for html5 way (Strategy 2)
      //       movie_player.addEventListener('onPlaybackRateChange', rate => {
      //          console.debug('onPlaybackRateChange', rate);
      //       });
      //    });

      NOVA.waitElement('video')
         .then(video => {
            const sliderConteiner = renderSlider.apply(video);
            // console.debug('sliderConteiner', sliderConteiner);

            // trigger default indicator
            // Strategy 2
            video.addEventListener('ratechange', function () {
               // console.debug('ratechange', movie_player.getPlaybackRate(), this.playbackRate);
               NOVA.bezelTrigger(this.playbackRate + 'x');

               // slider update
               if (Object.keys(sliderConteiner).length) {
                  sliderConteiner.slider.value = this.playbackRate;
                  sliderConteiner.sliderLabel.textContent = `Speed (${this.playbackRate})`;
                  sliderConteiner.sliderCheckbox.checked = this.playbackRate === 1 ? false : true;
               }
            });

            setDefaultRate(); // init

            video.addEventListener('loadeddata', setDefaultRate); // update

            if (Object.keys(sliderConteiner).length) {
               sliderConteiner.slider.addEventListener('input', ({ target }) => playerRate.set(target.value));
               sliderConteiner.slider.addEventListener('change', ({ target }) => playerRate.set(target.value));
               sliderConteiner.slider.addEventListener('wheel', evt => {
                  evt.preventDefault();
                  const rate = playerRate.adjust(+user_settings.rate_step * Math.sign(evt.wheelDelta));
                  // console.debug('current rate:', rate);
               });
               sliderConteiner.sliderCheckbox.addEventListener('change', ({ target }) => target.checked || playerRate.set(1));
            }
         });

      // mousewheel in player area
      if (user_settings.rate_hotkey) {
         NOVA.waitElement('.html5-video-container')
            .then(container => {
               container.addEventListener('wheel', evt => {
                  evt.preventDefault();

                  if (evt[user_settings.rate_hotkey]
                     || (user_settings.rate_hotkey == 'none' && !evt.ctrlKey && !evt.altKey && !evt.shiftKey)) {
                     // console.debug('hotkey caught');
                     const rate = playerRate.adjust(+user_settings.rate_step * Math.sign(evt.wheelDelta));
                     // console.debug('current rate:', rate);
                  }
               });
            });
      }

      // during initialization, the icon can be loaded after the video
      if (+user_settings.rate_default !== 1 && user_settings.rate_default_apply_music) {
         NOVA.waitElement(musicIconSvgSelector)
            .then(icon => playerRate.set(1));

         NOVA.waitElement('#upload-info #channel-name a[href]')
            .then(channelName => {
               // channelNameVEVO
               if (/(VEVO|Topic|Records|AMV)$/.test(channelName.textContent)
                  || channelName.textContent.toUpperCase().includes('MUSIC')
               ) {
                  playerRate.set(1);
               }
               // channelNameRecords:
               // https://www.youtube.com/channel/UCQnWm_Nnn35u3QGVkcAf87Q
               // https://www.youtube.com/channel/UCpDJl2EmP7Oh90Vylx0dZtA
               // https://www.youtube.com/channel/UCC7ElkFVK3m03gEMfaq6Ung
               // channelNameAMV - https://www.youtube.com/channel/UCtrt9u1luNTxXFDuYIoK2FA
               // special case channelNameLyrics - https://www.youtube.com/channel/UCK9HbSctHJ8n-aZmJsGD7_w
            });
      }


      const playerRate = {
         // DEBUG: true,

         // default method requires a multiplicity of 0.25
         testDefault: rate => (+rate % .25) === 0
            && +rate <= 2
            && +user_settings.rate_default <= 2
            && (typeof movie_player !== 'undefined' && movie_player.hasOwnProperty('getPlaybackRate')),

         async set(level = 1) {
            this.log('set', ...arguments);
            if (this.testDefault(level)) {
               this.log('set:default');
               movie_player.setPlaybackRate(+level) && this.saveInSession(level);

            } else {
               this.log('set:html5');
               NOVA.videoElement = await NOVA.waitElement('video');
               if (NOVA.videoElement) { // fix - Uncaught SyntaxError: Invalid left-hand side in assignment
                  NOVA.videoElement.playbackRate = +level;
                  this.clearInSession();
               }
            }
         },

         adjust(rate_step = required()) {
            this.log('adjust', ...arguments);
            return this.testDefault(rate_step) ? this.default(+rate_step) : this.html5(+rate_step);
         },
         // Strategy 1
         default(playback_rate = required()) {
            this.log('default', ...arguments);
            const playbackRate = movie_player.getPlaybackRate();
            // const inRange = delta => {
            //    const rangeRate = movie_player.getAvailablePlaybackRates();
            //    const playbackRateIdx = rangeRate.indexOf(playbackRate);
            //    return rangeRate[playbackRateIdx + delta];
            // };
            // const newRate = inRange(Math.sign(+playback_rate));
            const inRange = step => {
               const setRateStep = playbackRate + step;
               return (.1 <= setRateStep && setRateStep <= 2) && +setRateStep.toFixed(2);
            };
            const newRate = inRange(+playback_rate);
            // set new rate
            if (newRate && newRate != playbackRate) {
               movie_player.setPlaybackRate(newRate);

               if (newRate === movie_player.getPlaybackRate()) {
                  this.saveInSession(newRate);

               } else {
                  console.error('playerRate:default different: %s!=%s', newRate, movie_player.getPlaybackRate());
               }
            }
            this.log('default return', newRate);
            return newRate === movie_player.getPlaybackRate() && newRate;
         },
         // Strategy 2
         html5(playback_rate = required()) {
            this.log('html5', ...arguments);
            if (!NOVA.videoElement) return console.error('playerRate > videoElement empty:', NOVA.videoElement);

            const playbackRate = NOVA.videoElement.playbackRate;
            const inRange = step => {
               const setRateStep = playbackRate + step;
               return (.1 <= setRateStep && setRateStep <= 3) && +setRateStep.toFixed(2);
            };
            const newRate = inRange(+playback_rate);
            // set new rate
            if (newRate && newRate != playbackRate) {
               // NOVA.videoElement?.defaultPlaybackRate = newRate;
               NOVA.videoElement.playbackRate = newRate;

               if (newRate === NOVA.videoElement.playbackRate) {
                  this.clearInSession();

               } else {
                  console.error('playerRate:html5 different: %s!=%s', newRate, NOVA.videoElement.playbackRate);
               }
            }
            this.log('html5 return', newRate);
            return newRate === NOVA.videoElement.playbackRate && newRate;
         },

         saveInSession(level = required()) {
            try {
               sessionStorage['yt-player-playback-rate'] = JSON.stringify({
                  creation: Date.now(), data: level.toString(),
               })
               this.log('playbackRate save in session:', ...arguments);

            } catch (err) {
               console.warn(`${err.name}: save "rate" in sessionStorage failed. It seems that "Block third-party cookies" is enabled`, err.message);
            }
         },

         clearInSession() {
            const keyName = 'yt-player-playback-rate';
            try {
               sessionStorage.hasOwnProperty(keyName) && sessionStorage.removeItem(keyName);
               this.log('playbackRate save in session:', ...arguments);

            } catch (err) {
               console.warn(`${err.name}: save "rate" in sessionStorage failed. It seems that "Block third-party cookies" is enabled`, err.message);
            }
         },

         log() {
            if (this.DEBUG && arguments.length) {
               console.groupCollapsed(...arguments);
               console.trace();
               console.groupEnd();
            }
         },
      };

      function setDefaultRate() {
         // init rate_default
         // console.debug('setDefaultRate', +user_settings.rate_default, user_settings.rate_default_apply_music, isMusic());
         if (+user_settings.rate_default !== 1) {
            const is_music = isMusic();
            if (NOVA.videoElement?.playbackRate !== +user_settings.rate_default
               && (!user_settings.rate_default_apply_music || !is_music)
            ) {
               // console.debug('update rate_default');
               playerRate.set(user_settings.rate_default);

            } else if (NOVA.videoElement?.playbackRate !== 1 && is_music) { // reset
               // console.debug('reset rate_default');
               playerRate.set(1);
            }
         }

         function isMusic() {
            const
               channelName = document.body.querySelector('#upload-info #channel-name a:not(:empty)')?.textContent,
               titleStr = movie_player.getVideoData().title
                  // add playlist title check
                  + ((playlistTitle = document.querySelector('#secondary #playlist #header-description a[href*="/playlist"]:not(:empty)')?.textContent) ? '.' + playlistTitle : ''), // https://www.youtube.com/watch?v=cEdVLDfV1e0&list=PLVrIzE02N3EE9mplAPO8BGleeenadCSNv&index=2
               titleWords = titleStr?.match(/\w+/g);

            if (user_settings.rate_default_apply_music == 'expanded') {
               // 【MAD】,『MAD』,「MAD」
               // warn false finding ex: "AUDIO visualizer" 'underCOVER','VOCALoid','write THEME','UI THEME','photo ALBUM', 'lolyPOP', 'ascENDING', speeED, 'LapOP' 'Ambient AMBILIGHT lighting', 'CD Projekt RED', TEASER
               if (titleStr.split(' - ').length === 2  // search for a hyphen. Ex.:"Artist - Song"
                  || ['【', '『', '「', 'CD', 'AUDIO', 'FULL', 'TOP', 'TRACK', 'TRAP', 'THEME', 'PIANO', '8-BIT'].some(i => titleWords?.map(w => w.toUpperCase()).includes(i))
               ) {
                  return true;
               }
            }

            return [
               titleStr,
               location.href, // 'music.youtube.com' or 'youtube.com#music'
               channelName,

               // ALL BELOW - not updated after page transition!
               // window.ytplayer?.config?.args.title,
               // document.head.querySelector('meta[itemprop="genre"][content]')?.content,
               // window.ytplayer?.config?.args.raw_player_response.microformat?.playerMicroformatRenderer.category,
               document.body.querySelector('ytd-player')?.player_?.getCurrentVideoConfig()?.args.raw_player_response.microformat.playerMicroformatRenderer.category
            ]
               .some(i => i?.toUpperCase().includes('MUSIC') || i?.toUpperCase().includes('SOUND'))
               // has svg icon "🎵"
               || document.body.querySelector(musicIconSvgSelector)
               // channelNameVEVO
               || /(VEVO|Topic|Records|AMV)$/.test(channelName) // https://www.youtube.com/channel/UCHV1I4axw-6pCeQTUu7YFhA
               // word
               || titleWords?.length && ['🎵', '♫', 'SONG', 'SOUND', 'SOUNDTRACK', 'LYRIC', 'LYRICS', 'AMBIENT', 'MIX', 'REMIX', 'VEVO', 'CLIP', 'KARAOKE', 'OPENING', 'COVER', 'VOCAL', 'INSTRUMENTAL', 'DNB', 'BASS', 'BEAT', 'ALBUM', 'PLAYLIST', 'DUBSTEP', 'POP', 'CHILL', 'RELAX', 'EXTENDED', 'CINEMATIC']
                  .some(i => titleWords.map(w => w.toUpperCase()).includes(i))
               // words
               || ['OFFICIAL VIDEO', 'OFFICIAL AUDIO', 'FEAT.', 'FT.', 'LIVE RADIO', 'DANCE VER', 'HIP HOP', 'HOUR VER', 'HOURS VER'] // 'FULL ALBUM'
                  .some(i => titleStr.toUpperCase().includes(i))
               // word (case sensitive)
               || titleWords?.length && ['OP', 'ED', 'MV', 'PV', 'OST', 'NCS', 'BGM', 'EDM', 'GMV', 'AMV', 'MMD', 'MAD']
                  .some(i => titleWords.includes(i));
         }
      }

      function renderSlider() {
         const
            SELECTOR_ID = 'nova-rate-slider-menu',
            SELECTOR = '#' + SELECTOR_ID; // for css

         NOVA.css.push(
            `${SELECTOR} [type="range"] {
               vertical-align: text-bottom;
               margin: '0 5px',
            }

            ${SELECTOR} [type="checkbox"] {
               appearance: none;
               outline: none;
               cursor: pointer;
            }

            ${SELECTOR} [type="checkbox"]:checked {
               background: #f00;
            }

            ${SELECTOR} [type="checkbox"]:checked:after {
               left: 20px;
               background-color: #fff;
            }`);

         // slider
         const slider = document.createElement('input');
         slider.className = 'ytp-menuitem-slider';
         slider.type = 'range';
         slider.min = +user_settings.rate_step;
         slider.max = Math.max(2, +user_settings.rate_default);
         slider.step = +user_settings.rate_step;
         slider.value = this.playbackRate;
         // slider.addEventListener('change', () => playerRate.set(slider.value));
         // slider.addEventListener('wheel', () => playerRate.set(slider.value));

         const sliderIcon = document.createElement('div');
         sliderIcon.className = 'ytp-menuitem-icon';

         const sliderLabel = document.createElement('div');
         sliderLabel.className = 'ytp-menuitem-label';
         sliderLabel.textContent = `Speed (${this.playbackRate})`;

         const sliderCheckbox = document.createElement('input');
         sliderCheckbox.className = 'ytp-menuitem-toggle-checkbox';
         sliderCheckbox.type = 'checkbox';
         sliderCheckbox.title = 'Remember speed';
         // sliderCheckbox.addEventListener('change', function () {
         //    this.value
         // });

         const out = {};

         // appends
         const right = document.createElement('div');
         right.className = 'ytp-menuitem-content';
         out.sliderCheckbox = right.appendChild(sliderCheckbox);
         out.slider = right.appendChild(slider);

         const speedMenu = document.createElement('div');
         speedMenu.className = 'ytp-menuitem';
         speedMenu.id = SELECTOR_ID;
         speedMenu.append(sliderIcon);
         out.sliderLabel = speedMenu.appendChild(sliderLabel);
         speedMenu.append(right);

         document.body.querySelector('.ytp-panel-menu')
            ?.append(speedMenu);

         return out;

         // append final html code
         // document.body.querySelector('.ytp-panel-menu')
         //    ?.insertAdjacentHTML('beforeend',
         //       `<div class="ytp-menuitem" id="rate-slider-menu">
         //          <div class="ytp-menuitem-icon"></div>
         //          <div class="ytp-menuitem-label">Speed (${user_settings.rate_default})</div>
         //          <div class="ytp-menuitem-content">
         //             <input type="checkbox" checked="${Boolean(user_settings.rate_default)}" title="Remember speed" class="ytp-menuitem-toggle-checkbox">
         //             <input type="range" min="0.5" max="4" step="0.1" class="ytp-menuitem-slider">
         //          </div>
         //       </div>`);
      }

   },
   options: {
      rate_default: {
         _tagName: 'input',
         // label: 'Default rate',
         label: 'Speed at startup',
         'label:zh': '启动速度',
         'label:ja': '起動時の速度',
         'label:ko': '시작 시 속도',
         'label:es': 'Velocidad al inicio',
         'label:pt': 'Velocidade na inicialização',
         'label:fr': 'Rapidité au démarrage',
         // 'label:tr': 'Başlangıçta hız',
         'label:de': 'Geschwindigkeit beim Start',
         type: 'number',
         title: '1 - default',
         // placeholder: '1-3',
         step: 0.05,
         min: 1,
         // max: 3,
         value: 1,
      },
      rate_default_apply_music: {
         _tagName: 'select',
         label: 'Music genre',
         'label:zh': '音乐流派视频',
         'label:ja': '音楽ジャンルのビデオ',
         'label:ko': '음악 장르',
         'label:es': 'Género musical',
         'label:pt': 'Gênero musical',
         'label:fr': 'Genre de musique',
         // 'label:tr': 'Müzik tarzı',
         'label:de': 'Musikrichtung',
         title: 'extended detection - may trigger falsely',
         'title:zh': '扩展检测 - 可能会错误触发',
         'title:ja': '拡張検出-誤ってトリガーされる可能性があります',
         'title:ko': '확장 감지 - 잘못 트리거될 수 있음',
         'title:pt': 'detecção estendida - pode disparar falsamente',
         'title:fr': 'détection étendue - peut se déclencher par erreur',
         // 'title:tr': 'genişletilmiş algılama - yanlış tetiklenebilir',
         'title:de': 'erweiterte Erkennung - kann fälschlicherweise auslösen',
         // 'title:es': 'detección extendida - puede activarse falsamente',
         options: [
            { label: 'skip', value: true, selected: true, 'label:zh': '跳过', 'label:ja': 'スキップ', 'label:ko': '건너 뛰기', 'label:es': 'saltar', 'label:pt': 'pular', 'label:fr': 'sauter', 'label:tr': 'atlamak', 'label:de': 'überspringen' },
            { label: 'skip (extended)', value: 'expanded', 'label:zh': '跳过（扩展检测）', 'label:ja': 'スキップ（拡張検出）', 'label:ko': '건너뛰다(확장)', 'label:es': 'omitir (extendida)', 'label:pt': 'pular (estendido)', 'label:fr': 'sauter (étendu)', 'label:tr': 'atlamak (genişletilmiş)', 'label:de': 'überspringen (erweitert)' },
            { label: 'force apply', value: false, 'label:zh': '施力', 'label:ja': '力を加える', 'label:ko': '강제 적용', 'label:es': 'aplicar fuerza', 'label:pt': 'aplicar força', 'label:fr': 'appliquer la force', 'label:tr': 'zorlamak', 'label:de': 'kraft anwenden' },
         ],
         'data-dependent': '{"rate_default":"!1"}',
      },
      rate_step: {
         _tagName: 'input',
         label: 'Step',
         'label:zh': '步',
         // 'label:ja': 'ステップ',
         'label:ko': '단계',
         'label:es': 'Paso',
         'label:pt': 'Degrau',
         'label:fr': 'Étape',
         // 'label:tr': 'Adım',
         'label:de': 'Schritt',
         type: 'number',
         title: '0.25 - default',
         placeholder: '0.1-1',
         step: 0.05,
         min: 0.1,
         max: 0.5,
         value: 0.25,
      },
      rate_hotkey: {
         _tagName: 'select',
         label: 'Hotkey',
         'label:zh': '热键',
         // 'label:ja': 'ホットキー',
         'label:ko': '단축키',
         'label:es': 'Tecla de acceso rápido',
         'label:pt': 'Tecla de atalho',
         'label:fr': 'Raccourci',
         // 'label:tr': 'Kısayol tuşu',
         'label:de': 'Schnelltaste',
         options: [
            { label: 'alt+wheel', value: 'altKey', selected: true },
            { label: 'shift+wheel', value: 'shiftKey' },
            { label: 'ctrl+wheel', value: 'ctrlKey' },
            { label: 'wheel', value: 'none' },
            { label: 'disable', value: false },
         ],
      },
   }
});
window.nova_plugins.push({
   id: 'player-pin-scroll',
   title: 'Pin player while scrolling',
   'title:zh': '滚动时固定播放器',
   'title:ja': 'スクロール中にプレイヤーを固定する',
   'title:ko': '스크롤하는 동안 플레이어 고정',
   'title:es': 'Fijar jugador mientras se desplaza',
   'title:pt': 'Fixar jogador enquanto rola',
   'title:fr': 'Épingler le lecteur pendant le défilement',
   // 'title:tr': 'Kaydırırken oynatıcıyı sabitle',
   'title:de': 'Pin-Player beim Scrollen',
   run_on_pages: 'watch, -mobile',
   section: 'player',
   desc: 'Player stays always visible while scrolling',
   'desc:zh': '滚动时播放器始终可见',
   'desc:ja': 'スクロール中、プレーヤーは常に表示されたままになります',
   'desc:ko': '스크롤하는 동안 플레이어가 항상 표시됨',
   // 'desc:es': 'El jugador permanece siempre visible mientras se desplaza',
   'desc:pt': 'O jogador fica sempre visível enquanto rola',
   // 'desc:fr': 'Le lecteur reste toujours visible pendant le défilement',
   'desc:tr': 'Kaydırma sırasında oyuncu her zaman görünür kalır',
   'desc:de': 'Player bleibt beim Scrollen immer sichtbar',
   _runtime: user_settings => {

      // Doesn't work because scroll is not part of the [user-trusted events](https://html.spec.whatwg.org/multipage/interaction.html#triggered-by-user-activation).
      // if (user_settings.player_pip_scroll) {
      //    if (!document.pictureInPictureEnabled) return console, error('pip disable');

      //    NOVA.waitElement('video')
      //       .then(video => {
      //          if (video.disablePictureInPicture) return console, error('pip disable');

      //          new window.IntersectionObserver(async ([entry]) => {
      //             if (entry.isIntersecting) {
      //                if (video === document.pictureInPictureElement) {
      //                   await document.exitPictureInPicture();
      //                }
      //                return
      //             }
      //             if (!document.pictureInPictureElement && video.readyState > 0) {
      //                await video.requestPictureInPicture();
      //             }
      //          }, {
      //             root: null,
      //             threshold: 0.2, // set offset 0.X means trigger if atleast X0% of element in viewport
      //          })
      //             .observe(video);
      //       });
      //    return;
      // }

      const
         CLASS_VALUE = 'nova-player-pin',
         PINNED_SELECTOR = '.' + CLASS_VALUE, // for css
         CLOSE_BTN_CLASS_VALUE = CLASS_VALUE + '-unpin-btn',
         CLOSE_BTN_SELECTOR = '.' + CLOSE_BTN_CLASS_VALUE; // for css

      // if player fullscreen desable float mode
      document.addEventListener('fullscreenchange', () =>
         (document.fullscreen || movie_player.isFullscreen()) && movie_player.classList.remove(CLASS_VALUE), false);

      // toggle
      NOVA.waitElement('#player-theater-container')
         .then(container => {
            // movie_player / #ytd-player
            new window.IntersectionObserver(([entry]) => {
               // leave viewport
               if (entry.isIntersecting) {
                  movie_player.classList.remove(CLASS_VALUE);
                  drag.reset(); // save old pos. Clear curr pos

               } else if (!movie_player.isFullscreen()) { // enter viewport // fix bug on scroll in fullscreen player mode
                  // } else { // enter viewport
                  movie_player.classList.add(CLASS_VALUE);
                  drag?.storePos?.X && drag.setTranslate(drag.storePos); // restore pos
               }

               window.dispatchEvent(new Event('resize')); // fix: restore player size if un/pin
            }, {
               threshold: (+user_settings.player_float_scroll_sensivity_range / 100) || .5, // set offset 0.X means trigger if atleast X0% of element in viewport
            })
               .observe(container);
         });

      NOVA.waitElement(PINNED_SELECTOR)
         .then(async player => {
            // add drag
            drag.init(player);

            // wait video size
            await NOVA.waitUntil(
               // movie_player.clientWidth && movie_player.clientHeight
               NOVA.videoElement.videoWidth && NOVA.videoElement.videoHeight
               // && document.getElementById('masthead-container')?.offsetHeight
               , 500) // 500ms

            initMiniStyles();

            // add unpin button
            NOVA.css.push(
               PINNED_SELECTOR + ` {
                  --zIndex: ${Math.max(
                  NOVA.css.getValue('#chat', 'z-index'),
                  NOVA.css.getValue('.ytp-chrome-top .ytp-cards-button', 'z-index'),
                  // NOVA.css.getValue('#description', 'z-index'), // consider plugin "description-popup"
                  // getComputedStyle(document.getElementById('chat'))['z-index'],
                  // getComputedStyle(document.querySelector('.ytp-chrome-top .ytp-cards-button'))['z-index'],
                  // // getComputedStyle(document.getElementById('description'))['z-index'], // consider plugin "description-popup"
                  601) + 1};
               }

               ${CLOSE_BTN_SELECTOR} { display: none; }

               ${PINNED_SELECTOR} ${CLOSE_BTN_SELECTOR} {
                  display: initial !important;
                  position: absolute;
                  cursor: pointer;
                  top: 10px;
                  left: 10px;
                  width: 28px;
                  height: 28px;
                  color: white;
                  border: none;
                  outline: none;
                  opacity: .1;
                  /* border-radius: 100%; */
                  z-index: var(--zIndex);
                  font-size: 24px;
                  font-weight: bold;
                  background-color: rgba(0, 0, 0, 0.8);
                  /* text-transform: uppercase; */
               }

               ${PINNED_SELECTOR}:hover ${CLOSE_BTN_SELECTOR} { opacity: .7; }
               ${CLOSE_BTN_SELECTOR}:hover { opacity: 1 !important; }`);

            const btnUnpin = document.createElement('button');
            btnUnpin.className = CLOSE_BTN_CLASS_VALUE;
            btnUnpin.title = 'Unpin player';
            btnUnpin.textContent = '×'; // ✖
            btnUnpin.addEventListener('click', () => {
               player.classList.remove(CLASS_VALUE);
               drag.reset('clear_storePos');
               window.dispatchEvent(new Event('resize')); // fix: restore player size if unpinned
            });
            player.append(btnUnpin);
         });

      function initMiniStyles() {
         const scrollbarWidth = (window.innerWidth - document.documentElement.clientWidth || 0) + 'px';
         const miniSize = NOVA.calculateAspectRatioFit({
            // 'srcWidth': movie_player.clientWidth,
            // 'srcHeight': movie_player.clientHeight,
            'srcWidth': NOVA.videoElement.videoWidth,
            'srcHeight': NOVA.videoElement.videoHeight,
            'maxWidth': (window.innerWidth / user_settings.player_float_scroll_size_ratio),
            'maxHeight': (window.innerHeight / user_settings.player_float_scroll_size_ratio),
         });

         let initcss = {
            width: miniSize.width + 'px',
            height: miniSize.height + 'px',
            position: 'fixed',
            'z-index': 'var(--zIndex)',
            'box-shadow': '0 16px 24px 2px rgba(0, 0, 0, 0.14),' +
               '0 6px 30px 5px rgba(0, 0, 0, 0.12),' +
               '0 8px 10px -5px rgba(0, 0, 0, 0.4)',
         };

         // set pin player position
         switch (user_settings.player_float_scroll_position) {
            // if enable header-unfixed plugin. masthead-container is unfixed
            case 'top-left':
               initcss.top = user_settings['header-unfixed'] ? 0
                  : (document.getElementById('masthead-container')?.offsetHeight || 0) + 'px';
               initcss.left = 0;
               break;
            case 'top-right':
               initcss.top = user_settings['header-unfixed'] ? 0
                  : (document.getElementById('masthead-container')?.offsetHeight || 0) + 'px';
               initcss.right = scrollbarWidth;
               break;
            case 'bottom-left':
               initcss.bottom = 0;
               initcss.left = 0;
               break;
            case 'bottom-right':
               initcss.bottom = 0;
               initcss.right = scrollbarWidth;
               break;
         }

         // apply css
         NOVA.css.push(initcss, PINNED_SELECTOR, 'important');

         // variable declaration for fix
         NOVA.css.push(
            PINNED_SELECTOR + `{
               --height: ${initcss.height} !important;
               --width: ${initcss.width} !important;
            }`);
         // fix control-player panel
         NOVA.css.push(`
            ${PINNED_SELECTOR} .ytp-preview,
            ${PINNED_SELECTOR} .ytp-scrubber-container,
            ${PINNED_SELECTOR} .ytp-hover-progress,
            ${PINNED_SELECTOR} .ytp-gradient-bottom { display:none !important; }
            ${PINNED_SELECTOR} .ytp-chrome-bottom { width: var(--width) !important; }
            ${PINNED_SELECTOR} .ytp-chapters-container { display: flex; }`);

         // fix video size in pinned
         NOVA.css.push(
            `${PINNED_SELECTOR} video {
               width: var(--width) !important;
               height: var(--height) !important;
               left: 0 !important;
               top: 0 !important;
            }

            .ended-mode video {
               visibility: hidden;
            }`);
      }

      const drag = {
         // DEBUG: true,

         // xOffset: 0,
         // yOffset: 0,
         // currentX: 0,
         // currentY: 0,
         // dragTarget: HTMLElement,
         // active: false,
         // storePos: { X, Y },
         attrNametoLock: 'force_fix_preventDefault', // preventDefault patch

         reset(clear_storePos) {
            // switchElement.style.transform = ''; // clear drag state
            this.dragTarget?.style.removeProperty('transform');// clear drag state
            if (clear_storePos) this.storePos = this.xOffset = this.yOffset = 0;
            else this.storePos = { 'X': this.xOffset, 'Y': this.yOffset }; // save pos
         },

         init(el_target = required(), callbackExport) { // init
            this.log('drag init', ...arguments);
            if (!(el_target instanceof HTMLElement)) return console.error('el_target not HTMLElement:', el_target);

            this.dragTarget = el_target;

            // touchs
            // document.addEventListener('touchstart', this.dragStart.bind(this), false);
            // document.addEventListener('touchend', this.dragEnd.bind(this), false);
            // document.addEventListener('touchmove', this.draging.bind(this), false);
            // mouse
            // document.addEventListener('mousedown', this.dragStart.bind(this), false);
            // document.addEventListener('mouseup', this.dragEnd.bind(this), false);
            // document.addEventListener('mousemove', this.draging.bind(this), false);
            document.addEventListener('mousedown', evt => {
               if (!el_target.classList.contains(CLASS_VALUE)) return;
               this.dragStart.apply(this, [evt]);
            }, false);
            document.addEventListener('mouseup', evt => {
               if (this.active) this.dragTarget.removeAttribute(this.attrNametoLock); // fix broken preventDefault
               this.dragEnd.apply(this, [evt]);
            }, false);
            document.addEventListener('mousemove', evt => {
               if (this.active && !this.dragTarget.hasAttribute(this.attrNametoLock)) {
                  this.dragTarget.setAttribute(this.attrNametoLock, true); // fix broken preventDefault
               }
               this.draging.apply(this, [evt]);
            }, false);

            // fix broken preventDefault / preventDefault patch
            NOVA.css.push(
               `[${this.attrNametoLock}]:active {
                  pointer-events: none;
                  cursor: grab; /* <-- Doesn't work */
                  outline: 2px dashed #3ea6ff !important;
               }`);
         },

         dragStart(evt) {
            if (!this.dragTarget.contains(evt.target)) return;
            this.log('dragStart');

            switch (evt.type) {
               case 'touchstart':
                  this.initialX = evt.touches[0].clientX - (this.xOffset || 0);
                  this.initialY = evt.touches[0].clientY - (this.yOffset || 0);
                  break;
               case 'mousedown':
                  this.initialX = evt.clientX - (this.xOffset || 0);
                  this.initialY = evt.clientY - (this.yOffset || 0);
                  break;
            }
            this.active = true;
         },

         dragEnd(evt) {
            if (!this.active) return;
            this.log('dragEnd');

            this.initialX = this.currentX;
            this.initialY = this.currentY;
            this.active = false;
         },

         draging(evt) {
            if (!this.active) return;
            evt.preventDefault(); // Doesn't work. Replace to preventDefault patch
            evt.stopImmediatePropagation(); // Doesn't work. Replace to preventDefault patch

            this.log('draging');

            switch (evt.type) {
               case 'touchmove':
                  this.currentX = evt.touches[0].clientX - this.initialX;
                  this.currentY = evt.touches[0].clientY - this.initialY;
                  break;
               case 'mousemove':
                  this.currentX = evt.clientX - this.initialX;
                  this.currentY = evt.clientY - this.initialY;
                  break;
            }

            this.xOffset = this.currentX;
            this.yOffset = this.currentY;

            this.setTranslate({ 'X': this.currentX, 'Y': this.currentY });
         },

         setTranslate({ X = required(), Y = required() }) {
            this.log('setTranslate', ...arguments);
            this.dragTarget.style.transform = `translate3d(${X}px, ${Y}px, 0)`;
         },

         log() {
            if (this.DEBUG && arguments.length) {
               console.groupCollapsed(...arguments);
               console.trace();
               console.groupEnd();
            }
         },
      };

   },
   options: {
      player_float_scroll_size_ratio: {
         _tagName: 'input',
         label: 'Player size',
         'label:zh': '播放器尺寸',
         'label:ja': 'プレーヤーのサイズ',
         'label:ko': '플레이어 크기',
         'label:es': 'Tamaño del jugador',
         'label:pt': 'Tamanho do jogador',
         'label:fr': 'Taille du joueur',
         // 'label:tr': 'Oyuncu boyutu',
         'label:de': 'Spielergröße',
         type: 'number',
         title: 'less value - larger size',
         'title:zh': '较小的值 - 较大的尺寸',
         'title:ja': '小さい値-大きいサイズ',
         'title:ko': '더 작은 값 - 더 큰 크기',
         'title:es': 'Valor más pequeño - tamaño más grande',
         'title:pt': 'Valor menor - tamanho maior',
         'title:fr': 'Plus petite valeur - plus grande taille',
         // 'title:tr': 'Daha az değer - daha büyük boyut',
         'title:de': 'Kleiner Wert - größere Größe',
         placeholder: '2-5',
         step: 0.1,
         min: 2,
         max: 5,
         value: 2.5,
      },
      player_float_scroll_position: {
         _tagName: 'select',
         label: 'Player fixing position',
         'label:zh': '玩家固定位置',
         'label:ja': 'プレーヤーの固定位置',
         'label:ko': '선수 고정 위치',
         'label:es': 'Posición de fijación del jugador',
         'label:pt': 'Posição de fixação do jogador',
         'label:fr': 'Position de fixation du joueur',
         // 'label:tr': 'Oyuncu sabitleme pozisyonu',
         'label:de': 'Spielerfixierungsposition',
         options: [
            { label: 'left-top', value: 'top-left' },
            { label: 'left-bottom', value: 'bottom-left' },
            { label: 'right-top', value: 'top-right', selected: true },
            { label: 'right-bottom', value: 'bottom-right' },
         ],
      },
      player_float_scroll_sensivity_range: {
         _tagName: 'input',
         label: 'Player sensivity visibility range',
         'label:zh': '播放器灵敏度可见范围',
         'label:ja': 'プレイヤーの感度の可視範囲',
         'label:ko': '플레이어 감도 가시 범위',
         'label:es': 'Rango de visibilidad de la sensibilidad del jugador',
         'label:pt': 'Faixa de visibilidade da sensibilidade do jogador',
         'label:fr': 'Plage de visibilité de la sensibilité du joueur',
         'label:tr': 'Oyuncu duyarlılığı görünürlük aralığı',
         'label:de': 'Sichtbarkeitsbereich der Spielerempfindlichkeit',
         type: 'number',
         title: 'in %',
         placeholder: '%',
         step: 10,
         min: 10,
         max: 100,
         value: 80,
      },
      // 'player_float_scroll_pause_video': {
      //    _tagName: 'input',
      //    label: 'Pause pinned video',
      //    type: 'checkbox',
      // },
      // player_pip_scroll: {
      //    _tagName: 'input',
      //    label: 'Picture-in-Picture mode',
      //    // 'label:zh': '',
      //    // 'label:ja': '',
      //    // 'label:ko': '',
      //    // 'label:es': '',
      //    // 'label:pt': '',
      //    // 'label:fr': '',
      //    // 'label:tr': '',
      //    // 'label:de': '',
      //    type: 'checkbox',
      //    'title': 'Caution! Experimental function',
      //    // 'title:zh': '',
      //    // 'title:ja': '',
      //    // 'title:ko': '',
      //    // 'title:es': '',
      //    // 'title:pt': '',
      //    // 'title:fr': '',
      //    // 'title:tr': '',
      //    // 'title:de': '',
      // },
   }
});
// for test
// the adjustment area depends on the video size. Problems are visible at non-standard aspect ratio

window.nova_plugins.push({
   id: 'volume-wheel',
   title: 'Volume',
   'title:zh': '体积',
   'title:ja': '音量',
   'title:ko': '용량',
   'title:es': 'Volumen',
   // 'title:pt': 'Volume',
   'title:fr': 'Le volume',
   // 'title:tr': 'Hacim',
   'title:de': 'Volumen',
   run_on_pages: 'watch, embed, -mobile',
   section: 'player',
   // desc: 'Use mouse wheel to change volume of video',
   desc: 'with mouse wheel',
   'desc:zh': '带鼠标滚轮',
   'desc:ja': 'マウスホイール付き',
   'desc:ko': '마우스 휠로',
   'desc:es': 'con rueda de ratón',
   'desc:pt': 'com roda do mouse',
   // 'desc:fr': 'avec molette de la souris',
   'desc:tr': 'fare tekerleği ile',
   'desc:de': 'mit mausrad',
   _runtime: user_settings => {

      NOVA.waitElement('video')
         .then(video => {
            // trigger default indicator
            video.addEventListener('volumechange', function () {
               // console.debug('volumechange', movie_player.getVolume(), this.volume);
               NOVA.bezelTrigger(movie_player.getVolume() + '%');

               if (user_settings.volume_mute_unsave) {
                  playerVolume.saveInSession(movie_player.getVolume());
               }
            });

            if (user_settings.volume_hotkey) {
               // mousewheel in player area
               document.body.querySelector('.html5-video-container')
                  .addEventListener('wheel', evt => {
                     evt.preventDefault();

                     if (evt[user_settings.volume_hotkey] || (user_settings.volume_hotkey == 'none' && !evt.ctrlKey && !evt.altKey && !evt.shiftKey)) {
                        // console.debug('hotkey caught');
                        if (step = +user_settings.volume_step * Math.sign(evt.wheelDelta)) {
                           playerVolume.adjust(step);
                        }
                     }
                  });
            }
            // init volume_level_default
            if (+user_settings.volume_level_default) {
               (user_settings.volume_unlimit || +user_settings.volume_level_default > 100)
                  ? playerVolume.unlimit(+user_settings.volume_level_default)
                  : playerVolume.set(+user_settings.volume_level_default);
            }
         });


      const playerVolume = {
         adjust(delta) {
            const level = movie_player?.getVolume() + +delta;
            return user_settings.volume_unlimit ? this.unlimit(level) : this.set(level);
         },
         // Strategy 1
         set(level = 50) {
            if (typeof movie_player === 'undefined' || !movie_player.hasOwnProperty('getVolume')) return console.error('Error getVolume');

            const newLevel = Math.max(0, Math.min(100, +level));

            // set new volume level
            if (newLevel !== movie_player.getVolume()) {
               movie_player.isMuted() && movie_player.unMute();
               movie_player.setVolume(newLevel); // 0 - 100

               if (newLevel === movie_player.getVolume()) {
                  this.saveInSession(newLevel);

               } else {
                  console.error('setVolumeLevel error! Different: %s!=%s', newLevel, movie_player.getVolume());
               }
            }

            return newLevel === movie_player.getVolume() && newLevel;

         },

         saveInSession(level = required()) {
            const storageData = {
               creation: Date.now(),
               data: { 'volume': +level, 'muted': (level ? 'false' : 'true') },
               // data: { 'volume': +level, 'muted': ((level || user_settings.volume_mute_unsave) ? 'false' : 'true') },
            };

            try {
               localStorage['yt-player-volume'] = JSON.stringify(
                  Object.assign({ expiration: Date.now() + 2592e6 }, storageData)
               );
               sessionStorage['yt-player-volume'] = JSON.stringify(storageData);
               // console.debug('volume saved', ...arguments);

            } catch (err) {
               console.warn(`${err.name}: save "volume" in sessionStorage failed. It seems that "Block third-party cookies" is enabled`, err.message);
            }
         },

         unlimit(level = 300) {
            if (level > 100) {
               if (!this.audioCtx) {
                  this.audioCtx = new AudioContext();
                  const source = this.audioCtx.createMediaElementSource(NOVA.videoElement);
                  this.node = this.audioCtx.createGain();
                  this.node.gain.value = 1;
                  source.connect(this.node);
                  this.node.connect(this.audioCtx.destination);
               }

               if (this.node.gain.value < 7) this.node.gain.value += 1; // >6 is overload

               NOVA.bezelTrigger(movie_player.getVolume() * this.node.gain.value + '%');

            } else {
               if (this.audioCtx && this.node.gain.value !== 1) this.node.gain.value = 1; // reset
               this.set(level);
            }
            // console.debug('unlimit', this.node.gain.value);
         }
      };

   },
   options: {
      volume_level_default: {
         _tagName: 'input',
         // label: 'Level at startup',
         label: 'Default level',
         'label:zh': '默认音量',
         'label:ja': 'デフォルトのボリューム',
         'label:ko': '기본 볼륨',
         'label:es': 'Volumen predeterminado',
         'label:pt': 'Volume padrão',
         'label:fr': 'Volume par défaut',
         // 'label:tr': 'Varsayılan ses',
         'label:de': 'Standardlautstärke',
         type: 'number',
         title: '0 - auto',
         placeholder: '%',
         step: 5,
         min: 0,
         // max: 100,
         max: 600,
         value: 100,
      },
      volume_step: {
         _tagName: 'input',
         label: 'Step',
         'label:zh': '步',
         // 'label:ja': 'ステップ',
         'label:ko': '단계',
         'label:es': 'Paso',
         'label:pt': 'Degrau',
         'label:fr': 'Étape',
         // 'label:tr': 'Adım',
         'label:de': 'Schritt',
         type: 'number',
         title: 'in %',
         placeholder: '%',
         step: 5,
         min: 5,
         max: 30,
         value: 10,
      },
      volume_hotkey: {
         _tagName: 'select',
         label: 'Hotkey',
         'label:zh': '热键',
         // 'label:ja': 'ホットキー',
         'label:ko': '단축키',
         'label:es': 'Tecla de acceso rápido',
         'label:pt': 'Tecla de atalho',
         'label:fr': 'Raccourci',
         // 'label:tr': 'Kısayol tuşu',
         'label:de': 'Schnelltaste',
         options: [
            { label: 'wheel', value: 'none', selected: true },
            { label: 'shift+wheel', value: 'shiftKey' },
            { label: 'ctrl+wheel', value: 'ctrlKey' },
            { label: 'alt+wheel', value: 'altKey' },
            { label: 'disable', value: false },
         ],
      },
      volume_unlimit: {
         _tagName: 'input',
         label: 'Allow unlimit (booster)',
         // 'label:zh': '',
         // 'label:ja': '',
         // 'label:ko': '',
         // 'label:es': '',
         // 'label:pt': '',
         // 'label:fr': '',
         // 'label:tr': '',
         // 'label:de': '',
         type: 'checkbox',
         title: 'allow set volume above 100%',
         'title:zh': '允许设定音量高于 100%',
         'title:ja': '100％を超える設定ボリュームを許可する',
         'title:ko': '100% 이상의 설정 볼륨 허용',
         'title:es': 'permitir el volumen establecido por encima del 100%',
         'title:pt': 'permitir volume definido acima de 100%',
         'title:fr': 'autoriser le réglage du volume au-dessus de 100 %',
         // 'title:tr': "%100'ün üzerinde ses ayarına izin ver",
         'title:de': 'eingestellte Lautstärke über 100% zulassen',
      },
      volume_mute_unsave: {
         _tagName: 'input',
         // Force unmute for videos opened in new tabs while another video is muted
         label: 'Not keep muted state',
         // disable mute save state
         // disable mute memory state
         // 'label:zh': '',
         // 'label:ja': '',
         // 'label:ko': '',
         // 'label:es': '',
         // 'label:pt': '',
         // 'label:fr': '',
         // 'label:tr': '',
         // 'label:de': '',
         type: 'checkbox',
         title: 'only affects new tabs',
         'title:zh': '只影响新标签',
         'title:ja': '新しいタブにのみ影響します',
         'title:ko': '새 탭에만 영향',
         'title:es': 'solo afecta a las pestañas nuevas',
         'title:pt': 'afeta apenas novas guias',
         'title:fr': "n'affecte que les nouveaux onglets",
         'title:tr': 'yalnızca yeni sekmeleri etkiler',
         'title:de': 'wirkt sich nur auf neue Registerkarten aus',
      },
   }
});
// for test:
// https://www.youtube.com/watch?v=Xt2sbtvBuk8 - have 3-digit timestamps in description, Manual chapter numbering
// https://www.youtube.com/watch?v=egAB2qtVWFQ - title of chapters before timestamp. Manual chapter numbering
// https://www.youtube.com/watch?v=E-6gg0xKTPY - lying timestamp
// https://www.youtube.com/watch?v=SgQ_Jk49FRQ - timestamp in pinned comment
// https://www.youtube.com/watch?v=Dg30oEk5Mw0 - timestamp in pinned comment #2 once
// https://www.youtube.com/watch?v=tlICDvcCkog - timestamp in pinned comment#3 (bug has 1 chapters blocks). Manual chapter numbering
// https://www.youtube.com/watch?v=IvZOmE36PLc - many extra characters. Manual chapter numbering
// https://www.youtube.com/watch?v=hLXIK9DBxAo - very long text line of timestamp
// https://www.youtube.com/watch?v=IR0TBQV147I = lots 3-digit timestamp
// https://www.youtube.com/embed/JxTyMVPaOXY?autoplay=1 - embed test

// test TitleOffset
// https://youtu.be/t_fbcgzmxHs

window.nova_plugins.push({
   id: 'time-jump',
   title: 'Time jump',
   'title:zh': '时间跳跃',
   // 'title:ja': 'タイムジャンプ',
   'title:ko': '시간 점프',
   'title:es': 'Salto de tiempo',
   'title:pt': 'Salto no tempo',
   'title:fr': 'Saut dans le temps',
   // 'title:tr': 'Zaman atlama',
   'title:de': 'Zeitsprung',
   run_on_pages: 'watch, embed, -mobile',
   section: 'player',
   desc: 'Use to skip ad inserts',
   'desc:zh': '用于跳过广告插入',
   'desc:ja': '広告の挿入をスキップするために使用',
   'desc:ko': '광고 삽입을 건너뛸 때 사용',
   'desc:es': 'Úselo para omitir inserciones de anuncios',
   'desc:pt': 'Use para pular inserções de anúncios',
   // 'desc:fr': 'Utiliser pour ignorer les insertions publicitaires',
   'desc:tr': 'Reklam eklerini atlamak için kullanın',
   'desc:de': 'Zum Überspringen von Anzeigeninsertionen verwenden',
   _runtime: user_settings => {

      if (user_settings.time_jump_title_offset) addTitleOffset();

      switch (NOVA.currentPage) {
         case 'watch':
            let chapterList;

            // reset chapterList
            NOVA.waitElement('video')
               .then(video => video.addEventListener('loadeddata', () => chapterList = []));

            NOVA.waitElement('#movie_player')
               .then(player => {
                  doubleKeyPressListener(timeLeap, user_settings.time_jump_hotkey);

                  function timeLeap() {
                     if (chapterList !== null && !chapterList?.length) { // null - chapterList is init: skiping
                        chapterList = NOVA.getChapterList(movie_player.getDuration()) || null;
                        // console.debug('chapterList:', chapterList);
                     }
                     const
                        nextChapterIndex = chapterList?.findIndex(c => c.sec > movie_player.getCurrentTime()),
                        separator = ' • ';
                     // console.debug('nextChapterIndex', nextChapterIndex);
                     let msg;
                     // has chapters and chapters not ended
                     if (chapterList?.length && nextChapterIndex !== -1) {
                        // has chapters blocks (Important! more than 1. See e.g. "(bug has 1 chapters blocks)"
                        if (player.querySelectorAll('.ytp-chapter-hover-container')?.length > 1) {
                           // console.debug(`nextChapterIndex jump [${nextChapterIndex}] ${movie_player.getCurrentTime()?.toFixed(0)} > ${chapterList[nextChapterIndex].sec} sec`);
                           movie_player.seekToChapterWithAnimation(nextChapterIndex);

                           // querySelector update after seek
                           const chapterTitleEl = player.querySelector('.ytp-chapter-title-content');

                           msg = (chapterTitleEl?.textContent || chapterList[nextChapterIndex].title)
                              + separator + chapterList[nextChapterIndex].time;

                           if (chapterTitleEl && user_settings.time_jump_chapters_list_show) {
                              chapterTitleEl.click()
                           }

                        } else { // chapters blocks none, but has timestamp
                           const nextChapterData = chapterList?.find(c => c?.sec >= movie_player.getCurrentTime());
                           // console.debug(`nextChapterData jump [${nextChapterData.index}] ${movie_player.getCurrentTime()?.toFixed(0)} > ${nextChapterData.sec} sec`);
                           movie_player.seekTo(nextChapterData.sec);

                           msg = nextChapterData.title + separator + nextChapterData.time;
                        }

                     } else { // chapters none
                        movie_player.seekBy(+user_settings.time_jump_step);

                        msg = `+${user_settings.time_jump_step} sec` + separator + NOVA.timeFormatTo.HMS.digit(movie_player.getCurrentTime());
                     }

                     NOVA.bezelTrigger(msg); // trigger default indicator
                  }
               });
            break;

         case 'embed':
            NOVA.waitElement('video')
               .then(video => {
                  doubleKeyPressListener(timeLeap.bind(video), user_settings.time_jump_hotkey);

                  function timeLeap() {
                     let sec = +user_settings.time_jump_step + this.currentTime;

                     if (secNextChapter = seekToNextChapter.apply(this)) {
                        sec = secNextChapter;
                        // wait chapter-title update
                        document.body.querySelector('.ytp-chapter-title-content')
                           ?.addEventListener("DOMNodeInserted", ({ target }) => {
                              NOVA.bezelTrigger(
                                 target.textContent + ' • ' + NOVA.timeFormatTo.HMS.digit(video.currentTime)
                              );// trigger default indicator
                           }, { capture: true, once: true });
                     } else {
                        NOVA.bezelTrigger(`+${user_settings.time_jump_step} sec`); // trigger default indicator
                     }
                     // console.debug('seekTo', sec);
                     this.currentTime = sec;

                     function seekToNextChapter() {
                        if ((chaptersContainer = document.body.querySelector('.ytp-chapters-container'))
                           && chaptersContainer?.children.length > 1
                           && (progressContainerWidth = parseInt(getComputedStyle(chaptersContainer).width))
                        ) {
                           const progressRatio = this.currentTime / this.duration;
                           let passedWidth = 0;
                           for (const chapter of chaptersContainer.children) {
                              const
                                 { width, marginLeft, marginRight } = getComputedStyle(chapter),
                                 chapterMargin = parseInt(marginLeft) + parseInt(marginRight),
                                 chapterRatio = (passedWidth + width) / progressContainerWidth;

                              // console.debug('Chapter', chapterRatio, chapterWidth);
                              if (chapterRatio >= progressRatio && chapterRatio < 1) {
                                 return ~~(chapterRatio * this.duration) + chapterMargin + 1;
                              }
                              // accumulate passed
                              passedWidth += chapterWidth + chapterMargin;
                           }
                           // console.debug('passedWidth', 'total=' + passedWidth, 'chapter count=' + chaptersContainer?.children.length, progressContainerWidth, '/', progressRatio);
                        }
                     }
                  }
               });
            break;
      }

      function addTitleOffset() {
         NOVA.css.push(
            `.ytp-tooltip-text:after {
               content: attr(data-before);
               color: #ffcc00;
            }`);
         // color: ${getComputedStyle(document.querySelector('.ytp-swatch-background-color'))['background-color'] || '#f00'};

         NOVA.waitElement('.ytp-progress-bar')
            .then(progressContainer => {
               if (tooltipEl = document.body.querySelector('.ytp-tooltip-text')) {
                  progressContainer.addEventListener('mousemove', () => {
                     if (movie_player.getVideoData().isLive) return;
                     const
                        cursorTime = NOVA.timeFormatTo.hmsToSec(tooltipEl.textContent),
                        offsetTime = cursorTime - NOVA.videoElement?.currentTime,
                        sign = offsetTime >= 1 ? '+' : Math.sign(offsetTime) === -1 ? '-' : '';
                     // updateOffsetTime
                     // console.debug('offsetTime', offsetTime, cursorTime, sign);
                     tooltipEl.setAttribute('data-before', ` ${sign + NOVA.timeFormatTo.HMS.digit(offsetTime)}`);
                  });
                  // hide titleOffset
                  progressContainer.addEventListener('mouseleave', () => tooltipEl.removeAttribute('data-before'));
               }
            });
      }

      function doubleKeyPressListener(callback, keyCodeFilter) {
         let
            pressed,
            isDoublePress,
            lastPressed = parseInt(keyCodeFilter) || null;

         const
            timeOut = () => setTimeout(() => isDoublePress = false, 500), // 500ms
            handleDoublePresss = key => {
               // console.debug(key.key, 'pressed two times');
               if (callback && typeof callback === 'function') return callback(key);
            };

         function keyPress(evt) {
            if (['input', 'textarea'].includes(evt.target.localName) || evt.target.isContentEditable) return;

            pressed = evt.keyCode;
            // console.debug('doubleKeyPressListener %s=>%s=%s', lastPressed, pressed, isDoublePress);
            if (isDoublePress && pressed === lastPressed) {
               isDoublePress = false;
               handleDoublePresss(evt);
            } else {
               isDoublePress = true;
               timeOut();
            }

            if (!keyCodeFilter) lastPressed = pressed;
         }
         document.addEventListener('keyup', keyPress);
      }

   },
   options: {
      time_jump_step: {
         _tagName: 'input',
         label: 'Step time',
         // 'label:ja': 'ステップ時間',
         'label:zh': '步骤时间',
         'label:ko': '단계 시간',
         'label:es': 'Tiempo de paso',
         'label:pt': 'Tempo da etapa',
         'label:fr': 'Temps de pas',
         // 'label:tr': 'Adım süresi',
         'label:de': 'Schrittzeit',
         type: 'number',
         title: 'in seconds',
         placeholder: 'sec',
         min: 3,
         max: 300,
         value: 30,
      },
      time_jump_hotkey: {
         _tagName: 'select',
         label: 'Hotkey (double click)',
         'label:zh': '热键（双击）',
         'label:ja': 'Hotkey (ダブルプレス)',
         'label:ko': '단축키(더블 클릭)',
         'label:es': 'Tecla de acceso rápido (doble clic)',
         'label:pt': 'Atalho (duplo clique)',
         'label:fr': 'Raccourci clavier (double clic)',
         // 'label:tr': 'Kısayol tuşu (çift tıklama)',
         'label:de': 'Hotkey (Doppelklick)',
         options: [
            // https://css-tricks.com/snippets/javascript/javascript-keycodes/
            { label: 'alt', value: 18 },
            { label: 'shift', value: 16 },
            { label: 'ctrl', value: 17, selected: true },
         ],
      },
      time_jump_title_offset: {
         _tagName: 'input',
         label: 'Show time offset on progress bar',
         'label:zh': '在进度条中显示时间偏移',
         'label:ja': 'プログレスバーに時間オフセットを表示する',
         'label:ko': '진행률 표시줄에 시간 오프셋 표시',
         'label:es': 'Mostrar compensación de tiempo en la barra de progreso',
         'label:pt': 'Mostrar a diferença de tempo na barra de progresso',
         'label:fr': 'Afficher le décalage horaire sur la barre de progression',
         // 'label:tr': 'İlerleme çubuğunda zaman ofsetini göster',
         'label:de': 'Zeitverschiebung im Fortschrittsbalken anzeigen',
         type: 'checkbox',
         // title: 'When you hover offset current playback time',
         title: 'Time offset from current playback time',
         'title:zh': '与当前播放时间的时间偏移',
         'title:ja': '現在の再生時間からの時間オフセット',
         'title:ko': '현재 재생 시간으로부터의 시간 오프셋',
         'title:es': 'Desfase de tiempo del tiempo de reproducción actual',
         'title:pt': 'Deslocamento de tempo do tempo de reprodução atual',
         'title:fr': "Décalage temporel par rapport à l'heure de lecture actuelle",
         // 'title:tr': 'Geçerli oynatma süresinden zaman farkı',
         'title:de': 'Zeitverschiebung zur aktuellen Wiedergabezeit',
      },
      time_jump_chapters_list_show: {
         _tagName: 'input',
         label: 'Show chapters list section',
         'label:zh': '显示章节列表块',
         'label:ja': 'チャプターリストブロックを表示',
         'label:ko': '챕터 목록 섹션 표시',
         'label:es': 'Mostrar bloque de lista de capítulos',
         'label:pt': 'Mostrar bloco de lista de capítulos',
         'label:fr': 'Afficher la section de la liste des chapitres',
         // 'label:tr': 'Bölüm listesi bölümünü göster',
         'label:de': 'Kapitellistenblock anzeigen',
         type: 'checkbox',
      },
   }
});
// http://babruisk.com/ - test embed page

window.nova_plugins.push({
   id: 'pause-background-tab',
   // title: 'only one player instance playing',
   // title: 'Autopause when switching tabs',
   // title: 'Pauses playing videos in other tabs',
   title: 'Autopause all tabs except the active one',
   'title:zh': '自动暂停除活动选项卡以外的所有选项卡',
   'title:ja': 'アクティブなタブを除くすべてのタブを自動一時停止',
   'title:ko': '활성 탭을 제외한 모든 탭 자동 일시 중지',
   'title:es': 'Pausar automáticamente todas las pestañas excepto la activa',
   'title:pt': 'Pausar automaticamente todas as guias, exceto a ativa',
   'title:fr': "Interrompt la lecture des vidéos dans d'autres onglets",
   // 'title:tr': 'Etkin olan dışındaki tüm sekmeleri otomatik duraklat',
   'title:de': 'Alle Tabs außer dem aktiven automatisch pausieren',
   run_on_pages: 'watch, embed',
   section: 'player',
   desc: 'Supports iframes and other windows',
   'desc:zh': '支持 iframe 和其他窗口',
   'desc:ja': 'iframeやその他のウィンドウをサポート',
   'desc:ko': 'iframe 및 기타 창 지원',
   'desc:es': 'Soporta iframes y otras ventanas',
   'desc:pt': 'Suporta iframes e outras janelas',
   // 'desc:fr': 'Prend en charge les iframes et autres fenêtres',
   'desc:tr': "iframe'leri ve diğer pencereleri destekler",
   'desc:de': 'Unterstützt iframes und andere Fenster',
   _runtime: user_settings => {

      // redirection for localStorage common storage space
      if (location.hostname.includes('youtube-nocookie.com')) location.hostname = 'youtube.com';

      const
         storeName = 'playngInstanceIDTab',
         currentPageName = NOVA.currentPage, // watch or embed. Unchanged during the transition
         instanceID = Math.random(), // Generate a random script instance ID
         removeStorage = () => localStorage.removeItem(storeName);

      NOVA.waitElement('video')
         .then(video => {
            // mark a playing
            video.addEventListener('playing', () => localStorage.setItem(storeName, instanceID));
            // remove mark if video stop play
            ['pause', 'suspend', 'ended'].forEach(evt => video.addEventListener(evt, removeStorage));
            // remove mark if tab closed
            window.addEventListener('beforeunload', removeStorage);

            // auto play on tab focus
            if (user_settings.pause_background_tab_autoplay_onfocus) {
               document.addEventListener('visibilitychange', () => {
                  // if other tabs are not playing
                  if (document.visibilityState == 'visible'
                     && !localStorage.hasOwnProperty(storeName) // store empty
                     // && video.paused  // dont see ENDED
                     && ['UNSTARTED', 'PAUSED'].includes(NOVA.getPlayerState())
                  ) {
                     // console.debug('play video in focus');
                     video.play();
                  }
               });
            }
            // if tab unfocus apply pause
            window.addEventListener('storage', store => {
               if ((document.visibilityState == 'hidden' || currentPageName == 'embed') // tab unfocus
                  && store.key === storeName && store.storageArea === localStorage // checking store target
                  && localStorage.hasOwnProperty(storeName) && localStorage.getItem(storeName) !== instanceID // active tab not current
                  && ['PLAYING'].includes(NOVA.getPlayerState())
               ) {
                  // console.debug('video pause', localStorage[storeName]);
                  video.pause();
               }
            });

         });

      // PiP auto enable
      // NOVA.waitElement('video')
      //    .then(video => {
      //       // Detect Picture-in-Picture Support
      //       if (!document.pictureInPictureEnabled/* || video.disablePictureInPicture*/) {
      //          return alert('Picture-in-Picture not supported!');
      //       }
      //       let PiP_lock;
      //       // enable PiP
      //       document.addEventListener('visibilitychange', () => {
      //          // tab on focus - exit PiP
      //          if (document.visibilityState == 'visible'
      //             && document.pictureInPictureElement
      //             && PiP_lock
      //          ) {
      //             console.debug('exitPictureInPicture');
      //             // video.disablePictureInPicture = true;
      //             // setTimeout(() => video.disablePictureInPicture = false, 1000 * 2);
      //             // clearTimeout(timeoutPiP);
      //             return document.exitPictureInPicture();
      //          }
      //          // tab unfocus - enable PiP
      //          if (document.visibilityState == 'hidden'
      //             && !document.pictureInPictureElement // PiP not activated
      //             // && localStorage.hasOwnProperty(storeName) && localStorage.getItem(storeName) !== instanceID // active tab not current
      //             && ['PLAYING'].includes(NOVA.getPlayerState())
      //             // && !video.disablePictureInPicture
      //             && !PiP_lock
      //          ) {
      //             console.debug('requestPictureInPicture');
      //             // video.disablePictureInPicture = false;
      //             video.requestPictureInPicture();

      //             // timeoutPiP = setTimeout(() => video.requestPictureInPicture(), 1000 * 2);
      //          }
      //       });
      //       // exit PiP
      //       ['suspend', 'ended'].forEach(evt =>
      //          video.addEventListener(evt, () => document.pictureInPictureElement && document.exitPictureInPicture()));
      //       video.addEventListener('leavepictureinpicture', () => {
      //          console.debug('leavepictureinpicture');
      //          PiP_lock = false;
      //       });
      //       video.addEventListener('enterpictureinpicture', () => {
      //          console.debug('enterpictureinpicture');
      //          PiP_lock = true;
      //       });
      //    });

      // https://stackoverflow.com/questions/6877403/how-to-tell-if-a-video-element-is-currently-playing
      // Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
      //    get: function () {
      //       return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
      //    }
      // })
      // if (NOVA.videoElement?.playing) { // checks if element is playing right now
      //    // Do anything you want to
      // }


      // replaced with generic HTML5 method
      // const onPlayerStateChange = state => ('PLAYING' == NOVA.getPlayerState(state)) ? localStorage.setItem(storeName, instanceID) : removeStorage();

      // NOVA.waitElement('#movie_player')
      //    .then(() => {
      //       movie_player.addEventListener('onStateChange', onPlayerStateChange);

      //       // remove storage if this tab closed
      //       window.addEventListener('beforeunload', removeStorage);

      //       window.addEventListener('storage', store => {
      //          if (
      //             // checking the right item
      //             store.key === storeName && store.storageArea === localStorage
      //             // has storage
      //             && localStorage[storeName] && localStorage[storeName] !== instanceID
      //             // this player is playing
      //             && 'PLAYING' == NOVA.getPlayerState()
      //          ) {
      //             console.debug('pause player', localStorage[storeName]);
      //             movie_player.pauseVideo();
      //          }
      //       });

      //    });

   },
   options: {
      pause_background_tab_autoplay_onfocus: {
         _tagName: 'input',
         label: 'Autoplay on tab focus',
         'label:zh': '在标签焦点上自动播放',
         'label:ja': 'タブフォーカスでの自動再生',
         'label:ko': '탭 포커스에서 자동 재생',
         'label:es': 'Reproducción automática en el enfoque de la pestaña',
         'label:pt': 'Reprodução automática no foco da guia',
         'label:fr': "Lecture automatique sur le focus de l'onglet",
         // 'label:tr': 'Sekme odağında otomatik oynatma',
         'label:de': 'Autoplay bei Tab-Fokus',
         type: 'checkbox',
         // title: '',
      },
   }
});

// for testing
// https://www.youtube.com/watch?v=LhKT9NTH9HA - dont have 480p
// https://www.youtube.com/watch?v=FZovbrEP53o - dont have 480p

window.nova_plugins.push({
   id: 'video-quality',
   title: 'Video quality',
   'title:zh': '视频质量',
   'title:ja': 'ビデオ品質',
   'title:ko': '비디오 품질',
   'title:es': 'Calidad de video',
   'title:pt': 'Qualidade de vídeo',
   'title:fr': 'Qualité vidéo',
   // 'title:tr': 'Video kalitesi',
   'title:de': 'Videoqualität',
   run_on_pages: 'watch, embed',
   section: 'player',
   // desc: '',
   _runtime: user_settings => {

      let selectedQuality = user_settings.video_quality;

      NOVA.waitElement('#movie_player')
         .then(() => {
            // keep save manual quality in the session
            if (user_settings.video_quality_manual_save_in_tab && NOVA.currentPage == 'watch') { // no sense if in the embed
               movie_player.addEventListener('onPlaybackQualityChange', quality => {
                  // console.debug('document.activeElement,',document.activeElement);
                  if (document.activeElement.getAttribute('role') == 'menuitemradio' // focuse on setting menu
                     && quality !== selectedQuality // the new quality
                  ) {
                     console.info(`keep quality "${quality}" in the session`);
                     selectedQuality = quality;
                  }
               });
            }

            setQuality(); // init

            movie_player.addEventListener('onStateChange', setQuality); // update
         });

      function setQuality(state) {
         if (!selectedQuality) return console.error('selectedQuality unavailable', selectedQuality);
         // console.debug('playerState', NOVA.getPlayerState(state));

         // if ((1 == state || 3 == state) && !setQuality.quality_busy) {
         // if (('PLAYING' == NOVA.getPlayerState(state) || 'BUFFERING' == NOVA.getPlayerState(state)) && !setQuality.quality_busy) {
         if (['PLAYING', 'BUFFERING'].includes(NOVA.getPlayerState(state)) && !setQuality.quality_busy) {
            setQuality.quality_busy = true;

            const waitQuality = setInterval(() => {
               const availableQualityLevels = movie_player.getAvailableQualityLevels();

               if (availableQualityLevels?.length) {
                  clearInterval(waitQuality);

                  const maxAvailableQuality = Math.max(availableQualityLevels.indexOf(selectedQuality), 0);
                  const newQuality = availableQualityLevels[maxAvailableQuality];

                  // if (!newQuality || movie_player.getPlaybackQuality() == selectedQuality) {
                  //    return console.debug('skip set quality');
                  // }

                  // if (!availableQualityLevels.includes(selectedQuality)) {
                  //    console.info(`no has selectedQuality: "${selectedQuality}". Choosing instead the top-most quality available "${newQuality}" of ${JSON.stringify(availableQualityLevels)}`);
                  // }

                  if (movie_player.hasOwnProperty('setPlaybackQuality')) {
                     // console.debug('use setPlaybackQuality');
                     movie_player.setPlaybackQuality(newQuality);
                  }

                  // set QualityRange
                  if (movie_player.hasOwnProperty('setPlaybackQualityRange')) {
                     // console.debug('use setPlaybackQualityRange');
                     movie_player.setPlaybackQualityRange(newQuality, newQuality);
                  }

                  // console.debug('availableQualityLevels:', availableQualityLevels);
                  // console.debug("try set quality:", newQuality);
                  // console.debug('current quality:', movie_player.getPlaybackQuality());
               }
            }, 50); // 50ms

            // } else if ('UNSTARTED' == NOVA.getPlayerState(state) || 'ENDED' == NOVA.getPlayerState(state)) {
            // } else if (['UNSTARTED', 'ENDED'].includes(NOVA.getPlayerState(state))) {
         } else if (state <= 0) {
            setQuality.quality_busy = false;
         }
      }

      // error detector
      NOVA.waitElement('.ytp-error [class*="reason"]')
         .then(error_reason_el => {
            if (alertText = error_reason_el.textContent) {
               // err ex:
               // This video isn't available at the selected quality. Please try again later.
               // An error occurred. Please try again later. (Playback ID: Ame9qzOk-p5tXqLS) Learn More
               // alert(alertText);
               throw alertText; // send to _pluginsCaptureException
            }
         });

   },
   options: {
      video_quality: {
         _tagName: 'select',
         label: 'Default quality',
         'label:zh': '默认视频质量',
         'label:ja': 'デフォルトのビデオ品質',
         'label:ko': '기본 비디오 품질',
         'label:es': 'Calidad predeterminada',
         'label:pt': 'Qualidade padrão',
         'label:fr': 'Qualité par défaut',
         // 'label:tr': 'Varsayılan kalite',
         'label:de': 'Standardvideoqualität',
         title: 'If unavailable, set max available quality',
         'title:zh': '如果不可用，将选择可用的最高质量。',
         'title:ja': '利用できない場合は、利用可能な最高の品質が選択されます。',
         // 'title:es': 'Si no está disponible, establezca la calidad máxima disponible',
         // 'title:pt': 'Se não estiver disponível, defina a qualidade máxima disponível',
         // 'title:tr': 'Mevcut değilse, maksimum kullanılabilir kaliteyi ayarlayın',
         // 'title:de': 'Wenn nicht verfügbar, stellen Sie die maximal verfügbare Qualität ein',
         // multiple: null,
         options: [
            // Available ['highres','hd2880','hd2160','hd1440','hd1080','hd720','large','medium','small','tiny']
            { label: '8K/4320p', value: 'highres' },
            // { label: '5K/2880p', value: 'hd2880' }, // missing like https://www.youtube.com/watch?v=Hbj3z8Db4Rk
            { label: '4K/2160p', value: 'hd2160' },
            { label: 'QHD/1440p', value: 'hd1440' },
            { label: 'FHD/1080p', value: 'hd1080', selected: true },
            { label: 'HD/720p', value: 'hd720' },
            { label: 'SD/480p', value: 'large' },
            { label: 'SD/360p', value: 'medium' },
            { label: 'SD/240p', value: 'small' },
            { label: 'SD/144p', value: 'tiny' },
            // { label: 'Auto', value: 'auto' }, // no sense, deactivation does too
         ],
      },
      video_quality_manual_save_in_tab: {
         _tagName: 'input',
         // label: 'Manually selected qualities are saved in the current tab' // too much long
         label: 'Save manually selected for the same tab',
         'label:zh': '手动选择的质量保存在当前选项卡中',
         'label:ja': '手動で選択した品質が現在のタブに保存されます',
         'label:ko': '동일한 탭에 대해 수동으로 선택한 저장',
         'label:es': 'Guardar seleccionado manualmente para la misma pestaña',
         'label:pt': 'Salvar selecionado manualmente para a mesma guia',
         'label:fr': 'Enregistrer sélectionné manuellement pour le même onglet',
         // 'label:tr': 'Aynı sekme için manuel olarak seçili kaydet',
         'label:de': 'Manuell für dieselbe Registerkarte ausgewählt speichern',
         type: 'checkbox',
         title: 'Affects to next videos',
         'title:zh': '对下一个视频的影响',
         'title:ja': '次の動画への影響',
         'title:ko': '다음 동영상에 영향',
         'title:es': 'Afecta a los siguientes videos',
         'title:pt': 'Afeta para os próximos vídeos',
         'title:fr': 'Affecte aux prochaines vidéos',
         // 'title:tr': 'Sonraki videoları etkiler',
         'title:de': 'Beeinflusst die nächsten Videos',
      },
   },
});
window.nova_plugins.push({
   id: 'theater-mode',
   title: 'Player full-with (theater) mode',
   'title:zh': '播放器全模式',
   'title:ja': 'プレーヤーフル-モード付き',
   'title:ko': '플레이어 풀-위드 모드',
   'title:es': 'Reproductor completo con modo',
   'title:pt': 'Modo de jogador completo',
   'title:fr': 'Mode lecteur complet avec',
   // 'title:tr': 'Oyuncu tam mod',
   'title:de': 'Player full-with-modus',
   run_on_pages: 'watch, -mobile',
   section: 'player',
   // desc: 'Auto enable player full-width mode',
   // 'desc:zh': '自动为播放器启用全宽模式',
   // 'desc:ja': 'プレーヤーの全幅モードを自動有効にする',
   // 'desc:ko': '플레이어 전체 너비 모드 자동 활성화',
   // 'desc:pt': 'Habilitar automaticamente o modo de largura total do player',
   // 'desc:fr': 'Activer automatiquement le mode pleine largeur du lecteur',
   // 'desc:tr': 'Oyuncu tam genişlik modunu otomatik etkinleştir',
   // 'desc:de': 'Player-Modus mit voller Breite automatisch aktivieren',
   // 'desc:es': 'Activar automáticamente el modo de ancho completo del reproductor',
   _runtime: user_settings => {

      // NOVA.waitElement('ytd-watch-flexy:not([theater])') // wrong way. Reassigns manual exit from the mode
      NOVA.waitElement('ytd-watch-flexy')
         .then(el => el.theaterModeChanged_(true));

      NOVA.waitElement('#movie_player')
         .then(() => {
            const
               PLAYER_CONTEINER_SELECTOR = 'ytd-watch-flexy[theater]:not([fullscreen]) #player-theater-container', // fix for "player-pin-scroll" plugin
               PLAYER_SELECTOR = `${PLAYER_CONTEINER_SELECTOR} #movie_player:not(.player-float)`, // fix for "player-pin-scroll" plugin
               zIindex = Math.max(
                  getComputedStyle(movie_player)['z-index'],
                  2020);
               // zIindex = Math.max(
               //    getComputedStyle(document.getElementById('masthead-container'))['z-index'],
               //    getComputedStyle(movie_player)['z-index'],
               //    2020);

            if (user_settings.player_full_viewport_mode) {
               setPlayerFullViewport();

            } else if (user_settings.player_full_viewport_smart_mode) {
               // exclude shorts page
               if (user_settings.player_full_viewport_smart_mode_exclude_shorts
                  && (NOVA.currentPage == 'shorts') || window.ytplayer?.config?.args?.title?.includes('#shorts')) { // dont update state on transitio
                  return;
               }

               NOVA.waitElement('video')
                  .then(video => {
                     video.addEventListener('loadeddata', function () {
                        const miniSize = NOVA.calculateAspectRatioFit({
                           'srcWidth': this.videoWidth,
                           'srcHeight': this.videoHeight,
                           // 'maxWidth': window.innerWidth,
                           // 'maxHeight': window.innerHeight,
                        });
                        // out of viewport
                        if (miniSize.width < window.innerWidth) setPlayerFullViewport();
                     });
                  });
            }

            // cinema_mode
            // alt - https://greasyfork.org/en/scripts/419359-youtube-simple-cinema-mode
            if (user_settings.cinema_mode) {
               NOVA.css.push(
                  PLAYER_CONTEINER_SELECTOR + ` { z-index: ${zIindex}; }

                  ${PLAYER_SELECTOR}:before {
                     content: '';
                     position: fixed;
                     top: 0;
                     left: 0;
                     width: 100%;
                     height: 100%;
                     background: rgba(0, 0, 0, ${+user_settings.cinema_mode_opacity});
                     opacity: 0;
                     transition: opacity .4s ease-in-out;
                     pointer-events: none;
                  }

                  /*#movie_player.paused-mode:before,*/
                  ${PLAYER_SELECTOR}.playing-mode:before {
                     opacity: 1;
                  }

                  /* fix */
                  .ytp-ad-player-overlay,
                  #playlist:hover,
                  #masthead-container:hover,
                  iframe, /*search result box*/
                  #guide,
                  [class*="popup"],
                  [role="navigation"],
                  [role="dialog"] {
                     z-index: ${zIindex + 1};
                  }
                  #playlist:hover {
                     position: relative;
                  }
                  /* Hide scrollbars */
                  body {
                     overflow: hidden;
                  }`);
            }

            function setPlayerFullViewport() {
               NOVA.css.push(
                  `${PLAYER_SELECTOR}${
                  user_settings.player_full_viewport_mode_exit ? `.playing-mode, ${PLAYER_SELECTOR}.paused-mode` : ''} {
                     width: 100vw;
                     height: 100vh;
                     position: fixed;
                     bottom: 0 !important;
                     z-index: ${zIindex};
                     background-color: black;
                  }
                  /* Hide scrollbars */
                  body {
                     overflow: hidden;
                  }`);

               // fix restore controlbar position
               NOVA.waitElement('video')
                  .then(video => video.addEventListener('pause', () => window.dispatchEvent(new Event('resize'))));
            }
         });

   },
   options: {
      player_full_viewport_smart_mode: {
         _tagName: 'input',
         label: 'Full-viewport smart toggle',
         // 'label:zh': '',
         // 'label:ja': '',
         // 'label:ko': '',
         // 'label:es': '',
         // 'label:pt': '',
         // 'label:fr': '',
         // 'label:tr': '',
         // 'label:de': '',
         type: 'checkbox',
         // title: '',
      },
      player_full_viewport_mode: {
         _tagName: 'input',
         label: 'Full-viewport mode',
         'label:zh': '全屏模式',
         'label:ja': 'フルスクリーンモード',
         'label:ko': '전체 화면으로보기',
         'label:es': 'Modo de pantalla completa',
         'label:pt': 'Modo tela cheia',
         'label:fr': 'Mode plein écran',
         // 'label:tr': 'Tam ekran modu',
         'label:de': 'Vollbildmodus',
         type: 'checkbox',
         // title: '',
      },
      player_full_viewport_mode_exit: {
         _tagName: 'input',
         // label: 'Exit Fullscreen on Video End',
         label: 'Exit if video ends/pause',
         'label:zh': '如果视频结束/暂停则退出',
         'label:ja': 'ビデオが終了/一時停止した場合に終了',
         'label:ko': '비디오가 끝나면 종료/일시중지',
         'label:es': 'Salir si el video termina/pausa',
         'label:pt': 'Sair se o vídeo terminar/pausar',
         'label:fr': 'Quitter si la vidéo se termine/pause',
         // 'label:tr': 'Video biterse/duraklatılırsa çıkın',
         'label:de': 'Beenden, wenn das Video endet/pausiert',
         type: 'checkbox',
         'data-dependent': '{"player_full_viewport_mode":"true"}',
      },
      cinema_mode: {
         _tagName: 'input',
         label: 'Cinema mode',
         // 'label:zh': '',
         // 'label:ja': '',
         // 'label:ko': '',
         // 'label:es': '',
         // 'label:pt': '',
         // 'label:fr': '',
         // 'label:tr': '',
         // 'label:de': '',
         type: 'checkbox',
         title: 'The page goes dark while the video is playing',
         'title:zh': '播放视频时页面会变暗',
         'title:ja': 'ビデオの再生中、ページは暗くなります',
         'title:ko': '비디오가 재생되는 동안 페이지가 어두워집니다.',
         'title:es': 'Mientras se reproduce el video, la página se oscurecerá',
         'title:pt': 'Enquanto o vídeo estiver sendo reproduzido, a página ficará escura',
         'title:fr': "Pendant la lecture de la vidéo, la page s'assombrit",
         // 'title:tr': 'Video oynatılırken sayfa kararacak',
         'title:de': 'Während das Video abgespielt wird, wird die Seite dunkel',
      },
      cinema_mode_opacity: {
         _tagName: 'input',
         label: 'Opacity',
         'label:zh': '不透明度',
         'label:ja': '不透明度',
         'label:ko': '불투명',
         'label:es': 'Opacidad',
         'label:pt': 'Opacidade',
         'label:fr': 'Opacité',
         // 'label:tr': 'Opaklık',
         'label:de': 'Opazität',
         type: 'number',
         title: '0-1',
         placeholder: '0-1',
         step: .05,
         min: 0,
         max: 1,
         value: .85,
         'data-dependent': '{"cinema_mode":"true"}',
      },
      player_full_viewport_smart_mode_exclude_shorts: {
         _tagName: 'input',
         label: 'Exclude shorts',
         // 'label:zh': '',
         // 'label:ja': '',
         // 'label:ko': '',
         // 'label:es': '',
         // 'label:pt': '',
         // 'label:fr': '',
         // 'label:tr': '',
         // 'label:de': '',
         type: 'checkbox',
         // title: '',
      },
   }
});
window.nova_plugins.push({
   id: 'disable-player-sleep-mode',
   title: 'Player stay active forever',
   // title: 'Disable player sleep mode',
   'title:zh': '玩家永远保持活跃',
   'title:ja': 'プレーヤーは永遠にアクティブなままです',
   'title:ko': '플레이어는 영원히 활성 상태를 유지',
   'title:es': 'El jugador permanece activo para siempre',
   'title:pt': 'Jogador permanece ativo para sempre',
   'title:fr': 'Le joueur reste actif pour toujours',
   // 'title:tr': 'Sayfa uykusunu devre dışı bırak',
   'title:de': 'Spieler bleiben für immer aktiv',
   run_on_pages: 'watch, -mobile',
   section: 'player',
   // desc: 'prevent asking you to click "yes" to continue playing?',
   desc: 'prevent [Video paused] alert',
   'desc:zh': '防止[视频暂停]警报',
   'desc:ja': '「Video paused」アラートを防止します',
   'desc:ko': '[Video paused] 알림을 방지합니다',
   'desc:es': 'evitar la alerta de [Video en pausa]',
   'desc:pt': 'evitar o alerta de [Vídeo pausado]',
   // 'desc:fr': "empêcher l'alerte [Vidéo en pause]",
   'desc:tr': '[Video duraklatıldı] uyarısını engelle',
   'desc:de': 'Warnung [Video pausiert] verhindern',
   _runtime: user_settings => {

      // Strategy 1
      window.setInterval(() => document.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, cancelable: true, keyCode: 143, which: 143 })), 1000 * 60 * 5); // 5 min

      // Strategy 2
      function skipConfirmDialog() {
         // NOVA.waitElement('yt-confirm-dialog-renderer #confirm-button, a.yt-simple-endpoint.style-scope.yt-button-renderer')
         // NOVA.waitElement('[role="dialog"] #confirm-button')
         NOVA.waitElement('#confirm-button')
            .then(btn => {
               console.debug('page page wake up', btn);
               btn.click();
               if (NOVA.videoElement?.paused) NOVA.videoElement.play();
               // movie_player.playVideo();
               skipConfirmDialog(); // recursion init state. What would work more than once
            });
      }

      skipConfirmDialog();
   },
});
// fore test
// https://www.youtube.com/watch?v=bTm3kwroEyw - https://watannetwork.com/tools/blocked/#url=bTm3kwroEyw
// https://www.youtube.com/watch?v=3U2UGM0ldGg - https://watannetwork.com/tools/blocked/#url=3U2UGM0ldGg

window.nova_plugins.push({
   id: 'video-unblock-region',
   title: 'Try unblock if video not available in your country',
   'title:zh': '尝试解锁您所在地区的视频',
   'title:ja': 'お住まいの地域の動画のブロックを解除してみてください',
   'title:ko': '해당 지역의 동영상 차단을 해제해 보세요',
   'title:es': 'Intenta desbloquear videos para tu región',
   'title:pt': 'Tente desbloquear vídeos para sua região',
   'title:fr': 'Débloquer la vidéo de la région',
   // 'title:tr': 'Bölgeniz için videoların engellemesini kaldırmayı deneyin',
   'title:de': 'Versuchen Sie, Videos für Ihre Region zu entsperren',
   run_on_pages: 'watch, embed, -mobile',
   section: 'player',
   desc: "attempt fix 'is not available in your country'",
   // 'desc:zh': '',
   // 'desc:ja': '',
   // 'desc:ko': '',
   // 'desc:es': '',
   // 'desc:pt': '',
   // 'desc:fr': '',
   // 'desc:tr': '',
   // 'desc:de': '',
   _runtime: user_settings => {

      NOVA.waitElement('ytd-watch-flexy[player-unavailable]')
         .then(redirect);

      // Doesn't work
      // NOVA.waitElement('video')
      //    .then(video => {
      //       video.addEventListener('emptied', redirect);
      //    });

      function redirect() {
         location.hostname = 'hooktube.com';
         // window.location.assign(`https://watannetwork.com/tools/blocked/#url=` + NOVA.queryURL.get('v'))
         // location.replace(`https://watannetwork.com/tools/blocked/#url=${NOVA.queryURL.get('v')}:~:text=Allowed%20countries`);

         // tubeunblock.com is shut down
         // location.replace(`${location.protocol}//hooktube.com/watch${location.search}`); // save time mark
      }

   },
});
window.nova_plugins.push({
   id: 'player-indicator',
   title: 'Replace HUD (bezel)',
   'title:zh': '替换默认指示器',
   'title:ja': 'デフォルトのインジケーターを置き換える',
   'title:ko': '기본 표시기 교체',
   'title:es': 'Reemplazar indicador predeterminado',
   'title:pt': 'Substituir o indicador padrão',
   'title:fr': "Remplacer l'indicateur par défaut",
   // 'title:tr': 'Varsayılan göstergeyi değiştir',
   'title:de': 'Standardkennzeichen ersetzen',
   run_on_pages: 'watch, embed',
   section: 'player',
   // desc: '',
   _runtime: user_settings => {

      // alt:
      // https://greasyfork.org/en/scripts/376002-youtube-volume-mouse-controller
      // https://greasyfork.org/en/scripts/376155-youtube-scroll-volume
      const
         SELECTOR_ID = 'nova-player-indicator-info',
         COLOR_HUD = user_settings.player_indicator_color || '#ff0000';

      NOVA.waitElement('video')
         .then(video => {
            // volume
            video.addEventListener('volumechange', function () {
               // console.debug('volumechange', movie_player.getVolume(), this.volume); // there is a difference
               HUD.set(Math.round(movie_player.getVolume()), '%');
            });
            // rate
            video.addEventListener('ratechange', () => HUD.set(video.playbackRate, 'x'));
         });

      // Listener default indicator
      NOVA.waitElement('.ytp-bezel-text')
         .then(target => {
            new MutationObserver(mutations => {
               for (const mutation of mutations) {
                  // console.log('bezel mutation detected', mutation.type, target.textContent);
                  if (target.textContent) {
                     HUD.set(target.textContent);
                     break;
                  }
               }
            })
               .observe(target, { childList: true }); // watch for textContent
         });

      const HUD = {
         get() {
            return this.conteiner || this.create();
         },
         // TODO The idea of ​​copying the progress bar. To display segments of time markers
         // a = el.cloneNode(true)
         // document.getElementById(SELECTOR_ID).innerHTML = a.innerHTML

         create() {
            // hide default indicator
            NOVA.css.push('.ytp-bezel-text-wrapper { display:none !important }');
            // init common css
            NOVA.css.push(
               `#${SELECTOR_ID} {
                  --color: #fff;
                  --bg-color: rgba(0,0,0,0.3);
                  --zindex: ${getComputedStyle(document.querySelector('.ytp-chrome-top'))['z-index'] || 60};

                  position: absolute;
                  right: 0;
                  z-index: calc(var(--zindex) + 1);
                  margin: 0 auto;
                  text-align: center;
                  opacity: 0;
                  background-color: var(--bg-color);
                  color: var(--color);
               }`);
            // template
            movie_player.insertAdjacentHTML('beforeend', `<div id="${SELECTOR_ID}"><span></span></div>`);

            this.conteiner = document.getElementById(SELECTOR_ID);
            this.hudSpan = this.conteiner.querySelector('span'); // export el

            // add to div user_settings.player_indicator_type style
            // const [indicator_type, span_align] = user_settings.player_indicator_type.split('=', 2); // 2 = max param;
            // switch (indicator_type) {
            switch (user_settings.player_indicator_type) {
               case 'bar-center':
                  Object.assign(this.conteiner.style, {
                     left: 0,
                     bottom: '20%',
                     width: '30%',
                     'font-size': '1.2em',
                  });
                  Object.assign(this.hudSpan.style, {
                     'background-color': COLOR_HUD,
                     transition: 'width 100ms ease-out 0s',
                     display: 'inline-block',
                  });
                  // if (span_align == 'left') {
                  //    Object.assign(this.hudSpan.style, {
                  //       float: 'left',
                  //    });
                  // }
                  break;

               case 'bar-vertical':
                  Object.assign(this.conteiner.style, {
                     top: 0,
                     height: '100%',
                     width: '25px',
                     'font-size': '1.2em',
                  });
                  Object.assign(this.hudSpan.style, {
                     position: 'absolute',
                     bottom: 0,
                     right: 0,
                     'background-color': COLOR_HUD,
                     transition: 'height 100ms ease-out 0s',
                     display: 'inline-block',
                     width: '100%',
                     'font-weight': 'bold',
                  });
                  break;

               // case 'text-top':
               default:
                  Object.assign(this.conteiner.style, {
                     top: 0,
                     width: '100%',
                     padding: '.2em',
                     'font-size': '1.55em',
                  });
            }
            return this.conteiner;
         },

         set(pt = 100, rate_suffix = '') {
            // console.debug('HUD set', ...arguments);
            if (typeof fateNovaHUD === 'number') clearTimeout(fateNovaHUD);

            let hudConteiner = this.get();
            const text = pt + rate_suffix;

            if (rate_suffix == 'x') { // rate to pt
               const maxPercent = (+user_settings.rate_step % .25) === 0 ? 2 : 3;
               pt = (+pt / maxPercent) * 100;
            }
            pt = Math.round(pt);

            switch (user_settings.player_indicator_type) {
               case 'bar-center':
                  this.hudSpan.style.width = pt + '%';
                  this.hudSpan.textContent = text;
                  break;

               case 'bar-vertical':
                  this.hudSpan.style.height = pt + '%';
                  this.hudSpan.textContent = text;
                  break;

               case 'bar-top':
                  hudConteiner.style.background = `linear-gradient(to right, ${COLOR_HUD}50 ${pt}%, rgba(0,0,0,.8) ${pt}%)`;
                  this.hudSpan.style.width = pt + '%';
                  this.hudSpan.textContent = text;
                  break;

               // case 'text-top':
               default:
                  this.hudSpan.textContent = text;
            }

            hudConteiner.style.transition = 'none';
            hudConteiner.style.opacity = 1;
            // hudConteiner.style.visibility = 'visible';

            fateNovaHUD = setTimeout(() => {
               hudConteiner.style.transition = 'opacity 200ms ease-in';
               hudConteiner.style.opacity = null;
               // hudConteiner.style.visibility = 'hidden';
            }, 800); //total 1s = 800ms + 200ms(hudConteiner.style.transition)
         }
      };

   },
   options: {
      player_indicator_type: {
         _tagName: 'select',
         label: 'Indicator type',
         'label:zh': '指标类型',
         'label:ja': 'インジケータータイプ',
         'label:ko': '표시기 유형',
         'label:es': 'Tipo de indicador',
         'label:pt': 'Tipo de indicador',
         'label:fr': "Type d'indicateur",
         // 'label:tr': 'Varsayılan göstergeyi değiştir',
         'label:de': 'Indikatortyp',
         options: [
            { label: 'text-top', value: 'text-top', selected: true },
            { label: 'bar-top', value: 'bar-top' },
            { label: 'bar-center', value: 'bar-center' },
            { label: 'bar-vertical', value: 'bar-vertical' },
         ],
      },
      player_indicator_color: {
         _tagName: 'input',
         label: 'Color',
         type: 'color',
         value: '#ff0000', // red
         'data-dependent': '{"player_indicator_type":["!text-top"]}',
      },
   }
});
window.nova_plugins.push({
   id: 'player-fullscreen-mode',
   title: 'Auto full-screen on playback',
   'title:zh': '播放时自动全屏',
   'title:ja': '再生時に全画面表示',
   'title:ko': '재생 시 자동 전체 화면',
   'title:es': 'Pantalla completa automática en reproducción',
   'title:pt': 'Tela cheia automática na reprodução',
   'title:fr': 'Plein écran automatique lors de la lecture',
   // 'title:tr': '',
   'title:de': 'Automatischer Vollbildmodus bei Wiedergabe',
   run_on_pages: 'watch',
   section: 'player',
   // desc: '',
   _runtime: user_settings => {

      // NOVA.waitElement('#movie_player:not(.ad-showing) video')
      NOVA.waitElement('video')
         .then(video => {
            // video.addEventListener('canplay', setFullscreen.bind(video));
            video.addEventListener('play', setFullscreen.bind(video));

            // exit fullscreen
            if (user_settings.player_fullscreen_mode_exit) {
               // Strategy 1
               video.addEventListener('ended', exitFullscreen);
               video.addEventListener('pause', exitFullscreen);
               // Strategy 2
               // movie_player.addEventListener('onStateChange', state => {
               //    if (document.fullscreen && movie_player.isFullscreen() && (NOVA.getPlayerState(state) == 'ENDED')) {
               //       movie_player.toggleFullscreen();
               //    }
               // });
            }
         });

      function setFullscreen() {
         if (movie_player.classList.contains('ad-showing')) return;

         if (!movie_player.isFullscreen()) {
            if (location.host == 'm.youtube.com') {
               document.body.querySelector('button.fullscreen-icon')?.click();

            } else {
               movie_player.toggleFullscreen();
            }
         }
      }

      function exitFullscreen() {
         document.fullscreenElement && document.exitFullscreen()
      }

   },
   options: {
      player_fullscreen_mode_exit: {
         _tagName: 'input',
         // label: 'Exit Fullscreen on Video End',
         label: 'Exit fullscreen on pause/ends',
         'label:zh': '暂停时退出全屏',
         'label:ja': '一時停止時に全画面表示を終了',
         'label:ko': '일시중지 시 전체화면 종료',
         'label:es': 'Salir de pantalla completa en pausa',
         'label:pt': 'Sair da tela cheia na pausa',
         'label:fr': 'Quitter le plein écran en pause',
         'label:de': 'Beenden Sie den Vollbildmodus bei Pause',
         type: 'checkbox',
      },
   },
});
window.nova_plugins.push({
   id: 'time-remaining',
   title: 'Remaining time',
   'title:zh': '剩余时间',
   'title:ja': '余日',
   'title:ko': '남은 시간',
   'title:es': 'Tiempo restante',
   'title:pt': 'Tempo restante',
   'title:fr': 'Temps restant',
   // 'title:tr': 'Kalan süre',
   'title:de': 'Verbleibende Zeit',
   run_on_pages: 'watch, embed',
   section: 'player',
   desc: 'Remaining time until the end of the video',
   'desc:zh': '距离视频结束的剩余时间',
   'desc:ja': 'ビデオの終わりまでの残り時間',
   'desc:ko': '영상 끝까지 남은 시간',
   'desc:es': 'Tiempo restante hasta el final del video',
   'desc:pt': 'Tempo restante até o final do vídeo',
   // 'desc:fr': "Temps restant jusqu'à la fin de la vidéo",
   'desc:tr': 'Videonun sonuna kalan süre',
   'desc:de': 'Verbleibende Zeit bis zum Ende des Videos',
   _runtime: user_settings => {

      const SELECTOR_ID = 'nova-player-time-remaining';

      NOVA.waitElement('.ytp-time-duration, ytm-time-display .time-display-content')
         .then(container => {

            NOVA.waitElement('video')
               .then(video => {
                  video.addEventListener('timeupdate', setRemaining.bind(video));
                  video.addEventListener('ratechange', setRemaining.bind(video));
                  ['suspend', 'ended'].forEach(evt => {
                     video.addEventListener(evt, () => insertToHTML({ 'container': container }));
                  });
               });

            function setRemaining() {
               if (isNaN(this.duration)
                  || movie_player.getVideoData().isLive // stream
                  || document.visibilityState == 'hidden' // tab inactive
                  || (movie_player || document.body).querySelector('.ytp-autohide video')) return;

               const getProgressPt = () => {
                  const floatRound = pt => this.duration > 3600 ? pt.toFixed(2) // >1 hour
                     : this.duration > 1500 ? pt.toFixed(1) // >25 Minute
                        : Math.round(pt); // whats left
                  return floatRound((this.currentTime / this.duration) * 100) + '%';
               }
               const getLeftTime = () => '-' + NOVA.timeFormatTo.HMS.digit((this.duration - this.currentTime) / this.playbackRate);
               let text;

               switch (user_settings.time_remaining_mode) {
                  case 'pt': text = ' • ' + getProgressPt(); break;
                  case 'time': text = getLeftTime(); break;
                  // case 'full':
                  default:
                     text = getLeftTime();
                     text += text && ` (${getProgressPt()})`; // prevent show NaN
               }

               if (text) {
                  insertToHTML({
                     'text': text,
                     'container': container,
                  });
               }
            }

            function insertToHTML({ text = '', container = required() }) {
               // console.debug('insertToHTML', ...arguments);
               if (!(container instanceof HTMLElement)) return console.error('container not HTMLElement:', container);

               (document.getElementById(SELECTOR_ID) || (function () {
                  // const el = document.createElement('span');
                  // el.id = SELECTOR_ID;
                  // container.after(el);
                  container.insertAdjacentHTML('afterend', ` <span id="${SELECTOR_ID}">${text}</span>`);
                  return document.getElementById(SELECTOR_ID);
               })())
                  .textContent = text;
            }

         });

   },
   options: {
      time_remaining_mode: {
         _tagName: 'select',
         label: 'Mode',
         'label:zh': '模式',
         'label:ja': 'モード',
         'label:ko': '방법',
         'label:es': 'Modo',
         'label:pt': 'Modo',
         // 'label:fr': 'Mode',
         // 'label:tr': 'Mod',
         'label:de': 'Modus',
         options: [
            { label: 'time+(%)', value: 'full' },
            { label: 'time', value: 'time', selected: true },
            { label: '%', value: 'pt' },
         ],
      },
   }
});
window.nova_plugins.push({
   id: 'video-autopause',
   title: 'Video auto pause',
   'title:zh': '视频自动暂停',
   'title:ja': 'ビデオの自動一時停止',
   'title:ko': '비디오 자동 일시 중지',
   'title:es': 'Pausa automática de video',
   'title:pt': 'Pausa automática de vídeo',
   'title:fr': 'Pause automatique de la vidéo',
   // 'title:tr': 'Video otomatik duraklatma',
   'title:de': 'Automatische Pause des Videos',
   run_on_pages: 'watch, embed',
   restart_on_transition: true,
   section: 'player',
   desc: 'Disable autoplay',
   _runtime: user_settings => {

      // better use this flag when launching the browser:
      //  --autoplay-policy=user-gesture-required

      NOVA.waitElement('video')
         .then(video => {
            video.addEventListener('playing', setVideoPause.bind(video), { capture: true, once: true });
         });

      function setVideoPause() {
         if (NOVA.queryURL.has('list') && !user_settings.video_autopause_ignore_playlist) return;

         this.pause();

         const forcePaused = setInterval(() => this.paused || this.pause(), 200); // 200ms
         setTimeout(() => clearInterval(forcePaused), 1000); // 1s
      }

   },
   options: {
      video_autopause_ignore_playlist: {
         _tagName: 'input',
         label: 'Ignore playlist',
         'label:zh': '忽略播放列表',
         'label:ja': 'プレイリストを無視する',
         'label:ko': '재생목록 무시',
         'label:es': 'Ignorar lista de reproducción',
         'label:pt': 'Ignorar lista de reprodução',
         'label:fr': 'Ignorer la liste de lecture',
         // 'label:tr': 'Oynatma listesini yoksay',
         'label:de': 'Wiedergabeliste ignorieren',
         type: 'checkbox',
      },
   },
});
window.nova_plugins.push({
   id: 'player-float-progress-bar',
   title: 'Float player progress bar',
   'title:zh': '浮动播放器进度条',
   'title:ja': 'フロートプレーヤーのプログレスバー',
   'title:ko': '플로팅 플레이어 진행률 표시줄',
   'title:es': 'Barra de progreso flotante del jugador',
   'title:pt': 'Barra de progresso do jogador flutuante',
   'title:fr': 'Barre de progression du joueur flottant',
   // 'title:tr': 'Kayan oyuncu ilerleme çubuğu',
   'title:de': 'Float-Player-Fortschrittsbalken',
   run_on_pages: 'watch, embed',
   section: 'player',
   // desc: '',
   _runtime: user_settings => {

      const
         SELECTOR_ID = 'nova-player-float-progress-bar',
         SELECTOR = '#' + SELECTOR_ID,
         CHAPTERS_MARK_WIDTH_PX = '2px';

      NOVA.waitElement('video')
         .then(video => {
            const
               container = renderFloatBar(),
               bufferEl = document.getElementById(`${SELECTOR_ID}-buffer`),
               progressEl = document.getElementById(`${SELECTOR_ID}-progress`);

            renderChapters.init(video); // init
            // is new video
            video.addEventListener('loadeddata', function () { // update
               // hide if is stream.
               container.style.display = movie_player.getVideoData().isLive ? 'none' : 'initial'; // style.visibility - overridden

               // reset animation state
               container.classList.remove('transition');
               bufferEl.style.transform = 'scaleX(0)';
               progressEl.style.transform = 'scaleX(0)';
               container.classList.add('transition');

               renderChapters.init(this);
            });

            // render progress
            // NOVA.waitElement(`${SELECTOR}-progress`)
            //    .then(progressEl => {
            video.addEventListener('timeupdate', function () {
               if (document.visibilityState == 'hidden' // tab inactive
                  || movie_player.getVideoData().isLive) return;

               // Strategy 1 HTML5
               if (!isNaN(this.duration)) {
                  progressEl.style.transform = `scaleX(${this.currentTime / this.duration})`;
               }
               // Strategy 2
               // if (!isNaN(movie_player.getDuration())) {
               //    progressEl.style.transform = `scaleX(${movie_player.getCurrentTime() / movie_player.getDuration()})`;
               // }
            });
            // });

            // render buffer
            // NOVA.waitElement(`${SELECTOR}-buffer`)
            //    .then(bufferEl => {
            video.addEventListener('progress', renderBuffer.bind(video));
            video.addEventListener('seeking', renderBuffer.bind(video));

            function renderBuffer() {
               if (document.visibilityState == 'hidden' // tab inactive
                  || movie_player.getVideoData().isLive) return;

               // Strategy 1 HTML5
               // for (let i = 0; i < this.buffered.length; i++) {
               //    //    const bufferedSeconds = this.buffered.end(0) - this.buffered.start(0);
               //    //    console.debug(`${bufferedSeconds} seconds of video are ready to play.`);
               //    if (!isNaN(this.duration) && this.currentTime > this.buffered.start(i)) {
               //       bufferEl.style.transform = `scaleX(${this.buffered.end(i) / this.duration})`;
               //    }
               // }

               // Strategy 2
               if ((totalDuration = movie_player.getDuration()) && !isNaN(totalDuration)) {
                  bufferEl.style.transform = `scaleX(${
                     (movie_player.getVideoBytesLoaded() / totalDuration) * totalDuration
                     })`;
               }
            }
            // });

         });

      function renderFloatBar() {

         return document.getElementById(SELECTOR_ID) || (function () {
            movie_player?.insertAdjacentHTML('beforeend',
               `<div id="${SELECTOR_ID}" class="transition">
                  <div class="conteiner">
                     <div id="${SELECTOR_ID}-buffer" class="ytp-load-progress"></div>
                     <div id="${SELECTOR_ID}-progress" class="ytp-swatch-background-color"></div>
                  </div>
                  <div id="${SELECTOR_ID}-chapters"></div>
               </div>`);

            const zIndex = getComputedStyle(document.querySelector('.ytp-chrome-bottom'))['z-index'] || 60;
            // const bufferColor = getComputedStyle(document.querySelector('.ytp-load-progress'))['background-color'] || 'rgba(255,255,255,.4)';

            NOVA.css.push(
               `[id|=${SELECTOR_ID}] {
                  position: absolute;
                  bottom: 0;
               }

               ${SELECTOR} {
                  --opacity: ${+user_settings.player_float_progress_bar_opacity || .7};
                  --height: ${+user_settings.player_float_progress_bar_height || 3}px;
                  --bg-color: ${getComputedStyle(document.querySelector('.ytp-progress-list'))['background-color'] || 'rgba(255,255,255,.2)'};
                  --zindex: ${zIndex};

                  opacity: var(--opacity)
                  z-index: var(--zindex);
                  background: var(--bg-color);
                  width: 100%;
                  visibility: hidden;
               }

               /*.ytp-chrome-bottom[hidden],*/
               .ytp-autohide ${SELECTOR} {
                  visibility: visible;
               }

               /*${SELECTOR} .conteiner {
                  position: relative;
                  margin: 0 15px;
               }*/

               ${SELECTOR}.transition [id|=${SELECTOR_ID}] {
                  transition: transform .2s linear;
               }

               ${SELECTOR}-progress, ${SELECTOR}-buffer {
                  width: 100%;
                  height: var(--height);
                  transform-origin: 0 0;
                  transform: scaleX(0);
               }

               ${SELECTOR}-progress {
                  z-index: calc(var(--zindex) + 1);
               }

               /*${SELECTOR}-buffer {
                  background: var(--buffer-color);
               }*/

               ${SELECTOR}-chapters {
                  position: relative;
                  width: 100%;
                  display: flex;
                  justify-content: flex-end;
               }

               ${SELECTOR}-chapters span {
                  height: var(--height);
                  z-index: ${+zIndex + 1};
                  border-left: ${CHAPTERS_MARK_WIDTH_PX} solid rgba(255,255,255,.7);
                  /* border-left: ${CHAPTERS_MARK_WIDTH_PX} solid #000; */
                  margin-left: -${CHAPTERS_MARK_WIDTH_PX};
               }`);

            return document.getElementById(SELECTOR_ID);
         })();
      }

      const renderChapters = {
         async init(vid) {
            if (NOVA.currentPage == 'watch' && !(vid instanceof HTMLElement)) return console.error('vid not HTMLElement:', chaptersContainer);

            switch (NOVA.currentPage) {
               case 'watch':
                  await NOVA.waitUntil(!isNaN(vid.duration), 1000) // panel hides for a few seconds. No need to hurry
                  this.from_description(vid.duration);
                  break;

               // embed dont have description
               case 'embed':
                  await NOVA.waitUntil((chaptersContainer = document.body.querySelector('.ytp-chapters-container'))
                     && chaptersContainer?.children.length > 1, 1000) // panel hides for a few seconds. No need to hurry
                  this.from_div(chaptersContainer);
                  break;
            }
         },

         from_description(duration = required()) {
            if (Math.sign(duration) !== 1) return console.error('duration not positive number:', duration);
            // <a href="/playlist?list=XX"> - erroneous filtering "t=XX" without the character "&"
            const selectorTimestampLink = 'a[href*="&t="]';
            // search in description
            NOVA.waitElement(`#primary-inner #description ${selectorTimestampLink}`)
               .then(() => renderChaptersMarks(duration));

            // search in first/pinned comment
            NOVA.waitElement(`#comments ytd-comment-thread-renderer:first-child #content ${selectorTimestampLink}`)
               .then(() => renderChaptersMarks(duration));

            function renderChaptersMarks(duration) {
               // console.debug('renderChaptersMarks', ...arguments);
               if (chaptersConteiner = document.getElementById(`${SELECTOR_ID}-chapters`)) {
                  chaptersConteiner.innerHTML = ''; // clear old
                  // if (!isNaN(duration)) {
                  NOVA.getChapterList(duration)
                     ?.forEach((chapter, i, chapters_list) => {
                        // console.debug('chapter', (newChapter.sec / duration) * 100 + '%');
                        const newChapter = document.createElement('span');
                        const nextChapterSec = chapters_list[i + 1]?.sec || duration;

                        newChapter.style.width = ((nextChapterSec - chapter.sec) / duration) * 100 + '%';
                        if (chapter.title) newChapter.title = chapter.title;
                        newChapter.setAttribute('time', chapter.time);

                        chaptersConteiner.append(newChapter);
                     });
                  // }
               }
            }
         },

         from_div(chaptersContainer = required()) {
            if (!(chaptersContainer instanceof HTMLElement)) return console.error('container not HTMLElement:', chaptersContainer);
            const
               progressContainerWidth = parseInt(getComputedStyle(chaptersContainer).width),
               chaptersConteiner = document.getElementById(`${SELECTOR_ID}-chapters`);

            for (const chapter of chaptersContainer.children) {
               const
                  newChapter = document.createElement('span'),
                  { width, marginLeft, marginRight } = getComputedStyle(chapter),
                  chapterMargin = parseInt(marginLeft) + parseInt(marginRight);

               newChapter.style.width = (((chapterWidth + chapterMargin) / progressContainerWidth) * 100) + '%';

               chaptersConteiner.append(newChapter);
            }
         },
      };

   },
   options: {
      player_float_progress_bar_height: {
         _tagName: 'input',
         label: 'Height',
         'label:zh': '高度',
         'label:ja': '身長',
         'label:ko': '키',
         'label:es': 'Altura',
         'label:pt': 'Altura',
         'label:fr': 'Hauteur',
         // 'label:tr': 'Yükseklik',
         'label:de': 'Höhe',
         type: 'number',
         title: 'in pixels',
         placeholder: 'px',
         min: 1,
         max: 9,
         value: 3,
      },
      player_float_progress_bar_opacity: {
         _tagName: 'input',
         label: 'Opacity',
         'label:zh': '不透明度',
         'label:ja': '不透明度',
         'label:ko': '불투명',
         'label:es': 'Opacidad',
         'label:pt': 'Opacidade',
         'label:fr': 'Opacité',
         // 'label:tr': 'Opaklık',
         'label:de': 'Opazität',
         type: 'number',
         // title: '',
         placeholder: '0-1',
         step: .05,
         min: 0,
         max: 1,
         value: .7,
      },
   }
});
// https://www.youtube.com/watch?v=Il0S8BoucSA&t=99 - subtitle alignment bug
// https://youtu.be/XvJRE6Sm-lM - has sub

window.nova_plugins.push({
   id: 'subtitle-transparent',
   title: 'Transparent subtitles (captions)',
   'title:zh': '透明字幕',
   'title:ja': '透明な字幕',
   'title:ko': '투명한 자막',
   'title:es': 'Subtítulos transparentes',
   'title:pt': 'Legendas transparentes',
   'title:fr': 'Sous-titres transparents',
   // 'title:tr': 'Şeffaf altyazılar',
   'title:de': 'Transparente Untertitel',
   run_on_pages: 'watch, embed, -mobile',
   section: 'player',
   // desc: '',
   _runtime: user_settings => {

      let css = {
         'background': 'transparent',
         'text-shadow':
            `rgb(0, 0, 0) 0 0 .1em,
            rgb(0, 0, 0) 0 0 .2em,
            rgb(0, 0, 0) 0 0 .4em`,
      };

      if (user_settings.subtitle_bold) css['font-weight'] = 'bold';

      if (user_settings.subtitle_fixed) {
         NOVA.css.push(
            // `.ytp-larger-tap-buttons .caption-window.ytp-caption-window-bottom {
            `.caption-window {
               margin-bottom: 1px !important;
               bottom: 1% !important;
               left: 50% !important;
            }`);
      }

      NOVA.css.push(css, `.ytp-caption-segment`, 'important');
   },
   options: {
      subtitle_bold: {
         _tagName: 'input',
         label: 'Bold text',
         'label:zh': '粗体',
         'label:ja': '太字',
         'label:ko': '굵은 텍스트',
         'label:es': 'Texto en negrita',
         'label:pt': 'Texto em negrito',
         'label:fr': 'Texte en gras',
         // 'label:tr': 'Kalın yazı',
         'label:de': 'Fetter Text',
         type: 'checkbox',
      },
      subtitle_fixed: {
         _tagName: 'input',
         label: 'Fixed bottom',
         // 'label:zh': '粗体',
         // 'label:ja': '太字',
         // 'label:ko': '굵은 텍스트',
         // 'label:es': 'Texto en negrita',
         // 'label:pt': 'Texto em negrito',
         // 'label:fr': 'Texte en gras',
         // 'label:tr': 'Kalın yazı',
         // 'label:de': 'Fetter Text',
         type: 'checkbox',
      },
   }
});
window.nova_plugins.push({
   id: 'player-buttons-custom',
   title: 'Custom player buttons',
   'title:zh': '自定义按钮',
   'title:ja': 'カスタムボタン',
   'title:ko': '사용자 정의 버튼',
   'title:es': 'Botones personalizados',
   'title:pt': 'Botões personalizados',
   'title:fr': 'Boutons personnalisés',
   // 'title:tr': 'Özel düğmeler',
   'title:de': 'Benutzerdefinierte Schaltflächen',
   run_on_pages: 'watch, embed, -mobile',
   section: 'player',
   // desc: '',
   _runtime: user_settings => {

      const
         SELECTOR_BTN_CLASS_NAME = 'nova-right-custom-button',
         SELECTOR_BTN = '.' + SELECTOR_BTN_CLASS_NAME; // for css

      // NOVA.waitElement('.ytp-left-controls')
      NOVA.waitElement('.ytp-right-controls')
         .then(async container => {
            NOVA.videoElement = await NOVA.waitElement('video');

            // global
            NOVA.css.push(
               `/* button${SELECTOR_BTN} { padding: 5px; width: 25px; } */
               ${SELECTOR_BTN}:hover { color: #66afe9 !important; }
               ${SELECTOR_BTN}:active { color: #2196f3 !important; }`);

            // custon title (with animation)
            // NOVA.css.push(
            //    `${SELECTOR_BTN}[title]::before {
            //       content: attr(title);
            //       position: absolute;
            //       top: -3em;
            //       line-height: normal;
            //       background-color: rgba(28,28,28,.9);
            //       border-radius: 2px;
            //       padding: 5px 9px;
            //       color: #fff;
            //       font-weight: bold;
            //       white-space: nowrap;

            //       /*animation*/
            //       --scale: 0;
            //       transform: translateX(-25%) scale(var(--scale));
            //       transition: 50ms transform;
            //       transform-origin: bottom center;
            //    }
            //    ${SELECTOR_BTN}[title]:hover::before {
            //       --scale: 1
            //    }`);
            NOVA.css.push(
               `${SELECTOR_BTN}[title]:hover::before {
                  content: attr(title);
                  position: absolute;
                  top: -3em;
                  transform: translateX(-25%);
                  line-height: normal;
                  background-color: rgba(28,28,28,.9);
                  border-radius: 2px;
                  padding: 5px 9px;
                  color: #fff;
                  font-weight: bold;
                  white-space: nowrap;
               }`);

            // picture-in-picture player
            if (user_settings.player_buttons_custom_items?.includes('picture-in-picture')) {
               const pipBtn = document.createElement('button');

               pipBtn.className = `ytp-button ${SELECTOR_BTN_CLASS_NAME}`;
               pipBtn.title = 'Open in PictureInPicture';
               pipBtn.innerHTML = createSVG();
               // pipBtn.innerHTML =
               //    `<svg viewBox="-8 -6 36 36" height="100%" width="100%">
               //       <g fill="currentColor">
               //          <path d="M2.5,17A1.5,1.5,0,0,1,1,15.5v-9A1.5,1.5,0,0,1,2.5,5h13A1.5,1.5,0,0,1,17,6.5V10h1V6.5A2.5,2.5,0,0,0,15.5,4H2.5A2.5,2.5,0,0,0,0,6.5v9A2.5,2.5,0,0,0,2.5,18H7V17Z M18.5,11h-8A2.5,2.5,0,0,0,8,13.5v5A2.5,2.5,0,0,0,10.5,21h8A2.5,2.5,0,0,0,21,18.5v-5A2.5,2.5,0,0,0,18.5,11Z" />
               //       </g>
               //    </svg>`;
               // `<svg viewBox="-3 -7 30 30" height="100%" width="100%">
               //    <g fill="currentColor">
               //       <path fill-rule="evenodd" d="M0 3.5A1.5 1.5 0 0 1 1.5 2h13A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5v-9zM1.5 3a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-13z"/>
               //       <path d="M8 8.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5v-3z"/>
               //    </g>
               // </svg>`;
               pipBtn.addEventListener('click', () => document.pictureInPictureElement
                  ? document.exitPictureInPicture() : NOVA.videoElement.requestPictureInPicture()
               );

               container.prepend(pipBtn);

               // update icon
               NOVA.videoElement?.addEventListener('enterpictureinpicture', () => pipBtn.innerHTML = createSVG(2));
               NOVA.videoElement?.addEventListener("leavepictureinpicture", () => pipBtn.innerHTML = createSVG());

               function createSVG(alt) {
                  const svg = document.createElement('svg');
                  svg.setAttribute('width', '100%');
                  svg.setAttribute('height', '100%');
                  svg.setAttribute('viewBox', '-8 -6 36 36');
                  const path = document.createElement("path");
                  path.setAttribute('fill', '#fff');
                  path.setAttribute('d', alt
                     ? 'M18.5,11H18v1h.5A1.5,1.5,0,0,1,20,13.5v5A1.5,1.5,0,0,1,18.5,20h-8A1.5,1.5,0,0,1,9,18.5V18H8v.5A2.5,2.5,0,0,0,10.5,21h8A2.5,2.5,0,0,0,21,18.5v-5A2.5,2.5,0,0,0,18.5,11Z M14.5,4H2.5A2.5,2.5,0,0,0,0,6.5v8A2.5,2.5,0,0,0,2.5,17h12A2.5,2.5,0,0,0,17,14.5v-8A2.5,2.5,0,0,0,14.5,4Z'
                     : 'M2.5,17A1.5,1.5,0,0,1,1,15.5v-9A1.5,1.5,0,0,1,2.5,5h13A1.5,1.5,0,0,1,17,6.5V10h1V6.5A2.5,2.5,0,0,0,15.5,4H2.5A2.5,2.5,0,0,0,0,6.5v9A2.5,2.5,0,0,0,2.5,18H7V17Z M18.5,11h-8A2.5,2.5,0,0,0,8,13.5v5A2.5,2.5,0,0,0,10.5,21h8A2.5,2.5,0,0,0,21,18.5v-5A2.5,2.5,0,0,0,18.5,11Z');
                  svg.append(path);
                  return svg.outerHTML;
               }
            }

            // Pop-up player
            if (user_settings.player_buttons_custom_items?.indexOf('popup') !== -1 && !NOVA.queryURL.has('popup')) {
               const popupBtn = document.createElement('button');
               popupBtn.className = `ytp-button ${SELECTOR_BTN_CLASS_NAME}`;
               popupBtn.title = 'Open in popup';
               popupBtn.innerHTML =
                  `<svg viewBox="-8 -8 36 36" height="100%" width="100%">
                     <g fill="currentColor">
                        <path d="M18 2H6v4H2v12h12v-4h4V2z M12 16H4V8h2v6h6V16z M16 12h-2h-2H8V8V6V4h8V12z" />
                     </g>
                  </svg>`;
               // `<svg viewBox="0 -5 24 30" height="100%" width="100%">
               //    <g transform="translate(0,2)">
               //       <polygon fill-rule="nonzero" points="1.85008844 1.51464844 18.2421138 1.51464844 18.2421138 7.74121094 19.2421138 7.74121094 19.2421138 0.514648438 0.850088443 0.514648438 0.850088443 11.7244572 9.16539331 11.7758693 9.17157603 10.7758885 1.85008844 10.7306209" />
               //       <rect x="10.5" y="9" width="9.5" height="6" />
               //       <path d="M8.49517931,6.9934339 L4.58268904,3.10539669 L3.87780235,3.81471662 L7.75590296,7.6685791 L5.14025649,7.6685791 L5.14025649,8.6685791 L9.49517931,8.6685791 L9.49517931,4.64446771 L8.49517931,4.64446771 L8.49517931,6.9934339 Z" fill-rule="nonzero" />
               //    </g>
               // </svg>`;
               popupBtn.addEventListener('click', () => {
                  const
                     // width = window.innerWidth / 2,
                     width = screen.width / (+user_settings.player_buttons_custom_popup_width || 4),
                     // aspectRatio = NOVA.videoElement.videoWidth / NOVA.videoElement.videoHeight,
                     // height = Math.round(width / aspectRatio);
                     height = Math.round(width / (16 / 9));

                  url = new URL(document.head.querySelector('link[itemprop="embedUrl"][href]')?.href || ('https://www.youtube.com/embed/' + movie_player.getVideoData().video_id));
                  // list param ex.
                  // https://www.youtube.com/embed/PBlOi5OVcKs?start=0&amp;playsinline=1&amp;controls=0&amp;fs=20&amp;disablekb=1&amp;rel=0&amp;origin=https%3A%2F%2Ftyping-tube.net&amp;enablejsapi=1&amp;widgetid=1

                  if (currentTime = ~~NOVA.videoElement?.currentTime) url.searchParams.append('start', currentTime);
                  url.searchParams.append('autoplay', 1);
                  url.searchParams.append('popup', true); // deactivate popup-button for used window

                  openPopup({ 'url': url.href, 'title': document.title, 'width': width, 'height': height });
               });

               container.prepend(popupBtn);

               function openPopup({ url, title, width, height }) {
                  // center screen
                  const left = (screen.width / 2) - (width / 2);
                  const top = (screen.height / 2) - (height / 2);
                  // bottom right corner
                  // left = window.innerWidth;
                  // top = window.innerHeight;
                  return window.open(url, title, `popup=1,toolbar=no,location=no,directories=no,status=no,menubar=no, scrollbars=no,resizable=yes,copyhistory=no,width=${width},height=${height},top=${top},left=${left}`);
               }
            }

            if (user_settings.player_buttons_custom_items?.includes('screenshot')) {
               const
                  // bar
                  SELECTOR_SCREENSHOT_ID = 'nova-screenshot-result',
                  SELECTOR_SCREENSHOT = '#' + SELECTOR_SCREENSHOT_ID; // for css

               NOVA.css.push(
                  SELECTOR_SCREENSHOT + ` {
                     --width: 400px;
                     --height: 400px;

                     position: fixed;
                     top: 0;
                     right: 0;
                     overflow: hidden;
                     margin: 30px; /* <-- possibility out of date */
                     box-shadow: 0 0 15px #000;
                     max-width: var(--width);
                     max-height: var(--height);
                     z-index: 300; /* <-- possibility out of date */
                  }

                  /*${SELECTOR_SCREENSHOT}:hover {
                     outline: 2px dashed #f69c55;
                  }*/

                  ${SELECTOR_SCREENSHOT} canvas {
                     max-width: var(--width);
                     max-height: var(--height);
                     /* object-fit: contain; */
                  }

                  ${SELECTOR_SCREENSHOT} .close-btn {
                     position: absolute;
                     bottom: 0;
                     right: 0;
                     background: rgba(0, 0, 0, .5);
                     color: #FFF;
                     cursor: pointer;
                     font-size: 12px;
                     display: grid;
                     height: 100%;
                     width: 25%;
                  }
                  ${SELECTOR_SCREENSHOT} .close-btn:hover { background: rgba(0, 0, 0, .65); }
                  ${SELECTOR_SCREENSHOT} .close-btn > * { margin: auto; }`);

               const screenshotBtn = document.createElement('button');
               screenshotBtn.className = `ytp-button ${SELECTOR_BTN_CLASS_NAME}`;
               screenshotBtn.title = 'Take screenshot';
               // Doesn't work defoult title
               // screenshotBtn.setAttribute('aria-pressed', 'false');
               // screenshotBtn.setAttribute('aria-label','test');
               screenshotBtn.innerHTML =
                  `<svg viewBox="0 -166 512 860" height="100%" width="100%">
                     <g fill="currentColor">
                        <circle cx="255.811" cy="285.309" r="75.217" />
                        <path d="M477,137H352.718L349,108c0-16.568-13.432-30-30-30H191c-16.568,0-30,13.432-30,30l-3.718,29H34 c-11.046,0-20,8.454-20,19.5v258c0,11.046,8.954,20.5,20,20.5h443c11.046,0,20-9.454,20-20.5v-258C497,145.454,488.046,137,477,137 z M255.595,408.562c-67.928,0-122.994-55.066-122.994-122.993c0-67.928,55.066-122.994,122.994-122.994 c67.928,0,122.994,55.066,122.994,122.994C378.589,353.495,323.523,408.562,255.595,408.562z M474,190H369v-31h105V190z" />
                     </g>
                  </svg>`;

               // simplified implementation. Can't open images in a new tab
               // screenshotBtn.addEventListener('click', getScreenshot);
               // function getScreenshot() {
               //    var width, height, aspectRatio, container, canvas, close;
               //    container = document.getElementById(SELECTOR_SCREENSHOT_ID) || document.createElement('div');
               //    canvas = container.querySelector('canvas') || document.createElement('canvas');
               //    canvas.width = NOVA.videoElement.videoWidth;
               //    canvas.height = NOVA.videoElement.videoHeight
               //    canvas.getContext('2d').drawImage(NOVA.videoElement, 0, 0, canvas.width, canvas.height);
               //    // create
               //    if (!container.id) {
               //       canvas.addEventListener('click', ({ target }) => {
               //          downloadCanvasAsImage(target);
               //          container.remove();
               //       });
               //       container.id = SELECTOR_SCREENSHOT_ID;
               //       container.append(canvas);
               //       const close = document.createElement('div');
               //       close.className = 'close-btn';
               //       close.innerHTML = '<span>CLOSE</span>';
               //       close.addEventListener('click', evt => container.remove());
               //       container.append(close);
               //       document.body.append(container);
               //    }
               // }

               screenshotBtn.addEventListener('click', () => {
                  const
                     container = document.getElementById(SELECTOR_SCREENSHOT_ID) || document.createElement('a'),
                     canvas = container.querySelector('canvas') || document.createElement('canvas');

                  canvas.width = NOVA.videoElement.videoWidth;
                  canvas.height = NOVA.videoElement.videoHeight
                  canvas.getContext('2d').drawImage(NOVA.videoElement, 0, 0, canvas.width, canvas.height);
                  try {
                     // fix Uncaught DOMException: Failed to execute 'toDataURL' on 'HTMLCanvasElement': Tainted canvases may not be exported.
                     // ex: https://www.youtube.com/watch?v=FZovbrEP53o

                     canvas.toBlob(blob => container.href = URL.createObjectURL(blob));
                     // container.href = canvas.toDataURL(); // err in Brave browser (https://github.com/raingart/Nova-YouTube-extension/issues/8)
                  } catch (error) {
                     alert("The video is protected. Can't take screenshot due to security policy");
                     container.remove();
                  }
                  // create
                  if (!container.id) {
                     const headerContainer = document.getElementById('masthead-container');
                     container.id = SELECTOR_SCREENSHOT_ID;
                     container.target = '_blank'; // useful link
                     container.title = 'Click to save';
                     container.style.marginTop = (headerContainer?.offsetHeight || 0) + 'px'; // fix header indent
                     container.style.zIndex = getComputedStyle(headerContainer)['z-index']; // fix header overlapping
                     canvas.addEventListener('click', evt => {
                        evt.preventDefault();
                        downloadCanvasAsImage(evt.target);
                        container.remove();
                     });
                     container.append(canvas);
                     const close = document.createElement('a');
                     close.className = 'close-btn'
                     // close.textContent = 'CLOSE';
                     close.innerHTML = '<span>CLOSE</span>';
                     close.addEventListener('click', evt => {
                        evt.preventDefault();
                        container.remove();
                     });
                     container.append(close);
                     document.body.append(container);
                  }
               });

               function downloadCanvasAsImage(canvas) {
                  const
                     downloadLink = document.createElement('a'),
                     downloadFileName =
                        [
                           movie_player.getVideoData().title
                              .replace(/[\\/:*?"<>|]+/g, '')
                              .replace(/\s+/g, ' ').trim(),
                           `[${NOVA.timeFormatTo.HMS.abbr(NOVA.videoElement.currentTime)}]`,
                        ]
                           .join(' ');

                  downloadLink.href = canvas.toBlob(blob => URL.createObjectURL(blob));
                  // downloadLink.href = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
                  // container.href = canvas.toDataURL(); // err in Brave browser (https://github.com/raingart/Nova-YouTube-extension/issues/8)
                  downloadLink.download = downloadFileName + '.png';
                  downloadLink.click();
               }
               container.prepend(screenshotBtn);
            }

            if (user_settings.player_buttons_custom_items?.includes('thumbnail')) {
               const thumbBtn = document.createElement('button');
               thumbBtn.className = `ytp-button ${SELECTOR_BTN_CLASS_NAME}`;
               // thumbBtn.setAttribute('data-tooltip', 'Open thumbnail');
               thumbBtn.title = 'Open thumbnail';
               thumbBtn.innerHTML =
                  `<svg viewBox="0 -10 21 40" height="100%" width="100%">
                     <g fill="currentColor">
                        <circle cx='8' cy='7.2' r='2'/>
                        <path d='M0 2v16h20V2H0z M18 16H2V4h16V16z'/>
                        <polygon points='17 10.9 14 7.9 9 12.9 6 9.9 3 12.9 3 15 17 15' />
                     </g>
                  </svg>`;

               // simplified implementation
               // thumbBtn.addEventListener('click', getThumb);
               // function getThumb() {
               //    const thumbnail_url =
               //       [
               //          document.querySelector('[href*="maxresdefault"]')?.href,
               //          window.ytplayer.config.args.raw_player_response.videoDetails.thumbnail.thumbnails.pop(),
               //          window.ytplayer.config.args.raw_player_response.microformat.playerMicroformatRenderer.thumbnail.thumbnails[0],
               //       ]
               //          .filter(u => u)
               //    window.open(thumbnail_url);
               // }

               thumbBtn.addEventListener('click', () => {
                  // https://i.ytimg.com/vi_webp/<VIDEO_ID>/maxresdefault.webp
                  // https://i.ytimg.com/vi/<VIDEO_ID>/maxresdefault.jpg
                  // https://i.ytimg.com/vi/<VIDEO_ID>/hqdefault.jpg

                  // window.open(`https://i.ytimg.com/vi/${movie_player.getVideoData().video_id}/maxresdefault.jpg`);

                  // Warn! "maxresdefault" is not available everywhere. etc:
                  // https://i.ytimg.com/vi/cPzpTvVPTII/maxresdefault.jpg
                  // https://i.ytimg.com/vi/cPzpTvVPTII/hqdefault.jpg
                  // Check the size of an image. And then replace "maxresdefault" with "hqdefault"
                  const
                     tmpImg = document.createElement('img'),
                     genImgURL = res_prefix => `https://i.ytimg.com/vi/${movie_player.getVideoData().video_id}/${res_prefix}default.jpg`;

                  document.body.style.cursor = 'wait';
                  tmpImg.src = genImgURL('maxres');
                  tmpImg.addEventListener('load', function () {
                     document.body.style.cursor = 'default';
                     window.open(
                        genImgURL((this.naturalWidth === 120 && this.naturalHeight === 90) ? 'hq' : 'maxres')
                     );
                  });
               });
               container.prepend(thumbBtn);
            }

            if (user_settings.player_buttons_custom_items?.includes('rotate')) {
               // alt - https://github.com/zhzLuke96/ytp-rotate
               const rotateBtn = document.createElement('button');

               // if (NOVA.videoElement?.videoWidth < NOVA.videoElement?.videoHeight) {
               rotateBtn.className = `ytp-button ${SELECTOR_BTN_CLASS_NAME}`;
               rotateBtn.title = 'Rotate video';
               Object.assign(rotateBtn.style, {
                  padding: '0 1.1em',
               });
               rotateBtn.innerHTML =
                  `<svg viewBox="0 0 1536 1536" height="100%" width="100%">
                     <g fill="currentColor">
                        <path
                           d="M1536 128v448q0 26-19 45t-45 19h-448q-42 0-59-40-17-39 14-69l138-138Q969 256 768 256q-104 0-198.5 40.5T406 406 296.5 569.5 256 768t40.5 198.5T406 1130t163.5 109.5T768 1280q119 0 225-52t179-147q7-10 23-12 14 0 25 9l137 138q9 8 9.5 20.5t-7.5 22.5q-109 132-264 204.5T768 1536q-156 0-298-61t-245-164-164-245T0 768t61-298 164-245T470 61 768 0q147 0 284.5 55.5T1297 212l130-129q29-31 70-14 39 17 39 59z"/>
                        </path>
                     </g>
                  </svg>`;
               rotateBtn.addEventListener('click', () => {
                  let angle = parseInt(NOVA.videoElement.style.transform.replace(/^\D+/g, '')) || 0;
                  // fix ratio scale. Before angle calc
                  const scale = (angle === 0 || angle === 180) ? movie_player.clientHeight / NOVA.videoElement.clientWidth : 1;
                  angle += 90;
                  NOVA.videoElement.style.transform = (angle === 360) ? '' : `rotate(${angle}deg) scale(${scale})`;
                  console.debug('rotate', angle, scale, NOVA.videoElement.style.transform);
               });
               container.prepend(rotateBtn);
               // }
            }

            if (user_settings.player_buttons_custom_items?.includes('quick-quality')) {
               const
                  // conteiner <a>
                  SELECTOR_QUALITY_CLASS_NAME = 'nova-quick-quality',
                  SELECTOR_QUALITY = '.' + SELECTOR_QUALITY_CLASS_NAME,
                  qualityConteinerBtn = document.createElement('a'),
                  // list <ul>
                  SELECTOR_QUALITY_LIST_ID = SELECTOR_QUALITY_CLASS_NAME + '-list',
                  SELECTOR_QUALITY_LIST = '#' + SELECTOR_QUALITY_LIST_ID,
                  listQuality = document.createElement('ul'),
                  // btn <span>
                  SELECTOR_QUALITY_BTN_ID = SELECTOR_QUALITY_CLASS_NAME + '-btn',
                  qualityBtn = document.createElement('span'),

                  qualityFormatList = {
                     highres: { label: '4320p', badge: '8K' },
                     hd2880: { label: '2880p', badge: '5K' },
                     hd2160: { label: '2160p', badge: '4K' },
                     hd1440: { label: '1440p', badge: 'QHD' },
                     hd1080: { label: '1080p', badge: 'FHD' },
                     hd720: { label: '720p', badge: 'HD' },
                     large: { label: '480p' },
                     medium: { label: '360p' },
                     small: { label: '240p' },
                     tiny: { label: '144p' },
                     auto: { label: 'auto' },
                  };

               NOVA.css.push(
                  SELECTOR_QUALITY + ` {
                     overflow: visible !important;
                     position: relative;
                     text-align: center !important;
                     vertical-align: top;
                     font-weight: bold;
                  }

                  ${SELECTOR_QUALITY_LIST} {
                     position: absolute;
                     bottom: 4em;
                     left: -2em;
                     list-style: none;
                     padding-bottom: .5em;
                     z-index: ${+getComputedStyle(document.querySelector('.ytp-progress-bar'))['z-index'] + 1};
                  }

                  ${SELECTOR_QUALITY}:not(:hover) ${SELECTOR_QUALITY_LIST} {
                     display: none;
                  }

                  ${SELECTOR_QUALITY_LIST} li {
                     cursor: pointer;
                     line-height: 1.4;
                     background: rgba(28, 28, 28, 0.9);
                     margin: .3em 0;
                     padding: .5em 3em;
                     border-radius: .3em;
                     color: #fff;
                  }

                  ${SELECTOR_QUALITY_LIST} li .quality-menu-item-label-badge {
                     position: absolute;
                     right: 1em;
                     width: 1.7em;
                  }

                  ${SELECTOR_QUALITY_LIST} li.active { background: #720000; }
                  ${SELECTOR_QUALITY_LIST} li:hover:not(.active) { background-color: var(--yt-spec-brand-button-background); }`);
               // conteiner <a>
               qualityConteinerBtn.className = `ytp-button ${SELECTOR_BTN_CLASS_NAME} ${SELECTOR_QUALITY_CLASS_NAME}`;
               // qualityConteinerBtn.title = 'Change quality';
               // btn <span>
               qualityBtn.id = SELECTOR_QUALITY_BTN_ID;
               qualityBtn.textContent = qualityFormatList[movie_player.getPlaybackQuality()]?.label || '[out of range]';
               // list <ul>
               listQuality.id = SELECTOR_QUALITY_LIST_ID;

               // show current quality
               movie_player.addEventListener('onPlaybackQualityChange', quality => {
                  document.getElementById(SELECTOR_QUALITY_BTN_ID)
                     .textContent = qualityFormatList[quality]?.label || '[out of range]';
                  // dirty hack (clear list) replaces this prototype code
                  // document.getElementById(SELECTOR_QUALITY_LIST_ID li..) li.className = 'active';
               });

               qualityConteinerBtn.prepend(qualityBtn);
               qualityConteinerBtn.append(listQuality);

               container.prepend(qualityConteinerBtn);

               fillQualityMenu(); // init

               NOVA.videoElement?.addEventListener('loadeddata', fillQualityMenu); // update

               function fillQualityMenu() {
                  if (qualityList = document.getElementById(SELECTOR_QUALITY_LIST_ID)) {
                     qualityList.innerHTML = '';

                     movie_player.getAvailableQualityLevels()
                        .forEach(quality => {
                           const qualityItem = document.createElement('li');
                           if (movie_player.getPlaybackQuality() == quality) qualityItem.className = 'active';
                           // qualityList.innerHTML =
                           //    `<span class="quality-menu-item-text">1080p</span>
                           //    <span class="quality-menu-item-label-badge">HD</span>`;
                           if (qualityData = qualityFormatList[quality]) {
                              qualityItem.textContent = qualityData.label;
                              if (badge = qualityData.badge) {
                                 qualityItem.insertAdjacentHTML('beforeend',
                                    `<span class="quality-menu-item-label-badge">${badge}</span>`);
                              }
                              qualityItem.addEventListener('click', () => {
                                 // console.debug('setPlaybackQuality', quality);
                                 movie_player.setPlaybackQualityRange(quality, quality);
                                 // movie_player.setPlaybackQuality(quality); // Doesn't work
                                 qualityList.innerHTML = ''; // dirty hack (clear list)
                              })
                              qualityList.append(qualityItem);
                           }
                        });
                  }
               }
            }

            if (user_settings.player_buttons_custom_items?.includes('toggle-speed')) {
               const
                  speedBtn = document.createElement('a'),
                  hotkey = user_settings.player_buttons_custom_hotkey_toggle_speed || 'a',
                  defaultRateText = '1x';
               // `<svg viewBox="0 0 36 36" height="100%" width="100%">
               //    <g fill="currentColor">
               //       <path d="m 27.526463,13.161756 -1.400912,2.107062 a 9.1116182,9.1116182 0 0 1 -0.250569,8.633258 H 10.089103 A 9.1116182,9.1116182 0 0 1 22.059491,11.202758h24.166553,9.8018471 A 11.389523,11.389523 0 0 0 8.1301049,25.041029 2.2779046,2.2779046 0 0 0 10.089103,26.179981 H 25.863592 A 2.2779046,2.2779046 0 0 0 27.845369,25.041029 11.389523,11.389523 0 0 0 27.537852,13.150367 Zs16.376119,20.95219 a 2.2779046,2.2779046 0 0 0 3.223235,0h6.446471,-9.669705 -9.669706,6.44647 a 2.2779046,2.2779046 0 0 0 0,3.223235 z" />
               //    </g>
               // </svg>`;

               let rateOrig = {};

               speedBtn.className = `ytp-button ${SELECTOR_BTN_CLASS_NAME}`;
               speedBtn.style.textAlign = 'center';
               speedBtn.style.fontWeight = 'bold';
               speedBtn.innerHTML = defaultRateText;
               speedBtn.title = `Toggle speed to ${defaultRateText} (${hotkey})`;
               // hotkey
               document.addEventListener('keyup', evt => {
                  if (['input', 'textarea'].includes(evt.target.localName) || evt.target.isContentEditable) return;
                  if (evt.key === hotkey) {
                     switchRate();
                  }
               })
               speedBtn.addEventListener('click', switchRate);

               function switchRate() {
                  // restore orig
                  if (Object.keys(rateOrig).length) {
                     playerRate.set(rateOrig);
                     rateOrig = {};
                     speedBtn.innerHTML = defaultRateText;

                  } else { // return default
                     rateOrig = (movie_player && NOVA.videoElement.playbackRate % .25) === 0
                        ? { 'default': movie_player.getPlaybackRate() }
                        : { 'html5': NOVA.videoElement.playbackRate };

                     let resetRate = Object.assign({}, rateOrig); // clone obj
                     resetRate[Object.keys(resetRate)[0]] = 1; // first property of object
                     playerRate.set(resetRate);

                     speedBtn.textContent = rateOrig[Object.keys(rateOrig)[0]] + 'x';
                  }
                  speedBtn.title = `Switch to ${speedBtn.textContent} (${hotkey})`;
                  // console.debug('rateOrig', rateOrig);
               }

               const playerRate = {
                  set(obj) {
                     if (obj.hasOwnProperty('html5') || !movie_player) {
                        NOVA.videoElement.playbackRate = obj.html5;

                     } else {
                        movie_player.setPlaybackRate(obj.default);
                     }
                     // this.saveInSession(obj.html5 || obj.default);
                  },

                  // saveInSession(level = required()) {
                  //    try {
                  //       sessionStorage['yt-player-playback-rate'] = JSON.stringify({
                  //          creation: Date.now(), data: level.toString(),
                  //       })
                  //       // console.log('playbackRate save in session:', ...arguments);

                  //    } catch (err) {
                  //       console.info(`${err.name}: save "rate" in sessionStorage failed. It seems that "Block third-party cookies" is enabled`, err.message);
                  //    }
                  // },
               };

               container.prepend(speedBtn);

               visibilitySwitch(); // init

               NOVA.videoElement?.addEventListener('ratechange', visibilitySwitch); // update #1
               // reset speedBtn state
               NOVA.videoElement?.addEventListener('loadeddata', () => { // update #2
                  rateOrig = {};
                  speedBtn.textContent = defaultRateText;
                  visibilitySwitch();
               });

               function visibilitySwitch() {
                  if (!Object.keys(rateOrig).length) {
                     // speedBtn.style.visibility = /*movie_player.getPlaybackRate() ===*/ NOVA.videoElement.playbackRate === 1 ? 'hidden' : 'visible';
                     speedBtn.style.display = /*movie_player.getPlaybackRate() ===*/ NOVA.videoElement?.playbackRate === 1 ? 'none' : '';
                  }
               }
            }
         });

   },
   options: {
      player_buttons_custom_items: {
         _tagName: 'select',
         label: 'Buttons',
         'label:zh': '纽扣',
         'label:ja': 'ボタン',
         'label:ko': '버튼',
         'label:es': 'Botones',
         'label:pt': 'Botões',
         'label:fr': 'Boutons',
         // 'label:tr': 'Düğmeler',
         'label:de': 'Tasten',
         title: '[Ctrl+Click] to select several',
         'title:zh': '[Ctrl+Click] 选择多个',
         'title:ja': '「Ctrl+Click」して、いくつかを選択します',
         'title:ko': '[Ctrl+Click] 여러 선택',
         'title:es': '[Ctrl+Click] para seleccionar varias',
         'title:pt': '[Ctrl+Click] para selecionar vários',
         'title:fr': '[Ctrl+Click] pour sélectionner plusieurs',
         // 'title:tr': 'Birkaç tane seçmek için [Ctrl+Tıkla]',
         'title:de': '[Ctrl+Click] um mehrere auszuwählen',
         multiple: null, // dont use - selected: true
         required: true, // dont use - selected: true
         size: 4, // = options.length
         options: [
            { label: 'quick quality', value: 'quick-quality', 'label:zh': '质量', 'label:ja': '品質', 'label:ko': '품질', 'label:es': 'calidad', 'label:pt': 'qualidade', 'label:fr': 'qualité', 'label:tr': 'hızlı kalite', 'label:de': 'qualität' },
            { label: 'toggle speed', value: 'toggle-speed', 'label:zh': '切换速度', 'label:ja': 'トグル速度', 'label:ko': '토글 속도', 'label:es': 'alternar velocidad', 'label:pt': 'velocidade de alternância', 'label:fr': 'basculer la vitesse', 'label:tr': 'geçiş hızı', 'label:de': 'geschwindigkeit umschalten' },
            { label: 'screenshot', value: 'screenshot', 'label:zh': '截屏', 'label:ja': 'スクリーンショット', 'label:ko': '스크린샷', 'label:es': 'captura de pantalla', 'label:pt': 'captura de tela', 'label:fr': "capture d'écran", 'label:tr': 'ekran görüntüsü', 'label:de': 'bildschirmfoto' },
            { label: 'Picture-in-Picture', value: 'picture-in-picture'/*, 'label:zh': '', 'label:ja': '', 'label:ko': '', 'label:es': '', 'label:pt': '', 'label:fr': '', 'label:tr': '', 'label:de': ''*/ },
            { label: 'popup', value: 'popup', 'label:zh': '弹出式播放器', 'label:ja': 'ポップアッププレーヤー', 'label:ko': '썸네일', /*'label:es': 'jugadora emergente',*/ 'label:pt': 'jogador pop-up', 'label:fr': 'lecteur contextuel', 'label:tr': 'pop-up oynatıcı', /*'label:de': ''*/ },
            { label: 'rotate', value: 'rotate', 'label:zh': '旋转', 'label:ja': '回転する', 'label:ko': '회전', 'label:es': 'girar', 'label:pt': 'girar', 'label:fr': 'tourner', 'label:tr': 'döndürmek', 'label:de': 'drehen' },
            { label: 'thumbnail', value: 'thumbnail', 'label:zh': '缩略图', 'label:ja': 'サムネイル', 'label:ko': '썸네일', 'label:es': 'miniatura', 'label:pt': 'captura de tela', 'label:fr': 'la vignette', 'label:tr': 'küçük resim', 'label:de': 'bildschirmfoto' },
         ],
      },
      player_buttons_custom_popup_width: {
         _tagName: 'input',
         label: 'Player window size aspect ratio',
         'label:zh': '播放器窗口大小纵横比',
         'label:ja': 'プレーヤーのウィンドウサイズのアスペクト比',
         'label:ko': '플레이어 창 크기 종횡비',
         'label:es': 'Relación de aspecto del tamaño de la ventana del reproductor',
         'label:pt': 'Proporção do tamanho da janela do jogador',
         'label:fr': "Rapport d'aspect de la taille de la fenêtre du lecteur",
         // 'label:tr': 'Oyuncu penceresi boyutu en boy oranı',
         'label:de': 'Seitenverhältnis der Player-Fenstergröße',
         type: 'number',
         title: 'less value - larger size',
         'title:zh': '较小的值 - 较大的尺寸',
         'title:ja': '小さい値-大きいサイズ',
         'title:ko': '더 작은 값 - 더 큰 크기',
         'title:es': 'Valor más pequeño - tamaño más grande',
         'title:pt': 'Valor menor - tamanho maior',
         'title:fr': 'Plus petite valeur - plus grande taille',
         // 'title:tr': 'Daha az değer - daha büyük boyut',
         'title:de': 'Kleiner Wert - größere Größe',
         // title: '',
         placeholder: '1.5-4',
         step: 0.1,
         min: 1.5,
         max: 4,
         value: 2.5,
         'data-dependent': '{"player_buttons_custom_items":["popup"]}',
      },
      player_buttons_custom_hotkey_toggle_speed: {
         _tagName: 'select',
         label: 'Hotkey toggle speed',
         'label:zh': '热键切换速度',
         'label:ja': '速度を切り替えるためのホットボタン',
         'label:ko': '단축키 토글 속도',
         'label:es': 'Velocidad de cambio de teclas de acceso rápido',
         'label:pt': 'Velocidade de alternância da tecla de atalho',
         'label:fr': 'Vitesse de basculement des raccourcis clavier',
         // 'label:tr': 'Kısayol geçiş hızı',
         'label:de': 'Hotkey-Umschaltgeschwindigkeit',
         // title: '',
         options: [
            { label: 'A', value: 'a', selected: true },
            'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
         'data-dependent': '{"player_buttons_custom_items":["toggle-speed"]}',
      },
   }
});
window.nova_plugins.push({
   id: 'video-next-autoplay-disable',
   title: 'Disable autoplay next video',
   'title:zh': '禁用自动播放下一个视频',
   'title:ja': '次の動画の自動再生を無効にする',
   'title:ko': '다음 동영상 자동재생 비활성화',
   'title:es': 'Desactivar la reproducción automática del siguiente video',
   'title:pt': 'Desativar a reprodução automática do próximo vídeo',
   'title:fr': 'Désactiver la lecture automatique de la prochaine vidéo',
   // 'title:tr': 'Sonraki videoyu otomatik oynatmayı devre dışı bırak',
   'title:de': 'Deaktivieren Sie die automatische Wiedergabe des nächsten Videos',
   run_on_pages: 'watch',
   section: 'player',
   // desc: '',
   _runtime: user_settings => {

      // autoplay on: f5=20000
      // autoplay off: f5=30000
      // NOVA.cookie.set('PREF', 'f5=30000'); // Other parameters will be overwritten
      NOVA.cookie.updateParam({ key: 'PREF', param: 'f5', value: 30000 });

      if (user_settings.video_next_autoplay_timeout) {
         // NOVA.waitElement('video')
         //    .then(video => {
         //       // add next-button eventListener - Strategy 1
         //       // video.addEventListener('ended', nextVideoButton); // Doesn't work when rewinding manually
         //       // video.addEventListener('suspend', nextVideoButton); // need test
         //       // auto-close modal - Strategy 1
         //       video.addEventListener('loadstart', Modal_NOVA.close);
         //    });

         // add next-button eventListener - Strategy 2
         NOVA.waitElement('#movie_player')
            .then(() => {
               movie_player.addEventListener('onStateChange', state =>
                  'ENDED' == NOVA.getPlayerState(state) && nextVideoButton());
            });

         function nextVideoButton() {
            if (movie_player.classList.contains('ad-showing')) return; // ad skip

            if (btn = document.body.querySelector('.ytp-next-button')) {
               Modal_NOVA.timeoutNext = setTimeout(() => btn.click(), 1000 * +user_settings.video_next_autoplay_timeout); // click btn after N sec.

               Modal_NOVA.create();
               // auto-close modal - Strategy 2
               document.addEventListener('yt-navigate-start', Modal_NOVA.close, { capture: true, once: true });
            }
         }

         const Modal_NOVA = {
            // notice: document.createElement('div'),

            create() {
               this.notice = document.createElement('div');
               Object.assign(this.notice.style, {
                  position: 'fixed',
                  top: 0,
                  right: '50%',
                  transform: 'translateX(50%)',
                  margin: '50px',
                  'z-index': 9999,
                  'border-radius': '2px',
                  'background-color': 'tomato',
                  'box-shadow': 'rgb(0 0 0 / 50%) 0px 0px 3px',
                  'font-size': '13px',
                  color: '#fff',
                  padding: '10px',
                  cursor: 'pointer',
               });
               this.notice.addEventListener('click', this.close);
               this.notice.innerHTML =
                  `<h4 style="margin:0;">Next video will play after ${NOVA.timeFormatTo.HMS.abbr(user_settings.video_next_autoplay_timeout)}</h4>`
                  + `<div>click to cancel</div>`;
               document.body.append(this.notice);
            },

            close() {
               Modal_NOVA.notice?.remove();
               clearTimeout(Modal_NOVA.timeoutNext);
            },
         };
      }

   },
   options: {
      video_next_autoplay_timeout: {
         _tagName: 'input',
         label: 'Go to next video when time is reached',
         // 'label:zh': '',
         // 'label:ja': '',
         // 'label:ko': '',
         // 'label:es': '',
         // 'label:pt': '',
         // 'label:fr': '',
         // 'label:tr': '',
         // 'label:de': '',
         type: 'number',
         title: 'in seconds',
         placeholder: '1-30',
         step: 1,
         min: 1,
         max: 30,
         value: 5,
      },
   }
});
// for test
// https://www.youtube.com/watch?v=XKa6TpPM70E

// https://www.youtube.com/watch?v=jx9LC2kyfcQ - ad rent block

window.nova_plugins.push({
   id: 'player-control-autohide',
   title: 'Autohide controls on player',
   'title:zh': '播放器上的自动隐藏控件',
   'title:ja': 'プレーヤーのコントロールを自動非表示',
   'title:ko': '플레이어의 자동 숨기기 컨트롤',
   'title:es': 'Ocultar automáticamente los controles en el reproductor',
   'title:pt': 'Auto-ocultar controles no player',
   'title:fr': 'Masque le panneau de contrôle du lecteur',
   // 'title:tr': 'Oynatıcıdaki kontrolleri otomatik gizle',
   'title:de': 'Blendet das Player-Bedienfeld aus',
   run_on_pages: 'watch, -mobile',
   section: 'player',
   desc: 'Hover over it to display it',
   'desc:zh': '将鼠标悬停在它上面以显示它',
   'desc:ja': 'カーソルを合わせると表示されます',
   'desc:ko': '그것을 표시하려면 그 위로 마우스를 가져갑니다',
   'desc:es': 'Coloca el cursor sobre él para mostrarlo',
   'desc:pt': 'Passe o mouse sobre ele para exibi-lo',
   // 'desc:fr': "Survolez-le pour l'afficher",
   'desc:tr': 'Görüntülemek için üzerine gelin',
   'desc:de': 'Bewegen Sie den Mauszeiger darüber, um es anzuzeigen',
   _runtime: user_settings => {

      NOVA.css.push(
         `.ytp-chrome-bottom {
            opacity: 0;
         }
         .ytp-chrome-bottom:hover {
            opacity: 1;
         }`);

   },
});
window.nova_plugins.push({
   id: 'disable-video-cards',
   title: 'Hide End-Screen info cards',
   // 'title:zh': '',
   // 'title:ja': '',
   // 'title:ko': '',
   // 'title:es': '',
   // 'title:pt': '',
   // 'title:fr': '',
   // 'title:tr': '',
   // 'title:de': '',
   run_on_pages: 'watch, embed, -mobile',
   section: 'player',
   // desc: "turn off 'card' in https://www.youtube.com/account_playback",
   desc: 'remove the annoying stuff at the end of the videos',
   _runtime: user_settings => {

      switch (NOVA.currentPage) {
         case 'watch':
            NOVA.css.push(
               `[class^="ytp-ce-"],
               [class^="ytp-paid-content-overlay"],
               branding-img { display: none !important; }`);
            break;

         case 'embed':
            // https://stackoverflow.com/questions/52887444/hide-more-videos-within-youtube-iframe-when-stop-video
            NOVA.css.push('.ytp-scroll-min.ytp-pause-overlay { display: none !important; }');
            break;
      }

   },
});
window.nova_plugins.push({
   id: 'player-resume-playback',
   title: 'Resume playback time position',
   'title:zh': '恢复播放时间状态',
   'title:ja': '再生時間の位置を再開します',
   'title:ko': '재생 시간 위치 재개',
   'title:es': 'Reanudar posición de tiempo de reproducción',
   'title:pt': 'Retomar a posição do tempo de reprodução',
   'title:fr': 'Reprendre la position de temps de lecture',
   // 'title:tr': 'Oynatma süresi konumunu devam ettir',
   'title:de': 'Wiedergabezeitposition fortsetzen',
   run_on_pages: 'watch, embed',
   section: 'player',
   desc: 'On page reload - resume playback',
   'desc:zh': '在页面重新加载 - 恢复播放',
   'desc:ja': 'ページがリロードされると、再生が復元されます',
   'desc:ko': '페이지 새로고침 시 - 재생 재개',
   'desc:es': 'En la recarga de la página - reanudar la reproducción',
   'desc:pt': 'Recarregar na página - retomar a reprodução',
   // 'desc:fr': 'Lors du rechargement de la page - reprendre la lecture',
   'desc:tr': 'Sayfayı yeniden yükle - oynatmaya devam et',
   'desc:de': 'Auf Seite neu laden - Wiedergabe fortsetzen',
   _runtime: user_settings => {
      // fix - Failed to read the 'sessionStorage' property from 'Window': Access is denied for this document.
      if (NOVA.currentPage == 'embed' && !window.sessionStorage) return;

      // TODO adSkip alt. - add comparison by duration. Need stream test
      const
         CACHE_PREFIX = 'resume-playback-time',
         getCacheName = () => CACHE_PREFIX + ':' + (document.getElementById('movie_player')?.getVideoData().video_id || NOVA.queryURL.get('v'));

      let cacheName = getCacheName(); // for optimization

      NOVA.waitElement('video')
         .then(video => {
            resumePlayback(video);

            video.addEventListener('loadeddata', resumePlayback.bind(video));

            video.addEventListener('timeupdate', savePlayback.bind(video));

            // embed dont support "t=" parameter
            if (user_settings.player_resume_playback_url_mark && NOVA.currentPage != 'embed') {
               // ignore if initialized with a "t=" parameter
               if (NOVA.queryURL.has('t')) {
                  document.addEventListener('yt-navigate-start',
                     connectSaveStateInURL.bind(video), { capture: true, once: true });

               } else {
                  connectSaveStateInURL.apply(video);
               }
            }
         });

      function savePlayback() {
         // ad skip
         if (this.currentTime > 5 && this.duration > 30 && !movie_player.classList.contains('ad-showing')) {
            // console.debug('save progress time', this.currentTime);
            sessionStorage.setItem(cacheName, ~~this.currentTime);
            // new URL(location.href).searchParams.set('t', ~~this.currentTime); // url way
         }
      }

      function resumePlayback() {
         if (NOVA.queryURL.has('t')) return;
         cacheName = getCacheName(); // for optimization

         if ((time = +sessionStorage.getItem(cacheName))
            && (time < (this.duration - 1)) // fix for playlist
         ) {
            // console.debug('resumePlayback', `${time}/${this.duration}`);
            this.currentTime = time;
         }
      }

      // function resumePlayback() {
      //    if (!isNaN(this.duration) && this.currentTime < this.duration) {
      //       window.location.hash = "t=" + this.currentTime;
      //    }
      // }

      function connectSaveStateInURL() {
         const changeUrl = (new_url = required()) => window.history.replaceState(null, null, new_url);
         let delaySaveOnPauseURL; // fix glitch update url when rewinding video
         // save
         this.addEventListener('pause', () => {
            if (this.currentTime < (this.duration - 1) && this.currentTime > 5 && this.duration > 10) { // fix video ended
               delaySaveOnPauseURL = setTimeout(() => {
                  changeUrl(NOVA.queryURL.set({ 't': ~~this.currentTime + 's' }));
               }, 100); // 100ms
            }
         })
         // clear
         this.addEventListener('play', () => {
            if (typeof delaySaveOnPauseURL === 'number') clearTimeout(delaySaveOnPauseURL);

            if (NOVA.queryURL.has('t')) changeUrl(NOVA.queryURL.remove('t'));
         });
      }

   },
   options: {
      player_resume_playback_url_mark: {
         _tagName: 'input',
         label: 'Mark time in url when paused',
         'label:zh': '暂停时在 url 中节省时间',
         'label:ja': '一時停止したときにURLで時間を節約する',
         'label:ko': '일시 중지 시 URL에 시간 표시',
         'label:es': 'Marcar tiempo en url cuando está en pausa',
         'label:pt': 'Marcar tempo no URL quando pausado',
         'label:fr': "Marquer l'heure dans l'url en pause",
         // 'label:tr': "Duraklatıldığında zamanı url'de işaretleyin",
         'label:de': 'Zeit in URL markieren, wenn pausiert',
         type: 'checkbox',
         title: 'update ?t=',
      },
   }
});
window.nova_plugins.push({
   id: 'player-hotkeys-focused',
   title: 'Player hotkeys always active',
   'title:zh': '播放器热键始终处于活动状态',
   'title:ja': 'プレーヤーのホットキーは常にアクティブです',
   'title:ko': '플레이어 단축키는 항상 활성화되어 있습니다',
   'title:es': 'Teclas de acceso rápido del jugador siempre activas',
   'title:pt': 'Teclas de atalho do jogador sempre ativas',
   'title:fr': 'Les raccourcis clavier du joueur sont toujours actifs',
   // 'title:tr': 'Oyuncu kısayol tuşları her zaman etkin',
   'title:de': 'Player-Hotkeys immer aktiv',
   run_on_pages: 'watch, -mobile',
   section: 'player',
   // desc: 'Player hotkeys always active【SPACE/F】etc.',
   _runtime: user_settings => {

      document.addEventListener('keydown', ({ target }) => {
         // movie_player.contains(document.activeElement) // Dont use! stay overline
         if (['input', 'textarea'].includes(target.localName) || target.isContentEditable // text edit field
         ) return;

         // NOVA.videoElement?.focus();
         movie_player.focus();
         // document.activeElement.style.border = '2px solid red'; // mark for test
         // console.debug('active element', target.localName);
      });

   },
});
window.nova_plugins.push({
   id: 'player-disable-fullscreen-wheel',
   title: 'Disable player scrolling in fullscreen mode',
   'title:zh': '禁用全屏滚动',
   'title:ja': 'フルスクリーンスクロールを無効にする',
   'title:ko': '전체 화면 스크롤 비활성화',
   'title:es': 'Desactivar el desplazamiento a pantalla completa',
   'title:pt': 'Desabilitar rolagem em tela cheia',
   'title:fr': 'Désactiver le défilement plein écran',
   // 'title:tr': 'Tam ekran kaydırmayı devre dışı bırak',
   'title:de': 'Deaktivieren Sie das Scrollen im Vollbildmodus',
   run_on_pages: 'watch',
   section: 'player',
   // desc: '',
   _runtime: user_settings => {

      // hide button
      NOVA.css.push(`.ytp-fullerscreen-edu-button { display: none !important; }`);

      document.addEventListener('fullscreenchange', () => {
         document.fullscreenElement
            ? document.addEventListener('wheel', lockscroll, { passive: false })
            : document.removeEventListener('wheel', lockscroll)
      }
      );

      function lockscroll(evt) {
         // console.debug('fullscreenElement:', document.fullscreenElement);
         evt.preventDefault();
      }

      // document.addEventListener('wheel', evt => {
      //    if (document.fullscreen || movie_player.isFullscreen()) {
      //       // console.debug('fullscreenElement:', document.fullscreenElement);
      //       evt.preventDefault();
      //       // movie_player.scrollIntoView({behavior: 'instant', block: 'end', inline: 'nearest'});
      //    }
      // }, { passive: false });

   },
});
// for test:
// https://www.youtube.com/playlist?list=WL
// https://www.youtube.com/watch?v=G134f9wUGcU&list=PLVaR5VNkhu5533wzRj0W0gfXExZ0srdjY - short and has [Private video]
// https://www.youtube.com/watch?v=Y07--9_sLpA&list=OLAK5uy_nMilHFKO3dZsuNgVWmEKDZirwXRXMl9yM - hidden playlist conteiner
// https://www.youtube.com/playlist?list=PLJP5_qSxMbkLzx-XiaW0U8FcpYGgwlh5s -simple

window.nova_plugins.push({
   id: 'playlist-duration',
   title: 'Show playlist duration',
   'title:zh': '显示播放列表持续时间',
   'title:ja': 'プレイリストの期間を表示',
   'title:ko': '재생목록 재생시간 표시',
   'title:es': 'Mostrar duración de la lista de reproducción',
   'title:pt': 'Mostrar duração da lista de reprodução',
   'title:fr': 'Afficher la durée de la liste de lecture',
   // 'title:tr': 'Oynatma listesi süresini göster',
   'title:de': 'Wiedergabelistendauer anzeigen',
   run_on_pages: 'watch, playlist, -mobile',
   restart_on_transition: true,
   section: 'sidebar',
   // desc: '',
   _runtime: user_settings => {

      const
         SELECTOR_ID = 'nova-playlist-duration',
         // CACHE_PREFIX = SELECTOR_ID + ':',
         // STORE_NAME = CACHE_PREFIX + playlistId,
         playlistId = NOVA.queryURL.get('list');

      if (!playlistId) return;

      switch (NOVA.currentPage) {
         case 'playlist':
            NOVA.waitElement('#stats yt-formatted-string:first-child')
               .then(el => {
                  if (duration = getPlaylistDuration()) {
                     insertToHTML({ 'container': el, 'text': duration });

                  } else {
                     // getPlaylistDurationFromThumbs()
                     getPlaylistDurationFromThumbnails({
                        'items_selector': '#primary .ytd-thumbnail-overlay-time-status-renderer:not(:empty)',
                     })
                        .then(duration => insertToHTML({ 'container': el, 'text': duration }));
                  }

                  function getPlaylistDuration() {
                     // if (storage = sessionStorage.getItem(STORE_NAME)) {
                     //    // console.debug(`get from cache [${CACHE_PREFIX + playlistId}]`, storage);
                     //    return storage;
                     // }

                     const vids_list = (document.body.querySelector('ytd-app')?.data?.response || window.ytInitialData)
                        .contents.twoColumnBrowseResultsRenderer
                        ?.tabs[0].tabRenderer?.content?.sectionListRenderer
                        ?.contents[0].itemSectionRenderer
                        ?.contents[0].playlistVideoListRenderer?.contents;

                     const duration = vids_list?.reduce((acc, vid) => acc + (isNaN(vid.playlistVideoRenderer?.lengthSeconds) ? 0 : parseInt(vid.playlistVideoRenderer.lengthSeconds)), 0);

                     if (duration) return outFormat(duration);
                  }
               });
            break;

         case 'watch':
            NOVA.waitElement('#secondary .index-message-wrapper')
               .then(el => {
                  const waitPlaylist = setInterval(() => {
                     const playlistLength = movie_player.getPlaylist()?.length;

                     let vids_list = document.body.querySelector('ytd-watch, ytd-watch-flexy')
                        ?.data?.contents?.twoColumnWatchNextResults?.playlist?.playlist?.contents
                        // let vids_list = window.ytInitialData.contents?.twoColumnWatchNextResults?.playlist?.playlist?.contents // not updated after page transition!
                        .filter(i => i.playlistPanelVideoRenderer?.hasOwnProperty('videoId')); // filter hidden

                     console.assert(vids_list?.length === playlistLength, 'playlist loading:', vids_list?.length + '/' + playlistLength);

                     if (vids_list?.length && playlistLength && vids_list?.length === playlistLength) {
                        clearInterval(waitPlaylist);

                        if (duration = getPlaylistDuration(vids_list)) {
                           insertToHTML({ 'container': el, 'text': duration });

                        } else if (!user_settings.playlist_duration_progress_type) { // this method ignores progress
                           getPlaylistDurationFromThumbnails({
                              'container': document.body.querySelector('#secondary #playlist'),
                              'items_selector': '#playlist-items #unplayableText[hidden]',
                           })
                              // getPlaylistDurationFromThumbs({
                              //    'container': document.body.querySelector('#secondary #playlist'),
                              // })
                              .then(duration => insertToHTML({ 'container': el, 'text': duration }));
                        }
                     }
                  }, 1000); // 1 sec

                  function getPlaylistDuration(vids_list = []) {
                     // console.log('getPlaylistDuration', ...arguments);

                     // if (!user_settings.playlist_duration_progress_type && (storage = sessionStorage.getItem(STORE_NAME))) {
                     //    // console.debug(`get from cache [${CACHE_PREFIX + playlistId}]`, storage);
                     //    return storage;
                     // }

                     // let vids_list = document.body.querySelector('ytd-watch, ytd-watch-flexy')
                     // ?.data?.contents?.twoColumnWatchNextResults?.playlist?.playlist?.contents || [];

                     // alt if current "playingIdx" always one step behind
                     // const
                     //    videoId = movie_player.getVideoData().video_id || NOVA.queryURL.get('v'),
                     //    playingIdx2 = vids_list?.findIndex(c => c.playlistPanelVideoRenderer.videoId == videoId);
                     // console.assert(playingIdx == playingIdx2, 'playingIdx diff:', playingIdx + '/' + playingIdx2);
                     // if (playingIdx !== playingIdx2) alert(1)

                     const playingIdx = movie_player.getPlaylistIndex() || vids_list?.findIndex(c => c.playlistPanelVideoRenderer.selected)
                     let total;

                     switch (user_settings.playlist_duration_progress_type) {
                        case 'done':
                           total = getDurationFromList(vids_list);
                           vids_list.splice(playingIdx);
                           // console.debug('done vids_list.length:', vids_list.length);
                           break;

                        case 'left':
                           total = getDurationFromList(vids_list);
                           vids_list.splice(0, playingIdx);
                           // console.debug('left vids_list.length:', vids_list.length);
                           break;

                        // case 'total': // skiping
                     }

                     if ((duration = getDurationFromList(vids_list)) // disallow set zero
                        || (duration === 0 && user_settings.playlist_duration_progress_type) // allow set zero if use playlist_duration_progress_type
                     ) {
                        return outFormat(duration, total);
                     }

                     function getDurationFromList(arr) {
                        return [...arr]
                           .filter(e => e.playlistPanelVideoRenderer?.thumbnailOverlays?.length) // filter [Private video]
                           .flatMap(e => (time = e.playlistPanelVideoRenderer.thumbnailOverlays[0].thumbnailOverlayTimeStatusRenderer?.text.simpleText)
                              ? NOVA.timeFormatTo.hmsToSec(time) : [])
                           .reduce((acc, time) => acc + time, 0);
                     }
                  }
               });
            break;
      }

      function getPlaylistDurationFromThumbnails({ items_selector = required(), container }) {
         console.log('thumbnails_method', ...arguments);
         if (container && !(container instanceof HTMLElement)) {
            return console.error('container not HTMLElement:', container);
         }

         return new Promise(resolve => {
            let forcePlaylistRun = false;
            const waitThumbnails = setInterval(() => {
               const
                  playlistLength = document.body.querySelector('ytd-player')?.player_?.getPlaylist()?.length || document.body.querySelectorAll(items_selector)?.length,
                  timeStampList = (container || document.body)
                     .querySelectorAll('.ytd-thumbnail-overlay-time-status-renderer:not(:empty)'),
                  duration = getTotalTime(timeStampList);

               console.assert(timeStampList.length === playlistLength, 'playlist loading:', timeStampList.length + '/' + playlistLength);

               if (+duration && timeStampList.length
                  && (timeStampList.length === playlistLength || forcePlaylistRun)
               ) {
                  clearInterval(waitThumbnails);
                  resolve(outFormat(duration));

               } else if (!forcePlaylistRun) { // set force calc duration
                  setTimeout(() => forcePlaylistRun = true, 1000 * 3); // 3sec
               }

            }, 500); // 500ms
         });

         function getTotalTime(nodes) {
            // console.debug('getTotalTime', ...arguments);
            return [...nodes]
               .map(e => NOVA.timeFormatTo.hmsToSec(e.textContent))
               .filter(t => !isNaN(+t)) // filter PREMIERE
               .reduce((acc, time) => acc + time, 0);
         }
      }

      function outFormat(duration = 0, total) {
         // console.log('outFormat', ...arguments);
         let outArr = [];
         // time
         outArr.push(NOVA.timeFormatTo.HMS.digit(duration));
         // pt
         if (user_settings.playlist_duration_percentage && total) {
            outArr.push(`(${~~(duration * 100 / total) + '%'})`);
         }
         // progress type title
         if (user_settings.playlist_duration_progress_type) {
            outArr.push(user_settings.playlist_duration_progress_type);
         }

         return ' - ' + outArr.join(' ');
      }

      function insertToHTML({ text = '', container = required() }) {
         // console.debug('insertToHTML', ...arguments);
         if (!(container instanceof HTMLElement)) return console.error('container not HTMLElement:', container);

         (document.getElementById(SELECTOR_ID) || (function () {
            const el = document.createElement('span');
            el.id = SELECTOR_ID;
            // el.className = 'style-scope ytd-playlist-sidebar-primary-info-renderer';
            // el.style.display = 'inline-block';
            // el.style.margin = '0 .5em';
            return container.appendChild(el);
         })())
            .textContent = ' ' + text;

         // sessionStorage.setItem(STORE_NAME, text); // save in sessionStorage
      }

   },
   options: {
      playlist_duration_progress_type: {
         _tagName: 'select',
         label: 'Time display mode',
         'label:zh': '时间显示方式',
         'label:ja': '時間表示モード',
         'label:ko': '시간 표시 모드',
         'label:es': 'Modo de visualización de la hora',
         'label:pt': 'Modo de exibição de tempo',
         'label:fr': "Mode d'affichage de l'heure",
         // 'label:tr': 'Zaman görüntüleme modu',
         'label:de': 'Zeitanzeigemodus',
         options: [
            { label: 'done', value: 'done', 'label:zh': '结束', 'label:ja': '終わり', 'label:ko': '보았다', 'label:es': 'hecho', 'label:pt': 'feito', 'label:fr': 'regardé', 'label:tr': 'tamamlamak', 'label:de': 'fertig' },
            { label: 'left', value: 'left', 'label:zh': '剩下', 'label:ja': '残り', 'label:ko': '왼쪽', 'label:es': 'izquierda', 'label:pt': 'deixou', 'label:fr': 'À gauche', 'label:tr': 'sola', 'label:de': 'links' },
            { label: 'total', value: false, selected: true, 'label:zh': '全部的', 'label:ja': '全て', 'label:ko': '총', /*'label:es': '','label:pt': '',*/  'label:fr': 'le total', 'label:tr': 'toplam', 'label:de': 'gesamt' },
         ],
      },
      playlist_duration_percentage: {
         _tagName: 'input',
         label: 'Add percentage',
         'label:zh': '显示百分比',
         'label:ja': 'パーセンテージを表示',
         'label:ko': '백분율 추가',
         'label:es': 'Agregar porcentaje',
         'label:pt': 'Adicionar porcentagem',
         'label:fr': 'Ajouter un pourcentage',
         // 'label:tr': 'Yüzde ekle',
         'label:de': 'Prozent hinzufügen',
         type: 'checkbox',
      },
   }
});
window.nova_plugins.push({
   id: 'livechat-visibility',
   title: 'Hide live chat',
   'title:zh': '隐藏实时聊天',
   'title:ja': 'ライブチャットを非表示',
   'title:ko': '실시간 채팅 숨기기',
   'title:es': 'Ocultar chat en vivo',
   'title:pt': 'Ocultar livechat',
   'title:fr': 'Masquer le chat en direct',
   // 'title:tr': 'Canlı sohbeti gizle',
   'title:de': 'Livechat ausblenden',
   run_on_pages: 'watch, -mobile',
   // restart_on_transition: true, // maybe the shutdown is wrong. But all for the sake of optimization
   section: 'sidebar',
   // desc: '',
   _runtime: user_settings => {

      if (user_settings.livechat_visibility_mode == 'disable') {
         NOVA.waitElement('#chat')
            .then(chat => chat.remove());

      } else {
         NOVA.waitElement('#chat:not([collapsed]) #show-hide-button #button')
            .then(btn => btn.click());
      }

   },
   options: {
      livechat_visibility_mode: {
         _tagName: 'select',
         label: 'Mode',
         'label:zh': '模式',
         'label:ja': 'モード',
         'label:ko': '방법',
         'label:es': 'Modo',
         'label:pt': 'Modo',
         // 'label:fr': 'Mode',
         // 'label:tr': 'Mod',
         'label:de': 'Modus',
         options: [
            { label: 'collapse', value: 'hide', selected: true },
            { label: 'remove', value: 'disable' },
         ],
      },
   }
});
window.nova_plugins.push({
   id: 'playlist-reverse',
   title: 'Add playlist reverse order button',
   'title:zh': '添加按钮反向播放列表顺序',
   'title:ja': 'ボタンの逆プレイリストの順序を追加',
   'title:ko': '버튼 역 재생 목록 순서 추가',
   'title:es': 'Agregar orden de lista de reproducción inverso',
   'title:pt': 'Adicionar ordem inversa da lista de reprodução',
   'title:fr': 'Ajouter un ordre de lecture inversé',
   // 'title:tr': 'Ekle düğmesi ters çalma listesi sırası',
   'title:de': 'Umgekehrte Playlist-Reihenfolge hinzufügen',
   run_on_pages: 'watch, playlist, -mobile',
   // restart_on_transition: true,
   section: 'sidebar',
   // desc: '',
   _runtime: user_settings => {

      const
         SELECTOR_BTN_ID = 'nova-playlist-reverse-button',
         SELECTOR_BTN = '#' + SELECTOR_BTN_ID, // for css
         CLASS_NAME_ACTIVE = 'nova-reverse-on';

      let playlistReversed;

      // init reverseBtn style
      NOVA.css.push(
         SELECTOR_BTN + ` {
            background: none;
            border: 0;
            margin-left: 8px;
         }

         yt-icon-button {
            width: 40px;
            height: 40px;
            padding: 10px;
         }

         ${SELECTOR_BTN} svg {
            fill: white;
            fill: var(--yt-spec-text-secondary);
         }

         ${SELECTOR_BTN}:hover svg { fill: #66afe9; }

         ${SELECTOR_BTN}:active svg,
         ${SELECTOR_BTN}.${CLASS_NAME_ACTIVE} svg { fill: #2196f3; }`);

      document.addEventListener('yt-navigate-finish', () => {
         if (!NOVA.queryURL.has('list')/* || !movie_player?.getPlaylistId()*/) return;
         insertButton();
         reverseControl(); // add events
      });

      insertButton();

      function insertButton() {
         NOVA.waitElement('#secondary #playlist #playlist-action-menu #top-level-buttons-computed')
            .then(e => addReverseBtn(e));

         function addReverseBtn(container = required()) {
            if (!(container instanceof HTMLElement)) return console.error('container not HTMLElement:', container);

            document.getElementById(SELECTOR_BTN_ID)?.remove(); // clear old

            const reverseBtn = document.createElement('div');
            if (playlistReversed) reverseBtn.className = CLASS_NAME_ACTIVE;
            reverseBtn.id = SELECTOR_BTN_ID;
            reverseBtn.title = 'Reverse playlist order';
            reverseBtn.innerHTML =
               `<yt-icon-button>
                  <svg x="0px" y="0px" viewBox="0 0 381.399 381.399" xml:space="preserve" height="100%" width="100%" version="1.1">
                     <g>
                     <path d="M233.757,134.901l-63.649-25.147v266.551c0,2.816-2.286,5.094-5.104,5.094h-51.013c-2.82,0-5.099-2.277-5.099-5.094 V109.754l-63.658,25.147c-2.138,0.834-4.564,0.15-5.946-1.669c-1.389-1.839-1.379-4.36,0.028-6.187L135.452,1.991 C136.417,0.736,137.91,0,139.502,0c1.576,0,3.075,0.741,4.041,1.991l96.137,125.061c0.71,0.919,1.061,2.017,1.061,3.109 c0,1.063-0.346,2.158-1.035,3.078C238.333,135.052,235.891,135.735,233.757,134.901z M197.689,378.887h145.456v-33.62H197.689 V378.887z M197.689,314.444h145.456v-33.622H197.689V314.444z M197.689,218.251v33.619h145.456v-33.619H197.689z"/>
                  </g>
                  </svg>
               </yt-icon-button>`;
            reverseBtn.addEventListener('click', () => {
               reverseBtn.classList.toggle(CLASS_NAME_ACTIVE);
               playlistReversed = !playlistReversed;

               if (playlistReversed) {
                  reverseControl();
                  // movie_player.updatePlaylist();
               } else {
                  location.reload(); // disable reverse
               }
            });
            container.append(reverseBtn);
         }
      }


      function reverseControl() {
         if (!playlistReversed) return;

         // auto next click
         NOVA.videoElement?.addEventListener('ended', () =>
            playlistReversed && movie_player.previousVideo(), { capture: true, once: true });

         // update UI
         // Strategy 1
         reverseElement(document.body.querySelector('#secondary #playlist #items.playlist-items, ytm-playlist lazy-list'));
         scrollToElement(document.body.querySelector('#secondary #playlist-items[selected], ytm-playlist .item[selected=true]'));
         // Strategy 2: scroll doesn't work
         // NOVA.css.push(
         //    `#playlist #items.playlist-items {
         //       display: flex;
         //       flex-direction: column-reverse;
         //    }`);

         updateNextButton();


         function updateNextButton() {
            const
               nextItem = document.body.querySelector('#secondary #playlist [selected] + * a'),
               nextURL = nextItem?.querySelector('a')?.href;

            if (!nextURL) return;

            if (next_button = document.body.querySelector('.ytp-next-button')) {
               next_button.href = nextURL;
               next_button.dataset.preview = nextItem.querySelector('img').src;
               next_button.dataset.tooltipText = nextItem.querySelector('#video-title').textContent;
            }
            if (playlistManager = document.body.querySelector('yt-playlist-manager')?.autoplayData.sets[0].nextButtonVideo) {
               playlistManager.commandMetadata.webCommandMetadata.url = nextURL.replace(location.origin, '');
               playlistManager.watchEndpoint.videoId = NOVA.queryURL.get('v', nextURL);
            }
         }

         function reverseElement(container = required()) {
            if (!(container instanceof HTMLElement)) return console.error('container not HTMLElement:', container);
            container.append(...Array.from(container.childNodes).reverse());
         }

         function scrollToElement(targetEl = required()) {
            if (!(targetEl instanceof HTMLElement)) return console.error('targetEl not HTMLElement:', targetEl);
            const container = targetEl.parentElement;
            container.scrollTop = targetEl.offsetTop - container.offsetTop;
         }
      }

   },
});
window.nova_plugins.push({
   id: 'related-visibility',
   title: 'Hide related section',
   'title:zh': '隐藏相关部分',
   'title:ja': '関連セクションを非表示',
   'title:ko': '관련 섹션 숨기기',
   'title:es': 'Ocultar sección relacionada',
   'title:pt': 'Ocultar seção relacionada',
   'title:fr': 'Masquer la section associée',
   // 'title:tr': 'İlgili bölümü gizle',
   'title:de': 'Zugehörigen Abschnitt ausblenden',
   run_on_pages: 'watch, -mobile',
   section: 'sidebar',
   // desc: '',
   _runtime: user_settings => {

      NOVA.preventVisibilityElement({
         selector: '#secondary #related, ytm-item-section-renderer[section-identifier="related-items"]',
         title: 'related',
         remove: user_settings.related_visibility_mode == 'disable' ? true : false,
      });

   },
   options: {
      related_visibility_mode: {
         _tagName: 'select',
         label: 'Mode',
         'label:zh': '模式',
         'label:ja': 'モード',
         'label:ko': '방법',
         'label:es': 'Modo',
         'label:pt': 'Modo',
         // 'label:fr': 'Mode',
         // 'label:tr': 'Mod',
         'label:de': 'Modus',
         options: [
            { label: 'collapse', value: 'hide', selected: true },
            { label: 'remove', value: 'disable' },
         ],
      },
   }
});
const Plugins = {
   list: [
      // 'plugins/_blank_plugin.js', // for example

      'player/ad-skip-button.js',
      'player/speed.js',
      'player/volume.js',
      'player/hud.js',
      'player/quality.js',
      'player/autopause.js', // after quality.js
      'player/theater-mode.js',
      'player/pause-background.js',
      'player/fullscreen-on-playback.js',
      'player/control-autohide.js',
      'player/hotkeys-focused.js',
      'player/pin.js',
      'player/time-jump.js',
      'player/time-remaining.js',
      'player/float-progress-bar.js',
      'player/no-sleep.js',
      'player/loop.js',
      'player/resume-playback.js',
      // 'player/-thumb-pause.js',
      'player/buttons-custom.js',
      'player/subtitle.js',
      // 'player/miniplayer-disable.js',
      // 'player/stop.js', // incompatible with quality.js
      'player/unblocker.js',
      'player/next-autoplay.js',
      'player/video-cards.js',
      'player/fullscreen-scroll.js',

      'other/thumbs-clear.js',
      'other/thumbs-title-normalize.js',
      // 'other/thumbs-rating.js',
      'other/thumbs-watched.js', // outdated
      'other/channel-tab.js',
      'other/dark-theme.js',
      'other/title-time.js',
      'other/scroll-to-top.js',
      'other/search-filter.js',
      'other/shorts-redirect.js',
      'other/shorts-hide.js',
      'other/premiere-hide.js',
      'other/thumbnails-mix-hide.js',
      'other/stream-hide.js',
      'other/playlist-rss.js',

      'details/videos-count.js',
      'details/description-expand.js',
      'details/description-popup.js',
      'details/timestamps-scroll.js',
      'details/redirect-clear.js',
      // 'details/quick-menu.js',

      'comments/visibility.js',
      'comments/square-avatars.js',
      'comments/popup.js',
      'comments/expand.js',

      'sidebar/related-visibility.js',
      'sidebar/playlist-duration.js',
      'sidebar/playlist-reverse.js',
      'sidebar/livechat.js',

      'header/short.js',
      'header/unfixed.js',
      // 'header/logo.js',
   ],

   load(list) {
      (list || this.list)
         .forEach(plugin => {
            try {
               this.injectScript(chrome.runtime.getURL('/plugins/' + plugin));
            } catch (error) {
               console.error(`plugin loading failed: ${plugin}\n${error.stack}`);
            }
         })
   },

   injectScript(source = required()) {
      const script = document.createElement('script');

      if (source.endsWith('.js')) {
         script.src = source;
         // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#attr-defer:~:text=defer,-This
         script.defer = true;
         // script.async = true;

      } else {
         script.textContent = source.toString();
         // script.src = "data:text/plain;base64," + btoa(source);
         // script.src = 'data:text/javascript,' + encodeURIComponent(source)
      }

      (document.head || document.documentElement).append(script);

      script.onload = () => {
         // console.log('script loaded:', script.src || script.textContent.substr(0, 100));
         script.remove(script); // Remove <script> node after injectScript runs.
      };
   },

   run: ({ user_settings, app_ver }) => {
      // console.debug('plugins_executor', ...arguments);
      if (!window.nova_plugins?.length) return console.error('nova_plugins empty', window.nova_plugins);
      if (!user_settings) return console.error('user_settings empty', user_settings);

      NOVA.currentPage = (function () {
         const [page, channelTab] = location.pathname.split('/').filter(Boolean);
         return (['channel', 'c', 'user'].includes(page)
            // fix non-standard link - https://www.youtube.com/pencilmation/videos
            || ['featured', 'videos', 'playlists', 'community', 'channels', 'about'].includes(channelTab)
         ) ? 'channel' : page || 'home';
      })();
      // console.debug('NOVA.currentPage', NOVA.currentPage);

      const isMobile = location.host == 'm.youtube.com';

      let logTableArray = [],
         logTableStatus,
         logTableTime;

      // console.groupCollapsed('plugins status');

      window.nova_plugins?.forEach(plugin => {
         const pagesAllowList = plugin?.run_on_pages?.split(',').map(p => p.trim().toLowerCase()).filter(Boolean);
         // reset logTable
         logTableTime = 0;
         logTableStatus = false;

         if (!pluginChecker(plugin)) {
            console.error('Plugin invalid\n', JSON.stringify(plugin));
            alert('Plugin invalid: ' + plugin?.id);
            logTableStatus = 'INVALID';

         } else if (plugin.was_init && !plugin.restart_on_transition) {
            logTableStatus = 'skiped';

         } else if (!user_settings.hasOwnProperty(plugin.id)) {
            logTableStatus = 'off';

         } else if (
            (
               pagesAllowList?.includes(NOVA.currentPage)
               || (pagesAllowList?.includes('all') && !pagesAllowList?.includes('-' + NOVA.currentPage))
            )
            && (!isMobile || (isMobile && !pagesAllowList?.includes('-mobile')))
         ) {
            try {
               const startTableTime = performance.now();
               plugin.was_init = true;
               plugin._runtime(user_settings);
               // plugin._runtime.apply(plugin, [user_settings])
               logTableTime = (performance.now() - startTableTime).toFixed(2);
               logTableStatus = true;

            } catch (err) {
               console.groupEnd('plugins status'); // out-of-group display
               console.error(`[ERROR PLUGIN] ${plugin.id}\n${err.stack}\n\nPlease report the bug: https://github.com/raingart/Nova-YouTube-extension/issues/new?body=` + encodeURIComponent(app_ver + ' | ' + navigator.userAgent));

               if (user_settings.report_issues && _pluginsCaptureException) {
                  _pluginsCaptureException({
                     'trace_name': plugin.id,
                     'err_stack': err.stack,
                     'app_ver': app_ver,
                     'confirm_msg': `ERROR in Nova YouTube™\n\nCrash plugin: "${plugin.title}"\nPlease report the bug or disable the plugin\n\nOpen popup to report the bug?`,
                  });
               }

               console.groupCollapsed('plugins status'); // resume console group
               logTableStatus = 'ERROR';
            }
         }

         logTableArray.push({
            'launched': logTableStatus,
            'name': plugin?.id,
            'time init (ms)': logTableTime,
         });
      });
      console.table(logTableArray);
      console.groupEnd('plugins status');

      function pluginChecker(plugin) {
         const result = plugin?.id && plugin.run_on_pages && 'function' === typeof plugin._runtime;
         if (!result) {
            console.error('plugin invalid:\n', {
               'id': plugin?.id,
               'run_on_pages': plugin?.run_on_pages,
               '_runtime': 'function' === typeof plugin?._runtime,
            });
         }
         return result;
      }
   },
}
console.log('%c /* %s */', 'color:#0096fa; font-weight:bold;', GM_info.script.name + ' v.' + GM_info.script.version);
const
   optionsPage = 'https://raingart.github.io/options.html', // ?tabs=tab-plugins
   configStoreName = 'user_settings',
   fix_GM_getValue = v => v === 'undefined' ? undefined : v, // for Tampermonkey
   user_settings = fix_GM_getValue(GM_getValue(configStoreName)) || {};

// updateKeyStorage
const keyRenameTemplate = {
   // 'oldKey': 'newKey',
   'video-unblocker': 'video-unblock-region',
   'disable-page-sleep': 'disable-player-sleep-mode',
}
for (const oldKey in user_settings) {
   if (newKey = keyRenameTemplate[oldKey]) {
      console.log(oldKey, '=>', newKey);
      delete Object.assign(user_settings, { [newKey]: user_settings[oldKey] })[oldKey];
   }
   GM_setValue(configStoreName, user_settings);
}

if (isOptionsPage()) return;
landerPlugins();
if (!user_settings?.disable_setting_button) renderSettingButton();

function renderSettingButton() {
   NOVA.waitElement('#masthead #end')
      .then(menu => {
         const a = document.createElement('a');
         a.title = 'Nova Settings';
         a.href = optionsPage + '?tabs=tab-plugins';
         a.target = '_blank';
         a.innerHTML =
            // <div style="display:inline-block;padding:var(--yt-button-icon-padding,8px);width:24px;height:24px;">
            `<yt-icon-button class="style-scope ytd-button-renderer style-default size-default">
               <svg viewBox="0 -2 28 28" height="100%" width="100%" version="1.1">
                  <g fill="deepskyblue">
                     <polygon points='21 12 3,1.8 3 22.2' />
                     <path d='M3 1.8v20.4L21 12L3 1.8z M6 7l9 5.1l-9 5.1V7z' />
                  </g>
               </svg>
            </yt-icon-button>`;
         // a.textContent = '►';
         // Object.assign(a.style, {
         //    'font-size': '24px',
         //    'color': 'deepskyblue !important',
         //    'text-decoration': 'none',
         //    'padding': '0 10px',
         // });
         a.addEventListener('click', () => {
            setTimeout(() => document.body.click(), 200); // fix hide <tp-yt-iron-dropdown>
         });
         menu.prepend(a);

         // const btn = document.createElement('button');
         // btn.className = 'ytd-topbar-menu-button-renderer';
         // btn.title = 'Nova Settings';
         // btn.innerHTML =
         //    `<svg width="24" height="24" viewBox="0 0 24 24">
         //       <g fill="deepskyblue">
         //          <polygon points='21 12 3,1.8 3 22.2' />
         //          <path d='M3 1.8v20.4L21 12L3 1.8z M6 7l9 5.1l-9 5.1V7z' />
         //       </g>
         //    </svg>`;
         // Object.assign(btn.style, {
         //    // color: 'var(--yt-spec-text-secondary)',
         //    padding: '0 24px',
         //    border: 0,
         //    outline: 0,
         //    cursor: 'pointer',
         // });
         // btn.addEventListener('click', () => parent.open(optionsPage + '?tabs=tab-plugins'));
         // // menu.insertBefore(btn, menu.lastElementChild);
         // menu.prepend(btn);
      });
}

function isOptionsPage() {
   GM_registerMenuCommand('Settings', () => window.open(optionsPage));
   GM_registerMenuCommand('Export settings', () => {
      let d = document.createElement('a');
      d.style.display = 'none';
      d.download = 'nova-settings.json';
      d.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(user_settings));
      document.body.append(d);
      d.click();
      d.remove();
   });
   GM_registerMenuCommand('Import settings', () => {
      let f = document.createElement('input');
      f.type = 'file';
      f.accept = 'application/JSON';
      f.style.display = 'none';
      f.addEventListener('change', function () {
         if (f.files.length !== 1) return;
         let rdr = new FileReader();
         rdr.addEventListener('load', function () {
            try {
               GM_setValue(configStoreName, JSON.parse(rdr.result));
               alert('Settings imported');
               document.location.reload();
            }
            catch (err) {
               alert(`Error parsing settings\n${err.name}: ${err.message}`);
            }
         });
         rdr.addEventListener('error', error => alert('Error loading file\n' + rdr.error));
         rdr.readAsText(f.files[0]);
      });
      document.body.append(f);
      f.click();
      f.remove();
   });

   // is optionsPage
   if (location.hostname === new URL(optionsPage).hostname) {
      // form submit
      document.addEventListener('submit', event => {
         // console.debug('submit', event.target);
         event.preventDefault();

         let obj = {};
         for (let [key, value] of new FormData(event.target)) {
            if (obj.hasOwnProperty(key)) { // SerializedArray
               obj[key] += ',' + value; // add new
               obj[key] = obj[key].split(','); // to array [old, new]

            } else {
               obj[key] = value;
            };
         }
         // fix tab reassignment
         if (obj.tabs) delete obj.tabs;

         console.debug(`update ${configStoreName}:`, obj);
         GM_setValue(configStoreName, obj);
      });

      window.addEventListener('load', () => {
         let interval_pagesync = setInterval(() => {
            //if (document.body.classList.contains('preload')) return console.debug('page loading..');
            if (!document.body?.querySelector('[data-dependent]')) return console.debug('page loading..');
            clearInterval(interval_pagesync);

            PopulateForm.fill(user_settings); // fill form
            attrDependencies();
            document.body.classList.remove('preload');
            // fix/ re-call // remove api warn if has api
            if (user_settings && user_settings['custom-api-key']) {
               document.body.querySelectorAll('.info b').forEach(el => el.remove(el));
            }
            document.body.querySelectorAll('form input[type]') // auto selects value on focus
               .forEach(i => i.addEventListener('focus', i.select));
         }, 500); // 500ms

         function attrDependencies() {
            document.body.querySelectorAll('[data-dependent]')
               .forEach(dependentItem => {
                  // let dependentsList = dependentItem.getAttribute('data-dependent').split(',').forEach(i => i.trim());
                  const dependentsJson = JSON.parse(dependentItem.getAttribute('data-dependent').toString());
                  const handler = () => showOrHide(dependentItem, dependentsJson);
                  document.getElementById(Object.keys(dependentsJson))?.addEventListener('change', handler);
                  // init state
                  handler();
               });

            function showOrHide(dependentItem, dependentsJson) {
               // console.debug('showOrHide', ...arguments);
               for (const name in dependentsJson) {
                  // console.log(`dependent_data.${name} = ${dependent_data[name]}`);
                  if (dependentOnEl = document.getElementsByName(name)[0]) {
                     const val = dependentsJson[name].toString();
                     const dependentOnValues = (function () {
                        if (options = dependentOnEl?.selectedOptions) {
                           return Array.from(options).map(({ value }) => value);
                        }
                        return [dependentOnEl.value];
                     })();

                     if (val && (dependentOnEl.checked || dependentOnValues.includes(val))
                        || (val?.startsWith('!') && dependentOnEl.value !== val.replace('!', '')) // inverse
                     ) {
                        // console.debug('show:', name);
                        dependentItem.classList.remove('hide');
                        childInputDisable(false);

                     } else {
                        // console.debug('hide:', name);
                        dependentItem.classList.add('hide');
                        childInputDisable(true);
                     }

                  } else {
                     console.error('error showOrHide:', name);
                  }
               }

               function childInputDisable(status = false) {
                  dependentItem.querySelectorAll('input, textarea, select')
                     .forEach(childItem => {
                        childItem.disabled = status;
                        // dependentItem.readOnly = status;
                     });
               }
            }
         }
      });

   } else if (!user_settings || !Object.keys(user_settings).length) { // is user_settings empty
      user_settings['report_issues'] = 'on'; // default plugins settings
      GM_setValue(configStoreName, user_settings);
      if (confirm('Active plugins undetected. Open the settings page now?')) window.open(optionsPage);

   } else {  // is not optionsPage
      return false;
   }

   return true;
}

function landerPlugins() {
   let plugins_lander = setInterval(() => {
      const domLoaded = document?.readyState != 'loading';
      if (!domLoaded) return console.debug('waiting, page loading..');
      processLander();

   }, 100); // 100ms

   function processLander() {
      console.groupCollapsed('plugins status');
      clearInterval(plugins_lander);

      //setTimeout(() => {
      Plugins.run({
         'user_settings': user_settings,
         'app_ver': GM_info.script.version,
      });
      //}, 300);
   }

   let lastUrl = location.href;
   const isURLChanged = () => lastUrl == location.href ? false : lastUrl = location.href;
   // skip first page transition
   document.addEventListener('yt-navigate-start', () => isURLChanged() && landerPlugins());
}

function _pluginsCaptureException({ trace_name, err_stack, confirm_msg, app_ver }) {
   GM_notification({ text: GM_info.script.name + '\n' + err.reason, timeout: 4000, onclick: openBugReport });

   if (confirm(confirm_msg || `Error in ${GM_info.script.name}. Open popup to report the bug?`)) {
      openBugReport();
   }

   function openBugReport() {
      window.open(
         'https://docs.google.com/forms/u/0/d/e/1FAIpQLScfpAvLoqWlD5fO3g-fRmj4aCeJP9ZkdzarWB8ge8oLpE5Cpg/viewform' +
         '?entry.35504208=' + encodeURIComponent(trace_name) +
         '&entry.151125768=' + encodeURIComponent(err_stack) +
         '&entry.744404568=' + encodeURIComponent(location.href) +
         '&entry.1416921320=' + encodeURIComponent(app_ver + ' | ' + navigator.userAgent), '_blank');
   }
};

window.addEventListener('unhandledrejection', err => {
   //if (!err.reason.stack.toString().includes(${JSON.stringify(chrome.runtime.id)})) return;
   console.error('[ERROR PROMISE]\n', err.reason, '\nPlease report the bug: https://github.com/raingart/Nova-YouTube-extension/issues/new?body=' + encodeURIComponent(GM_info.script.version + ' | ' + navigator.userAgent));

   if (user_settings.report_issues)
      _pluginsCaptureException({
         'trace_name': 'unhandledrejection',
         'err_stack': err.reason.stack,
         'app_ver': GM_info.script.version,
         'confirm_msg': `Failure when async-call of one "GM_info.script.name" plugin.\nDetails in the console\n\nOpen tab to report the bug?`,
      });
});
