// width and height of canvas
let WIDTH = 800;
let HEIGHT = 600;

// the width of every block
let SECTION = 20;

// the speed (milliseconds between the frames)
let SPEED = 125;

// how many segments the player starts with
let SEGMENTS = 5;

// creating global variables, where ever they needed
let canvas, ctx, keystate, runid, applecounter, bannanacounter, pause, cooldown;

// Key-Codes of used keys
let UpArrow=38, DownArrow=40, RightArrow=39, LeftArrow=37, WKey=87, SKey=83, AKey=65, DKey=68, ESC=27;

////////////////////////////// GAME

// all stuff about the player
let player = {
	// x position of player (*20 = pixels for canvas)
	x: null,
	// y position of player (*20 = pixels for canvas)
	y: null,
	// the velority (where the player looks to)
	// 4 = up | 3 = right | 2 = down | 1 = left
	vel: null,
	// count of elements added to snake
	addelement: 0,

	// array of all segments the player has
	segs: [],

	// function, executed every new frame (before draw function)
	update: function() {
		// if the "up" key or the "w" key pressed, and the player is not going down
		if(keystate[UpArrow] && this.vel != 2 || keystate[WKey] && this.vel != 2)
			// setting velority
			this.vel = 4;
		// if the "right" key or the "d" key pressed, and the player is not going left
		if(keystate[RightArrow] && this.vel != 1 || keystate[DKey] && this.vel != 1)
			// setting velority
			this.vel = 3;
		// if the "down" key or the "s" key pressed, and the player is not going up
		if(keystate[DownArrow] && this.vel != 4 || keystate[SKey] && this.vel != 4)
			// setting velority
			this.vel = 2;
		// if the "left" key or the "a" key pressed, and the player is not going right
		if(keystate[LeftArrow] && this.vel != 3 || keystate[AKey] && this.vel != 3)
			// setting velority
			this.vel = 1;

		// reset the array for all pressed keys
		keystate = {};

		// adding the acctual player position to segs array (in the end of the array)
		this.segs.unshift([player.x, player.y]);

		// if no segment is added this frame
		if(!this.addelement > 0) 
			// deleting last part of snake
			this.segs.pop();
		// if a segment is added this frame
		else
			// counting addelement down
			this.addelement--;

		// if the velority is 1 (left)
		if(this.vel == 1)
			// counting the player-x down
			player.x -= 1;
		// if the velority is 2 (down)
		if(this.vel == 2)
			// counting the player-y up
			player.y += 1;
		// if the velority is 3 (right)
		if(this.vel == 3)
			// counting the player-x up
			player.x += 1;
		// if the velority is 4 (up)
		if(this.vel == 4)
			// counting the player-y down
			player.y -= 1;

		// for every segment the player has
		for(var i=0; i<this.segs.length; i++) {
			// if it equals the player position the player loses
			if(this.segs[i][0] == player.x && this.segs[i][1] == player.y)
				// executing lose function
				lose();
		}

		// if the player hits upper or left rim
		if(this.x < 0 || this.y < 0)
			// executing lose function
			lose();
		// if the player hits right or bottom rim
		if(this.x > WIDTH/SECTION-1 || this.y > HEIGHT/SECTION-1)
			// executing lose function
			lose();
	},
	// function, executed every new frame (after update function)
	// draws the player to the canvas
	draw: function() {
		// setting color to darkgreen
		ctx.fillStyle = "#050";
		// drawing the snakes head
		ctx.fillRect(this.x*20, this.y*20, SECTION, SECTION);

		// setting color to lightgreen
		ctx.fillStyle = "#0F0";
		// for each segment the snake has
		for(var i=0; i<this.segs.length; i++) {
			// drawing the snake
			ctx.fillRect(this.segs[i][0]*20, this.segs[i][1]*20, SECTION, SECTION);
		}
	}
}

