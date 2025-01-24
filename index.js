const boxes = document.querySelectorAll('.box');
const letterInput = document.getElementById('letter-input');
const generateQRButton = document.getElementById('generate-qr');
const continueButton = document.getElementById('continue');
const qrCodeCanvas = document.getElementById('qr-code');
const winnerDisplay = document.getElementById('winner');
const restartButton = document.getElementById('restart');
const qrGameCanvas = document.getElementById('qr-game-code');

let selectedBox = null;
let currentPlayer = 'Player 1';
const players = {
    'Player 1': 'X',
    'Player 2': 'O'
};

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Game board logic
boxes.forEach((box, index) => {
    box.addEventListener('click', () => {
        if (!box.textContent) {
            box.classList.add('selected');
            selectedBox = box;
            letterInput.disabled = true;
            box.textContent = players[currentPlayer];
            box.classList.remove('selected');

            if (checkWinner()) {
                winnerDisplay.textContent = `${currentPlayer} Wins!`;
                generateWinnerQRCode(`${currentPlayer} Wins!`); // Generate QR code for the winner
                boxes.forEach(b => b.removeEventListener('click', box.click));
            } else if (Array.from(boxes).every(b => b.textContent !== '')) {
                winnerDisplay.textContent = 'It\'s a Draw!';
            } else {
                switchPlayer();
            }
        }
    });
});

function switchPlayer() {
    currentPlayer = currentPlayer === 'Player 1' ? 'Player 2' : 'Player 1';
}

function checkWinner() {
    return winningCombinations.some(combination => {
        const [a, b, c] = combination;
        if (
            boxes[a].textContent === players[currentPlayer] &&
            boxes[a].textContent === boxes[b].textContent &&
            boxes[a].textContent === boxes[c].textContent
        ) {
            return true;
        }
        return false;
    });
}

// QR code for individual box input
letterInput.addEventListener('input', () => {
    generateQRButton.disabled = letterInput.value.trim() === '';
});

generateQRButton.addEventListener('click', () => {
    const letter = letterInput.value.trim();
    if (letter && selectedBox) {
        QRCode.toCanvas(qrCodeCanvas, letter, error => {
            if (error) console.error(error);
            continueButton.disabled = false;
        });
    }
});

continueButton.addEventListener('click', () => {
    if (selectedBox && letterInput.value.trim()) {
        selectedBox.textContent = letterInput.value.trim();
        selectedBox.classList.remove('selected');
        letterInput.value = '';
        letterInput.disabled = true;
        generateQRButton.disabled = true;
        continueButton.disabled = true;
        qrCodeCanvas.getContext('2d').clearRect(0, 0, qrCodeCanvas.width, qrCodeCanvas.height);
    }
});

// Restart button logic
restartButton.addEventListener('click', () => {
    boxes.forEach(box => {
        box.textContent = '';
        box.classList.remove('selected');
    });
    winnerDisplay.textContent = '';
    currentPlayer = 'Player 1';
    letterInput.value = '';
    letterInput.disabled = true;
    generateQRButton.disabled = true;
    continueButton.disabled = true;
    qrCodeCanvas.getContext('2d').clearRect(0, 0, qrCodeCanvas.width, qrCodeCanvas.height);
});

// Generate QR code for the game URL
const gameUrl = 'https://qrgames.netlify.app'; // Replace with your hosted game URL
QRCode.toCanvas(qrGameCanvas, gameUrl, { width: 200 }, error => {
    if (error) {
        console.error("QR Code generation failed:", error);
    }
});

function generateWinnerQRCode(winnerMessage) {
    // Create the QR code for the winner message
    QRCode.toCanvas(qrCodeCanvas, winnerMessage, error => {
        if (error) {
            console.error("QR Code generation failed:", error);
        }
        continueButton.disabled = false; // Enable the continue button after generating the QR code
    });
}
