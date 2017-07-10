// -----------
// DEFINITIONS
// -----------

var canvas = document.querySelector('canvas');
		canvas.width = document.body.clientWidth * 2;
		canvas.height = document.body.clientHeight * 2;
var context = canvas.getContext('2d');

var fireworkCount = 1;
var fireworks = [];
var gravity = new vec2(0, 0.2);



// --------------------
// Particle constructor
// --------------------

function Particle(x, y, firework) {
	this.position = new vec2(x, y);
	this.lifespan = 100;
	this.radius = (firework) ? 10 : 5;
	if(firework) {
		this.velocity = new vec2(0, Math.random() * (-20 - -10) + -10);
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

function Firework(x, y, firework) {
	this.firework = new Particle(x, y, firework);
	this.exploded = false;
	this.particles = [];

	this.update = function() {
		if(!this.exploded) {
			this.firework.update();
			this.firework.applyForce(gravity);

			if(this.firework.velocity.y > 0) {
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

//
// for(var i = 0; i < fireworkCount; i++) {
// 	fireworks.push(new Firework(Math.random() * canvas.width - 5, canvas.height - 10, true)); // -5 is half the radius of the particle
// }



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

	if(Math.random() < 0.1) {
		fireworks.push(new Firework(Math.random() * canvas.width - 10, canvas.height + 10, true)); // -5 is half the radius of the particle
		console.log(fireworks.length);
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
	canvas.width = document.body.clientWidth * 2;
	canvas.height = document.body.clientHeight * 2;
});
