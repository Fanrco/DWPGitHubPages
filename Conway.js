
var w;
var columns;
var rows;
var board;
var next;

function setup() {
  cnv=createCanvas(300, 300);
  cnv.parent('Conway');
  frameRate(10);
  w = 10;
  // Calculate columns and rows
  columns = floor(width/w);
  rows = floor(height/w);
  
  board = new Array(columns);
  for (var i = 0; i < columns; i++) {
    board[i] = new Array(rows);
  } 
 
  next = new Array(columns);
  for (i = 0; i < columns; i++) {
    next[i] = new Array(rows);
  }
  init();
}

function draw() {
  background(0,100);

  generate();
  for ( var i = 0; i < columns;i++) {
    for ( var j = 0; j < rows;j++) {
      if ((board[i][j] == 1)) fill(53, 0, 211);
      else fill(0); 
      noStroke();
      rect(i*w, j*w, w-1, w-1);
    }
  }
}

// reset board when mouse is pressed
function mousePressed() {
  init();
}

// Fill board randomly
function init() {
  for (var i = 0; i < columns; i++) {
    for (var j = 0; j < rows; j++) {
      // Lining the edges with 0s
      if (i == 0 || j == 0 || i == columns-1 || j == rows-1) {board[i][j] = 0;}
      next[i][j] = 0;
    }
  }

  //Creating Symmetry along the y-axis
  var yoff=floor(columns/2);
  var xoff=floor(rows/2);

  for (var i = 1; i < yoff; i++) {
    for (var j = 1; j < rows-1; j++) {
      var randval = floor(random(2));
      board[yoff-i][j] = randval;
      board[yoff+i-1][j] = randval;
      next[i][j] = 0;
      next[i+yoff-1][j] = 0;
    }
  }
        
}

// The process of creating the new generation
function generate() {

  // Loop through every spot in our 2D array and check spots neighbors
  for (var x = 1; x < columns - 1; x++) {
    for (var y = 1; y < rows - 1; y++) {
      // Add up all the states in a 3x3 surrounding grid
      var neighbors = 0;
      for (var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
          neighbors += board[x+i][y+j];
        }
      }

      // A little trick to subtract the current cell's state since
      // we added it in the above loop
      neighbors -= board[x][y];
      // Rules of Life
      if      ((board[x][y] == 1) && (neighbors <  2)) next[x][y] = 0;           // Loneliness
      else if ((board[x][y] == 1) && (neighbors >  3)) next[x][y] = 0;           // Overpopulation
      else if ((board[x][y] == 0) && (neighbors == 3)) next[x][y] = 1;           // Reproduction
      else                                             next[x][y] = board[x][y]; // Stasis
    }
  }

  // Swap!
  var temp = board;
  board = next;
  next = temp;
}

