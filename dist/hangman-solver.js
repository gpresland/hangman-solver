"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var fs_1 = __importDefault(require("fs"));
var qs_1 = __importDefault(require("qs"));
var readline_1 = __importDefault(require("readline"));
var lodash_1 = require("lodash");
var URL = 'https://hangman-api.herokuapp.com/hangman';
var WORD_FILE_PATH = process.cwd() + "/words.txt";
var UNKNOWN_LETTER_CHARACTER = '_';
var HangmanSolver = /** @class */ (function () {
    /**
     *
     */
    function HangmanSolver() {
        /**
         * List of all legal words.
         */
        this._allWords = [];
        /**
         * Number of guesses used.
         */
        this._guesses = 0;
        /**
         * List of letters we've tried.
         */
        this._lettersGuessed = [];
        /**
         * List of all remaining possible words.
         */
        this._remainingWords = [];
        /**
         * Current token.
         */
        this._token = '';
        /**
         * Word we are trying to guess.
         */
        this._word = '';
        /**
         * Number of invalid guesses.
         */
        this._wrongGuesses = 0;
        //
    }
    Object.defineProperty(HangmanSolver.prototype, "allWords", {
        /**
         * List of all legal words.
         */
        get: function () {
            return this._allWords;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HangmanSolver.prototype, "guesses", {
        /**
         * Number of guesses used.
         */
        get: function () {
            return this._guesses;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HangmanSolver.prototype, "isSolved", {
        /**
         * True if the word has been solved, otherwise false.
         */
        get: function () {
            return this.lettersRemaining === 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HangmanSolver.prototype, "lettersRemaining", {
        /**
         * The number of unknown letters.
         */
        get: function () {
            return lodash_1.countBy(this._word)[UNKNOWN_LETTER_CHARACTER] || 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HangmanSolver.prototype, "lettersTried", {
        /**
         * Letters tried.
         */
        get: function () {
            return this._lettersGuessed;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HangmanSolver.prototype, "remainingLetters", {
        /**
         * Letters not yet tried.
         */
        get: function () {
            return lodash_1.difference(HangmanSolver.LETTERS, this._lettersGuessed);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HangmanSolver.prototype, "remainingWords", {
        /**
         * List of all remaining possible words.
         */
        get: function () {
            return this._remainingWords;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HangmanSolver.prototype, "word", {
        /**
         * The word.
         */
        get: function () {
            return this._word;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HangmanSolver.prototype, "wordLength", {
        /**
         * The length of the word we are trying to guess.
         */
        get: function () {
            return this._word.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HangmanSolver.prototype, "wrongGuesses", {
        /**
         * Number of invalid guesses.
         */
        get: function () {
            return this._wrongGuesses;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Gets the most common letter remaining.
     */
    HangmanSolver.prototype.getMostCommonLetter = function () {
        var _this = this;
        var counts = {};
        lodash_1.forEach(this._remainingWords, function (word) {
            lodash_1.forEach(word, function (letter) {
                var count = lodash_1.get(counts, letter, 0);
                var newCount = count + 1;
                lodash_1.set(counts, letter, newCount);
            });
        });
        var mostCommonLetter = '';
        var mostCommonLetterCount = 0;
        lodash_1.forEach(counts, function (value, key) {
            var isUsed = lodash_1.includes(_this._lettersGuessed, key);
            if (value > mostCommonLetterCount && !isUsed) {
                mostCommonLetter = key;
                mostCommonLetterCount = value;
            }
        });
        return mostCommonLetter;
    };
    /*
     * Guess a letter.
     * @param letter The letter to guess.
     */
    HangmanSolver.prototype.guess = function (letter) {
        return __awaiter(this, void 0, void 0, function () {
            var isAlreadyGuessed, response, isCorrect;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        isAlreadyGuessed = lodash_1.includes(this._remainingWords, letter);
                        if (isAlreadyGuessed) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, axios_1.default({
                                url: URL,
                                method: 'PUT',
                                headers: {
                                    'content-type': 'application/x-www-form-urlencoded'
                                },
                                data: qs_1.default.stringify({
                                    letter: letter,
                                    token: this._token
                                })
                            })];
                    case 1:
                        response = _a.sent();
                        isCorrect = lodash_1.get(response.data, 'correct');
                        if (!isCorrect) {
                            this._wrongGuesses += 1;
                        }
                        this._token = lodash_1.get(response.data, 'token');
                        this._word = lodash_1.get(response.data, 'hangman');
                        this._lettersGuessed.push(letter);
                        this._guesses += 1;
                        this.updateRemainingWords();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Initialize the solver.
     */
    HangmanSolver.prototype.Init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var initializers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        initializers = [
                            this.InitApi(),
                            this.InitDictionary()
                        ];
                        return [4 /*yield*/, Promise.all(initializers)];
                    case 1:
                        _a.sent();
                        this.updateRemainingWords();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Load all words from word list file.
     */
    HangmanSolver.prototype.InitDictionary = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var stream = fs_1.default.createReadStream(WORD_FILE_PATH);
                        var reader = readline_1.default.createInterface(stream);
                        reader
                            .on('line', function (line) {
                            line = line.trim();
                            _this._allWords.push(line);
                        })
                            .on('close', function () { return resolve(); });
                    })];
            });
        });
    };
    /**
     * Initialize the game.
     */
    HangmanSolver.prototype.InitApi = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, axios_1.default.post(URL, {
                    //
                    })
                        .then(function (response) {
                        _this._word = lodash_1.get(response.data, 'hangman');
                        _this._token = lodash_1.get(response.data, 'token');
                    })];
            });
        });
    };
    /**
     * Updates the list of remaining words.
     */
    HangmanSolver.prototype.updateRemainingWords = function () {
        var _this = this;
        var wordChars = this._word.split('');
        this._remainingWords = this._allWords.filter(function (remainingWord) {
            if (remainingWord.length !== _this.wordLength) {
                return false;
            }
            var remainingChars = remainingWord.split('');
            return remainingChars.every(function (char, i) {
                if (wordChars[i] == UNKNOWN_LETTER_CHARACTER) {
                    return true;
                }
                return char == wordChars[i];
            });
        });
    };
    /**
     * Letters of the alphabet.
     */
    HangmanSolver.LETTERS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    return HangmanSolver;
}());
exports.HangmanSolver = HangmanSolver;
