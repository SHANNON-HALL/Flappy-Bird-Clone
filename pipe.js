class Pipe {

  constructor() {
    this.pipeWidth = 70;
    this.pos = width + this.pipeWidth;
    this.vel = 2;
    this.gap = 125;
    this.pipeHeight = random(height / 5, 2 * height / 3 - 80);
    this.safe = false;
  }

  // Draws pipe
  show() {
    stroke(0);
    fill(0, 255, 0, 100);

    // Top pipe
    image(pipeImages[1], this.pos, -374 + this.pipeHeight);
    // rect(this.pos, 0, this.pipeWidth, this.pipeHeight);

    // Bottom pipe
    image(pipeImages[0], this.pos, this.pipeHeight + this.gap);
    // rect(this.pos, height, this.pipeWidth, -(height - this.pipeHeight - this.gap));
  }

  // Moves pipe to the left
  update() {
    this.pos -= this.vel;
  }

  // Removes pipe if off screen
  checkIfOnScreen(pipes) {
    if (this.pos < -this.pipeWidth) {
      pipes.splice(this, 1);
    }
  }

  // Resets pipes position to the right of screen
  reset() {
    this.pos = width + this.pipeWidth;
    this.pipeHeight = random(height / 3, 2 * height / 3);
  }

  incrementScore(score) {
    if (!this.safe && abs((this.pos + (this.pipeWidth / 2.0)) - width / 4) < 2) {
      score++;
      this.safe = true;
      pointSound.play();
    }
    return score;
  }
}