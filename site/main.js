// -----------
// DEFINITIONS
// -----------

var canvas = document.querySelector('canvas');
		canvas.width = document.body.clientWidth * 2;
		canvas.height = document.body.clientHeight * 2;
var context = canvas.getContext('2d');

var fireworks = [];
var colors = ['253,0,0', '0,113,253', '1,149,1', '226,42,220'];
var gravity = new vec2(0, 0.1);



// --------------
// Setup triggers
// --------------

var triggers = {};
var triggerInfo = [
	// id, velocity, lifespan
	['#trigger-hat-left', {x: -5, y: -3}, 160],
	['#trigger-hat-right', {x: 5, y: -3}, 160],
	['#trigger-top-left', {x: -5, y: -4}, 220],
	['#trigger-top-right', {x: 5, y: -4}, 220],
	['#trigger-middle-left', {x: -8, y: -2}, 250],
	['#trigger-middle-right', {x: 8, y: -2}, 250],
	['#trigger-bottom-left', {x: -5, y: 1}, 220],
	['#trigger-bottom-right', {x: 5, y: 1}, 220]
];

function Trigger(id, velocity, lifespan) {
	this.element = document.querySelector(id);
	this.info = this.element.getBoundingClientRect();
	this.top = this.info.top * 2;
	this.left = this.info.left * 2;
	this.active = false;
	this.velocity = velocity;
	this.lifespan = lifespan;
}

for(var i = 0; i < triggerInfo.length; i++) {
	triggers[triggerInfo[i]] = new Trigger(triggerInfo[i][0], triggerInfo[i][1], triggerInfo[i][2]);
}



// -------------
// Key listeners
// -------------

function triggerFireworks() {
	// The commented below will get you a random color
	// var color = (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256));
	var color = colors[Math.floor(Math.random() * colors.length)];;

	for(var i = 0; i < arguments.length; i++) {
		var y = triggers[triggerInfo[arguments[i]]].top;
		var x = triggers[triggerInfo[arguments[i]]].left;
		var velocity = triggers[triggerInfo[arguments[i]]].velocity;
		var lifespan = triggers[triggerInfo[arguments[i]]].lifespan;

		fireworks.push(new Firework(x, y, velocity, lifespan, color, true)); // -5 is half the radius of the particle
	}
}

function onKeyDown(evt) {
	var key = evt.keyCode;
	switch (key) {
		case 65:
			triggerFireworks(0, 1);
			break;
		case 83:
			triggerFireworks(2, 3);
			break;
		case 68:
			triggerFireworks(4, 5);
			break;
		case 70:
			triggerFireworks(6, 7);
			break;
	}
}

document.addEventListener("keyup", onKeyDown);


// --------------------
// Particle constructor
// --------------------

function Particle(x, y, velocity, color, firework) {
	this.position = new vec2(x, y);
	this.lifespan = 100;
	this.radius = (firework) ? 3 : 1;
	if(firework) {
		var temp = new vec2();
		this.velocity = new vec2();
		this.velocity.add(velocity);
	} else {
		this.velocity = new vec2(
			Math.random() * (10 - -10) + -10,
			Math.random() * (10 - -10) + -10
		);
	}
	this.acceleration = new vec2(0, 0);

	this.applyForce = function(force) {
		this.acceleration.add(force);
	};

	this.update = function() {
		this.velocity.add(this.acceleration);
		this.position.add(this.velocity);
		this.acceleration.mult(0);
		this.lifespan -= 2;
	};

	this.done = function() {
		if(this.lifespan < 0) {
			return true;
		}

		return false;
	}

	this.render = function() {
		context.beginPath();
		if(!color) {
			context.strokeStyle = 'rgba(' + color + ', 1)';
		} else {
			context.strokeStyle = 'rgba(' + color + ', ' + this.lifespan / 100 + ')';
		}
		context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2, false);
		context.stroke();
	};
}



// --------------------
// Firework constructor
// --------------------

function Firework(x, y, velocity, lifespan, color, firework) {
	this.firework = new Particle(x, y, velocity, color, firework);
	this.exploded = false;
	this.particles = [];
	this.lifespan = lifespan;

	this.update = function() {
		if(!this.exploded) {
			this.firework.update();
			this.firework.applyForce(gravity);
			this.lifespan -= 5;

			if(this.lifespan < 0) {
				this.exploded = true;
				this.explode();
			}
		}

		for(var i = this.particles.length - 1; i >= 0; i--) {
			this.particles[i].update();
			this.particles[i].applyForce(gravity);
			this.particles[i].velocity.mult(0.95);
			if(this.particles[i].done()) {
				this.particles.splice(i, 1);
			}
		}
	};

	this.explode = function() {
		for(var i = 20; i >= 0; i--) {
			var particle = new Particle(this.firework.position.x, this.firework.position.y, null, color, false);

			this.particles.push(particle);
		}
	};

	this.done = function() {
		if(this.exploded && this.particles.length === 0) {
			return true;
		}

		return false;
	}

	this.render = function() {
		if(!this.exploded) {
			this.firework.render();
		}

		for(var i = this.particles.length - 1; i >= 0 ; i--) {
			this.particles[i].render();
		}
	};
}



// ------------
// Update state
// ------------

function update() {
	// Update
	for(var i = fireworks.length - 1; i >= 0; i--) {
		fireworks[i].update();

		if(fireworks[i].done()) {
			fireworks.splice(i, 1);
		}
	}

	// Render
	render();
}



// ------
// Render
// ------

function render() {

	// Clear
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.strokeStyle = '#303b50';
	context.lineWidth = 2;

	// Draw
	for(var i = 0; i < fireworks.length; i++) {
		fireworks[i].render();
	}

	// Loop
	requestAnimationFrame(update);

}


// Start the animation
requestAnimationFrame(update);



// -------------
// Window resize
// -------------

window.addEventListener('resize', function() {

	// Update the canvas size
	canvas.width = document.body.clientWidth * 2;
	canvas.height = document.body.clientHeight * 2;

	// Update the trigger position
	triggers = {};
	for(var i = 0; i < triggerInfo.length; i++) {
		triggers[triggerInfo[i]] = new Trigger(triggerInfo[i][0], triggerInfo[i][1], triggerInfo[i][2]);
	}
});
