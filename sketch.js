var birds = [];
var gravity;
var pipes;
var score, oldScore, count;

var numbers = [];
var birdImages = [];
var pipeImages = [];
var backgroundImage, end, floorImage, scoreboard, newScore, getReady, tap, bronze, silver, gold, platinum, ok;

var die, flap, pointSound, hit, swoosh;
var gameOver, flapping, ready;

var generationCount;

// var highScoreObject;

// Loading all pictures and sounds
function preload() {

  // Loading bird images
  birdImages[0] = loadImage("data/no_flap.PNG");
  birdImages[1] = loadImage("data/up_flap.PNG");
  birdImages[2] = loadImage("data/down_flap.PNG");

  // Loading pipe images
  pipeImages[0] = loadImage("data/pipe.PNG");
  pipeImages[1] = loadImage("data/pipe_inverted.PNG");

  // Loading number images
  for (var i = 0; i < 10; i++) {
    var number = str(i);
    number += ".PNG";
    numbers[i] = loadImage("data/" + number);
  }

  // Loading other images
  backgroundImage = loadImage("data/background.PNG");
  end = loadImage("data/end.PNG");
  floorImage = loadImage("data/floor.PNG");
  scoreboard = loadImage("data/scoreboard.PNG");
  newScore = loadImage("data/new.PNG");
  getReady = loadImage("data/get_ready.PNG");
  tap = loadImage("data/tap.PNG");
  bronze = loadImage("data/bronze.PNG");
  silver = loadImage("data/silver.PNG");
  gold = loadImage("data/gold.PNG");
  platinum = loadImage("data/platinum.PNG");
  ok = loadImage("data/ok.PNG");

  // Loading sound files
  die = loadSound("data/die.wav");
  flap = loadSound("data/wing.wav");
  pointSound = loadSound("data/point.wav");
  hit = loadSound("data/hit.wav");
  swoosh = loadSound("data/swooshing.wav");

  // Loading old high score
  // highScoreObject = loadJSON("highscore.json");
  // console.log(highScoreObject.highScore);
}

function setup() {
  createCanvas(500, 500);
  frameRate(60);
  
  // Making the bird, gravity, and the background
  for (var i = 0; i < 500; i++) {
    birds[i] = new Bird();
  }
  gravity = createVector(0, 0.3);

  // Making the pipes list and first pipe
  pipes = [];
  pipes.push(new Pipe());

  // Initializing score to zero and getting old high score
  score = 0;
  // oldScore = HighScore("high_score.txt", score);

  // Keeping track of time since ready
  count = 0;

  // Keeping track of some states
  gameOver = false;
  flapping = false;
  ready = false;

  generationCount = 1;
}

function draw() {
  background(backgroundImage);
  
  if (count % 100 == 0) ready = true;

  // Draw starting graphics
  if (!ready) {
    image(getReady, width / 2 - 100, 120);
    image(tap, width / 2 - 70, 200);
  }

  if (ready) {
    // Doing pipe stuff
    for (var pipe of pipes) {
      score = pipe.incrementScore(score);
      if (OneBirdAlive(birds)) pipe.update();
      pipe.show();
    }

    // Doing bird stuff
    for (var bird of birds) {
      bird.applyForce(gravity);
      bird.intersect(pipes);
      bird.edges();
      if (bird.alive) bird.think(pipes);
      bird.update();
    }

    count++;
  }

  for (var bird of birds) {
    bird.show();
  }

  // Remove pipes
  for (var i = pipes.length - 1; i >= 0; i--) {
    pipes[i].checkIfOnScreen(pipes);
  }

  // Adding new pipes
  if (count % 90 == 0 && ready && OneBirdAlive(birds)) pipes.push(new Pipe());


  // Drawing floor and score
  image(floorImage, 0, height - 75);
  // if (bird.alive);
  DrawScore(score);

  // If all birds die, reset
  if (!OneBirdAlive(birds)) {
    Mutate(birds);
    generationCount++;
    Reset();
  }

  // Drawing the generation count
  push();
  scale(0.4);
  translate(-200, 0);
  DrawScore(generationCount);
  pop();


  /*
  // If the bird dies, game over
  if (!bird.alive) {
    if (!gameOver) background(255);
    gameOver = true;
    image(end, width / 2 - end.width / 2, 100);
    ScoreBoard();
    image(ok, width / 2 - 14, 280);
  }
  */
}

