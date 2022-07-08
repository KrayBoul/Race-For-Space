/*
Fortschritte
- Score wird mitgezählt
- Lasergeschosse werden abgeschossen und random neu generiert.
- Kollosion funktioniert bei Player mit Laser und Warship.
- 3 Leben eingefügt.


Probleme
JAVASCRIPT
- Die Laserstrahlen sollen mit den (gegnerischen) Warships kollodieren und explodieren. (explode.png)
- Grafiken sind wieder pixelig??? Stichwort "pixelated"

HTML/CSS
- Wie kann ich eine nicht standardmäßige Font verwenden? Ich hätte gerne "Press Start 2P" font; https://fonts.google.com/specimen/Press+Start+2P probiert.
*/

let score = 0;
let numrounds = 0;

const game = {
	resolution: { w:320, h:200 },
	objects: [],
	player: null,
	background: null,
	assets: {
		ship: class {
			x=0;
			y=0;
			width;
			height;
			img;
			src;
			dir='v';
			speed = 0;
			active = true;
			type;

			constructor (params) {
				this.height = params?.height;
				this.width = params?.width;
				this.x = params?.x;
				this.y = params?.y;
				this.dir = params?.dir;
				this.speed = params?.speed;
				this.src = params?.src;
				this.type = params?.type;

				console.log('created ship', this);
			}

			load () {
				if (this.src) {
					this.img = new Image();
					this.img.src = this.src;
				}
			}
		},

		laser: class {
			x=0;
			y=0;
			width;
			height;
			img;
			src;
			dir;
			speed;
			active = true;
			type;

			constructor (params) {
				this.height = params?.height;
				this.width = params?.width;
				this.x = params?.x;
				this.y = params?.y;
				this.dir = params?.dir;
				this.speed = params?.speed;
				this.src = params?.src;
				this.active = params?.active;
				this.type = params?.type || 'laser';
			}

			load () {
				if (this.src) {
					this.img = new Image();
					this.img.src = this.src;
				}
			}
		},
	}
} 

game.assets.screen = { // used for out-of-bounds detection
	'x': 0,
	'y': 0,
	'width': game.resolution.w,
	'height': game.resolution.h,
	'type': 'screen'
}

game.assets.playerShip = class extends game.assets.ship {
	constructor (params) {
		super(params);

		this.x = 145;
		this.y = 100;
		this.width = 20;
		this.height = 25;
		this.dir = 'vh';
		this.speed = 2;
		this.src = './Bilder/spaceship.png';
		this.type = 'player';

		super.load();
		console.log('created player ship');
	}

	move (direction, amount) {
		if (!direction || !amount) return;

		this[direction] = this[direction] + amount;
	}
}

game.assets.warship = class extends game.assets.ship {
	constructor(params) {
		super(params);

		this.x = params?.x;
		this.y = params?.y;
		this.dir = params?.dir || 'v';
		this.speed = params?.speed || 1;

		this.width = 150;
		this.height = 400;
		this.src = params?.src;
		this.type = 'warship';

		console.log('created warship', this);
	}
}

game.assets.effect = class extends game.assets.ship {
	constructor (params) {
		super(params);

		this.x = params?.x || 0;
		this.y = params?.y || 0;
		this.dir = params?.dir || 'v';
		this.speed = params?.speed || 1;

		this.width = params?.width || 32;
		this.height = params?.height || 32;
		this.src = params?.src || './Bilder/explosion.png';

		this.type = 'effect';
		this.active = params?.active || false;
		this.lifetime = params?.lifetime || 3;
		this.alive = true;

		super.load();
		console.log('created effect', this);

		setTimeout(function (self) {
			console.log('end effect', self);
			self.alive = false;
		}, this.lifetime*1000, this);
	}
}

// GET CANVAS FROM HTML
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext('2d');
ctx.canvas.width  = game.resolution.w;
ctx.canvas.height = game.resolution.h;


//Music
let audio = document.getElementById("audio");


// Sideship
let sideship = false;


// KEYS

// Key definition
let UP = false; // 38
let LEFT = false; // 37
let DOWN = false; // 40
let RIGHT = false; // 39


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
	startScreen.src = 'Bilder/startscreen.jpg';
	startScreen.onload = function(){
		ctx.drawImage(startScreen, 0, 0, game.resolution.w, game.resolution.h);
	};
}

const playButton = document.getElementById('start');

var isplaying = false;
var lives = 3;
var refreshLaserInterval1;
var refreshLaserInterval2;
var refreshLaserInterval3;
var refreshLaserInterval4;
var refreshIntervalWarShipLeft;
var refreshIntervalWarShipRight;
var refreshTimeout;

function startButtonPress () {
	isplaying? stopGame(): startGame();
};

function stopGame () {
	isplaying = false;

	playButton.textContent = "Start";
	// Pause audio
	audio.pause();
	// Dereference objects
	game.objects = [];
	game.background = null;
	game.player = null;
	// Set number of lives back to 3
	lives = 3;
	requestAnimationFrame(printScore);
};

