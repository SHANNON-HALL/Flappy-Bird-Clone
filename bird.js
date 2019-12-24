class Bird {

  constructor() {
    this.pos = createVector(width / 4, height / 2);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);

    this.r = 12.0;
    this.coloring = color(255, 255, 153);
    this.alive = true;
    this.angle = 0;

    this.brain = new NeuralNetwork(4, 4, 1);
    this.score = 0;
  }

  // Draws bird
  show() {
    stroke(0, 100);
    fill(this.coloring);

    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    if (this.alive) {
      image(birdImages[floor(frameCount / 4 % 3)], -this.r * 1.5, -this.r);
    } else {
      image(birdImages[0], -this.r * 1.5, -this.r);
    }
    pop();

    // ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
  }

  think(pipes) {
    var inputs = [];
    inputs[0] = this.pos.y / height;
    inputs[1] = map(this.vel.y, -4, 4, 0, 1);
    inputs[2] = map(this.findNearestPipe(pipes).pos, 0, width + this.findNearestPipe(pipes).pipeWidth, 0, 1);
    inputs[3] = map(this.findNearestPipe(pipes).pipeHeight, height / 5, 2 * height / 3 - 80, 0, 1);

    var output = this.brain.predict(inputs);
    if (output[0] > 0.5) this.flap();
  }

  // Moves bird around
  update() {
    this.pos.add(this.vel);
    this.vel.add(this.acc);

    this.acc.mult(0);
    this.vel.limit(4);
    this.angle = constrain(this.angle, -PI / 2, PI / 2);
    this.pos.y = constrain(this.pos.y, this.r, height - 75 - this.r);
    this.angle = constrain(this.angle, -PI / 4, PI / 2);

    if (!this.alive && OneBirdAlive(birds)) this.pos.x -= 2;

    if (this.alive) this.score++;
  }

  // Applies force to bird
  applyForce(force) {
    this.acc.add(force);

    if (force == gravity) {
      this.angle += force.heading() * 0.03;
    } else {
      var newAngle = this.angle + force.heading() * 5;
      this.angle = lerp(this.angle, newAngle, 0.5);
    }
  }

  // Bird dies if it hits any pipes
  intersect(pipes) {
    for (var pipe of pipes) {
      if (this.pos.x + this.r > pipe.pos && this.pos.x - this.r < pipe.pos + pipe.pipeWidth) {
        if (this.pos.y - this.r < pipe.pipeHeight || this.pos.y + this.r > pipe.pipeHeight + pipe.gap) {
          this.die();
        }
      }
    }
  }

  // Bird dies if it hits the edges
  edges() {
    if (this.pos.y + this.r > height - 75 - 1) {
      this.die();
    }
  }

  // Makes bird flap
  flap() {
    // flap.play();
    this.applyForce(createVector(0, -10));
  }

  // Bird dies
  die() {
    this.coloring = color(255, 0, 0);
    if (this.alive) {
      hit.play();
      die.play();
    }
    this.alive = false;
  }

  // Returns the first unsafe pipe
  findNearestPipe(pipes) {
    for (var pipe of pipes) {
      if (!pipe.safe) return pipe;
    }
  }

  // Resets important variables
  reset() {
    this.pos = createVector(width / 4, height / 2);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.coloring = color(255, 255, 153);
    this.alive = true;
    this.angle = 0;
    this.score = 0;
  }
}