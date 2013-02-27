var T3 = T3 || {};
T3.utils = {};

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

if (typeof module !== 'undefined') { module.exports = T3; }
