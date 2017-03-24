// main.js
// Dependencies: 
// Description: singleton object
// This object will be our main "controller" class and will contain references
// to most of the other objects in the game.

"use strict";

// if app exists use the existing copy
// else create a new object literal
var app = app || {};

/*
 .main is an object literal that is a property of the app global
 This object literal has its own properties and methods (functions)
 
 */
app.main = {
	//  properties
    WIDTH : 640, 
    HEIGHT: 480,
    gameState: undefined,
    roundScore: 0,
    totalScore: 0,
    CIRCLE: Object.freeze({
    	NUM_CIRCLES_START: 5,
    	NUM_CIRCLES_END: 20,
    	START_RADIUS: 8,
    	MAX_RADIUS: 45,
    	MIN_RADIUS: 2,
    	MAX_LIFETIME: 2.5,
    	MAX_SPEED: 80,
    	EXPLOSION_SPEED: 60,
    	IMPLOSION_SPEED: 84,
    }),
    checkForCollisions: function() {
    	// TODO
    },
    canvas: undefined,
    ctx: undefined,
   	lastTime: 0, // used by calculateDeltaTime() 
    debug: true,
    NUM_CIRCLES_START: 5,
    START_RADIUS: 8, //starting circle radius
    MAX_SPEED: 80, //pixels per sec
    CIRCLE_STATE: Object.freeze({ // fake enumeration, actually an object literal
    	NORMAL: 0,
    	EXPLODING: 1,
    	MAX_SIZE: 2, 
    	IMPLODING: 3,
    	DONE: 4
    }),
    circles: [], //syntax declares a new array
    numCircles: this.NUM_CIRCLES_START,

    drawCircles: function(ctx) {
    	if(this.gameState == this.GAME_STATE.ROUND_OVER) this.ctx.globalAlpha = 0.25;
    	for(var i=0;i<this.circles.length; i++) {
    		var c = this.circles[i];
    		if(c.state === this.CIRCLE_STATE.DONE) continue;
    		c.draw(ctx);
    	}
    },

    moveCircles: function(dt) {
    	for(var i=0;i<this.circles.length;i++) {
    		var c = this.circles[i];
    		if(c.state === this.CIRCLE_STATE.DONE) continue;
    		if(c.state === this.CIRCLE_STATE.EXPLODING) {
    			c.radius += this.CIRCLE.EXPLOSION_SPEED * dt;
    			if(c.radius >= this.CIRCLE.MAX_RADIUS){
    				c.state = this.CIRCLE_STATE.MAX_SIZE;
    				console.log("circle #" + i + " hit CIRCLE.MAX_RADIUS");

    			}
    			continue;
    		}

    		if(c.state === this.CIRCLE_STATE.MAX_SIZE){
    			c.lifetime += dt; //lifetime is in sec
    			if(c.lifetime >= this.CIRCLE.MAX_LIFETIME){
    				c.state = this.CIRCLE_STATE.IMPLODING;
    				console.log("circle #" + i + " hit CIRCLE.MAX_LIFETIME");
    			}
    			continue;
    		}

    		if(c.state === this.CIRCLE_STATE.IMPLODING) {
    			c.radius -= this.CIRCLE.IMPLOSION_SPEED * dt;
    			if(c.radius <= this.CIRCLE.MIN_RADIUS) {
    				console.log("circle #" + i + " hit CIRCLE.MIN_RADIUS and is gone");
    				c.state = this.CIRCLE_STATE.DONE;
    				continue;
    			}
    		}

    		// move circles
    		c.move(dt);

    		// make circles bounce
    		if(this.circleHitLeftRight(c)) c.xSpeed *= -1;
    		if(this.circleHitTopBottom(c)) c.ySpeed *= -1;
    	} // end loop
    },

    paused: false,

    drawPauseScreen: function(ctx) {
    	ctx.save();
    	ctx.fillStyle = "black";
    	ctx.fillRect(0,0,this.WIDTH,this.HEIGHT);
    	ctx.textAlign = "center";
    	ctx.textBaseline = "middle";
    	this.fillText("...PAUSED...", this.WIDTH/2, this.HEIGHT/2, "40pt courier", "white");
    	ctx.restore();
    },

    animationID: 0,

    GAME_STATE: Object.freeze({ // another fake enum
    	BEGIN: 0,
    	DEFAULT: 1,
    	EXPLODING: 2,
    	ROUND_OVER: 3,
    	REPEAT_LEVEL: 4,
    	END: 5,
    }),


    // init circle properties
    // x: 100, 
    // y:100, 
    // radius: 40, 
    // xSpeed: 200, //pixels per sec
    // ySpeed: 160, //picels per sec
    // fillStyle: "red",
    
    // helper methods
    circleHitLeftRight: function(c) {
    	if (c.x <= c.radius || c.x >= this.WIDTH - c.radius) {
    		return true;
    	}
    },

    circleHitTopBottom: function(c) {
    	if(c.y < c.radius || c.y > this.HEIGHT - c.radius) {
    		return true;
    	}
    },

    //Part VI - 1A

	drawHUD: function(ctx){
		ctx.save(); // NEW
		// draw score
      	// fillText(string, x, y, css, color)
		this.fillText("This Round: " + this.roundScore + " of " + this.numCircles, 20, 20, "14pt courier", "#ddd");
		this.fillText("Total Score: " + this.totalScore, this.WIDTH - 200, 20, "14pt courier", "#ddd");

		// NEW
		if(this.gameState == this.GAME_STATE.BEGIN){
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			this.fillText("To begin, click a circle", this.WIDTH/2, this.HEIGHT/2, "30pt courier", "white");
		} // end if
	
		// NEW
		if(this.gameState == this.GAME_STATE.ROUND_OVER){
			ctx.save();
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			this.fillText("Round Over", this.WIDTH/2, this.HEIGHT/2 - 40, "30pt courier", "red");
			this.fillText("Click to continue", this.WIDTH/2, this.HEIGHT/2, "30pt courier", "red");
			this.fillText("Next round there are " + (this.numCircles + 5) + " circles", this.WIDTH/2 , this.HEIGHT/2 + 35, "20pt courier", "#ddd");
		} // end if
		
		ctx.restore(); // NEW
	},
	

    // methods
	init : function() {
		console.log("app.main.init() called");
		// initialize properties
		this.canvas = document.querySelector('canvas');
		this.canvas.width = this.WIDTH;
		this.canvas.height = this.HEIGHT;
		this.ctx = this.canvas.getContext('2d');

		this.numCircles = this.CIRCLE.NUM_CIRCLES_START;
		this.circles = this.makeCircles(this.numCircles);
		console.log("this.circles = " +this.circles);
		// initialize game state
		this.gameState = this.GAME_STATE.BEGIN;
		//hook up events 
		this.canvas.onmousedown = this.doMousedown;
		
		
		// load level
		this.reset();

		// start the game loop
		this.update();
	},

	reset: function() {
		// creates a new level of circles
		this.numCircles += 5;
		this.roundScore = 0;
		this.circles = this.makeCircles(this.numCircles);
	},

	doMousedown: function(e) {
		var main = app.main;

		if(main.paused) {
			main.paused = false;
			main.update();
			return;
		};

		// only click one circle
		if(main.gameState == main.GAME_STATE.EXPLODING) return;

		// if round is over reset and add 5 circles
		if(main.gameState == main.GAME_STATE.ROUND_OVER){
			main.gameState = main.GAME_STATE.DEFAULT;
			main.reset();
			return;
		}

		console.log("e=" + e);
		console.log("e.target=" + e.target);
		console.log("this=" + this);
		console.log("e.pageX=" + e.pageX);
		console.log("e.pageY=" + e.pageY);
		var mouse = getMouse(e);
		app.main.checkCircleClicked(mouse);
		console.log("(mouse.x,mouse.y)=" + mouse.x + "," +mouse.y);
	},
	// returns mouse position in local coordinate system of element
	getMouse: function(e){
		var mouse = {} // make an object
		mouse.x = e.pageX - e.target.offsetLeft;
		mouse.y = e.pageY - e.target.offsetTop;
		return mouse;
	},

	checkCircleClicked: function(mouse) {
		// looping through circle backwards why?
		for (var i = this.circles.length -1; i>=0; i--){
			var c = this.circles[i];
			if (pointInsideCircle(mouse.x, mouse.y, c)) {
				c.fillStyle = "red";
				c.xSpeed = c.ySpeed = 0;
				c.state = this.CIRCLE_STATE.EXPLODING;
				this.gameState = this.GAME_STATE.EXPLODING;
				this.roundScore ++;
				break; // we wanna click on only one circle
			}
		}
	},
	
	update: function(){
		// 1) LOOP
		// schedule a call to update()
	 	this.animationID = requestAnimationFrame(this.update.bind(this));
	 	
	 	// 2) PAUSED?
	 	// if so, bail out of loop
	 	if(this.paused) {
	 		this.drawPauseScreen(this.ctx);
	 		return;
	 	}
	 	
	 	// 3) HOW MUCH TIME HAS GONE BY?
	 	var dt = this.calculateDeltaTime();
	 	 
	 	// 4) UPDATE
	 	// move circles
	 	// this.x += this.xSpeed * dt; //pixels per sec * approx 1/60
	 	// this.y += this.ySpeed * dt;
	 	this.moveCircles(dt);

	 	// collision check
	 	this.checkForCollisions();

	 	// did the circle leave the screen? bounce
	 	// if(this.circleHitLeftRight(this.x, this.y, this.radius)) {
	 	// 	this.xSpeed *= -1;
	 	// }	 

	 	// if(this.circleHitTopBottom(this.x, this.y, this.radius)) {
	 	// 	this.ySpeed *= -1;
	 	// }
	 	
		// 5) DRAW	
		// i) draw background
		this.ctx.fillStyle = "black"; 
		this.ctx.fillRect(0,0,this.WIDTH,this.HEIGHT); 
	
		// ii) draw circles
		// this.ctx.beginPath();
		// this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
		// this.ctx.closePath();
		// this.ctx.fillStyle = this.fillStyle;
		// this.ctx.fill();
		this.ctx.globalAlpha = .9; //new
		this.drawCircles(this.ctx);
	
		// iii) draw HUD
		this.ctx.globalAlpha = 1.0;
		this.drawHUD(this.ctx);
		
		// iv) draw debug info
		if (this.debug){
			// draw dt in bottom right corner
			this.fillText("dt: " + dt.toFixed(3), this.WIDTH - 150, this.HEIGHT - 10, "18pt courier", "white");
		}
		
	},

	// Part IV #1B
	checkForCollisions: function(){
		if(this.gameState == this.GAME_STATE.EXPLODING){
			// check for collisions between circles
			for(var i=0;i<this.circles.length; i++){
				var c1 = this.circles[i];
				// only check for collisions if c1 is exploding
				if (c1.state === this.CIRCLE_STATE.NORMAL) continue;   
				if (c1.state === this.CIRCLE_STATE.DONE) continue;
				for(var j=0;j<this.circles.length; j++){
					var c2 = this.circles[j];
				// don't check for collisions if c2 is the same circle
					if (c1 === c2) continue; 
				// don't check for collisions if c2 is already exploding 
					if (c2.state != this.CIRCLE_STATE.NORMAL ) continue;  
					if (c2.state === this.CIRCLE_STATE.DONE) continue;
				
					// Now you finally can check for a collision
					if(circlesIntersect(c1,c2) ){
						c2.state = this.CIRCLE_STATE.EXPLODING;
						c2.xSpeed = c2.ySpeed = 0;
						this.roundScore ++;
					}
				}
			} // end for
			
			// round over?
			var isOver = true;
			for(var i=0;i<this.circles.length; i++){
				var c = this.circles[i];
				if(c.state != this.CIRCLE_STATE.NORMAL && c.state != this.CIRCLE_STATE.DONE){
				 isOver = false;
				 break;
				}
			} // end for
		
			if(isOver){
				this.gameState = this.GAME_STATE.ROUND_OVER;
				this.totalScore += this.roundScore;
			 }
				
		} // end if GAME_STATE_EXPLODING
	},
	
	fillText: function(string, x, y, css, color) {
		this.ctx.save();
		// https://developer.mozilla.org/en-US/docs/Web/CSS/font
		this.ctx.font = css;
		this.ctx.fillStyle = color;
		this.ctx.fillText(string, x, y);
		this.ctx.restore();
	},
	
	calculateDeltaTime: function(){
		var now,fps;
		now = performance.now(); 
		fps = 1000 / (now - this.lastTime);
		fps = clamp(fps, 12, 60);
		this.lastTime = now; 
		return 1/fps;
	},
	
	makeCircles: function(num) {

		var circleMove = function(dt) {
			this.x += this.xSpeed * this.speed *dt;
			this.y += this.ySpeed * this.speed *dt;

		};

		var circleDraw = function(ctx) {
			// draw circle
			ctx.save();
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
			ctx.closePath();
			ctx.fillStyle = this.fillStyle;
			ctx.fill();
			ctx.restore();
		};

		var array = [];
		//debugger;
		for(var i=0; i<num; i++) {
			// make a new obj literal
			var c = {};

		

		// add x. and .y properties
		// .x and .y are somewhere on the canvas with a min margin of start radius
		// getRandom() is from utilities.js
		c.x = getRandom(this.CIRCLE.START_RADIUS * 2, this.WIDTH -this.CIRCLE.START_RADIUS *2);
		c.y = getRandom(this.CIRCLE.START_RADIUS * 2, this.HEIGHT - this.CIRCLE.START_RADIUS*2);

		// add a radius property
		c.radius = this.CIRCLE.START_RADIUS;

		// getRandomUnitVector() is from utilities.js
		var randomVector = getRandomUnitVector();
		c.xSpeed = randomVector.x;
		c.ySpeed = randomVector.y;

		// make more properties
		c.speed = this.CIRCLE.MAX_SPEED;
		c.fillStyle = getRandomColor();
		c.state = this.CIRCLE_STATE.NORMAL;
		c.lifetime = 0;

		c.draw = circleDraw;

		c.move = circleMove;

		// no more properties are allowed to be added
		Object.seal(c);
		array.push(c);
	}
	return array;
},
    
    
}; // end app.main