// all stuff about the random spawned food (apples)
let apples = {
	// list of all existing apples
	list: [],

	// function, executed every new frame (before draw function)
	update: function() {
		// for every existing apple (or deleted)
		for(var j=0; j<this.list.length; j++) {
			// if the apple has the same position as the player head (and if its not "undefined")
			if(this.list[j] != undefined && this.list[j][0] == player.x && this.list[j][1] == player.y) {
				// set this segment to "undefined"
				delete this.list[j];

				// say the script, that the player has one more segment
				player.addelement++;
				// counts score one up
				score.points++;
			}
		}
	},
	// function, executed every new frame (after update function)
	// draws the apples to the canvas
	draw: function() {
		// for every existing apple (or deleted)
		for(var i=0; i<this.list.length; i++) {
			// if this apple is not "undefined" (deleted)
			if(this.list[i] != undefined) {
				// setting color to lightred
				ctx.fillStyle = "#F00";
				// drawing the apple
				ctx.fillRect(this.list[i][0]*20, this.list[i][1]*20, SECTION, SECTION);
			}
		}
	}
};

// all stuff about the random spawned food (bannanas)
let bannanas = {
	// list of all existing bannanas
	list: [],

	// function, executed every new frame (before draw function)
	update: function() {
		// for every existing bannana (or deleted)
		for(let j=0; j<this.list.length; j++) {
			// if the bannana has the same position as the player head (and if its not "undefined")
			if(this.list[j] != undefined && this.list[j][0] == player.x && this.list[j][1] == player.y) {
				// set this segment to "undefined"
				delete this.list[j];

				// say the script, that the player has two more segments
				player.addelement += 2;
				// counts score two up
				score.points += 2;
			}
		}
	},
	// function, executed every new frame (after update function)
	// draws the bannanas to the canvas
	draw: function() {
		// for every existing bannana (or deleted)
		for(var i=0; i<this.list.length; i++) {
			// if this apple is not "undefined" (deleted)
			if(this.list[i] != undefined) {
				// setting color to yellow
				ctx.fillStyle = "#FF0";
				// drawing the bannana
				ctx.fillRect(this.list[i][0]*20, this.list[i][1]*20, SECTION, SECTION);
			}
		}
	}
};

// all stuff which has to do with the score
let score = {
	// amound of points the player has in the moment
	points: 0,

	// function, executed every new frame
	// draws the score to the canvas
	draw: function() {
		// setting color to white
		ctx.fillStyle = "#FFF";
		// setting font style to "20px Calibri"
		ctx.font = '20pt Calibri';

		// drawing the score on the canvas
		ctx.fillText("Score: " + this.points, 5, 20);
		// drawing the highscore on the canvas (which is saved in the "localStorage")
		ctx.fillText("Highscore: " + localStorage.getItem("highscore"), WIDTH-175, 20);
	},
	// function, executed if the player dies.
	// if the score of this round is a highscore, the highscore get saved.
	setHighscore: function() {
		// if there is no highscore now
		if(localStorage.getItem("highscore") == null)
			// setting highscore to 0
			localStorage.setItem("highscore", 0);
		// if this game was a highscore
		if(this.points > localStorage.getItem("highscore"))
			// setting new highscore
			localStorage.setItem("highscore", this.points);
	}
};

// main function, does all the control stuff. mother of all coming functions
function main() {
	// creates the canvas
	canvas = document.createElement("canvas");
	// set it's width
	canvas.width = WIDTH;
	// set it's height
	canvas.height = HEIGHT;
	// getting the ctx from canvas (to make editing possible)
	ctx = canvas.getContext("2d");
	// adding canvas to html-body
	document.body.appendChild(canvas);

	// running init function
	init();

	// if a key is pressed down
	document.addEventListener("keydown", function(evt) {
		// saving all pressed keys in keystate-array
		keystate[evt.keyCode] = true;
	});

	// function, executed every frame
	var loop = function() {
		// if there is a cooldown for pause-menu
		if(cooldown > 0)
			// counting cooldown one down
			cooldown--;

		// if ESC pressed and there is no cooldown
		if(keystate[ESC] && cooldown <= 0) {
			// reseting all pressed keys
			keystate = {};

			// if pause, continueing game
			if(pause) {
				// setting pause to false
				pause = false;
				// adding cooldown for pause menu
				cooldown = 3;
			// if game is running (not in pause menu)
			} else {
				// setting pause to true
				pause = true;
				// adding cooldown for pause menu
				cooldown = 3;
			}
		}

		// if game is running (no pause)
		if(!pause) {
			// updating everything
			update();
			// drawing everything to canvas
			draw();

			// every 25 frame spawning an apple
			if(applecounter > 25) {
				spawanfood("apple");
				// reseting counter
				applecounter = 0;
			}
			// every 50 frame spawning an banana
			if(bannanacounter > 50) {
				spawanfood("banana");
				// reseting counter
				bannanacounter = 0;
			}

			// counting counter one up
			applecounter++;
			bannanacounter++;
		// if game not running (pause)
		} else {
			// draw to canvas
			draw();

			// adding an "PAUSE" to canvas (in the middle)

			// setting color to red
			ctx.fillStyle = "#F00";
			// setting font to "60px Calibri"
			ctx.font = '60pt Calibri';
			// drawing text to canvas
			ctx.fillText("PAUSE", WIDTH/2-100, HEIGHT/2);
		}
	}
	// setting interval for loop function (saving interval id to "runid")
	runid = setInterval(loop, SPEED);
}

