
/**
 * Queue class
 */
class Queue {
    constructor() {
      this.contents = [];
    }
    enqueue(val) {
      this.contents.push(val);
    }
    dequeue() {
      this.contents.shift();
    }
    peek() {
      return this.contents[0];
    }
    isEmpty() {
      return this.contents.length === 0;
    }
  }

let PLAYERS;    //Queue of Players
let SQUARES;    //2D array of squares in the board
let INTERVAL;   //Interval of the game (loops to check current scores and if anyone won)

let ROWS = 3;   //number of row of squares
let COLS = 3;   //number of columns of squares

const GRID_LINE_COLOR = "lightgrey";    //default lines of the grid color



/**
 * Player object
 * @param {*} color String
 * @param {*} lightcolor String 
 */
function Player(color, lightcolor){
    this.color = color; //player color
    this.lightcolor = lightcolor; //lightcolor of player (for hovers and square fills)
    this.boxes = 0; //boxes: number of boxes or squares filled
}

/**
 * Square object
 * @param {*} square Parent div (square shape)
 * @param {*} top Child div (top side of square)
 * @param {*} bottom Child div (bottom side of square)
 * @param {*} left Child div (left side of square)
 * @param {*} right Child div (right side of square)
 * @param {*} row number
 * @param {*} col number
 */
