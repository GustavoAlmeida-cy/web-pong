import Ball from "./ball.js";
import Paddle from "./paddle.js";

// DOM Elements
const gameField = document.getElementById("game-field");
const ballElement = document.getElementById("ball");
const playerPaddleElement = document.getElementById("player-paddle");
const computerPaddleElement = document.getElementById("computer-paddle");
const playerScoreElement = document.getElementById("player-score");
const computerScoreElement = document.getElementById("computer-score");

// Instâncias
const ball = new Ball(ballElement);
const playerPaddle = new Paddle(playerPaddleElement);
const computerPaddle = new Paddle(computerPaddleElement);

let lastTime = null;

// Loop principal do jogo
function update(time) {
  if (lastTime !== null) {
    const delta = time - lastTime;

    // Anima cor de fundo suavemente
    const hue = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--hue")
    );
    document.documentElement.style.setProperty("--hue", hue + delta * 0.01);

    // Atualiza bola e paddle do computador
    ball.update(delta, gameField, [playerPaddle.rect(), computerPaddle.rect()]);
    computerPaddle.update(delta, ball.y);

    // Verifica derrota
    if (isOutOfBounds()) handleScore();
  }

  lastTime = time;
  requestAnimationFrame(update);
}

// Verifica se a bola saiu pela lateral
function isOutOfBounds() {
  const { left, right } = gameField.getBoundingClientRect();
  const ballRect = ball.rect();
  return ballRect.left <= left || ballRect.right >= right;
}

// Atualiza placar e reseta elementos
function handleScore() {
  const { right } = gameField.getBoundingClientRect();
  const ballRect = ball.rect();

  if (ballRect.right <= right) {
    computerScoreElement.textContent = +computerScoreElement.textContent + 1;
  } else {
    playerScoreElement.textContent = +playerScoreElement.textContent + 1;
  }

  ball.reset();
  computerPaddle.reset();
}

// Movimento do jogador com o mouse
document.addEventListener("mousemove", (e) => {
  const fieldRect = gameField.getBoundingClientRect();
  const paddleRect = playerPaddleElement.getBoundingClientRect();

  // Altura do paddle em % do campo
  const paddleHeightPercent = (paddleRect.height / fieldRect.height) * 100;

  // Converte posição do mouse em % do campo
  let percent = ((e.clientY - fieldRect.top) / fieldRect.height) * 100;

  // Limita paddle para não ultrapassar os limites do campo
  percent = Math.max(0, Math.min(100 - paddleHeightPercent, percent));

  playerPaddle.position = percent;
});

// Inicia o loop
requestAnimationFrame(update);
