
// Key definition
let UP = false; // 38
let LEFT = false; // 37
let DOWN = false; // 40
let RIGHT = false; // 39
let canvas;
let ctx;

//Music
let audio = document.getElementById("audio");



let background = {
    x: 0,
    y: -350,
    width: 500,
    height: 500,
    src:'Bilder/background.jpg'
}

let spaceship = {
    x: 135,
    y: 100,
    width: 35,
    height: 35,
    src:'Bilder/spaceship.png'
}

let warship1 = {
    x: -90,
    y: -300,
    width: 150,
    height: 400,
    src:'Bilder/warship1.png'
}

let warship2 = {
    x: 240,
    y: -300,
    width: 150,
    height: 400,
    src:'Bilder/warship2.png'
}

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

function startGame() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    loadImages();
    setInterval(update, 1000 / 25);
    draw();
}

function update() {
    if (LEFT) {
        spaceship.x -= 3;
    }

    if (RIGHT) {
        spaceship.x += 3;
    }
    if (UP) {
        warship1.y += 0.5;
        warship2.y += 0.5;
        background.y += 2;
    }

    if (DOWN) {
        warship1.y -= 0.5;
        warship2.y -= 0.5;
        background.y -= 0.5;
    }
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

startBtn.onClick = function() {
	playSound.play();
}

restartBtn.onClick = function() {
	playSound.play();
}

function loadImages () {
    background.img = new Image();
    background.img.src = background.src;
    spaceship.img = new Image();
    spaceship.img.src = spaceship.src;
    warship1.img = new Image();
    warship1.img.src = warship1.src;
    warship2.img = new Image();
    warship2.img.src = warship2.src;
}

function draw() {
    ctx.drawImage(background.img, background.x, background.y, background.width, background.height);
    ctx.drawImage(warship1.img, warship1.x, warship1.y, warship1.width, warship1.height);
    ctx.drawImage(warship2.img, warship2.x, warship2.y, warship2.width, warship2.height);
    ctx.drawImage(spaceship.img, spaceship.x, spaceship.y, spaceship.width,  spaceship.height);
    
    requestAnimationFrame(draw)
}