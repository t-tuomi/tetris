
var currentBlock, nextBlock;

function startGame() {
    console.log("starting....");
    nextBlock = new Block();
    newBlock();
    gameBoard.start();
}

var gameBoard = {
    //canvas: document.getElementById("gameBoard"),
    canvas : document.createElement("canvas"),
    start: function () {
        //console.log(canvas);
        this.gameSpeed = 1000;
        this.WIDTH = this.canvas.width = 250;
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
        window.addEventListener('keydown', keyHandler, false);
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
        for (x = 1; x < 10; x++) {
            for (y = 1; y < 20; y++) {
                if (this.m[y][x] != 0) {
                    this.ctx.fillStyle = this.m[y][x];
                    //this.ctx.strokeStyle = "lightgray";
                    this.ctx.fillRect(x * this.CELL, y * this.CELL, this.CELL, this.CELL);
                }
            }
        }
    
        // luuppaa m:n läpi ja piirtää pohjalla olevan kasan
    },
    
    updateM : function(x, y, dx, dy, a) {

        // tässä kutsuu jotain metodia, joka varmistaa että kun palikkaa pyöritetään tai
        // kun siirretään vasen/oikea, niin ei saa mennä sellasen m:n päälle, jonka arvo != 0
        // m -matriisissa on game-alueen ulkopuolella kaikki reunasolut arvossa 1, eli
        // niitten päällekään ei saa mennä, mutta ei tartte erikseen kattoa ettei mee reunasta yli.


        for (var i = 0; i < 4; i++) {
            this.m[y + a[i][1]][x + a[i][0]] = 0;
        }
        for (var i = 0; i < 4; i++) {
            this.m[y + dy + a[i][1]][x + dx + a[i][0]] = currentBlock.color;
        }
    
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

    // if (currentBlock) currentBlock.destroy();
    currentBlock = nextBlock;
    nextBlock = new Block();
    // näytä nextBlock omassa ruudussaan
    //nextBlock.initPos();
}

function updateGameArea() {
    console.log("update GA");
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

    this.r = 2 // Math.rand(6); //tms
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
         gameBoard.updateM(this.xPos, this.yPos++, 0, 1, this.atoms);
         if (this.yPos == 10) gameBoard.stop();
         //updateGameArea();
    }
    this.moveSideway = function (dx) {
        // koittaa siirtää kaikkia neljää atomia napsun vasemmalle (dx = -1) tai oikealle (dx = 1). 
        // jos kaikkien uusien koordinaattien paikalla on 0, niin 
        // putsataan m:stä vanhat atomien paikat nollaksi ja päivitetään uusi paikka jokaiselle atomille.
     }
    //this.moveRight = function () { }
    this.drop = function () { }

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