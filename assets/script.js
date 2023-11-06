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
  GameController.init();
});

const PlayerSelection = (() => {
  const topArrows = document.querySelectorAll(".p-one");
  const bottomArrows = document.querySelectorAll(".p-two");
  topArrows.forEach((arrow) => {
    arrow.addEventListener("click", () => {
      console.log("clicked");
      const player = document.querySelector("#player-one");
      player.textContent =
        player.textContent == "Player" ? "Computer" : "Player";
    });
  });
  bottomArrows.forEach((arrow) => {
    arrow.addEventListener("click", () => {
      const player = document.querySelector("#player-two");
      player.textContent =
        player.textContent == "Player" ? "Computer" : "Player";
    });
  });
  function getPlayerOne() {
    console.log(document.querySelector("#player-one").textContent);
    return document.querySelector("#player-one").textContent;
  }
  function getPlayerTwo() {
    return (player = document.querySelector("#player-two").textContent);
  }
  return { getPlayerOne, getPlayerTwo };
})();
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

    // console.log(GameController.getCurrentPlayer().name);
    if (GameController.getCurrentPlayer().name == "Player") {
      GameBoard.updateBoard(cell.id, GameController.getCurrentPlayer().move);
      GameController.togglePlayer();
      checkGameOver();
    } else {
      GameBoard.updateBoard(
        AI.decision(),
        GameController.getCurrentPlayer().move
      );
      GameController.togglePlayer();
      checkGameOver();
    }
    console.log(
      GameBoard.gameboard.reduce((acc, curr, index) => {
        if (curr === "") {
          acc.push(index);
        }
        return acc;
      }, [])
    );
    for (let i = 0; i < GameBoard.gameboard.length; i++) {
      cells[i].textContent = GameBoard.gameboard[i];
    }
  }
  function checkGameOver() {
    if (GameController.isGameOver()) {
      if (GameController.getWinner()) {
        console.log("winner = ", GameController.getWinner().name);
        // GameBoard.reRender();
        return renderResults();
      } else {
        console.log("the game is ", GameController.isGameOver());
        // GameBoard.reRender();
        return renderResults();
      }
    }
  }
  function renderResults() {
    const existingResult = document.querySelector(".resultDiv");
    if (existingResult) {
      document.body.removeChild(existingResult);
    }

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
  const player = document.querySelector("#player-one");
  const against = document.querySelector("#player-two");
  // let playerOne = Player(PlayerSelection.getPlayerOne(), "x");
  // let playerTwo = Player(PlayerSelection.getPlayerTwo(), "o");
  let playerOne;
  let playerTwo;
  var currentPlayer;

  function getCurrentPlayer() {
    return currentPlayer;
  }
  function togglePlayer() {
    // console.log(currentPlayer == playerOne, currentPlayer.name);
    if (currentPlayer == playerOne) currentPlayer = playerTwo;
    else currentPlayer = playerOne;
  }
  function getWinner() {
    console.log(winner, getCurrentPlayer());
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
  DisplayController.render();

  return {
    getCurrentPlayer,
    togglePlayer,
    getWinner,
    isGameOver,
    clearWinner,
    init: function () {
      playerOne = Player(PlayerSelection.getPlayerOne(), "x");
      playerTwo = Player(PlayerSelection.getPlayerTwo(), "o");
      currentPlayer = playerOne;
    },
  };
})();

const AI = (() => {
  function getFreeCells() {
    return GameBoard.gameboard.reduce((acc, curr, index) => {
      if (curr === "") {
        acc.push(index);
      }
      return acc;
    }, []);
  }
  function decision() {
    return getFreeCells()[Math.floor(Math.random() * getFreeCells().length)];
  }
  return {
    decision,
  };
})();
