const INITIAL_VELOCITY = 0.025;
const VELOCITY_INCREASE = 0.00001;

export default class Ball {
  constructor(ballElement) {
    this.ballElement = ballElement;
    this.reset();
  }

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

  rect() {
    return this.ballElement.getBoundingClientRect();
  }

  reset() {
    this.x = 50;
    this.y = 50;
    this.direction = { x: 0, y: 0 };

    while (
      Math.abs(this.direction.x) <= 0.2 ||
      Math.abs(this.direction.x) >= 0.9
    ) {
      const heading = randomNumberBetween(0, 2 * Math.PI);
      this.direction = {
        x: Math.cos(heading),
        y: Math.sin(heading),
      };
    }

    this.velocity = INITIAL_VELOCITY;
  }

  update(delta, gameFieldElement, paddleRects) {
    this.x += this.direction.x * this.velocity * delta;
    this.y += this.direction.y * this.velocity * delta;
    this.velocity += VELOCITY_INCREASE * delta;

    const ballRect = this.rect();
    const fieldRect = gameFieldElement.getBoundingClientRect();

    // Colisão com topo e base do campo
    if (ballRect.top <= fieldRect.top || ballRect.bottom >= fieldRect.bottom) {
      this.direction.y *= -1;
    }

    // Colisão com laterais do campo
    if (ballRect.left <= fieldRect.left || ballRect.right >= fieldRect.right) {
      this.direction.x *= -1;
    }

    // Colisão com paddles
    if (paddleRects.some((r) => isCollision(r, ballRect))) {
      this.direction.x *= -1;
    }
  }
}

function isCollision(rect_1, rect_2) {
  return (
    rect_1.left <= rect_2.right &&
    rect_1.right >= rect_2.left &&
    rect_1.top <= rect_2.bottom &&
    rect_1.bottom >= rect_2.top
  );
}

function randomNumberBetween(min, max) {
  return Math.random() * (max - min) + min;
}
