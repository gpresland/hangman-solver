import { HangmanSolver } from './hangman-solver';

const solver = new HangmanSolver();

async function init() {
  await solver.Init();

  console.log('total word', solver.allWords.length);
  console.log('Remaining Words:', solver.remainingWords.length);
  console.log('Word is:', solver.word);

  while (!solver.isSolved) {
    const bestGuess = solver.getMostCommonLetter();
    await solver.guess(bestGuess);

    console.log('Guessing:', bestGuess);
    console.log('Word is:', solver.word);
    console.log('Remaining Words:', solver.remainingWords.length);
    console.log('Letters remaining:', solver.lettersRemaining);
    console.log('Total guesses:', solver.guesses);
    console.log('Wrong guesses', solver.wrongGuesses);

    if (solver.isSolved) {
      console.log('Solved!');
    }
  }
}

init();
