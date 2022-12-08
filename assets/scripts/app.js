const playfield = document.querySelector(".playfield");
const playerStartPos = document.querySelector(".player");
const playfieldChildCount = playfield.childElementCount;
const enemies = [];
document.querySelectorAll(".enemy").forEach((element) => {
  enemies.push(element);
});
const scoreText = document.querySelector("#scoreText");
let score = 0,
  coinCount = 0;

const roundText = document.querySelector(".roundText");

const enemyPos = [144, 160, 161, 162];
const enemyDir = [-17, 1, -17, -1];

const line = 17,
  interval = 300;

let direction = -17,
  currentPos = 263,
  gameOver = false,
  roundWon = false,
  gameStarted = false,
  round = 1;

for (let i = 0; i < playfield.childElementCount; i++) {
  const block = playfield.children[i];
  if (block.className !== "") continue;
  const coin = document.createElement("div");
  coin.className = "coin";
  block.append(coin);
  coinCount++;
}

function startGameClick() {
  if (gameStarted) return;

  gameStarted = true;

  startGame();
}

function startGame() {
  roundText.style = "opacity: 1;";
  let sound = new Audio("assets/sounds/nextRound.ogg");
  sound.play();
  setTimeout(enableControls, 2500);
}

function nextRound() {
  roundWon = false;
  round++;
  roundText.textContent = "Round: " + round;
  resetMap();
  startGame();
}

function resetMap() {
  for (let i = 0; i < playfield.childElementCount; i++) {
    const element = playfield.children[i];
    if (element.className === "player" || element.className === "enemy") {
      element.className = "";
    }

    if (element.childElementCount > 0) {
      element.children[0].remove();
    }
  }

  direction = -17;
  currentPos = 263;
  playfield.children[currentPos].className = "player";

  enemyPos[0] = 144;
  enemyPos[1] = 160;
  enemyPos[2] = 161;
  enemyPos[3] = 162;

  for (let i = 0; i < enemyPos.length; i++) {
    const element = playfield.children[enemyPos[i]];
    element.className = "enemy";
    enemies[i] = element;
  }

  enemyDir[0] = -17;
  enemyDir[1] = 1;
  enemyDir[2] = -17;
  enemyDir[3] = -1;

  for (let i = 0; i < playfield.childElementCount; i++) {
    const block = playfield.children[i];
    if (block.className !== "") continue;
    const coin = document.createElement("div");
    coin.className = "coin";
    block.append(coin);
    coinCount++;
  }
}

function enableControls() {
  roundText.style = "opacity: 0";
  movePlayer();

  moveEnemy(0);
  setTimeout(() => {
    moveEnemy(1);
  }, interval * 2);
  setTimeout(() => {
    moveEnemy(2);
  }, interval);
  setTimeout(() => {
    moveEnemy(3);
  }, interval * 4);
}

