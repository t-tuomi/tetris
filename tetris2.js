
var currentBlock, nextBlock;

function startGame() {
    console.log("starting....");
    nextBlock = new Block();
    newBlock();
    scoreBoard.init();
    gameBoard.start();
}

var scoreBoard = {
    canvas : document.createElement("canvas"),
    init : function() {
        this.WIDTH = this.canvas.width = 200;
        this.HEIGHT = this.canvas.height = 150;
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.CELL = 25;
        this.ctx = this.canvas.getContext("2d");

    }    
}
var gameBoard = {
    //canvas: document.getElementById("gameBoard"),
    canvas : document.createElement("canvas"),
    start: function () {
        //console.log(canvas);
        this.gameSpeed = 1000;
        this.WIDTH = this.canvas.width = 300;
        this.HEIGHT = this.canvas.height = 500;
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.CELL = 25;
        this.ctx = this.canvas.getContext("2d");
        this.m = new Array(22).fill(0).map(() => new Array(12).fill(0));
        //console.log(this.zerom[0]);
        //this.m = this.zerom.map((c, i) => { if (i == 0 || i == 21) return new Array(12).fill(1); return [1, this.zerom[0].slice(1, 10).from(), 1]; });
        
        var x, y;
        for (x = 0; x < 12; x++) {
            for (y = 0; y < 22; y++) {
                if (x == 0 || x == 11 || y == 0 || y == 21) {
                    this.m[y][x] = 1;
                }
            }
        }
        
        
        console.log(this.m)
        // alustetaan m niin, että kaikki reunasolut = 1 ja muut 0.
        this.interval = setInterval(sinkBlock, this.gameSpeed);
        window.addEventListener('keydown', keyHandler);
    },
  
    clear: function () {
        this.ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT);
    },
    drawGrid: function () {
        var i;
        this.ctx.strokeStyle = "lightgray";

        for (i = 0; i < this.HEIGHT; i += this.CELL) {
            this.ctx.moveTo(0, i);
            this.ctx.lineTo(this.WIDTH, i);
            this.ctx.stroke();
        }
        for (i = 0; i < this.WIDTH; i += this.CELL) {
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, this.HEIGHT);
            this.ctx.stroke();
        }
    },
    draw: function () {
        var x, y;
        for (x = 1; x < 11; x++) {
            for (y = 1; y < 21; y++) {
                if (this.m[y][x] != 0) {
                    this.ctx.fillStyle = this.m[y][x];
                    //this.ctx.strokeStyle = "lightgray";
                    this.ctx.fillRect(x * this.CELL + 1, y * this.CELL + 1, this.CELL - 2, this.CELL - 2);
                }
            }
        }
    
    },
    
    updateM : function(x, y, dx, dy, a, c) {

        // toimii jo. 
        // x, y: nykyinen root-paikka
        // dx, dy: suhteelliset koordinaatit mihin ollaan siirtämässä x:n ja y:n nähden
        // a: atoms -array
        // boolean c: jos true niin laitetaan palikka, jos false niin vain tsekataan
        // voiko laittaa. Palauttaa 'true' jos voi.

        var ret = true;  // voi laittaa

        for (var i = 0; i < 4; i++) {
            this.m[y + a[i][1]][x + a[i][0]] = 0;
        }

        if (c) {
            for (var i = 0; i < 4; i++) {
                this.m[y + dy + a[i][1]][x + dx + a[i][0]] = currentBlock.color;
                
            }
            return true;
        }

        // jos missä vaan uudessa paikkaa on jo jotain, ei voi laittaa tähän (ret = false)
        for (var i = 0; i < 4; i++) {
            if (this.m[y + dy + a[i][1]][x + dx + a[i][0]] != 0) ret = false;
            //console.log(y + dy + a[i][1], x + dx + a[i][0])
            //console.log(this.m[y + dy + a[i][1]][x + dx + a[i][0]])
        }

        // tänne vain jos tarkastetaan. Joka tapauksessa palikka vanhalle paikalleen
        for (var i = 0; i < 4; i++) {
            this.m[y + a[i][1]][x + a[i][0]] = currentBlock.color;
        }

        return ret;
        
    },
    stop : function() {
        clearInterval(this.interval);
        console.log("stopped")
    }
}