// Prints the score
function printScore () {
	// Clear canvas
	var gameOver = new Image();
	gameOver.src = 'Bilder/gameover.jpg';
	gameOver.onload = function () {
		ctx.drawImage(gameOver, 0, 0, game.resolution.w, game.resolution.h);
	};
	// Set font attributes for score
	// Stop increasing score
	// clearInterval(refreshIntervalScore);
	// Stop bullets
	clearInterval(refreshLaserInterval1);
	clearInterval(refreshLaserInterval2);
	clearInterval(refreshLaserInterval3);
	clearInterval(refreshLaserInterval4);
	clearTimeout(refreshIntervalWarShipLeft);
	clearTimeout(refreshIntervalWarShipRight);
	clearTimeout(refreshTimeout);
	
}

function startGame () {
	score = 0;
	for(let i = 0; i < 3; i++){
		document.getElementById("heart" + String(i+1)).style.visibility = "visible";
	}
	document.getElementById("currentScore").innerHTML = score;
	playButton.textContent = "Stop";
	isplaying = true;
	numrounds = 0;

	// LaserInterval
   /* refreshLaserInterval1 = setInterval(function() {bullet = new game.assets.laser({
		x: 40,
		y: Math.random() * 100,
		width: 10,
		height: 3,
		speed: 1.5,
		dir: 'h',
		src: './Bilder/laser.png',
		active: true,
		type: false,
	});game.objects.push(bullet);bullet.load();}, 1000);

	refreshLaserInterval2 = setInterval(function() {bullet = new game.assets.laser({
		x: 270,
		y: Math.random() * 100,
		width: 10,
		height: 3,
		speed: -1.5,
		dir: 'h',
		src: './Bilder/laser.png',
		active: true,
		type: false,
	});game.objects.push(bullet);bullet.load();}, 1230);

	refreshLaserInterval3 = setInterval(function() {bullet = new game.assets.laser({
		x: 40,
		y: 100+Math.random() * 100,
		width: 10,
		height: 3,
		speed: 1.5,
		dir: 'h',
		src: './Bilder/laser.png',
		active: true,
		type: false,
	});game.objects.push(bullet);bullet.load();}, 1330);

	refreshLaserInterval4 = setInterval(function() {bullet = new game.assets.laser({
		x: 270,
		y: 100+Math.random() * 100,
		width: 10,
		height: 3,
		speed: -1.5,
		dir: 'h',
		src: './Bilder/laser.png',
		active: true,
		type: false,
	});game.objects.push(bullet);bullet.load();}, 1130); */
	

	game.background = new game.assets.ship({
		x: 0,
		y: 0,
		width: 320,
		height: 400,
		src: './Bilder/background_320x400.png',
		speed: 0.5,
		dir: 'v'
	});
	
	/*game.objects.push(new game.assets.warship({
		x: -100,
		y: -100,
		speed: 0.4,
		type: true,
		src: './Bilder/warship1.png',
	}));

	game.objects.push(new game.assets.warship({
		x: 270,
		y: -100,
		speed: 0.4,
		type: true,
		src: './Bilder/warship2.png',
	})); */

	refreshIntervalWarShipLeft = setTimeout(function () {
		warShipLeft = new game.assets.warship({
			x: -100,
			y: -400,
			speed: 0.4,
			dir: 'v',
			width: 14,
			height: 14,
			active: true,
			src: './Bilder/warship1.png',
		});
		warShipLeft.load();
		game.objects.push(warShipLeft);
		console.log('Created war ship on the left', warShipLeft);
	}, 4000);
	
	refreshIntervalWarShipRight = setTimeout(function() {
		warShipRight = new game.assets.warship({
			x: 270,
			y: -400,
			speed: 0.4,
			dir: 'v',
			width: 14,
			height: 14,
			active: true,
			src: './Bilder/warship2.png',
		});
		warShipRight.load();
		game.objects.push(warShipRight);
		console.log('Created war ship on the right', warShipRight);
	}, 5000);

	game.player = new game.assets.playerShip({
		width: 128,
		height: 256
	});

	refreshTimeout = setTimeout(createLaser, 4000);

	loadImages();
	draw();
}

function createLaser () {
	refreshLaserInterval1 = setInterval(function () {
		bullet = new game.assets.laser({
			x: 40,
			y: Math.random() * 100,
			width: 10,
			height: 3,
			speed: 1.5,
			dir: 'h',
			src: './Bilder/laser.png',
			active: true,
		});
		game.objects.push(bullet);
		bullet.load();
		playSound('laser');
	}, 1000);

	refreshLaserInterval2 = setInterval(function() {bullet = new game.assets.laser({
		x: 270,
		y: Math.random() * 100,
		width: 10,
		height: 3,
		speed: -1.5,
		dir: 'h',
		src: './Bilder/laser.png',
		active: true
	});game.objects.push(bullet);bullet.load();playSound('laser');}, 1230);

	refreshLaserInterval3 = setInterval(function() {bullet = new game.assets.laser({
		x: 40,
		y: 100+Math.random() * 100,
		width: 10,
		height: 3,
		speed: 1.5,
		dir: 'h',
		src: './Bilder/laser.png',
		active: true
	});game.objects.push(bullet);bullet.load();playSound('laser');}, 1330);

	refreshLaserInterval4 = setInterval(function() {bullet = new game.assets.laser({
		x: 270,
		y: 100+Math.random() * 100,
		width: 10,
		height: 3,
		speed: -1.5,
		dir: 'h',
		src: './Bilder/laser.png',
		active: true
	});game.objects.push(bullet);bullet.load();playSound('laser');}, 1130);
}