function Square(square, top, bottom, left, right, row, col){
    this.row = row; //row index of square in SQUARES
    this.col = col; //col index of square in SQUARES

    this.square = square;
    this.top = top;
    this.bottom = bottom;
    this.left = left;
    this.right = right;
    this.owner = null; //player that filled up this square

    this.numOfSideSelected = 0; //number of sides selected for this square 
    this.topSelected = false; //if top was clicked true, else false
    this.bottomSelected = false; //if bottom was clicked true, else false
    this.leftSelected = false; //if left was clicked true, else false
    this.rightSelected = false; //if right was clicked true, else false

    // top hover
    this.top.onmouseover = () => {
        if (!this.topSelected){
            this.square.style.borderTopColor = PLAYERS.peek().lightcolor; 
        }
    }
    this.top.onmouseout = () => {
        if(!this.topSelected){
            this.square.style.borderTopColor = GRID_LINE_COLOR;
        }
    }

    //bottom hover
    this.bottom.onmouseover = () => {
        
        if(this.row == ROWS-1){
            if (!this.bottomSelected) {
                this.square.style.borderBottomColor = PLAYERS.peek().lightcolor; 
            }
        } else {
            //check if neighbor side as selected (in this case its the top side of the neightbor)
            if(!SQUARES[this.row + 1][this.col].topSelected){
                SQUARES[this.row + 1][this.col].square.style.borderTopColor = PLAYERS.peek().lightcolor; 
            }
        }
        
        
    }
    this.bottom.onmouseout = () => {
        if(this.row == ROWS-1){
            if (!this.bottomSelected){
                this.square.style.borderBottomColor = GRID_LINE_COLOR; 
            }
        } else {
            if (!SQUARES[this.row + 1][this.col].topSelected){
                SQUARES[this.row + 1][this.col].square.style.borderTopColor = GRID_LINE_COLOR; 
            }
        }
    
        
    }

    //left hover
    this.left.onmouseover = () => {
        if (!this.leftSelected){
            this.square.style.borderLeftColor = PLAYERS.peek().lightcolor; 
        }
    }
    this.left.onmouseout = () => {
        if(!this.leftSelected){
            this.square.style.borderLeftColor = GRID_LINE_COLOR;
        }
    }

    //right hover
    this.right.onmouseover = () => { 
        if(this.col == COLS-1){
            if (!this.rightSelected){
                this.square.style.borderRightColor = PLAYERS.peek().lightcolor; 
            }
        } else {
            if(!SQUARES[this.row][this.col+1].leftSelected){
                SQUARES[this.row][this.col+1].square.style.borderLeftColor = PLAYERS.peek().lightcolor; 
            }
        }
    }

    this.right.onmouseout = () => {
        if(this.col == COLS-1){
            if (!this.rightSelected){
                this.square.style.borderRightColor = GRID_LINE_COLOR; 
            }
        } else {
            if(!SQUARES[this.row][this.col+1].leftSelected){
                SQUARES[this.row][this.col+1].square.style.borderLeftColor = GRID_LINE_COLOR; 
            }
        }       
    }


    //top click
    this.top.onclick = () => {
        if (!this.topSelected){
            p = PLAYERS.peek();
            this.square.style.borderTopColor = p.color; 

            if(this.row > 0){
                SQUARES[this.row-1][this.col].numOfSideSelected += 1
            }
            this.numOfSideSelected += 1;

            this.topSelected = true;
            
            let filledSquare = false;

            //check if this square has 4 sides selected, then fill it up
            //and add 1 to the score of the current player
            if(this.numOfSideSelected == 4){
                p.boxes += 1;
                this.square.style.background = p.lightcolor;
                filledSquare = true;
            }

            //check if this square's neighbour has 4 sides selected, then fill it up
            //and add 1 to the score of the current player
            if(this.row > 0 && SQUARES[this.row-1][this.col].numOfSideSelected == 4){
                p.boxes += 1;
                SQUARES[this.row-1][this.col].square.style.background = p.lightcolor;
                filledSquare = true;
            }

            //if a square or more were not filled switch to next player, else dont switch
            if(!filledSquare){
                PLAYERS.dequeue();
                PLAYERS.enqueue(p);
            }
        }
    }
        
    //bottom click
    this.bottom.onclick = () => {

        if(this.row == ROWS-1){
            if (!this.bottomSelected) {
                p = PLAYERS.peek();
                this.square.style.borderBottomColor = p.color; 
                this.numOfSideSelected += 1;

                this.bottomSelected = true;
                
                let filledSquare = false;
                if(this.numOfSideSelected == 4){
                    p.boxes += 1;
                    this.square.style.background = p.lightcolor;
                    filledSquare = true;
                }

                //if a square or more were not filled switch to next player, else dont switch
                if(!filledSquare){
                    PLAYERS.dequeue();
                    PLAYERS.enqueue(p);
                }
            }
        } else {
            if(!SQUARES[this.row + 1][this.col].topSelected){
                p = PLAYERS.peek();
                SQUARES[this.row + 1][this.col].square.style.borderTopColor = p.color;
                 
                SQUARES[this.row + 1][this.col].numOfSideSelected +=1
                this.numOfSideSelected += 1;

                SQUARES[this.row + 1][this.col].topSelected = true;
                
                let filledSquare = false;

                if(this.numOfSideSelected == 4){
                    p.boxes += 1;
                    this.square.style.background = p.lightcolor;
                    filledSquare = true;
                }

                if(SQUARES[this.row + 1][this.col].numOfSideSelected == 4){
                    p.boxes += 1;
                    SQUARES[this.row + 1][this.col].square.style.background = p.lightcolor;
                    filledSquare = true;
                }

                //if a square or more were not filled switch to next player, else dont switch
                if(!filledSquare){
                    PLAYERS.dequeue();
                    PLAYERS.enqueue(p);
                }
            }
        }
    }
    
    //left click
    this.left.onclick = () => {
        if (!this.leftSelected){
            p = PLAYERS.peek();
            this.square.style.borderLeftColor = p.color; 

            if(this.col > 0){
                SQUARES[this.row][this.col-1].numOfSideSelected += 1
            }
            this.numOfSideSelected += 1;

            this.leftSelected = true;
            
            let filledSquare = false;

            if(this.numOfSideSelected == 4){
                p.boxes += 1;
                this.square.style.background = p.lightcolor;
                filledSquare = true;
            } 

            if(this.col > 0 && SQUARES[this.row][this.col-1].numOfSideSelected == 4){
                p.boxes += 1;
                SQUARES[this.row][this.col-1].square.style.background = p.lightcolor;
                filledSquare = true;
            }

            //if a square or more were not filled switch to next player, else dont switch
            if(!filledSquare){
                PLAYERS.dequeue();
                PLAYERS.enqueue(p);
            }
            
        }
    }
        
    //right click
    this.right.onclick = () => {
        if(this.col == COLS-1){
            if (!this.rightSelected) {
                p = PLAYERS.peek();
                this.square.style.borderRightColor = p.color; 
                this.numOfSideSelected += 1;

                this.rightSelected = true;
                
                let filledSquare = false;
                
                if(this.numOfSideSelected == 4){
                    p.boxes += 1;
                    this.square.style.background = p.lightcolor;
                    filledSquare = true;
                }

                //if a square or more were not filled switch to next player, else dont switch
                if(!filledSquare){
                    PLAYERS.dequeue();
                    PLAYERS.enqueue(p);
                } 
            }
        } else {
            if(!SQUARES[this.row][this.col+1].leftSelected){
                p = PLAYERS.peek();
                SQUARES[this.row][this.col+1].square.style.borderLeftColor = p.color;
                 
                SQUARES[this.row][this.col+1].numOfSideSelected +=1
                this.numOfSideSelected += 1;

                SQUARES[this.row][this.col+1].leftSelected = true;
                

                let filledSquare = false;
                if(this.numOfSideSelected == 4){
                    p.boxes += 1;
                    this.square.style.background = p.lightcolor;
                    filledSquare = true;
                }

                if(SQUARES[this.row][this.col+1].numOfSideSelected == 4){
                    p.boxes += 1;
                    SQUARES[this.row][this.col+1].square.style.background = p.lightcolor;
                    filledSquare = true;
                }

                //if a square or more were not filled switch to next player, else dont switch
                if(!filledSquare){
                    PLAYERS.dequeue();
                    PLAYERS.enqueue(p);
                } 
            }
            
        }
    }
}