function moveEnemy(enemyIndex) {
  if (gameOver || roundWon) return;

  const choices = [];

  switch (true) {
    case enemyDir[enemyIndex] === -17 || enemyDir[enemyIndex] === 17:
      const left = playfield.children[enemyPos[enemyIndex] - 1];
      const right = playfield.children[enemyPos[enemyIndex] + 1];
      const currentDirUpDown =
        playfield.children[enemyPos[enemyIndex] + enemyDir[enemyIndex]];

      left !== undefined &&
        left.className === "" &&
        !checkComingFromSides(enemyPos[enemyIndex] - 1, enemyPos[enemyIndex]) &&
        choices.push([left, -1, enemyPos[enemyIndex] - 1]);
      right !== undefined &&
        right.className === "" &&
        !checkComingFromSides(enemyPos[enemyIndex] + 1, enemyPos[enemyIndex]) &&
        choices.push([right, 1, enemyPos[enemyIndex] + 1]);
      currentDirUpDown !== undefined &&
        currentDirUpDown.className === "" &&
        choices.push([
          currentDirUpDown,
          enemyDir[enemyIndex],
          enemyPos[enemyIndex] + enemyDir[enemyIndex],
        ]);
      break;

    case enemyDir[enemyIndex] === -1 || enemyDir[enemyIndex] === 1:
      const up = playfield.children[enemyPos[enemyIndex] - 17];
      const down = playfield.children[enemyPos[enemyIndex] + 17];
      const currentDirLeftRight =
        playfield.children[
          (enemyPos[enemyIndex] + enemyDir[enemyIndex],
          enemyPos[enemyIndex] + enemyDir[enemyIndex])
        ];

      up !== undefined &&
        up.className === "" &&
        choices.push([up, -17, enemyPos[enemyIndex] - 17]);
      down !== undefined &&
        down.className === "" &&
        choices.push([down, 17, enemyPos[enemyIndex] + 17]);
      currentDirLeftRight !== undefined &&
        !checkComingFromSides(
          enemyPos[enemyIndex] + enemyDir[enemyIndex],
          enemyPos[enemyIndex]
        ) &&
        currentDirLeftRight.className === "" &&
        choices.push([
          currentDirLeftRight,
          enemyDir[enemyIndex],
          enemyPos[enemyIndex] + enemyDir[enemyIndex],
        ]);
      break;
  }

  for (let i = 0; i < 4; i++) {
    const checks = [
      [
        playfield.children[enemyPos[enemyIndex] - 17],
        enemyPos[enemyIndex] - 17,
      ],
      [
        playfield.children[enemyPos[enemyIndex] + 17],
        enemyPos[enemyIndex] + 17,
      ],
      [playfield.children[enemyPos[enemyIndex] - 1], enemyPos[enemyIndex] - 1],
      [playfield.children[enemyPos[enemyIndex] + 1], enemyPos[enemyIndex] + 1],
    ];

    for (let index = 0; index < checks.length; index++) {
      const element = checks[index][0];
      if (element === undefined) continue;
      const num = checks[index][1];
      const checkFromSides =
        num === enemyPos[enemyIndex] + 1
          ? !checkComingFromSides(checks[index][1], enemyPos[enemyIndex])
          : num === enemyPos[enemyIndex] - 1
          ? !checkComingFromSides(checks[index][1], enemyPos[enemyIndex])
          : true;
      if (checkFromSides && element.className === "player") {
        gameIsOver();
        return;
      }
    }
  }

  if (choices.length === 0) {
    enemyDir[enemyIndex] = -enemyDir[enemyIndex];
    setTimeout(() => {
      moveEnemy(enemyIndex);
    }, interval);
    return;
  }

  const randomNumber = Math.floor(Math.random() * choices.length);

  const element = choices[randomNumber][0];

  element.className = "enemy";
  enemies[enemyIndex].className = "";
  enemies[enemyIndex] = element;

  enemyDir[enemyIndex] = choices[randomNumber][1];
  enemyPos[enemyIndex] = choices[randomNumber][2];

  setTimeout(() => {
    moveEnemy(enemyIndex);
  }, interval);
}

function movePlayer() {
  if (gameOver || roundWon) return;
  const newPos = currentPos + direction;

  if (
    newPos < 0 ||
    newPos > playfield.childElementCount - 1 ||
    checkComingFromSides(newPos, currentPos)
  ) {
    setTimeout(movePlayer, interval);
    return;
  }

  const nextElement = playfield.children[newPos];
  if (nextElement.className === "") {
    nextElement.className = "player";
    playfield.children[currentPos].className = "";
    currentPos = newPos;
    if (nextElement.childElementCount > 0) {
      const element = nextElement.children[0];
      if (element.className === "coin") {
        let sound = new Audio("assets/sounds/coin.wav");
        sound.play();
        score += 10;
        scoreText.textContent = score;
        element.remove();
        coinCount--;
        if (coinCount === 0) {
          roundWon = true;
          let sound = new Audio("assets/sounds/roundComplete.wav");
          sound.play();
          setTimeout(nextRound, 2500);
        }
      }
    }
  } else if (nextElement.className === "enemy") {
    gameIsOver();
    return;
  }

  setTimeout(movePlayer, interval);
}

function gameIsOver() {
  gameOver = true;
  roundText.textContent = "GAME OVER!";
  roundText.style = "opacity: 1";
  let sound = new Audio("assets/sounds/GameOver.wav");
  sound.play();
}

function checkComingFromSides(newPos, currentPos) {
  const value = newPos % 17;
  const value2 = currentPos % 17;

  if ((value === 16 && value2 === 0) || (value === 0 && value2 === 16))
    return true;
  return false;
}

function onKeyPress(event) {
  const key = event.key;

  switch (key) {
    case "ArrowUp":
      direction = -line;
      break;
    case "ArrowDown":
      direction = line;
      break;
    case "ArrowRight":
      direction = 1;
      break;
    case "ArrowLeft":
      direction = -1;
      break;
    case "a":
      gameOver = true;
      break;
  }
}
