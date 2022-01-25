/*!
 * lrc-file-parser.js v1.2.4
 * Author: lyswhut
 * Github: https://github.com/lyswhut/lrc-file-parser
 * License: MIT
 */
(function webpackUniversalModuleDefinition(root, factory) {
   if (typeof exports === "object" && typeof module === "object")
      module.exports = factory();
   else if (typeof define === "function" && define.amd)
      define("Lyric", [], factory);
   else if (typeof exports === "object") exports["Lyric"] = factory();
   else root["Lyric"] = factory();
})(self, function () {
   return /******/ (() => {
      // webpackBootstrap
      /******/ var __webpack_modules__ = {
         /***/ 579: /***/ (module) => {
            function _toConsumableArray(arr) {
               return (
                  _arrayWithoutHoles(arr) ||
                  _iterableToArray(arr) ||
                  _unsupportedIterableToArray(arr) ||
                  _nonIterableSpread()
               );
            }

            function _nonIterableSpread() {
               throw new TypeError(
                  "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
               );
            }

            function _unsupportedIterableToArray(o, minLen) {
               if (!o) return;
               if (typeof o === "string") return _arrayLikeToArray(o, minLen);
               var n = Object.prototype.toString.call(o).slice(8, -1);
               if (n === "Object" && o.constructor) n = o.constructor.name;
               if (n === "Map" || n === "Set") return Array.from(o);
               if (
                  n === "Arguments" ||
                  /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
               )
                  return _arrayLikeToArray(o, minLen);
            }

            function _iterableToArray(iter) {
               if (
                  (typeof Symbol !== "undefined" &&
                     iter[Symbol.iterator] != null) ||
                  iter["@@iterator"] != null
               )
                  return Array.from(iter);
            }

            function _arrayWithoutHoles(arr) {
               if (Array.isArray(arr)) return _arrayLikeToArray(arr);
            }

            function _arrayLikeToArray(arr, len) {
               if (len == null || len > arr.length) len = arr.length;
               for (var i = 0, arr2 = new Array(len); i < len; i++) {
                  arr2[i] = arr[i];
               }
               return arr2;
            }

            function _classCallCheck(instance, Constructor) {
               if (!(instance instanceof Constructor)) {
                  throw new TypeError("Cannot call a class as a function");
               }
            }

            function _defineProperties(target, props) {
               for (var i = 0; i < props.length; i++) {
                  var descriptor = props[i];
                  descriptor.enumerable = descriptor.enumerable || false;
                  descriptor.configurable = true;
                  if ("value" in descriptor) descriptor.writable = true;
                  Object.defineProperty(target, descriptor.key, descriptor);
               }
            }

            function _createClass(Constructor, protoProps, staticProps) {
               if (protoProps)
                  _defineProperties(Constructor.prototype, protoProps);
               if (staticProps) _defineProperties(Constructor, staticProps);
               return Constructor;
            }

            function _typeof(obj) {
               "@babel/helpers - typeof";
               if (
                  typeof Symbol === "function" &&
                  typeof Symbol.iterator === "symbol"
               ) {
                  _typeof = function _typeof(obj) {
                     return typeof obj;
                  };
               } else {
                  _typeof = function _typeof(obj) {
                     return obj &&
                        typeof Symbol === "function" &&
                        obj.constructor === Symbol &&
                        obj !== Symbol.prototype
                        ? "symbol"
                        : typeof obj;
                  };
               }
               return _typeof(obj);
            }

            var timeExp = /^\[([\d:.]*)\]{1}/g;
            var tagRegMap = {
               title: "ti",
               artist: "ar",
               album: "al",
               offset: "offset",
               by: "by",
            }; // eslint-disable-next-line no-undef

            var getNow =
               (typeof performance === "undefined"
                  ? "undefined"
                  : _typeof(performance)) == "object" && performance.now
                  ? performance.now.bind(performance)
                  : Date.now.bind(Date); // const timeoutTools = {
            //   expected: 0,
            //   interval: 0,
            //   timeoutId: null,
            //   callback: null,
            //   step() {
            //     var dt = getNow() - this.expected // the drift (positive for overshooting)
            //     if (dt > this.interval) {
            //         // something really bad happened. Maybe the browser (tab) was inactive?
            //         // possibly special handling to avoid futile "catch up" run
            //     }
            //     // … // do what is to be done
            //     this.callback()
            //     this.expected += this.interval
            //     this.timeoutId = setTimeout(() => {
            //       this.step()
            //     }, Math.max(0, this.interval - dt)) // take into account drift
            //   },
            //   start(callback = () => {}, interval = 1000) {
            //     this.callback = callback
            //     this.interval = interval
            //     this.expected = getNow() + interval
            //     this.timeoutId = setTimeout(() => {
            //       this.step()
            //     } ,interval)
            //   },
            //   stop() {
            //     if (this.timeoutId == null) return
            //     clearTimeout(this.timeoutId)
            //     this.timeoutId = null
            //   }
            // }

            var timeoutTools = {
               invokeTime: 0,
               animationFrameId: null,
               timeoutId: null,
               callback: null,
               thresholdTime: 200,
               run: function run() {
                  var _this = this;

                  this.animationFrameId = window.requestAnimationFrame(
                     function () {
                        _this.animationFrameId = null;
                        var diff = _this.invokeTime - getNow(); // console.log('diff', diff)

                        if (diff > 0) {
                           if (diff < _this.thresholdTime) return _this.run();
                           return (_this.timeoutId = setTimeout(function () {
                              _this.timeoutId = null;

                              _this.run();
                           }, diff - _this.thresholdTime));
                        } // console.log('diff', diff)

                        _this.callback(diff);
                     }
                  );
               },
               start: function start() {
                  var callback =
                     arguments.length > 0 && arguments[0] !== undefined
                        ? arguments[0]
                        : function () {};
                  var timeout =
                     arguments.length > 1 && arguments[1] !== undefined
                        ? arguments[1]
                        : 0;
                  // console.log(timeout)
                  this.callback = callback;
                  this.invokeTime = getNow() + timeout;
                  this.run();
               },
               clear: function clear() {
                  if (this.animationFrameId) {
                     window.cancelAnimationFrame(this.animationFrameId);
                     this.animationFrameId = null;
                  }

                  if (this.timeoutId) {
                     window.clearTimeout(this.timeoutId);
                     this.timeoutId = null;
                  }
               },
            };

            module.exports = /*#__PURE__*/ (function () {
               function Lyric() {
                  var _ref =
                        arguments.length > 0 && arguments[0] !== undefined
                           ? arguments[0]
                           : {},
                     _ref$lyric = _ref.lyric,
                     lyric = _ref$lyric === void 0 ? "" : _ref$lyric,
                     _ref$translationLyric = _ref.translationLyric,
                     translationLyric =
                        _ref$translationLyric === void 0
                           ? ""
                           : _ref$translationLyric,
                     _ref$offset = _ref.offset,
                     offset = _ref$offset === void 0 ? 150 : _ref$offset,
                     _ref$onPlay = _ref.onPlay,
                     onPlay =
                        _ref$onPlay === void 0 ? function () {} : _ref$onPlay,
                     _ref$onSetLyric = _ref.onSetLyric,
                     onSetLyric =
                        _ref$onSetLyric === void 0
                           ? function () {}
                           : _ref$onSetLyric,
                     _ref$isRemoveBlankLin = _ref.isRemoveBlankLine,
                     isRemoveBlankLine =
                        _ref$isRemoveBlankLin === void 0
                           ? true
                           : _ref$isRemoveBlankLin;

                  _classCallCheck(this, Lyric);

                  this.lyric = lyric;
                  this.translationLyric = translationLyric;
                  this.tags = {};
                  this.lines = null;
                  this.onPlay = onPlay;
                  this.onSetLyric = onSetLyric;
                  this.isPlay = false;
                  this.curLineNum = 0;
                  this.maxLine = 0;
                  this.offset = offset;
                  this.isOffseted = false;
                  this._performanceTime = 0;
                  this._performanceOffsetTime = 0;
                  this.isRemoveBlankLine = isRemoveBlankLine;

                  this._init();
               }

               _createClass(Lyric, [
                  {
                     key: "_init",
                     value: function _init() {
                        if (this.lyric == null) this.lyric = "";
                        if (this.translationLyric == null)
                           this.translationLyric = "";

                        this._initTag();

                        this._initLines();

                        this.onSetLyric(this.lines);
                     },
                  },
                  {
                     key: "_initTag",
                     value: function _initTag() {
                        for (var tag in tagRegMap) {
                           var matches = this.lyric.match(
                              new RegExp(
                                 "\\[".concat(tagRegMap[tag], ":([^\\]]*)]"),
                                 "i"
                              )
                           );
                           this.tags[tag] = (matches && matches[1]) || "";
                        }
                     },
                  },
                  {
                     key: "_initLines",
                     value: function _initLines() {
                        this.lines = []; // this.translationLines = []

                        var lines = this.lyric.split(/\r\n|\n|\r/);
                        var linesMap = {}; // const translationLines = this.translationLyric.split('\n')

                        var length = lines.length;

                        for (var i = 0; i < length; i++) {
                           var line = lines[i].trim();
                           var result = timeExp.exec(line);

                           if (result) {
                              var text = line.replace(timeExp, "").trim();

                              if (text || !this.isRemoveBlankLine) {
                                 var timeStr = RegExp.$1;
                                 var timeArr = timeStr.split(":");
                                 if (timeArr.length < 3) timeArr.unshift(0);

                                 if (timeArr[2].indexOf(".") > -1) {
                                    timeArr.push.apply(
                                       timeArr,
                                       _toConsumableArray(timeArr[2].split("."))
                                    );
                                    timeArr.splice(2, 1);
                                 }

                                 linesMap[timeStr] = {
                                    time:
                                       parseInt(timeArr[0]) * 60 * 60 * 1000 +
                                       parseInt(timeArr[1]) * 60 * 1000 +
                                       parseInt(timeArr[2]) * 1000 +
                                       parseInt(timeArr[3] || 0),
                                    text: text,
                                 };
                              }
                           }
                        }

                        var translationLines =
                           this.translationLyric.split(/\r\n|\n|\r/);
                        var translationLineLength = translationLines.length;

                        for (var _i = 0; _i < translationLineLength; _i++) {
                           var _line = translationLines[_i].trim();

                           var _result = timeExp.exec(_line);

                           if (_result) {
                              var _text = _line.replace(timeExp, "").trim();

                              if (_text || !this.isRemoveBlankLine) {
                                 var _timeStr = RegExp.$1;
                                 var targetLine = linesMap[_timeStr];
                                 if (targetLine) targetLine.translation = _text;
                              }
                           }
                        }

                        this.lines = Object.values(linesMap);
                        this.lines.sort(function (a, b) {
                           return a.time - b.time;
                        });
                        this.maxLine = this.lines.length - 1;
                     },
                  },
                  {
                     key: "_currentTime",
                     value: function _currentTime() {
                        return (
                           getNow() -
                           this._performanceTime +
                           this._performanceOffsetTime
                        );
                     },
                  },
                  {
                     key: "_findCurLineNum",
                     value: function _findCurLineNum(curTime) {
                        var length = this.lines.length;

                        for (var index = 0; index < length; index++) {
                           if (curTime <= this.lines[index].time)
                              return index === 0 ? 0 : index - 1;
                        }

                        return length - 1;
                     },
                  },
                  {
                     key: "_handleMaxLine",
                     value: function _handleMaxLine() {
                        this.onPlay(
                           this.curLineNum,
                           this.lines[this.curLineNum].text
                        );
                        this.pause();
                     },
                  },
                  {
                     key: "_refresh",
                     value: function _refresh() {
                        var _this2 = this;

                        this.curLineNum++; // console.log('curLineNum time', this.lines[this.curLineNum].time)

                        if (this.curLineNum >= this.maxLine)
                           return this._handleMaxLine();
                        var curLine = this.lines[this.curLineNum];
                        var nextLine = this.lines[this.curLineNum + 1];

                        var currentTime = this._currentTime();

                        var driftTime = currentTime - curLine.time;

                        if (driftTime >= 0 || this.curLineNum === 0) {
                           this.delay =
                              nextLine.time - curLine.time - driftTime;

                           if (this.delay > 0) {
                              if (
                                 !this.isOffseted &&
                                 this.delay >= this.offset
                              ) {
                                 this._performanceOffsetTime += this.offset;
                                 this.delay -= this.offset;
                                 this.isOffseted = true;
                              }

                              timeoutTools.start(function () {
                                 if (!_this2.isPlay) return;

                                 _this2._refresh();
                              }, this.delay);
                              this.onPlay(this.curLineNum, curLine.text);
                              return;
                           }
                        }

                        this.curLineNum = this._findCurLineNum(currentTime) - 1;

                        this._refresh();
                     },
                  },
                  {
                     key: "play",
                     value: function play() {
                        var curTime =
                           arguments.length > 0 && arguments[0] !== undefined
                              ? arguments[0]
                              : 0;
                        if (!this.lines.length) return;
                        this.pause();
                        this.isPlay = true;
                        this._performanceOffsetTime = 0;
                        this._performanceTime = getNow() - curTime;

                        if (this._performanceTime < 0) {
                           this._performanceOffsetTime = -this._performanceTime;
                           this._performanceTime = 0;
                        }

                        this.curLineNum = this._findCurLineNum(curTime) - 1;

                        this._refresh();
                     },
                  },
                  {
                     key: "pause",
                     value: function pause() {
                        if (!this.isPlay) return;
                        this.isPlay = false;
                        this.isOffseted = false;
                        timeoutTools.clear();
                        if (this.curLineNum === this.maxLine) return;

                        var curLineNum = this._findCurLineNum(
                           this._currentTime()
                        );

                        if (this.curLineNum !== curLineNum) {
                           this.curLineNum = curLineNum;
                           this.onPlay(curLineNum, this.lines[curLineNum].text);
                        }
                     },
                  },
                  {
                     key: "setLyric",
                     value: function setLyric(lyric, translationLyric) {
                        // console.log(translationLyric)
                        if (this.isPlay) this.pause();
                        this.lyric = lyric;
                        this.translationLyric = translationLyric;

                        this._init();
                     },
                  },
               ]);

               return Lyric;
            })();

            /***/
         },

         /******/
      };
      /************************************************************************/
      /******/ // The module cache
      /******/ var __webpack_module_cache__ = {};
      /******/
      /******/ // The require function
      /******/ function __webpack_require__(moduleId) {
         /******/ // Check if module is in cache
         /******/ var cachedModule = __webpack_module_cache__[moduleId];
         /******/ if (cachedModule !== undefined) {
            /******/ return cachedModule.exports;
            /******/
         }
         /******/ // Create a new module (and put it into the cache)
         /******/ var module = (__webpack_module_cache__[moduleId] = {
            /******/ // no module.id needed
            /******/ // no module.loaded needed
            /******/ exports: {},
            /******/
         });
         /******/
         /******/ // Execute the module function
         /******/ __webpack_modules__[moduleId](
            module,
            module.exports,
            __webpack_require__
         );
         /******/
         /******/ // Return the exports of the module
         /******/ return module.exports;
         /******/
      }
      /******/
      /************************************************************************/
      /******/
      /******/ // startup
      /******/ // Load entry module and return exports
      /******/ // This entry module is referenced by other modules so it can't be inlined
      /******/ var __webpack_exports__ = __webpack_require__(579);
      /******/
      /******/ return __webpack_exports__;
      /******/
   })();
});
