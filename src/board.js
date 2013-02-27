var T3 = T3 || {};

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


/// SETUP ///

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


/// STATE CHECKING / UTILITIES ///

T3.Board.prototype.getCell = function (row, col) {
  return this.state[row][col];
};

T3.Board.prototype.forEachCell = function (func) {
  for (var row = 0; row < this.size; row++) {
    for (var col = 0; col < this.size; col++) {
      func.call(this, this.state[row][col]);
    }
  }
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

T3.Board.prototype.isLegalMove = function (row, col) {
  return row < this.size && col < this.size;
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

T3.Board.prototype.isGameOver = function() {
  return this.maxMoves <= this.moveCount;
};


/// GAMEPLAY ///

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