// this function initinates the game
// setting all standard values and so on
function init() {
	// creating variable which saves all pressed keys
	keystate = {};

	// setting applecounter and bananacounter to standard values
	applecounter = 0;
	bannanacounter = 0

	// disable the pause menu
	pause = false;

	// disable cooldown
	cooldown = 0;

	// setting players position somewere in the middle
	player.x = WIDTH / SECTION / 2;
	player.y = HEIGHT / SECTION / 2;

	// player starts going to the right
	player.vel = 3;

	// for every segment the player starts with
	for(let i=1; i<SEGMENTS+1; i++) {
		// adding segment to list
		player.segs.push([player.x-i, player.y]);
	}
}

// this function updates everything every new frame
function update() {
	player.update();
	apples.update();
	bannanas.update();		
}

// this function draws everything to the canvas (every new frame)
function draw() {
	// if the game is running
	if(runid) {
		// setting color to black
		ctx.fillStyle = "#000";
		// drawing the background
		ctx.fillRect(0, 0, WIDTH, HEIGHT);

		// run all draw functions
		player.draw();
		apples.draw();
		bannanas.draw();
		score.draw();
	}
}

// spawns new food at random position
function spawanfood(what) {
	// creates new random position
	let getPosition = function() {
		// creates random x
		var xpos = Math.floor(Math.random() * WIDTH / SECTION);
		// creates random y
		var ypos = Math.floor(Math.random() * HEIGHT / SECTION);

		// returning both as array
		return [xpos, ypos];
	}

	// helperfunction, does the rest
	let insertFood = function() {
		// setting run to true
		let run = true;
		// getting new position
		let pos = getPosition();

		// for every segment of the snake
		for(let i=0; i<player.segs.length; i++) {
			// if this position is occupied, don't run
			if(pos[0] == player.segs[i][0] && pos[1] == player.segs[i][0])
				run = false;
		}
		// for every existing apple (or deleted)
		for(let i=0; i<apples.list.length; i++) {
			// if this position is occupied, don't run
			if(apples.list[i] != undefined && pos[0] == apples.list[i][0] && pos[1] == apples.list[i][0])
				run = false;
		}
		// for every existing banana (or deleted)
		for(let i=0; i<bannanas.list.length; i++) {
			// if this position is occupied, don't run
			if(bannanas.list[i] != undefined && pos[0] == bannanas.list[i][0] && pos[1] == bannanas.list[i][0])
				run = false;
		}

		// if everything gone well
		if(run) {
			// spawn ether apple or banana
			if(what=="apple")
				apples.list.push([pos[0], pos[1]]);
			if(what=="banana")
				bannanas.list.push([pos[0], pos[1]]);
		// if this position is occupied, try again
		} else
			insertFood();
	}
	// running helperfunction
	insertFood();
}

// function, executed if the player loses
function lose() {
	// clearing interval for loop function
	clearInterval(runid);
	// disable run (don't draw this frame)
	runid = false;

	// setting color to red
	ctx.fillStyle = "#F00";
	// setting font to "60px Calibri"
	ctx.font = '60pt Calibri';
	// drawing text
	ctx.fillText("Verloren", WIDTH/2-160, HEIGHT/2);
	
	// if this was a highscore, save it
	score.setHighscore();
}
/* Vens Funktions Button*/
function start(){
if (lose) {
	window.location.reload();
}
}

// running that all
main();
