var T3 = T3 || {};

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
