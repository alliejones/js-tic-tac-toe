var should = require('should');
var T3 = require('../dist/tictactoe.js');
var jsdom = require('jsdom').jsdom;

var coords = function(cells) {
  return T3.utils.cellCoordinates(cells).join(' ');
};

describe('neighbor checking', function(){
  var document, board;

  before(function() {
    document = jsdom("<html><head></head><body><div id='t3'></div></body></html>");
    board = new T3.Board('t3', 4, document);
  })

  describe('horizontally', function() {
    it('cell 0,0', function() {
      var cells = board.getCell(0, 0).getHorizontalNeighbors();
      coords(cells).should.equal('0,0 0,1 0,2 0,3');
    })

    it('cell 2,2', function() {
      var cells = board.getCell(2, 2).getHorizontalNeighbors();
      coords(cells).should.equal('2,0 2,1 2,2 2,3');
    })

    it('cell 2,3', function() {
      var cells = board.getCell(3, 3).getHorizontalNeighbors();
      coords(cells).should.equal('3,0 3,1 3,2 3,3');
    })
  })

  describe('vertically', function() {
    it('cell 0,0', function() {
      var cells = board.getCell(0, 0).getVerticalNeighbors();
      coords(cells).should.equal('0,0 1,0 2,0 3,0');
    })

    it('cell 1,1', function() {
      var cells = board.getCell(1, 1).getVerticalNeighbors();
      coords(cells).should.equal('0,1 1,1 2,1 3,1');
    })

    it('cell 2,3', function() {
      var cells = board.getCell(2, 3).getVerticalNeighbors();
      coords(cells).should.equal('0,3 1,3 2,3 3,3');
    })
  })

  describe('diagonally', function() {
    it('cell 0,0', function() {
      var cells = board.getCell(0, 0).getDiagonalNeighbors();
      coords(cells).should.equal('0,0 1,1 2,2 3,3');
    })

    it('cell 0,2', function() {
      var cells = board.getCell(0, 2).getDiagonalNeighbors();
      coords(cells).should.equal('0,2 1,3');
    })

    it('cell 3,2', function() {
      var cells = board.getCell(3, 2).getDiagonalNeighbors();
      coords(cells).should.equal('1,0 2,1 3,2');
    })

    it('cell 0,3', function() {
      var cells = board.getCell(0, 3).getDiagonalNeighbors();
      coords(cells).should.equal('0,3');
    })
  })

  describe('anti-diagonally', function() {
    it('cell 0,0', function() {
      var cells = board.getCell(0, 0).getAntiDiagonalNeighbors();
      coords(cells).should.equal('0,0');
    })

    it('cell 3,0', function() {
      var cells = board.getCell(3, 0).getAntiDiagonalNeighbors();
      coords(cells).should.equal('0,3 1,2 2,1 3,0');
    })

    it('cell 3,2', function() {
      var cells = board.getCell(3, 2).getAntiDiagonalNeighbors();
      coords(cells).should.equal('2,3 3,2');
    })
  })
})