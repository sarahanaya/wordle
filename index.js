import { realDictionary } from './dictionary.js';

const dictionary = realDictionary;

const state = {
    secret: dictionary[Math.floor(Math.random() * dictionary.length)],
    grid: Array(6)
        .fill()
        .map(() => Array(5).fill('')),
    currentRow: 0,
    currentCol: 0,
};

function updateGrid() {
    for (let i = 0; i < state.grid.length; i++) {
        for (let j = 0; j < state.grid[i].length; j++) {
            const box = document.getElementById(`box${i}${j}`);
            box.textContent = state.grid[i][j];
        }
    }
}

function drawBox(container, row, col, letter = '') {
    const box = document.createElement('div');
    box.className = 'box';
    box.id = `box${row}${col}`;
    box.textContent = letter;

    container.appendChild(box);
    return box;
}

function drawGrid(container) {
    const grid = document.createElement('div');
    grid.className = 'grid';

    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 5; j++) {
            drawBox(grid, i, j);
        }
    }

    container.appendChild(grid);
}


function registerKeyboardEvents() {
    document.body.onkeydown = (e) => {
        const key = e.key;
        if (key === 'Enter') {
            if (state.currentCol === 5) {
                const word = getCurrentWord();
                if (isWordValid(word)) {
                    revealWord(word);
                    state.currentRow++;
                    state.currentCol = 0;
                } else {
                    alert('Not a valid word.');
                }
            }
        }
        if (key === 'Backspace') {
            removeLetter();
        }
        if (isLetter(key)) {
            addLetter(key);
        }

        updateGrid();
    };
}

function getCurrentWord() {
    return state.grid[state.currentRow].reduce((prev, curr) => prev + curr);
}

function isWordValid(word) {
    return dictionary.includes(word);
}

function revealWord(guess) {
    const row = state.currentRow; // get current row
    const animation_duration = 500; // in ms
    for (let i = 0; i < 5; i++) {
        const box = document.getElementById(`box${row}${i}`); // get current box
        const letter = box.textContent; // get current letter

        setTimeout(() => {
            if (letter === state.secret[i]) {
                box.classList.add('right');
            } else if (state.secret.includes(letter)) {
                box.classList.add('wrong'); // right letter wrong spot
            } else {
                box.classList.add('empty'); // letter not in word
            }
        }, ((i + 1) * animation_duration) / 2);


        box.classList.add('animated');
        box.style.animationDelay = `${(i*animation_duration)/2}ms`;
        // at 250 ms so color of box change when it is flat (height at 0)
    }

    // once we get the word we need to check two things
    const isWinner = state.secret === guess;
    const isGameOver = state.currentRow === 5;

    // ends if either they won or no more guesses
    setTimeout(() => {
        if (isWinner) {
            alert('Congratulations!');
        } else if (isGameOver) {
            alert(`Better luck next time! The word was ${state.secret}.`);
        }
    }, 3 * animation_duration); // needs to happen after all letters are animated
}

function isLetter(key) {
    return key.length === 1 && key.match(/[a-z]/i); // using regez expression to verify if letter
}

// checks 
function addLetter(letter) {
    if (state.currentCol === 5) return; // check if current row has anyspace left
    state.grid[state.currentRow][state.currentCol] = letter;
    state.currentCol++;
}

function removeLetter() {
    if (state.currentCol === 0) return;
    state.currentCol--;
    state.grid[state.currentRow][state.currentCol] = '';
}

function startup() {
    const game = document.getElementById('game');
    drawGrid(game);

    registerKeyboardEvents();
    //console.log(state.secret); 

}

startup();