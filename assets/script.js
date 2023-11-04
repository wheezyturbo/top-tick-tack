// const cells = document.querySelectorAll(".cell");
const startbtn = document.querySelector(".start-btn");
const main = document.querySelector(".main");
const game = document.querySelector(".game");
const modebtn = document.querySelector(".mode-btn");

modebtn.addEventListener("click", () => {
  let dataTheme = document.documentElement;
  let theme = dataTheme.getAttribute("data-theme");
  console.log(theme);
  if (theme == "light") dataTheme.setAttribute("data-theme", "dark");
  else dataTheme.setAttribute("data-theme", "light");
});

startbtn.addEventListener("click", () => {
  main.classList.add("hidden");
  game.classList.remove("hidden");
});


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
    const winner = GameController.getWinner().name;
    text.textContent = winner ? "The Winner is " + winner : "It's a Draw!";
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
  const playerOne = Player("Player One", "x");
  const playerTwo = Player("Player Two", "o");
  // let playerOne;
  // let playerTwo;
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
    currentPlayer = playerOne; //optional change depending on the way the game is to be played after restart
  }
  // (() => {
  //   const startMenu = document.createElement("div");
  //   startMenu.classList.add("startMenu");
  //   startMenu.innerHTML =
  //     "<div class='form'>PlayerOne: <input id = 'playerone' type='text'><br>PlayerTwo:<input id='playertwo' type='text'><br><button onclick='()=>{GameController.handleStart()}'>start</button></div>";
  //   document.body.appendChild(startMenu);
  // })();
  function handleStart() {
    console.log("hello");
    playerOne = Player(document.getElementById("playerone").value, "x");
    playerTwo = Player(document.getElementById("playertwo").value, "o");
    const startMenu = document.querySelector(".startMenu");
    document.body.removeChild(startMenu);
    DisplayController.render();
  }
  DisplayController.render();

  return {
    getCurrentPlayer,
    togglePlayer,
    getWinner,
    isGameOver,
    clearWinner,
    handleStart,
  };
})();


