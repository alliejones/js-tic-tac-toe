var should = require('should');
var T3 = require('../src/tictactoe.js');
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
      var cell = board.getCell(0, 0);
      coords(cell.getHorizontalNeighbors()).should.equal('0,0 0,1 0,2 0,3');
    })
  })
})