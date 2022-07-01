
const game = {
    resolution: { w:320, h:200 },
    objects: [],
    player: null,
    background: null,
    assets: {
        
        background: {
            x: 0,
            y: -200,
            width: 320,
            height: 400,
            dir: 'v',
            speed: 2,
            src:'Bilder/background_320x400.png'
        },
        ship: class {
            x=0;
            y=0;
            width;
            height;
            img;
            src;
            dir='v';
            speed=0;

            constructor (params) {
                this.height = params?.height;
                this.width = params?.width;
                this.x = params?.x;
                this.y = params?.y;
                this.dir = params?.dir;
                this.speed = params?.speed;
                this.src = params?.src;

                console.log('created ship', this);
            }

            load () {
                if (this.src) {
                    this.img = new Image();
                    this.img.src = this.src;
                    console.log('init', this.img);
                }
            }
        },
        spaceship: {
            x: 135,
            y: 100,
            width: 35,
            height: 35,
            dir: 'vh',
            speed: 3,
            src:'Bilder/spaceship.png'
        },
        warship1: {
            x: -90,
            y: -300,
            width: 150,
            height: 400,
            dir: 'v',
            speed: 0.5,
            src:'Bilder/warship1.png'
        },
        warship2: {
            x: 240,
            y: -300,
            width: 150,
            height: 400,
            dir: 'v',
            speed: 0.3,
            src:'Bilder/warship2.png'
        }
    }
}

game.assets.playerShip = class extends game.assets.ship {
    constructor (params) {
        super(params);

        this.x = 135;
        this.y = 100;
        this.width = 35;
        this.height = 35;
        this.dir = 'vh';
        this.speed = 3;
        this.src = 'Bilder/spaceship.png';
        //this.img = new Image();
        //this.img.src = this.src;
        super.load();
        console.log('created player ship');
    }

    move (direction, amount) {
        if (!direction || !amount) return;

        this[direction] = this[direction] + amount;
    }
}

game.assets.warShip = class extends game.assets.ship {
    constructor(params) {
        super(params);

        this.x = params?.x;
        this.y = params?.y;
        this.dir = params?.dir || 'v';
        this.speed = params?.speed || 1;

        this.width = 150;
        this.height = 400;
        this.src ='Bilder/warship1.png';

        console.log('created warship', this);
    }
}

// Key definition
let UP = false; // 38
let LEFT = false; // 37
let DOWN = false; // 40
let RIGHT = false; // 39

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext('2d');
ctx.canvas.width  = game.resolution.w;
ctx.canvas.height = game.resolution.h;

//Music
let audio = document.getElementById("audio");

// Keys pressed
window.onkeydown = function(e) {
    if (e.keyCode == 38) { 
        UP = true;
    }
    if (e.keyCode == 37) { 
        LEFT = true;
    }
    if (e.keyCode == 40) { 
        DOWN = true;
    }
    if (e.keyCode == 39) { 
        RIGHT = true;
    }
}

// Keys not pressed
window.onkeyup = function(e) {
    if (e.keyCode == 38) { 
        UP = false;
    }
    if (e.keyCode == 37) { 
        LEFT = false;
    }
    if (e.keyCode == 40) { 
        DOWN = false;
    }
    if (e.keyCode == 39) { 
        RIGHT = false;
    }
}

function startScreen() {
    const startScreen = new Image();
    startScreen.src = 'Bilder/background_320x400.png';

    ctx.drawImage(startScreen, 0, 0, game.resolution.w, 400);
}

function startGame() {
    
    game.background = new game.assets.ship({
        x: 0,
        y: 0,
        width: 320,
        height: 400,
        src: 'Bilder/background_320x400.png',
        speed: 1,
        dir: 'v'
    });
    
    game.objects.push(new game.assets.warShip({
        x: -30,
        y: -100,
        speed: 0.5
    }));

    game.player = new game.assets.playerShip({
        width: 128,
        height: 256
    });

    loadImages();

    // setInterval(update, 1000 / 25);
    
    setTimeout(function () {
        const newShip = new game.assets.warShip({
            x: 120,
            y: -200,
            speed: 0.75
        });
        newShip.load();

        game.objects.push(newShip);
        console.log('new ship', newShip);
    }, 3000);
    
    draw();
}

function update() {
    if (LEFT) {
        game.player.x = Math.max(0, game.player.x-game.player.speed);
    }

    if (RIGHT) {
        game.player.x = Math.min(game.resolution.w-game.player.width, game.player.x+game.player.speed);
    }

    if (UP) {
        game.player.y = Math.max(0, game.player.y-game.player.speed);
    }

    if (DOWN) {
        game.player.y = Math.min(game.resolution.h-game.player.height, game.player.y+game.player.speed);
    }

    // draw background
    game.background.y += game.background.speed;
    if (game.background.y > 0) {
        game.background.y = game.background.height/2*-1; // todo: werte anpassen, dass loop gut aussieht
        console.log('looped background image');
    }
    ctx.drawImage(game.background.img, game.background.x, game.background.y, game.background.width, game.background.height);

    // draw objects
    for (let i=0; i<game.objects.length; i++) {
        if (game.objects[i].dir == 'v') {
            game.objects[i].y += game.objects[i].speed;
        }
        if (game.objects[i].dir == 'h') {
            game.objects[i].x += game.objects[i].speed;
        }

        // check for out of bounds
        // todo: better intersection detection
        if (game.objects[i].y > game.resolution.h || game.objects[i].y < -400) {
            console.log('oub vertical', game.objects[i].src);
            game.objects.splice(i, 1);
        } else if (game.objects[i].x > game.resolution.w || game.objects[i].x < -100) {
            console.log('oub horizontal', game.objects[i].src);
            game.objects.splice(i, 1);
        } else {
            // draw
            ctx.drawImage(game.objects[i].img, game.objects[i].x, game.objects[i].y, game.objects[i].width, game.objects[i].height);
        }
    }

    // draw player
    ctx.drawImage(game.player.img, game.player.x, game.player.y, game.player.width, game.player.height);
}

//Sound and Audio
let isPlaying = false;
    audio.volume = 0.2;
    audio.loop = true;

function togglePlay() {
    isPlaying ? audio.pause() : audio.play();
}

audio.onplaying = function() {
    isPlaying = true;
}

audio.onpause = function() {
    isPlaying = false;
}

function loadImages () {

    Object.entries(game.objects).forEach(function ([key, value]) {
        game.objects[key].load();
        console.log('loaded', game.objects[key].src);
    });

    // game.playerShip.load();
    game.background.load();
}

function draw() {
    update();
    requestAnimationFrame(draw);
}
