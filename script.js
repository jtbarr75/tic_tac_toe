const gameboard = (function () {

  var _board;
  var wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
  clearBoard();

  function add(mark, index) {
    _board[index] = mark;
  }

  function clearBoard() {
    _board = [];
    while (_board.length < 10) {
      _board.push(-1);
    }
  }

  function get(index) {
    return _board[index];
  }

  function board() {
    return _board;
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

  return {
    add, 
    clearBoard,
    get, 
    board,
    checkWin
  }
})();

const displayController = (function (gameboard) {

  var _mark = "O";

  for(let i=0; i<9; i++) {
    _addEventListener(i);
  }

  function render() {
    for(let i=0; i<9; i++) {
      box = _getBox(i);
      if (gameboard.get(i) != -1) {
        box.textContent = gameboard.get(i);
      }
    }
  }

  function _addEventListener(index) {
    box = _getBox(index);
    box.addEventListener("click", () => {
      if (event.target.innerHTML == "") {
        _switchMark();
        gameboard.add(_mark, event.target.dataset.index);
        _checkWin();
        render();
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
      for (let i in win) {
        _getBox(win[i]).classList.add("win");
      }
    }
  }

  return {
    render
  }
})(gameboard);

displayController.render();