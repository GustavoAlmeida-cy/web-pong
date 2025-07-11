import Ball from "./ball.js";
import Paddle from "./paddle.js";

// Seleciona os elementos do DOM
const gameField = document.getElementById("game-field");
const ballElement = document.getElementById("ball");
const playerPaddleElement = document.getElementById("player-paddle");
const computerPaddleElement = document.getElementById("computer-paddle");

// Instâncias
const ball = new Ball(ballElement);
const playerPaddle = new Paddle(playerPaddleElement);
const computerPaddle = new Paddle(computerPaddleElement);
let lastTime = null;

// Atualização do jogo
function update(time) {
  if (lastTime != null) {
    const delta = time - lastTime;
    ball.update(delta, gameField);
    computerPaddle.update(delta, ball.y);
  }

  lastTime = time;
  window.requestAnimationFrame(update);
}

// Movimento do jogador com o mouse
document.addEventListener("mousemove", (e) => {
  const fieldRect = gameField.getBoundingClientRect();
  const paddleRect = playerPaddleElement.getBoundingClientRect();

  // Altura da raquete em % do campo
  const paddleHeightPercent = (paddleRect.height / fieldRect.height) * 100;

  // Posição do mouse relativa ao topo do campo
  const mouseY = e.clientY - fieldRect.top;

  // Converter para porcentagem da altura do campo
  let percent = (mouseY / fieldRect.height) * 100;

  // Limitar para que o fundo da raquete (posição) nunca ultrapasse 100%
  percent = Math.min(100 - paddleHeightPercent, Math.max(0, percent));

  playerPaddle.position = percent;
});

// Inicia o loop
window.requestAnimationFrame(update);