/**
 * Function to setup the game
 */
function setupGame(){
    PLAYERS = new Queue();
    SQUARES = [];
    PLAYERS.enqueue(new Player("blue", "lightblue"));
    PLAYERS.enqueue(new Player("red", "pink"));
    PLAYERS.enqueue(new Player("green", "lightgreen"));

    SetupBoard(); 
    SetupRestartButton();
}

/**
 * Function to update the score
 */
function UpdateScore() {
    let bp = document.getElementById("blue-player");
    let rp = document.getElementById("red-player");
    let gp = document.getElementById("green-player");

    for (player of PLAYERS.contents){
        if (player.color === "blue"){
            bp.textContent = "Blue: " + player.boxes;
        } else if (player.color === "green"){
            gp.textContent = "Green: " + player.boxes;
        } else if (player.color === "red"){
            rp.textContent = "Red: " + player.boxes;
        }
    }
}

/**
 * Function to check which player won
 * @returns true if there is a winner, false if no winner yet
 */
function CheckWin() {
    let numOfFilledSquares = 0;
    for (player of PLAYERS.contents){
        numOfFilledSquares += player.boxes;
    }

    if (numOfFilledSquares == ROWS*COLS){
        return true;
    } else {
        return false;
    }
}

/**
 * Function to setup the restart button
 */
function SetupRestartButton() {
    let btn = document.getElementById("restart-button");
    let parentDiv = document.getElementById("game-board");
    btn.onclick = () => {
        parentDiv.replaceChildren(); //clears the children in parentDiv
        clearInterval(INTERVAL); //stop the interval for current game
        startNewGame(); //start new game
    }
    
}

/**
 * Function to setup the board UI and append Sqaures to SQUARES
 */
