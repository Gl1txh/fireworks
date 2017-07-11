// -----------
// DEFINITIONS
// -----------

var canvas = document.querySelector('canvas');
		canvas.width = document.body.clientWidth * 2;
		canvas.height = document.body.clientHeight * 2;
var context = canvas.getContext('2d');

var fireworks = [];
var gravity = new vec2(0, 0.2);



// --------------
// Setup triggers
// --------------

var triggers = {};
var triggerInfo = [
	// id, velocity, lifespan
	['#trigger-hat-left', {x: -10, y: -6}, 80],
	['#trigger-hat-right', {x: 10, y: -6}, 80],
	['#trigger-top-left', {x: -10, y: -6}, 130],
	['#trigger-top-right', {x: 10, y: -6}, 130],
	['#trigger-middle-left', {x: -10, y: -2}, 200],
	['#trigger-middle-right', {x: 10, y: -2}, 200],
	['#trigger-bottom-left', {x: -10, y: 2}, 130],
	['#trigger-bottom-right', {x: 10, y: 2}, 130]
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
	for(var i = 0; i < arguments.length; i++) {
		var y = triggers[triggerInfo[arguments[i]]].top;
		var x = triggers[triggerInfo[arguments[i]]].left;
		var velocity = triggers[triggerInfo[arguments[i]]].velocity;
		var lifespan = triggers[triggerInfo[arguments[i]]].lifespan;

		fireworks.push(new Firework(x, y, velocity, lifespan, true)); // -5 is half the radius of the particle
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

function Particle(x, y, velocity, firework) {
	this.position = new vec2(x, y);
	this.lifespan = 100;
	this.radius = (firework) ? 10 : 5;
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
		if(!firework) {
			context.strokeStyle = 'rgba(140,140,140, ' + this.lifespan / 100 + ')';
		} else {
			context.strokeStyle = 'rgba(0,0,0, 1)';
		}
		context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2, false);
		context.stroke();
	};
}



// --------------------
// Firework constructor
// --------------------

function Firework(x, y, velocity, lifespan, firework) {
	this.firework = new Particle(x, y, velocity, firework);
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
		for(var i = 10; i >= 0; i--) {
			var particle = new Particle(this.firework.position.x, this.firework.position.y);

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
		triggers[triggerInfo[i]] = new Trigger(triggerInfo[i][0], triggerInfo[i][1]);
	}
});
