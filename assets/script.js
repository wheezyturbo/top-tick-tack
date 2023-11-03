const GameBoard = (() => {
  let gameboard = ["", "", "", "", "", "", "", "", ""];
  function updateBoard(index, value) {
    gameboard[index] = value;
  }
  function reRender() {
    gameboard.forEach((_cell, index) => {
      updateBoard(index, "");
    });
    GameController.clearWinner();
    const board = (document.querySelector(".board").innerHTML = "");
    DisplayController.render();
    DisplayController.removeResults();
  }
  return { gameboard, updateBoard, reRender };
})();

function Player(name, move) {
  this.name = name;
  this.move = move;
  return { name, move };
}

const DisplayController = (() => {
  const board = document.querySelector(".board");
  function render() {
    GameBoard.gameboard.forEach((cell, index) => {
      const div = document.createElement("div");
      div.classList.add("cell");
      div.id = index;
      div.addEventListener(
        "click",
        () => {
          handleClick(div);
        },
        { once: true }
      );
      board.appendChild(div);
    });
  }
  function handleClick(cell) {
    const cells = document.querySelectorAll(".cell");
    console.log(GameController.getCurrentPlayer().name);
    GameBoard.updateBoard(cell.id, GameController.getCurrentPlayer().move);
    if (GameController.isGameOver(GameController.getCurrentPlayer())) {
      if (GameController.getWinner()) {
        console.log("winner = ", GameController.getWinner().name);
        // GameBoard.reRender();
        renderResults();
      } else {
        console.log("the game is ", GameController.isGameOver());
        // GameBoard.reRender();
        renderResults();
      }
    }
    GameController.togglePlayer();
    for (let i = 0; i < GameBoard.gameboard.length; i++) {
      cells[i].textContent = GameBoard.gameboard[i];
    }
  }
  function renderResults() {
    const result = document.createElement("div");
    result.classList.add("resultDiv");
    const button = document.createElement("button");
    button.textContent = "restart";
    button.addEventListener("click", GameBoard.reRender);
    const text = document.createElement("h2");
    text.textContent = "winner = " + GameController.getWinner().name;
    result.appendChild(text);
    result.appendChild(button);
    document.body.appendChild(result);
  }
  function removeResults() {
    const result = document.querySelector(".resultDiv");
    document.body.removeChild(result);
  }
  return { render, removeResults };
})();

const GameController = (() => {
  const WINNING_PATTERNS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  let winner = false;
  let gameOver = false;
  const playerOne = Player("test", "x");
  const playerTwo = Player("idk", "o");
  var currentPlayer = playerOne;
  function togglePlayer() {
    console.log(currentPlayer == playerOne, currentPlayer.name);
    if (currentPlayer == playerOne) currentPlayer = playerTwo;
    else currentPlayer = playerOne;
  }
  function getCurrentPlayer() {
    return currentPlayer;
  }
  function getWinner() {
    return winner;
  }
  function isDraw() {
    return GameBoard.gameboard.every((cell) => {
      return cell == playerOne.move || cell == playerTwo.move;
    });
  }
  function isGameOver() {
    gameOver = WINNING_PATTERNS.some((combinations) => {
      return combinations.every((index) => {
        return GameBoard.gameboard[index] === currentPlayer.move;
      });
    });

    if (gameOver) {
      winner = currentPlayer;
    } else if (isDraw()) {
      return "draw";
    }

    return gameOver;
  }
  function clearWinner() {
    winner = false;
    gameOver = false;
  }

  DisplayController.render();
  return { getCurrentPlayer, togglePlayer, getWinner, isGameOver, clearWinner };
})();