function SetupBoard(){
    let board = document.getElementById("game-board");

    for (let r = 0; r < ROWS; r++){
        rowOfSquares = [];

        let row = document.createElement("div");
        row.style.display = "flex";

        for(let c = 0; c < COLS; c++){
            
            
            let outerbox = document.createElement("div"); //top parent div
            outerbox.className = "outerbox";

            let box = document.createElement("div"); //child of outerbox
            box.className = "box";
            let wSize = 100/COLS-(20/COLS)+"vw"; //100/COLS is for width of each Square. -(20/COLS) is for to make left and right margins
            let hSize = 100/ROWS-(40/ROWS)+"vh"; //100/ROWS is for height of each Square. -(20/ROWS) is for to make top and bottom margins
            box.style.setProperty("--wSize", wSize); //the min of wSize and hSize get calculated in the stylesheet, so that squares size are relative to the min
            box.style.setProperty("--hSize", hSize);

            outerbox.style.setProperty("--wBordW", wSize);
            outerbox.style.setProperty("--hBordW", hSize);


        
            let rotate = document.createElement("div"); //child of box
            rotate.className = "rotate";
        
            let top = document.createElement("div"); //children of rotate
            let bottom = document.createElement("div");
            let right = document.createElement("div");
            let left = document.createElement("div");
          
        
            rotate.appendChild(top);
            rotate.appendChild(right);
            rotate.appendChild(left);
            rotate.appendChild(bottom);
        
            box.appendChild(rotate);
            outerbox.appendChild(box);
      
            if (c < COLS-1){
                outerbox.style.borderRightStyle = "hidden"; //hide the right border of all squares except the most right squares (of SQUARES)
            }

            if (r < ROWS-1){
                outerbox.style.borderBottomStyle = "hidden"; //hide the bottom borders of all squares except the most bottom squares (of SQUARES)

            }

            rowOfSquares.push(new Square(outerbox, top, bottom, left, right, r, c));
            row.appendChild(outerbox);
        }
        SQUARES.push(rowOfSquares);

        board.appendChild(row);
    }

    //calculate proper size for the top-bar which shows the scores and restart button
    let topBar = document.getElementById("top-bar");
    let tbWidth0 = COLS*(100/COLS-(20/COLS))+"vw"; //find the total width of the grid by COLS*width of one square
    let tbWidth1 = ROWS*(100/ROWS-(40/ROWS))+"vh"; //find the total height of the grid by ROWS*width of one square
    topBar.style.setProperty("--tbWidth0", tbWidth0); //the min of these get calculated in the stylesheet, so that top-bar width is relative to the min
    topBar.style.setProperty("--tbWidth1", tbWidth1);
}

/**
 * Function to open the ending popup window
 */
function OpenModal(){
    // Get the modal
    let modal = document.getElementById("myModal");
    let winText = document.getElementById("modal-win-text");
    let scoresText = document.getElementById("modal-scores-text");
    let closeBtn = document.getElementById("modal-close-btn");
    let playAgainBtn = document.getElementById("modal-playagain-btn");

    let maxBoxes = 0; //max number of filled squares from a player

    //finding the max number of boxes from each player
    for (player of PLAYERS.contents){
        if (player.boxes > maxBoxes){
            maxBoxes = player.boxes;
        }
    }

    //array of winners because more than 1 player may have the highest score
    let winner = [];

    for (player of PLAYERS.contents){
        if (player.boxes == maxBoxes){
            winner.push(player);
        }
    }

    //setting text of who won
    let text = "Winner(s): ";
    let a = document.createElement("a");
    a.textContent = text;
    winText.appendChild(a);

    if(winner.length > 1){
        for (w of winner){
            let b = document.createElement("a");
            b.textContent = " " + capitalizeFirstLetter(w.color);
            b.style.color = w.color;
            winText.appendChild(b)
        }
    } else {
        let b = document.createElement("a");
        b.textContent = " " + capitalizeFirstLetter(winner[0].color);
        b.style.color = winner[0].color;
        winText.appendChild(b)
    }

    //setting text of the scores
    for (player of PLAYERS.contents){
        let c  = document.createElement("div");
        c.textContent = capitalizeFirstLetter(player.color) + ": " + player.boxes;
        c.style.color = player.color;
        scoresText.appendChild(c);
    }

    //close button on click
    closeBtn.onclick = function() {
        modal.style.display = "none"; //hide popup
        winText.replaceChildren();
        scoresText.replaceChildren();
    }

    //Play Again button on click
    playAgainBtn.onclick = function() {
        let parentDiv = document.getElementById("game-board");
        modal.style.display = "none"; //hide popup
        parentDiv.replaceChildren(); //clear children
        winText.replaceChildren(); //clear children
        scoresText.replaceChildren(); //clear children
        startNewGame();
    }

    modal.style.display = "block"; //show popup



}

/**
 * Helper function to capitalize the first letter of a string
 * @param {*} string String
 * @returns string with first letter capitalized
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  


/**
 * Function to start a new game
 */
function startNewGame(){
    setupGame();
    INTERVAL = setInterval(function() {
        UpdateScore();
        if (CheckWin()){
            clearInterval(INTERVAL); //stop this interval
            OpenModal(); //open ending popup screen
        }
    }, 30);
}


startNewGame();
