const INITIAL_VELOCITY = 0.025;
const VELOCITY_INCREASE = 0.00001;

export default class Ball {
  constructor(ballElement) {
    this.ballElement = ballElement;
    this.reset();
  }

  // Getters/setters para posição via CSS custom properties
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

  // Retângulo da bola para colisão
  rect() {
    return this.ballElement.getBoundingClientRect();
  }

  // Centraliza bola e define direção aleatória válida
  reset() {
    this.x = 50;
    this.y = 50;
    this.direction = { x: 0, y: 0 };

    while (
      Math.abs(this.direction.x) <= 0.2 ||
      Math.abs(this.direction.x) >= 0.9
    ) {
      const angle = randomBetween(0, 2 * Math.PI);
      this.direction = { x: Math.cos(angle), y: Math.sin(angle) };
    }

    this.velocity = INITIAL_VELOCITY;
  }

  // Atualiza posição, velocidade e trata colisões
  update(delta, fieldElement, paddleRects) {
    this.x += this.direction.x * this.velocity * delta;
    this.y += this.direction.y * this.velocity * delta;
    this.velocity += VELOCITY_INCREASE * delta;

    const ballRect = this.rect();
    const fieldRect = fieldElement.getBoundingClientRect();

    // Rebater no topo e base do campo
    if (ballRect.top <= fieldRect.top || ballRect.bottom >= fieldRect.bottom) {
      this.direction.y *= -1;
    }

    // Rebater nos paddles e reposicionar para evitar "grudar"
    for (const paddleRect of paddleRects) {
      if (isColliding(paddleRect, ballRect)) {
        this.direction.x *= -1;

        // Reposiciona bola fora do paddle para evitar múltiplas colisões
        if (this.direction.x > 0) {
          this.x =
            ((paddleRect.right - fieldRect.left) * 100) / fieldRect.width +
            (ballRect.width * 100) / fieldRect.width;
        } else {
          this.x =
            ((paddleRect.left - fieldRect.left) * 100) / fieldRect.width -
            (ballRect.width * 100) / fieldRect.width;
        }
        break; // Só precisa tratar uma colisão por atualização
      }
    }

    // OBS: colisões laterais esquerda/direita são tratadas externamente
  }
}

// Colisão AABB simples entre dois retângulos
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