function keyHandler(e) {
    var code = e.keyCode;
    switch (code) {
        case 37: currentBlock.moveSideway(-1); break; //Left key
        case 38: currentBlock.rotate(); break; //Up key
        case 39: currentBlock.moveSideway(1); break; //Right key
        case 32: currentBlock.drop(); break; // space
        case 81: gameBoard.stop(); break; // q
        //default: alert(code); //Everything else
    }
}

function newBlock() {

    // if (currentBlock) currentBlock.destroy();  <---- HUOM!
    currentBlock = nextBlock;
    nextBlock = new Block();
    // näytä nextBlock omassa ruudussaan
    //nextBlock.initPos();
}

function updateGameArea() {
    //console.log("update GA");
    gameBoard.clear();
    //if (gameBoard.key && gameBoard.key == 37) { currentBlock.moveLeft(); }
    //if (gameBoard.key && gameBoard.key == 39) { currentBlock.moveRight(); }
    // muut key handlerit
    gameBoard.drawGrid();
    gameBoard.draw();
    //currentBlock.draw();
}

function sinkBlock() {
    currentBlock.blockOneDown();
    updateGameArea();
}

function Block() {

    this.r = Math.floor(Math.random() * 3);
    this.atoms = [];
    this.xPos = 5;
    this.yPos = 2;
    this.color;

    switch (this.r) {
        case 0: 
            //this.atoms = [[-1, 0], [0, 0], [1, 0], [2, 0]];
            this.atoms = [[0, -1], [0, 0], [0, 1], [0, 2]];  // bar
            this.color = "red";
            break;
        case 1: //square
            this.atoms = [[0, 0], [0, 1], [1, 0], [1, 1]];  // square
            this.color = "yellow"
            break;
        case 2:
            this.atoms = [[0, -1], [0, 0], [0, 1], [1, 1]]; //  'right' L
            this.color = "blue"; 
            break;
    }

    this.blockOneDown = function () {
       if (gameBoard.updateM(this.xPos, this.yPos, 0, 1, this.atoms, false)) {
            gameBoard.updateM(this.xPos, this.yPos, 0, 1, this.atoms, true);
            this.yPos++;
       } else {
           if (this.yPos == 2) {
               console.log(" --- GAME OVER ---");
               gameBoard.stop();
           }
           console.log("new block..");
           newBlock();
           //gameBoard.stop();
       }
         //updateGameArea();
    }

    this.moveSideway = function (dx) {
        //console.log(this.xPos)
        if (gameBoard.updateM(this.xPos, this.yPos, dx, 0, this.atoms, false)) {
            gameBoard.updateM(this.xPos, this.yPos, dx, 0, this.atoms, true);
            this.xPos += dx;
            updateGameArea();            
        }    
     }

     this.drop = function () { 
        var y = 1;
            while (gameBoard.updateM(this.xPos, this.yPos, 0, y, this.atoms, false)) {
                y++;
            }    
            gameBoard.updateM(this.xPos, this.yPos, 0, --y, this.atoms, true);
            updateGameArea();            
            newBlock();
        
     }

    this.rotate = function () { 
        console.log("rotates (couterclockwise)");

        // TODO:
        //
        // KEY_UP pyörittää palikkaa aina vastapäivään (toiseen suuntaan ei oo näppäintä)
        // pitää mennä samalla tapaa kun https://alypaa.com/tetris
        // En tie pitääks tehdä joku array, mistä aina haetaan uudet koordinaatit atom:eille. Modulolla luupataan sitä.
        // Ota esimerkkiä yllä blockOneDown() ja keksi jotain :)

        updateGameArea();
    }
    //this.check = function () { }
    
}