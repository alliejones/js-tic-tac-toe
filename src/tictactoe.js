var T3 = { utils: {} };

// Anti diagonal win condition checking does not work

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

T3.utils.cellCoordinates = function (cells) {
  return cells.map(function(cell) {
    return cell.row + ',' + cell.col;
  });
};



T3.Board = function(containerID, size, scope) {
  // allows to pass a different scope for testing
  this.scope = scope || document;

  this.size = size || 3;
  this.moveCount = 0;
  this.maxMoves = this.size * this.size;
  this.currentPlayer = this.X_CELL;

  this.buildBoard(containerID);
  this.buildCells();

  this.draw();
};

T3.Board.prototype.EMPTY_CELL = ' ';
T3.Board.prototype.X_CELL = 'X';
T3.Board.prototype.O_CELL = 'O';

T3.Board.prototype.buildBoard = function(containerID) {
  var container = this.scope.getElementById(containerID);

  this.el = this.scope.createElement('div');
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

T3.Board.prototype.isWinningMove = function(row, col) {
  var cell = this.getCell(row,col);

  var horizontalMatch = this.allMatch(cell.getHorizontalNeighbors());
  var verticalMatch = this.allMatch(cell.getVerticalNeighbors());

  var diagonalNeighbors = cell.getDiagonalNeighbors();
  var diagonalMatch = diagonalNeighbors.length === this.size && this.allMatch(cell.getDiagonalNeighbors());

  var antiDiagonalNeighbors = cell.getAntiDiagonalNeighbors();
  var antiDiagonalMatch = antiDiagonalNeighbors.length === this.size && this.allMatch(cell.getAntiDiagonalNeighbors());

  return horizontalMatch || verticalMatch || diagonalMatch || antiDiagonalMatch;
};

T3.Board.prototype.allMatch = function(cells) {
  var match = true;
  for (var i = 0; i < cells.length; i++) {
    if (cells[i].value !== this.currentPlayer) {
      match = false;
      break;
    }
  }
  return match;
};

T3.Board.prototype.isGameOver = function() {
  return this.maxMoves <= this.moveCount;
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
  return row < this.size && col < this.size;
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

    if (this.isWinningMove(row, col)) {
      console.log('Game over! ' + this.currentPlayer + ' wins!');
    }

    this.moveCount++;

    if (this.isGameOver()) { this.endGame(); }

    this.currentPlayer = this.currentPlayer === this.X_CELL ? this.O_CELL : this.X_CELL;
    this.draw();
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
  var el = this.board.scope.createElement('div');
  el.setAttribute('class', this.getClasses())
  el.setAttribute('data-row', this.row);
  el.setAttribute('data-col', this.col);
  el.appendChild(this.board.scope.createTextNode(this.value));

  return el;
};

T3.Cell.prototype.getHorizontalNeighbors = function() {
  var neighbors = [];
  for (var i = 0, size = this.board.size; i < size; i++) {
    neighbors.push(this.board.getCell(this.row, i));
  }
  return neighbors;
};

T3.Cell.prototype.getVerticalNeighbors = function() {
  var neighbors = [];
  for (var i = 0, size = this.board.size; i < size; i++) {
    neighbors.push(this.board.getCell(i, this.col));
  }
  return neighbors;
};

T3.Cell.prototype.getDiagonalNeighbors = function() {
  var neighbors = [];
  var row, col, offset;

  // find the coordinate of the top left diagonal neighbor
  if (this.row > this.col) {
    offset = 0 - this.col;
  } else {
    offset = 0 - this.row;
  }

  col = this.col + offset;
  row = this.row + offset;

  while (col < this.board.size && row < this.board.size) {
    neighbors.push(this.board.getCell(row, col));
    col++; row++;
  }
  return neighbors;
};

T3.Cell.prototype.getAntiDiagonalNeighbors = function() {
  var neighbors = [];
  var topRight = { row: this.row, col: this.col };

  // find the coordinates of the top right cell on the anti-diagonal
  while (topRight.row > 0 && topRight.col < this.board.size - 1) {
    topRight.row--; topRight.col++;
  }

  var row = topRight.row;
  var col = topRight.col;

  while (row < this.board.size && col >= 0) {
    neighbors.push(this.board.getCell(row, col));
    row++; col--;
  }

  return neighbors;
};


if (typeof module !== 'undefined') { module.exports = T3; }