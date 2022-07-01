
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
    
    game.background = game.assets.background;
    
    game.objects.push(game.assets.warship1);
    game.objects.push(game.assets.warship2);

    game.player = game.assets.spaceship;
    
    loadImages();


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
    
    /*
    ctx.drawImage(warship1.img, warship1.x, warship1.y, warship1.width, warship1.height);
    ctx.drawImage(warship2.img, warship2.x, warship2.y, warship2.width, warship2.height);
    ctx.drawImage(spaceship.img, spaceship.x, spaceship.y, spaceship.width,  spaceship.height);
    */
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
    console.log(game.assets);

    Object.entries(game.assets).forEach(function ([key, value]) {
        game.assets[key].img = new Image();
        game.assets[key].img.src = game.assets[key].src;
        console.log('loaded', game.assets[key].src);
    });
}

function draw() {
    update();
    requestAnimationFrame(draw);
}
