const GameBoard = (() => {
  const gameboard = ["", "", "", "", "", "", "", "", ""];
  function updateBoard(index, value) {
    gameboard[index] = value;
  }
  return { gameboard, updateBoard };
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
      } else {
        console.log("the game is ", GameController.isGameOver());
      }
    }
    GameController.togglePlayer();
    for (let i = 0; i < GameBoard.gameboard.length; i++) {
      cells[i].textContent = GameBoard.gameboard[i];
    }
  }
  return { render };
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

  DisplayController.render();
  return { getCurrentPlayer, togglePlayer, getWinner, isGameOver };
})();

//
