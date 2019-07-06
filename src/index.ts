import { HangmanSolver } from './hangman-solver';

const solver = new HangmanSolver();

async function init() {
  await solver.Init();

  console.log('total word', solver.allWords.length);
  console.log('Remaining Words:', solver.remainingWords.length);
  console.log('Word is:', solver.word);

  while (!solver.isSolved) {
    const bestGuess = solver.getMostCommonLetter();
    const isCorrectGuess = await solver.guess(bestGuess);

    console.log('Guessing:', bestGuess);
    console.log('Guess was: ', isCorrectGuess ? 'Correct' : 'Incorrect');
    console.log('Word is:', solver.word);
    console.log('Remaining Words:', solver.remainingWords.length);
    console.log('Letters remaining:', solver.lettersRemaining);
    console.log('Total guesses:', solver.guesses);
    console.log('Wrong guesses', solver.wrongGuesses);
    console.log('----------------------------------------');

    if (solver.isSolved) {
      console.log('Solved!');
    }
  }
}

init();
