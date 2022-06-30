
// Key definition
let W = false; // 87
let A = false; // 65
let S = false; // 83
let D = false; // 68
let canvas;
let ctx;
let backgroundImage = new Image();


let spaceship = {
    x: 135,
    y: 100,
    width: 35,
    height: 35,
    src:'Bilder/spaceship.png'
}

let warship1 = {
    x: -90,
    y: -100,
    width: 150,
    height: 400,
    src:'Bilder/warship1.png'
}

let warship2 = {
    x: 240,
    y: -100,
    width: 150,
    height: 400,
    src:'Bilder/warship2.png'
}

// Keys pressed
window.onkeydown = function(e) {
    if (e.keyCode == 87) { 
        W = true;
    }
    if (e.keyCode == 65) { 
        A = true;
    }
    if (e.keyCode == 83) { 
        S = true;
    }
    if (e.keyCode == 68) { 
        D = true;
    }
}

// Keys not pressed
window.onkeyup = function(e) {
    if (e.keyCode == 87) { 
        W = false;
    }
    if (e.keyCode == 65) { 
        A = false;
    }
    if (e.keyCode == 83) { 
        S = false;
    }
    if (e.keyCode == 68) { 
        D = false;
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
    if (D) {
        spaceship.x -= 2;
    }

    if (D) {
        spaceship.x += 2;
    }
}


function loadImages () {
    backgroundImage.src = 'Bilder/background.jpg';
    spaceship.img = new Image();
    spaceship.img.src = spaceship.src;
    warship1.img = new Image();
    warship1.img.src = warship1.src;
    warship2.img = new Image();
    warship2.img.src = warship2.src;
}

function draw() {
    ctx.drawImage(backgroundImage, 0, 0);
    ctx.drawImage(warship1.img, warship1.x, warship1.y, warship1.width, warship1.height);
    ctx.drawImage(warship2.img, warship2.x, warship2.y, warship2.width, warship2.height);
    ctx.drawImage(spaceship.img, spaceship.x, spaceship.y, spaceship.width,  spaceship.height);
    
    requestAnimationFrame(draw)
}