import axios from 'axios';
import fs from 'fs';
import qs from 'qs';
import readline from 'readline';
import { countBy, difference, forEach, get, includes, set } from 'lodash';

const URL = 'https://hangman-api.herokuapp.com/hangman';
const WORD_FILE_PATH = `${process.cwd()}/words.txt`;
const UNKNOWN_LETTER_CHARACTER = '_';

class HangmanSolver {

  /**
   * Word filtering predicates.
   */
  private static predicates = {
    excludes: (words: string[], letter: string) =>
      words.filter(word => !includes(word, letter)),
    includes: (words: string[], letter: string, positions: number[]) =>
      words.filter(word => includes(word, letter) && positions.every(position => word[position] == letter)),
    length: (words: string[], length: number) =>
      words.filter(word => word.length === length)
  };

  /**
   * Letters of the alphabet.
   */
  public static LETTERS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

  /**
   * List of all legal words.
   */
  private _allWords: string[] = [];

  /**
   * Number of correct guesses.
   */
  private _correctGuesses = 0;

  /**
   * Number of guesses used.
   */
  private _guesses = 0;

  /**
   * List of letters we've tried.
   */
  private _lettersGuessed: string[] = [];

  /**
   * List of all remaining possible words.
   */
  private _remainingWords: string[] = [];

  /**
   * Current token.
   */
  private _token = '';

  /**
   * Word we are trying to guess.
   */
  private _word = '';

  /**
   * Number of invalid guesses.
   */
  private _wrongGuesses = 0;

  /**
   * 
   */
  constructor() {
    //
  }

  /**
   * List of all legal words.
   */
  public get allWords() {
    return this._allWords;
  }

  /**
   * Number of correct guesses.
   */
  public get correctGuesses() {
    return this._correctGuesses;
  }

  /**
   * Number of guesses used.
   */
  public get guesses() {
    return this._guesses;
  }

  /**
   * True if the word has been solved, otherwise false.
   */
  public get isSolved() {
    return this.lettersRemaining === 0;
  }

  /**
   * The number of unknown letters.
   */
  public get lettersRemaining() {
    return countBy(this._word)[UNKNOWN_LETTER_CHARACTER] || 0;
  }

  /**
   * Letters tried.
   */
  public get lettersTried() {
    return this._lettersGuessed;
  }

  /**
   * Letters not yet tried.
   */
  public get remainingLetters() {
    return difference(HangmanSolver.LETTERS, this._lettersGuessed);
  }

  /**
   * List of all remaining possible words.
   */
  public get remainingWords() {
    return this._remainingWords;
  }

  /**
   * The word.
   */
  public get word() {
    return this._word;
  }

  /**
   * The length of the word we are trying to guess.
   */
  public get wordLength() {
    return this._word.length;
  }

  /**
   * Number of invalid guesses.
   */
  public get wrongGuesses() {
    return this._wrongGuesses;
  }

  /**
   * Gets the most common letter remaining.
   */
  public getMostCommonLetter(): string {
    const counts = {};

    forEach(this._remainingWords, word => {
      const letters: string[] = [];

      forEach(word, letter => {
        const isDuplicate = includes(letters, letter);

        if (isDuplicate) {
          return;
        }

        const count = get(counts, letter, 0);
        const newCount = count + 1;

        set(counts, letter, newCount);

        letters.push(letter);
      });
    });

    let mostCommonLetter = '';
    let mostCommonLetterCount = 0;

    forEach(counts, (value, key) => {
      const isUsed = includes(this._lettersGuessed, key);

      if (value > mostCommonLetterCount && !isUsed) {
        mostCommonLetter = key;
        mostCommonLetterCount = value;
      }
    });

    return mostCommonLetter;
  }

  /*
   * Guess a letter.
   * @param letter The letter to guess.
   * @returns true if
   */
  public async guess(letter: string): Promise<boolean> {
    const isAlreadyGuessed = includes(this._remainingWords, letter);

    if (isAlreadyGuessed) {
      return Promise.reject(false);
    }

    const response = await axios({
      url: URL,
      method: 'PUT',
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: qs.stringify({
        letter: letter,
        token: this._token
      })
    });

    this._token = get(response.data, 'token');
    this._word = get(response.data, 'hangman');
    this._lettersGuessed.push(letter);
    this._guesses += 1;

    const isCorrect = get(response.data, 'correct');

    if (isCorrect) {
      this._correctGuesses += 1;
      const indices: number[] = [];
      forEach(this._word, (lett, index) => {
        if (lett === letter) {
          indices.push(index);
        }
      });
      this._remainingWords = HangmanSolver.predicates.includes(this._remainingWords, letter, indices);
    } else {
      this._wrongGuesses += 1;
      this._remainingWords = HangmanSolver.predicates.excludes(this._remainingWords, letter);
    }

    return Promise.resolve(isCorrect);
  }

  /**
   * Initialize the solver.
   */
  public async Init() {
    const initializers = [
      this.InitApi(),
      this.InitDictionary()
    ];

    await Promise.all(initializers);

    this._remainingWords = HangmanSolver.predicates.length(this._allWords, this._word.length);
  }

  /**
   * Load all words from word list file.
   */
  private async InitDictionary() {
    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(WORD_FILE_PATH);
      const reader = readline.createInterface(stream);

      reader
        .on('line', line => {
          line = line.trim();
          this._allWords.push(line);
        })
        .on('close', () => resolve());
    });
  }

  /**
   * Initialize the game.
   */
  private async InitApi() {
    return axios.post(URL, {
      //
    })
      .then((response) => {
        this._word = get(response.data, 'hangman')
        this._token = get(response.data, 'token');
      });
  }
}

export { HangmanSolver };
