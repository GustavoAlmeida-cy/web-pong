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

// Guarda as teclas pressionadas para controle por teclado
const keysPressed = new Set();

// Loop principal do jogo
function update(time) {
  if (lastTime !== null) {
    const delta = time - lastTime;

    // Atualiza o hue para efeito de cor de fundo suave
    const hue = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--hue")
    );
    document.documentElement.style.setProperty("--hue", hue + delta * 0.01);

    // Ajusta trilha da bola (mais brilho com maior velocidade)
    const speedFactor = Math.min(ball.velocity / 0.05, 1);
    ballElement.style.filter = `drop-shadow(0 0 ${
      5 + speedFactor * 10
    }px rgba(255 255 255 / 0.8))`;

    // Controle por teclado (W/S)
    handleKeyboardControl(delta);

    // Atualiza bola e paddle do computador
    ball.update(delta, gameField, [playerPaddle.rect(), computerPaddle.rect()]);
    computerPaddle.update(delta, ball.y);

    // Verifica se a bola saiu da área do jogo e atualiza o placar
    if (isOutOfBounds()) {
      handleScore();
    }
  }

  lastTime = time;
  requestAnimationFrame(update);
}

// Verifica se a bola ultrapassou o limite lateral do campo
function isOutOfBounds() {
  const { left, right } = gameField.getBoundingClientRect();
  const ballRect = ball.rect();
  return ballRect.left <= left || ballRect.right >= right;
}

// Atualiza o placar, reseta bola e paddle do computador e faz flash visual
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

  // Flash visual no campo de jogo ao marcar ponto
  gameField.style.transition = "background-color 0.1s ease";
  gameField.style.backgroundColor = "hsl(0, 0%, 90%)";

  setTimeout(() => {
    gameField.style.backgroundColor = "";
  }, 100);
}

// Movimento do jogador com o mouse
document.addEventListener("mousemove", (e) => {
  const fieldRect = gameField.getBoundingClientRect();
  const paddleRect = playerPaddleElement.getBoundingClientRect();

  const paddleHeightPercent = (paddleRect.height / fieldRect.height) * 100;

  let percent = ((e.clientY - fieldRect.top) / fieldRect.height) * 100;

  // Limita para não ultrapassar os limites
  percent = Math.min(100 - paddleHeightPercent, Math.max(0, percent));

  playerPaddle.position = percent;
});

// Movimento do jogador via touchscreen (mobile)
gameField.addEventListener(
  "touchmove",
  (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const fieldRect = gameField.getBoundingClientRect();
    const paddleRect = playerPaddleElement.getBoundingClientRect();

    const paddleHeightPercent = (paddleRect.height / fieldRect.height) * 100;
    let percent = ((touch.clientY - fieldRect.top) / fieldRect.height) * 100;

    // Limita para não ultrapassar os limites
    percent = Math.min(100 - paddleHeightPercent, Math.max(0, percent));

    playerPaddle.position = percent;
  },
  { passive: false }
);

// Registra teclas pressionadas
document.addEventListener("keydown", (e) => {
  keysPressed.add(e.key.toLowerCase());
});
document.addEventListener("keyup", (e) => {
  keysPressed.delete(e.key.toLowerCase());
});

// Controla paddle do jogador com as teclas W e S
function handleKeyboardControl(delta) {
  const step = 0.1 * delta;

  const paddleHeightPercent =
    (playerPaddleElement.getBoundingClientRect().height /
      gameField.getBoundingClientRect().height) *
    100;

  if (keysPressed.has("w")) {
    playerPaddle.position = Math.max(0, playerPaddle.position - step);
  }
  if (keysPressed.has("s")) {
    playerPaddle.position = Math.min(
      100 - paddleHeightPercent,
      playerPaddle.position + step
    );
  }
}

// Inicia o loop de jogo
requestAnimationFrame(update);
