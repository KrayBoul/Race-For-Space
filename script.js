
    let Key_W = false; // 87
    let Key_A = false; // 65
    let KEY_S = false; // 83
    let KEY_D = false; // 68
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

    document.onkeydown = function(e) {
        if (e.keyCode == 87) { // Taste gedrückt
            KEY_W = true;
        }
        if (e.keyCode == 65) { // Taste gedrückt
            KEY_A = true;
        }
        if (e.keyCode == 83) { // Taste gedrückt
            KEY_S = true;
        }
        if (e.keyCode == 68) { // Taste gedrückt
            KEY_D = true;
        }
    }

    document.onkeyup = function(e) {
        if (e.keyCode == 87) { // Taste losgelassen
            KEY_W = false;
        }
        if (e.keyCode == 65) { // Taste losgelassen
            KEY_A = false;
        }
        if (e.keyCode == 83) { // Taste losgelassen
            KEY_S = false;
        }
        if (e.keyCode == 68) { // Taste losgelassen
            KEY_D = false;
        }
    }

    function startGame() {
        canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d');
        loadImages();
        setInterval(update, 1000 / 25);
        draw(); // calculate
    }

    function update() {
        if (KEY_D) {
            spaceship.x -= 2;
        }

        if (KEY_D) {
            spaceship.x += 2;
        }
    }


    function loadImages () {
        backgroundImage.src = 'Bilder/background.jpg';
        spaceship.img = new Image();
        spaceship.img.src = spaceship.src;
    }

    function draw() {
        ctx.drawImage(backgroundImage, 0, 0);
        ctx.drawImage(spaceship.img, spaceship.x, spaceship.y, spaceship.width,  spaceship.height);
        
        requestAnimationFrame(draw)
    }

    // console.log('1');