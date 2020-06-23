const gameboard = (function () {

  var _board;
  const length = 9;
  var wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
  clearBoard();

  function add(mark, index) {
    _board[index] = mark;
  }

  function clearBoard() {
    _board = [];
    while (_board.length < 9) {
      _board.push(-1);
    }
  }

  function get(index) {
    return _board[index];
  }

  function checkWin() {
    for (let i=0; i<wins.length; i++) {
      let first = wins[i][0];
      let second = wins[i][1];
      let third = wins[i][2];
      if (_board[first] != -1 && _board[first] == _board[second] && _board[second] == _board[third]){
        return wins[i];
      }
    }
    return false;
  }

  function blockOrWinLocation(mark) {
    for (let i=0; i<wins.length; i++) {
      let first = wins[i][0];
      let second = wins[i][1];
      let third = wins[i][2];
      if (get(first) == mark && get(first) == get(second) && get(third) == -1) {
        return third;
      } else if (get(second) == mark && get(second) == get(third) && get(first) == -1) {
        return first;
      } else if (get(third) == mark && get(first) == get(third) && get(second) == -1) {
        return second;
      }
    }
    return -1;
  }

  return {
    add, 
    clearBoard,
    get, 
    checkWin,
    length,
    blockOrWinLocation
  }
})();

const computer = (function (board) {

  function choose() {
    choice1 = board.blockOrWinLocation("O");
    choice2 = board.blockOrWinLocation("X");
    if (choice1 != -1) {
      choice = choice1;
    } else if (choice2 != -1) {
      choice = choice2;
    } else {
      choices = _getAvailableChoices();
      choice = choices[Math.floor(Math.random() * choices.length)];
    }
    return choice;
  }

  function _getAvailableChoices() {
    choices = [];
    for (let i=0; i<board.length; i++) {
      if (board.get(i) == -1) {
        choices.push(i);
      }
    }
    return choices;
  }

  return {
    choose
  }
})(gameboard);

const displayController = (function (gameboard) {

  var _mark = "X";
  var _running = true;
  var _computer = false;

  _addResetButton();
  _addVsPlayerButton();
  _addVsComputerButton();

  for(let i=0; i<9; i++) {
    _addEventListener(i);
  }

  function render() {
    for(let i=0; i<9; i++) {
      box = _getBox(i);
      if (gameboard.get(i) == -1) {
        box.textContent = "";
        if (box.classList.contains("win")) {
          box.classList.remove("win");
        }
      }
      else {
        box.textContent = gameboard.get(i);
      }
    }
  }

  function _addEventListener(index) {
    box = _getBox(index);
    box.addEventListener("click", () => {
      if (_running &&   event.target.innerHTML == "") {
        gameboard.add(_mark, event.target.dataset.index);
        _checkWin();
        _switchMark();
        render();
        if (_running && _computer) {
          _running = false;
          setTimeout(() => { _computerMove(); }, 1000);
        }
      }
    })
  }

  function _switchMark() {
    _mark == "X" ? _mark = "O" : _mark = "X";
  }

  function _getBox(index) {
    return document.querySelector(`div[data-index='${index}']`);
  }

  function _checkWin() {
    win = gameboard.checkWin();
    if (win) {
      _running = false;
      for (let i in win) {
        _getBox(win[i]).classList.add("win");
      }
    }
  }

  function _computerMove() {
    gameboard.add(_mark, computer.choose());
    _checkWin();
    _switchMark();
    render();
    _running = true;
  }

  function _addResetButton() {
    document.querySelector(".reset").addEventListener("click", () => {
      gameboard.clearBoard();
      _running = true;
      render();
    })
  }

  function _addVsPlayerButton() {
    document.querySelector(".player").addEventListener("click", () => {
      event.target.classList.add("selected");
      document.querySelector(".computer").classList.remove("selected");
      _computer = false;
      gameboard.clearBoard();
      render();
    })
  }

  function _addVsComputerButton() {
    document.querySelector(".computer").addEventListener("click", () => {
      event.target.classList.add("selected");
      document.querySelector(".player").classList.remove("selected");
      _computer = true;
      gameboard.clearBoard();
      render();
    })
  }

  return {
    render
  }
})(gameboard);

displayController.render();