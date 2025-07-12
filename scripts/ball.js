const INITIAL_VELOCITY = 0.025;
const VELOCITY_INCREASE = 0.00001;

export default class Ball {
  constructor(ballElement) {
    this.ballElement = ballElement;
    this.reset();
  }

  // Getters e setters para posição usando CSS custom properties
  get x() {
    return parseFloat(
      getComputedStyle(this.ballElement).getPropertyValue("--x")
    );
  }

  set x(value) {
    this.ballElement.style.setProperty("--x", value);
  }

  get y() {
    return parseFloat(
      getComputedStyle(this.ballElement).getPropertyValue("--y")
    );
  }

  set y(value) {
    this.ballElement.style.setProperty("--y", value);
  }

  // Retorna o retângulo da bola para colisão
  rect() {
    return this.ballElement.getBoundingClientRect();
  }

  // Centraliza e define uma nova direção aleatória válida
  reset() {
    this.x = 50;
    this.y = 50;
    this.direction = { x: 0, y: 0 };

    while (
      Math.abs(this.direction.x) <= 0.2 ||
      Math.abs(this.direction.x) >= 0.9
    ) {
      const angle = randomBetween(0, 2 * Math.PI);
      this.direction = {
        x: Math.cos(angle),
        y: Math.sin(angle),
      };
    }

    this.velocity = INITIAL_VELOCITY;
  }

  // Atualiza posição e trata colisões
  update(delta, fieldElement, paddleRects) {
    this.x += this.direction.x * this.velocity * delta;
    this.y += this.direction.y * this.velocity * delta;
    this.velocity += VELOCITY_INCREASE * delta;

    const ballRect = this.rect();
    const fieldRect = fieldElement.getBoundingClientRect();

    // Rebater no topo/base
    if (ballRect.top <= fieldRect.top || ballRect.bottom >= fieldRect.bottom) {
      this.direction.y *= -1;
    }

    // Rebater nos paddles
    if (paddleRects.some((paddleRect) => isColliding(paddleRect, ballRect))) {
      this.direction.x *= -1;
    }

    // OBS: colisão lateral (left/right) está sendo tratada no script principal
  }
}

// Detecta colisão entre dois retângulos (AABB)
function isColliding(r1, r2) {
  return (
    r1.left <= r2.right &&
    r1.right >= r2.left &&
    r1.top <= r2.bottom &&
    r1.bottom >= r2.top
  );
}

// Gera número aleatório entre min e max
function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}
