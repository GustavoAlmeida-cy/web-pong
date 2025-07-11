import Ball from "./ball.js";

// Seleciona os elementos do DOM
const ballElement = document.getElementById("ball");
const gameField = document.getElementById("game-field");

// Cria a instância da bola
const ball = new Ball(ballElement);

let lastTime = null;

// Função principal de atualização do jogo
function update(time) {
  if (lastTime != null) {
    const delta = time - lastTime;
    ball.update(delta, gameField); // Passa o campo como limite
  }

  lastTime = time;
  window.requestAnimationFrame(update);
}

// Inicia o loop de animação
window.requestAnimationFrame(update);