function update () {
	if (game.player) {
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
	}
	// DRAW

	// draw background
	game.background.y += game.background.speed;
	if (game.background.y > 0) {
		game.background.y = game.background.height/2*-1; // todo: werte anpassen, dass loop gut aussieht
		console.log('looped background image');
	}
	ctx.drawImage(game.background.img, game.background.x, game.background.y, game.background.width, game.background.height);

	// draw objects
	for (let i=0; i<game.objects.length; i++) {
		
		// remove expired effects
		if (game.objects[i].alive == false) {
			console.log('removed expired effect');
			game.objects.splice(i, 1);
			continue;
		}

		if (game.objects[i].dir == 'v') {
			game.objects[i].y += game.objects[i].speed;
		}
		if (game.objects[i].dir == 'h') {
			game.objects[i].x += game.objects[i].speed;
		}

		// check for out of bounds
		if (!intersect(game.assets.screen, game.objects[i])) {
			// detect out of bounds lasers
			if (game.objects[i].type == 'laser') {
				console.log('laser hat den screen verlassen', game.objects.length);
				game.objects.splice(i, 1);
				continue;
			}

			// remove out of bounds warships
			if (game.objects[i].type == 'warship') {
				console.log('warship oub', game.objects[i]);
				game.objects.splice(i, 1);
				continue;
			}
		} else {
			// draw
			if (!game.objects[i].active) {
				// inactive objects, eg effects?
			}
			
			ctx.drawImage(game.objects[i].img, game.objects[i].x, game.objects[i].y, game.objects[i].width, game.objects[i].height);
		}
	}

	// draw player
	if (game.player) {
		ctx.drawImage(game.player.img, game.player.x, game.player.y, game.player.width, game.player.height);
	}

	numrounds++;
	if(numrounds % 100 == 0 && numrounds > 1000) {
		
		if (game.player) { // only if player is alive
			score += 100;
			document.getElementById("currentScore").innerHTML = score;
		}
	}

	// Detect collision with laser
	detectCollision();
}

function intersect (a, b) {
	return (a.x <= (b.x+b.width) &&
		b.x <= (a.x+a.width) &&
		a.y <= (b.y+b.height) &&
		b.y <= (a.y+a.height))
}

function detectCollision () {
	for (let i = 0; i < game.objects.length; i++) {

		if (!game.player) continue; // skip if player is dead
		if (!game.objects[i].active) continue; // skip for effects and intangibles

		if (intersect(game.player, game.objects[i])) {
			
			console.log("Collided with " + game.objects[i].constructor.name, game.objects[i].type);


			if (game.objects[i].type == 'laser') {
				playSound('laser-hit');
				game.objects.splice(i, 1);
				die();
				continue;
			}

			if (game.objects[i].type == 'warship') {
				playSound('laser-hit');
				lives = 0;
				die();
				continue;
			}
		}
	}
}

function die () {
	if (!game.player) return;

	// Decrease live
	lives--;
	
	// Decrease hearts
	if (document.getElementById("heart" + String(lives+1))) {
		document.getElementById("heart" + String(lives+1)).style.visibility = "hidden";
	}

	if (lives < 1) {
		// player death
		setTimeout(function () {
			// end game after 4 seconds
			stopGame();
		}, 4000);

		const explosion = new game.assets.effect({
			x: game.player.x,
			y: game.player.y,
			width: 31,
			height: 27,
			src: './Bilder/fireball.gif',
			speed: 0.2,
			dir: 'v',
			active: false,
			lifetime: 0.8
		});
		explosion.load();
		game.objects.push(explosion);

		console.log('player died in a fireball');
		game.player = null;
	} else {
		// player hit
		const explosion = new game.assets.effect({
			x: game.player.x,
			y: game.player.y,
			width: 31,
			height: 27,
			src: './Bilder/explosion.png',
			speed: 0.2,
			dir: 'v',
			active: false,
			lifetime: 0.8
		});
		explosion.load();
		game.objects.push(explosion);
	}
}

//SOUND

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

function playSound (name) {
	const sound = new Howl({
		'src': ['./Sounds/'+name+'.mp3'],
		'volume': 0.2
	});
	sound.play();
}


// LOAD IMAGES

function loadImages () {

	Object.entries(game.objects).forEach(function ([key, value]) {
		game.objects[key].load();
		console.log('loaded', game.objects[key].src);
	});

	// game.playerShip.load();

	game.background.load();
}




function draw() {
	if(isplaying){
		update();
		requestAnimationFrame(draw);
	}    
}