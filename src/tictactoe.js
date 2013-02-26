var T3 = { utils: {} };




T3.utils.emptyNode = function (node) {
  while (node.hasChildNodes()) { node.removeChild(node.lastChild); }
};

T3.utils.hasClass = function (node, testClass) {
  // based on jQuery's implementation: http://stackoverflow.com/a/5085587
  var className = ' ' + node.className + ' ';
  return className.indexOf(' ' + testClass + ' ') > -1;
};

T3.utils.isACell = function (node) {
  return T3.utils.hasClass(node, 't3-cell');
};




T3.Board = function(containerID) {
  this.size = 5;
  this.currentPlayer = this.X_CELL;

  this.buildBoard(containerID);
  this.buildCells();

  this.draw();
};

T3.Board.prototype.EMPTY_CELL = ' ';
T3.Board.prototype.X_CELL = 'X';
T3.Board.prototype.O_CELL = 'O';

T3.Board.prototype.buildBoard = function(containerID) {
  var container = document.getElementById(containerID);

  this.el = document.createElement('div');
  container.appendChild(this.el);

  container.addEventListener('click', function(e) {
    if (T3.utils.isACell(e.target)) {
      var row = e.target.getAttribute('data-row');
      var col = e.target.getAttribute('data-col');
      this.move(row, col);
    }
  }.bind(this));
};

T3.Board.prototype.forEachCell = function (func) {
  for (var row = 0; row < this.size; row++) {
    for (var col = 0; col < this.size; col++) {
      func.call(this, this.state[row][col]);
    }
  }
};

T3.Board.prototype.isGameOver = function() {
  var isOver = true;
  this.forEachCell(function(cell) {
    if (cell.isEmpty()) { isOver = false; }
  });
  return isOver;
};

T3.Board.prototype.buildCells = function() {
  this.state = [];

  for (var row = 0; row < this.size; row++) {
    var rowCells = [];
    for (var col = 0; col < this.size; col++) {
      rowCells.push(new T3.Cell(row, col, this));
    }
    this.state.push(rowCells);
  }
};

T3.Board.prototype.isLegalMove = function (row, col) {
  return row < this.state.length && col < this.state[0].length;
};

T3.Board.prototype.getCell = function (row, col) {
  return this.state[row][col];
};

T3.Board.prototype.draw = function() {
  T3.utils.emptyNode(this.el);

  this.forEachCell(function (cell) {
    this.el.appendChild(cell.getElement());
  });
};

T3.Board.prototype.move = function (row, col) {
  var cell = this.state[row][col];

  if (cell !== undefined && !this.isGameOver() && this.isLegalMove(row, col) && cell.isEmpty()) {
    cell.value = this.currentPlayer;
    this.currentPlayer = this.currentPlayer === this.X_CELL ? this.O_CELL : this.X_CELL;

    this.draw();

    if (this.isGameOver()) { this.endGame(); }
  }
};

T3.Board.prototype.endGame = function() {
  console.log('Game Over!');
};




T3.Cell = function (row, col, board) {
  this.board = board;
  this.row = row;
  this.col = col;
  this.value = board.EMPTY_CELL;
};

T3.Cell.prototype.isEmpty = function() {
  return this.value === this.board.EMPTY_CELL;
};

T3.Cell.prototype.getClasses = function() {
  var playerClass = this.isEmpty() ? 't3-empty' : 't3-p' + this.value;
  return [ 't3-cell', 't3-c' + this.col, 't3-r' + this.row, playerClass ].join(' ');
};

T3.Cell.prototype.getElement = function() {
  var el = document.createElement('div');
  el.setAttribute('class', this.getClasses())
  el.setAttribute('data-row', this.row);
  el.setAttribute('data-col', this.col);
  el.appendChild(document.createTextNode(this.value));

  return el;
};