function keyPressed() {
  // Move bird if space bar is pressed
  /*
  if (key == ' ' && bird.alive && !flapping) {
    bird.flap();
    flapping = true;
    if (!ready) ready = true;
  }
  */

  // Reset if 'r' is pressed
  if (key == 'r') Reset();
}

function mousePressed() {
  // if (bird.alive) {
  // bird.flap();
  if (!ready) ready = true;
  // }

  // Reset if "ok" is clicked
  if (mouseX > width / 2 - 14 && mouseX < width / 2 + 66 && mouseY > 280 && mouseY < 308 && gameOver) Reset();

}

function keyReleased() {
  // Bird stops flapping when space bar is released
  if (key == ' ') flapping = false;
}

// Draws score using sprites
function DrawScore(score) {
  image(numbers[floor(score % 10)], width / 2 - 12, 25);
  if (score > 9) image(numbers[floor((score / 10) % 10)], width / 2 - 37, 25);
  if (score > 99) image(numbers[floor((score / 100) % 10)], width / 2 - 62, 25);
  if (score > 999) image(numbers[floor((score / 1000) % 10)], width / 2 - 87, 25);
  if (score > 9999) image(numbers[floor((score / 10000) % 10)], width / 2 - 112, 25);
}


// Changes high score if necessary
function HighScore(fileName, score) {
  // Load text and get high score from first line
  console.log(loadStrings(fileName));
  var text = loadStrings(fileName);
  console.log(text);
  var highScore = int(text[0]);
  console.log(text[0]);
  if (score > highScore) {
    highScore = score;
    text[0] = str(score); // Replace old high score
    saveStrings(dataPath(fileName), text);
  }
  return highScore;
}

// Resets score, pipes, and bird
function Reset() {
  pipes.splice(0, pipes.length);
  pipes.push(new Pipe());
  for (var bird of birds) {
    bird.reset();
  }
  score = 0;
  gameOver = false;
  ready = false;
  count = 0;
}

// Animations shown when the game ends
function GameOverAnimation() {
  /* ANIMATE GAME OVER
   PLAY SWOOSH SOUND
   SCOREBOARD();
   */
}

// Shows the scoreboard
function ScoreBoard() {
  image(scoreboard, width / 2 - 90, 160);

  // Drawing score and high score
  push();
  scale(0.5);
  translate(460, 365);
  DrawScore(score);
  translate(0, 80);

  translate(240, 25);
  image(birdImages[0], 0, 0);

  // DrawScore(HighScore("high_score.txt", score));
  pop();

  // Draw "new" if new high score
  // if (score > oldScore) image(newScore, width / 2 + 45, height / 2 - 31);

  // Drawing medals ADD TWINKLES
  if (score > 39) { // Platinum
    image(platinum, 187, 203);
  } else if (score > 29) { // Gold
    image(gold, 187, 203);
  } else if (score > 19) { // Silver
    image(silver, 187, 203);
  } else if (score > 9) { // Bronze
    image(bronze, 187, 203);
  }
  // ADD BUTTONS
}

// Checks if there are any birds alive
function OneBirdAlive(birds) {
  for (var bird of birds) {
    if (bird.alive) return true;
  }
  return false;
}

// Mutates all bird brain's based on fittest bird's brain
function Mutate(birds) {
  var fittestBird;
  var highestScore = 0;
  for (var bird of birds) {
    if (bird.score > highestScore) {
      highestScore = bird.score;
      fittestBird = bird;
    }
  }

  for (var bird of birds) {
    bird.brain = fittestBird.brain.copy();
    bird.brain.mutate(0.1);
  }
}