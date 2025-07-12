const SPEED = 0.02;

export default class Paddle {
  constructor(paddleElement) {
    this.paddleElement = paddleElement;
    this.reset();
  }

  // Get/Set da posição vertical em %
  get position() {
    return parseFloat(
      getComputedStyle(this.paddleElement).getPropertyValue("--position")
    );
  }

  set position(value) {
    this.paddleElement.style.setProperty("--position", value);
  }

  // Retângulo do paddle para colisão
  rect() {
    return this.paddleElement.getBoundingClientRect();
  }

  // Centraliza o paddle verticalmente
  reset() {
    this.position = 50;
  }

  // Move em direção à posição vertical da bola
  update(delta, targetY) {
    this.position += SPEED * delta * (targetY - this.position);
  }
}
